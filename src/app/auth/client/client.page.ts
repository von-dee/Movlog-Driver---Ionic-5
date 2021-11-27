import { Component, OnInit, ViewChild } from '@angular/core';

import { IonSlides} from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController } from '@ionic/angular';
import { CountrymodalPage } from '../../public/countrymodal/countrymodal.page';

import { TrucksmodalPage } from '../../public/trucksmodal/trucksmodal.page';

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
})

export class ClientPage implements OnInit {

  disablePrevBtn = true;
  disableNextBtn = false;
  disableBackBtn = false;
  disableSubmitBtn = true;
  @ViewChild('mySlider', {static: true})  slides: IonSlides;
  @ViewChild('form', {static: true}) testFormElement; phonenumber: any;
  countries: any;
  dataReturned: any;
  country: any;
  countrycode: any;
  truckslist: any;
  dataTrucksReturned: any;
  added_truck_code: any;
  added_truck_name: any;
  added_truck_url: any;
  finalparams: any;
  photoCarUrl: any;

  constructor(private api: ApiService, private authService: AuthService, public modalController: ModalController) {
    this.phonenumber = "+233";
    this.country = "Ghana";
    this.countrycode = "+233";
    
    this.added_truck_code= "";
    this.added_truck_name= "";
    this.added_truck_url= "";

    this.photoCarUrl = localStorage.getItem('IMAGEURL') + 'car_icons/';
   }

  
  async openModal() {
    const modal = await this.modalController.create({
      component: CountrymodalPage,
      componentProps: {
        "paramID": 123,
        "paramTitle": "Test Title",
        "countries": this.countries
      }
    });
 
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        this.phonenumber = "+" + this.dataReturned.COUN_EXTENSION;
        this.country = this.dataReturned.COUN_NAME;
        this.countrycode = "+" + this.dataReturned.COUN_EXTENSION;
      
        console.log(this.dataReturned.COUN_EXTENSION);
      }
    });
 
    return await modal.present();
  }

  fetchcountries(){
    const action = '&actions=fetchcountry';
    const data = '';
    this.api.postData(action, data).then((res: any) => {
      const repo_countries = res.data;
      this.countries = res.data;
      console.log(this.countries);
    });
  }


  ngOnInit() {
    this.fetchcountries();  
    this.get_trucks();
  }

  get_trucks(){
    const action = '&actions=fetchtrucks';
    const data = '';
    this.api.postData(action, data).then((res: any) => {
      const repo = res.data;
      for (const key in repo) {
        if (key) {
          this.finalparams = Object.assign(repo[key], {isChecked: false});
        }
      }
      this.truckslist = repo;
      console.log(this.truckslist);
    });
  }

  swipePrev() {
    this.slides.slidePrev();
  }

  swipeNext() {
    this.slides.getActiveIndex().then((active: number) => {
      console.log(active);
      if (active === 0) {
        this.authService.checkNumber(this.phonenumber, '2').then((check: any) => {
          check ? console.log('logged-in') :  this.slides.slideNext();
        });
      } else {
        this.slides.slideNext();
      }
    });
  }

  doCheck() {
    const prom1 = this.slides.isBeginning();
    const prom2 = this.slides.isEnd();

    Promise.all([prom1, prom2]).then((data) => {
      if (data[0]) {
        this.disablePrevBtn = true;
        this.disableNextBtn = false;
        this.disableBackBtn = false;
        this.disableSubmitBtn = true;
      } else if (data[1]) {
        this.disablePrevBtn = false;
        this.disableNextBtn = true;
        this.disableBackBtn = true;
        this.disableSubmitBtn = false;
      } else {
        this.disablePrevBtn = false;
        this.disableNextBtn = false;
        this.disableBackBtn = true;
        this.disableSubmitBtn = true;
      }
    });
  }

  userSignup(params: any, type= 2) {
    this.authService.appRegister(params, type);
  }

  subform() {
    this.testFormElement.ngSubmit.emit();
  }


  async openTrucksModal() {
    const modal = await this.modalController.create({
      component: TrucksmodalPage,
      componentProps: {
        "paramID": 123,
        "paramTitle": "Test Title",
        "truckslist": this.truckslist
      }
    });
 
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataTrucksReturned = dataReturned.data;
      
        console.log("dataReturned");
        console.log(this.dataTrucksReturned);
        this.add_truck(this.dataTrucksReturned);
      }
    });
 
    return await modal.present();
  }

  add_truck(item){

    this.added_truck_code = item.TRUCK_CODE;
    this.added_truck_name = item.TRUCK_NAME;
    this.added_truck_url = item.TRUCK_URL;

  }

  add_truck_item(code, name, url){
    this.added_truck_code = code;
    this.added_truck_name = name;
    this.added_truck_url = url;

  }

}

