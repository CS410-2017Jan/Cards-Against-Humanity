import {RoomWebService} from "../web-services/room-web-service";
import {Room} from "../../data-classes/room";
import {DeckWebService} from "../web-services/deck-web-service";
import {Player} from "../../data-classes/player";
import {Deck} from "../../data-classes/deck";
/**
 * Created by Sonalee Shah on 3/4/2017.
 */

// ======================================================================
// This Class outlines the methods of RoomFacade
// ======================================================================
export class RoomFacade {

  constructor() {}

  // Calls callback with Room
  getRoom(roomID: string, callback) {
    var rs = new RoomWebService();
    rs.getRoom(roomID, function(room) {callback(room)})
  }

  // Calls callback with Array<Room>
  getRooms(callback) {
    console.log('getRooms()');
    var rs = new RoomWebService();
    rs.getAllRooms(function(rooms) {callback(rooms)});
  }

  // TODO: Extend functionality for 1+ deck
  // Calls callback with Room
  createRoom(name: string, user: Player, isLocked: boolean, callback, password?: string) {
    var rs = new RoomWebService();
    var facade = this;
    if (password) {
      rs.createRoom(name, ['-KdfzixNq1S7IF_LGlCj'], user.id, function(roomID) {callback(facade.createRoomObject(roomID, name, user, isLocked, password))}, password);
    } else {
      rs.createRoom(name, ['-KdfzixNq1S7IF_LGlCj'], user.id, function(roomID) {callback(facade.createRoomObject(roomID, name, user, isLocked))});
    }
  }

  // Calls callback with updated Room after player is added
  joinRoom(room: Room, userID: string, callback: any, password?: string) {
    if (password) {
      room.addPlayer(userID, callback, password);
    } else {
      room.addPlayer(userID, callback);
    }
  }

  // Calls callback with updated Room after player leaves
  removePlayer(room: Room, userID: string, callback) {
    room.removePlayer(userID, callback);
  }

  // Returns true if supplied password is correct
  attemptRoomPassword(room: Room, password: string) {
    return room.password == password;
  }

  // Calls get Room and returns true if the room is at capacity
  isRoomReady(roomID, callback) {
    var facade = this;
    this.getRoom(roomID, function(room: Room) {
      callback(room.isRoomReady());
    });
  }

  private createRoomObject(roomID: string, name: string, player: Player, isLocked: boolean, password?: string) : Room {
    var ds = new DeckWebService();
    var decks = [];
    var deckID = '-KdfzixNq1S7IF_LGlCj';
    var deckPromise : Promise<void>;
    var deck = ds.getDeckFromCache(deckID); // TODO: extend functionality for 1+ deck

    if (deck == undefined){
      deckPromise = new Promise(function(resolve, reject) {
        ds.getDeck(deckID, d => {resolve(d)});
      }).then(function(result){
        decks.push(result);
      })
    } else{
      decks.push(deck);
    }

    var players = [];
    players.push(player);
    var room = new Room(decks, isLocked, name, password, 3, roomID, players);
    return room;
  }

}
