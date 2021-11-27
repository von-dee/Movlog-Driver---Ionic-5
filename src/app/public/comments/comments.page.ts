import { Component, OnInit, ViewChild} from '@angular/core';
import { IonTextarea, IonContent } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {
  @ViewChild(IonContent, {static: false}) content: IonContent;
  @ViewChild('.commentinput', {static: false}) messageInput: IonTextarea;
  message: any = []; comments: any; requestcode: any; nodata: boolean; userid: any; username: any; istyping: boolean;

  constructor(private api: ApiService, private route: ActivatedRoute) {
    this.nodata = false;
    this.userid = localStorage.getItem('USERID');
    this.username = localStorage.getItem('FULLNAME');
  }

  ngOnInit() {
    this.route.queryParams.subscribe((res: any) => {
      this.requestcode = this.api.decodePayload(res.package);
      console.log(this.requestcode);
      this.fetchComments(this.requestcode);
    });
    setTimeout(() => {
      this.content.scrollToBottom(400);
    }, 100);
  }

  fetchComments(requestcode: string) {
    const action = '&actions=fetchcomments';
    const data = '&requestcode=' + requestcode;
    this.api.postData(action, data).then((res: any) => {
      const arr = Array.isArray(res.data);
      if (arr) {
        this.message = res.data;
        this.nodata = false;
      } else {
        this.nodata = true;
      }
      console.log(this.message);
    });
  }

  saveComments(params: any) {
    this.istyping = true;
    if (params.comments) {
      const action = '&actions=savecomments';
      const data = '&requestcode=' + this.requestcode + '&comment=' + params.comments + '&senderid=' + this.userid
      + '&sendername=' + this.username;
      this.api.postData(action, data).then((res: any) => {
        if (res.data === 'done') {
          this.istyping = false;
          this.fetchComments(this.requestcode);
          this.content.scrollToBottom(400);
          this.comments = '';
          this.api.adjustTextarea('');
        } else {
          this.api.systemError('Error submitting comment, check your network and try again');
        }
      });
    } else {
      console.log('empty text area');
    }
  }

  focus() {
    if (this.content.scrollToBottom) {
      this.content.scrollToBottom(400);
    }
  }

  typing() {
    this.nodata = false;
    this.istyping = true;
    setTimeout(() => {
      this.istyping = false;
    }, 1000);
  }

}
