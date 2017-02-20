/**
 * Created by jjxn on 2/19/2017.
 */

type cardTypes = 'black' | 'white';

export class Card {
  type: cardTypes;
  content: string;

  constructor(type: cardTypes, content: string) {
    this.type = type;
    this.content = content;
  }
}
