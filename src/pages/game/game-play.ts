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
  gameRenderer;        // An instantiation of the GameRenderer interface

  deck;                // The Deck object associated with this specific game
  players = [];        // Array of players currently in the game
  cardsPlayed = 0;     // The total number of cards played so far
  hand = [];           // Array of cards
  roundNumber = 0;     // Current round number
  judge;               // Current judge username

  constructor(channel: string,
              subkey: string,
              pubkey: string,
              playerUsername: string,
              players: typeof Player[],
              deck: typeof Deck,
              gameRenderer: GameRenderer
              ) {

    this.CHANNEL = channel;
    this.SUBKEY = subkey;
    this.PUBKEY = pubkey;
    this.PLAYER_USERNAME = playerUsername;

    this.players = players;
    this.deck = deck;
    this.gameRenderer = gameRenderer;

    this.PubNub = new PubNub({
      subscribeKey: this.SUBKEY, // always required
      publishKey: this.PUBKEY,   // only required if publishing
      uuid: this.PLAYER_USERNAME,
      presenceTimeout: 30
    });

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

    if (this.judge == this.PLAYER_USERNAME) { // if I'm the judge
      this.playCard(this.deck.drawBlackCard());

    } else { // if I'm not the judge
      this.hand.push(this.deck.drawWhiteCard());
    }
  }

  // updates the judge field to the appropriate next judge
  setNextJudge() {
    if (this.judge == null) {
      console.log('this.judge was null, picking a judge');
      this.judge = this.players[0].username;
    } else {
      console.log('old judge: ' + this.judge);
      var index = this.players.indexOf(this.judge) % this.players.length;
      this.judge = this.players[index].username;
    }
    console.log('set judge to: ' + this.judge);
  }

  // submits the given card through a pubnub msg on the pubnub game channel
  playCard(card: Card) {
    if (card.type == 'white') {
      var msg = new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(card));
      this.sendMsg(msg);
    } else if (card.type == 'black') {
      var msg = new PubNubMsg('PLAY_BLACK_CARD', JSON.stringify(card));
      this.sendMsg(msg);
    } else {
      console.log('ERROR: playCard card.type was invalid');
    }
  }

  // submits given winning card over pubnub game channel
  pickWinningCard(card: Card) {
    var msg = new PubNubMsg('PICK_WINNING_CARD', card.content);
    this.sendMsg(msg);
  }

  // requests the game continues
  requestContinue() {
    var msg = new PubNubMsg('REQUEST_CONTINUE', '');
    this.sendMsg(msg);
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

    switch (pubnubmsg.code) {
      case 'PLAY_WHITE_CARD':
        console.log('case: PLAY_WHITE_CARD');
        var card = JSON.parse(pubnubmsg.content);
        console.log('card: ');
        console.log(card);
        this.gameRenderer.renderWhiteCard(pubnubmsg.content);
        break;

      case 'PLAY_BLACK_CARD':
        console.log('case: PLAY_BLACK_CARD');
        var card = JSON.parse(pubnubmsg.content);
        this.gameRenderer.renderBlackCard(pubnubmsg.content);
        break;

      case 'PICK_WINNING_CARD':
        console.log('case: PICK_WINNING_CARD');
        this.gameRenderer.renderWinningCard(pubnubmsg.content);
        break;

      case 'REQUEST_CONTINUE':
        console.log('case: REQUEST_CONTINUE');
        this.handleContinueRequest(pubnubmsg.content);
        break;

      default:
        console.log("ERROR: default case reached in handleMsg");
    }
  }

  //
  handleContinueRequest(username: string) {
    console.log('username: ' + username + ' wants to continue');
  }

  //
  handlePresence(p: Object) {
    console.log(p);
  }
}
