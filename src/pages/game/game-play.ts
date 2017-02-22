/**
 * Created by Joshua Jackson on 18-Feb-17.
 */

import PubNub from 'pubnub';
import { Deck } from '../../data-classes/deck';
import { Card } from '../../data-classes/card';
import { Player } from '../../data-classes/player';
import { GameRenderer } from '../../data-classes/game-renderer';
import { PubNubMsg } from '../../data-classes/pubnub-msg';

// ======================================================================
// This Class contains the gamestate and methods to modify/play the game
// ======================================================================
export class GamePlay {
  CHANNEL;             // The channel used will NOT change during gameplay
  SUBKEY;              // The subscription key user will NOT change during gameplay
  PUBKEY;              // The publish key user will NOT change during gameplay
  NUM_CARDS_HAND = 5;  // The number of cards per hand does NOT change during gameplay
  PLAYER_USERNAME;     // This player's name. Name does NOT change during gameplay

  PubNub;              // This client's pubnub object
  GameRenderer;        // An instantiation of the GameRenderer interface

  deck;                // The Deck object associated with this specific game
  players = [];        // Array of players currently in the game
  cardsPlayed = [];    // Array of cards played in current round
  hand = [];           // Array of cards
  roundNumber = 0;     // Current round number
  judge;               // Current judge username
  blackCard;           // Current black card for round
  continueCounter = 0; // Current number of players ready to continue

  constructor(channel: string,
              subkey: string,
              pubkey: string,
              playerUsername: string,
              players: typeof Player[],
              deck: typeof Deck,
              GameRenderer: GameRenderer
              ) {

    this.CHANNEL = channel;
    this.SUBKEY = subkey;
    this.PUBKEY = pubkey;
    this.PLAYER_USERNAME = playerUsername;

    this.players = players;
    this.deck = deck;
    this.GameRenderer = GameRenderer;

    console.log('I am: ' + this.PLAYER_USERNAME);

    this.PubNub = new PubNub({
      subscribeKey: this.SUBKEY, // always required
      publishKey: this.PUBKEY,   // only required if publishing
      uuid: this.PLAYER_USERNAME,
      presenceTimeout: 30
    });

    // TODO: switch all references to 'this' to 'gamePlay'
    var gamePlay = this;

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
        gamePlay.handleMsg(msg);
      },

      presence: function(p) {
        gamePlay.handlePresence(p);
      },
    });

    // subscribe to pubnub channel
    this.PubNub.subscribe({
      channels: [this.CHANNEL],
      withPresence: true
    });
  }

  // deals out (NUM_CARDS_HAND - 1) cards and then starts new round
  startGame() {
    console.log('start new game');
    // deal out (NUM_CARDS_HAND - 1) cards then starts new round
    for (var i=1; i<this.NUM_CARDS_HAND; i++) {
      this.hand.push(this.deck.drawWhiteCard());
    }
    this.newRound();
  }

  // updates gamestate and sets up new round
  newRound() {
    console.log('start new round');
    this.roundNumber++;
    this.setNextJudge();

    if (this.judge.username == this.PLAYER_USERNAME) { // if I'm the judge
      this.playCard(this.deck.drawBlackCard());
      this.GameRenderer.renderText('Waiting for players to submit cards...');
    } else { // if I'm not the judge
      this.hand.push(this.deck.drawWhiteCard());
      this.GameRenderer.renderHand(this.hand);
      this.GameRenderer.renderText('Pick a card to play');
    }
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
    this.GameRenderer.clearHand();

    if (card.type == 'white') {
      var msg = new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(card));
      this.sendMsg(msg);
      this.hand.splice(this.hand.indexOf(card), 1);
    } else if (card.type == 'black') {
      var msg = new PubNubMsg('PLAY_BLACK_CARD', JSON.stringify(card));
      this.sendMsg(msg);
    } else {
      console.log('ERROR: playCard card.type was invalid');
    }
  }

  // submits given winning card over pubnub game channel
  pickWinningCard(card: Card) {
    var msg = new PubNubMsg('PICK_WINNING_CARD', JSON.stringify(card));
    this.sendMsg(msg);
  }

  // requests the game continues
  requestContinue() {
    console.log('REQUESTING CONTINUE: this.PLAYER_USERNAME: ' + this.PLAYER_USERNAME);
    var msg = new PubNubMsg('REQUEST_CONTINUE', JSON.stringify(this.PLAYER_USERNAME));
    this.sendMsg(msg);
    this.GameRenderer.clearContinueButton();
  }

  //
  updateScores() {
    console.log('STUB: updateScores()');
  }

  // sends given msg over this client's pubnub game channel
  sendMsg(msg: PubNubMsg) {
    this.PubNub.publish({
      channel :  this.CHANNEL,
      message : JSON.stringify(msg) });
  }

  // calls appropriate handler for given msg
  handleMsg(pubnubMsgObj) {
    console.log(pubnubMsgObj);
    var pubnubmsg = JSON.parse(pubnubMsgObj.message);
    var content = JSON.parse(pubnubmsg.content);

    switch (pubnubmsg.code) {
      case 'PLAY_WHITE_CARD':
        console.log('case: PLAY_WHITE_CARD');
        this.cardsPlayed.push(content);

        console.log('cardsPlayed.length : ' + this.cardsPlayed.length);
        console.log('players.length : ' + this.players.length);
        if (this.cardsPlayed.length >= (this.players.length - 1)) {

          if (this.judge.username == this.PLAYER_USERNAME) {  // if we are the judge
            this.GameRenderer.renderCardsPlayed(this.cardsPlayed, true);
            this.GameRenderer.renderText('Pick a Winner');
          } else {
            this.GameRenderer.renderCardsPlayed(this.cardsPlayed, false);
            this.GameRenderer.renderText('Waiting for judge to pick winner...');
          }
        }
        break;

      case 'PLAY_BLACK_CARD':
        console.log('case: PLAY_BLACK_CARD');
        this.blackCard = content;
        console.log(content);
        this.GameRenderer.renderBlackCard(content);
        break;

      case 'PICK_WINNING_CARD':
        console.log('case: PICK_WINNING_CARD');
        this.cardsPlayed = [];
        this.GameRenderer.clearCardsPlayed();
        this.GameRenderer.renderWinningCard(content);
        this.GameRenderer.renderText(content.content + ' won the round!');
        this.GameRenderer.renderContinueButton();
        break;

      case 'REQUEST_CONTINUE':
        console.log('case: REQUEST_CONTINUE');
        this.continueCounter++;
        // TODO: what if someone exits the game and doesn't click "continue"?
        if (this.continueCounter >= this.players.length) {
          this.continueCounter = 0;
          this.GameRenderer.clearContinueButton();
          this.newRound();
        }

        this.handleContinueRequest(content);
        this.GameRenderer.renderContinueRequest(content);
        break;

      default:
        console.log("ERROR: default case reached in handleMsg");
    }
  }

  //
  handleContinueRequest(username: string) {
    //console.log('username: ' + username + ' wants to continue');
  }

  //
  handlePresence(p: Object) {
    console.log(p);
  }
}
