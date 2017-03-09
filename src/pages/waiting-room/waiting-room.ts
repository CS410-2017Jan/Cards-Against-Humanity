import { Component, ViewChild } from '@angular/core';
import { AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, NavParams, LoadingController } from 'ionic-angular';
import { RoomFacade } from '../../data-classes/room-facade';
import { GamePage } from '../../pages/game/game.ts';


@Component({
  selector: 'page-waiting-room',
  templateUrl: 'waiting-room.html'
})
export class WaitingRoomPage {

  @ViewChild('playerList', { read: List }) playerList: List;

  room: any;
  shownPlayers: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.room = navParams.data;
  }

  //Runs everytime a player joins the room
  ionViewDidEnter() {
    console.log('ionViewDidLoad WaitingRoomPage');
    this.updatePlayerList();
    this.initializeGame();
  }

  //Updates the list of players in the room
  //Test data until method to actually get real data
  updatePlayerList(){
    this.shownPlayers = [
      {"name": "Scott" },
      {"name": "JJ" },
      {"name": "Thomas" }
    ];

    //this.shownRooms = data.shownRooms;
    console.log('List of players updated!');
  }

  // sets the appropriate params and navigates to the GamePage
  joinGame() {
    var username; // TODO: need to set username here
    if (username != undefined) {
      this.navCtrl.push(GamePage, {
        username: username,
        room: this
      });
    }
  }

  //Checks to see if enough players are there to start the game
  initializeGame() {
    console.log("Initialize Game Attempt");
    //var facade = new RoomFacade();
    //var that = this;
    //facade.isRoomReady(this.room.id, function (result) {
    //  if (result != true) {
    //    console.log("not ready");
    //    setTimeout(that.initializeGame(), 5000);
    //  } else {
    //    console.log("Can init");
    //    that.joinGame();
    //  }
    //});
  }

}
