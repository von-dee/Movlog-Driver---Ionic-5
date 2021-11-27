import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-request-response',
  templateUrl: './request-response.page.html',
  styleUrls: ['./request-response.page.scss'],
})
export class RequestResponsePage implements OnInit {
  routeData: any; artisan: any; photoUrl: any; msg: string; accepted: boolean; usertype: any;

  constructor(private route: ActivatedRoute, private router: Router, private alertController: AlertController, private api: ApiService) {
    this.route.queryParams.subscribe((res: any) => {
      this.routeData = this.api.decodePayload(res.package);
      if (this.routeData.URQ_STATUS === '2') { this.api.infoToast('This contract was accepted by the client'); }
      console.log('Route-Data: ', this.routeData);
    });
    this.photoUrl = localStorage.getItem('IMAGEURL') + 'photos/';
    this.usertype = localStorage.getItem('USERTYPE');
    // tslint:disable-next-line:max-line-length
    this.msg = 'Click <strong>YES</strong> to accept to work with this Artisans and share contacts or click <strong>NO</strong> to cancel deal.';
  }

  ngOnInit() {
    this.accepted = false;
  }

  gotoChat(reqcode: any, rcode: any) {
    const item = {REQUEST: reqcode, REQUESTOR: rcode};
    const navigationExtras = {
      queryParams: {
        package: this.api.encodePayload(item)
      }
    };
    this.router.navigate(['/index/home/chat'], navigationExtras);
  }

  async acceptDeal(code: any) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: this.msg,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm No: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Yes');
            const action = '&actions=acceptdeal';
            const data = '&reqcode=' + code;
            this.api.postData(action , data).then((res: any) => {
              if (res.data === 'done') {
                const arr = Array(this.routeData);
                const index = arr.findIndex((e: any) => e.URQ_STATUS === 'URQ_STATUS');
                console.log(arr[0].URQ_STATUS);
                if (index === -1) {
                  this.api.successToast('Request sent to Artisan');
                  arr[0].URQ_STATUS = 2;
                  this.accepted = true;
                } else {
                  this.api.systemError('System Error!!');
                }
              } else {
                this.api.systemError('Error! sending request...wait and try again');
                this.accepted = false;
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}
