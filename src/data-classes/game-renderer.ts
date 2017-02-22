/**
 * Created by Joshua Jackson on 21-Feb-17.
 */

import { Card } from './card.ts';
import { GamePage } from '../pages/game/game';

export abstract class GameRenderer {
  GamePage;

  // vars to render:
  text = '';
  blackCard;
  hand;
  cardsPlayed;
  continueButton
  //continueRequest;
  winningCard;
  clickable;


  constructor(GamePage: GamePage) {
    this.GamePage = GamePage;
  }

  renderBlackCard(card: typeof Card) {
    console.log('STUB: renderBlackCard()');
    this.blackCard = card;
  }

  renderWinningCard(card: typeof Card) {
    console.log('STUB: renderWinningCard()');
    this.winningCard = card;
  }

  clearWinningCard() {
    this.winningCard = false;
  }

  renderContinueButton() {
    console.log('STUB: renderContinueRequest');
    this.continueButton = true;
  }

  clearContinueButton() {
    this.continueButton = false;
  }

  renderContinueRequest() {
    console.log('STUB: renderContinueRequest');
    //this.continueRequest = true;
  }

  clearContinueRequest() {
    console.log('STUB: clearContinueRequest');
    //this.continueRequest = false;
  }

  renderHand(hand: [typeof Card]) {
    this.hand = hand;
  }

  clearHand() {
    this.hand = [];
  }

  renderCardsPlayed(cardsPlayed: [typeof Card], clickable: boolean) {
    console.log('renderCardsPlayed');
    this.clickable = clickable;
    this.cardsPlayed = cardsPlayed;
  }

  clearCardsPlayed() {
    console.log('clearCardsPlayed');
    this.cardsPlayed = [];
  }

  renderText(str: string) {
    this.text = str;
  }


}
