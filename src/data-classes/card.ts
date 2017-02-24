/**
 * Created by jjxn on 2/19/2017.
 */

type CardTypes = 'black' | 'white';

// ======================================================================
// This Class outlines the data structure of a Card
// ======================================================================
export class Card {
  type: CardTypes;
  content: string;

  constructor(type: CardTypes, content: string) {
    this.type = type;
    this.content = content;
  }

  // built in indexOf function isn't working
  static getCardIndexIn(card: Card, cards: Array<Card>): number {
    for (var i=0; i<cards.length; i++) {
      if (cards[i].content == card.content) return i;
    }
    return -1;
  }
}

