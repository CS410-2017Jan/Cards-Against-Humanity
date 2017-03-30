/*
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, ViewController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import {NavMock} from "../../mocks";
import {NavController} from "ionic-angular/index";
import {RoomFacade} from "../../providers/facades/room-facade";
import {UserFacade} from "../../providers/facades/user-facade";
import {ModalController} from "ionic-angular/index";
import {LoginPage} from "./login";
import {SignUpModalPage} from "./login";
import {UserFacadeMock} from "../../mocks";
import {ViewMock} from "../../mocks";

let comp: SignUpModalPage;
let fixture: ComponentFixture<SignUpModalPage>;
let de: DebugElement;
let el: HTMLElement;

describe('Page: Login Page', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({

      declarations: [MyApp, SignUpModalPage],

      providers: [
        {provide: ViewController, useClass: ViewMock},
        {provide: UserFacade, useClass: UserFacadeMock}
      ],

      imports: [
        IonicModule.forRoot(MyApp)
      ]

    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpModalPage);
    comp = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    de = null;
    el = null;
  });

  it('Sign Up Modal is created', () => {

    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();

  });
});
*/
