import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Config } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { firebaseConfig } from './firebaseConfig';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HttpClient  } from '@angular/common/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Network } from '@ionic-native/network';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { FormPage } from '../pages/form/form';
import { FirebaseListPage } from '../pages/firebase-list/firebase-list';
import { OfflineListPage } from '../pages/offline-list/offline-list';
import { UploadStatusPage } from '../pages/upload-status/upload-status';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FormPage,
    FirebaseListPage,
    OfflineListPage,
    UploadStatusPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig.firebase),
    AngularFireDatabaseModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FormPage,
    FirebaseListPage,
    OfflineListPage,
    UploadStatusPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpClient,
    BackgroundMode,
    Network
  ]
})
export class AppModule {
}
