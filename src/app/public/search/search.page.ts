import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  searchparam: any; jobmarket: any;
  constructor(private api: ApiService, private location: Location) { }

  ngOnInit() {
  }
  closepage() {
    this.location.back();
  }

  findRequest() {
    const action = '&actions=searchjobmarket';
    const data = '&searchparam=' + this.searchparam;
    this.api.postData(action, data).then((res: any) => {
      console.log(res);
      this.jobmarket = res.data;
    });
  }

}
