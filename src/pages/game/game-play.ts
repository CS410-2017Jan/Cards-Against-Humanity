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
              gameRenderer: typeof GameRenderer) {

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

    // set up listeners for different events
    this.PubNub.addListener({
      status: function(statusEvent) {
        if (statusEvent.category === 'PNConnectedCategory') {
          console.log('PNConnectedCategory');
        } else if (statusEvent.category === 'PNUnknownCategory') {
          var newState = {
            new: 'error'
          };
          this.PUBNUB.setState(
            {
              state: newState
            },
            function (status) {
              console.log(statusEvent.errorData.message)
            }
          );
        }
      },
      message: function(message) {
        console.log(message);
        //renderMsg(message);
      },
      presence: function(p) {
        console.log(p.action);
        //renderPresenceEvent(p);
      }
    });

    // subscribe to pubnub channel
    this.PubNub.subscribe({
      channels: [this.CHANNEL],
      withPresence: true
    });
  }

  // deals out (NUM_CARDS_HAND - 1) cards and then starts new round
  startGame() {
    console.log('STUB: startGame()');
    // deal out (NUM_CARDS_HAND - 1) cards then starts new round
    for (var i=1; i<this.NUM_CARDS_HAND; i++) {
      this.hand.push(this.deck.drawWhiteCard());
    }
    this.newRound();
  }

  // updates gamestate and sets up new round
  newRound() {
    console.log('starting new round stub');
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
      var msg = new PubNubMsg('PLAY_WHITE_CARD', card.content);
      this.sendMsg(msg);
    } else if (card.type == 'black') {
      var msg = new PubNubMsg('PLAY_BLACK_CARD', card.content);
      this.sendMsg(msg);
    } else {
      console.log('ERROR: playCard card.type was invalid');
    }
  }

  pickWinningCard(card: Card) {
    console.log('STUB: pickWinningCard()');
  }

  //
  updateScores() {
    console.log('STUB: updateScores()');
  }

  // sends given msg over this client's pubnub game channel
  sendMsg(msg: PubNubMsg) {
    var msgStr = msg.code + ',' + msg.content;

    this.PubNub.publish({
      channel :  this.CHANNEL,
      message : msgStr });
  }
}
