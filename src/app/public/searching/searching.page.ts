import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-searching',
  templateUrl: './searching.page.html',
  styleUrls: ['./searching.page.scss'],
})
export class SearchingPage implements OnInit {

  constructor(public router: Router, private api: ApiService) { }

  ngOnInit() {
  }

  gotoHome() {
    this.api.successToast('We\'ll nitify you when a <strong>Driver</strong> accepts request');
    this.router.navigate(['index/home']);
  }

}
