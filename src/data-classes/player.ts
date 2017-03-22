/**
 * Created by jjxn on 2/19/2017.
 */

import {User} from './user';

// ======================================================================
// This Class outlines the data structure of a Player
// ======================================================================
export class Player extends User {
  score: number;

  constructor(username: string, id?: string) {
    super(username, id);
    this.score = 0;
  }

  // Prints information about the player to the console
  print() {
    console.log(this.username + ' ID: (' + this.id + ')- ' + this.score);
  }

  // return int index of player corresponding to the given username in
  // the given array of players. returns -1 on error.
  static getPlayerIndex(players: Array<Player>, username: string): number {
    for (var i = 0; i < players.length; i++) {
      if (players[i].username == username) return i;
    }
    console.log('ERROR: username not found in given players');
    return -1;
  }

  // creates a player for each user in given array of users
  static createPlayersFromUsers(users: Array<User>): Array<Player> {
    var players: Array<Player> = [];
    for (let user of users) {
      players.push(new Player(user.username, user.id));
    }

    // sort players alphabetically
    players.sort(function(a: Player, b: Player) {
      if(a.username < b.username) return -1;
      if(a.username > b.username) return 1;
      return 0;
    });

    return players;
  }
}
