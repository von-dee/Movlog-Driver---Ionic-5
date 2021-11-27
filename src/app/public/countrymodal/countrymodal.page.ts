import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-countrymodal',
  templateUrl: './countrymodal.page.html',
  styleUrls: ['./countrymodal.page.scss'],
})
export class CountrymodalPage implements OnInit {

    modalTitle:string;
    modelId:number;
    countries: any;
    countrieshold: any;
    searchTerm: any;
  
    constructor(
      private modalController: ModalController,
      private navParams: NavParams
    ) { }
  
    ngOnInit() {
      console.table(this.navParams);
      this.modelId = this.navParams.data.paramID;
      this.modalTitle = this.navParams.data.paramTitle;
      this.countries = this.navParams.data.countries;
      this.countrieshold = this.countries;
    }
  
    async closeModal(selectcountry) {
      await this.modalController.dismiss(selectcountry);
    }

    filterItems(searchTerm) {

      if (searchTerm !== '' && searchTerm != null) {
        return this.countries.filter(item => {
          // return item.COUN_NAME.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
          return item.COUN_NAME.toLowerCase().includes(searchTerm.toLowerCase());
        });
      } else {
        this.countries = this.countrieshold;
  
        return this.countrieshold;
      }
  
    }

    setFilteredItems() {
      this.countries = this.filterItems(this.searchTerm);
    }
  
  

}
