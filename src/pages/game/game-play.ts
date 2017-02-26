/**
 * Created by Joshua Jackson on 18-Feb-17.
 */

import PubNub from 'pubnub';
import { Tools } from '../../tools/general-tools';
import { Deck } from '../../data-classes/deck';
import { Card } from '../../data-classes/card';
import { CardSubmission } from '../../data-classes/card-submission';
import { Player } from '../../data-classes/player';
import { PubNubMsg } from '../../data-classes/pubnub-msg';
import {IGameRenderer} from "./i-game-renderer";
//import { GamePage } from "./game";

// ======================================================================
// This Class contains the gamestate and methods to modify/play the game
// ======================================================================
export class GamePlay {
  // constants
  CHANNEL: string;                // The channel used will NOT change during gameplay
  SUBKEY: string;                 // The subscription key user will NOT change during gameplay
  PUBKEY: string;                 // The publish key user will NOT change during gameplay
  PLAYER_USERNAME: string;        // This player's name. Name does NOT change during gameplay
  NUM_CARDS_HAND: number;         // The number of cards per hand does NOT change during gameplay

  // Object Singletons
  PubNub;                         // This client's pubnub object
  GameRenderer;                   // GameRenderer singleton reference
  // Game;                           // Game singleton reference

  // global variables
  deck: Deck;                     // The Deck object associated with this specific game
  players: Array<Player>;         // Array of players currently in the game
  hand: Array<Card>;              // Array of cards
  roundNumber: number;            // Current round number
  judge: Player;                  // Current judge username
  blackCard: Card;                // Current black card for round
  continueCounter: number;        // Current number of players ready to continue
  cardsSubmitted: Array<CardSubmission>;  // Array of cards played in current round
  joinedCount: number;

  constructor(channel: string,
              subkey: string,
              pubkey: string,
              playerUsername: string,  // a player's username MUST be unique during a game
              players: Array<Player>,
              deck: Deck,
              gameRenderer: IGameRenderer
              //Game: GamePage
              ) {

    this.CHANNEL = channel;
    this.SUBKEY = subkey;
    this.PUBKEY = pubkey;
    this.PLAYER_USERNAME = playerUsername;

    this.players = players;
    this.deck = deck;
    this.GameRenderer = gameRenderer;
    //this.Game = Game;

    this.NUM_CARDS_HAND = 5;
    this.roundNumber = 0;
    this.continueCounter = 0;
    this.hand = [];
    this.cardsSubmitted = [];
    this.joinedCount = 0;

    console.log('I am: ' + this.PLAYER_USERNAME);

    this.PubNub = new PubNub({
      subscribeKey: this.SUBKEY, // always required
      publishKey: this.PUBKEY,   // only required if publishing
      uuid: this.PLAYER_USERNAME,
      presenceTimeout: 30
    });

    // TODO: switch all references to 'this' to 'gamePlay'
    var GamePlay = this;

    // set up listeners for different events
    this.PubNub.addListener({
      status: function(statusEvent) {
        if (statusEvent.category === 'PNConnectedCategory') {
          console.log('PNConnectedCategory');
        } else if (statusEvent.category === 'PNUnknownCategory') {
          var newState = {
            new: 'error'
          };
          this.PubNub.setState(
            {
              state: newState
            },
            function (status) {
              console.log(statusEvent.errorData.message)
            }
          );
        }
      },

      message: function(msg) {
        //GamePlay.handleMsg(msg);
        GamePlay.handleEvent(msg);
      },

      presence: function(p) {
        GamePlay.handlePresence(p);
      },
    });

    // subscribe to pubnub channel
    this.PubNub.subscribe({
      channels: [this.CHANNEL],
      withPresence: true
    });
  }

  // ======================================================================
  // Functions below
  // ======================================================================

  // sends PubNubMsg indicating that this player is ready to start the game
  // signalReady() {
  //   var msg = new PubNubMsg('READY', 'null');  // TODO: is null necessary?
  //   this.sendMsg(msg);
  // }

  // maybe move this to game.ts and so game-play.ts doesn't need to know about
  // decks. This function is kinda logic anyway.
  // deals out (NUM_CARDS_HAND - 1) cards and then indirectly starts new round
  startGame() {
    console.log('start new game');
    // deal out (NUM_CARDS_HAND - 1) cards then starts new round
    for (var i=1; i<this.NUM_CARDS_HAND; i++) {
      var card = this.deck.drawWhiteCard();
      if (card) {
        this.hand.push(card);
      } else {
        console.log('ERROR: this.deck.drawWhiteCard returned false');
      }
    }
    // start new round
    var newRoundMsg = JSON.stringify(new PubNubMsg('NEW_ROUND', 'null'));  // TODO: is null necessary?
    this.handleEvent({message:newRoundMsg});
  }

  // updates the judge field to the appropriate next judge
  setNextJudge() {
    if (this.judge == null) {
      this.judge = this.players[0];
    } else {
      var index = (this.players.indexOf(this.judge)+1) % this.players.length;
      this.judge = this.players[index];
    }
    console.log('set judge to: ' + this.judge.username);
  }

  // submits the given card through a pubnub msg on the pubnub game channel
  playCard(card: Card) {
    console.log('playCard card:');
    console.log(card);
    if (card.type == 'white') {
      var cardSubmission = new CardSubmission(this.PLAYER_USERNAME, card);
      var msg = new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(cardSubmission));
      this.sendMsg(msg);

      var index = Card.indexIn(card, this.hand);
      if (index != -1) {
        this.hand.splice(index, 1);
      } else {
        console.log("ERROR: tried to play a card that somehow wasn't in this.hands");
      }

    } else if (card.type == 'black') {
      var cardSubmission = new CardSubmission(this.PLAYER_USERNAME, card);
      var msg = new PubNubMsg('PLAY_BLACK_CARD', JSON.stringify(cardSubmission));
      this.sendMsg(msg);
    } else {
      console.log('ERROR: playCard card.type was invalid');
    }
  }

  // submits given winning card over pubnub game channel
  pickWinningCard(cardSubmission: CardSubmission) {
    var msg = new PubNubMsg('PICK_WINNING_CARD', JSON.stringify(cardSubmission));
    this.sendMsg(msg);
  }

  // requests the game continues
  requestContinue() {
    console.log('REQUESTING CONTINUE: this.PLAYER_USERNAME: ' + this.PLAYER_USERNAME);
    var msg = new PubNubMsg('REQUEST_CONTINUE', JSON.stringify(this.PLAYER_USERNAME));
    this.sendMsg(msg);
  }

  // increments the score of the player associated with the given winning CardSubmission
  updateScores(winningCardSubmission: CardSubmission) {
    console.log('STUB: updateScores()');
    for (var i=0; i<this.players.length; i++) {
      if (this.players[i].username == winningCardSubmission.username) {
        this.players[i].score++;
      }
    }
  }

  // sends given msg over this client's pubnub game channel
  sendMsg(msg: PubNubMsg) {
    this.PubNub.publish({
      channel :  this.CHANNEL,
      message : JSON.stringify(msg) });
  }

  // sends PubNub message indicating player has joined the game
  signalJoined() {
    console.log('signalJoined');
    this.sendMsg(new PubNubMsg('JOINED', JSON.stringify(this.PLAYER_USERNAME)));
  }

  // handles a PubNub presence event. Starts the game when enough players have joined.
  handlePresence(p) {
    console.log(p);
  }

  // ======================================================================
  // The Game Logic Event Handler
  // This splendid switch makes moves and renders results
  // ======================================================================
  handleEvent(pubnubEvent) { // the parameter type is set by pubnub
    console.log(pubnubEvent);
    var pubnubMsg = JSON.parse(pubnubEvent.message);
    // check if the received msg adhers to our PubNubMsg Class
    if (pubnubMsg.hasOwnProperty('code') && pubnubMsg.hasOwnProperty('content')) {
      var content = JSON.parse(pubnubMsg.content);
    } else {
      alert("receieved a PubNub message that I don't recognize. See console.");
      console.log('pubnubEvent:');
      console.log(pubnubEvent);
      console.log('pubnubMsg:');
      console.log(pubnubMsg);
      pubnubMsg.code = 'default';
    }

    var GameRenderer = this.GameRenderer;  // for readability
    var GamePlay = this;          // for readability

    switch (pubnubMsg.code) {
      case 'JOINED':
        console.log('case: JOINED');
        this.joinedCount++;

        if (this.joinedCount == GamePlay.players.length) {
          console.log('sendMsg START_GAME');
          GamePlay.sendMsg(new PubNubMsg('START_GAME', 'null'));  // TODO: is null necessary?
        } else if (this.joinedCount > GamePlay.players.length) {
          console.log('this.joinedCount >= this.PLAYERS.length!');
        }

        break;

      case 'START_GAME':
        console.log('case: START_GAME');
        // http://imgur.com/a/38VII
        GamePlay.startGame();
        break;

      case 'PLAY_WHITE_CARD':
        console.log('case: PLAY_WHITE_CARD');
        var whiteCardSubmission = content; // for readability
        GamePlay.cardsSubmitted.push(whiteCardSubmission);

        if (GamePlay.cardsSubmitted.length >= (GamePlay.players.length - 1)) { // if all cards submitted
          if (GamePlay.judge.username == GamePlay.PLAYER_USERNAME) {  // if we are the judge
            GameRenderer.renderCardsSubmitted(Tools.clone(GamePlay.cardsSubmitted), true);
            GameRenderer.renderText('Pick a Winner');
          } else {
            GameRenderer.renderCardsSubmitted(Tools.clone(GamePlay.cardsSubmitted), false);
            GameRenderer.renderText('Waiting for judge to pick winner...');
          }
        }
        break;

      case 'PLAY_BLACK_CARD':
        console.log('case: PLAY_BLACK_CARD');
        var blackCard = new Card(content.card.type, content.card.content); // cast/set as Card object
        GamePlay.deck.discard(blackCard);
        GamePlay.blackCard = blackCard;
        GameRenderer.renderBlackCard(Tools.clone(blackCard));
        break;

      case 'PICK_WINNING_CARD':
        console.log('case: PICK_WINNING_CARD');
        var winningCardSubmission = content; // for readability

        GamePlay.updateScores(winningCardSubmission);
        GameRenderer.renderScores(Tools.clone(GamePlay.players));
        GamePlay.cardsSubmitted = [];
        GameRenderer.clearCardsSubmitted();
        GameRenderer.renderWinningCard(Tools.clone(winningCardSubmission));
        GameRenderer.renderText(winningCardSubmission.card.content + ' won the round!');
        GameRenderer.renderContinueButton();
        break;

      case 'REQUEST_CONTINUE':
        console.log('case: REQUEST_CONTINUE');
        GamePlay.continueCounter++;
        // TODO: what if someone exits the game and doesn't click "continue"?
        if (GamePlay.continueCounter >= GamePlay.players.length) {
          GamePlay.continueCounter = 0;
          GameRenderer.clearContinueButton();

          // start new round
          var newRoundMsg = JSON.stringify(new PubNubMsg('NEW_ROUND', 'null'));
          this.handleEvent({message:newRoundMsg});
        }

        //GameRenderer.renderContinueRequest(Tools.clone(content));
        break;

      case 'NEW_ROUND':
        console.log('case: NEW_ROUND');
        GamePlay.roundNumber++;
        GamePlay.setNextJudge();

        if (GamePlay.judge.username == GamePlay.PLAYER_USERNAME) { // if I'm the judge
          GameRenderer.requestPlayCard(GamePlay.deck.drawBlackCard());
          GameRenderer.renderText('Waiting for players to submit cards...');
        } else { // if I'm not the judge
          var card = GamePlay.deck.drawWhiteCard();
          if (card != false) {
            GamePlay.hand.push();
          } else {
            console.log('ERROR: tried to draw a white card but received false');
          }
          GameRenderer.renderHand(Tools.clone(GamePlay.hand));
          GameRenderer.renderText('Pick a card to play');
        }
        break;

      default:
        console.log("ERROR: default case reached in handleMsg");
    }
  }
}

