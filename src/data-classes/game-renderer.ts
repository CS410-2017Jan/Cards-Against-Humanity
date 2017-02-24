/**
 * Created by Joshua Jackson on 21-Feb-17.
 */

// <reference path='../tools/general-tools.ts' />

import { Card } from './card';
import { Player } from './player';
import { GamePage } from '../pages/game/game';
import { CardSubmission } from './card-submission';
import { Tools } from '../tools/general-tools';

export abstract class GameRenderer {
  GamePage;

  // vars to render:
  text = '';
  blackCard;
  hand;
  cardsPlayed: Array<CardSubmission>;
  continueButton;
  //continueRequest;
  winningCard;
  clickable;
  players;

  constructor(GamePage: GamePage) {
    this.GamePage = GamePage;
  }

  renderBlackCard(card: Card) {
    console.log('STUB: renderBlackCard()');
    this.blackCard = card;
  }

  renderWinningCard(card: Card) {
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

  renderHand(hand: Array<Card>) {
    this.hand = hand;
  }

  clearHand() {
    this.hand = [];
  }

  renderCardsPlayed(cardsPlayed: Array<CardSubmission>, clickable: boolean) {
    console.log('renderCardsPlayed');
    console.log(cardsPlayed);
    this.clickable = clickable;
    this.cardsPlayed = cardsPlayed;
  }

  clearCardsPlayed() {
    console.log('clearCardsPlayed');
    this.cardsPlayed = [];
  }

  renderScores(players: Array<Player>) {
    console.log('STUB: renderScores');
    this.players = Tools.clone(players);
    console.log(this.players);
  }

  renderText(str: string) {
    this.text = str;
  }
}


