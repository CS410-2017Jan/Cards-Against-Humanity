import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import PubNub from 'pubnub';

/*
  Generated class for the GamePlay page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-game-play', // should this be game-play-page?
  templateUrl: 'game-play.html'
})
export class GamePlayPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    var pubnub = new PubNub({
      subscribeKey: 'sub-c-a72c3874-e836-11e6-b3b8-0619f8945a4f', // always required
      publishKey: 'pub-c-4c3ec11e-305a-420f-ba3b-265b35ee99e7',   // only required if publishing
      uuid: "userNameTest1",
      presenceTimeout: 30
    });

    pubnub.addListener({
      status: function(statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
          console.log("PNConnectedCategory");
        } else if (statusEvent.category === "PNUnknownCategory") {
          var newState = {
            new: 'error'
          };
          pubnub.setState(
            {
              state: newState
            },
            function (status) {
              console.log(statusEvent.errorData.message)
            }
          );
        }
      },
      message: function(message) {
        console.log(message);
        //renderMsg(message);
      },
      presence: function(p) {
        console.log(p.action)
        //renderPresenceEvent(p);
      }
    })

    console.log("about to subscribe");

    // subscribe to pubnub channel
    pubnub.subscribe({
      channels: ['pubnub_test'],
      withPresence: true
    });

    console.log("about to publish");

    pubnub.publish({
      channel :  "pubnub_test",
      message : "this is a test. po-tay-toe, po-tah-toe"
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamePlayPage');
  }

}
