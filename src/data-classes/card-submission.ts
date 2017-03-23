/**
 * Created by Joshua Jackson on 23-Feb-17.
 */

import { Card } from './card';

// ======================================================================
// This Class outlines the data structure of played Card
// ======================================================================
export class CardSubmission {
  username: string;
  card: Card;

  constructor(username: string, card: Card) {
    this.username = username;
    this.card = card;
  }

  // returns CardSubmission from given CardSubmissions corresponding to the given username
  static getCardSubmissionByUsername(cardSubmissions: Array<CardSubmission>, username: string): CardSubmission {
    var cardSubmission;
    for (let potCardSubmission of cardSubmissions) {
      if (potCardSubmission.username == username) cardSubmission = potCardSubmission;
    }

    return cardSubmission;
  }

  // removes given CardSubmission from given array of CardSubmissions
  static removeCardSubmission(cardSubmissions: Array<CardSubmission>, cardSubmission: CardSubmission): Array<CardSubmission> {
    var newCardSubmissions;
    for (let potCardSubmission of cardSubmissions) {
      if (potCardSubmission.username != cardSubmission.username) newCardSubmissions.push(potCardSubmission);
    }

    return newCardSubmissions;
  }
}
