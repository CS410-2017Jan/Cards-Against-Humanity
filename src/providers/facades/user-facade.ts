import {UserWebService} from "../web-services/user-web-service";
import {Injectable} from "@angular/core";
import {User} from "../../data-classes/user";
/**
 * Created by Sonalee Shah on 3/15/2017.
 */

// ======================================================================
// This Class outlines the methods of UserFacade
// ======================================================================

@Injectable()
export class UserFacade {

  private userWebService;
  private userProfile: User;

  constructor() {
    this.userWebService = new UserWebService();
  }

  getLoggedInUser(): any {
    return this.userProfile;
  }

  getUserByEmail(email: string, callback) {
    this.userWebService.getUserByEmail(email, callback);
  }

  //Creates a user and calls callback with their ID
  createUser(username: string, password: string, email: string, callback) {
    this.userWebService.createUser(username, password, email, callback);
  }

  // Calls callback with boolean value representing if the upload was successful
  addProfilePicture(base64Image: string, callback) {
    var that = this;
    this.userWebService.addProfilePicture(this.userProfile.id, base64Image, function (success: boolean) {
      if (success) {
        that.userProfile.base64Image = base64Image;
      }
      callback(success);
    });
  }

  // Calls callback with boolean value representing if the email reset was successful
  updateEmail(newEmail: string, callback) {
    var that = this;
    this.userWebService.updateEmail(this.userProfile.id, newEmail, function (success: boolean) {
      if (success) {
        that.userProfile.email = newEmail;
      }
      callback(success);
    });
  }

  // Calls callback with boolean value representing if the password reset was successful
  updatePassword(newPassword: string, callback) {
    this.userWebService.updatePassword(this.userProfile.id, newPassword, function (success: boolean) {
      callback(success);
    });
  }

  // Calls callback with the users' new score
  updateScore(deltaScore: number, callback) {
    var that = this;
    this.userWebService.addScore(this.userProfile.id, deltaScore, function (newScore: number) {
      that.userProfile.score = newScore;
      callback(newScore);
    });
  }

  //Returns a boolean, creates a local copy of user and stores it in the facade
  logInUser(email: string, password: string, callback) {
    var that = this;
    this.userWebService.logInUser(email, password, function (user: User) {
      if (user == undefined) {
        callback(false);
      } else {
        that.userProfile = user;
        callback(true);
      }
    });
  }
}
