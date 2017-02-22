/**
 * Created by Joshua Jackson on 21-Feb-17.
 */

import { Card } from './card.ts';

export abstract class GameRenderer {
  renderBlackCard(card: typeof Card) {
    console.log('STUB: renderBlackCard()');
  }

  renderWhiteCard(card: typeof Card) {
    console.log('STUB: renderBlackCard()');
  }
}
