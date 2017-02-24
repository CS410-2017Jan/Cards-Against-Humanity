import { Component, ViewChild } from '@angular/core';
import { AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, NavParams, LoadingController } from 'ionic-angular';

/*
  Generated class for the WaitingRoom page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
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
  ionViewDidLoad() {
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

  //Checks to see if enough players are there to start the game
  initializeGame(){

    //if (shownPlayers.count = 3){
      //Send the player to the GamePage with either the room or player data
      //this.navCtrl.push(GamePage, roomDate);
    //}
}

}
