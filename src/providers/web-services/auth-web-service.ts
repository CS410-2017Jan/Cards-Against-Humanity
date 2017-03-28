import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/map';
import {User} from "../../data-classes/user";
import { AngularFire } from 'angularfire2';
import {UserWebService} from "./user-web-service";


/*
 Generated class for the AuthWebService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.

 author: toldham
 */
@Injectable()

export class AuthWebService {

  // Note- authorization uses the tutorial here- http://stackoverflow.com/questions/37322747/using-mail-and-password-to-authenticate-via-the-rest-api-firebase
  AUTH_API_KEY = "AIzaSyDPItjle-Fe8L__6SxkZFE71Of0NDBY0u0";
  REGISTRATION_URL = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=";
  LOGIN_URL = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=";
  ACCOUNT_INFO_URL = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=<my-firebase-api-key>";


  constructor(public af: AngularFire) {
  }

  
  // Creates a user in the firebase users (different from our user db) and calls the callback with true if it succeeded
  createFirebaseUser(email: string, password: string, callback: (b: boolean)=> void) {
    
  }

  // Authenticates the user- calls the callback with that user if the credentials were correct
  logInUser(email: string, password: string, callback: (u: User)=>void) {
    // attempt login
    this.af.auth.login(email, password).then(function (result) {
          console.log(result);
          var ws = new UserWebService();
          ws.getUserByEmail(email, callback);
    });
  }

}