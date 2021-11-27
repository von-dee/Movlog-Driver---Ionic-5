import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
items: any; nodata: boolean;
userid: any;

  constructor(private api: ApiService) {
    this.userid  = localStorage.getItem('USERID');
   }

  ngOnInit() {
    this.nodata = false;
    this.getNotifications();
  }

  getNotifications() {
    const action = '&actions=fetchnotification';
    const data = '&userid=' + this.userid;
    this.api.postData(action, data).then((res: any) => {
      const arr = Array.isArray(res.data);
      if (arr) {
        this.items = res.data;
      } else {
        this.nodata = true;
      }
      console.log(this.items, ' Array? => ', arr);
    });
  }

  openDetails(id: string) {
    const content: HTMLElement = document.getElementById('content_' + id);
    if (content.style.display === 'block') {
      content.style.display = 'none';
    } else {
      content.style.display = 'block';
    }
  }

}
