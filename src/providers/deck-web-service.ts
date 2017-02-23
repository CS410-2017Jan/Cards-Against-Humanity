import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Deck } from '../data-classes/deck.ts';
import { Card } from '../data-classes/card.ts';

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

  // Gets all cards in the deck specified by the ID: throws exception if not found
  getDeck(id:string, callback: (deck: typeof Deck) => void){

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      // Stuff to do if GET is successful
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        try{
          var cards: typeof Card[] = [];
          var JSONArray = JSON.parse(xmlHttp.responseText);
          var blackCardsJSON = JSONArray.black;
          var whiteCardsJSON = JSONArray.white;
          // Add all the black cards
          for (let c of blackCardsJSON){
            if (c.pick == 1) {
              cards.push(new Card("black", c.text));
            }
          }
          // Add all the white cards
          for(let c of whiteCardsJSON){
            cards.push(new Card("white", c));
          }
          var deck : typeof Deck = new Deck(id);
          deck.cards = cards;
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

}
