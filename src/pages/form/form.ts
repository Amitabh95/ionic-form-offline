import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage, Platform } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Network } from '@ionic-native/network';
import { BackgroundMode } from '@ionic-native/background-mode';
//import 'rxjs/add/operator/debounceTime';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { Observable } from 'rxjs';
import { HomePage } from '../home/home';

/**
 * Generated class for the FormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-form',
  templateUrl: 'form.html',
})
export class FormPage {

  directory: Observable<any[]>;
  searchControl: FormControl;
  public validationForm: FormGroup;

  eventFromAgeDob:boolean = false;
  Countrylist;
  flag = true;
  countryName;
  filteredList;
  countryCode;
  searchTerm: string = '';
  items;
  search: boolean = false;
  searching: boolean = false;

  passwordType: string = 'password';
  showHidePasswordIcon: string = 'Show Password';
  selectedDate: string;
  currentAge;
  passwordValue;
  repeatPasswordState: boolean = false;
  error='';
  confirmPasswordValue='';
  errorArray: any[] = [];
  ageValueFromField;
  dobValue;
  currentTime: string;
  submitDisabled: boolean = false;

  finalData: any;
  finalDataWithArrayOfObjects:any[] = [];
  finalDataWaitingToBeUploaded:any[] = [];
  tempArrayForUpload: any[] = [];

  public currentNetworkStatus: String;
  
  constructor(
    private backgroundMode: BackgroundMode,
    private network: Network,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    private storage: Storage,
    private http: HttpClient,
    private platform: Platform,
    private firebaseDB: AngularFireDatabase
  ) {
    this.searchControl = new FormControl();
    this.validationForm = this.formBuilder.group({
      firstName: new FormControl ('', [Validators.required]),
      lastName: new FormControl (''),
      age: new FormControl ('',Validators.pattern('^[1-9][0-9]?$')), //'^([1-9]?[0-9]?[0-9]|1[01][0-9]|12[0])$'
      dob: new FormControl (''),
      email: new FormControl ('',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
      password: new FormControl ('',[Validators.required,Validators.maxLength(16),Validators.minLength(8)]),
      repeatPassword: new FormControl ('',[Validators.required]),
      countryCode: new FormControl ('',[Validators.required]),
      phoneNo: new FormControl ('',[Validators.required]),
      registeringFor: new FormControl ('',[Validators.required]),
      symptoms: new FormControl ('',[Validators.required])
    });
  }

  ionViewWillEnter() {
   this.checkNetworkStatusOnLoading();
   this.continuouslyCheckNetworkStatus();
  }

  ionViewDidLoad() {
    this.extractCountryList();
    }



    /*
              *******************************************
              Function for check status of network Starts
              *******************************************
    */

  checkNetworkStatusOnLoading() {
   // this.platform.ready().then(() => {      //Platform ready
    // if(this.network.type === 'null'){       //Remove before build(enable if you want to test on browser)
      
          if (this.network.type.toLowerCase() === 'none'){
              this.currentNetworkStatus = "Offline";
          } else {
              this.currentNetworkStatus = "Online";
          }
  //   } //Remove before build [Enable if you want to test on browser]
  //  });                                            //Platform ready

        }

  continuouslyCheckNetworkStatus(){
      this.network.onDisconnect().subscribe(() => {
          this.currentNetworkStatus = "Offline";
         // this.showAlert('Hey There I\'m inside On-Disconnect -->'+this.currentNetworkStatus);
      });

      this.network.onConnect().subscribe(() => {
          this.currentNetworkStatus = "Online";
         // this.showAlert('Hey There I\'m inside On-Connect -->'+this.currentNetworkStatus);
      });
      //this.showAlert('Infunction'+this.currentNetworkStatus);
  }

    /*
              *****************************************
              Function for check status of network Ends
              *****************************************
    */
  


    /*        *********************************************************************************
              Extract Country List From JSON File and save the observable to CountryList Starts
              *********************************************************************************
    */

  extractCountryList(){
    this.getCountryListFromJSONfile()
    .subscribe (
      (res) => {
        this.Countrylist = res;
        console.log(res);
      },
      err => console.log('Country Exractor Error:',err)
    );
  }



  getCountryListFromJSONfile() {
    return this.http.get<any>('../assets/data.json');
  }

    /*        ******************************************
              Extract Country List From JSON File Starts
              ******************************************
    */
  
    /*        *************************************
              For Capturing Form Data Inputs Starts
              *************************************
    */

    password(event){
      this.passwordValue = event._value;
    }

    ageValue(event){
      this.ageValueFromField = event._value;
    }


    confirmPassword(event){
      this.confirmPasswordValue = event._value;
      if(this.passwordValue === this.confirmPasswordValue){
        this.error = 'Password Matched';
      } else if (this.passwordValue !== this.confirmPasswordValue){
        this.error = 'Password Not Matched';
      }
    }

    togglePasswordType(){
      let type = this.passwordType;
      if(type === 'text'){
          this.passwordType = 'password';
          this.showHidePasswordIcon = 'Show Passwod';
      } else if(type === 'password'){
            this.passwordType = 'text';
            this.showHidePasswordIcon = 'Hide Password';
      }
    }

    maxDate(): string{
      return moment().subtract(18, 'year').format('YYYY-MM-DD');
    }

    calculateAge(){
      this.selectedDate = moment().format('DD/MM/YYYY');
    }

    ageDob(event){
      this.eventFromAgeDob = event.checked;
    }

    returnDOB(event){
      this.dobValue = event.day + '/'+ event.month +'/'+ event.year;
      let selectedDateYear = event.year;
      let currentDate = new Date();
      let currentDateYear = currentDate.getFullYear();
      this.currentAge = currentDateYear - selectedDateYear;
    }

    /*        ***********************************
              For Capturing Form Data Inputs Ends
              ***********************************
    */

    /*        ***********************************
                    Alert Functions Begins
              ***********************************
    */


  presentAlert() {
    let alert = this.alertController.create({
      title: 'Success',
      subTitle: 'Your booking has been confirmed!!',
      buttons: ['Okay']
    });
    alert.present();
  }

  showAlert(whatToShow){
    let alert = this.alertController.create({
      title: 'Message',
      subTitle: whatToShow,
      buttons: ['Okay']
    });
    alert.present();
  }

  

    /*        ***********************************
                    Alert Functions Begins
              ***********************************
    */



  submit(){
  //  this.submitDisabled = true;
    this.errorArray = [];
    if(this.validationForm.controls.firstName.invalid){
      this.errorArray.push('Please provide your First Name');
    } 
    
    if(this.eventFromAgeDob === true){
      if(this.ageValueFromField === null || this.ageValueFromField === undefined){
        this.errorArray.push('Please provide your age');
      }
    } 
    
    if (this.eventFromAgeDob === false){
      if(this.dobValue === null || this.dobValue === undefined){
        this.errorArray.push('Please provide your dob');
      }
    } 
    
    if (this.validationForm.controls.email.invalid){
      this.errorArray.push('Please provide your email');
    }
    
    if(this.validationForm.controls.password.invalid){
      this.errorArray.push('Please set your password');
    }
    if(!this.validationForm.controls.repeatPassword.invalid){
        if(this.passwordValue !== this.confirmPasswordValue){
          this.errorArray.push('Password mismatched');
        }
    }
    if(this.validationForm.controls.countryCode.invalid){
      this.errorArray.push('Please select country code');
    }
    if(this.validationForm.controls.phoneNo.invalid){
      this.errorArray.push('Please select phone number');
    }

    if(this.validationForm.controls.registeringFor.invalid){
      this.errorArray.push('Please select for whom you are registering for');

    }

    if(this.validationForm.controls.symptoms.invalid){
      this.errorArray.push('Please select the symptoms.');

    }

    if(this.errorArray.length === 0){
      if(this.eventFromAgeDob === true){
        this.saveDataInArray('age');
      } 
      else{
        this.saveDataInArray('dob');
      }
      this.checkConnectivityAndStoreLocallyOrOnFirebase();
    }
    this.submitDisabled = false;
    //console.log(this.errorArray);
    this.navCtrl.push(HomePage);
  }

  checkConnectivityAndStoreLocallyOrOnFirebase(){
    console.log('Current Status',this.currentNetworkStatus);
    if(this.currentNetworkStatus === 'Online'){
      this.firebaseDB.list('AppointmentData').push({           ///changed
        data: this.finalData
      });
      console.log("Successfully Stored at firebase");
      this.showAlert('Data Successfully Stored on Firebase');

    } else if(this.currentNetworkStatus === 'Offline'){

      this.storage.get('OfflineData').then((val) => {
        let temp = JSON.parse(val);
        console.log('parsed',temp);
        if(!(temp === null || temp === undefined)){
          this.storage.remove('OfflineData');
          this.finalDataWithArrayOfObjects=[];
          temp.forEach((element) => {
            this.finalDataWithArrayOfObjects.push(element);
          });
          
          this.finalDataWithArrayOfObjects.push(this.finalData[0]);
          console.log('After pushing',this.finalDataWithArrayOfObjects);
          this.storage.set('OfflineData',JSON.stringify(this.finalDataWithArrayOfObjects));
        }
        else {
          this.storage.set('OfflineData',JSON.stringify(this.finalData));
        }
        });
        this.showAlert('Data Stored Offline, It will be push on firebase when connected to internet.');
        this.enableBackgroundCheckNetworkAndUpload();
    }
  }
  enableBackgroundCheckNetworkAndUpload(){
  //  let firebaseReff = this.firebaseDB;
    this.backgroundMode.enable();               // Enable background Mode
   // this.backgroundMode.moveToBackground();     // Moving the app to background
  // if(this.backgroundMode.isEnabled() === true){               // Checking if background mode is enabled or not

    this.backgroundMode.on("activate").subscribe(()=>{ // backgroundMode.on
      if(this.currentNetworkStatus === 'Online'){

        this.storage.get('OfflineData').then((val) => {
          let temp = JSON.parse(val);
          if(!(temp === null || temp === undefined)){
            this.storage.remove('OfflineData');
            this.finalDataWaitingToBeUploaded=[];
            temp.forEach((element) => {
              this.finalDataWaitingToBeUploaded.push(element);
            });
            
            this.finalDataWaitingToBeUploaded.push(this.finalData[0]);
            
            this.finalDataWaitingToBeUploaded.forEach(element => {
              let count=0;
              this.firebaseDB.list('AppointmentData').push({
                data: element
              });
              count = count + 1;
              this.storage.set('FromForm', count);
            });
            /*  
              // ******

            let arrayReff = this.finalDataWaitingToBeUploaded.length;
            for(let i = arrayReff; i> 0; i=i-1){
              this.firebaseDB.list('AppointmentData').push({
                data: arrayReff[i]
              });
              for( let j = (arrayReff-1); j > 0; j=j-1){
                  this.tempArrayForUpload = [];
                  this.tempArrayForUpload.push(arrayReff[j]);
              }
              this.finalDataWaitingToBeUploaded = [];
              this.tempArrayForUpload.forEach((element) => {
                this.finalDataWaitingToBeUploaded.push(element);
              })
            }
            */
          }
          });
          
      }

    });
    //this.backgroundMode.disable();
    //   } 
    //    else {
    //     this.backgroundMode.enable();
    // }
    
  }


  saveDataInArray(ageOrDob){
    this.currentTime =moment().format('DD/MM/YYYY, h:mm:ss a');
    if(ageOrDob === 'age'){
      this.finalData = [
        {
            currentTime: this.currentTime,
            firstName: this.validationForm.controls.firstName.value,
            lastName: this.validationForm.controls.lastName.value,
            isDOB: false,
            dob: null,
            isAge: true,
            age: this.validationForm.controls.age.value,
            email: this.validationForm.controls.email.value,
            password: this.validationForm.controls.password.value,
            countryCode: this.validationForm.controls.countryCode.value,
            phoneNo: this.validationForm.controls.phoneNo.value,
            registeringFor: this.validationForm.controls.registeringFor.value,
            symptoms: this.validationForm.controls.symptoms.value,
      }
    ];
    } else if(ageOrDob === 'dob'){
      this.finalData = [
        {
          currentTime: this.currentTime,
          firstName: this.validationForm.controls.firstName.value,
          lastName: this.validationForm.controls.lastName.value,
          isDOB: true,
          dob: this.validationForm.controls.dob.value,
          isAge: false,
          age: null,
          email: this.validationForm.controls.email.value,
          password: this.validationForm.controls.password.value,
          countryCode: this.validationForm.controls.countryCode.value,
          phoneNo: this.validationForm.controls.phoneNo.value,
          registeringFor: this.validationForm.controls.registeringFor.value,
          symptoms: this.validationForm.controls.symptoms.value,
      }
    ];
    }
    console.log(this.finalData);
/*
    if(this.previousStatus === 'Offline'){
      this.firebaseDB.list('directory').push({
        name: this.f.name.value,
        phoneNumber: this.f.number.value
      });
    }
*/

     ////======== this.presentAlert();
      //this.navCtrl.pop();
  }





/*
  showCountry() {
    this.countryName = this.validationForm.controls.countryname.value;
    if (this.countryName.trim() === '') {
    this.flag = true;
    } else {
      this.flag = false;
      this.filteredList = this.Countrylist
      .filter(country => country.name.includes(this.countryName) || country.callingCodes.includes(this.countryName));
    }
  }

  getCountry(html: string) {
    this.countryCode = html.split(' ')[5];
    this.flag = true;
  }
  */


  // symptoms(event){
  //   console.log(event);
  // }
  // registeringFor(event){e
  //   console.log(event);
  // }



/* -----For Country Search-----
  onSearchInput(){
    this.search = true;
    this.searching = true;
    this.setFilteredItems();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
            this.searching = false;
            this.setFilteredItems();
    });
}


setFilteredItems() {
    this.items = this.filterItems(this.searchTerm);
}

filterItems(searchTerm){
  let temp =this.Countrylist;
 
  return temp.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
  });    

}

*/

ngOnDestroy(){
  this.backgroundMode.disable();
}
}
