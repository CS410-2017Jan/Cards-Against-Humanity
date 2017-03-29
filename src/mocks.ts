import {Deck} from "./data-classes/deck";
import {Card} from "./data-classes/card";
import {Player} from "./data-classes/player";

// ======================================================================
// Dummy Data for Mocks
// ======================================================================
var testBlackCards = [];
for (var i=0; i<100; i++) {
  testBlackCards.push(new Card('black', 'test black card #'+i));
}

var testWhiteCards = [];
for (var i=0; i<100; i++) {
  testWhiteCards.push(new Card('white', 'test white card #'+i));
}

var testDeck = new Deck('testDeckID', testBlackCards, testWhiteCards);

var testPlayers = [
  new Player('user1'),
  new Player('user2'),
  new Player('user3'),
  new Player('user4'),
  new Player('user5'),
];

// ======================================================================
// Mock Classes
// ======================================================================
export class ConfigMock {

  public get(): any {
    return '';
  }

  public getBoolean(): boolean {
    return true;
  }

  public getNumber(): number {
    return 1;
  }
}

export class FormMock {
  public register(): any {
    return true;
  }
}

export class MockNavParams{
  data = {
    room: {
        id: "001",
        decks: [testDeck],
        isLocked: true,
        name: "test room",
        password: "password",
        users:[
                {username: "user1", id:"111"},
                {username: "user2", id:"222"},
                {username: "user3", id:"333"},
                {username: "user4", id:"444"},
                {username: "user5", id:"555"},
              ],
        size: 5
      },
    username: 'user1'
  };

  get(param){
    return this.data[param];
  }
}

export class NavMock {

  public pop(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public push(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }
}

export class PlatformMock {
  public ready(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

export class ViewMock {
  public dismiss(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

export class MenuMock {
  public close(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}

export class UserFacadeMock {

  public getLoggedInUser(): any {
    return {
      'instance': {
        'username': 'something',
      },
    };
  }
}
