import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { GamePage } from '../../pages/game/game.ts';

import { DeckWebService } from '../../providers/deck-web-service.ts';
import { Deck } from '../../data-classes/deck.ts';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController) {

  }

  joinGame(username: string) {
      this.navCtrl.push(GamePage, {
        username: username,
        channel: 'test_channel'
      });
  }
  // Test Method for deckWebService
  getDeck(id: string) {
    var ws = new DeckWebService();
    var text = ws.getDeck(id, (d)=>d.printDeck());
  }


}
