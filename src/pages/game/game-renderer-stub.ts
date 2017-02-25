/**
 * Created by Joshua Jackson on 21-Feb-17.
 */

import { IGameRenderer } from './i-game-renderer';
import { Card } from '../../data-classes/card';
import { Player } from '../../data-classes/player';
import { CardSubmission } from '../../data-classes/card-submission';
import { Tools } from '../../tools/general-tools';

// ======================================================================
// This Class a development stub implementation of the interface IGameRenderer
// ======================================================================
export class GameRendererStub implements IGameRenderer {

  // vars to render using angular:
   text = '';
   blackCard;
   hand;
   cardsSubmitted: Array<CardSubmission>;
   continueButton;
   //continueRequest;
   winningCard;
   clickable;
   players;

   constructor() {

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

  // // called when some player requests continuing
  // renderContinueRequest() {
  //   console.log('STUB: renderContinueRequest');
  //   //this.continueRequest = true;
  // }
  //
  // // not currently in use
  // clearContinueRequest() {
  //   console.log('STUB: clearContinueRequest');
  //   //this.continueRequest = false;
  // }

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
  renderCardsSubmitted(cardsSubmitted: Array<CardSubmission>, clickable: boolean) {
    console.log('STUB: renderCardsSubmitted');
    console.log(cardsSubmitted);
    this.clickable = clickable;
    this.cardsSubmitted = cardsSubmitted;
  }

  // clears the vars angular uses to render this round's submitted cards
  clearCardsSubmitted() {
    console.log('STUB: clearCardsSubmitted');
    this.cardsSubmitted = [];
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
