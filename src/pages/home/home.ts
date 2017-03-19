import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  options;

  constructor(public navCtrl: NavController) {
  }

  static onSuccess() {
    console.log("Camera cleanup success.");
  }

  static onFail(message) {
    console.log('Failed because: ' + message);
  }

  clickButton(){
    console.log('Button clicked!');
    Camera.getPicture(
      {quality: 25, destinationType: Camera.DestinationType.DATA_URL}).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (e) => {
      console.log("error", e);
      // Handle error
    });

  }

}
