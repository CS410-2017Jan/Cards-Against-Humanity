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

  constructor() {

  }

  //
  renderBlackCard(card: Card) {
    console.log('STUB: renderBlackCard()');
  }

  //
  renderWinningCard(card: Card) {
    console.log('STUB: renderWinningCard()');
  }

  //
  clearWinningCard() {
    console.log('STUB: clearWinningCard');
  }

  //
  renderContinueButton() {
    console.log('STUB: renderContinueButton');
  }

  //
  clearContinueButton() {
    console.log('STUB: clearContinueButton');
  }

  //
  renderHand(hand: Array<Card>) {
    console.log('STUB: renderHand');
  }

  //
  clearHand() {
    console.log('STUB: clearHand');
  }

  //
  renderCardsSubmitted(cardsSubmitted: Array<CardSubmission>, clickable: boolean) {
    console.log('STUB: renderCardsSubmitted');
  }

  //
  clearCardsSubmitted() {
    console.log('STUB: clearCardsSubmitted');
  }

  //
  renderScores(players: Array<Player>) {
    console.log('STUB: renderScores');
  }

  //
  renderText(str: string) {
    console.log('STUB: renderText');
  }

  //
  renderGameOver(players: Array<Player>) {
    console.log('STUB: renderGameOver');
  }
}
