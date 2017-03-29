/**
 * Created by Joshua Jackson on 19-Feb-17.
 */

import { Card } from './card';
import SeedRandom from 'seedrandom';

// ======================================================================
// This Class outlines the data structure and methods of a Deck
// ======================================================================
export class Deck {
  deckID;        // Unique deck id
  blackCards;    // Array of Cards of 'black' type
  whiteCards;    // Array of Cards of 'white' type
  discards;      // Array of discarded cards (includes both 'white' and 'black' cards)

  constructor(deckID: string, blackCards?: Array<Card>, whiteCards?: Array<Card>) {
    this.deckID = deckID;

    if (blackCards) {
      this.blackCards = blackCards;
    } else {
      this.blackCards = [];
    }

    if (whiteCards) {
      this.whiteCards = whiteCards;
    } else {
      this.whiteCards = [];
    }

    this.discards = [];
  }

  setSeed(seed: string) {
    console.log('seed:' + seed);
    try {
      SeedRandom(seed, { global: true });
    } catch (ex) {
      console.log(ex);
    }
    console.log(Math.random());
    console.log(Math.random());
    console.log(Math.random());
  }

  // adds given card to cards
  addCard(card: Card) {
    if (card.type == 'white') {
      this.whiteCards.push(card);
    } else if (card.type == 'black') {
      this.blackCards.push(card);
    } else {
      console.log('ERROR: attempted to add card of unknown type to deck!');
    }
  }

  // removes given card from cards
  removeCard(card: Card) {
    if (card.type == 'white') {
      this.whiteCards.remove(card);
    } else if (card.type == 'black') {
      this.blackCards.remove(card);
    } else {
      console.log('ERROR: attempted to add card of unknown type to deck!');
    }
  }

  // shuffles the cards in the deck
  shuffle(seed: string) {
    console.log('STUB: deck.shuffle()');
    this.shuffleWhiteCards(seed);
    //shuffleBlackCards(seed);
  }

  // shuffles just the white cards in the deck
  shuffleWhiteCards(seed: string) {

    //var whiteIndexArray = Array.apply(null, {length: this.whiteCards.length}).map(Number.call, Number);
    //this.shuffleArray(whiteIndexArray);
    //this.seedShuffle(seed);
  }

  shuffleArray(a: Array<any>) {
    var j, x, i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
    //return a;
  }
  //
  // seedShuffle(ar: Array<Card>, seeds: Array<number>): (Array<Card>) {
  //   var seeds = ;
  //   var numbers = [];
  //   for( var a = 0, max = ar.length; a < max; a++){
  //     numbers.push(a);
  //   }
  //   var shuffled = [];
  //   for( var i = 0, len = ar.length; i < len; i++ ){
  //     var r = parseInt(seeds[i] * (len - i));
  //     shuffled.push(ar[numbers[r]]);
  //     numbers.splice(r,1);
  //   }
  //   return shuffled;
  // }

  // returns next white card in deck that hasn't been discarded
  // returns false if all cards have been discarded
  drawWhiteCard() : Card | false {
    return this.drawCard('white');
  }

  // returns next black card in deck that hasn't been discarded
  // returns false if all cards have been discarded
  drawBlackCard() : Card | false {
    return this.drawCard('black');
  }

  // taking a string type as a param is more flexible in case we eventually
  // implement drawing a card of any type, etc
  drawCard(type: string) {
    console.log('start drawCard');
    var cards = (type == 'white') ? this.whiteCards : this.blackCards;
    for (var i=0; i<cards.length; i++) {
      if (cards[i].type == type) {
        // if the potential drawn card hasnt been discarded
        if (!Card.member(cards[i], this.discards)) {
          this.discard(cards[i]);
          console.log('drawCard returning:');
          console.log(cards[i]);
          return cards[i];
        }
      }
    }
    console.log('ERROR: drawCard returning false');
    // stub returns first card everytime
    return false;
  }

  // adds given card to discards array
  discard(card: Card) {
    console.log('discarding card: ' + card.content);
    if (!Card.member(card, this.discards)) {
      this.discards.push(card);
    } else {
      console.log('tried to discard a card ALREADY in the discards (probably just playing a black card)');
    }
  }

  // empties the discards array
  reset() {
    console.log('reset deck discards array');
    this.discards = [];
  }

  // prints the deck to the console
  printDeck() {
    console.log("Deck ID: " + this.deckID);
    console.log("Cards:");
    for(let c of this.whiteCards){
      console.log(" " + c.content);
    }
    for(let c of this.blackCards){
      console.log(" " + c.content);
    }
  }

  // creates n number of decks with the whiteCards distributed evenly. each of n decks
  // has all the blackCards. Used to deal a single deck amoung several players.
  deal(n: number) : Array<Deck> {

    var acc = [];
    // create n sub decks
    for (var i=0; i<n; i++) {
      // the deckID's generated are OK since we're not saving these to the Database
      acc[i] = new Deck(this.deckID+'-'+(i+1), this.blackCards);
    }

    var indexArray = Array.apply(null, {length: this.whiteCards.length}).map(Number.call, Number);
    console.log('before shuffle indexArray:');
    console.log(indexArray);
    this.shuffleArray(indexArray);
    console.log('after shuffle indexArray:');
    console.log(indexArray);
    for (var i=0; i<this.whiteCards.length; i++) { // for each white card
      //var index = Math.random();
      acc[i % n].addCard(this.whiteCards[indexArray[i]]);
    }

    return acc;
  }
}
