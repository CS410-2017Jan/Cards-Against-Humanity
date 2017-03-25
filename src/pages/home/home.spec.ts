import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component, Input } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import {UserFacade} from "../../providers/facades/user-facade";
import {ModalController} from "ionic-angular/index";
import {HomePage} from "./home";
import {ProgressBarComponent} from "../../components/progress-bar/progress-bar";
import {ToastController} from "ionic-angular/index";

let comp: HomePage;
let fixture: ComponentFixture<HomePage>;
let de: DebugElement;
let el: HTMLElement;

describe('Page: Home Page', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({

      declarations: [MyApp, HomePage, ProgressBarComponent],

      providers: [
        {provide: ToastController, useClass: ToastController},
        {provide: UserFacade, useClass: UserFacade}],

      imports: [
        Component,
        Input
      ],

    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    comp    = fixture.componentInstance;

  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
    de = null;
    el = null;
  });

  it('Home Page is created', () => {
    expect(fixture).toBeTruthy();
    expect(comp).toBeTruthy();

  });

});
