import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the OfflineListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offline-list',
  templateUrl: 'offline-list.html',
})
export class OfflineListPage {
  finalDataWithArrayOfObjects: any[] = [];
  sampleArray: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  ionViewDidLoad() {
    this.storage.get('OfflineData').then((val) => {
      let temp = JSON.parse(val);
      if(val !== null){
        this.finalDataWithArrayOfObjects=[];
        temp.forEach((element) => {
          this.finalDataWithArrayOfObjects.push(JSON.stringify(element));
        });
        console.log('After pushing',this.finalDataWithArrayOfObjects);
        this.finalDataWithArrayOfObjects.forEach(element => {
          this.sampleArray.push(JSON.parse(element));
          console.log(typeof(JSON.parse(element)),this.sampleArray);
        });
      }
      });
    }

}
