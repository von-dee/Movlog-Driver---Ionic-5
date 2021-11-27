import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor( private authService: AuthService) { }

  ngOnInit() {
  }

  registerUser(vaules: any) {
    console.log(vaules);
    // this.authService.appRegister(vaules);
  }


  termConditions() {
    window.open('https://dzignasylum.com/crataa/terms_and_conditions.html', '_system');
  }

}
