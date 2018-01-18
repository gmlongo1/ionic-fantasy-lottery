import { AddLeaguePage } from './../add-league/add-league';
import { CloneLeaguePage } from './../clone-league/clone-league';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import { ViewLeaguePage } from '../view-league/view-league';

import { AuthService } from '../../providers/auth-service/auth-service';

import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user: any = null;
  leagues: any = []

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public authService: AuthService) {
    this.user = authService.getUser();
    
    let leagueRef = firebase.database().ref('/users/' + this.user.uid + '/leagues')

      leagueRef.on('child_added',
        data => {
          let val = data.val()
          this.leagues.push(
            {
              key: data.key,
              name: val.name,
              email: val.email,
              owner: val.owner,
              season: val.season
            }
          )
        }
      )
      leagueRef.on('child_removed',
        data => {
          this.leagues = this.leagues.filter(e => e.key !== data.key);
        }
      )
      leagueRef.on('child_changed',
        data => {
          for (let i = 0; i< this.leagues.length; i++) {
            if (this.leagues[i].key == data.key) {
              let val = data.val()
              let newData = {
                key: data.key,
                name: val.name,
                email: val.email,
                owner: val.owner,
                season: val.season
              }
              this.leagues[i] = newData;
            }
          }
        }
      )
  }

  onLeagueDelete(league: any) {
    let confirm = this.alertCtrl.create({
      title: 'Delete this league?',
      message: 'Are you sure you wish to delete this league?',
      buttons: [
        {
          text: 'No',
          handler: () => { }
        },
        {
          text: 'Yes',
          handler: () => {
            // delete league
            firebase.database().ref('/users/' + this.user.uid + '/leagues').child(league.key).remove();

            // delete all teams referencing the league
            const teamsRef = firebase.database().ref('/users/' + this.user.uid + '/teams').orderByChild('leagueId').equalTo(league.key);
            teamsRef.once('value',
              snapshot => {
                snapshot.forEach((childSnapshot) => {
                  var childKey = childSnapshot.key;
                  //var val = childSnapshot.val();
                  firebase.database().ref('/users/' + this.user.uid + '/teams').child(childKey).remove();
        
                  return false;
                });
            })
          }
        }
      ]
    });
    confirm.present();
  }

  onLeagueClone(league: any, slidingItem: any) {
    this.navCtrl.push(CloneLeaguePage, { leagueId: league.key });
    slidingItem.close();
  }

  onAvatarClicked() {
    this.navCtrl.push(ProfilePage);
  }

  onLeagueClicked(league) {
    this.navCtrl.push(ViewLeaguePage, { leagueId: league.key });
  }

  onLeagueAdd() {
    this.navCtrl.push(AddLeaguePage);
  }

}
