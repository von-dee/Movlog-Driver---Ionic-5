import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  showbutton: boolean;
  constructor(private router: Router) { }

  ngOnInit() {
    this.showbutton = false;
  }

  gotoLoginPage() {
    this.router.navigate(['init/login']);
  }
  hidebutton(ev) {
    if (ev) {
      this.showbutton = false;
    } else {
      this.showbutton = true;
    }
  }
  showStartButton(ev) {
    if (ev) {
      this.showbutton = true;
    } else {
      this.showbutton = false;
    }
  }
}
