import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the WaitingRoom page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-waiting-room',
  templateUrl: 'waiting-room.html'
})
export class WaitingRoomPage {
  room: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.room = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaitingRoomPage');
  }

}
