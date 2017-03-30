/**
 * Created by Joshua Jackson on 29-Mar-17.
 */

import { NavController, NavParams, ToastController,AlertController, ModalController, ViewController, Platform} from 'ionic-angular';
import { Component } from '@angular/core';

import { IGameRenderer } from './i-game-renderer';
import { GamePage } from './game';
import { Card } from '../../data-classes/card';
import { Player } from '../../data-classes/player';
import { CardSubmission } from '../../data-classes/card-submission';
import { Tools } from '../../tools/general-tools';

// ======================================================================
// This Class a development stub implementation of the interface IGameRenderer
// ======================================================================
export class GameRendererStub implements IGameRenderer {

  // vars to render using angular:
  // text = '';
  // blackCard;
  // hand;
  // cardsSubmitted: Array<CardSubmission>;
  // continueButton;
  // //continueRequest;
  // winningCard;
  // clickable;
  // players;

  constructor() {
  }


  // ======================================================================
  // Below functions are what a user can do. The UI will tie to these functions
  // ======================================================================

  // called by user clicking a button or when the judge starts
  // a round and plays a black card
  requestPlayCard(card:Card) {
    console.log('STUB: requestPlayCard');
  }

  // called by user clicking a button to request continuing the game
  requestContinue() {
    console.log('STUB: requestContinue');
  }

  openScoreModal() {
    console.log('STUB: openScoreModal');
  }

  // ======================================================================
  // Below functions implement the interface: IGameRender
  // ======================================================================

  // set the var angular uses to render the black card
  renderBlackCard(card: Card) {
    console.log('STUB: renderBlackCard');
    console.log(card);
  }

  // sets the var angular uses to render the winning card
  renderWinningCard(card: Card) {
    console.log('STUB: renderWinningCard');
    console.log(card);
  }

  // clears the var angular uses to render the winning card
  clearWinningCard() {
    console.log('STUB: clearWinningCard');
  }


  // sets the boolean which tells angular to render the continue button
  renderContinueButton() {
    console.log('STUB: renderContinueButton');
  }

  // falsifies the boolean which tells angular to clear the continue button
  clearContinueButton() {
    console.log('STUB: clearContinueButton');
  }

  // // called when some player requests continuing
  // renderContinueRequest() {
  //   console.log('STUB: renderContinueRequest');
  // }
  //
  // // not currently in use
  // clearContinueRequest() {
  //   console.log('STUB: clearContinueRequest');
  // }

  // sets the hand var angular uses to render this player's hand of cards
  renderHand(hand: Array<Card>) {
    console.log('STUB: renderHand');
    console.log(hand);
  }

  // clears the hand var angular uses to render this player's hand of cards
  clearHand() {
    console.log('STUB: clearHand');
  }

  // sets the vars angular uses to render this round's submitted cards
  renderCardsSubmitted(cardsSubmitted: Array<CardSubmission>, clickable: boolean) {
    console.log('STUB: renderCardsSubmitted');
    console.log(cardsSubmitted);
  }

  // clears the vars angular uses to render this round's submitted cards
  clearCardsSubmitted() {
    console.log('STUB: clearCardsSubmitted');
  }

  // sets the var angular uses to render players' scores
  renderScores(players: Array<Player>) {
    console.log('STUB: renderScores');
    console.log(players);
  }

  // sets the text var angular uses to display text instructions/messages
  renderText(str: string) {
    console.log('STUB: renderText: ' + str);
  }
  // renders the countdown timer with the given duration (in seconds)
  // for players submitting white cards
  renderWhiteCardTimer(seconds: number) {
    console.log('STUB: renderWhiteCardTimer: ' + seconds);
  };

  //clears the White Card submission timer
  clearWhiteCardTimer() {
    console.log('STUB: clearWhiteCardTimer');
  };

  // renders the countdown timer with the given duration (in seconds)
  // for players submitting black cards
  renderPickWinnerTimer(seconds: number) {
    console.log('STUB: renderPickWinnerTimer: ' + seconds);
  };

  //clears the Black Card submission timer
  clearPickWinnerTimer() {
    console.log('STUB: clearPickWinnerTimer');
  };

  // called when the game ends because there are not enough players
  renderNotEnoughPlayers(players: Array<Player>) {
    console.log('STUB: renderScores');
    console.log(players);
  };

  // render the Game Over state
  renderGameOver(players: Array<Player>) {
    console.log('STUB: renderGameOver');
  }

  // render the player's newly updated global score
  renderNewGlobalScore(score: number) {
    console.log('STUB: renderNewGlobalScore: ' + score);
  };
}
