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
//import { GameRendererStub } from './game-renderer-stub';

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
export class GamePage implements IGameRenderer {
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
    //this.GameRenderer = new GameRendererStub(this.toastCtrl, this.alertCtrl, this, this.modalCtrl);

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
    this.clearHand();
    this.GamePlay.playCard(card);
  }

  // called by user clicking a button to request continuing the game
  requestContinue() {
    this.clearContinueButton();
    this.GamePlay.requestContinue();
  }

  // openScoreModal() {
  //   let scoreModal = this.modalCtrl.create(ScoreModalPage,{"GameRenderer": this.GameRenderer});
  //   scoreModal.present();
  // }

  // ======================================================================
  // Below functions implement the interface: IGameRender
  // ======================================================================

  // vars to render using angular:
  text = '';
  blackCard;
  hand;
  cardsSubmitted: Array<CardSubmission>;
  continueButton;
  //continueRequest;
  winningCard;
  clickable;
  players;

  // constructor(private toastCtrl: ToastController,
  //             public alertCtrl: AlertController,
  //             public gamePage:GamePage,
  //             public modalCtrl:ModalController) {
  // }

  // set the var angular uses to render the black card
  renderBlackCard(card: Card) {
    console.log('STUB: renderBlackCard()');
    this.blackCard = card;
  }

  // sets the var angular uses to render the winning card
  renderWinningCard(card: Card) {
    console.log('STUB: renderWinningCard()');
    this.winningCard = card;
  }

  // clears the var angular uses to render the winning card
  clearWinningCard() {
    console.log('STUB: clearWinningCard');
    this.winningCard = false;
  }

  // sets the boolean which tells angular to render the continue button
  renderContinueButton() {
    console.log('STUB: renderContinueButton');
    this.continueButton = true;

    let alert = this.alertCtrl.create({
      title: 'Ready to move on?',
      message: '',
      buttons: [
        {
          text: 'Continue',
          handler: () => {
            console.log('Continue clicked');
          }
        }
      ]
    });

    alert.present();

    this.requestContinue();
  }

  // falsifies the boolean which tells angular to clear the continue button
  clearContinueButton() {
    console.log('STUB: clearContinueButton');
    this.continueButton = false;
  }

  // // called when some player requests continuing
  // renderContinueRequest() {
  //   console.log('STUB: renderContinueRequest');
  //   //this.continueRequest = true;
  // }
  //
  // // not currently in use
  // clearContinueRequest() {
  //   console.log('STUB: clearContinueRequest');
  //   //this.continueRequest = false;
  // }

  // sets the hand var angular uses to render this player's hand of cards
  renderHand(hand: Array<Card>) {
    console.log('STUB: renderHand');
    this.hand = hand;
  }

  // clears the hand var angular uses to render this player's hand of cards
  clearHand() {
    console.log('STUB: clearHand');
    this.hand = [];
  }

  // sets the vars angular uses to render this round's submitted cards
  renderCardsSubmitted(cardsSubmitted: Array<CardSubmission>, clickable: boolean) {
    console.log('STUB: renderCardsSubmitted');
    console.log(cardsSubmitted);
    this.clickable = clickable;
    this.cardsSubmitted = cardsSubmitted;
  }

  // clears the vars angular uses to render this round's submitted cards
  clearCardsSubmitted() {
    console.log('STUB: clearCardsSubmitted');
    this.cardsSubmitted = [];
  }

  // sets the var angular uses to render players' scores
  renderScores(players: Array<Player>) {
    console.log('STUB: renderScores');
    this.players = Tools.clone(players);
    console.log(this.players);
  }

  presentToast(str: string) {
    let toast = this.toastCtrl.create({
      message: str,
      duration: 10000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'OK'
    });

    toast.present();
  }

  // sets the text var angular uses to display text instructions/messages
  renderText(str: string) {
    console.log('STUB: renderText');
    this.text = str;
    this.presentToast(str);
  }
}


@Component({
  template: `
  <ion-header>
  <ion-toolbar>
    <ion-title>
      Scoreboard
    </ion-title>
  </ion-toolbar>
      </ion-header>
      <ion-content>
<ion-list>
    <ion-item *ngFor="let player of this.params.players; let i = index">
    {{i+1}}. {{player.username}} <ion-badge item-right>{{player.score}}</ion-badge>
    </ion-item>
    </ion-list>
    </ion-content>
    `
})
export class ScoreModalPage {
  constructor(public params: NavParams) {
    console.log('it worked!');
    console.log(params);
  }

}
