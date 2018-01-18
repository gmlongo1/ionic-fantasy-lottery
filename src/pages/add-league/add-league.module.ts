import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddLeaguePage } from './add-league';

@NgModule({
  declarations: [
    AddLeaguePage,
  ],
  imports: [
    IonicPageModule.forChild(AddLeaguePage),
  ],
})
export class AddLeaguePageModule {}
