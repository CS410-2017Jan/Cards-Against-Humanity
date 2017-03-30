/**
 * Created by ScottHenry on 2017-03-24.
 */

import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import {RoomSetupPage} from "./room-setup";
import {NavMock} from "../../mocks";
import {NavController} from "ionic-angular/index";
import {RoomFacade} from "../../providers/facades/room-facade";
import {UserFacade} from "../../providers/facades/user-facade";
import {WaitingRoomPage} from "../waiting-room/waiting-room";

let comp: RoomSetupPage;
let fixture: ComponentFixture<RoomSetupPage>;
let de: DebugElement;
let el: HTMLElement;

describe('Page: Room Setup Page', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({

      declarations: [MyApp, RoomSetupPage],

      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: RoomFacade, useClass: RoomFacade},
        {provide: UserFacade, useClass: UserFacade}
      ],

      imports: [
        IonicModule.forRoot(MyApp)
      ]

    }).compileComponents();

  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(RoomSetupPage);
    comp = fixture.componentInstance;

  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    de = null;
    el = null;
  });

  it('Room Setup Page is created', () => {

    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();

  });

/*  it('should be able to launch waiting room page', () => {

    let navCtrl = fixture.debugElement.injector.get(NavController);
    spyOn(navCtrl, 'push');

    de = fixture.debugElement.query(By.css('ion-item button'));
    de.triggerEventHandler('click', null);

    expect(navCtrl.push).toHaveBeenCalledWith(WaitingRoomPage);

  });*/


});
