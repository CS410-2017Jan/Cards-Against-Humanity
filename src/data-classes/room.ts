import { Deck } from "./deck";
import { RoomWebService } from "../providers/web-services/room-web-service";
import { UserWebService } from "../providers/web-services/user-web-service";
import { User } from "./user";
/**
 * Created by Sonalee Shah on 2/24/2017.
 */

// ======================================================================
// This Class outlines the data structure of a Room
// ======================================================================
export class Room {
  id: string;
  decks: Array<Deck>;
  isLocked: Boolean;
  name: string;
  password: string;
  users: Array<User>;
  size: number;

  // @param id will be generated in DB and assigned after calling createRoom method
  constructor(decks: Array<Deck>, isLocked: Boolean, name: string, password: string,
              size: number, id?: string, users?: Array<User>) {
    this.decks = decks;
    this.isLocked = isLocked;
    this.name = name;
    this.password = password;
    this.size = size;

    if (id) {
      this.id = id;
    } else {
      this.id = "";
    }

    if (users) {
      this.users = users;
    } else {
      this.users = [];
    }

    //this.creator = "";
  }

  // Add user to room in DB
  // Updates list of users in Room object
  // Returns true if addition was successful
  addUser(userID: string, fn) {
    var Room = this;
    var rs = new RoomWebService();
    rs.joinRoom(userID, this.id, function(d) {fn(Room.updateUserList(d))});
  }

  // Removes user from room in DB
  // Updates list of users in Room object
  // Returns true if removal was successful
  removeUser(userID: string, callback) {
    var Room = this;
    var rs = new RoomWebService();
    rs.leaveRoom(userID, this.id, function(d) {callback(Room.updateUserList(d))});
  }

  private updateUserList(userIDStrings) : Boolean {
    console.log(userIDStrings);
    if (userIDStrings.toLowerCase().indexOf("error") < 0) {
      var tempUsers = [];
      var uws = new UserWebService();
      var userPromise: Promise<void>;

      var userIDs = JSON.parse(userIDStrings);
      for (let userID of userIDs) {
        var user = uws.getUserFromCache(userID);

        // TODO: This was a quick fix. CHANGE
        if (true) {
          userPromise = new Promise(function(resolve, reject) {
            uws.getUser(userID, u => {resolve(u)});
          }).then(function(result){
            tempUsers.push(result);
          });
        }
        // else {
        //   tempUsers.push(user);
        // }
      }
      this.users = tempUsers;
      return true;
    } else {
      return false;
    }
  }

  isRoomReady() : boolean {
    if (this.users.length == this.size) {
      return true;
    } else {
      return false;
    }
  }

  // Prints information about the user to the console
  print(){
    console.log("ID: " + this.id + " Decks: " + this.decks + " Users: " + this.users +
      " isLocked: " + this.isLocked + " Name: " + this.name + " Password: " +
      this.password + " Size: " + this.size);
  }
}
