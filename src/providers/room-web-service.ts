import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Deck} from "../data-classes/deck";

/*
  Generated class for the RoomWebService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RoomWebService {

  constructor() {

  }

  // Adds the player specified by the ID to the room specified by the ID, only if there is space left in that room. Password is optional
  // Then calls the callback with the new list of players in the room
  // returns "Error: ____" if there is a problem
  // 
  // Note- This needs to be updated with password authentication. Password currently does nothing !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  joinRoom(userID: string, roomID: string, callback: (s:string)=>void, password ?: string ){
  	// First we need to get the room we're joining to make sure it's all gucci
  	try{
  		this.getRoom(roomID, s=>{
  		// Check the room to make sure its not full
  		var JSONArray = JSON.parse(s);
  		var numPlayers = JSONArray.players.length;
  		var roomSize = JSONArray.size;
  		if (numPlayers < roomSize){
  			// Time to add the player to the room
  			var xmlHttp = new XMLHttpRequest();
  			var data: string[]= JSONArray.players;
  			data.push(userID)
    		xmlHttp.onreadystatechange = function() {
    		  // Stuff to do if PUT is successful
    		  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    		    try{
    		      var JSONArray = JSON.parse(xmlHttp.responseText);
    		      callback(JSON.stringify(JSONArray));
    		    }
    		    catch(ex){
    		      callback("Error: Response Formatted Unexpectedly: " + xmlHttp.responseText);
    		    }
    		  }
    		  else if (xmlHttp.readyState == 4){
    		    callback("Error: " + xmlHttp.status)
    		  }
    		}
    		xmlHttp.open("PUT", "https://cards-against-humanity-d6aec.firebaseio.com/rooms/" + roomID + "/players.json", true); // true for asynchronous
    		xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    		xmlHttp.send(JSON.stringify(data));
  		}
  		else{
  			// Room is full yo
  			callback("Error: Room is full");
  		}
  	});
  	}
  	catch(ex){
  		// Must have failed to find room
  		callback("Error: Room not Found");
  	}
  	
  }




  // Gets a room by ID and calls the callback on the returned JSON string
  getRoom(id:string, callback: (string) => void){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      // Stuff to do if GET is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try{
          // NOTE- THIS STORES THE PASSWORD LOCALLY- FIX?
          var JSONArray = JSON.parse(xmlHttp.responseText);
          callback(JSON.stringify(JSONArray));
        }
        catch(ex){
          console.log(ex.message)
          console.log("Failed to get room " + id);
        }
      }
      else if (xmlHttp.readyState == 4){
        console.log("Error: " + xmlHttp.status)
      }
    }
    xmlHttp.open("GET", "https://cards-against-humanity-d6aec.firebaseio.com/rooms/" + id + ".json", true); // true for asynchronous
    xmlHttp.send(null);
  }

  // Gets all rooms and calls the callback on the returned JSON string
  getAllRooms(callback: (string) => void){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      // Stuff to do if GET is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try{
          // NOTE- THIS STORES THE PASSWORD LOCALLY- FIX?
          var JSONArray = JSON.parse(xmlHttp.responseText);
          callback(JSON.stringify(JSONArray));
        }
        catch(ex){
          console.log("Failed to get deck");
        }
      }
      else if (xmlHttp.readyState == 4){
        console.log("Error: " + xmlHttp.status)
      }
    }
    xmlHttp.open("GET", "https://cards-against-humanity-d6aec.firebaseio.com/rooms.json", true); // true for asynchronous
    xmlHttp.send(null);
  }


  // Creates a room with an optional password, and add the user who sent this to the room
  createRoom(name: string, decks: Array<Deck>, userID: string, callback: (id: string)=> void, password ?: string){
    var hasPassword = !(password == undefined);

    // Set up data to be posted
    var data = {};
    data["isLocked"] = hasPassword;
    data["name"] = name;
    data["decks"] = decks;
    data["password"] = password;
    data["players"] = [userID];
    data["size"] = 3

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
          console.log("Failed to create room");
        }
      }
      else if (xmlHttp.readyState == 4){
        console.log("Error: " + xmlHttp.status)
      }
    };
    xmlHttp.open("POST", "https://cards-against-humanity-d6aec.firebaseio.com/rooms.json", true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    // Send the request
    xmlHttp.send(JSON.stringify(data));
  }

}
