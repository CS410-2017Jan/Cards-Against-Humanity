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
        {provide: UserFacade, useClass: UserFacade},
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

  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    de = null;
    el = null;
  });

  it('Waiting Room Page is created', () => {
    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();

  });
});
