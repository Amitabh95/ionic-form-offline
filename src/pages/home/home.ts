import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormPage } from '../form/form';
// import { Storage } from '@ionic/storage';
import { FirebaseListPage } from '../firebase-list/firebase-list';
import { OfflineListPage } from '../offline-list/offline-list';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // finalDataWithArrayOfObjects: any[] = [];
  // sampleArray: any[] = [];

  constructor(
    // private storage: Storage,
    public navCtrl: NavController) {

  }
  ionViewWillEnter(){
    /*
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
      */
  }

  goToForm(){
    this.navCtrl.push(FormPage);
  }

  goToFirebaseList(){
    this.navCtrl.push(FirebaseListPage);
  }

  goToOfflineList(){
    this.navCtrl.push(OfflineListPage);
  }

}
