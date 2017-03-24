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
import {UserFacade} from "../providers/facades/user-facade";
import {ScoreBoardPage} from "../pages/score-board/score-board";
import {LeaderboardFacade} from "../providers/facades/leaderboard-facade";

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
    EndGameModalPage,
    ScoreBoardPage

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
    EndGameModalPage,
    ScoreBoardPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, RoomFacade, UserFacade, LeaderboardFacade]
})
export class AppModule {}
