import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { GamePage } from '../../pages/game/game.ts';

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

}
