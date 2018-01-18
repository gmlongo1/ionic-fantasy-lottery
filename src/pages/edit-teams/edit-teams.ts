import { AddTeamPage } from './../add-team/add-team';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service/auth-service';

import firebase from 'firebase';
import { EditTeamPage } from '../edit-team/edit-team';

/**
 * Generated class for the EditTeamsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-teams',
  templateUrl: 'edit-teams.html',
})
export class EditTeamsPage {

  leagueId: string;
  teams:any = [];
  reordered:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, public alertCtrl: AlertController, public authService: AuthService) {
  }

  ionViewWillEnter() {
    this.leagueId = this.navParams.get('leagueId');
    let user = this.authService.getUser();
    
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
            leagueId: val.leagueId,
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

    teamsRef.on('child_removed',
        data => {
          this.teams = this.teams.filter(e => e.key !== data.key);
        }
      )
  }

  reorderItems(event: any) {
    let element = this.teams[event.from];
    this.teams.splice(event.from, 1);
    this.teams.splice(event.to, 0, element);

    this.teams.forEach((item, index) => {
      item.previousFinish = (index + 1);
    })

    this.reordered = true;

    this.onUpdateTeams();
  }

  onUpdateTeams() {
    let user = this.authService.getUser();
    for (var i = 0; i < this.teams.length; i++) {
      let t = this.teams[i];
      firebase.database().ref('/users/' + user.uid + '/teams/' + t.key)
        .set({
          email: t.email,
          name: t.name,
          owner: t.owner,
          leagueId: t.leagueId,
          previousFinish: t.previousFinish
        })
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

  onTeamDelete(team: any) {
    let confirm = this.alertCtrl.create({
      title: 'Delete this team?',
      message: 'Are you sure you wish to delete this team?',
      buttons: [
        {
          text: 'No',
          handler: () => { }
        },
        {
          text: 'Yes',
          handler: () => {
            let user = this.authService.getUser();
            firebase.database().ref(`/users/${user.uid}/teams`).child(team.key).remove();
          }
        }
      ]
    });
    confirm.present();
  }

  onTeamAdd() {
    this.navCtrl.push(AddTeamPage,  { leagueId: this.leagueId });
  }

  onTeamClicked(team) {
    this.navCtrl.push(EditTeamPage, { teamId: team.key });
  }
}
