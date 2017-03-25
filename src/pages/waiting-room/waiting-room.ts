import {Component, ViewChild} from '@angular/core';
import {
  List,
  NavController,
  NavParams
} from 'ionic-angular';
import {RoomFacade} from '../../providers/facades/room-facade';
import {GamePage} from '../../pages/game/game.ts';
import {UserFacade} from "../../providers/facades/user-facade";


@Component({
  selector: 'page-waiting-room',
  templateUrl: 'waiting-room.html'
})
export class WaitingRoomPage {

  @ViewChild('userList', {read: List}) userList: List;
  room: any;
  shownUsers: any = [];
  result: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public roomCtrl: RoomFacade, public userCtrl: UserFacade) {
    this.room = navParams.data;
    console.log(this.room);
  }

  //Runs everytime a user joins the room
  ionViewDidEnter() {
    console.log('ionViewDidLoad WaitingRoomPage');
    this.updateUserList();
  }

  //Runs when the page has finished leaving and is no longer the active page.
  ionViewDidLeave() {
    //this.leaveRoom();
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

  leaveRoom() {
    console.log('Leave Room: 1', this.room);
    this.roomCtrl.removeUser(this.room,this.userCtrl.getLoggedInUser(),function(m){});
    console.log('Leave Room: 2', this.room);
  }

}

