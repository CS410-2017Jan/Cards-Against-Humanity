import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/map';
import {User} from "../../data-classes/user";


/*
 Generated class for the UserWebService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.

 author: toldham
 */
@Injectable()

export class UserWebService {

  // Note- authorization uses the tutorial here- http://stackoverflow.com/questions/37322747/using-mail-and-password-to-authenticate-via-the-rest-api-firebase
  AUTH_API_KEY = "AIzaSyDPItjle-Fe8L__6SxkZFE71Of0NDBY0u0";
  REGISTRATION_URL = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=";
  LOGIN_URL = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=";
  ACCOUNT_INFO_URL = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=<my-firebase-api-key>";


  constructor() {
  }

  // Gets List of all users
  getAllUsers(callback: (p: Array<User>) => void) {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      // Stuff to do if GET is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try {
          var JSONArray = JSON.parse(xmlHttp.responseText);
          var users: User[] = [];
          for (let id in JSONArray) {
            users.push(new User(JSONArray[id].username, id, JSONArray[id].email));
          }
          // Got all of them, call the callback
          callback(users);
        } catch (ex) {
          console.log("Users not found- weird");
        }
      } else if (xmlHttp.readyState == 4) {
        console.log("Error: " + xmlHttp.status)
      }
    };
    xmlHttp.open("GET", "https://cards-against-humanity-d6aec.firebaseio.com/users.json", true);
    xmlHttp.send(null);
  }

  // Gets a user by ID from the database
  getUser(id, callback: (p: User) => void) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      // Stuff to do if GET is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try {
          var JSONArray = JSON.parse(xmlHttp.responseText);
          // check if we have the image
          var base64Image = "";
          if(JSONArray.image){
            base64Image = JSONArray.image.base64;
          }
          var user = new User(JSONArray.username, id, JSONArray.email, JSONArray.score, base64Image);
          // Add this user to the cache since we have them
          var ws = new UserWebService();
          ws.addUserToCache(user);

          // Make the user and call the callback on them
          callback(user);
        } catch (ex) {
          console.log("User not found");
        }
      } else if (xmlHttp.readyState == 4) {
        console.log("Error: " + xmlHttp.status)
      }
    };
    xmlHttp.open("GET", "https://cards-against-humanity-d6aec.firebaseio.com/users/" + id + ".json", true);
    xmlHttp.send(null);

  }

  // Adds the given delta to the score of the user specified by the given ID, calls callback with the new score
  addScore(userID: string, deltaScore: number, callback: (i: number)=> void){
    // we first need to get the user we're updating
    this.getUser(userID, function (u: User){
      // we have the user, now put their new score in
      // (safety check)
      if(u.score == undefined){
        callback(undefined);
        return;
      }
      var newScore = u.score + deltaScore;
      // Set up data to be posted
      var data = newScore;


      // Get it ready to send
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function () {

      // Stuff to do if PUT is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try {
          // We should be done, call the callback with the returned name (which is the ID)
            var JSONArray = JSON.parse(xmlHttp.responseText);
            callback(JSONArray)
          } catch (ex) {
            console.log("Failed to update score");
            callback(undefined);
          }
        } else if (xmlHttp.readyState == 4) {
          console.log("Error: " + xmlHttp.status)
          callback(undefined);
        }
      };
      xmlHttp.open("PUT", "https://cards-against-humanity-d6aec.firebaseio.com/users/" + userID + "/score.json", true);
      xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      // Send the request
      xmlHttp.send(JSON.stringify(data));
    });
  }

  // Adds a profile picture to the specified user
  addProfilePicture(userID: string, base64Image: string, callback: (b: boolean)=> void){
    // Set up data to be posted
    var data = base64Image.replace(/\s/g, '');;


    // Get it ready to send
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {

    // Stuff to do if PUT is successful
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      try {
        // We should be done, call true as it succeeded
          callback(true);
          return;
        } catch (ex) {
          console.log("Failed to update image");
          callback(false);
        }
      } else if (xmlHttp.readyState == 4) {
        console.log("Error: " + xmlHttp.status)
        callback(false);
      }
    };
    xmlHttp.open("PUT", "https://cards-against-humanity-d6aec.firebaseio.com/users/" + userID + "/image/base64.json", true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    // Send the request
    xmlHttp.send(JSON.stringify(data));
  }

  // Gets the profile picture for a user in base64 format and calls the callback on it
  // Will be an empty string if no profile picture has been defined
  getProfilePicture(id, callback: (s: String) => void) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      // Stuff to do if GET is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try {
          // call the callback
          callback(xmlHttp.responseText);
        } catch (ex) {
          console.log("User or profile picture not found");
        }
      } else if (xmlHttp.readyState == 4) {
        console.log("Error: " + xmlHttp.status)
      }
    };
    xmlHttp.open("GET", "https://cards-against-humanity-d6aec.firebaseio.com/users/" + id + "/image/base64.json", true);
    xmlHttp.send(null);

  }

  // Gets a user from the cache, returning undefined if not found
  getUserFromCache(id): User {
    var JSONObject;
    try {
      JSONObject = JSON.parse(sessionStorage.getItem("userCache"));
      //console.log(JSONObject)
      // Check if the user is in the cache
      if (JSONObject[id] != undefined) {
        return (JSONObject[id]);
      } else {
        return undefined;
      }
    } catch (ex) {
      // Failed to parse JSON probably because our cache is empty
      //console.log("Empty cache")
      return undefined;
    }
  }

  // Adds one user to the user cache
  addUserToCache(user: User) {
    var JSONObject;
    try {
      JSONObject = JSON.parse(sessionStorage.getItem("userCache"));
      // Check if this user is already in the cache, if so remove them
      if (JSONObject[user.id] != undefined) {
        delete JSONObject[user.id];
      }
    } catch (ex) {
      // Failed to parse JSON probably because our cache is empty
      JSONObject = JSON.parse("{}");
    }
    // Add User to JSON Object and save it to cache
    JSONObject[user.id] = user;
    sessionStorage.setItem("userCache", JSON.stringify(JSONObject));

    //console.log(JSON.parse(sessionStorage.getItem("userCache")));
  }

  // Creates new User and calls the given callback with the user's assigned ID
  // Note this is different from the firebase user- this is stored in the firebase realtime DB and is used for supplementary user information
  createUser(username: string, password: string, email: string, callback: (id: string)=> void) {
    // Try creating the firebase user first
    this.createFirebaseUser(email, password, function (success: boolean) {
      // Check if it worked
      if (success) {
        // Set up data to be posted
        var data = {};
        data["username"] = username;
        data["password"] = password;
        data["image"] = {'base64': ''};
        data["email"] = email;
        data["score"] = 0;


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
              console.log("Failed to create user");
            }
          } else if (xmlHttp.readyState == 4) {
            console.log("Error: " + xmlHttp.status)
          }
        };
        xmlHttp.open("POST", "https://cards-against-humanity-d6aec.firebaseio.com/users.json", true);
        xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        // Send the request
        xmlHttp.send(JSON.stringify(data));
      } else {
        console.log("Failed to create user");
        callback(undefined);
      }

    })

  }

  // Caches the logged in user in the browser cache
  cacheLoggedInUser(email: string, password: string) {
    // we need to first get the user object from the db for this email
    this.getUserByEmail(email, function (u: User) {
      sessionStorage.setItem("loggedInUser", JSON.stringify({
        "email": email,
        "password": password,
        "username": u.username,
        "id": u.id
      }));
    });
  }

  // Retrieves logged in user from the browser cache as an object with parameters email and password
  getLoggedInUser(): any {
    return JSON.parse(sessionStorage.getItem("loggedInUser"));
  }

  // Creates a user in the firebase users (different from our user db) and calls the callback with true if it succeeded
  createFirebaseUser(email: string, password: string, callback: (b: boolean)=> void) {
    // Set up data to be posted
    var data = {}
    data["email"] = email;
    data["password"] = password;
    data["returnSecureToken"] = true;

    // Get it ready to send
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      // Stuff to do if POST succeeded
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try {
          // Response is back, double check it worked
          var JSONArray = JSON.parse(xmlHttp.responseText);
          if (JSONArray["idToken"]) {
            // It worked- call the callback with true and store the logged in user
            var ws = new UserWebService();
            ws.cacheLoggedInUser(email, password);

            console.log("Success");
            callback(true);
          } else {
            // We failed for some reason
            console.log("Received response but failed to create firebase user");
            callback(false);
          }
        } catch (ex) {
          console.log("Failed to create firebase user");
          callback(false);
        }
      } else if (xmlHttp.readyState == 4) {
        console.log("Error: " + xmlHttp.status)
        callback(false);
      }
    };
    xmlHttp.open("POST", this.REGISTRATION_URL + this.AUTH_API_KEY, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    // Send the request
    xmlHttp.send(JSON.stringify(data));
  }

  // Authenticates the user- calls the callback with that user if the credentials were correct
  logInUser(email: string, password: string, callback: (u: User)=>void) {
    // Set up data to be posted
    var data = {};
    data["email"] = email;
    data["password"] = password;
    data["returnSecureToken"] = true;

    // Get it ready to send
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      // Stuff to do if POST succeeded
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try {
          // Response is back, double check it worked
          var JSONArray = JSON.parse(xmlHttp.responseText);
          if (JSONArray["idToken"]) {
            // It worked- cache the logged in user and call the callback with true
            var ws = new UserWebService();
            ws.cacheLoggedInUser(email, password);
            console.log("Login Verified");
            // return the user for this email
            ws.getUserByEmail(email, function(u: User){
              callback(u);
            });
          } else {
            // We failed for some reason
            console.log("Login Failed");
            callback(undefined);
          }
        } catch (ex) {
          console.log("Login Failed");
          console.log(ex.message);
          callback(undefined);
        }
      } else if (xmlHttp.readyState == 4) {
        console.log("Error: " + xmlHttp.status)
        callback(undefined);
      }
    };
    xmlHttp.open("POST", this.LOGIN_URL + this.AUTH_API_KEY, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    // Send the request
    xmlHttp.send(JSON.stringify(data));
  }

  // Quickly checks if you are logged in correctly- calls callback with true if you are
  checkLoggedInStatus(callback: (success: boolean)=>void) {
    var loggedInUser = this.getLoggedInUser();
    //console.log(loggedInUser);
    if (loggedInUser == null) {
      callback(false);
      return;
    }
    this.logInUser(loggedInUser["email"], loggedInUser["password"], function (u: User) {
      if(u != undefined){
        callback(true);
      }
      else{
        callback(false)
      }
    });
  }

  // Finds the first User in the DB with the given email and returns it, returns undefined if not found
  getUserByEmail(email: string, callback: (p: User)=> void) {
    // first we need to get all users
    this.getAllUsers(function (users: Array<User>) {
      // now we need to search this returned users list for the user in question
      try {
        // Search the users list for the right email
        var foundUser;
        for (let u of users) {
          if (u.email == email) {
            foundUser = u;
            break;
          }
        }
        if (foundUser == null) {
          // user not found
          console.log("User with email " + email + " not found.");
          callback(undefined);
        } else {
          // user found
          callback(foundUser);
        }
      } catch (ex) {
        // We messed up somewhere
        console.log("Encountered exception while finding user by email: " + ex.message);
        callback(undefined);
      }
    });
  }

  // Calls get user for each provided ID and returns a list of said users
  getUsersByIDList(ids: String[], callback: (u: User[])=> void){
    var users = [];
    var uws = new UserWebService();
    var userPromise: Promise<void>;
    var promises: Promise<void>[] = [];
    //console.log("users")
    for (let userID of ids) {
        userPromise = new Promise(function (resolve, reject) {
           uws.getUser(userID, u => {
            resolve(u)
          });
        }).then(function (result) {
          users.push(result);
        })
        promises.push(userPromise);
    } 

    // Wait for all promises made to return
    if(promises.length == 0){
      callback(users);
    }
    else{
      Promise.all(promises).then(function(result){
        callback(users);
      });
    }
  }
}
