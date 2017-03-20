/**
 * Created by Sonalee Shah on 3/14/2017.
 */

// ======================================================================
// This Class outlines the data structure of a User
// ======================================================================
export class User {
  username: string;
  id: string;
  email: string;
  score: number;

  constructor(username: string, id?: string, email?: string, score?: number) {
    this.username = username;

    if (id) {
      this.id = id;
    } else {
      this.id = '';
    }

    if (email) {
      this.email = email;
    } else {
      this.id = '';
    }

    if(score){
      this.score = score;
    } else {
      this.score = 0
    }

  }

  // Prints information about the user to the console
  print() {
    console.log(this.username + 'Email: ' + this.email + ' ID: (' + this.id + ')');
  }
}
