import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { GamePage } from '../../pages/game/game.ts';

import { DeckWebService } from '../../providers/web-services/deck-web-service.ts';
import { UserWebService } from '../../providers/web-services/user-web-service.ts';
import { RoomWebService } from '../../providers/web-services/room-web-service.ts';

import { Deck } from '../../data-classes/deck';
import { Player } from '../../data-classes/player';
import {Room} from '../../data-classes/room';
import {RoomFacade} from '../../providers/facades/room-facade';
import {LeaderboardFacade} from "../../providers/facades/leaderboard-facade";
import {UserFacade} from "../../providers/facades/user-facade";


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
    players[3] = new Player('Player4', 'P4');
    players[4] = new Player('Player5', 'P5');

    var ws = new DeckWebService();
    ws.getDeck('-KdfzixNq1S7IF_LGlCj', function(d) { Contact.setUpGame(username, d, players, channel); });
  }

  setUpGame(username: string, deck: Deck, players: Array<Player>, channel: string) {
    var room = new Room([deck], false, 'testRoom', players.length, channel, players);

    this.navCtrl.push(GamePage, {
      username: username,
      room: room
    });
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
    ws.getUser(id, console.log);
  }

  incScore(id){
    var ws = new UserWebService();
    ws.addScore(id,1, console.log);
  }

  getPic(id){
    var ws = new UserWebService();
    ws.getProfilePicture(id,console.log);
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
  getUsersInRoom(id: string){
    var ws = new RoomWebService();
    ws.getUsersInRoom(id, function(r){console.log(r)});
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
    var player = new Player('Scott', userID);
    var facade = new RoomFacade();
    facade.createRoom(name, player, isLocked, function(r){console.log('Added Room: ' + JSON.stringify(r))}, 3, password);
  }
  getRoomUsingFacade(id:string){
    var facade = new RoomFacade();
    facade.getRoom(id, function(r){console.log('Got Room: ' + JSON.stringify(r))});
  }
  getRoomsUsingFacade(){
    var facade = new RoomFacade();
    facade.getOpenRooms(function(r){console.log('Got Rooms: ' + JSON.stringify(r))});
  }
  attemptPasswordUsingFacade() {
    var facade = new RoomFacade();
    var tempDeck = new Deck('-KdfzixNq1S7IF_LGlCj');
    var tempArr = [];
    tempArr.push(tempDeck);
    var room = new Room(tempArr, true, 'Facade Test Room', 3, '-KdlnkB7A6azsa9PldEI', undefined, 'TESTING123');
    console.log('Expect true :' + facade.attemptRoomPassword(room, 'TESTING123'));
    console.log('Expect false :' + facade.attemptRoomPassword(room, 'FAIL'));
  }
  joinRoomUsingFacade(userID: string){
    var us = new UserWebService();
    var facade = new RoomFacade();
    var tempDeck = new Deck('-KdfzixNq1S7IF_LGlCj');
    var tempArr = [];
    tempArr.push(tempDeck);
    us.getUser(userID, function (user) {
      var room = new Room(tempArr, false, 'Facade Test Room', 3, '-KfonD5i6TnHb0yFDfYz', undefined, undefined);
      facade.joinRoom(room, user, function(response){alert(response);});
    });
  }
  leaveRoomUsingFacade(userID: string){
    var facade = new RoomFacade();
    var tempDeck = new Deck('-KdfzixNq1S7IF_LGlCj');
    var tempArr = [];
    tempArr.push(tempDeck);

    var us = new UserWebService();
    us.getUser(userID, function (user) {
      var room = new Room(tempArr, false, 'Facade Test Room', 3, '-KfonD5i6TnHb0yFDfYz', undefined, undefined);
      facade.removeUser(room, user, console.log);
    });
  }
  isRoomReadyUsingFacade(roomID: string) {
    var facade = new RoomFacade();
    //facade.isRoomReady(roomID, console.log);
  }
  getScoresUsingFacade() {
    var facade = new LeaderboardFacade();
    facade.getScores(function (response) {

    });
  }
  updateScoreUsingFacade() {
    var facade = new UserFacade();
    //facade.updateScore(10, function (response) {});
  }

  // Authentication test
  testAuth(email: string, password: string){
    var ws = new UserWebService();
    ws.logInUser(email, password, console.log);
  }

  // Find user by email test
  testFBE(email: string){
    var ws = new UserWebService();
    ws.getUserByEmail(email, console.log);
  }


}
