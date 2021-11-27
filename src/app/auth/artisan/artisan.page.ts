import { Component, OnInit, ViewChild } from '@angular/core';

import { IonSlides} from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { JsonPipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { CountrymodalPage } from '../../public/countrymodal/countrymodal.page';
 

@Component({
  selector: 'app-artisan',
  templateUrl: './artisan.page.html',
  styleUrls: ['./artisan.page.scss'],
})
export class ArtisanPage implements OnInit {


  // public form: any[] = [
  //   { val: 'Pepperoni', isChecked: true },
  //   { val: 'Sausage', isChecked: false },
  //   { val: 'Mushroom', isChecked: false }
  // ];


  disablePrevBtn = true;
  disableNextBtn = false;
  disableBackBtn = false;
  disableSubmitBtn = true;
  @ViewChild('mySlider', {static: true})  slides: IonSlides;

  @ViewChild('form', {static: true}) testFormElement; phonenumber: any;

  items: any = [];
  selectedWorks: any = [];
  finalparams: any;
  services: any;
  serviceshold: any;
  searchTerm: any;
  dataReturned: any;
  countries: any;
  country: any;
  countrycode: any;

  constructor(public modalController: ModalController, private api: ApiService, private authService: AuthService) {
    this.phonenumber = "+233";
    this.country = "Ghana";
    this.countrycode = "+233";
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


  ngOnInit() {
    this.fetchservices();  
    this.fetchcountries();  
  }

  fetchservices(){
    const action = '&actions=fetchservices';
    const data = '';
    this.api.postData(action, data).then((res: any) => {
      const repo = res.data;
      let worksholder = [];
      for (const key in repo) {
        if (repo) {
          this.finalparams = Object.assign(repo[key], {isChecked: true});
          worksholder.push(this.finalparams);
          this.serviceshold = worksholder;
          this.services = worksholder;
        }
      }

    });
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
    // console.log(params);

    // this.items = this.services;

    // for (const key in this.items) {
    //   this.items[key];

    //   if(this.items[key]['isChecked'] == true ){
    //     var  works_ = Object.assign({},{SERV_CODE: this.items[key]['SERV_CODE']});
    //     works_ = Object.assign(works_,{SERV_NAME: this.items[key]['SERV_NAME']});
    //     this.selectedWorks.push(works_);
    //   }

    // }

    this.finalparams = Object.assign(params, {selectedworks: JSON.stringify(this.items)});
    // console.log(this.finalparams);

  

    this.authService.appRegister(this.finalparams, type);

  }

  subform() {
    this.testFormElement.ngSubmit.emit();
  }


  filterItems(searchTerm) {

    if (searchTerm !== '' && searchTerm != null) {
      return this.services.filter(item => {
        // return item.SERV_NAME.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        return item.SERV_NAME.toLowerCase().includes(searchTerm.toLowerCase());
      });
    } else {
      // this.services = this.serviceshold;
      // this.services = Object.assign(this.serviceshold,this.services);

      for (const key in this.services) {
        if (this.services === this.services[key].SERV_CODE) {
          const indexOfItemInArray = this.serviceshold.findIndex(q => q.SERV_CODE === this.services[key].SERV_CODE);
          console.log(indexOfItemInArray);
          if (indexOfItemInArray > -1) {
            this.serviceshold[indexOfItemInArray] = this.services[key];
          }
        }
      }

      this.services = this.serviceshold;
      console.log(this.services);

      return this.serviceshold;
    }

  }

  setFilteredItems() {
    this.services = this.filterItems(this.searchTerm);
  }

  selectwork(item) {
    const indexOfItemInArray = this.items.findIndex(q => q.SERV_CODE === item.SERV_CODE);

    if (indexOfItemInArray < 0) {
      this.items.push(item);
    }

  }

  removework(item) {

    const indexOfItemInArray = this.items.findIndex(q => q.SERV_CODE === item.SERV_CODE);
    const filteredItems = this.items.slice(0, indexOfItemInArray).concat(this.items.slice(indexOfItemInArray + 1, this.items.length));

    this.items = filteredItems;
    console.log(this.items);

  }

}
