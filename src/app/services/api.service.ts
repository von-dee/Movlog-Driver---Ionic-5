import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { delay, retryWhen } from 'rxjs/operators';
import { google } from 'google-maps';

declare var google: google;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  autocomplete_from: { input: string; };
  autocompleteItems_from: any[];
  location: any;
  location_from: any;
  placeid: any;
  placedname: any;
  placefromid: any;
  placefromname: any;
  googlemapurl: string;
  serverUrl = 'http://127.0.0.1/movlog.api/api.php';
  // serverUrl = 'http://127.0.0.1/ejumahub.api/api.php';
  // serverUrl = 'http://192.168.15.55/ejumahub.api/api.php';
  public loader: any; response: boolean;

  constructor(
    public http: HttpClient, public toastCtrl: ToastController, public loadCtrl: LoadingController,
    private actionSheetController: ActionSheetController, private zone: NgZone) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.autocomplete_from = { input: '' };
    this.autocompleteItems_from = [];
    this.googlemapurl = 'https://www.google.com/maps/place/?q=place_id:';
  }

  app_payload() {
    const apiKey = 'apikey=' + localStorage.getItem('APIKEY');
    const userid = '&userid=' + localStorage.getItem('USERID');
    const cipher = '&cipher=' + localStorage.getItem('CIPHER');
    const payload = apiKey + userid + cipher;
    return payload;
  }

  appInit(data: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return new Promise((resolve) => {
    this.http.post(this.serverUrl, data, {headers})
    .pipe(retryWhen(error => error.pipe(delay(500))))
    .subscribe((res: {msg: any, data: any}) => {
    resolve(res);
    }, err => {
        this.systemError(err).then(() => {
          this.appInit(data);
        });
      });
    });
  }

  // Get Values for API
  getData(action: any) {
    const payload = this.app_payload();
    return new Promise((resolve) => {
      this.http.get(this.serverUrl + '?' + payload + action)
      .pipe(retryWhen(error => error.pipe(delay(500))))
      .subscribe((data: {msg: any, data: any}) => {
        resolve(data);
      }, err => {
          this.systemError(err).then(() => {
            this.getData(action);
          });
        });
    });
  }

   // Post Values for API
   postData(action: any, data: any) {
    const payload = this.app_payload();
    const postdata = payload + action + data;
    const httpHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return new Promise((resolve) => {
    this.http.post(this.serverUrl, postdata, {headers: httpHeaders})
    .pipe(retryWhen(error => error.pipe(delay(500))))
    .subscribe((res: {msg: any, data: any}) => {
    resolve(res);
    }, err => {
        this.systemError(err).then(() => {
            this.postData(action, data);
        });
      });
    });
  }

  // Get Values for API
  getFbData(action: any) {
    return new Promise((resolve) => {
      this.http.get(action).pipe(retryWhen(error => error.pipe(delay(500))))
      .subscribe(data => {
        resolve(data);
      }, err => {
          this.systemError(err).then(() => {
              this.getData(action);
          });
        });
    });
  }

  async systemError(message: string) {
      const toast = await this.toastCtrl.create({
        message,
        position: 'middle',
        animated: true,
        duration: 3000,
        cssClass: 'connecterror'
      });
      toast.present();
  }

  async successToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: 'middle',
      animated: true,
      duration: 3000,
      cssClass: 'successtoast'
    });
    toast.present();
  }

  async infoToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: 'middle',
      animated: true,
      duration: 7000,
      cssClass: 'infotoast',
    });
    toast.present();
  }

  async pageLoading(msg: string) {
    this.loader = await this.loadCtrl.create({
      message: msg,
      duration: 5000,
    });
    this.loader.present();
  }


  dismissLoading() {
    this.loader.dismiss();
  }


  encodePayload(payload: any) {
    return btoa(JSON.stringify(payload));
  }
  decodePayload(payload: any) {
    return JSON.parse(atob(payload));
  }

  adjustTextarea(event: any): void {
    const textarea: any = event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  filterAccepts(count: any) {
    let p = '';
    if (count > '0') { p = count; } else { p = ''; }
    return p;
  }

  // A day ago function - Qwesi
  timeSince(time: any) {
      switch (typeof time) {
        case 'number':
          break;
        case 'string':
          time = + new Date(time);
          break;
        case 'object':
          if (time.constructor === Date) { time = time.getTime(); }
          break;
        default:
          time = +new Date();
      }
      const timeformats = [
        [60, 'seconds', 1], // 60
        [120, '1 minute ago', '1 minute from now'], // 60*2
        [3600, 'minutes', 60], // 60*60, 60
        [7200, '1 hour ago', '1 hour from now'], // 60*60*2
        [86400, 'hours', 3600], // 60*60*24, 60*60
        [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
        [604800, 'days', 86400], // 60*60*24*7, 60*60*24
        [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
        [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
        [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
        [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
        [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
        [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
        [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
        [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
      ];
      let seconds = (+new Date() - time) / 1000,
        token = 'ago',
        listchoice = 1;

      if (seconds === 0) {
        return 'Just now';
      }
      if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = 'from now';
        listchoice = 2;
      }
      let i = 0, format: any;
      // tslint:disable-next-line:no-conditional-assignment
      while (format = timeformats[i++]) {
        if (seconds < format[0]) {
          if (typeof format[2] === 'string') {
            return format[listchoice];
          } else {
            return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
          }
        }
      }
      return time;
  }

  async shearJob(item: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [{
        text: 'Facebook',
        role: 'share',
        icon: 'logo-facebook',
        handler: () => {
          console.log('Facebook clicked');
        }
      }, {
        text: 'Whatsapp',
        role: 'share',
        icon: 'logo-whatsapp',
        handler: () => {
          console.log('Whatsapp clicked');
        }
      }, {
        text: 'Twitter',
        role: 'share',
        icon: 'logo-twitter',
        handler: () => {
          console.log('Twitter clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  formatDate(indate: any, format: string, utc) {
    console.log(indate);
    const date = new Date(indate);
    const MMMM = ['\x00', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
    'November', 'December'];
    const MMM = ['\x01', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dddd = ['\x02', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const ddd = ['\x03', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    function ii(i, len = null) {
        let sy = i + '';
        len = len || 2;
        while (sy.length < len) { sy = '0' + sy; }
        return sy;
    }

    const y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, '$1' + y);
    format = format.replace(/(^|[^\\])yy/g, '$1' + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, '$1' + y);

    const M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, '$1' + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, '$1' + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, '$1' + ii(M));
    format = format.replace(/(^|[^\\])M/g, '$1' + M);

    const d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, '$1' + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, '$1' + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, '$1' + ii(d));
    format = format.replace(/(^|[^\\])d/g, '$1' + d);

    const H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, '$1' + ii(H));
    format = format.replace(/(^|[^\\])H/g, '$1' + H);

    const h = H > 12 ? H - 12 : H === 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, '$1' + ii(h));
    format = format.replace(/(^|[^\\])h/g, '$1' + h);

    const m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, '$1' + ii(m));
    format = format.replace(/(^|[^\\])m/g, '$1' + m);

    const s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, '$1' + ii(s));
    format = format.replace(/(^|[^\\])s/g, '$1' + s);

    let f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, '$1' + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, '$1' + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, '$1' + f);

    const T = H < 12 ? 'AM' : 'PM';
    format = format.replace(/(^|[^\\])TT+/g, '$1' + T);
    format = format.replace(/(^|[^\\])T/g, '$1' + T.charAt(0));

    const t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, '$1' + t);
    format = format.replace(/(^|[^\\])t/g, '$1' + t.charAt(0));

    let tz = -date.getTimezoneOffset();
    let K = utc || !tz ? 'Z' : tz > 0 ? '+' : '-';
    if (!utc) {
        tz = Math.abs(tz);
        const tzHrs = Math.floor(tz / 60);
        const tzMin = tz % 60;
        K += ii(tzHrs) + ':' + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, '$1' + K);

    const day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], 'g'), dddd[day]);
    format = format.replace(new RegExp(ddd[0], 'g'), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], 'g'), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], 'g'), MMM[M]);

    format = format.replace(/\\(.)/g, '$1');

    return format;
  }

  updateSearchResults() {
    if (this.autocomplete.input === '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }

  updateSearchResults_from() {
    if (this.autocomplete_from.input === '') {
      this.autocompleteItems_from = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete_from.input },
    (predictions, status) => {
      this.autocompleteItems_from = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems_from.push(prediction);
        });
      });
    });
  }

  selectSearchResult(item) {
    console.log(item);
    this.location = item;
    this.placeid = this.location.place_id;
    this.placedname = this.location.description;
    console.log('placeid' + this.placeid);
    this.autocompleteItems = [];
  }

  selectSearchResult_from(item) {
    console.log(item);
    this.location_from = item;
    this.placefromid = this.location_from.place_id;
    this.placefromname = this.location_from.description;
    console.log('placeid' + this.placefromid);
    this.autocompleteItems_from = [];
  }

  GoTo() {
    return window.location.href = this.googlemapurl + this.placeid;
  }

}
