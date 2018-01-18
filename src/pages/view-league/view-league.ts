import { ViewResultsPage } from './../view-results/view-results';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

import { EditLeaguePage } from '../edit-league/edit-league';
import { EditTeamsPage } from '../edit-teams/edit-teams';

import firebase from 'firebase';

/**
 * Generated class for the ViewLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-league',
  templateUrl: 'view-league.html',
})
export class ViewLeaguePage {

  leagueId: string;
  season: string;
  name: string;
  owner: string;
  email: string;
  weight: string;
  weightText: string;
  draftOrderGen: number;

  teams: any[] = [];

  weightOptions: any[] = [
    { text: 'Straight', value: 'S' }, 
    { text: 'Weighted', value: 'W' },
    { text: 'Heavily Weighted', value: 'H' }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {
  }

  onEditLeague() {
    this.navCtrl.push(EditLeaguePage, { leagueId: this.leagueId });
  }

  onEditTeams() {
    this.navCtrl.push(EditTeamsPage, { leagueId: this.leagueId });
  }

  ionViewWillEnter() {
    this.leagueId = this.navParams.get('leagueId');
    let user = this.authService.getUser();
    
    let leagueRef = firebase.database().ref('/users/' + user.uid + '/leagues/' + this.leagueId)
    leagueRef.once('value', 
      data => {
        this.season = data.val().season,
        this.name = data.val().name,
        this.owner = data.val().owner,
        this.email = data.val().email,
        this.weight = data.val().weight,
        this.draftOrderGen = data.val().draftOrderGen
      }
    )

    this.weightOptions.forEach((item) => {
      if (item.value == this.weight) {
        this.weightText = item.text;
      }
    });

    let teamsRef = firebase.database().ref('/users/' + user.uid + '/teams').orderByChild('leagueId').equalTo(this.leagueId);
    this.teams = [];

    teamsRef.once('value',
      snapshot => {
        snapshot.forEach((childSnapshot) => {
          var childKey = childSnapshot.key;
          var val = childSnapshot.val();
          this.teams.push({
            key: childKey,
            name: val.name,
            email: val.email,
            owner: val.owner,
            previousFinish: val.previousFinish
          });

          return false;
        });

        this.teams.sort(
          (a, b) => {
            if (a.previousFinish < b.previousFinish)
              return -1
            if (a.previousFinish > b.previousFinish)
              return 1
            return 0
          }
        )
      }
    )
  }

  onGenerateOrder() {
    let user = this.authService.getUser();
        
    let pool = [];
    for (let i = 0; i < this.teams.length; i++) {
      let team = this.teams[i];

      // should never happen
      if (team.previousFinish == 0 || team.previousFinish == "")
        team.previousFinish = 1;

      // TODO: allow league setting or weight - random, inverse of finish, weighted inverse of finish
      // the number of entries in lottery pool is determined by taking the square of the previous finish
      let num = 1
      if (this.weight == "H") {
        num = team.previousFinish * team.previousFinish;
      } else if (this.weight == "W") {
        num = team.previousFinish;
      }
      for (var j = 0; j < num; j++) {
        pool.push(team);
      }
    }

    let counter = 1;
    while(pool.length > 0) {
      let index = this.getRandomInt(0, pool.length);
      let selectedTeam = pool[index];
      selectedTeam.draftOrder = counter++;
      let data = {
        draftOrder: selectedTeam.draftOrder
      }
      firebase.database().ref('/users/' + user.uid + '/teams/' + selectedTeam.key).update(data);
      
      this.removeAllItemsForTeam(pool, selectedTeam)
    }

    firebase.database().ref('/users/' + user.uid + '/leagues/' + this.leagueId)
      .update({
        draftOrderGen: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        this.navCtrl.push(ViewResultsPage, { leagueId: this.leagueId });
      })
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
  }

  removeAllItemsForTeam(pool, team) {
    for (var k = pool.length - 1; k >= 0; k--) {
        if (pool[k] == team) { 
            pool.splice(k, 1);
        }
    }
  }
}
