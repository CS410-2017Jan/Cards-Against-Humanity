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
import {ScoreBoardPage} from "./score-board";
import {LeaderboardFacade} from "../../providers/facades/leaderboard-facade";

let comp: ScoreBoardPage;
let fixture: ComponentFixture<ScoreBoardPage>;
let de: DebugElement;
let el: HTMLElement;

describe('Page: Room Setup Page', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({

      declarations: [MyApp, ScoreBoardPage],

      providers: [
        {provide: LeaderboardFacade, useClass: LeaderboardFacade}
      ],

      imports: [
        IonicModule.forRoot(MyApp)
      ]

    }).compileComponents();

  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(ScoreBoardPage);
    comp = fixture.componentInstance;

  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    de = null;
    el = null;
  });

  it('Score Board Page is created', () => {

    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();

  });
});
