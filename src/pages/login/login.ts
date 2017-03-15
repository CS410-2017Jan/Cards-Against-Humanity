import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController,NavController} from 'ionic-angular';
import { NgForm } from '@angular/forms';
import {HomePage} from "../home/home";
import {TabsPage} from "../tabs/tabs";
import {UserWebService} from "../../providers/web-services/user-web-service";


/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  user:{email?: string, password?:string} = {};
  submitted = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {}


  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  clickLogin(form:NgForm) {
    this.submitted = true;

    console.log("email: ", this.user.email,
      "# of Players: ", this.user.password
    );

    if (form.valid) {
      console.log("Valid form!")
    }

    //this.navCtrl.push(TabsPage); //Here temporarily

    var userWS = new UserWebService();
    var that = this;
    userWS.logInUser(this.user.email, this.user.password, function(b: boolean){that.handleLogin(b)});
  }

  handleLogin(b:boolean){
    if (b) {
      console.log("User had logged in!");
      this.navCtrl.push(TabsPage);
  }

  }

  openModal() {
    let modal = this.modalCtrl.create(SignUpModalPage);
    modal.present();
  }
}


@Component({
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>
      Account Creation
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">Cancel</span>
        <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
  <ion-list>

  <form #userForm="ngForm">
    <ion-item>
      <ion-label fixed>Email</ion-label>
      <ion-input type="email" [(ngModel)]="user.email" name="email" #email="ngModel" ></ion-input>
    </ion-item>

    <ion-item>
      <ion-label fixed>Username</ion-label>
      <ion-input type="text" [(ngModel)]="user.username" name="username" #username="ngModel" ></ion-input>
    </ion-item>

    <ion-item>
      <ion-label fixed>Password</ion-label>
      <ion-input type="password" [(ngModel)]="user.password" name="password" #password="ngModel" ></ion-input>
    </ion-item>

    <ion-item>
      <button ion-button full (click)="clickCreateAccount(userForm)" type="submit" >Signup</button>
</ion-item>

</form>
  </ion-list>
</ion-content>
`
})
export class SignUpModalPage {
  user:{email?: string, username?:string, password?:string} = {};
  submitted = false;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {}

  clickCreateAccount(form:NgForm) {
    console.log("Account create clicked!");

    console.log("email: ", this.user.email,
      "# of Players: ", this.user.password
    );

    var userWS = new UserWebService();
    var that = this;
    userWS.createUser(this.user.username, this.user.password, this.user.email, function(s: string){that.userCreatedSuccess(s)});
  }

  userCreatedSuccess(id:string){
    console.log("Account create clicked!", id);
    this.viewCtrl.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
