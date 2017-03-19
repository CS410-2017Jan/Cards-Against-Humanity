import {UserWebService} from "../web-services/user-web-service";
import {Injectable} from "@angular/core";
/**
 * Created by Sonalee Shah on 3/15/2017.
 */

// ======================================================================
// This Class outlines the methods of UserFacade
// ======================================================================

@Injectable

export class UserFacade {

  private userWebService;

  constructor() {
    this.userWebService = new UserWebService();
  }

  getUser(userID: string, callback) {
    this.userWebService.getUser(userID, callback);
  }

  // TODO: fix return type
  getLoggedInUser(): any {
    return this.userWebService.getLoggedInUser();
  }

  getUserByEmail(email: string, callback) {
    this.userWebService.getUserByEmail(email, callback);
  }

  getUsers(callback) {
    this.userWebService.getAllUsers(callback);
  }

  createUser(username: string, password: string, email: string, callback) {
    this.userWebService.createUser(username, password, email, callback);
  }

  logInUser(email: string, password: string, callback) {
    this.userWebService.logInUser(email, password, callback);
  }

}
