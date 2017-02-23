/**
 * Created by jjxn on 2/19/2017.
 */

export class Player {
  username: string;
  score: number;
  id: string;

  constructor(username: string, id?: string) {
    this.username = username;
    this.score = 0;
    this.id = id;
  }
  // Prints information about the player to the console
  print(){
    console.log(this.username + " ID: (" + this.id + ")- " + this.score);
  }

}

