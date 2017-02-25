/**
 * Created by Joshua Jackson on 21-Feb-17.
 */

import { Card } from '../../data-classes/card';
import { Player } from '../../data-classes/player';
import { CardSubmission } from '../../data-classes/card-submission';

// ======================================================================
// This interface is used by game.ts to make calls to render functions
// ======================================================================
export interface IGameRenderer {

  // renders the black card
  renderBlackCard(card: Card);

  // renders the card which won the round
  renderWinningCard(card: Card);

  // clears the winning card
  clearWinningCard();

  // renders an option allowing the user to request continuing the game
  renderContinueButton();

  // clears the continue button option
  clearContinueButton();

  // not currently in use
  // called when another player requests to continue the game
  // renderContinueRequest();

  // not currently in use
  // called to clear any continue requests
  // clearContinueRequest();

  // renders the player's hand of white cards
  renderHand(hand: Array<Card>);

  // clears the player's hand of white cards
  clearHand();

  // renders the cards all players submitted for that round
  renderCardsSubmitted(cardsSubmitted: Array<CardSubmission>, clickable: boolean);

  // renders the cards all players submitted for that round
  clearCardsSubmitted();

  // renders the scores of each player each time the score is updated
  renderScores(players: Array<Player>);

  // renders text instructions
  renderText(str: string);
}


