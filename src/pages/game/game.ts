/*
 Generated class for the GamePlay page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
*/

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import PubNub from 'pubnub';
import { GamePlay } from './game-play';

import { Deck } from '../../data-classes/deck.ts';
import { Card } from '../../data-classes/card.ts';
import { Player } from '../../data-classes/player.ts';
import { GameRenderer } from '../../data-classes/game-renderer.ts';

@Component({
  selector: 'page-game', // should this be game-page?
  templateUrl: 'game.html'
})

// ======================================================================
// this Class will instantiate a GamePlay class and then call the
// appropriate methods on that class and then render them.
// Much of the game's logic will be in this class, whereas the game's
// actions are in the GamePlay class.
// ======================================================================
export class GamePage {
  USERNAME;    // this client's username will not change during a game
  SUBKEY;
  PUBKEY;
  CHANNEL;
  players;
  deck;

  GamePlay;    // this client's instance of the GamePlay class.
  GameRenderer;

  constructor(public navCtrl: NavController, public navParams: NavParams,) {
    console.log('PARAMS: ');
    console.log(navParams);

    this.USERNAME = navParams.get('username');
    //this.SUBKEY = navParams.get('subkey');
    //this.PUBKEY = navParams.get('pubkey');
    this.CHANNEL = navParams.get('channel');
    //this.players = navParams.get('players');
    this.deck = navParams.get('deck');
  }

  ionViewDidLoad() {
    // TODO: players must wait for all other players to join before starting the game?
    console.log('ionViewDidLoad GamePage');

    /* dummy dev deck
    var testDeck = new Deck('testDeck');

    for (var i=1; i<=50; i++) {
      testDeck.addCard(new Card('white', 'whiteCard'+i));
    }

    for (var i=1; i<=10; i++) {
      testDeck.addCard(new Card('black', 'blackCard'+i));
    }
    */

    var players = [];
    players.push(new Player('Player1'));
    players.push(new Player('Player2'));
    players.push(new Player('Player3'));

    this.GameRenderer = new GameRenderer(this);

    this.GamePlay = new GamePlay(this.CHANNEL,
                                'sub-c-a72c3874-e836-11e6-b3b8-0619f8945a4f',
                                'pub-c-4c3ec11e-305a-420f-ba3b-265b35ee99e7',
                                this.USERNAME,
                                players,
                                this.deck,
                                this.GameRenderer
                                );
    this.GamePlay.startGame();
  }
}
