/**
 * Created by Joshua Jackson on 21-Feb-17.
 */

import { Card } from './card.ts';

export abstract class GameRenderer {
  renderBlackCard(card: typeof Card) {
    console.log('STUB: renderBlackCard()');
    console.log(card);
  }

  renderWhiteCard(card: typeof Card) {
    console.log('STUB: renderWhiteCard()');
    console.log(card);
  }

  renderWinningCard(card: typeof Card) {
    console.log('STUB: renderWinningCard()');
    console.log(card);
  }

  renderContinueRequest(username: string) {
    console.log('STUB: renderContinueRequest');
    console.log('username: ' + username + ' wants to continue');
  }
}
