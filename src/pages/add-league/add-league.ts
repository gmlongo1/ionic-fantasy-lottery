import { EditTeamsPage } from './../edit-teams/edit-teams';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service/auth-service';

import firebase from 'firebase';

/**
 * Generated class for the AddLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-league',
  templateUrl: 'add-league.html',
})
export class AddLeaguePage {

  addLeagueForm: FormGroup;

  weightOptions: any[] = [
    { text: 'Straight', value: 'S' }, 
    { text: 'Weighted', value: 'W' },
    { text: 'Heavily Weighted', value: 'H' }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public authService: AuthService) {
    this.addLeagueForm = formBuilder.group({
      season: ['', Validators.compose([Validators.required, Validators.maxLength(4)])],
      leagueName: ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
      owner: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      email: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      weight: [this.weightOptions[0], Validators.compose([Validators.required])]
    });
  }

  onSubmit(value: any): void { 
    if (this.addLeagueForm.valid) {
        let data = {
          season: value.season,
          name: value.leagueName,
          owner: value.owner,
          email: value.email,
          weight: value.weight.value
        };
        
        // add league
        let user = this.authService.getUser();
        let leagueKey = firebase.database().ref('/users/' + user.uid + '/leagues').push(data).key;

        this.navCtrl.push(EditTeamsPage, { leagueId: leagueKey })
          .then(() => {
            const index = this.navCtrl.getActive().index;
            this.navCtrl.remove(index-1);
          });
    }
  }
}
