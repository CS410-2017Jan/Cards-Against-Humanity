import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { RoomSetupPage } from '../pages/room-setup/room-setup';
import { GamePage } from '../pages/game/game';
import { WaitingRoomPage } from '../pages/waiting-room/waiting-room';
import { LoginPage } from '../pages/login/login';
import { SignUpModalPage } from '../pages/login/login';
import { ScoreModalPage } from '../pages/game/game'
import { RoomListPage } from '../pages/room-list/room-list';

import { RoomFacade } from '../providers/facades/room-facade';
import { Player } from "../data-classes/player";
import {EndGameModalPage} from "../pages/game/game";





@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    RoomSetupPage,
    WaitingRoomPage,
    RoomListPage,
    LoginPage,
    GamePage,
    SignUpModalPage,
    ScoreModalPage,
    EndGameModalPage

  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    RoomSetupPage,
    WaitingRoomPage,
    RoomListPage,
    LoginPage,
    GamePage,
    SignUpModalPage,
    ScoreModalPage,
    EndGameModalPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, RoomFacade]
})
export class AppModule {}
