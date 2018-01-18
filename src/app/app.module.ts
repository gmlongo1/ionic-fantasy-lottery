import { AddLeaguePage } from './../pages/add-league/add-league';
import { ViewResultsPage } from './../pages/view-results/view-results';
import { AddTeamPage } from './../pages/add-team/add-team';
import { EditTeamPage } from './../pages/edit-team/edit-team';
import { CloneLeaguePage } from './../pages/clone-league/clone-league';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonTextAvatar } from 'ionic-text-avatar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { ProfilePage } from '../pages/profile/profile';
import { ViewLeaguePage } from '../pages/view-league/view-league';
import { EditLeaguePage } from '../pages/edit-league/edit-league';
import { EditTeamsPage } from '../pages/edit-teams/edit-teams';

import { AuthService } from '../providers/auth-service/auth-service';

@NgModule({
  declarations: [
    IonTextAvatar,
    MyApp,
    HomePage,
    ProfilePage,
    ViewLeaguePage,
    CloneLeaguePage,
    EditLeaguePage,
    AddLeaguePage,
    AddTeamPage,
    EditTeamPage,
    EditTeamsPage,
    ViewResultsPage,
    SigninPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProfilePage,
    ViewLeaguePage,
    CloneLeaguePage,
    EditLeaguePage,
    AddLeaguePage,
    AddTeamPage,
    EditTeamPage,
    EditTeamsPage,
    ViewResultsPage,
    SigninPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    EmailComposer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService
  ]
})
export class AppModule {}
