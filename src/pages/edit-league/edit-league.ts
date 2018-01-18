import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service/auth-service';

import firebase from 'firebase';

/**
 * Generated class for the EditLeaguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-league',
  templateUrl: 'edit-league.html',
})
export class EditLeaguePage {

  editLeagueForm: FormGroup;

  leagueId: string;
  season: string;
  name: string;
  owner: string;
  email: string;
  weight: string;

  weightOptions: any[] = [
    { text: 'Straight', value: 'S' }, 
    { text: 'Weighted', value: 'W' },
    { text: 'Heavily Weighted', value: 'H' }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private toastCtrl: ToastController, public authService: AuthService) {
    let user = this.authService.getUser();
    this.leagueId = this.navParams.get('leagueId');

    let leagueRef = firebase.database().ref('/users/' + user.uid + '/leagues/' + this.leagueId)
    leagueRef.on('value', 
      data => {
        this.season = data.val().season,
        this.name = data.val().name,
        this.owner = data.val().owner,
        this.email = data.val().email,
        this.weight = data.val().weight
      }
    )
    
    let selectedWeight = {};

    this.weightOptions.forEach((item) => {
      if (item.value == this.weight) {
        selectedWeight = item;
      }
    });

    this.editLeagueForm = formBuilder.group({
      season: [this.season, Validators.compose([Validators.required, Validators.maxLength(4)])],
      leagueName: [this.name, Validators.compose([Validators.required, Validators.maxLength(40)])],
      owner: [this.owner, Validators.compose([Validators.required, Validators.maxLength(50)])],
      email: [this.email, Validators.compose([Validators.required, Validators.maxLength(30)])],
      weight: [selectedWeight, Validators.compose([Validators.required])]
    });
  }

  onSubmit(value: any) {
    console.log(value);
    let data = {
      season: value.season,
      name: value.leagueName,
      owner: value.owner,
      email: value.email,
      weight: value.weight.value
    };
    
    // update league data
    let user = this.authService.getUser();
    firebase.database().ref('/users/' + user.uid + '/leagues/' + this.leagueId)
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
