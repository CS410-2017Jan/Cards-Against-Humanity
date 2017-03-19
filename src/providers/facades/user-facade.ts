import {UserWebService} from "../web-services/user-web-service";
/**
 * Created by Sonalee Shah on 3/15/2017.
 */

// ======================================================================
// This Class outlines the methods of UserFacade
// ======================================================================
export class UserFacade {

  constructor() {
  }

  getUser(userID: string, callback) {
    var userWS = new UserWebService();
    userWS.getUser(userID, callback);
  }

  // TODO: fix return type
  getLoggedInUser(): any {
    var userWS = new UserWebService();
    return userWS.getLoggedInUser();
  }

  getUserByEmail(email: string, callback) {
    var userWS = new UserWebService();
    userWS.getUserByEmail(email, callback);
  }

  getUsers(callback) {
    var userWS = new UserWebService();
    userWS.getAllUsers(callback);
  }

  createUser(username: string, password: string, email: string, callback) {
    var userWS = new UserWebService();
    userWS.createUser(username, password, email, callback);
  }

  logInUser(email: string, password: string, callback) {
    var userWS = new UserWebService();
    userWS.logInUser(email, password, callback);
  }

}
