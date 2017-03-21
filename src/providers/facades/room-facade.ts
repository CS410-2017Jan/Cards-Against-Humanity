import {RoomWebService} from "../web-services/room-web-service";
import {Room} from "../../data-classes/room";
import {DeckWebService} from "../web-services/deck-web-service";
import {User} from "../../data-classes/user";
import {Injectable} from "@angular/core";
import {UserWebService} from "../web-services/user-web-service";
import {Deck} from "../../data-classes/deck";
/**
 * Created by Sonalee Shah on 3/4/2017.
 */

// ======================================================================
// This Class outlines the methods of RoomFacade
// ======================================================================

@Injectable()

export class RoomFacade {

  private roomWebService;
  private userWebService;
  private deckWebService;
  private currentRoom: Room;

  constructor() {
    this.roomWebService = new RoomWebService();
    this.userWebService = new UserWebService();
    this.deckWebService = new DeckWebService();
  }

  // Calls callback with Room
  getRoom(roomID: string, callback) {
    this.roomWebService.getRoom(roomID, function (room) {
      callback(room)
    })
  }

  // Returns the current room object
  getCurrentRoom(): Room {
    return this.currentRoom;
  }

  // Calls callback with Array<Room>
  getRooms(callback) {
    console.log('getRooms()');
    this.roomWebService.getAllRooms(function (rooms) {
      callback(rooms)
    });
  }

  getUsersInRoom(roomID: string, callback) {
    var that = this;
    this.roomWebService.getUsersInRoom(roomID, function (ids) {
      that.userWebService.getUsersByIDList(ids, function (listOfUsers) {

        var sortedUsers = listOfUsers.sort(function (a, b) {
          var keyA = a.username;
          var keyB = b.username;
          if(keyA < keyB) return -1;
          if(keyA > keyB) return 1;
          return 0;
        });

        that.currentRoom.users = sortedUsers;
        callback(that.currentRoom.users);
      });
    });
  }

  // TODO: Extend functionality for 1+ deck
  // Calls callback with Room
  createRoom(name: string, user: User, isLocked: boolean, callback, password?: string) {
    var facade = this;
    if (password) {
      this.roomWebService.createRoom(name, ['-KdfzixNq1S7IF_LGlCj'], user.id, function (roomID) {
        facade.createRoomObject(callback, roomID, name, user, isLocked, password);
      }, password);
    } else {
      this.roomWebService.createRoom(name, ['-KdfzixNq1S7IF_LGlCj'], user.id, function (roomID) {
        facade.createRoomObject(callback, roomID, name, user, isLocked, undefined);
      });
    }
  }

  // Calls callback with updated Room after user is added
  joinRoom(room: Room, user: User, callback: any) {
    var that = this;
    this.currentRoom = room;
    this.roomWebService.joinRoom(user.id, this.currentRoom.id, function (result) {
      that.currentRoom.users.push(user);
      callback(that.currentRoom);
    });
  }

  // Calls callback with updated Room after user leaves
  removeUser(room: Room, user: User, callback) {
    var that = this;
    this.roomWebService.leaveRoom(user.id,room.id,function (result) {
      var newUsers = that.currentRoom.users.filter(function(u) {
        return u.id == user.id;
      });
      that.currentRoom.users = newUsers;
      callback(that.currentRoom);
    });
  }

  // Returns true if supplied password is correct
  attemptRoomPassword(room: Room, password: string) {
    return room.password == password;
  }

  // Calls callback with true when the room is at capacity
  isRoomReady(callback) {
    var that = this;
    var originalNumUsers = this.currentRoom.users.length;
    this.getUsersInRoom(this.currentRoom.id, function (userIDs) {

      if (userIDs.length != originalNumUsers) {
        for (var userID in userIDs) {
          if (!that.hasUser(userID)) {
            that.userWebService.getUsersByIDList([userID], function (userArr) {
              that.currentRoom.users.push(userArr[0]);
            });
          }
        }
      }

      if (userIDs.length == that.currentRoom.size) {
        callback(true);
      } else {
        setTimeout(that.isRoomReady(callback), 5000);
      }
    });
  }

  private createRoomObject(callback, roomID: string, name: string, user: User, isLocked: boolean, password?: string) {
    var decks = [];
    var deckStrings = ['-KdfzixNq1S7IF_LGlCj'];
    var deckPromise: Promise<void>;
    var that = this;
    deckPromise = new Promise(function (resolve, reject) {
      that.deckWebService.getDecksByIDList(deckStrings, d => {
        resolve(d)
      });
    }).then(function (result) {
      decks = result as Deck[];
    });

    var users = [];
    users.push(user);

    // wait for all promises to come back
    Promise.all([deckPromise]).then(function(result) {
      that.currentRoom = new Room(decks, isLocked, name, 3, roomID, users, password);
      callback(that.currentRoom);
    });
  }

  private hasUser(userID: string): boolean {
    for (var i=0; i < this.currentRoom.users.length; i++) {
      if (this.currentRoom.users[i].id === userID) {
        return true;
      }
    }
    return false;
  }

}
