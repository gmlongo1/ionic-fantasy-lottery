import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SigninPage } from '../../pages/signin/signin';

import { AuthService } from '../../providers/auth-service/auth-service';

import firebase from 'firebase';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {
    this.user = authService.getUser();
  }

  onSignout() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      this.authService.logout();
      this.navCtrl.setRoot(SigninPage);
    }).catch(error => {
      // An error happened.
      console.log("Sign out error", error)
    });
  }

}
