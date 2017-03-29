import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { AboutPage } from '../about/about';
import { RoomSetupPage } from '../room-setup/room-setup';
import { RoomListPage } from '../room-list/room-list';
import {ScoreBoardPage} from "../score-board/score-board";

@Component({
  selector: 'tabs',
  templateUrl: './tabs.html'
})
export class TabsPage {
  tab1Root: any = HomePage;
  tab2Root: any = RoomSetupPage;
  tab3Root: any = RoomListPage;
  tab4Root: any = ScoreBoardPage;

  constructor() {}
}
