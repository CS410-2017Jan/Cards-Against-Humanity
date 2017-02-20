/**
 * Created by Joshua Jackson on 18-Feb-17.
 */

export class GamePlay {
  DECK;
  CHANNEL;
  NUM_CARDS_HAND = 5;

  numPlayers;       // current number of players in the game
  players = [];     // array of players currently in the game
  cardsPlayed = 0;  // the number of cards played so far total
  hand = [];        // array of cards
  roundNumber = 0;  // current round number


  constructor(channel: string, players: [string], deck: Object) {
    this.DECK = deck;
    this.CHANNEL = channel;

    this.players = players;
  }

  // grabs the username parameters from the URL and puts them into players
  buildPlayers() {
    for (var i = 1; i <= this.numPlayers; i++) {
      this.players.push("Player" + i);
    }
  }

  // starts the game
  // deals out NUM_CARDS_HAND and then starts new round
  startGame() {
    console.log('startGame stub');
  }

  // updates gamestate and sets up new round
  newRound() {
    console.log('starting new round stub');
  }

  // uses gamestate to draw next card from the deck
  drawCard() {
    console.log('drawCard stub');
  }

  //
  updateScores() {
    console.log('updateScores stub');
  }

  pickJudge() {
    console.log('pickJudge stub');
  }

}
