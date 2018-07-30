import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadStatusPage } from './upload-status';

@NgModule({
  declarations: [
    UploadStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(UploadStatusPage),
  ],
})
export class UploadStatusPageModule {}
