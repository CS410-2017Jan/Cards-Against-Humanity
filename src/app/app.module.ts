import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
//import { FormsModule }   from '@angular/forms';
//import { FormBuilder }   from '@angular/forms';
//import { FormGroup }   from '@angular/forms';

import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { RoomSetupPage } from '../pages/room-setup/room-setup';
import { GamePage } from '../pages/game/game';
import { WaitingRoomPage } from '../pages/waiting-room/waiting-room';
import { RoomListPage } from '../pages/room-list/room-list';


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
    GamePage
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
    GamePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
