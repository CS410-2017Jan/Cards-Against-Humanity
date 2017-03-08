import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { GamePage } from '../../pages/game/game.ts';

import { DeckWebService } from '../../providers/deck-web-service.ts';
import { UserWebService } from '../../providers/user-web-service.ts';
import { RoomWebService } from '../../providers/room-web-service.ts';

import { Deck } from '../../data-classes/deck';
import { Player } from '../../data-classes/player';
import {Room} from "../../data-classes/room";
import {RoomFacade} from "../../data-classes/room-facade";


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController) {

  }

  joinGame(username: string, channel: string) {
    var Contact = this;

    var players = [];
    players[0] = new Player('Player1', 'P1');
    players[1] = new Player('Player2', 'P2');
    players[2] = new Player('Player3', 'P3');

    var ws = new DeckWebService();
    ws.getDeck('-KdfzixNq1S7IF_LGlCj', function(d) { Contact.setUpGame(username, d, players, channel); });
  }

  // Test Method for deckWebService
  getDeck(id: string) {
    var ws = new DeckWebService();
    ws.getDeck(id, (d)=>d.printDeck());
  }

  // Test Methods for userWebService
  addUser(username: string, pass: string, email: string){
    var ws = new UserWebService();
    ws.createUser(username,pass,email, console.log);
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
    ws.getRoom(id, function(r){console.log(r)});
  }
  getRooms(){
    var ws = new RoomWebService();
    ws.getAllRooms(console.log);
  }
  joinRoom(userID: String, roomID: String){
    var ws = new RoomWebService();
    ws.joinRoom(userID, roomID, console.log);
  }
  leaveRoom(userID: String, roomID: String){
    var ws = new RoomWebService();
    ws.leaveRoom(userID, roomID, console.log);
  }

  // Tests for RoomFacade
  addRoomUsingFacade(name: string, userID: string, isLocked: boolean, password?: string){
    var player = new Player("Scott", userID);
    var facade = new RoomFacade();
    facade.createRoom(name, player, isLocked, function(r){console.log("Added Room: " + JSON.stringify(r))}, password);
  }
  getRoomUsingFacade(id:string){
    var facade = new RoomFacade();
    facade.getRoom(id, function(r){console.log("Got Room: " + JSON.stringify(r))});
  }
  getRoomsUsingFacade(){
    var facade = new RoomFacade();
    facade.getRooms(function(r){console.log("Got Rooms: " + JSON.stringify(r))});
  }
  attemptPasswordUsingFacade() {
    var facade = new RoomFacade();
    var tempDeck = new Deck('-KdfzixNq1S7IF_LGlCj');
    var tempArr = [];
    tempArr.push(tempDeck);
    var room = new Room(tempArr, true, "Facade Test Room", "TESTING123", 3, "-KdlnkB7A6azsa9PldEI");
    console.log("Expect true :" + facade.attemptRoomPassword(room, "TESTING123"));
    console.log("Expect false :" + facade.attemptRoomPassword(room, "FAIL"));
  }
  joinRoomUsingFacade(userID: string){
    var facade = new RoomFacade();
    var tempDeck = new Deck('-KdfzixNq1S7IF_LGlCj');
    var tempArr = [];
    tempArr.push(tempDeck);
    var room = new Room(tempArr, true, "Facade Test Room", "TESTING123", 3, "-KdlnkB7A6azsa9PldEI");
    facade.joinRoom(room, userID, function(response){alert(response);}, "TESTING123");
  }
  leaveRoomUsingFacade(userID: string){
    var facade = new RoomFacade();
    var tempDeck = new Deck('-KdfzixNq1S7IF_LGlCj');
    var tempArr = [];
    tempArr.push(tempDeck);
    var room = new Room(tempArr, true, "Facade Test Room", "TESTING123", 3, "-KdlnkB7A6azsa9PldEI");
    facade.removePlayer(room, userID, console.log);
  }
  isRoomReadyUsingFacade(roomID: string) {
    var facade = new RoomFacade();
    facade.isRoomReady(roomID, console.log);
  }

  setUpGame(username: string, deck: Deck, players: Array<Player>, channel: string) {
    var room = new Room([deck], false, 'testRoom', 'password', 3, channel, players);

      this.navCtrl.push(GamePage, {
        username: username,
        room: room
      });
    }
}
