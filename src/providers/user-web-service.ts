import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

import {Player} from "../data-classes/player";


/*
  Generated class for the UserWebService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.

  author: toldham
*/
@Injectable()

export class UserWebService {

  

  constructor() {
   
  }

  // Gets List of all users
  getAllUsers(callback: (p: Array<Player>) => void){
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      // Stuff to do if GET is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try{
          var JSONArray = JSON.parse(xmlHttp.responseText);
          var users : Player[] = [];
          for(let id in JSONArray){
            users.push(new Player(JSONArray[id].username, id, JSONArray[id].email ));
          }
          // Got all of them, call the callback
          callback(users);
        }
        catch(ex){
          console.log("Users not found- weird");
        }
      }
      else if (xmlHttp.readyState == 4){
        console.log("Error: " + xmlHttp.status)
      }
    };
    xmlHttp.open("GET", "https://cards-against-humanity-d6aec.firebaseio.com/users.json", true);
    xmlHttp.send(null);
  }

  // Gets a user by ID from the database
  getUser(id, callback: (p: Player) => void) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      // Stuff to do if GET is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try{
          var JSONArray = JSON.parse(xmlHttp.responseText);
          var player = new Player(JSONArray.username, id, JSONArray.email)
          // Add this player to the cache since we have them
          var ws = new UserWebService();
          ws.addUserToCache(player);

          // Make the player and call the callback on them
          callback(player);
        }
        catch (ex){
          console.log("Player not found");
        }
      }
      else if (xmlHttp.readyState == 4) {
        console.log("Error: " + xmlHttp.status)
      }
    };
    xmlHttp.open("GET", "https://cards-against-humanity-d6aec.firebaseio.com/users/" + id + ".json", true);
    xmlHttp.send(null);

  }

  // Gets a user from the cache, returning undefined if not found
  getUserFromCache(id) : Player{
    var JSONObject;
    try{
      JSONObject = JSON.parse(sessionStorage.getItem("userCache"));
      //console.log(JSONObject)
      // Check if the user is in the cache
      if (JSONObject[id] != undefined){
        return(JSONObject[id]);
      }
      else{

        return undefined;
      }

    }
    catch(ex){
      // Failed to parse JSON probably because our cache is empty
      //console.log("Empty cache")
      return undefined;
    }
    
  }

  // Adds one user to the user cache
  addUserToCache(user: Player){
    var JSONObject;
    try{
      JSONObject = JSON.parse(sessionStorage.getItem("userCache"));
      // Check if this user is already in the cache, if so remove them
      if (JSONObject[user.id] != undefined){
        delete JSONObject[user.id];
      }

    }
    catch(ex){
      // Failed to parse JSON probably because our cache is empty
      JSONObject = JSON.parse("{}");
    }
    // Add User to JSON Object and save it to cache
    JSONObject[user.id] = user;
    sessionStorage.setItem("userCache", JSON.stringify(JSONObject));

    console.log(JSON.parse(sessionStorage.getItem("userCache")));

  }

  // Creates new User and calls the given callback with the user's assigned ID
  createUser(username: string, password: string, email: string, callback: (id: string)=> void){
    // Set up data to be posted
    var data = {};
    data["username"] = username;
    data["password"] = password;
    data["image"] = {'url':''};
    data["email"] = email;


    // Get it ready to send
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {

      // Stuff to do if POST is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        try{
          // We should be done, call the callback with the returned name (which is the ID)
          var JSONArray = JSON.parse(xmlHttp.responseText);
          callback(JSONArray.name)
        }
        catch(ex){
          console.log("Failed to create user");
        }
      }
      else if (xmlHttp.readyState == 4){
        console.log("Error: " + xmlHttp.status)
      }
    };
    xmlHttp.open("POST", "https://cards-against-humanity-d6aec.firebaseio.com/users.json", true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    // Send the request
    xmlHttp.send(JSON.stringify(data));


  }

  // Authenticates the user- calls the callback with true if the user's credentials were correct
  logInUser(email: string, password: string, callback: (success: boolean)=>void){
    // stub
    callback(true);
  }
}
