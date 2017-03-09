import {Deck} from "./deck";
import {Player} from "./player";
import {RoomWebService} from "../providers/room-web-service";
import {UserWebService} from "../providers/user-web-service";
/**
 * Created by Sonalee Shah on 2/24/2017.
 */

// ======================================================================
// This Class outlines the data structure of a Player
// ======================================================================
export class Room {
  id: string;
  decks: Array<Deck>;
  isLocked: Boolean;
  name: string;
  password: string;
  players: Array<Player>;
  size: number;
  creator: Player; // TODO: A parameter for who created the room?

  // @param id will be generated in DB and assigned after calling createRoom method
  constructor(decks: Array<Deck>, isLocked: Boolean, name: string, password: string,
              size: number, id?: string, players?: Array<Player>) {
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

    if (players) {
      this.players = players;
    } else {
      this.players = [];
    }

    //this.creator = "";
  }

  // Add player to room in DB
  // Updates list of players in Room object
  // Returns true if addition was successful
  addPlayer(userID: string, fn, password?: string) {
    var Room = this;
    var rs = new RoomWebService();
    if (password) {
      rs.joinRoom(userID, this.id, function(d) {fn(Room.updatePlayerList(d))});
      //return this.isJoinSuccess;
    } else {
      rs.joinRoom(userID, this.id, function(d) {fn(Room.updatePlayerList(d))});
      //return this.isJoinSuccess;
    }
  }

  // Removes player to room in DB
  // Updates list of players in Room object
  // Returns true if removal was successful
  removePlayer(playerID: string, callback) {
    var Room = this;
    var rs = new RoomWebService();
    rs.leaveRoom(playerID, this.id, function(d) {callback(Room.updatePlayerList(d))});
  }

  private updatePlayerList(playerIDStrings) : Boolean {
    console.log(playerIDStrings);
    if (playerIDStrings.toLowerCase().indexOf("error") < 0) {
      var tempPlayers = [];
      var uws = new UserWebService();
      var userPromise: Promise<void>;

      var playerIDs = JSON.parse(playerIDStrings);
      for (let playerID of playerIDs) {
        var player = uws.getUserFromCache(playerID);

        if (player == undefined) {
          userPromise = new Promise(function(resolve, reject) {
            uws.getUser(playerID, u => {resolve(u)});
          }).then(function(result){
            tempPlayers.push(result);
          });
        } else {
          tempPlayers.push(player);
        }
      }
      this.players = tempPlayers;
      return true;
    } else {
      return false;
    }
  }

  isRoomReady() : boolean {
    if (this.players.length == this.size) {
      return true;
    } else {
      return false;
    }
  }

  // Prints information about the player to the console
  print(){
    console.log("ID: " + this.id + " Decks: " + this.decks + " Players: " + this.players +
      " isLocked: " + this.isLocked + " Name: " + this.name + " Password: " +
      this.password + " Size: " + this.size);
  }
}
