import { Component, ViewChild } from '@angular/core';
import { AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, NavParams, LoadingController } from 'ionic-angular';
import { RoomFacade } from '../../data-classes/room-facade';
import { GamePage } from '../../pages/game/game.ts';
import {UserWebService} from "../../providers/user-web-service";


@Component({
  selector: 'page-waiting-room',
  templateUrl: 'waiting-room.html'
})
export class WaitingRoomPage {

  @ViewChild('playerList', { read: List }) playerList: List;
  gameStarted: boolean = false;
  room: any;
  shownPlayers: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public roomCtrl: RoomFacade) {
    this.room = navParams.data;
    console.log(this.room);
  }

  //Runs everytime a player joins the room
  ionViewDidEnter() {
    console.log('ionViewDidLoad WaitingRoomPage');
    this.updatePlayerList();
    this.initializeGame();
  }

  //Updates the list of players in the room
  updatePlayerList(){
    var that = this;
    this.roomCtrl.getRoom(this.room.id,function(r){
      that.shownPlayers = r.players;
      that.room = r;
      setTimeout(that.updatePlayerList(),5000);
      console.log('List of players updated: ', that.shownPlayers);
    });

  }

  // sets the appropriate params and navigates to the GamePage
  joinGame() {
    var userWS = new UserWebService();
    var loggedInUser = userWS.getLoggedInUser();
    var userName = loggedInUser.id;

      this.navCtrl.push(GamePage, {
        username: userName,
        room: this.room
      });
    }


  //Checks to see if enough players are there to start the game
  initializeGame(){
    console.log("Initialize Game Attempt");
    var facade = new RoomFacade();
    var that = this;
    facade.isRoomReady(this.room.id, function (result) {
      if (result != true) {
        console.log("not ready", this.room.players);
        setTimeout(that.initializeGame(), 5000);
      } else {
        console.log("Can init");
        that.joinGame();
      }
    });

}

}

