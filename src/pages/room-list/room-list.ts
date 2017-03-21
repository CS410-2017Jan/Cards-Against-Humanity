import {Component, ViewChild} from '@angular/core';
import {
  AlertController,
  App,
  FabContainer,
  ItemSliding,
  List,
  ModalController,
  NavController,
  LoadingController,
  NavParams
} from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {WaitingRoomPage} from '../waiting-room/waiting-room';
import {RoomFacade} from '../../providers/facades/room-facade';
import {Room} from "../../data-classes/room";
import {UserWebService} from "../../providers/web-services/user-web-service";
import {UserFacade} from "../../providers/facades/user-facade";
import {User} from "../../data-classes/user";

@Component({
  selector: 'page-room-list',
  templateUrl: 'room-list.html'
})
export class RoomListPage {

  @ViewChild('roomList', {read: List}) roomList: List;

  queryText = '';
  listOfRooms: any;
  isJoinModalOpen: boolean;
  loggedInUser: User;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public roomCtrl: RoomFacade,
              public alertCtrl: AlertController,
              public userCtrl: UserFacade) {
    this.isJoinModalOpen = false;
    this.loggedInUser = this.userCtrl.getLoggedInUser();
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad RoomListPage');
    this.updateList();
  }

  //Gets called when the player enters the screen, upates the list
  updateList() {
    this.roomList && this.roomList.closeSlidingItems();
    var that = this;
    this.roomCtrl.getRooms(function (rooms) {
      that.listOfRooms = rooms;
    });

  }

  //Called when a user clicks on a room, takes in a partial room object
  clickJoinRoom(room: any) {
    console.log('ClickJoinRoom() ', this.isJoinModalOpen);
    console.log('Current Room: ', room);

    if (this.isJoinModalOpen == false) {
      this.isJoinModalOpen = true;
      console.log('JoinModalOpen: ', this.isJoinModalOpen);

      if (room.isLocked) {
        console.log('Private Room: ', room);
        var that = this;
        this.roomCtrl.getRoom(room.id, function (r) {
          that.joinRoomAlert(r)
        });
      }
      else {
        console.log('Public Room: ', room);
        var that = this;
        this.roomCtrl.getRoom(room.id, function (r) {
          that.roomCtrl.joinRoom(r,that.loggedInUser, function (m) {
            that.goToWaitingRoom(m)})});
      }
    }
  };

  //Modal for private rooms
  joinRoomAlert(room: Room) {
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
          }
        },
        {
          text: 'Join',
          handler: data => {
            if (this.roomCtrl.attemptRoomPassword(room, data.password)) {
              var that = this;
              this.roomCtrl.joinRoom(room, this.loggedInUser, function (m) {
                that.goToWaitingRoom(m)
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
  goToWaitingRoom(room: Room) {
    this.isJoinModalOpen = false;
    console.log('goToWaitingRoom(): ', room);
    this.navCtrl.push(WaitingRoomPage, room);
  }


}
