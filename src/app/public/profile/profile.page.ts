import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollDetail } from '@ionic/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ApiService } from 'src/app/services/api.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  showToolbar = false; fullname: any; phonenumber: any; userid: any; apikey: any; cipher: any; xhr: XMLHttpRequest;
  finalphoto: any; photoUrl: any; firstname: any; lastname: any; email: any; usertype: any;
  constructor( private route: Router, private camera: Camera, private api: ApiService, private actionSheetCtrl: ActionSheetController) {
    this.fullname = localStorage.getItem('FULLNAME');
    this.phonenumber = localStorage.getItem('PHONENUMBER');
    this.userid  = localStorage.getItem('USERID');
    this.apikey = localStorage.getItem('APIKEY');
    this.cipher = localStorage.getItem('CIPHER');
    this.photoUrl = localStorage.getItem('IMAGEURL') + 'photos/';
    this.finalphoto = localStorage.getItem('PHOTO');
    this.usertype = localStorage.getItem('USERTYPE');
  }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    const action = '&actions=fetchprofile';
    const data = '&usrtype=' + this.usertype;
    this.api.postData(action, data).then((res: any) => {
      console.log(res.data);
      const repo = res.data;
      this.firstname = repo.USR_FIRSTNAME;
      this.lastname = repo.USR_LASTNAME;
      this.email = repo.USR_EMAIL;
    });
  }

  gotoSettings() {
    this.route.navigateByUrl('/tabs/home/settings');
  }

  onScroll($event: CustomEvent < ScrollDetail>) {
    if ($event && $event.detail && $event.detail.scrollTop) {
    const scrollTop = $event.detail.scrollTop;
    this.showToolbar = scrollTop >= 225;
    }
  }

  updateProfile(dataObj: any) {
    const action = '&actions=updateprofile';
    const data = '&firstname=' + dataObj.firstname + '&lastname=' + dataObj.lastname + '&email=' + dataObj.email;
    this.api.postData(action, data).then((res: any) => {
      console.log(res.data);
    });
  }

  async changePhotoOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Update Photo',
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
        }, {
          text: 'Remove Photo',
          icon: 'trash',
          role: 'deletephoto',
          handler: () => {
            console.log('Remove Photo clicked');
            this.removePhoto();
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
      formdata.append('actions', 'updateprofilephoto');
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
        formdata.append('actions', 'updateprofilephoto');
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

  removePhoto() {
    this.api.pageLoading('Removing Photo');
    const action = '&actions=removephoto';
    const data = '&userid=' + this.userid;
    this.api.postData(action, data).then((res: any) => {
      if (res.msg === 'success') {
        localStorage.setItem('PHOTO', '');
        this.api.successToast('Photo Removed Successfully');
        this.finalphoto = this.photoUrl + localStorage.getItem('PHOTO');
        this.api.dismissLoading();
      } else {
        this.api.dismissLoading();
        this.api.systemError('Error removing photo, check your network');
      }
    });
  }
}
