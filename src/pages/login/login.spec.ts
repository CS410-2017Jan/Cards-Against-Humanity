import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import {NavMock} from "../../mocks";
import {NavController} from "ionic-angular/index";
import {RoomFacade} from "../../providers/facades/room-facade";
import {UserFacade} from "../../providers/facades/user-facade";
import {ModalController} from "ionic-angular/index";
import {LoginPage} from "./login";

let comp: LoginPage;
let fixture: ComponentFixture<LoginPage>;
let de: DebugElement;
let el: HTMLElement;

describe('Page: Login Page', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({

      declarations: [MyApp, LoginPage],

      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: ModalController, useClass: ModalController},
        {provide: UserFacade, useClass: UserFacade}
      ],

      imports: [
        IonicModule.forRoot(MyApp)
      ]

    }).compileComponents();

  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(LoginPage);
    comp = fixture.componentInstance;

  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    de = null;
    el = null;
  });

  it('Login Page is created', () => {

    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();

  });


});
