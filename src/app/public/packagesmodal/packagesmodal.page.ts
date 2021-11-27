import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';
import { ItemaddpopoverComponent } from '../../components/itemaddpopover/itemaddpopover.component';
import { IonSlides} from '@ionic/angular';

@Component({
  selector: 'app-packagesmodal',
  templateUrl: './packagesmodal.page.html',
  styleUrls: ['./packagesmodal.page.scss'],
})
export class PackagesmodalPage implements OnInit {

    modalTitle:string;
    modelId:number;
    packages: any;
    countrieshold: any;
    searchTerm: any;

    
    @ViewChild('mySlider', {static: true})  slides: IonSlides;
    @ViewChild('form', {static: true}) testFormElement;

    disablePrevBtn = true;
    disableNextBtn = false;
    disableBackBtn = false;
    disableSubmitBtn = true;

    itmquantity: any;
    itmheight: any;
    itmlength: any;
    itmbreadth: any;
    itmqweight: any;
    itmnote: any;
    gotten_entry: any;

    complete_item: any;
    
    constructor(
      private modalController: ModalController,
      private navParams: NavParams,
      public popoverCtrl: PopoverController
    ) { }
  
    ngOnInit() {
      console.table(this.navParams);
      this.modelId = this.navParams.data.paramID;
      this.modalTitle = this.navParams.data.paramTitle;
      this.packages = this.navParams.data.packages;
      this.countrieshold = this.packages;
    }
  
    async closeModal(selectcountry) {
      await this.modalController.dismiss(selectcountry);
    }

    async presentPopover(ev: any) {
      const popover = await this.popoverCtrl.create({
        component: ItemaddpopoverComponent,
        event: ev,
        translucent: true
      });
      return await popover.present();
    }

    filterItems(searchTerm) {

      if (searchTerm !== '' && searchTerm != null) {
        return this.packages.filter(item => {
          return item.SERV_NAME.toLowerCase().includes(searchTerm.toLowerCase());
        });
      } else {
        this.packages = this.countrieshold;
  
        return this.countrieshold;
      }
  
    }

    continue_page(form: any) {     
      this.complete_item = [
        { 
          code: this.gotten_entry.SERV_CODE, 
          name: this.gotten_entry.SERV_NAME,
          quantity: form.itmquantity,
          height: form.itmheight,
          length: form.itmlength,
          breadth: form.itmbreadth,
          weight: form.itmqweight,
          note: form.itmnote
        } 
      ];
      console.log(this.complete_item);
      this.closeModal(this.complete_item);
    }

    subform() {
      this.testFormElement.ngSubmit.emit();
    }

    swipePrev() {
      this.slides.slidePrev();
    }
  
    swipeNext(entry) {
      this.gotten_entry = entry;
      this.slides.slideNext();
    }

    subitem(){
      
    }

    setFilteredItems() {
      this.packages = this.filterItems(this.searchTerm);
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
  

}
