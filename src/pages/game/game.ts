/*
 Generated class for the GamePlay page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
*/

import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,AlertController,ModalController,Platform,ViewController } from 'ionic-angular';
import { Tools } from '../../tools/general-tools';
import { GamePlay } from './game-play';
import { Card } from '../../data-classes/card';
import { Player } from '../../data-classes/player';
import { CardSubmission } from '../../data-classes/card-submission';
import { IGameRenderer } from './i-game-renderer';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { UserFacade } from "../../providers/facades/user-facade";

@Component({
  selector: 'page-game', // should this be game-page?
  templateUrl: 'game.html'
})

// ======================================================================
// This Class instantiates GamePlay singleton classes and calls the
// appropriate methods to play the game and then render the game.
// This class implements the IGameRenderer interface in order to render the
// elements of the game after making moves using the GamePlay singleton
// ======================================================================
export class GamePage implements IGameRenderer {
  USERNAME;      // this client's username will not change during a game
  // SUBKEY;     // PubNub connection subscription key
  // PUBKEY;     // PubNub connection publish key
  CHANNEL;       // PubNub channel to join
  DECK;          // Deck object to pass to GamePlay
  PLAYERS;       // Player object to pass to GamePlay

  GamePlay;      // A GamePlay singleton object
  ScoreModal;    // Instance of score modal
  ViewCtrl;
  UserCtrl;
  loadProgress: number = 0; //Progress bar
  showTimer: boolean;
  bTimer;
  wTimer;

  constructor(public navParams:NavParams,
              public navCtrl: NavController,
              private toastCtrl:ToastController,
              public alertCtrl:AlertController,
              public modalCtrl:ModalController,
              public userCtrl: UserFacade) {

    //navCtrl.viewWillLeave.subscribe((value) => {console.log('viewWillLeave');}) =

    this.UserCtrl = userCtrl;
    this.showTimer = false;
    //console.log('PARAMS: ');
    //console.log(navParams);

    var room = navParams.get('room');
    //console.log('passed room:');
    //console.log(room);

    this.USERNAME = navParams.get('username');
    // this.SUBKEY = navParams.get('subkey');
    // this.PUBKEY = navParams.get('pubkey');
    this.CHANNEL = 'game_'+room.id;

    this.PLAYERS = Player.createPlayersFromUsers(room.users);

    var playerIndex = Player.getPlayerIndex(this.PLAYERS, this.USERNAME);

    //console.log('players:');
    //console.log(this.PLAYERS);
    //console.log('playerIndex:' + playerIndex);
    //console.log('this.USERNAME: ' + this.USERNAME);
    //console.log('room.size: ' + room.size);

    //console.log(room.decks[0]);
    room.decks[0].setSeed(room.id);
    this.DECK = room.decks[0].deal(room.size)[playerIndex];
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad GamePage');

    // set up GamePlay singleton to make moves
    this.GamePlay = new GamePlay(
                                  this.UserCtrl,
                                  this.CHANNEL,
                                  'sub-c-a72c3874-e836-11e6-b3b8-0619f8945a4f',
                                  'pub-c-4c3ec11e-305a-420f-ba3b-265b35ee99e7',
                                  this.USERNAME,
                                  this.PLAYERS,
                                  this.DECK,
                                  this
                                );

    // render scores of 0
    this.renderScores(Tools.clone(this.PLAYERS));

    this.GamePlay.signalJoined();
  }

  ionViewWillLeave() {
    //console.log('=================================================ABOUT TO LEAVE');
    this.GamePlay.signalLeaving();
  }

  // ======================================================================
  // Below functions are what a user can do. The UI will tie to these functions
  // ======================================================================

  // called by user clicking a button or when the judge starts
  // a round and plays a black card
  requestPlayCard(card:Card) {
    this.clearHand();
    this.GamePlay.playCard(card);
  }

  // called by user clicking a button to request continuing the game
  requestContinue() {
    this.clearContinueButton();
    this.GamePlay.requestContinue();
  }

  openScoreModal() {
    let scoreModal = this.modalCtrl.create(ScoreModalPage,{"players": this.players});
    scoreModal.present();
  }

  // ======================================================================
  // Below functions implement the interface: IGameRender
  // ======================================================================

  // vars to render using angular:
  text: string = '';
  blackCard: Card;
  hand: Array<Card>;
  cardSubmissions: Array<CardSubmission>;
  continueButton: boolean;
  //continueRequest;
  winningCard; // TODO: please type this
  clickable: boolean;
  players: Array<Player>;

  // set the var angular uses to render the black card
  renderBlackCard(card:Card) {
    console.log('START: renderBlackCard');
    this.blackCard = card;
  }

  // sets the var angular uses to render the winning card
  renderWinningCard(card:Card) {
    console.log('START: renderWinningCard');
    this.winningCard = card;
  }

  // clears the var angular uses to render the winning card
  clearWinningCard() {
    console.log('START: clearWinningCard');
    this.winningCard = false;
  }

  // sets the boolean which tells angular to render the continue button
  renderContinueButton() {
    //console.log('STUB: renderContinueButton');
    this.continueButton = true;

    var Game = this;

    let alert = this.alertCtrl.create({
      title: 'Ready to move on?',
      message: '',
      buttons: [
        {
          text: 'Continue',
          handler: () => {
           //console.log('Continue clicked');
            Game.requestContinue();
          }
        }
      ]
    });

    alert.present();
  }

  // falsifies the boolean which tells angular to clear the continue button
  clearContinueButton() {
    this.continueButton = false;
  }

  // called when some player requests continuing
  renderContinueRequest() {
    //console.log('STUB: renderContinueRequest');
    //this.continueRequest = true;
  }

  // not currently in use
  clearContinueRequest() {  // SCOTT: I don't think this works
    //console.log('STUB: clearContinueRequest');
    //this.continueRequest = false;
  }

  // sets the hand var angular uses to render this player's hand of cards
  renderHand(hand:Array<Card>) {
    this.hand = hand;
  }

  // clears the hand var angular uses to render this player's hand of cards
  clearHand() {
    this.hand = [];
  }

  // sets the vars angular uses to render this round's submitted cards
  renderCardsSubmitted(cardsPlayed: Array<CardSubmission>, clickable: boolean) {
    //console.log(cardsPlayed);
    this.clickable = clickable;
    this.cardSubmissions = Tools.clone(cardsPlayed);
  }

  // clears the vars angular uses to render this round's submitted cards
  clearCardsSubmitted() {
    this.cardSubmissions = [];
  }

  // sets the var angular uses to render players' scores
  renderScores(players: Array<Player>) {
    this.players = Tools.clone(players);
    //console.log(this.players);
  }

  presentToast(str: string) {
    let toast = this.toastCtrl.create({
      message: str,
      duration: 5000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'OK'
    });

    toast.present();
  }

  sendVibration() {
    //console.log('Before Vibration');
    navigator.vibrate(1000);
    //console.log('After Vibration');
  }

  // sets the text var angular uses to display text instructions/messages
  renderText(str: string) {
    this.text = str;
    this.sendVibration();
    this.presentToast(str);
  }

  // renders the game over results
  renderGameOver(players: Array<Player>) {
    let gameEndModal = this.modalCtrl.create(EndGameModalPage,{"players": this.players});
    gameEndModal.present();
  }

  // renders the countdown timer with the given duration (in seconds)
  // for players submitting white cards
  renderWhiteCardTimer(seconds: number) {
    console.log('START White Card Timer: ' + seconds + ' seconds');
    this.showTimer = true;
    this.wTimer = setInterval(() => {
      if(this.loadProgress < seconds){
        this.loadProgress++;
      }
    }, 1000);

    this.loadProgress = 0;
  }

  //clears the White Card submission timer
  clearWhiteCardTimer() {
    console.log('CLEAR White Card Timer');
    this.showTimer = false;
    clearInterval(this.wTimer);
    this.loadProgress = 0;
  }

  // renders the countdown timer with the given duration (in seconds)
  // for players submitting black cards
  renderPickWinnerTimer(seconds: number) {
    console.log('START Pick Winner Timer: ' + seconds + ' seconds');
    this.showTimer = true;
    this.bTimer = setInterval(() => {
      if(this.loadProgress < seconds){
        this.loadProgress++;
      }
    }, 1000);
    this.loadProgress = 0;
  }

  // clears the Pick Winner submission timer
  clearPickWinnerTimer() {
    console.log('CLEAR Pick Winner Timer');
    this.showTimer = false;
    clearInterval(this.bTimer);
    this.loadProgress = 0;
  }

  // renders the end game when there are not enough players to continue playing
  renderNotEnoughPlayers(players: Array<Player>) {
    //console.log('STUB: renderNotEnoughPLayers');
    this.renderGameOver(players);
  }

  // render the player's newly updated global score
  renderNewGlobalScore(score: number) {
    this.renderText("You've won " + score + " games total!");
  }

  // forcefully removes player from the game
  kickPlayer() {
    this.navCtrl.popToRoot();
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
    <ion-item *ngFor="let player of  this.params.get('players'); let i = index">
    {{i+1}}. {{player.username}} <ion-badge item-right>{{player.score}}</ion-badge>
    </ion-item>
    </ion-list>
    </ion-content>
    `
})
export class ScoreModalPage {
  constructor(public params: NavParams,public viewCtrl: ViewController,public platform: Platform) {
    //console.log('it worked!');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

@Component({
  template: `
  <ion-header>
  <ion-toolbar>

    <ion-title>
      GAME OVER!
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
    <ion-item *ngFor="let player of  this.params.get('players'); let i = index">
    {{i+1}}. {{player.username}} <ion-badge item-right>{{player.score}}</ion-badge>
    </ion-item>
    </ion-list>
    </ion-content>
    `
})

export class EndGameModalPage {
  constructor(public params: NavParams,public viewCtrl: ViewController,public platform: Platform, public navCtrl: NavController) {
    //console.log('it worked!');
  }

  dismiss() {
    this.navCtrl.push(TabsPage);
    this.viewCtrl.dismiss();
  }
}
