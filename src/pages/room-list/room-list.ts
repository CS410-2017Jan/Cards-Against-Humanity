import { Component, ViewChild } from '@angular/core';
import { AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, LoadingController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { WaitingRoomPage } from '../waiting-room/waiting-room';

/*
  Generated class for the RoomList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-room-list',
  templateUrl: 'room-list.html'
})
export class RoomListPage {

  @ViewChild('roomList', { read: List }) roomList: List;

  queryText = '';
  shownRooms: any = [];


  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomListPage');
    this.updateList();
  }

  updateList() {
    this.roomList && this.roomList.closeSlidingItems();

    //Test data until method to actually get real data
    this.shownRooms = [
      {"name": "Test1" },
      {"name": "Test2" },
      {"name": "Test3" }
    ];

    //this.shownRooms = data.shownRooms;
    console.log('List of rooms updated!');
  }

  joinRoomModal(roomData: any){
    if (roomData.name == "Test2"){
      //Enter Password Modal will appear
      //Replace Test2 with field: Type
    }
    else
      this.navCtrl.push(WaitingRoomPage, roomData);
  }



}
