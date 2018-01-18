import { AuthService } from './../../providers/auth-service/auth-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import firebase from 'firebase'

/**
 * Generated class for the AddTeamPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-team',
  templateUrl: 'add-team.html',
})
export class AddTeamPage {

  addTeamForm: FormGroup;
  leagueId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public authService: AuthService) {
    this.leagueId = this.navParams.get('leagueId');

    this.addTeamForm = formBuilder.group({
      teamName: ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
      owner: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      email: ['', Validators.compose([Validators.required, Validators.maxLength(30)])]
    });
  }

  onSubmit(value: any): void { 
    if (this.addTeamForm.valid) {
        let user = this.authService.getUser();

        let teamsRef = firebase.database().ref('/users/' + user.uid + '/teams').orderByChild('leagueId').equalTo(this.leagueId);
        // count number of teams
        let teamCount = 1
        teamsRef.on('child_added',
          data => {
            teamCount++;
          }
        )

        let data = {
          name: value.teamName,
          owner: value.owner,
          email: value.email,
          leagueId: this.leagueId,
          previousFinish: teamCount
        };
        
        // add team
        firebase.database().ref('/users/' + user.uid + '/teams').push(data).key

        this.navCtrl.pop();
    }
  }
}
