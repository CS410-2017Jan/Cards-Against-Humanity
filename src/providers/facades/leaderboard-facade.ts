import {UserWebService} from "../web-services/user-web-service";
import {Injectable} from "@angular/core";
import {User} from "../../data-classes/user";
/**
 * Created by Sonalee Shah on 3/23/2017.
 */

// ======================================================================
// This Class outlines the methods of LeaderboardFacade
// ======================================================================

@Injectable()
export class LeaderboardFacade {

  private userWebService;

  constructor() {
    this.userWebService = new UserWebService();
  }

  // Calls callback with users sorted by descending scores
  getScores(callback) {
    this.userWebService.getAllUsers(function (users: Array<User>) {
      var sortedUsers = users.sort(function (a, b) {
        var keyA = a.score;
        var keyB = b.score;
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
      });
      callback(sortedUsers);
    });
  }

}
