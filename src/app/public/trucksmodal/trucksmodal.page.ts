import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-trucksmodal',
  templateUrl: './Trucksmodal.page.html',
  styleUrls: ['./Trucksmodal.page.scss'],
})
export class TrucksmodalPage implements OnInit {

    modalTitle:string;
    modelId:number;
    truckslist: any;
    truckslisthold: any;
    searchTerm: any;
    photoUrl: any;
  
    constructor(private modalController: ModalController,private navParams: NavParams) { 
      this.photoUrl = localStorage.getItem('IMAGEURL') + 'car_icons/';
    }
  
    ngOnInit() {
      console.table(this.navParams);
      this.modelId = this.navParams.data.paramID;
      this.modalTitle = this.navParams.data.paramTitle;
      this.truckslist = this.navParams.data.truckslist;
      this.truckslisthold = this.truckslist;
    }
  
    async closeModal(selectedtruck) {
      await this.modalController.dismiss(selectedtruck);
    }

    filterItems(searchTerm) {

      if (searchTerm !== '' && searchTerm != null) {
        return this.truckslist.filter(item => {
          // return item.COUN_NAME.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
          return item.TRUCK_NAME.toLowerCase().includes(searchTerm.toLowerCase());
        });
      } else {
        this.truckslist = this.truckslisthold;
  
        return this.truckslisthold;
      }
  
    }

    setFilteredItems() {
      this.truckslist = this.filterItems(this.searchTerm);
    }
  
  

}
