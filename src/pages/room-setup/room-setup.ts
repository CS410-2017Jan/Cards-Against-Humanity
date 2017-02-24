import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

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

  constructor(public navCtrl:NavController, public navParams:NavParams) {
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
      //this.room-class.create(this.room.rname,
      //this.room.players,
      //this.room.rtype,
      //this.room.rpassword);
    }

    //this.navCtrl.push(waiting-room);
  }

}
