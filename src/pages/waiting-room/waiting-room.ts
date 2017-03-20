import {Component, ViewChild} from '@angular/core';
import {
  AlertController,
  App,
  FabContainer,
  ItemSliding,
  List,
  ModalController,
  NavController,
  NavParams,
  LoadingController
} from 'ionic-angular';
import {RoomFacade} from '../../providers/facades/room-facade';
import {GamePage} from '../../pages/game/game.ts';
import {User} from "../../data-classes/user"; //Remove when removing updateUserList()
import {UserFacade} from "../../providers/facades/user-facade";


@Component({
  selector: 'page-waiting-room',
  templateUrl: 'waiting-room.html'
})
export class WaitingRoomPage {

  @ViewChild('userList', {read: List}) userList: List;
  room: any;
  shownUsers: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public roomCtrl: RoomFacade, public userCtrl: UserFacade) {
    this.room = navParams.data;
    console.log(this.room);
  }

  //Runs everytime a user joins the room
  ionViewDidEnter() {
    console.log('ionViewDidLoad WaitingRoomPage');
    this.updateUserList();
  }

  //Updates the list of users in the room
  updateUserList() {
    var that = this;
    this.roomCtrl.getUsersInRoom(this.room.id, function (result) {
      that.shownUsers = result;
      if (result.length == that.room.size) {
        that.roomCtrl.getRoom(that.room.id, function (result) {
          that.room = result;
          that.joinGame();
        });
      } else {
        setTimeout(that.updateUserList(), 5000);
      }
    });
  }

  // sets the appropriate params and navigates to the GamePage
  joinGame() {
    var loggedInUser = this.userCtrl.getLoggedInUser();
    var userName = loggedInUser.username;

    this.navCtrl.push(GamePage, {
      username: userName,
      room: this.room
    });
  }

}

