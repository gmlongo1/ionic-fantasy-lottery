import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service/auth-service';

import { HomePage } from '../../pages/home/home';
import { SignupPage } from '../../pages/signup/signup';

import firebase from 'firebase'

/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
  
  signinForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private toastCtrl: ToastController, public authService: AuthService) {
    this.signinForm = formBuilder.group(
      {
        email: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
        password: ['', Validators.compose([Validators.required])]
      });
  }
  
  onSubmit(value: any) {
    firebase.auth().signInWithEmailAndPassword(value.email, value.password).then( user => {
      this.authService.login(user);
      this.navCtrl.push(HomePage);
    }).catch( err => {
      let toast = this.toastCtrl.create({
        message: err.message,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    })
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }

  onGoogleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then( () => {
      firebase.auth().getRedirectResult().then( result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        //var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        this.authService.login(user);
      }).catch(err => {
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      })
    })
  }

  onFacebookSignin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithRedirect(provider).then( () => {
      firebase.auth().getRedirectResult().then( result => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        //var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        this.authService.login(user);
      }).catch(err => {
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      })
    })
  }

  onTwitterSignin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithRedirect(provider).then( () => {
      firebase.auth().getRedirectResult().then( result => {
        // This gives you a Twitter Access Token. You can use it to access the Twitter API.
        //var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        this.authService.login(user);
      }).catch( err => {
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      })
    })
  }

}
