import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.page.html',
  styleUrls: ['./request-detail.page.scss'],
})
export class RequestDetailPage implements OnInit {
item: any; jobImageUrl: any; usertype: any; requests: any; username: any; showCancel: boolean; userid: any;selecteditems: any;
route_url: any; jobs: any; nodata: any;usercartypecode: any;usercartypename: any;usercartypeurl: any;
carnumber: any;driverphone: any;clientdetails: any;
  
  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, private alertController: AlertController) {
    this.route.queryParams.subscribe((res: any) => {
      this.item = this.api.decodePayload(res.package);
      this.route_url = res.route_url;
      
      console.log("xxxx");
      console.log(this.item);
      this.get_clientsdetails(this.item.REQ_REQUESTOR_CODE);
      console.log("route_url");
      console.log(this.route_url);

      this.selecteditems = JSON.parse(this.item.REQ_ITEMS);
      console.log(this.selecteditems);
    });
    this.jobImageUrl = localStorage.getItem('IMAGEURL') + 'photos/';
    this.userid = localStorage.getItem('USERID');
    this.usertype = localStorage.getItem('USERTYPE');
    this.username = localStorage.getItem('FULLNAME');

    this.usercartypecode = localStorage.getItem('DRIVER_CARTYPE_CODE');
    this.usercartypename = localStorage.getItem('DRIVER_CARTYPE_NAME');
    this.usercartypeurl = localStorage.getItem('DRIVER_CARTYPE_URL');
    this.driverphone = localStorage.getItem('PHONENUMBER');
    this.carnumber = localStorage.getItem('DRIVER_CARNUMBER');
  }

  ngOnInit() {
    this.acceptedRequest();
    if (this.item.REQ_REQUESTOR_CODE === this.userid) {
      this.showCancel = true;
    } else {
      this.showCancel = false;
    }
  }

  

  get_clientsdetails(clientcode){
    const action = '&actions=fetchclientdetails';
    const data = '&clientcode=' + clientcode;
    // const data = '&clientcode=' + "USR0000000001";
    
    this.api.postData(action, data).then((res: any) => {
      const repo = res.data;
      this.clientdetails = repo;
      console.log("clientdetails");
      console.log(this.clientdetails);
    });
  }

  comments(code: any) {
    const navigationExtras = {
      queryParams: {
        package: this.api.encodePayload(code)
      }
    };
    this.router.navigate(['/index/home/comments'], navigationExtras);
  }

  share(item: any) {
    this.api.shearJob(item);
  }

  acceptedRequest() {
    const action = '&actions=acceptedrequest';
    const data = '&requestcode=' + this.item.REQ_CODE;
    this.api.postData(action, data).then((res: any) => {
      this.requests = res.data;
      console.log("accepted requests");
      console.log(this.requests);
    });
  }

  gotoProformer(data: any, rcode: any) {
    data.URQ_REQUESTOR_CODE = rcode;
    const navigationExtras = {
      queryParams: {
        package: this.api.encodePayload(data)
      }
    };
    this.router.navigate(['/index/home/request-response'], navigationExtras);
  }

  getLocationMap(id: string) {
    return  window.location.href = this.api.googlemapurl + id;
  }

  async cancelRequest(requestorcode: any, reqcode: any) {
      const alert = await this.alertController.create({
        header: 'Warning!',
        message: 'Are you sure you want to cancel this <strong>Request</strong>!!!',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Yes',
            handler: () => {
              const action = '&actions=cancelrequest';
              const data = '&requestorcode=' + requestorcode + '&reqCode=' + reqcode;
              this.api.postData(action, data).then((res: any) => {
                if (res.data === 'done') {
                  this.api.successToast('Request cancelled successfuly');
                  this.router.navigate(['/index/home']);
                } else {
                  this.api.systemError('Error cancelling request!');
                }
              });
            }
          }
        ]
      });
      await alert.present();
  }

  async acceptJob(item) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Click <strong>YES</strong> to accept Trip.',
      inputs: [
        {
          name: 'drivernote',
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

            const data = '&requestcode=' + item.REQ_CODE + 
            '&requestor_code=' + item.REQ_REQUESTOR_CODE + 
            '&requestor_name=' + item.REQ_REQUESTER_NAME + 
            '&driver_code=' + localStorage.getItem('DRIVER_CODE') + 
            '&driver_name=' + localStorage.getItem('FULLNAME') +
            '&driver_phone=' + localStorage.getItem('PHONENUMBER') +  
            '&usercompanycode=' + localStorage.getItem('DRIVER_COMP_CODE') +  
            '&usercompany=' + localStorage.getItem('DRIVER_COMP_NAME') +  
            '&userphone=' + item.REQ_REQUESTOR_PHONE +  
            '&budget=' + item.REQ_TOTAL_AMOUNT +  
            '&truck_carnumber=' + localStorage.getItem('DRIVER_CARNUMBER') + 
            '&truck_typecode=' + localStorage.getItem('DRIVER_CARTYPE_CODE') + 
            '&truck_typename=' + localStorage.getItem('DRIVER_CARTYPE_NAME') + 
            '&truck_typeimg=' + localStorage.getItem('DRIVER_CARTYPE_URL') + 
            '&drivernote=' + res.drivernote;
            

            this.api.postData(action, data).then((resp: any) => {
              if (resp.data === 'done') {
                this.api.successToast('Trip Accepted successfully...');
                this.router.navigate(['index/home/mybids']);
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


  async presentFinishAlertConfirm() {
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
            this.finishedtrip(this.item);

          }
        }
      ]
    });

    await alert.present();
  }

  finishedtrip(item: any) {
    const action = '&actions=finishedtrip';

    const data = '&artisancode=' + item.URQ_ARTISAN_CODE + '&artisanname=' + item.URQ_NAME + '&requestor_code=' + item.REQ_REQUESTOR_CODE + '&requestor_name=' + item.REQ_REQUESTER_NAME + '&request_code=' + item.URQ_REQUEST_CODE + '&acceptrequest_code=' + item.URQ_CODE + '&acceptedrequest_code=' + item.URQ_REQUEST_CODE + '&from=' + item.REQ_LOCATION_FROM + '&to=' + item.REQ_LOCATION;
    
    this.api.postData(action, 
      data).then((res: any) => {
      console.log(res.data);
      const arr = Array.isArray(res.data);
      this.router.navigate(['/index/history']);
      if (arr) {
        this.jobs = res.data;
      } else {
        this.nodata = true;
      }
    });
  }


}
