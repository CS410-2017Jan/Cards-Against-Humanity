import {User} from "./user";
/**
 * Created by jjxn on 2/19/2017.
 */

// ======================================================================
// This Class outlines the data structure of a Player
// ======================================================================
export class Player extends User {
  score: number;

  constructor(username: string, id?: string, email?: string) {
    super(username, id, email);
    this.score = 0;
  }

  // Prints information about the player to the console
  print(){
    console.log(this.username + " ID: (" + this.id + ")- " + this.score);
  }

  static getPlayerIndex(players: Array<Player>, username: string) : number {
    for (var i = 0; i < players.length; i++) {
      if (players[i].username == username) return i;
    }
    console.log("ERROR: username not found in given players");
    return -1;
  }

}
