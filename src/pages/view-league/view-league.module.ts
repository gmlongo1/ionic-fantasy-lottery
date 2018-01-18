import { NgModule } from '@angular/core';
import { AppModule } from '../../app/app.module';
import { IonicPageModule } from 'ionic-angular';
import { ViewLeaguePage } from './view-league';

@NgModule({
  declarations: [
    ViewLeaguePage
  ],
  imports: [
    AppModule,
    IonicPageModule.forChild(ViewLeaguePage),
  ],
})
export class ViewLeaguePageModule {}
