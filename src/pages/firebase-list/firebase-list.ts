import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

/**
 * Generated class for the FirebaseListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-firebase-list',
  templateUrl: 'firebase-list.html',
})
export class FirebaseListPage {
  directoryList: any[]=[];
  numberList: AngularFireList<any>;
  reff: any;
  sampleArray: any[]=[];

  constructor(private firebase: AngularFireDatabase,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidEnter() {
    const x = this.getData();
    x.snapshotChanges().subscribe((entry) => {
      let i=0;
      this.directoryList = [];
      entry.forEach(element => {
        const y = element.payload.toJSON();
        y['$key'] = element.key;
        this.directoryList.push(y);
        i=i+1;
      });

      console.log('Directory List',this.directoryList);  
      this.directoryList.forEach(element => {
        this.sampleArray.push(element.data[0]);
        console.log('Sample Array',this.sampleArray);
      });
  
    });
    
  }

  getData() {
    this.numberList = this.firebase.list('AppointmentData');
      return this.numberList;
    }

}
