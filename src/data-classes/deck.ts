/**
 * Created by Joshua Jackson on 19-Feb-17.
 */

import { Card } from './card.ts';

// ======================================================================
// This Class outlines the data structure and methods of a Deck
// ======================================================================
export class Deck {
  deckID;
  cards;    // array of Card
  discards;

  constructor(deckID: string, cards?: Array<typeof Card>) {
    this.deckID = deckID;

    if (cards) {
      this.cards = cards;
    } else {
      this.cards = [];
    }

    this.discards = [];
  }

  // adds given card to cards
  addCard(card: typeof Card) {
    this.cards.push(card);
  }

  // removes given card from cards
  removeCard(card: typeof Card) {
    this.cards.remove(card);
  }

  // shuffles the cards in the deck
  shuffle() {
    console.log('STUB: deck.shuffle()');
  }

  // returns next white card in deck that hasn't been discarded
  // returns false if all cards have been discarded
  drawWhiteCard() : typeof Card | false {
    return this.drawCard('white');
  }

  // returns next black card in deck that hasn't been discarded
  // returns false if all cards have been discarded
  drawBlackCard() : typeof Card | false {
    return this.drawCard('black');
  }

  drawCard(type: string) {
    console.log('start drawCard');
    for (var i=0; i<this.cards.length; i++) {
      if (this.cards[i].type == type) {
        // if the potential drawn card hasnt been discarded
        if (!Card.member(this.cards[i], this.discards)) {
          this.discard(this.cards[i]);
          return this.cards[i];
        }
      }
    }
    // stub returns first card everytime
    return false;
  }

  // adds given card to discards array
  discard(card: typeof Card) {
    console.log('discarding card: ' + card.content);
    if (!Card.member(card, this.discards)) {
      this.discards.push(card);
    } else {
      console.log('tried to discard a card ALREADY in the discards (probably just playing a black card)');
    }
    console.log('new discards: ');
    console.log(this.discards);
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
    for(let c of this.cards){
      console.log(" " + c.content);
    }
  }
}
