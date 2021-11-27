import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, ActionSheetController} from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ApiService } from 'src/app/services/api.service';

import { ModalController } from '@ionic/angular';
import { PackagesmodalPage } from '../../public/packagesmodal/packagesmodal.page';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.page.html',
  styleUrls: ['./service-request.page.scss'],
})
export class ServiceRequestPage implements OnInit {
  service: any; location: any; duration: any; description: any; userid: any; usersname: any; phonenumber: string;
  services: any; finalparams: any;  finalphoto: any; photoUrl: any; xhr: XMLHttpRequest; apikey: any; cipher: any; dselect: any;

  locationid: any;
  location_fromid: any;
  locationname: any;
  location_fromname: any;
  pickupdate: any;
  pickuptime: any;
  pickupdate_input: any;
  pickuptime_input: any;

  // Slider values and params
  disablePrevBtn = true;
  disableNextBtn = false;
  disableBackBtn = false;
  disableSubmitBtn = true;
  @ViewChild('mySlider', {static: true})  slides: IonSlides;

  @ViewChild('form', {static: true}) testFormElement;
  countries: any;
  dataReturned: any;
  country: any;
  countrycode: any;
  selecteditems:any;
  totalitems:any;
  totalamount:any;


  constructor(private api: ApiService, private router: Router, private actionSheetCtrl: ActionSheetController, private camera: Camera, public modalController: ModalController) {
    this.userid = localStorage.getItem('USERID');
    this.usersname = localStorage.getItem('FULLNAME');
    this.phonenumber = localStorage.getItem('PHONENUMBER');
    this.apikey = localStorage.getItem('APIKEY');
    this.cipher = localStorage.getItem('CIPHER');
    this.photoUrl = localStorage.getItem('IMAGEURL') + 'photos/';
    this.finalphoto = localStorage.getItem('PHOTO');
    this.totalitems = 0;
    this.totalamount = 0.00;

    this.selecteditems = [];

  }

  ngOnInit() {
    const action = '&actions=fetchservices';
    const data = '';
    this.api.postData(action, data).then((res: any) => {
      const repo = res.data;
      for (const key in repo) {
        if (key) {
          this.finalparams = Object.assign(repo[key], {isChecked: false});
        }
      }
      this.services = repo;
      console.log(this.services);
    });
  }


  async openModal() {
    const modal = await this.modalController.create({
      component: PackagesmodalPage,
      componentProps: {
        "paramID": 123,
        "paramTitle": "Test Title",
        "packages": this.services
      }
    });
 
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        this.phonenumber = "+" + this.dataReturned.COUN_EXTENSION;
        this.country = this.dataReturned.COUN_NAME;
        this.countrycode = "+" + this.dataReturned.COUN_EXTENSION;
      
        console.log("dataReturned");
        console.log(this.dataReturned);
        this.add_item(this.dataReturned);
      }
    });
 
    return await modal.present();
  }

  add_item(item){
    var itm = { 
      code: item[0].code, 
      name: item[0].name,
      height: item[0].height, 
      length: item[0].length,
      breadth: item[0].breadth, 
      weight: item[0].weight, 
      quantity: item[0].quantity, 
      description: item[0].note 
    };

    console.log("itm");
    console.log(itm);

    this.selecteditems.push(itm);
    console.log("selecteditems");
    console.log(this.selecteditems);

    this.totalitems = this.totalitems + 1;
    this.totalamount = this.totalamount + (2.32 * parseFloat(item[0].quantity));
    console.log(this.totalamount);
  }
  

  remove_item(item){

    const indiceABorrar = this.selecteditems.findIndex(q => q.code === item.code);
  
    if (-1 != indiceABorrar) {
        this.selecteditems.splice(indiceABorrar, 1);
        this.totalitems = this.totalitems - 1;
    }
    
  }


  setdate(){
    this.pickupdate = this.pickupdate_input.substr(0, this.pickupdate_input.indexOf('T'));
  }
  
  settime(){
    this.pickuptime = this.pickuptime_input.split('T')[1];
    this.pickuptime = this.pickuptime.substring(0, 8);
  }

  saveRequest(form: any) {
    
    if(form.jobduration > 1){
      if(form.durationselection == "day"){
        this.dselect = "days";
      }else if(form.durationselection == "week"){
        this.dselect = "weeks";
      }else if(form.durationselection == "month"){
        this.dselect = "months";
      }

    }else{
      this.dselect = form.durationselection;
    }
    
    // const serviceinfo = form.service.split(',');
    const action = '&actions=servicerequest';

    const data = '&itemsselected=' + JSON.stringify(this.selecteditems) + '&description=' + form.description + '&locationid=' + form.locationid + '&location_fromid='+ form.location_fromid + '&locationname=' + form.locationname + '&location_fromname=' + form.location_fromname + '&pickupdate=' + this.pickupdate + '&pickuptime=' + this.pickuptime + '&requestorcode=' + this.userid + '&requestorname=' + this.usersname + '&totalitems=' + this.totalitems + '&totalamount=' + this.totalamount; 

    console.log(data);
    this.api.postData(action, data).then((res: any) => {
      console.log(res);
      if (res.data === 'done') {
        this.router.navigate(['/index/home/searching']);
      } else {
        this.api.systemError('<strong>Error</strong> sending your request. Please wait a while and try again.');
      }
    });
  }

  subform() {
    this.testFormElement.ngSubmit.emit();
  }
  swipePrev() {
    this.slides.slidePrev();
  }

  swipeNext() {
    this.slides.slideNext();
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

  async photoOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Options',
      cssClass: 'confirmaction-lite',
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera',
          role: 'takephoto',
          handler: () => {
            this.cameraShot();
          }
        }, {
          text: 'Gallery',
          icon: 'image',
          role: 'getphoto',
          handler: () => {
            console.log('Gallery clicked');
            this.getImageFromPhone();
          }
        }
      ]
    });
    await actionSheet.present();
  }

  cameraShot() {
    const options: CameraOptions = {
      quality: 100,
      allowEdit: true,
      targetWidth: 400,
      targetHeight: 400,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(options).then((fetchedImage) => {
    if (fetchedImage) {
      this.api.pageLoading('Updating...');
      const formdata = new FormData() ;
      formdata.append('apikey', this.apikey);
      formdata.append('userstatus', this.cipher);
      formdata.append('userid', this.userid);
      formdata.append('actions', 'addlocationphoto');
      formdata.append('picture', fetchedImage);
      this.xhr.timeout = 200000;
      this.xhr.open('POST', this.api.serverUrl, true);
      this.xhr.onreadystatechange = () => {
        if (this.xhr.status === 200) {
          const obj: string = this.xhr.responseText;
          const repo = JSON.parse(obj);
          if (repo.msg === 'success') {
            localStorage.setItem('PHOTO', repo.data);
            this.finalphoto = this.photoUrl + localStorage.getItem('PHOTO');
            this.api.dismissLoading();
            this.api.successToast('Photo updated successfully');
            localStorage.setItem('FB', 'false');
          } else {
            this.api.dismissLoading();
            this.api.systemError('Error updating photo');
          }
        } else {
          this.api.dismissLoading();
        }
      };
      this.xhr.send(formdata);
    }
  });
}

  getImageFromPhone() {
    const options: any = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      quality: 100,
      allowEdit: true,
      targetWidth: 400,
      targetHeight: 400,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((fetchedImage) => {
      if (fetchedImage) {
        this.api.pageLoading('Updating...');
        const formdata = new FormData() ;
        formdata.append('apikey', this.apikey);
        formdata.append('userstatus', this.cipher);
        formdata.append('userid', this.userid);
        formdata.append('actions', 'addlocationphoto');
        formdata.append('picture', fetchedImage);
        this.xhr.timeout = 200000;
        this.xhr.open('POST', this.api.serverUrl, true);
        this.xhr.onreadystatechange = () => {
          if (this.xhr.status === 200) {
            const obj: string = this.xhr.responseText;
            const repo = JSON.parse(obj);
            if (repo.msg === 'success') {
              localStorage.setItem('PHOTO', repo.data);
              this.finalphoto = this.photoUrl + localStorage.getItem('PHOTO');
              this.api.dismissLoading();
              this.api.successToast('Photo updated successfully');
              localStorage.setItem('FB', 'false');
            } else {
              this.api.dismissLoading();
              this.api.systemError('Error updating photo');
            }
          } else {
            this.api.dismissLoading();
          }
        };
        this.xhr.send(formdata);
      }
    });
  }

}
