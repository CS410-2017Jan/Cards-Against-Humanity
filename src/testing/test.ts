/**
 * Created by ScottHenry on 2017-03-22.
 */

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { App, Config, Form, IonicModule, Keyboard, DomController, MenuController, NavController, ModalController, NavParams, Platform } from 'ionic-angular';
import { ConfigMock } from '../mocks';
import {PlatformMock} from "../mocks";
import {NavMock} from "../mocks";
import {RoomFacade} from "../providers/facades/room-facade";
import {UserFacade} from "../providers/facades/user-facade";

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function (): void {
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Then we find all the tests.
let context: any = require.context('../', true, /\.spec\.ts/);

// And load the modules.
context.keys().map(context);

// Finally, start Karma to run the tests.
__karma__.start();


//https://github.com/lathonez/clicker/blob/master/src/test.ts
//simple utility class
export class TestUtils {

  //called before each compile
  public static beforeEachCompiler(components: Array<any>): Promise<{fixture: any, instance: any}> {
    return TestUtils.configureIonicTestingModule(components)
      .compileComponents().then(() => {
        let fixture: any = TestBed.createComponent(components[0]);
        return {
          fixture: fixture,
          instance: fixture.debugElement.componentInstance,
        };
      });
  }

  //Used to set up testbed for each module
  public static configureIonicTestingModule(components: Array<any>): typeof TestBed {
    return TestBed.configureTestingModule({
      declarations: [
        ...components,
      ],
      providers: [
        {provide: App, useClass: App},
        {provide: Form, useClass: Form},
        {provide: Keyboard, useClass: Keyboard},
        {provide: MenuController, useClass: MenuController},
        {provide: NavController, useClass: NavController},
        {provide: RoomFacade, useClass: RoomFacade},
        {provide: ModalController, useClass: ModalController},
        {provide: UserFacade, useClass: UserFacade},
        {provide: Platform, useClass: PlatformMock},
        {provide: Config, useClass: ConfigMock},
        {provide: NavController, useClass: NavMock}
      ],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
      ],
    });
  }

  // http://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript
  public static eventFire(el: any, etype: string): void {
    if (el.fireEvent) {
      el.fireEvent('on' + etype);
    } else {
      let evObj: any = document.createEvent('Events');
      evObj.initEvent(etype, true, false);
      el.dispatchEvent(evObj);
    }
  }
}
