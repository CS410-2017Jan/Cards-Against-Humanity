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
  private userProfile:User; //Can only access through getLoggedInUser()

  constructor() {
    this.userWebService = new UserWebService();
  }

  getLoggedInUser():any {
    return this.userWebService.getLoggedInUser();

    //TODO: Uncomment when logInUser returns a user, remove call to getLoggedInUser, change return type to User
    //return this.userProfile;
  }

  //creates a uses and returns the ID
  createUser(username:string, password:string, email:string, callback) {
    this.userWebService.createUser(username, password, email, callback);
  }

  //Returns a boolean, creates a local copy of user and stores it in the facade
  logInUser(email:string, password:string, callback) {
    this.userWebService.logInUser(email, password, callback);

    //TODO: Uncomment when logInUser returns a user
    /*    var that = this;
     this.userWebService.logInUser(email, password, function(us){
     if (us == error) {
     callback(false);
     } else {
     that.userProfile = us;
     callback(true);
     }
     });*/

  }
}
