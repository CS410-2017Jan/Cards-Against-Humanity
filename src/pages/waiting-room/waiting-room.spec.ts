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
import {WaitingRoomPage} from "./waiting-room";
import {UserFacadeMock} from "../../mocks";

let comp: WaitingRoomPage;
let fixture: ComponentFixture<WaitingRoomPage>;
let de: DebugElement;
let el: HTMLElement;

describe('Page: Waiting Room Page', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({

      declarations: [MyApp, WaitingRoomPage],

      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: RoomFacade, useClass: RoomFacade},
        {provide: UserFacade, useClass: UserFacadeMock},
        {provide: NavParams, useClass: MockNavParams}
      ],

      imports: [
        IonicModule.forRoot(MyApp)
      ]

    }).compileComponents();

  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingRoomPage);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    de = null;
    el = null;
  });

  it('Should have one room if is received by navparams', () => {
    comp.room = {
      id: "001",
      decks: "Mike",
      isLocked: true,
      name: "test room",
      password: "sucks",
      users:[{username: "scott", id:"2232"}],
      size: 3
    };

    expect(comp.room.id).toBe("001");
  });

  it('Waiting Room Page is created', () => {
    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();

  });
});
