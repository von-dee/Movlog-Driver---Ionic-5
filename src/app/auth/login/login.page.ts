import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userfbphoto: any;
  constructor(private authService: AuthService, private fb: Facebook, private api: ApiService, private router: Router) { }

  ngOnInit() {
    const initcheck = localStorage.getItem('APIKEY');
    if (!initcheck) {
      this.authService.startApiConnection();
    }
  }

  userLogin(params: any) {
    this.authService.appLogin(params);
  }

  forgottenPassword() {
    this.authService.forgottenPassword();
  }

  faceBookLogin() {
    this.fb.login(['public_profile', 'email']).then((res: FacebookLoginResponse) => {
      if (res.status === 'connected') {
        this.userfbphoto = 'https://graph.facebook.com/' + res.authResponse.userID + 'picture?type=square';
        this.fbgetData(res.authResponse.accessToken);
      } else {
        this.api.systemError('Error loging in...');
      }
      console.log('Logged into Facebook!', res);
    }).catch(e => {
      console.log('Error logging into Facebook', e);
    });
  }

  fbgetData(accesstoken: string) {
    const url = 'https://graph.facebook.com/me?fields=id,name,first_name,last_name,email&access_token=' + accesstoken;
    this.api.getFbData(url).then((res) => {
      console.log('FB-Res-> ', res);
      const repo = JSON.stringify(res);
      if (repo) {
        this.api.pageLoading('Loging in..');
        const action = '&actions=fbuserlogin';
        const data = '&payload=' + repo + '&userphoto=' + this.userfbphoto;
        this.api.postData(action, data).then((resp: any) => {
          const reponce = resp.data;
          console.log('API Res-> ', reponce);
          localStorage.setItem('FB', 'true');
          this.authService.setParams(reponce).then((done) => {
            if (done) {
              this.router.navigate(['web/home']);
              this.authService.authenticationState.next(true);
              this.api.dismissLoading();
              localStorage.setItem('Welcome', 'true');
            }
          });
        });
      } else {
        this.api.dismissLoading();
        this.authService.authenticationState.next(false);
        this.api.systemError('Error loging in...');
      }
    });
  }


}

