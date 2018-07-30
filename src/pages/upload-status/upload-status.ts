import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the UploadStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload-status',
  templateUrl: 'upload-status.html',
})
export class UploadStatusPage {
  fromForm;
  fromAppComp;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  ionViewDidEnter() {
    this.storage.get('FromForm').then((val) => {
      if(!(val === null || val === undefined)){
          this.fromForm = val;
      } else {
        this.fromForm = 0;
      }
    });

    this.storage.get('FromAppComp').then((val) => {
      if(!(val === null || val === undefined)){
          this.fromAppComp = val;
      } else {
        this.fromAppComp = 0;
      }
    });
  }

}
