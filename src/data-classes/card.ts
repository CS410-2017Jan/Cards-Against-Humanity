/**
 * Created by jjxn on 2/19/2017.
 */

type CardType = 'black' | 'white' | 'white_abstain' | 'black_abstain';

// ======================================================================
// This Class outlines the data structure of a Card
// ======================================================================
export class Card {
  type: CardType;
  content: string;

  constructor(type: CardType, content: string) {
    this.type = type;
    this.content = content;
  }

  // built in indexOf function isn't working
  static indexIn(card: Card, cards: Array<Card>): number {
    for (var i=0; i<cards.length; i++) {
      if (cards[i].content == card.content) return i;
    }
    return -1;
  }

  // built in indexOf function isn't working
  static member(card: Card, cards: Array<Card>): boolean {
    for (var i=0; i<cards.length; i++) {
      if (cards[i].content == card.content) return true;
    }
    return false;
  }
}

