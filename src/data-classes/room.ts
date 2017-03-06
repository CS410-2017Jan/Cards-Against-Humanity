import {Deck} from "./deck";
import {Player} from "./player";
import {RoomWebService} from "../providers/room-web-service";
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
  //isJoinSuccess: Boolean;

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

    //this.isJoinSuccess = false;
    //this.creator = "";
  }

  // Creates room in DB and adds the creator to the list of players
  createRoom(user: Player) {
    this.creator = user;
    var RoomSetup = this;
    var rs = new RoomWebService();
    if (this.password) {
      rs.createRoom(this.name, this.decks, user.id, function(d) {RoomSetup.setID(d)}, this.password);
    } else {
      rs.createRoom(this.name, this.decks, user.id, function(d) {RoomSetup.setID(d)});
    }
  }

  setID(data) {
    this.id = data;
    this.players.push(this.creator);
  }

  // Add player to room in DB
  // Updates list of players in Room object
  // Returns true if addition was successful
  addPlayer(userID: string, fn, password?: string) {
    var RoomList = this;
    var rs = new RoomWebService();
    if (password) {
      rs.joinRoom(userID, this.id, function(d)  {fn(RoomList.onSuccessfulJoin(d))});
      //return this.isJoinSuccess;
    } else {
      rs.joinRoom(userID, this.id, function(d)  {fn(RoomList.onSuccessfulJoin(d))});
      //return this.isJoinSuccess;
    }
  }

  onSuccessfulJoin(player) : Boolean {
    //this.isJoinSuccess = false;
    if (player.toLowerCase().indexOf("error") < 0) {
      var tempPlayers: Array<Player> = [];

      var players = JSON.parse(player);
      for (var p in players) {
        var id = p;
        var username = players[p].username;

        var tempPlayer = new Player(username, id);
        tempPlayers.push(tempPlayer);

      }
      this.players = tempPlayers;
      return true;
    } else {
      return false;
    }
  }

  // TODO: removes a player from the room
  removePlayer(playerID: string) {

  }

  hasSpace() : Boolean {
    if (this.players.length > this.size) {
      return true;
    } else {
      return false;
    }
  }

  //Updates the list of players in the room
  updatePlayerList(room){
    console.log('List of players updated!');
  }

  // Prints information about the player to the console
  print(){
    console.log("ID: " + this.id + " Decks: " + this.decks + " Players: " + this.players +
      " isLocked: " + this.isLocked + " Name: " + this.name + " Password: " +
      this.password + " Size: " + this.size);
  }
}
