/**
 * Created by jjxn on 2/19/2017.
 */

type CardTypes = 'black' | 'white';

export class Card {
  type: CardTypes;
  content: string;

  constructor(type: CardTypes, content: string) {
    this.type = type;
    this.content = content;
  }
}
