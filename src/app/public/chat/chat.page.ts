import { Component, OnInit, ViewChild} from '@angular/core';
import { IonTextarea, IonContent } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent, {static: false}) content: IonContent;
  @ViewChild('.commentinput', {static: false}) messageInput: IonTextarea;
  message: any = []; chatid: string; chattime: any; chatmsg: any; routedata: any; chats: any; userId:any; receiverId:any; requestcode: string; requestorcode: string; interval:any;

  constructor(private api: ApiService, private route: ActivatedRoute) {
    this.userId = localStorage.getItem('USERID');

    

    //const repo = JSON.parse(localStorage.getItem('MESSAGE'));
    // if (repo) {
    //   this.message = repo;
    // }
    setTimeout(() => {
      this.content.scrollToBottom(400);
    }, 100);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((res: any) => {
      const routedata = this.api.decodePayload(res.package);
      console.log(routedata);
      this.requestcode = routedata.REQUEST;
      this.requestorcode = routedata.REQUESTOR;
      this.fetchChats(routedata.REQUEST);
    });
    this.chatid = localStorage.getItem('USERID');
    this.chattime = new Date().getTime();
    this.fetchChats(this.requestcode);
    this.receiveChat();
  }

  fetchChats(requestcode: string) {
    const action = '&actions=fetchchat';
    const data = '&requestcode=' + requestcode+'&sendercode=' + this.userId+'&receivecode=' + this.requestorcode;
    this.api.postData(action, data).then((res: any) => {
      this.chats = res.data;
      console.log(this.chats);
    });
  }

  saveChat(params: any) {//sendchat
    this.message.push(params);
    console.log(this.message);
    //localStorage.setItem('MESSAGE', JSON.stringify(this.message));
    this.content.scrollToBottom(400);
    this.chatmsg = '';
  }

  receiveChat(){
    this.interval = setInterval(()=>{ 
      const action = '&actions=fetchchat';
      const data = '&requestcode=' + this.requestcode+'&sendercode=' + this.userId+'&receivecode=' + this.requestorcode;
    this.api.postData(action, data).then((res: any) => {
      this.chats = res.data;
      //this.message.push(params);
      console.log(this.chats);
    });
  }, 900); //0.9 seconds
  }

  focus() {
    if (this.content.scrollToBottom) {
      this.content.scrollToBottom(400);
    }
  }

  timeAgo(time: Date) {
    const dat = new Date(time);
    console.log(dat);
    const h = dat.getHours();
    const m = dat.getMinutes();
    return h + ':' + m;
  }


  ionViewDidLeave(){
    console.log('ionViewDidLeave');
    clearInterval(this.interval);
  }

}
