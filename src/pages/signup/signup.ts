import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';

import { PasswordValidation } from './password-validation';
import { AuthService } from '../../providers/auth-service/auth-service';

import { HomePage } from '../../pages/home/home';

import firebase from 'firebase';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signupForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private toastCtrl: ToastController, public authService: AuthService) {
    this.signupForm = formBuilder.group(
      {
        email: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
        password: ['', Validators.compose([Validators.required])],
        confirmPassword: ['', Validators.compose([Validators.required, Validators.maxLength(40)])]
      },
      {
        validator: PasswordValidation.MatchPassword
      });
  }

  onSubmit(value: any): void { 
    if (this.signupForm.valid) {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(
        user => {
          this.authService.login(user)
          this.navCtrl.push(HomePage);
        }
      )
      .catch(
        err => {
          console.log(err)
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
}
