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
import {RoomListPage} from "./room-list";
import {NavParams} from "ionic-angular/index";
import {AlertController} from "ionic-angular/index";
import {MockNavParams} from "../../mocks";
import {GamePage} from "./game";
import {ModalController} from "ionic-angular/index";
import {ToastController} from "ionic-angular/index";

let comp: GamePage;
let fixture: ComponentFixture<GamePage>;
let de: DebugElement;
let el: HTMLElement;

describe('Page: Game Page', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({

      declarations: [MyApp, GamePage],

      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: UserFacade, useClass: UserFacade},
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
    comp = fixture.componentInstance;

  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    de = null;
    el = null;
  });

  it('Game Page is created', () => {

    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();

  });
});
