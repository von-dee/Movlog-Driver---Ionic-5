import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private api: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    const welcome = localStorage.getItem('Welcome');
    if (welcome === 'true') {
        this.authService.authenticationState.subscribe(state => {
          if (state) {
            this.router.navigate(['index/home']);
          } else {
            this.router.navigate(['init/login']);
          }
        });
    } else {
      this.router.navigate(['init']);
    }
    const initcheck = localStorage.getItem('APIKEY');
    if (!initcheck) {
      this.startApiConnection();
    }
  }

  startApiConnection() {
    const action = 'actions=initapp';
    this.api.appInit(action).then((res: any) => {
      const repo = res.data;
      console.log(repo);
      if (res.msg === 'success') {
        localStorage.setItem('APIKEY', repo.initcode);
        localStorage.setItem('USERID', repo.initid);
        localStorage.setItem('CIPHER', repo.initcipher);
        localStorage.setItem('IMAGEURL', repo.imgurl);
      } else {
        this.api.successToast('Error geting service!');
      }
    });
  }
}
