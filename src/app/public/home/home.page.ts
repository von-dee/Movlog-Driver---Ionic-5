import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AlertController, PopoverController } from '@ionic/angular';
import { ItemaddpopoverComponent } from '../../components/itemaddpopover/itemaddpopover.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  passphoto: string; items: any = []; usertype: string; livechats: any = []; jobsimg: string; jobmarket: any;
  jobImageUrl: string; username: string; nodata: boolean;usercartype_code: any;usercartype_name: any;

  constructor(private router: Router, public popoverCtrl: PopoverController, private api: ApiService, private alertController: AlertController) {
    this.passphoto = 'assets/imgs/default.jpg';
    this.jobsimg = 'assets/imgs/avatar.png';
    this.usertype = localStorage.getItem('USERTYPE');
    this.usercartype_code = localStorage.getItem('DRIVER_CARTYPE_CODE');
    this.jobImageUrl = localStorage.getItem('IMAGEURL') + 'photos/';
    this.username = localStorage.getItem('FULLNAME');
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.fetchSocialChats();
    this.fetchJobmarket();
  }

  fetchJobmarket() {
    const action = '&actions=jobmarket';
    const data = '&usrtype=' + this.usertype + '&usrcartypecode=' + this.usercartype_code;
    this.api.postData(action, data).then((res: any) => {
      console.log(res);
      const arr = Array.isArray(res.data);
      if (arr) {
        this.jobmarket = res.data;
        this.nodata = false;
      } else {
        this.nodata = true;
      }
    });
  }

  fetchSocialChats() {
    const action = '&actions=fetchsocialchats';
    const data = '';
    this.api.postData(action, data).then((res: any) => {
      console.log(res);
      this.livechats = res.data;
    });
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: ItemaddpopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async acceptJob(reqcode: string, servcode: string, requestor: any) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Click <strong>YES</strong> to accept Trip.',
      inputs: [
        {
          name: 'otherspecs',
          placeholder: 'Comment'
        }
      ],
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('No : blah');
          }
        }, {
          text: 'Yes',
          handler: (res) => {
            const action = '&actions=acceptrequest';
            const data = '&propsedspecs=' + res.otherspecs + '&requestcode=' + reqcode
                    + '&servicecode=' + servcode + '&artisanname=' + this.username + '&requestor=' + requestor;
            this.api.postData(action, data).then((resp: any) => {
              if (resp.data === 'done') {
                this.api.successToast('Trip Accepted successfully...');
                this.fetchJobmarket();
              } else {
                this.api.systemError('Error adding this job, please wait and try adding again.');
              }
            });
          }
        }
      ]
    });
    await alert.present();
}

  comments(code: any) {
    const navigationExtras = {
      queryParams: {
        package: this.api.encodePayload(code)
      }
    };
    this.router.navigate(['/index/home/comments'], navigationExtras);
  }

  chats(reqcode: any, rcode: any) {
    const item = {REQUEST: reqcode, REQUESTOR: rcode};
    const navigationExtras = {
      queryParams: {
        package: this.api.encodePayload(item)
      }
    };
    this.router.navigate(['/index/home/chat'], navigationExtras);
  }
  share(item: any) {
    this.api.shearJob(item);
  }
  getsearchbar() {
    this.router.navigateByUrl('/index/home/search');
  }
  gotoProfile() {
    this.router.navigateByUrl('/index/home/profile');
  }
  gotoRequest() {
    this.router.navigateByUrl('/index/home/request');
  }
  gotoServiceRequest() {
    this.router.navigateByUrl('/index/home/service-request');
  }
  getsetings() {
    // this.router.navigateByUrl('/index/home/settings');
    this.router.navigateByUrl('/index/home/profile');
  }

  gotoDetails(item: any) {
    const navigationExtras = {
      queryParams: {
        package: this.api.encodePayload(item),
        route_url: "/index/home"
      }
    };
    this.router.navigate(['/index/home/request-detail'], navigationExtras);
  }

}
