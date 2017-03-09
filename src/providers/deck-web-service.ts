import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Deck } from '../data-classes/deck';
import { Card } from '../data-classes/card';

/*
  Generated class for the DeckWebService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.

  Author: toldham
*/
@Injectable()
export class DeckWebService {


  constructor() {
  }

  // Gets all cards in the deck specified by the ID from DB: throws exception if not found
  getDeck(id:string, callback: (deck: Deck) => void){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      // Stuff to do if GET is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try{
          var cards: typeof Card[] = [];
          var JSONArray = JSON.parse(xmlHttp.responseText);
          var blackCardsJSON = JSONArray.black;
          var whiteCardsJSON = JSONArray.white;

          var deck : Deck = new Deck(id);

          // Add all the black cards
          for (let c of blackCardsJSON){
            if (c.pick == 1) { // only allow black cards with one '_____' slot to fill
              deck.addCard(new Card("black", c.text));
            }
          }
          // Add all the white cards
          for(let c of whiteCardsJSON){
            deck.addCard(new Card("white", c));
          }

          // Add this deck to the cache since we have it
          var ws = new DeckWebService();
          ws.addDeckToCache(deck);

          callback(deck);
        }
        catch(ex){
          console.log("Failed to get deck");
        }
      }
      else if (xmlHttp.readyState == 4){
        console.log("Error: " + xmlHttp.status)
      }
    }
    xmlHttp.open("GET", "https://cards-against-humanity-d6aec.firebaseio.com/decks/" + id + ".json", true); // true for asynchronous
    xmlHttp.send(null);


  }

  // Gets a deck from the cache, returning undefined if not found
  getDeckFromCache(id) : Deck {
    var JSONObject;
    try{
      JSONObject = JSON.parse(sessionStorage.getItem("deckCache"));
      // Check if the deck is in the cache
      if (JSONObject[id] != undefined){
        return new Deck(JSONObject.deckID, JSONObject.blackCards, JSONObject.whiteCards);
        //return(JSONObject[id]);
      }
      else{
        return undefined;
      }

    }
    catch(ex){
      // Failed to parse JSON probably because our cache is empty
      return undefined;
    }

  }

  // Adds one deck to the deck cache
  addDeckToCache(deck: Deck){
    var JSONObject;
    try{
      JSONObject = JSON.parse(sessionStorage.getItem("deckCache"));
      // Check if this deck is already in the cache, if so remove them
      if (JSONObject[deck.deckID] != undefined){
        delete JSONObject[deck.deckID];
      }

    }
    catch(ex){
      // Failed to parse JSON probably because our cache is empty
      JSONObject = JSON.parse("{}");
    }
    // Add User to JSON Object and save it to cache
    JSONObject[deck.deckID] = deck;
    sessionStorage.setItem("deckCache", JSON.stringify(JSONObject));

    //console.log(sessionStorage.getItem("deckCache"));
  }

}
