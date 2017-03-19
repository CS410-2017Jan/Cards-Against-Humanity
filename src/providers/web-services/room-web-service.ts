import {Injectable} from '@angular/core';
import {Component} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Deck} from "../../data-classes/deck";
import {Room} from "../../data-classes/room";
import {DeckWebService} from "./deck-web-service";
import {UserWebService} from "./user-web-service";
import {User} from "../../data-classes/user";

/*
 Generated class for the RoomWebService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class RoomWebService {

  constructor() {
  }

  // Adds the user specified by the ID to the room specified by the ID, only if there is space left in that room. Password is optional
  // Then calls the callback with the new list of users in the room by id
  // returns undefined if there is a problem
  //
  // Note- This needs to be updated with password authentication. Password currently does nothing !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  joinRoom(userID: string, roomID: string, callback: (s: string)=>void) {

    try {
      // First Authenticate to ensure we're logged in
      var ws = new UserWebService();
      ws.checkLoggedInStatus(function (success: boolean) {
        if (!success) {
          // we're not logged in- bail
          console.log('Error: not logged in');
          callback('Error: not logged in');
          return;
        }
        // First we need to get the room we're joining to make sure it's all gucci
        var rs = new RoomWebService();
        rs.getRoom(roomID, (r: Room)=> {
          // Check the room to make sure its not full
          var numUsers = r.users.length;
          var roomSize = r.size;
          if (numUsers < roomSize) {
            // Time to add the user to the room
            var xmlHttp = new XMLHttpRequest();
            var data: string[] = [];
            var users: User[] = r.users;
            for (let p in users) {
              if (users[p].id == userID) {
                // can't add a duplicate
                callback("Error: Already in room");
                return;
              }
              data.push(users[p].id);
            }
            data.push(userID);
            xmlHttp.onreadystatechange = function () {
              // Stuff to do if PUT is successful
              if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                try {
                  var JSONArray = JSON.parse(xmlHttp.responseText);
                  // Parse in the room and call the callback
                  //var ws = new RoomWebService();
                  //console.log(xmlHttp.responseText);
                  callback(xmlHttp.responseText);
                } catch (ex) {
                  //callback("Error: Response Formatted Unexpectedly: " + xmlHttp.responseText);
                }
              } else if (xmlHttp.readyState == 4) {
                //callback("Error: " + xmlHttp.status)
              }
            };
            xmlHttp.open("PUT", "https://cards-against-humanity-d6aec.firebaseio.com/rooms/" + roomID + "/users.json", true); // true for asynchronous
            xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xmlHttp.send(JSON.stringify(data));
          } else {
            // Room is full yo
            callback("Error: Room is Full");
          }
        });
      })
    } catch (ex) {
      // Must have failed to find room or failed to log in
      callback(undefined);
    }
  }

  // Removes the specified user from the room and calls the callback on the updated room object
  leaveRoom(userID: string, roomID: string, callback: (s: string)=>void) {

    try {
      // first check that we're authenticated
      var ws = new UserWebService();
      ws.checkLoggedInStatus(function (success: boolean) {
        if (!success) {
          // we're not logged in- bail
          console.log("Error: not logged in");
          callback("Error: not logged in");
          return;
        }
        // we need to get the room we're joining to make sure it's all gucci
        // Get the room
        var rs = new RoomWebService();
        rs.getRoom(roomID, (r: Room)=> {
          var xmlHttp = new XMLHttpRequest();
          var data: string[] = [];
          var user: User[] = r.users;
          if (user.length == 1) {
            // Can't have last user leave
            callback("Error: Last user cannot leave room");
            return;
          }
          for (let p in user) {
            if (user[p].id != userID) {
              data.push(user[p].id);
            }
          }
          xmlHttp.onreadystatechange = function () {
            // Stuff to do if PUT is successful
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
              try {
                var JSONArray = JSON.parse(xmlHttp.responseText);
                // Parse in the room and call the callback
                //var ws = new RoomWebService();
                //console.log(xmlHttp.responseText);
                callback(xmlHttp.responseText);
              } catch (ex) {
                //callback("Error: Response Formatted Unexpectedly: " + xmlHttp.responseText);
              }
            } else if (xmlHttp.readyState == 4) {
              //callback("Error: " + xmlHttp.status)
            }
          };
          xmlHttp.open("PUT", "https://cards-against-humanity-d6aec.firebaseio.com/rooms/" + roomID + "/users.json", true); // true for asynchronous
          xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
          xmlHttp.send(JSON.stringify(data));
        })
      });
    } catch (ex) {
      // Must have failed to find room
      callback(undefined);
    }
  }

  // Gets a room by ID and calls the callback on the returned JSON string
  getRoom(id: string, callback: (Room) => void) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      // Stuff to do if GET is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try {
          // NOTE- THIS STORES THE PASSWORD LOCALLY- FIX?
          // Parse in the room and call the callback
          var ws = new RoomWebService();
          //console.log(xmlHttp.responseText);
          ws.parseRoom(id, xmlHttp.responseText, function (r) {
            callback(r)
          });
        } catch (ex) {
          console.log(ex.message)
          console.log("Failed to get room " + id);
        }
      } else if (xmlHttp.readyState == 4) {
        console.log("Error: " + xmlHttp.status)
      }
    };
    xmlHttp.open("GET", "https://cards-against-humanity-d6aec.firebaseio.com/rooms/" + id + ".json", true); // true for asynchronous
    xmlHttp.send(null);
  }

  // Gets the users in a room specified by ID and returns a list of ID's
  getUsersInRoom(id: string, callback: (p: String[]) => void){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      // Stuff to do if GET is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try {
          // return
          callback(JSON.parse(xmlHttp.responseText));
        } catch (ex) {
          console.log(ex.message)
          console.log("Failed to get room or users" + id);
        }
      } else if (xmlHttp.readyState == 4) {
        console.log("Error: " + xmlHttp.status)
      }
    };
    xmlHttp.open("GET", "https://cards-against-humanity-d6aec.firebaseio.com/rooms/" + id + "/users.json", true); // true for asynchronous
    xmlHttp.send(null);
  }

  // Gets all rooms and calls the callback on the returned JSON string
  getAllRooms(callback: (any) => void) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      // Stuff to do if GET is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try {
          var JSONArray = JSON.parse(xmlHttp.responseText);
          var returnList = [];
          var toAdd;
          // Iterate across all rooms
          for (let r in JSONArray) {
            toAdd = {};
            toAdd.name = JSONArray[r].name;
            toAdd.isLocked = JSONArray[r].isLocked;
            toAdd.password = JSONArray[r].password;
            toAdd.id = r;
            returnList.push(toAdd);
          }
          callback(returnList);
        } catch (ex) {
          console.log("Failed to get deck");
        }
      } else if (xmlHttp.readyState == 4) {
        console.log("Error: " + xmlHttp.status)
      }
    };
    xmlHttp.open("GET", "https://cards-against-humanity-d6aec.firebaseio.com/rooms.json", true); // true for asynchronous
    xmlHttp.send(null);
  }

  // Creates a room with an optional password, and add the user who sent this to the room
  createRoom(name: string, decks: Array<string>, userID: string, callback: (id: string)=> void, password ?: string, size ?: number) {
    // check if we are authenticated

    var ws = new UserWebService();
    ws.checkLoggedInStatus(function (success: boolean) {
      // check if authenticated
      if (!success) {
        // we're not logged in- bail
        console.log("Error: not logged in");
        callback("Error: not logged in");
        return;
      }
      var hasPassword = !(password == undefined);


      // Set up data to be posted
      var data = {};
      data["isLocked"] = hasPassword;
      data["name"] = name;
      data["decks"] = decks;
      data["password"] = password;
      data["users"] = [userID];
      // default size to 3
      if (size == undefined){
        data["size"] = 3;
      }
      else{
        data["size"] = size;
      }

      // Get it ready to send
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function () {

        // Stuff to do if POST is successful
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          try {
            // We should be done, call the callback with the returned name (which is the ID)
            var JSONArray = JSON.parse(xmlHttp.responseText);
            callback(JSONArray.name)
          } catch (ex) {
            console.log("Failed to create room");
            console.log(ex);
          }
        } else if (xmlHttp.readyState == 4) {
          console.log("Error: " + xmlHttp.status)
        }
      };
      xmlHttp.open("POST", "https://cards-against-humanity-d6aec.firebaseio.com/rooms.json", true);
      xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      // Send the request
      xmlHttp.send(JSON.stringify(data));
    })
  }

  // Creates a Room object from a JSON String and roomID and then calls a callback on that room
  parseRoom(roomID: string, jsonString: string, callback: (Room) => void) {
    try {
      var JSONArray = JSON.parse(jsonString);
      var deckStrings = JSONArray.decks;
      var name = JSONArray.name;
      var userStrings = JSONArray.users;
      var size = JSONArray.size;
      var isLocked = JSONArray.isLocked;
      var password = JSONArray.password;

      // Get all the decks and users
      var decks = [];
      var dws = new DeckWebService();
      var deckPromise: Promise<void>;
      
      deckPromise = new Promise(function (resolve, reject) {
        dws.getDecksByIDList(deckStrings, d => {
          resolve(d)
        });
      }).then(function (result) {
        decks = result as Deck[];
      })



      var users = [];
      var uws = new UserWebService();
      var userPromise: Promise<void>;
      
      userPromise = new Promise(function (resolve, reject) {

        uws.getUsersByIDList(userStrings, u => {
          resolve(u)
        });
      }).then(function (result) {
        users = result as User[];
      });

      // wait for all promises to come back
      Promise.all([userPromise, deckPromise]).then(function(result){
        callback(new Room(decks, isLocked, name, size, roomID, users, password))
      })
    } catch (e) {
      console.log("Could not parse room");
      console.log(e.message);
      callback(undefined);
    }
  }

}
