/**
 * Created by ScottHenry on 2017-03-24.
 */

import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import {NavMock} from "../../mocks";
import {NavController} from "ionic-angular/index";
import {RoomFacade} from "../../providers/facades/room-facade";
import {UserFacade} from "../../providers/facades/user-facade";
import {NavParams} from "ionic-angular/index";
import {AlertController} from "ionic-angular/index";
import {MockNavParams} from "../../mocks";
import {GamePage} from "./game";
import {ModalController} from "ionic-angular/index";
import {ToastController} from "ionic-angular/index";
import {UserFacadeMock} from "../../mocks";
import {EndGameModalPage} from "./game";
import {Deck} from "../../data-classes/deck";
import {Card} from "../../data-classes/card";
import {Player} from "../../data-classes/player";
import PubNub from 'pubnub';
import {GamePlay} from "./game-play";
import {GameRendererStub} from "./game-renderer-stub";
import {PubNubMsg} from "../../data-classes/pubnub-msg";
import {CardSubmission} from "../../data-classes/card-submission";
import {ProgressBarComponent} from "../../components/progress-bar/progress-bar";

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
// Tests
// ======================================================================
let gamePage: GamePage;
let fixture: ComponentFixture<GamePage>;
let de: DebugElement;
let el: HTMLElement;

describe('Page: Game Page', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({

      declarations: [MyApp, GamePage, ProgressBarComponent],

      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: UserFacade, useClass: UserFacadeMock},
        {provide: NavParams, useClass: MockNavParams},
        {provide: AlertController, useClass:AlertController},
        {provide: ModalController, useClass:ModalController},
        {provide: ToastController, useClass:ToastController}
      ],

      imports: [
        IonicModule.forRoot(MyApp)
      ]

    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePage);
    gamePage = fixture.componentInstance;
    fixture.detectChanges();

  });

  // spy on console
  beforeEach(function(){
    spyOn(window.console, 'log');
  });

  beforeEach(() => {
    var testGameRenderer = new GameRendererStub();

    gamePage.GamePlay = new GamePlay(this.userCtrl,
      'testChannel',
      'sub-c-a72c3874-e836-11e6-b3b8-0619f8945a4f',
      'pub-c-4c3ec11e-305a-420f-ba3b-265b35ee99e7',
      'user1',
      testPlayers,
      testDeck,
      testGameRenderer,
      true);
  });

  afterEach(() => {
    fixture.destroy();
    gamePage = null;
    de = null;
    el = null;
  });

  it('Game Page is created', () => {
    expect(fixture).toBeTruthy();
    expect(gamePage).toBeTruthy();
  });

  it('Correct Game Params', () => {
    console.log(gamePage);
    expect(gamePage.USERNAME).toEqual('user1');
    expect(gamePage.CHANNEL).toEqual('game_001');
    expect(gamePage.PLAYERS).toEqual(testPlayers);
    //expect(gamePage.DECK).toEqual(testDeck.deal(5)[0]);
  });

  it('Game Starts When Players Join', () => {
    gamePage.GamePlay.signalJoined();

    // fake players joining
    gamePage.GamePlay.handlePresence({action: 'join', uuid: 'user1'});
    gamePage.GamePlay.handlePresence({action: 'join', uuid: 'user2'});
    gamePage.GamePlay.handlePresence({action: 'join', uuid: 'user3'});
    expect(gamePage.GamePlay.joinedCount).toEqual(3);
    expect(gamePage.GamePlay.gameStarted).toBeFalsy;
    gamePage.GamePlay.handlePresence({action: 'join', uuid: 'user4'});
    gamePage.GamePlay.handlePresence({action: 'join', uuid: 'user5'});


    // game should have auto-started
    expect(gamePage.GamePlay.joinedCount).toEqual(5);
    expect(gamePage.GamePlay.gameStarted).toBeTruthy;
    expect(gamePage.GamePlay.hand.length).toEqual(4);

    //gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('JOINED', JSON.stringify('user2')))});
    //gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('JOINED', JSON.stringify('user2')))});
  });

  it('Test Signal Leaving Clears Timers', () => {
    gamePage.GamePlay.signalLeaving();
    expect(window.console.log).toHaveBeenCalledWith('========== cleared both timers');
  });

  it('Test White Card Timer Expire', () => {
    gamePage.GamePlay.startGame();

    // play a black card
    gamePage.GamePlay.playCard(gamePage.GamePlay.deck.drawBlackCard());

    // fake card submissions
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user2', testWhiteCards[0]))))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user3', testWhiteCards[1]))))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user4', testWhiteCards[2]))))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user5', testWhiteCards[3]))))});

    // pick winning card
    gamePage.GamePlay.pickWinningCard(gamePage.GamePlay.cardsSubmitted[0]);

    // request continue the round
    gamePage.GamePlay.requestContinue();

    // check our continue request was received
    expect(console.log).toHaveBeenCalledWith('case: REQUEST_CONTINUE');

    // fake continue requests
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('REQUEST_CONTINUE', JSON.stringify('user2')))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('REQUEST_CONTINUE', JSON.stringify('user3')))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('REQUEST_CONTINUE', JSON.stringify('user4')))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('REQUEST_CONTINUE', JSON.stringify('user5')))});

    // check a new round auto-started
    expect(console.log).toHaveBeenCalledWith('case: NEW_ROUND');
    expect(gamePage.GamePlay.roundNumber).toEqual(2);
    expect(gamePage.GamePlay.judge.username).toEqual('user2');

    // fail to submit our white card
    gamePage.GamePlay.whiteCardTimerExpire();

    // check white abstain was sent
    expect(window.console.log).toHaveBeenCalledWith('START: sendMsg: {"username":"user1","card":{"type":"white_abstain","content":""}}');
  });

  it('Test Pick Winner Timer Expire', () => {
    gamePage.GamePlay.startGame();

    // play a black card
    gamePage.GamePlay.playCard(gamePage.GamePlay.deck.drawBlackCard());

    // fake card submissions
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user2', testWhiteCards[0]))))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user3', testWhiteCards[1]))))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user4', testWhiteCards[2]))))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user5', testWhiteCards[3]))))});

    // fail to submit our white card
    gamePage.GamePlay.pickWinnerTimerExpire();

    // check black abstain was sent
    expect(window.console.log).toHaveBeenCalledWith('START: sendMsg: {"username":"user1","card":{"type":"black_abstain","content":""}}');
  });

  it('Game Plays With 5 Players', () => {
    gamePage.GamePlay.startGame();

    // play a black card
    gamePage.GamePlay.playCard(gamePage.GamePlay.deck.drawBlackCard());

    // check black card was sent
    expect(window.console.log).toHaveBeenCalledWith('STUB: renderBlackCard');

    // fake card submissions
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user2', testWhiteCards[0]))))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user3', testWhiteCards[1]))))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user4', testWhiteCards[2]))))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user5', testWhiteCards[3]))))});

    // check cards were rendered
    expect(window.console.log).toHaveBeenCalledWith('STUB: renderCardsSubmitted');

    // play a bad card we don't have
    gamePage.GamePlay.playCard(testWhiteCards[3]);

    // should have thrown error msg
    expect(window.console.log).toHaveBeenCalledWith("ERROR: tried to play a card that somehow wasn't in this.hands");

    // pick winning card
    gamePage.GamePlay.pickWinningCard(gamePage.GamePlay.cardsSubmitted[0]);

    // check correct player won
    expect(gamePage.GamePlay.getLeadingPlayer()).toEqual(testPlayers[1]);

    // should have rendered winning card
    expect(window.console.log).toHaveBeenCalledWith('STUB: renderWinningCard');

    // request continue the round
    gamePage.GamePlay.requestContinue();

    // check our continue request was received
    expect(console.log).toHaveBeenCalledWith('case: REQUEST_CONTINUE');

    // fake continue requests
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('REQUEST_CONTINUE', JSON.stringify('user2')))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('REQUEST_CONTINUE', JSON.stringify('user3')))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('REQUEST_CONTINUE', JSON.stringify('user4')))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('REQUEST_CONTINUE', JSON.stringify('user5')))});

    // check we received their continue requests
    expect(console.log).toHaveBeenCalledWith('case: REQUEST_CONTINUE');
    expect(console.log).toHaveBeenCalledWith('case: REQUEST_CONTINUE');
    expect(console.log).toHaveBeenCalledWith('case: REQUEST_CONTINUE');
    expect(console.log).toHaveBeenCalledWith('case: REQUEST_CONTINUE');

    // check a new round auto-started
    expect(console.log).toHaveBeenCalledWith('case: NEW_ROUND');
    expect(gamePage.GamePlay.roundNumber).toEqual(2);
    expect(gamePage.GamePlay.judge.username).toEqual('user2');

    // play a white card
    var tempCard = gamePage.GamePlay.hand[0];
    gamePage.GamePlay.playCard(tempCard);

    // fake card submissions
    //gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user1', tempCard))))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user3', testWhiteCards[3]))))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user4', testWhiteCards[4]))))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user5', testWhiteCards[5]))))});

    // check card submissions auto-rendered
    expect(console.log).toHaveBeenCalledWith('STUB: renderCardsSubmitted');

    // fake judge picking black card
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_BLACK_CARD', JSON.stringify(new CardSubmission('user2', testBlackCards[2]))))});

    // should have rendered winning card
    expect(window.console.log).toHaveBeenCalledWith('STUB: renderWinningCard');

    // request continue the round
    gamePage.GamePlay.requestContinue();

    // check our continue request was received
    expect(console.log).toHaveBeenCalledWith('case: REQUEST_CONTINUE');

    // fake continue requests
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('REQUEST_CONTINUE', JSON.stringify('user2')))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('REQUEST_CONTINUE', JSON.stringify('user3')))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('REQUEST_CONTINUE', JSON.stringify('user4')))});
    gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('REQUEST_CONTINUE', JSON.stringify('user5')))});

    // check we received their continue requests
    expect(console.log).toHaveBeenCalledWith('case: REQUEST_CONTINUE');
    expect(console.log).toHaveBeenCalledWith('case: REQUEST_CONTINUE');
    expect(console.log).toHaveBeenCalledWith('case: REQUEST_CONTINUE');
    expect(console.log).toHaveBeenCalledWith('case: REQUEST_CONTINUE');

    // check a new round auto-started
    expect(gamePage.GamePlay.roundNumber).toEqual(3);
    expect(gamePage.GamePlay.judge.username).toEqual('user3');

    // fake judge leaving
    gamePage.GamePlay.handlePresence({action: 'leave', uuid: 'user3'});

    // check a new round auto-started
    expect(gamePage.GamePlay.collectingCards).toBeTruthy;
    expect(gamePage.GamePlay.roundNumber).toEqual(4);
    expect(gamePage.GamePlay.judge.username).toEqual('user4');

    // play a white card
    var tempCard = gamePage.GamePlay.hand[0];
    gamePage.GamePlay.playCard(tempCard);

    // fake players leaving to end game
    gamePage.GamePlay.handlePresence({action: 'leave', uuid: 'user5'});
    gamePage.GamePlay.handlePresence({action: 'leave', uuid: 'user4'});

    // check game ended
    expect(console.log).toHaveBeenCalledWith('STUB: renderText: Not enough players to continue the game...');


    // // fake card submissions
    // expect(gamePage.GamePlay.collectingCards).toBeTruthy;
    // //gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user3', testWhiteCards[6]))))});
    // //gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user4', testWhiteCards[7]))))});
    // gamePage.GamePlay.handleEvent({message: JSON.stringify(new PubNubMsg('PLAY_WHITE_CARD', JSON.stringify(new CardSubmission('user5', testWhiteCards[8]))))});
    //
    // //expect(gamePage.GamePlay.cardsSubmitted).toEqual('');
    //
    // // fake player leaving part way through collecting card submissions after he submitted a card
    // gamePage.GamePlay.handlePresence({action: 'leave', uuid: 'user5'});
    // expect(gamePage.GamePlay.collectingCards).toBeTruthy;
    // expect(window.console.log).toHaveBeenCalledWith('Player: user5 left a round in progress AFTER submitting a card');

  });

});
