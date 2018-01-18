import { AuthService } from './../../providers/auth-service/auth-service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import firebase from 'firebase'

/**
 * Generated class for the EditTeamPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-team',
  templateUrl: 'edit-team.html',
})
export class EditTeamPage {

  editTeamForm: FormGroup;
  teamId: string;

  name: string;
  owner: string;
  email: string;
  leagueId: string;
  previousFinish: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private toastCtrl: ToastController, public authService: AuthService) {
    this.teamId = this.navParams.get('teamId');
    let user = this.authService.getUser();

    let teamRef = firebase.database().ref('/users/' + user.uid + '/teams/' + this.teamId)
    teamRef.once('value', 
      data => {
        this.name = data.val().name,
        this.owner = data.val().owner,
        this.email = data.val().email,
        this.leagueId = data.val().leagueId,
        this.previousFinish = data.val().previousFinish
      }
    )

    this.editTeamForm = formBuilder.group({
      teamName: [this.name, Validators.compose([Validators.required, Validators.maxLength(40)])],
      owner: [this.owner, Validators.compose([Validators.required, Validators.maxLength(50)])],
      email: [this.email, Validators.compose([Validators.required, Validators.maxLength(30)])]
    });
  }

  onSubmit(value: any) {
    let data = {
      name: value.teamName,
      owner: value.owner,
      email: value.email,
      leagueId: this.leagueId,
      previousFinish: this.previousFinish
    };
    
    // update team data
    let user = this.authService.getUser();
    firebase.database().ref('/users/' + user.uid + '/teams/' + this.teamId)
      .set(data)
      .then(
        data => {
          this.navCtrl.pop();
        }
      )
      .catch(
        err => {
          let toast = this.toastCtrl.create({
            message: err.message,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      )
  }
}
