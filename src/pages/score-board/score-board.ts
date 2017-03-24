import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, List } from 'ionic-angular';
import {LeaderboardFacade} from "../../providers/facades/leaderboard-facade";

@Component({
  selector: 'page-score-board',
  templateUrl: 'score-board.html'
})
export class ScoreBoardPage {

listOfUsers;

  @ViewChild('listofUsers', {read: List}) roomList: List;

  constructor(public navCtrl: NavController, public navParams: NavParams, public lbCtrl: LeaderboardFacade) {}

  ionViewDidEnter() {
    console.log('ionViewDidLoad ScoreBoardPage');
    this.updateListOfUsers();
  }

  updateListOfUsers(){
    var that = this;
    this.lbCtrl.getScores(function(users){
      console.log('updateListOfUsers: ', users);
      that.listOfUsers = users;
      console.log('listOfUsers: ', that.listOfUsers);
    })
  }

}
