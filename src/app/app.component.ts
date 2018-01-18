import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthService } from '../providers/auth-service/auth-service';

import { HomePage } from '../pages/home/home';
import { SigninPage } from '../pages/signin/signin';

import firebase from 'firebase'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = null;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, authService: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    firebase.initializeApp({
      apiKey: "AIzaSyA98NHqb101v85tM5elcj375h2gah7ssDE",
      authDomain: "fantasy-lottery.firebaseapp.com",
      databaseURL: "https://fantasy-lottery.firebaseio.com",
      projectId: "fantasy-lottery",
      storageBucket: "fantasy-lottery.appspot.com",
      messagingSenderId: "140254757076"
    })

    if (authService.authenticated()) {
      this.rootPage = HomePage;
    } else {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          authService.login(user);
          this.rootPage = HomePage;
        } else {
          this.rootPage = SigninPage;
        }
      })
    }
  }
}

