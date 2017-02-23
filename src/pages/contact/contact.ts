import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { GamePage } from '../../pages/game/game.ts';

import { DeckWebService } from '../../providers/deck-web-service.ts';
import { UserWebService } from '../../providers/user-web-service.ts';

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
    ws.getDeck(id, (d)=>d.printDeck());
  }

  // Test Methods for userWebService
  addUser(username: string, pass: string){
    var ws = new UserWebService();
    ws.createUser(username,pass, console.log);
  }

  getUsers(){
    var ws = new UserWebService();
    ws.getAllUsers(this.printUsers);
  }

  getUser(id){
    var ws = new UserWebService();
    ws.getUser(id, (p) => p.print());
  }

  printUsers(users){
    for (let p of users ){
      p.print();
    }
  }


}
