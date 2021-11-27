import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-mybids',
  templateUrl: './mybids.page.html',
  styleUrls: ['./mybids.page.scss'],
})
export class MybidsPage implements OnInit {

  userid: string; jobs: any; jobImageUrl: any; nodata: boolean; drivercode: any;
  constructor(private api: ApiService, private router: Router, public alertController: AlertController) {
    this.userid  = localStorage.getItem('USERID');
    this.drivercode  = localStorage.getItem('DRIVER_CODE');
    this.jobImageUrl = localStorage.getItem('IMAGEURL') + 'photos/';
  }

  ngOnInit() {
    this.nodata = false;
    this.getSubscripbedJobs();
  }

  getSubscripbedJobs() {
    const action = '&actions=myrequest';
    const data = '&drivercode=' + this.drivercode;
    this.api.postData(action, data).then((res: any) => {
      console.log(res.data);
      const arr = Array.isArray(res.data);
      if (arr) {
        this.jobs = res.data;
      } else {
        this.nodata = true;
      }
    });
  }

  gotoDetails(item: any) {
    const navigationExtras = {
      queryParams: {
        package: this.api.encodePayload(item),
        route_url: "/index/mybids"
      }
    };
    this.router.navigate(['/index/home/request-detail'], navigationExtras);
  }

  gotoHistory(item: any) {
    const navigationExtras = {
      queryParams: {
        package: this.api.encodePayload(item)
      }
    };
    this.router.navigate(['/index/home/request-detail'], navigationExtras);
  }

  gotoNotifications() {}

  openDetails(id: string) {
    const content: HTMLElement = document.getElementById('content_' + id);
    if (content.style.display === 'block') {
      content.style.display = 'none';
    } else {
      content.style.display = 'block';
    }
  }


  async presentAlertConfirm(item: any) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you <strong>done</strong> with the trip!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.finishedtrip(item);

          }
        }
      ]
    });

    await alert.present();
  }

  finishedtrip(item: any) {
    const action = '&actions=finishedtrip';

    console.log(item); 
    const data = '&drivercode=' + localStorage.getItem('USERID') + '&status=' + item.REQ_REQ_STATUS + '&drivername=' + localStorage.getItem('FULLNAME') + '&requestor_code=' + item.REQ_REQUESTOR_CODE + '&requestor_name=' + item.REQ_REQUESTER_NAME + '&request_code=' + item.URQ_REQUEST_CODE + '&acceptrequest_code=' + item.URQ_CODE + '&acceptedrequest_code=' + item.URQ_REQUEST_CODE + '&from=' + item.REQ_LOCATION_FROM + '&to=' + item.REQ_LOCATION;
    
    this.api.postData(action, 
      data).then((res: any) => {
      console.log(res.data);
      const arr = Array.isArray(res.data);
      // this.router.navigate(['/index/mybids']);
      if (arr) {
        this.jobs = res.data;
      } else {
        this.nodata = true;
      }
    });
  }

}
