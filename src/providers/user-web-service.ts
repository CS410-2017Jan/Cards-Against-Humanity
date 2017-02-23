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
            users.push(new Player(JSONArray[id].username, id));
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

  // Gets a user by ID
  getUser(id, callback: (p: Player) => void) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      // Stuff to do if GET is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try{
          var JSONArray = JSON.parse(xmlHttp.responseText);
          // Make the player and call the callback on them
          callback(new Player(JSONArray.username, id));
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

  // Creates new User and calls the given callback with the user's assigned ID
  createUser(username: string, password: string, callback: (id: string)=> void){
    // Set up data to be posted
    var data = {};
    data["username"] = username;
    data["password"] = password;
    data["image"] = {'url':''}

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

}
