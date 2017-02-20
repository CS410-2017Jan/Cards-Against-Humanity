/**
 * Created by Joshua Jackson on 18-Feb-17.
 */

import { Deck } from './data-classes/deck';
import { Card } from './data-classes/card';
import { Player } from './data-classes/player';

// ======================================================================
// This Class contains the gamestate and methods to modify/play the game
// ======================================================================
export class GamePlay {
  CHANNEL;
  SUBKEY;
  PUBKEY;
  NUM_CARDS_HAND = 5;

  deck;
  players = [];     // array of players currently in the game
  cardsPlayed = 0;  // the number of cards played so far total
  hand = [];        // array of cards
  roundNumber = 0;  // current round number

  constructor(channel: string,
              subkey: string,
              pubkey: string,
              players: typeof Player[],
              deck: typeof Deck) {

    this.CHANNEL = channel;
    this.SUBKEY = subkey;
    this.PUBKEY = pubkey;

    this.players = players;
    this.deck = deck;
  }

  // starts the game
  // deals out NUM_CARDS_HAND and then starts new round
  startGame() {
    console.log('STUB: startGame()');
  }

  // updates gamestate and sets up new round
  newRound() {
    console.log('starting new round stub');
  }

  // uses gamestate to draw next card from the deck
  drawCard() : typeof Card {
    console.log('STUB: drawCard()');
    return this.deck.drawCard();
  }

  pickWinningCard(card: typeof Card) {
    console.log('STUB: pickWinningCard()');
  }

  //
  updateScores() {
    console.log('STUB: updateScores()');
  }

  // TODO: do we need this method?
  pickJudge() {
    console.log('STUB: pickJudge()');
  }

}
