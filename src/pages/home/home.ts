import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Camera } from 'ionic-native';
import { UserWebService } from '../../providers/web-services/user-web-service.ts';
import {UserFacade} from "../../providers/facades/user-facade";
import { NgForm } from '@angular/forms';


@Component({
  selector: 'page-home',
  templateUrl: './home.html'
})
export class HomePage {

  //loadProgress: number = 0;
  options;
  usere: {email?: string} = {};
  userp: {password?:string} = {};
  submitted = false;
  profileUserName: string = "";

  constructor(public userCtrl: UserFacade, private toastCtrl: ToastController) {
    this.profileUserName = this.userCtrl.getLoggedInUser().username;
  }

  //https://github.com/joshuamorony/ionic2-progress-component/blob/master/src/pages/home/home.ts
  ionViewDidLoad(){
    /*setInterval(() => {

      if(this.loadProgress < 30){
        this.loadProgress++;
      }

    }, 1000);*/

  }

  //Method called when the user clicks update email
  clickModifyEmail(form: NgForm) {
    console.log("clickModifyAccountInfo()");

    console.log("Email changed to: ", this.usere.email);

    var that = this;
    this.userCtrl.updateEmail(this.usere.email, function (b) {
      console.log("updateEmail is being called in home.ts");
      that.renderEmailToast(b);
    });
  }

  //Toast that lets the user know their email has been updated
   renderEmailToast(b) {
     console.log(b,'render the toast');
    if (b) {
      let toast = this.toastCtrl.create({
        message: 'Email was updated successfully!',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
    else{
      let toast = this.toastCtrl.create({
        message: 'Error: Email was not updated.',
        duration: 3000,
        position: 'top'
      });
      toast.present();

    }
  }

  //Method called when the user clicks update email
  clickModifyPassword(form: NgForm) {
    console.log("clickModifyPassword()");

    console.log("Email changed to: ", this.userp.password);

    var that = this;
    this.userCtrl.updatePassword(this.userp.password, function (b) {
      that.renderPasswordToast(b);
    });
  }

  //Toast that lets the user know their email has been updated
  renderPasswordToast(b) {
    if (b) {
      let toast = this.toastCtrl.create({
        message: 'Password was updated successfully!',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
      else{
      let toast = this.toastCtrl.create({
        message: 'Error: Password was not updated.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      }
    }


  onSuccess() {
    console.log("Camera cleanup success.");

    let toast = this.toastCtrl.create({
      message: 'Profile picture added!',
      duration: 3000,
      position: 'top'
    });
  }

  static onFail(message) {
    console.log('Failed because: ' + message);
  }

  clickUploadProfilePic(){
    console.log('Button clicked!');
    Camera.getPicture(
      {quality: 5, destinationType: Camera.DestinationType.DATA_URL}).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;

      // TEST
      //var ws = new UserWebService();
      //ws.addProfilePicture("-KfoDlgOu1JHgkqsdAT0", base64Image, console.log);

      this.userCtrl.addProfilePicture(base64Image, function(f){});

    }, (e) => {
      console.log("error", e);
      // Handle error
    });

  }

}
