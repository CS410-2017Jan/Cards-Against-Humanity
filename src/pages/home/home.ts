import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { UserWebService } from '../../providers/web-services/user-web-service.ts';

@Component({
  selector: 'page-home',
  templateUrl: './home.html'
})
export class HomePage {

  options;

  constructor() {
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
      {quality: 5, destinationType: Camera.DestinationType.DATA_URL}).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;

      // TEST
      var ws = new UserWebService();
      ws.addProfilePicture("-KfoDlgOu1JHgkqsdAT0", base64Image, console.log);

    }, (e) => {
      console.log("error", e);
      // Handle error
    });

  }

}
