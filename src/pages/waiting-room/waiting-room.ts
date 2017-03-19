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
import {UserWebService} from "../../providers/web-services/user-web-service";
import {User} from "../../data-classes/user";


@Component({
  selector: 'page-waiting-room',
  templateUrl: 'waiting-room.html'
})
export class WaitingRoomPage {

  @ViewChild('userList', {read: List}) userList: List;
  gameStarted: boolean = false;
  room: any;
  shownUsers: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public roomCtrl: RoomFacade) {
    this.room = navParams.data;
    console.log(this.room);
  }

  //Runs everytime a user joins the room
  ionViewDidEnter() {
    console.log('ionViewDidLoad WaitingRoomPage');
    this.updateUserList();
    //this.initializeGame();
  }

  //Updates the list of users in the room
  updateUserList() {
    var that = this;

    this.roomCtrl.getRoom(this.room.id, function (r) {
      var tempArray: Array<User> = [];

      for (var user of r.users) {
        var tempUser = new User(user.username, user.id, user.email);
        tempArray.push(tempUser);
      }
      console.log('Original list of users: ', that.shownUsers);
      that.shownUsers = tempArray;
      that.room = r;

      if (that.room.isRoomReady() == false) {
        setTimeout(that.updateUserList(), 5000);
      }
      else {
        that.joinGame();
      }
      console.log('List of users updated: ', that.shownUsers);
    });
  }


  // sets the appropriate params and navigates to the GamePage
  joinGame() {
    var userWS = new UserWebService();
    var loggedInUser = userWS.getLoggedInUser();
    var userName = loggedInUser.username;

    this.navCtrl.push(GamePage, {
      username: userName,
      room: this.room
    });
  }


  //Checks to see if enough users are there to start the game
  initializeGame() {
    console.log("Initialize Game Attempt");
    var facade = new RoomFacade();
    var that = this;
    facade.isRoomReady(this.room.id, function (result) {
      if (result != true) {
        console.log("not ready", this.room.users);
        setTimeout(that.initializeGame(), 5000);
      } else {
        console.log("Can init");
        that.joinGame();
      }
    });
  }

  updateUserListNew() {
    var that = this;
    this.roomCtrl.getUsersInRoom(this.room.id, function (result) {
      that.shownUsers = result;
      if (result.size == that.room.size) {
        that.roomCtrl.getRoom(that.room.id, function (result) {
          that.room = result;
          that.joinGame();
        });
      } else {
        setTimeout(that.update(), 5000);
      }
    });
  }

}

