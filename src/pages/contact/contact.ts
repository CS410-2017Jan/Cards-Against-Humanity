import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { GamePage } from '../../pages/game/game.ts';

import { DeckWebService } from '../../providers/deck-web-service.ts';
import { UserWebService } from '../../providers/user-web-service.ts';
import { RoomWebService } from '../../providers/room-web-service.ts';

import { Deck } from '../../data-classes/deck';
import { Player } from '../../data-classes/player';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController) {

  }

  joinGame(username: string) {
    var Contact = this;

    var players = [];
    players[0] = new Player('Player1', 'P1');
    players[1] = new Player('Player2', 'P2');
    players[2] = new Player('Player3', 'P3');

    var ws = new DeckWebService();
    ws.getDeck('-KdfzixNq1S7IF_LGlCj', function(d) {Contact.setUpGame(username, d, players)});
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

  // Tests for RoomWebService
  addRoom(name,decks,user, password ?: string){
    var ws = new RoomWebService();
    ws.createRoom(name, decks,user,console.log,password);
  }
  getRoom(id:string){
    var ws = new RoomWebService();
    ws.getRoom(id, console.log);
  }
  getRooms(){
    var ws = new RoomWebService();
    ws.getAllRooms(console.log);
  }
  joinRoom(userID: String, roomID: String){
    var ws = new RoomWebService();
    ws.joinRoom(userID, roomID, console.log, "DummyPassword");
  }

  setUpGame(username: string, deck: Deck, players: Array<Player>) {
    // TODO: fix channel bug
    // Having only one channel is a serious bug... two devs can't test on one channel...
    this.navCtrl.push(GamePage, {
      username: username,
      channel: 'test_channel_2',
      deck: deck,
      players: players
    });
  }

}
