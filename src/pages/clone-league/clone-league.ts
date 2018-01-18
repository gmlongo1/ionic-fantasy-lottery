import { AuthService } from './../../providers/auth-service/auth-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import firebase from 'firebase';

/**
 * Generated class for the CloneLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-clone-league',
  templateUrl: 'clone-league.html',
})
export class CloneLeaguePage {

  cloneLeagueForm: FormGroup;

  currentLeagueId: string;
  currentName: string;
  currentSeason:string;
  currentOwner: string;
  currentEmail: string;
  currentWeight: string;

  weightOptions: any[] = [
    { text: 'Straight', value: 'S' }, 
    { text: 'Weighted', value: 'W' },
    { text: 'Heavily Weighted', value: 'H' }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public authService: AuthService) {
    let user = this.authService.getUser();
    this.currentLeagueId = this.navParams.get('leagueId');

    let leagueRef = firebase.database().ref('/users/' + user.uid + '/leagues/' + this.currentLeagueId)
    leagueRef.on('value', 
      data => {
        this.currentSeason = data.val().season,
        this.currentName = data.val().name,
        this.currentOwner = data.val().owner,
        this.currentEmail = data.val().email,
        this.currentWeight = data.val().weight
      }
    )

    let selectedWeight = {};

    this.weightOptions.forEach((item) => {
      if (item.value == this.currentWeight) {
        selectedWeight = item;
      }
    });
    
    const cloneLeagueName = this.currentName + " Clone";
    this.cloneLeagueForm = formBuilder.group({
      season: [this.currentSeason, Validators.compose([Validators.required, Validators.maxLength(4)])],
      leagueName: [cloneLeagueName, Validators.compose([Validators.required, Validators.maxLength(40)])],
      owner: [this.currentOwner, Validators.compose([Validators.required, Validators.maxLength(50)])],
      email: [this.currentEmail, Validators.compose([Validators.required, Validators.maxLength(30)])],
      weight: [selectedWeight, Validators.compose([Validators.required])]
    });
  }

  onSubmit(value: any) {
    let data = {
      season: value.season,
      name: value.leagueName,
      owner: value.owner,
      email: value.email,
      weight: value.weight.value
    };
    
    let user = this.authService.getUser();
    let leagueKey = firebase.database().ref('/users/' + user.uid + '/leagues').push(data).key;

    // clone teams
    let currentTeams: any = [];
    let currentTeamsRef = firebase.database().ref('/users/' + user.uid + '/teams').orderByChild('leagueId').equalTo(this.currentLeagueId);

    currentTeamsRef.once('value',
      snapshot => {
        snapshot.forEach((childSnapshot) => {
          var childKey = childSnapshot.key;
          var val = childSnapshot.val();
          currentTeams.push({
            key: childKey,
            name: val.name,
            email: val.email,
            owner: val.owner,
            leagueId: val.leagueId,
            previousFinish: val.previousFinish
          });

          return false;
        });

        currentTeams.forEach((item) => {
          const teamData = {
            name: item.name,
            email: item.email,
            owner: item.owner,
            leagueId: leagueKey,
            previousFinish: item.previousFinish
          }
          
          firebase.database().ref('/users/' + user.uid + '/teams').push(teamData).key;
        })

        this.navCtrl.pop();
      }
    );
  }
}
