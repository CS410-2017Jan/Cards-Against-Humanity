import {Deck} from './deck';
import {RoomWebService} from '../providers/web-services/room-web-service';
import {User} from './user';
/**
 * Created by Sonalee Shah on 2/24/2017.
 */

// ======================================================================
// This Class outlines the data structure of a Room
// ======================================================================
export class Room {
  id: string;
  decks: Array<Deck>;
  isLocked: boolean;
  name: string;
  password: string;
  users: Array<User>;
  size: number;

  private roomWebService;

  // @param id will be generated in DB and assigned after calling createRoom method
  constructor(decks: Array<Deck>, isLocked: boolean, name: string, size: number,
              id?: string, users?: Array<User>, password?: string) {
    this.decks = decks;
    this.isLocked = isLocked;
    this.name = name;
    this.password = password;
    this.size = size;

    if (id != null) {
      this.id = id;
    } else {
      this.id = '';
    }

    if (users != null) {
      this.users = users;
    } else {
      this.users = [];
    }

    if (password != null) {
      this.password = password;
    } else {
      this.password = '';
    }

    this.roomWebService = new RoomWebService();
  }

  // // Prints information about the user to the console
  // print() {
  //   console.log('ID: ' + this.id + ' Decks: ' + this.decks + ' Users: ' + this.users +
  //     ' isLocked: ' + this.isLocked + ' Name: ' + this.name + ' Password: ' +
  //     this.password + ' Size: ' + this.size);
  // }
}
