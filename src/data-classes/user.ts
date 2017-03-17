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

  constructor(username: string, id?: string, email?: string) {
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

  }

  // Prints information about the user to the console
  print() {
    console.log(this.username + 'Email: ' + this.email + ' ID: (' + this.id + ')');
  }
}
