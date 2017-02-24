/**
 * Created by Joshua Jackson on 23-Feb-17.
 */

import { Card } from './card.ts';

export class CardSubmission {
  username: string;
  card: typeof Card;

  constructor(username: string, card: typeof Card) {
    this.username = username;
    this.card = card;
  }
}
