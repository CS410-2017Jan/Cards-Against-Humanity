import {Deck} from "./data-classes/deck";
import {Card} from "./data-classes/card";

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
        password: "sucks",
        users:[{username: "scott", id:"2232",base64Image:"23423423"},
          {username: "Hello", id:"342", base64Image:"23423423"}],
        size: 3
      }
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
