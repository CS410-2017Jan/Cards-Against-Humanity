import { Component, ViewChild } from '@angular/core';
import { AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, LoadingController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { WaitingRoomPage } from '../waiting-room/waiting-room';
import { RoomFacade } from '../../data-classes/room-facade';

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
  public shownRooms: any;
  listOfRooms:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public roomCtrl: RoomFacade) {}

  ionViewDidEnter() {
    console.log('ionViewDidLoad RoomListPage');
    this.updateList();
  }

  updateList() {
    this.roomList && this.roomList.closeSlidingItems();

    var that = this;
    this.roomCtrl.getRooms(that.updateRoomList);

    //Test data until method to actually get real data
    this.shownRooms = [
      {"name": "Test1" },
      {"name": "Test2" },
      {"name": "Test3" }
    ];

    console.log('List of rooms updated!');
  }

  updateRoomList(rooms: Array<any>){
    console.log('updateRoomList()');
    try {
      console.log(rooms);
      this.listOfRooms = rooms;
      console.log('shown 2', this.listOfRooms);
    }
    catch(ex)
    {console.log(ex);}
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
