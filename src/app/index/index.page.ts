import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage implements OnInit {
  ifselected: boolean; usertype: any;
  constructor() {
  }

  ngOnInit() {
    this.usertype = localStorage.getItem('USERTYPE');
  }

  checkActive() {
    this.ifselected = false;
    if (this.ifselected) {
      this.ifselected = false;
    } else {
      this.ifselected = true;
    }
  }
}
