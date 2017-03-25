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

let comp: RoomListPage;
let fixture: ComponentFixture<RoomListPage>;
let de: DebugElement;
let el: HTMLElement;

describe('Page: Room List Page', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({

      declarations: [MyApp, RoomListPage],

      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: RoomFacade, useClass: RoomFacade},
        {provide: UserFacade, useClass: UserFacade},
        {provide: NavParams, useClass: MockNavParams},
        {provide: AlertController, useClass:AlertController}
      ],

      imports: [
        IonicModule.forRoot(MyApp)
      ]

    }).compileComponents();

  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(RoomListPage);
    comp = fixture.componentInstance;

  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    de = null;
    el = null;
  });

  it('Room List Page is created', () => {

    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();

  });
});
