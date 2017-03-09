import { Component, ViewChild } from '@angular/core';
import { AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, LoadingController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { WaitingRoomPage } from '../waiting-room/waiting-room';
import { RoomFacade } from '../../data-classes/room-facade';
import {Room} from "../../data-classes/room";
import {UserWebService} from "../../providers/user-web-service";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public roomCtrl: RoomFacade, public alertCtrl: AlertController) {}

  ionViewDidEnter() {
    console.log('ionViewDidLoad RoomListPage');
    this.updateList();
  }

  updateList() {
    this.roomList && this.roomList.closeSlidingItems();

    var that = this;
    this.roomCtrl.getRooms(function(rooms){that.updateRoomList(rooms)});

    console.log('List of rooms updated!');
  }


  updateRoomList(rooms: any){
    console.log('updateRoomList()');
    try {
      console.log(rooms);
      this.listOfRooms = rooms;
      console.log('shown 2', this.listOfRooms);
      console.log(this.listOfRooms[0].name);
    }
    catch(ex)
    {console.log(ex);}
  }


  clickJoinRoom(room: any){
    if (room.isLocked){
      var that = this;
      this.roomCtrl.getRoom(room.id, function(r){that.joinRoomAlert(r)});
    }

    else {
      var userWS = new UserWebService();
      var loggedInUser = userWS.getLoggedInUser();
      var userId = loggedInUser.id;

      var that = this;
      this.roomCtrl.getRoom(room.id, function (r) {
        that.roomCtrl.joinRoom(r, userId, function (m) {
        })
      });
      var that = this;
      this.roomCtrl.getRoom(room.id, function (r) {
        that.goToWaitingRoom(r)
      });
    }
        };





  joinRoomAlert(room:Room) {
    let alert = this.alertCtrl.create({
      title: 'Join',
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Join',
          handler: data => {
            if (this.roomCtrl.attemptRoomPassword(room,data.password)) {
              var userWS = new UserWebService();
              var loggedInUser = userWS.getLoggedInUser();
              var userId = loggedInUser.id;

              var that = this;
              this.roomCtrl.joinRoom(room,userId, function(r){});

              var that = this;
              this.roomCtrl.getRoom(room.id, function (r) {
                that.goToWaitingRoom(r)
              });

            } else {
              alert.dismiss();
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  //Passing the room object as a navparm into the waitingroompage
  goToWaitingRoom(room:any){
    console.log('goToWaitingRoom()');
    console.log(room);
  this.navCtrl.push(WaitingRoomPage, room);
  }


}
