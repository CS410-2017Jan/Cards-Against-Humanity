/*
 Generated class for the GamePlay page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
*/

import { Tools } from '../../tools/general-tools';
import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,AlertController,ModalController,Platform,ViewController } from 'ionic-angular';
import { GamePlay } from './game-play';
import { Card } from '../../data-classes/card';
import { Player } from '../../data-classes/player';
import { GameRendererStub } from './game-renderer-stub';
import { PubNubMsg } from '../../data-classes/pubnub-msg';

@Component({
  selector: 'page-game', // should this be game-page?
  templateUrl: 'game.html'
})

// ======================================================================
// This Class instantiates GamePlay and GameRenderer classes and calls the
// appropriate methods to play the game and then render the game.
// Much of the game's logic will be in this class, whereas the game's
// actions/implementation are in the GamePlay class.
// ======================================================================
export class GamePage {
  USERNAME;      // this client's username will not change during a game
  //SUBKEY;      // PubNub connection subscription key
  //PUBKEY;      // PubNub connection publish key
  CHANNEL;       // PubNub channel to join
  DECK;          // Deck object to pass to GamePlay
  PLAYERS;       // Player object to pass to GamePlay

  GamePlay;      // A GamePlay singleton object
  GameRenderer;  // An instantiation of the GameRenderer abstract class
  ScoreModal;   //Instance of score modal

  joinedCount;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public viewCtrl: ViewController,
              private toastCtrl: ToastController,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController) {

    console.log('PARAMS: ');
    console.log(navParams);

    this.USERNAME = navParams.get('username');
    //this.SUBKEY = navParams.get('subkey');
    //this.PUBKEY = navParams.get('pubkey');
    this.CHANNEL = navParams.get('channel');
    this.PLAYERS = navParams.get('players');

    var playerIndex = Player.getPlayerIndex(this.PLAYERS, this.USERNAME);
    this.DECK = navParams.get('deck').deal(3)[playerIndex];

    this.joinedCount = 0;
  }

  ionViewDidLoad() {
    // TODO: players must wait for all other players to join before starting the game?
    console.log('ionViewDidLoad GamePage');

    // a GameRenderer is an abstract class, so me instantiating an abstract class is just a
    // dev hack to get the game going. (for testing purposes obviously)
    this.GameRenderer = new GameRendererStub(this.toastCtrl, this.alertCtrl, this, this.modalCtrl);

    // set up GamePlay singleton to make moves
    this.GamePlay = new GamePlay(this.CHANNEL,
      'sub-c-a72c3874-e836-11e6-b3b8-0619f8945a4f',
      'pub-c-4c3ec11e-305a-420f-ba3b-265b35ee99e7',
      this.USERNAME,
      this.PLAYERS,
      this.DECK,
      this
    );

    this.GamePlay.signalJoined();
  }

  // ======================================================================
  // Below functions are what a user can do. The UI will tie to these functions
  // ======================================================================

  // called by user clicking a button or when the judge starts
  // a round and plays a black card
  requestPlayCard(card: Card) {
    this.GameRenderer.clearHand();
    this.GamePlay.playCard(card);
  }

  // called by user clicking a button to request continuing the game
  requestContinue() {
    this.GameRenderer.clearContinueButton();
    this.GamePlay.requestContinue();
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
    var GamePlay = this.GamePlay;          // for readability

    switch (pubnubMsg.code) {
      case 'JOINED':
        console.log('case: JOINED');
        this.joinedCount++;

        if (this.joinedCount == this.PLAYERS.length) {
          console.log('sendMsg START_GAME');
          GamePlay.sendMsg(new PubNubMsg('START_GAME', 'null'));  // TODO: is null necessary?
        } else if (this.joinedCount > this.PLAYERS.length) {
          console.log('this.joinedCount >= this.PLAYERS.length!');
        }

        break;

      case 'START_GAME':
        console.log('case: START_GAME');
        // http://imgur.com/a/38VII
        this.GamePlay.startGame();
        break;

      case 'PLAY_WHITE_CARD':
        console.log('case: PLAY_WHITE_CARD');
        var whiteCardSubmission = content; // for readability
        GamePlay.cardsSubmitted.push(whiteCardSubmission);

        if (GamePlay.cardsSubmitted.length >= (GamePlay.players.length - 1)) { // if all cards submitted
          if (this.GamePlay.judge.username == this.GamePlay.PLAYER_USERNAME) {  // if we are the judge
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
          this.requestPlayCard(GamePlay.deck.drawBlackCard());
          GameRenderer.renderText('Waiting for players to submit cards...');
        } else { // if I'm not the judge
          GamePlay.hand.push(GamePlay.deck.drawWhiteCard());
          GameRenderer.renderHand(Tools.clone(GamePlay.hand));
          GameRenderer.renderText('Pick a card to play');
        }
        break;

      default:
        console.log("ERROR: default case reached in handleMsg");
    }
  }

  openScoreModal() {
    let scoreModal = this.modalCtrl.create(ScoreModalPage,{"GameRenderer": this.GameRenderer});
    scoreModal.present();
  }
}


@Component({
  template: `
  <ion-header>
  <ion-toolbar>
    <ion-title>
      Scoreboard
    </ion-title>

    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">Cancel</span>
        <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
      </ion-header>
      <ion-content>
<ion-list>
    <ion-item *ngFor="let player of this.params.get('GameRenderer').players; let i = index">
    {{player.username}} <ion-badge item-right>{{player.score}}</ion-badge>
    </ion-item>
    </ion-list>
    </ion-content>
    `
})
export class ScoreModalPage {
  //GameRenderer;

  constructor(public params: NavParams, public viewCtrl: ViewController,public platform: Platform) {
    console.log('it worked!');
    console.log(params);

    //this.GameRenderer = params;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
