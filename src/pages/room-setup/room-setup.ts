import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { RoomFacade } from '../../providers/facades/room-facade';
import {UserWebService} from "../../providers/web-services/user-web-service";
import {WaitingRoomPage} from "../waiting-room/waiting-room";
import {Player} from "../../data-classes/player";
import {Room} from "../../data-classes/room";


/*
 Generated class for the RoomSetup page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-room-setup',
  templateUrl: 'room-setup.html'
})
export class RoomSetupPage {
  room:{rname?: string, players?:string, rtype?: boolean, rpassword?: string} = {};
  submitted = false;

  constructor(public navCtrl:NavController, public navParams:NavParams, public roomCtrl: RoomFacade) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomSetupPage');
  }

  onSubmit(form:NgForm) {
    this.submitted = true;

    console.log("Name: ", this.room.rname,
      "# of Players: ", this.room.players,
      "Type: ", this.room.rtype,
      "Password: ", this.room.rpassword
    );

    if (form.valid) {
      console.log("valid form!")
    }

    if (form.valid) {
      console.log("Valid form!")

    }

    var userWS = new UserWebService();
    var loggedInUser = userWS.getLoggedInUser();
    console.log('user: ',loggedInUser);

    var userEmail = loggedInUser.email;
    var that = this;

    userWS.getUserByEmail(userEmail, function(p:Player)
    {(that.roomCtrl.createRoom(that.room.rname,p,that.room.rtype,
      function(r:Room){that.goToWaitingRoom(r)},that.room.rpassword))});

  }

  //Passing the room object as a navparm into the waitingroompage
  goToWaitingRoom(room:any){
    this.navCtrl.push(WaitingRoomPage, room);
  }

}
