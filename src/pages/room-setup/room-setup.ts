import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { RoomFacade } from '../../data-classes/room-facade';

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


    //this.roomCtrl.createRoom(this.room.rname, "Test Person",this.room.type,this.room.rpassword);
    //this.joinRoom("this.room", this.goToWaitingRoom,"this.room.password");

  }

  //Passing the room object as a navparm into the waitingroompage
  //goToWaitingRoom(room:any){
  //  //this.navCtrl.push(WaitingRoomPage, room);
  //}

}
