/**
 * Created by Joshua Jackson on 21-Feb-17.
 */

import { Card } from './card';
import { Player } from './player';
import { CardSubmission } from './card-submission';
import { Tools } from '../tools/general-tools';

// ======================================================================
// This Class is more like an interface, but with stubs. So it's an
// abstract class which renders game events
// ======================================================================
export abstract class GameRenderer {

  // vars to render using angular:
  text = '';
  blackCard;
  hand;
  cardsPlayed: Array<CardSubmission>;
  continueButton;
  //continueRequest;
  winningCard;
  clickable;
  players;

  constructor() {
    // this is an abstract class. you should not instantiate an abstract class. don't do it.
  }

  // set the var angular uses to render the black card
  renderBlackCard(card: Card) {
    console.log('STUB: renderBlackCard()');
    this.blackCard = card;
  }

  // sets the var angular uses to render the winning card
  renderWinningCard(card: Card) {
    console.log('STUB: renderWinningCard()');
    this.winningCard = card;
  }

  // clears the var angular uses to render the winning card
  clearWinningCard() {
    console.log('STUB: clearWinningCard');
    this.winningCard = false;
  }

  // sets the boolean which tells angular to render the continue button
  renderContinueButton() {
    console.log('STUB: renderContinueButton');
    this.continueButton = true;
  }

  // falsifies the boolean which tells angular to clear the continue button
  clearContinueButton() {
    console.log('STUB: clearContinueButton');
    this.continueButton = false;
  }

  // called when some player requests continuing
  renderContinueRequest() {
    console.log('STUB: renderContinueRequest');
    //this.continueRequest = true;
  }

  // not currently in use
  clearContinueRequest() {
    console.log('STUB: clearContinueRequest');
    //this.continueRequest = false;
  }

  // sets the hand var angular uses to render this player's hand of cards
  renderHand(hand: Array<Card>) {
    console.log('STUB: renderHand');
    this.hand = hand;
  }

  // clears the hand var angular uses to render this player's hand of cards
  clearHand() {
    console.log('STUB: clearHand');
    this.hand = [];
  }

  // sets the vars angular uses to render this round's submitted cards
  renderCardsPlayed(cardsPlayed: Array<CardSubmission>, clickable: boolean) {
    console.log('STUB: renderCardsPlayed');
    console.log(cardsPlayed);
    this.clickable = clickable;
    this.cardsPlayed = cardsPlayed;
  }

  // clears the vars angular uses to render this round's submitted cards
  clearCardsPlayed() {
    console.log('STUB: clearCardsPlayed');
    this.cardsPlayed = [];
  }

  // sets the var angular uses to render players' scores
  renderScores(players: Array<Player>) {
    console.log('STUB: renderScores');
    this.players = Tools.clone(players);
    console.log(this.players);
  }

  // sets the text var angular uses to display text instructions/messages
  renderText(str: string) {
    console.log('STUB: renderText');
    this.text = str;
  }
}


