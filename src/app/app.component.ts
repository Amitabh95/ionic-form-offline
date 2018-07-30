import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { BackgroundMode } from '@ionic-native/background-mode';
import { AngularFireDatabase } from 'angularfire2/database';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public currentNetworkStatus: String;
  finalDataWaitingToBeUploaded: any[] = [];
  rootPage:any = HomePage;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    private storage: Storage, 
    private network: Network,
    private backgroundMode: BackgroundMode,
    private firebaseDB: AngularFireDatabase
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  ngOnInit(){
    this.checkNetworkStatusOnLoading();
    this.continuouslyCheckNetworkStatus();
    this.storage.get('OfflineData').then((val) => {
      if(!(val === null || val === undefined)){
          this.enableBackgroundCheckNetworkAndUpload();
      }
    });
  }

  checkNetworkStatusOnLoading() {
    // if(this.network.type === 'null'){                //Remove before build(enable if you want to test on browser)
          if (this.network.type.toLowerCase() === 'none'){
              this.currentNetworkStatus = "Offline";
          } else {
              this.currentNetworkStatus = "Online";
          }
  //   }                                               //Remove before build [Enable if you want to test on browser]
        }

  continuouslyCheckNetworkStatus(){
      this.network.onDisconnect().subscribe(() => {
          this.currentNetworkStatus = "Offline";
      });

      this.network.onConnect().subscribe(() => {
          this.currentNetworkStatus = "Online";
      });
  }

  enableBackgroundCheckNetworkAndUpload(){
      this.backgroundMode.enable();                                  // Enable background Mode
     // this.backgroundMode.moveToBackground();                     // Moving the app to background
   //  if(this.backgroundMode.isEnabled() === true){               // Checking if background mode is enabled or not
  
      this.backgroundMode.on("enable").subscribe(()=>{              // backgroundMode.on
        if(this.currentNetworkStatus === 'Online'){
  
          this.storage.get('OfflineData').then((val) => {
            let temp = JSON.parse(val);
            if(!(temp === null || temp === undefined)){
              this.storage.remove('OfflineData');
              this.finalDataWaitingToBeUploaded=[];
              temp.forEach((element) => {
                this.finalDataWaitingToBeUploaded.push(element);
              });
              
              this.finalDataWaitingToBeUploaded.forEach(element => {
                    let count = 0;//counter
                this.firebaseDB.list('AppointmentData').push({
                  data: element
                });
                count=count+1;
                this.storage.set('FromAppComp', count );
              });
              
            }
            });
          }
        });
        
  
     }
      //this.backgroundMode.disable();
      //   } 
      //    else {
      //     this.backgroundMode.enable();
      // }
      
    

  ngOnDestroy(){
    this.backgroundMode.disable();
  }

}

