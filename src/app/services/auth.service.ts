import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform, AlertController } from '@ionic/angular';

import { ApiService } from './api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authenticationState = new BehaviorSubject(false); formstatus: boolean;

  constructor(
    private platform: Platform,
    private api: ApiService,
    private alertCtrl: AlertController,
    private router: Router) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }

  async applogout() {
    const confirm = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.router.navigate(['init/login']);
            localStorage.clear();
            this.authenticationState.next(false);
            localStorage.setItem('Welcome', 'true');
          }
        }
      ]
    });
    await confirm.present();
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  startApiConnection() {
    const action = 'actions=initapp';
    this.api.appInit(action).then((res: any) => {
      const repo = res.data;
      localStorage.setItem('APIKEY', repo.token);
      localStorage.setItem('USERID', repo.userid);
      localStorage.setItem('STATUS', repo.status);
      localStorage.setItem('IMAGEURL', repo.imgurl);
    });
  }

  ifLoggedIn() {
    const status = localStorage.getItem('STATUS');
    const apikey = localStorage.getItem('APIKEY');
    if (apikey && status === '2') {
      this.authenticationState.next(true);
    } else {
      this.authenticationState.next(false);
    }
  }

  checkNumber(phonenumber: any, usertype: any) {
    this.api.pageLoading('Checking..');
    return new Promise((resolve) => {
      const action = '&actions=checkuseraccount';
      const data = '&phonenumber=' + phonenumber + '&usertype=' + usertype;
      this.api.postData(action, data).then((res: any) => {
        if (res.msg === 'success') {
          const repose = res.data;
          this.setParams(repose).then((done) => {
            if (done) {
              this.router.navigate(['index/home']);
              this.authenticationState.next(true);
              this.api.dismissLoading();

              localStorage.setItem('Welcome', 'true');
              resolve(true);
            }
          });
          this.api.dismissLoading();
        } else {
          this.api.dismissLoading();
          
          resolve(false);
        }
      });
    });
  }

  appLogin(params: any) {
    console.log(params);
    this.api.pageLoading('Loging in..');
    if (params.usname && params.pwd) {
      const actions = '&actions=loginuser';
      const data = '&usname=' + params.usname + '&pwd=' + params.pwd;
      this.api.postData(actions, data).then((res: any) => {
      const repo = res.data;
      if (res.msg === 'success') {
        this.setParams(repo).then((done) => {
          if (done) {
            this.router.navigate(['web/home']);
            this.authenticationState.next(true);
            this.api.dismissLoading();
            
            localStorage.setItem('Welcome', 'true');
          }
        });
      } else {
        this.authenticationState.next(false);
        this.api.dismissLoading();
        
        this.api.systemError('Wrong email or password');
      }
    }, (err) => {
      this.api.dismissLoading();
      
      console.log(err);
    });
    } else {
      this.api.dismissLoading();
      
      this.api.systemError('Please fill all fields to proceed...');
    }

  }

  appRegister(params: any, type: number) {
    this.api.pageLoading('Sending...');
    console.log(params);
    this.formstatus = false;
    let formdata: string;
    if (type === 1) {
      if (params.firstname && params.lastname && params.gender && params.phonenumber) {
        this.formstatus = true;
        formdata = '&usrtype=' + type + '&usr_fname=' + params.firstname + '&usr_lname=' + params.lastname + '&urs_gender='
        + params.gender + '&ursphone=' + params.phonenumber;
      } else {
        this.api.systemError('Please fill all form details.');
        this.api.dismissLoading();
        
      }
    } else if (type === 2) {
      if (params.firstname && params.lastname && params.gender && params.phonenumber && params.licensenumber && params.licensetype && params.carnumber && params.added_truck_code && params.added_truck_name && params.added_truck_url) {
        this.formstatus = true;

        formdata = '&usrtype=' + type + '&usr_fname=' + params.firstname + '&usr_lname=' + params.lastname + '&urs_gender='
        + params.gender + '&ursphone=' + params.phonenumber + '&usrlicensenumber=' + params.licensenumber + '&usrlicensetype=' + params.licensetype + '&usrcarnumber=' + params.carnumber + '&usrcartype=' + params.added_truck_code + '&usrcartypename=' + params.added_truck_name + '&usrcartypeurl=' + params.added_truck_url;

      } else {
        this.api.systemError('Please fill all form details.');
        this.api.dismissLoading();
        
      }
    } else if (type === 3) {
      if (params.firstname && params.lastname && params.gender && params.phonenumber && params.location ) {
        this.formstatus = true;
        formdata = '&usrtype=' + type + '&usr_fname=' + params.firstname + '&usr_lname=' + params.lastname + '&urs_gender='
        + params.gender + '&ursphone=' + params.phonenumber + '&shop_location=' + params.location;
      } else {
        this.api.systemError('Please fill all form details.');
        this.api.dismissLoading();
        
      }
    }

    if (this.formstatus === true) {
      const actions = '&actions=register';
      const data = formdata;
      this.api.postData(actions, data).then((res: any) => {
        console.log('Hello ', res);
        const repose = res.data;
        if (res.msg === 'success') {
          localStorage.setItem('IMAGEURL', res.imgurl);
          this.setParams(repose).then((done) => {
            if (done) {
              this.api.successToast('Registed Successfully');
              this.router.navigate(['index/home']);
              this.authenticationState.next(true);
              localStorage.setItem('Welcome', 'true');
              this.api.dismissLoading();
              
            } else {
              this.api.dismissLoading();
              
            }
          });
        } else {
          this.authenticationState.next(false);
          this.api.dismissLoading();
          
          this.api.systemError('Network Error!, please try again...');
        }
      }, (err) => {
        this.api.dismissLoading();
        
        console.log(err);
      });
    }
  }

  setParams(repo: any) {
    return new Promise((resolve) => {
      localStorage.setItem('FISTNAME', repo.USR_FIRSTNAME);
      localStorage.setItem('LASTNAME', repo.USR_LASTNAME);
      localStorage.setItem('FULLNAME', repo.USR_FIRSTNAME + ' ' + repo.USR_LASTNAME);
      localStorage.setItem('APIKEY', repo.USR_API_KEY);
      localStorage.setItem('STATUS', '2');
      localStorage.setItem('USERID', repo.USR_CODE);
      localStorage.setItem('PHONENUMBER', repo.USR_PHONE);
      localStorage.setItem('PHOTO', repo.USR_PHOTO);
      localStorage.setItem('CIPHER', repo.USR_CIPHER);
      localStorage.setItem('USERTYPE', repo.USR_TYPE);  
      
      localStorage.setItem('DRIVER_COMP_CODE', repo.DRIVER_COMP_CODE);
      localStorage.setItem('DRIVER_COMP_NAME', repo.DRIVER_COMP_NAME);

      localStorage.setItem('DRIVER_CODE', repo.DRIVER_CODE);
      localStorage.setItem('DRIVER_USR_CODE', repo.DRIVER_USR_CODE);
      localStorage.setItem('DRIVER_LICENSENUMBER', repo.DRIVER_LICENSENUMBER);
      localStorage.setItem('DRIVER_LICENSETYPE', repo.DRIVER_LICENSETYPE);
      localStorage.setItem('DRIVER_CARNUMBER', repo.DRIVER_CARNUMBER);
      localStorage.setItem('DRIVER_CARTYPE_CODE', repo.DRIVER_CARTYPE_CODE);
      localStorage.setItem('DRIVER_CARTYPE_NAME', repo.DRIVER_CARTYPE_NAME);
      localStorage.setItem('DRIVER_CARTYPE_URL', repo.DRIVER_CARTYPE_URL);

      localStorage.setItem('Welcome', 'true');
      
      resolve(true);
    });
  }

  async forgottenPassword() {
    const prompt = await this.alertCtrl.create({
      header: 'Forgotten Password',
      message: 'Enter the email you used to register on Crataa.',
      inputs: [
        {
          name: 'email',
          placeholder: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: (data) => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            const email = data.email;
            const re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
            if (email === '' || !re.test(email)) {
              this.api.systemError('Please enter a valid email address.');
            } else {
              this.api.pageLoading('Sending..');
              const actions = '&actions=forgottenpassword';
              const senddata = '&email=' + email;
              this.api.postData(actions, senddata).then((res: any) => {
                const resp = res.data;
                if (resp === 'done') {
                  this.api.dismissLoading();
                  
                  this.api.successToast('A new password has been sent to ' + email + ', please login to your email to get it.');
                } else if (resp === 'notmember') {
                  this.api.systemError('This email does not exist, please check it.');
                } else {
                  this.api.dismissLoading();
                  
                  this.api.systemError('Ooops!...error requesting new password.');
                }
              });
            }
          }
        }
      ]
    });
    await prompt.present();
  }

  async chagePassword(datavalues: any) {
    const action = '&actions=changepassword';
    const data = '&oldpwd=' + datavalues.oldpass + '&pwd=' + datavalues.pwd + '&pwd2=' + datavalues.pwd2;
    await this.api.postData(action, data).then((res: any) => {
      if (res.msg === 'success') {
        this.api.successToast('Password changed successfully');
        setTimeout(() => {
          this.authenticationState.next(false);
        }, 2000);
      } else {
        this.api.systemError('Error changing password!');
      }
    });
  }

}
