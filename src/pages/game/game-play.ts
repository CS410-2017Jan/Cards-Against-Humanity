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
import { IGameRenderer } from './i-game-renderer';

// ======================================================================
// This Class contains the gamestate and methods to modify/play the game.
// This Class also includes the game logic loop.
// ======================================================================
export class GamePlay {
  // constants
  CHANNEL: string;                // The channel used will NOT change during gameplay
  SUBKEY: string;                 // The subscription key user will NOT change during gameplay
  PUBKEY: string;                 // The publish key user will NOT change during gameplay
  PLAYER_USERNAME: string;        // This player's name. Name does NOT change during gameplay
  NUM_CARDS_HAND: number;         // The number of cards per hand does NOT change during gameplay
  NUM_WINNING_POINTS: number;     // The number of points a player needs to win the game
  TIMER_DURATION_MS: number;
  MAX_TIMEOUTS_PERMITTED: number;

  // Object Singletons
  PubNub;                         // This client's pubnub object
  GameRenderer;                   // GameRenderer singleton reference

  // global variables
  deck: Deck;                     // The Deck object associated with this specific game
  players: Array<Player>;         // Array of players currently in the game
  hand: Array<Card>;              // Array of cards
  gameStarted: boolean;
  collectingCards: boolean;
  ongoingRound: boolean;
  roundNumber: number;            // Current round number
  judge: Player;                  // Current judge username
  blackCard: Card;                // Current black card for round
  continueRequests: Array<string>; // Current player usernames of players ready to continue
  cardsSubmitted: Array<CardSubmission>;  // Array of cards played in current round
  joinedCount: number;
  timeoutCount: number;
  whiteCardTimer: number;
  pickWinnerTimer: number;
  continueTimer: number;

  constructor(channel: string,
              subkey: string,
              pubkey: string,
              playerUsername: string,  // TODO: a player's username MUST be unique during a game
              players: Array<Player>,
              deck: Deck,
              gameRenderer: IGameRenderer
              ) {

    this.CHANNEL = channel;
    this.SUBKEY = subkey;
    this.PUBKEY = pubkey;
    this.PLAYER_USERNAME = playerUsername;

    this.players = players;
    this.deck = deck;
    this.GameRenderer = gameRenderer;

    this.NUM_CARDS_HAND = 5;         // TODO: move value to config file
    this.NUM_WINNING_POINTS = 3;     // TODO: move value to config file
    this.TIMER_DURATION_MS = 7000;  // TODO: move value to config file
    this.MAX_TIMEOUTS_PERMITTED = 2; // TODO: move value to config file
    this.gameStarted = false;
    this.collectingCards = false;
    this.ongoingRound = false;
    this.roundNumber = 0;
    this.continueRequests = [];
    this.hand = [];
    this.cardsSubmitted = [];
    this.joinedCount = 0;
    this.timeoutCount = 0;

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

  // deals out (NUM_CARDS_HAND - 1) cards and then indirectly starts new round
  startGame() {
    console.log('start new game');

    // deal out (NUM_CARDS_HAND - 1) cards
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
      this.timeoutCount = 0;
      clearTimeout(this.whiteCardTimer);
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
    this.timeoutCount = 0;
    clearTimeout(this.pickWinnerTimer);
    var msg = new PubNubMsg('PICK_WINNING_CARD', JSON.stringify(cardSubmission));
    this.sendMsg(msg);
  }

  // requests the game continues
  requestContinue() {
    clearTimeout(this.continueTimer);
    //console.log('REQUESTING CONTINUE: this.PLAYER_USERNAME: ' + this.PLAYER_USERNAME);
    var msg = new PubNubMsg('REQUEST_CONTINUE', JSON.stringify(this.PLAYER_USERNAME));
    this.sendMsg(msg);
  }

  // increments the score of the player associated with the given winning CardSubmission
  updateScores(winningCardSubmission: CardSubmission) {
    //console.log('START: updateScores()');
    for (var i=0; i<this.players.length; i++) {
      if (this.players[i].username == winningCardSubmission.username) {
        this.players[i].score++;
      }
    }
  }

  // returns boolean indicating if a player has scored enough points to win the game
  isGameOver(): boolean {
    for (var i=0; i<this.players.length; i++) {
      if (this.players[i].score >= this.NUM_WINNING_POINTS) {
        return true;
      }
    }
    return false;
  }

  // returns the player with the current highest score
  getLeadingPlayer(): Player {
    var leader = this.players[0];
    for (var i=0; i<this.players.length; i++) {
      if (this.players[i].score >= leader.score) {
        leader = this.players[i];
      }
    }
    return leader;
  }

  // called when a timer expires for submitting a white card
  whiteCardTimerExpire() {
    console.log('===== START: whiteCardTimerExpire');
    this.GameRenderer.renderText('white card timer expired!');

    this.GameRenderer.clearHand();

    var abstainCard = new Card('white_abstain', '');
    var abstainCardSubmission = new CardSubmission(this.PLAYER_USERNAME, abstainCard);
    this.sendMsg(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(abstainCardSubmission)));

    this.timeoutCount++;
    this.checkTimeoutCounts();
  }

  // called when a timer expires for submitting a white card
  pickWinnerTimerExpire() {
    console.log('===== START: pickWinnerTimerExpire');
    this.GameRenderer.renderText('black card timer expired!');

    //this.GameRenderer.clearCardsSubmitted();

    var abstainCard = new Card('black_abstain', '');
    var abstainCardSubmission = new CardSubmission(this.PLAYER_USERNAME, abstainCard);
    console.log(this);
    this.sendMsg(new PubNubMsg('PLAY_BLACK_CARD', JSON.stringify(abstainCardSubmission)));

    this.timeoutCount++;
    this.checkTimeoutCounts();
  }

  // called when a timer expires for clicking the continue button
  continueTimerExpire() {
    this.GameRenderer.renderText('Moving on!');

    this.GameRenderer.clearContinueButton();
    this.requestContinue();
  }

  // checks if the player has timed out enough times in a row to be kicked!
  checkTimeoutCounts() {
    if (this.timeoutCount > this.MAX_TIMEOUTS_PERMITTED) {
      alert('STUB: you should be kicked');
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
    //this.sendMsg(new PubNubMsg('JOINED', JSON.stringify(this.PLAYER_USERNAME)));
  }

  // sends PubNub message indicating player has joined the game
  signalLeaving() {
    console.log('signalLeaving');
    this.clearTimers();
    //this.sendMsg(new PubNubMsg('PLAYER_LEFT', JSON.stringify(this.PLAYER_USERNAME)));

    this.PubNub.unsubscribe({
      channels: [this.CHANNEL]
    });
  }

  // cancels all timers
  clearTimers() {
    clearTimeout(this.whiteCardTimer);
    clearTimeout(this.pickWinnerTimer);
    console.log('========== cleared both timers');
  }

  purgeAbstains(cardSubmissions: Array<CardSubmission>): Array<CardSubmission> {
    var newCardSubmissions = [];
    for (let cardSubmission of cardSubmissions) {
      if (!((cardSubmission.card.type == 'white_abstain') || (cardSubmission.card.type == 'black_abstain'))) {
        newCardSubmissions.push(cardSubmission);
      }
    }

    return newCardSubmissions;
}

  // handles a PubNub presence event. Starts the game when enough players have joined.
  handlePresence(p) {
    console.log(p);
    if (p.action == 'join') {
      this.handlePubNubMsg(new PubNubMsg('JOINED', JSON.stringify(p.uuid)));
    } else if (p.action == 'leave') {
      console.log('detected ' + p.uuid + ' left!');
      this.handlePubNubMsg(new PubNubMsg('PLAYER_LEFT', JSON.stringify(p.uuid)));
    }
  }

  // acts as a minor buffer between pubnubEvents and our own PubNubMsg types.
  // This allows us to simulate handling an event that wasn't received on the message channel
  // by simply calling handlePubNubMsg directly.
  handleEvent(pubnubEvent) {
    console.log(pubnubEvent);

    var pubnubMsg = JSON.parse(pubnubEvent.message);
    this.handlePubNubMsg(pubnubMsg)
  }


  // ======================================================================
  // The Game Logic Event Handler
  // This splendid switch makes moves and renders results
  // ======================================================================
  handlePubNubMsg(pubnubMsg: PubNubMsg) { // the parameter type is set by pubnub
    // check if the received msg adhers to our PubNubMsg Class
    if (pubnubMsg.hasOwnProperty('code') && pubnubMsg.hasOwnProperty('content')) {
      var content = JSON.parse(pubnubMsg.content);
    } else {
      alert("receieved a PubNub message that I don't recognize. See console.");
      console.log('pubnubMsg:');
      console.log(pubnubMsg);
      pubnubMsg.code = 'default';
    }

    var GameRenderer = this.GameRenderer;  // for readability
    var GamePlay = this;                   // for readability

    switch (pubnubMsg.code) {
      case 'JOINED':
        console.log('case: JOINED');
        this.joinedCount++;

        if (this.joinedCount == GamePlay.players.length) {
          console.log('sendMsg START_GAME');
          GamePlay.sendMsg(new PubNubMsg('START_GAME', 'null'));  // null necessary
        } else if (this.joinedCount > GamePlay.players.length) {
          console.log('this.joinedCount >= this.PLAYERS.length!');
        }

        break;

      case 'START_GAME':
        console.log('case: START_GAME');
        if(!this.gameStarted) {
          // only start the game once
          this.gameStarted = true;

          // http://imgur.com/a/38VII
          GamePlay.startGame();
        } else {
          console.log('told to START_GAME, but game already started. Must have concurrent player joins. ');
        }
        break;

      case 'PLAY_WHITE_CARD':
        console.log('case: PLAY_WHITE_CARD');
        var whiteCardSubmission = content; // for readability
        GamePlay.cardsSubmitted.push(whiteCardSubmission);

        // if all cards submitted
        if (GamePlay.cardsSubmitted.length >= (GamePlay.players.length - 1)) { // -1 for the judge
          this.collectingCards = false;
          if (GamePlay.judge.username == GamePlay.PLAYER_USERNAME) {  // if we are the judge
            GameRenderer.renderCardsSubmitted(Tools.clone(GamePlay.purgeAbstains(GamePlay.cardsSubmitted)), true);
            GameRenderer.renderText('Pick a Winner');

            GameRenderer.renderPickWinnerTimer(GamePlay.TIMER_DURATION_MS);
            this.pickWinnerTimer = setTimeout(function(){GamePlay.pickWinnerTimerExpire()}, GamePlay.TIMER_DURATION_MS);
          } else {
            GameRenderer.renderCardsSubmitted(Tools.clone(GamePlay.purgeAbstains(GamePlay.cardsSubmitted)), false);
            GameRenderer.renderText('Waiting for judge to pick winner...');
          }
        }
        break;

      case 'PLAY_BLACK_CARD':
        console.log('case: PLAY_BLACK_CARD');
        var blackCard = new Card(content.card.type, content.card.content); // cast/set as Card object

        if (blackCard.type != 'black_abstain') {
          GamePlay.deck.discard(blackCard);
          GamePlay.blackCard = blackCard;
          GameRenderer.renderBlackCard(Tools.clone(blackCard));
        } else {
          GameRenderer.renderText('judge failed to pick card in time!');
          GamePlay.cardsSubmitted = [];
          GameRenderer.clearCardsSubmitted();

          // start new round
          var newRoundMsg = JSON.stringify(new PubNubMsg('NEW_ROUND', 'null'));
          this.handleEvent({message: newRoundMsg}); // TODO: change this to handlePubNubMsg()
        }
        break;

      case 'PICK_WINNING_CARD':
        console.log('case: PICK_WINNING_CARD');
        GamePlay.ongoingRound = false;
        var winningCardSubmission = content; // for readability

        GamePlay.updateScores(winningCardSubmission);
        GameRenderer.renderScores(Tools.clone(GamePlay.players));
        GamePlay.cardsSubmitted = [];
        GameRenderer.clearCardsSubmitted();
        GameRenderer.renderWinningCard(Tools.clone(winningCardSubmission));

        // check if game ended
        if (GamePlay.isGameOver()) {
          this.clearTimers();
          GameRenderer.renderText(GamePlay.getLeadingPlayer().username + ' won the game!');
          GameRenderer.renderGameOver(Tools.clone(GamePlay.players));
        } else {
          GameRenderer.renderText(winningCardSubmission.card.content + ' won the round!');
          GameRenderer.renderContinueButton();

          // TODO: START HERE. Enabling this line kinda really breaks it. Fix it.
          // this.continueTimer = setTimeout(function(){GamePlay.continueTimerExpire()}, GamePlay.TIMER_DURATION_MS);
        }
        break;

      case 'REQUEST_CONTINUE':
        console.log('case: REQUEST_CONTINUE');
        GamePlay.continueRequests.push(content);
        if (GamePlay.continueRequests.length >= GamePlay.players.length) {
          GamePlay.continueRequests = [];
          GameRenderer.clearContinueButton();

          // start new round
          var newRoundMsg = JSON.stringify(new PubNubMsg('NEW_ROUND', 'null'));
          this.handleEvent({message:newRoundMsg});
        }

        //GameRenderer.renderContinueRequest(Tools.clone(content));
        break;

      case 'NEW_ROUND':
        console.log('case: NEW_ROUND');
        this.clearTimers();
        this.collectingCards = true;
        this.ongoingRound = true;
        GamePlay.roundNumber++;
        GamePlay.setNextJudge();

        if (GamePlay.judge.username == GamePlay.PLAYER_USERNAME) { // if I'm the judge
          GameRenderer.requestPlayCard(GamePlay.deck.drawBlackCard());
          GameRenderer.renderText('Waiting for players to submit cards...');
        } else { // if I'm not the judge
          if (GamePlay.hand.length < GamePlay.NUM_CARDS_HAND) {
            // we might not need to draw another card. Eg. the judge leaves the game before we play a card.
            var card = GamePlay.deck.drawWhiteCard();
            if (card != false) {
              GamePlay.hand.push(card);
            } else {
              console.log('ERROR: tried to draw a white card but received false');
            }
          }

          GameRenderer.renderHand(Tools.clone(GamePlay.hand));
          GameRenderer.renderText('Pick a card to play');

          GameRenderer.renderWhiteCardTimer(GamePlay.TIMER_DURATION_MS);
          this.whiteCardTimer = setTimeout(function(){GamePlay.whiteCardTimerExpire()}, GamePlay.TIMER_DURATION_MS);
        }
        break;

      case 'PLAYER_LEFT':
        var absentPlayerUsername = content;

        if (this.judge.username == absentPlayerUsername) {  // if the judge left
          console.log('judge left');
          GamePlay.cardsSubmitted = [];
          GameRenderer.clearCardsSubmitted();
          GameRenderer.renderText('The judge: ' + absentPlayerUsername + ' left the game!');

          // if the round hasn't ended
          if (GamePlay.ongoingRound) {
            // start new round
            var newRoundMsg = JSON.stringify(new PubNubMsg('NEW_ROUND', 'null'));
            this.handleEvent({message: newRoundMsg}); // TODO: change this to handlePubNubMsg()
          } else {
            console.log('judge left after the round was over but before a new round started.');
          }
        } else if (this.collectingCards) {
          // we were waiting on card submissions when a player left

          // check if they left before/after submitting a card
          var potCardSubmission = CardSubmission.getCardSubmissionByUsername(this.cardsSubmitted, absentPlayerUsername);

          if (potCardSubmission != undefined) {
            console.log('Player: ' + absentPlayerUsername + ' left a round in progress AFTER submitting a card');
            // they submitted a card:
            GamePlay.cardsSubmitted = CardSubmission.removeCardSubmission(GamePlay.cardsSubmitted, potCardSubmission);
            console.log('cardsSubmitted after purging his:');
            console.log(GamePlay.cardsSubmitted);
          } else {
            console.log('Player: ' + absentPlayerUsername + ' left a round in progress BEFORE submitting a card');
            // they didn't submit a card:
          }
          GameRenderer.renderText('Player: ' + absentPlayerUsername + ' left the game!');
        }

        // we were NOT waiting on card submissions. But we were counting continue...
        // either a judge or a player left...
        if (!this.collectingCards) {
          if (GamePlay.continueRequests.indexOf(absentPlayerUsername) >= 0) {
            GamePlay.continueRequests.splice(GamePlay.continueRequests.indexOf(absentPlayerUsername), 1)
          }
        }

        // purge the player who left
        this.players.splice(Player.getPlayerIndex(this.players, absentPlayerUsername), 1);
        console.log('post purge players:');
        console.log(this.players);
        GameRenderer.renderScores(Tools.clone(GamePlay.players));

        // we need at least 3 players to play
        if ((this.players.length) >= 3) {
          console.log('we CAN continue without him!');
          if(this.collectingCards) { // if we were collection cards
            // check if all cards submitted
            if (GamePlay.cardsSubmitted.length >= (GamePlay.players.length - 1)) { // -1 for judge
              if (GamePlay.judge.username == GamePlay.PLAYER_USERNAME) {  // if we are the judge
                GameRenderer.renderCardsSubmitted(Tools.clone(GamePlay.cardsSubmitted), true);
                GameRenderer.renderText('Pick a Winner');
              } else {
                GameRenderer.renderCardsSubmitted(Tools.clone(GamePlay.cardsSubmitted), false);
                GameRenderer.renderText('Waiting for judge to pick winner...');
              }
            }
          } else {
            console.log('we were not collecting cards when he died');
          }

        } else {  // not enough players to continue the game...
          this.clearTimers();
          console.log('we can NOT continue without him!');
          GameRenderer.renderText('Not enough players to continue the game...');
          GameRenderer.renderNotEnoughPlayers(Tools.clone(GamePlay.players));
        }
        break;

      default:
        console.log('ERROR: default case reached in handleMsg');
    }
  }
}

