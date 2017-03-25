import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {NgForm} from '@angular/forms';
import {RoomFacade} from '../../providers/facades/room-facade';
import {UserWebService} from "../../providers/web-services/user-web-service";
import {WaitingRoomPage} from "../waiting-room/waiting-room";
import {Room} from "../../data-classes/room";
import {User} from "../../data-classes/user";
import {UserFacade} from "../../providers/facades/user-facade";


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
  room: {rname?: string, rsize?: number, rtype?: boolean, rpassword?: string} = {};
  submitted = false;
  showPassword;

  constructor(public navCtrl: NavController,
              public roomCtrl: RoomFacade,
              public userCtrl: UserFacade) {
    this.showPassword = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomSetupPage');
  }

  clickShowPassword(){
    console.log('Are you hidden? ', this.showPassword);
    if (this.showPassword == false){
      this.showPassword = true;
    }else{
      this.showPassword = false;
    }
  }

  onSubmit(form: NgForm) {
    this.submitted = true;

    console.log("Name: ", this.room.rname,
      "# of Users: ", this.room.rsize,
      "Type: ", this.room.rtype,
      "Password: ", this.room.rpassword
    );

    if (form.valid) {
      console.log("valid form!")
    }

    var loggedInUser = this.userCtrl.getLoggedInUser();
    console.log('user: ', loggedInUser);

    var userEmail = loggedInUser.email;
    var that = this;

    this.userCtrl.getUserByEmail(userEmail, function (u: User) {
      that.roomCtrl.createRoom(that.room.rname, u, that.room.rtype, function (r: Room) {
        that.goToWaitingRoom(r);
      }, that.room.rsize, that.room.rpassword);
    });

  }

  //Passing the room object as a navparm into the waitingroompage
  goToWaitingRoom(room: any) {
    this.navCtrl.push(WaitingRoomPage, room);
  }

}
