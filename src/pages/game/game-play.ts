/**
 * Created by Joshua Jackson on 18-Feb-17.
 */

import { Deck } from './data-classes/deck';
import { Card } from './data-classes/card';
import { Player } from './data-classes/player';

export class GamePlay {
  CHANNEL;
  NUM_CARDS_HAND = 5;

  deck;
  players = [];     // array of players currently in the game
  cardsPlayed = 0;  // the number of cards played so far total
  hand = [];        // array of cards
  roundNumber = 0;  // current round number

  constructor(channel: string, players: [typeof Player], deck: typeof Deck) {
    this.CHANNEL = channel;
    this.deck = deck;
    this.players = players;
  }

  // starts the game
  // deals out NUM_CARDS_HAND and then starts new round
  startGame() {
    console.log('startGame stub');
  }

  // updates gamestate and sets up new round
  newRound() {
    console.log('starting new round stub');
  }

  // uses gamestate to draw next card from the deck
  drawCard() : typeof Card {
    console.log('drawCard stub');
    return this.deck.drawCard;
  }

  //
  updateScores() {
    console.log('updateScores stub');
  }

  pickJudge() {
    console.log('pickJudge stub');
  }

}
