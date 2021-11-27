import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPage } from './index.page';
import { AuthGuardService } from '../services/auth-guard.service';

const routes: Routes = [{
  path: '',
  component: IndexPage,
  canActivate : [AuthGuardService],
  children: [
    {
    path: 'home',
    children: [
      {
        path: '',
        loadChildren: () =>
        import('../public/home/home.module').then(m => m.HomePageModule)
        // import('../public/searching/searching.module').then(m => m.SearchingPageModule)
      }, {
        path: 'chat',
        loadChildren: () =>
        import('../public/chat/chat.module').then(m => m.ChatPageModule)
      }, {
        path: 'comments',
        loadChildren: () =>
        import('../public/comments/comments.module').then(m => m.CommentsPageModule)
      }, {
        path: 'profile',
        loadChildren: () =>
        import('../public/profile/profile.module').then(m => m.ProfilePageModule)
      }, {
        path: 'mybids',
        loadChildren: () =>
        import('../public/mybids/mybids.module').then(m => m.MybidsPageModule)
      }, {
        path: 'request-detail',
        loadChildren: () =>
          import('../public/request-detail/request-detail.module').then(m => m.RequestDetailPageModule)
        }, {
        path: 'settings',
        loadChildren: () =>
        import('../public/settings/settings.module').then(m => m.SettingsPageModule)
      }, {
        path: 'service-request',
        loadChildren: () =>
        import('../public/service-request/service-request.module').then(m => m.ServiceRequestPageModule)
      }, {
        path: 'search',
        loadChildren: () =>
        import('../public/search/search.module').then(m => m.SearchPageModule)
      }, {
        path: 'searching',
        loadChildren: () =>
        import('../public/searching/searching.module').then(m => m.SearchingPageModule)
      }, {
        path: 'request-response',
        loadChildren: () =>
        import('../public/request-response/request-response.module').then(m => m.RequestResponsePageModule)
      }
    ]
  }, {
    path: 'mybids',
    loadChildren: () =>
    import('../public/mybids/mybids.module').then(m => m.MybidsPageModule)
  }, {
    path: 'notification',
    loadChildren: () =>
    import('../public/notification/notification.module').then(m => m.NotificationPageModule)
  }, {
    path: 'service-request',
    children: [
      {
      path: '',
      loadChildren: () =>
        import('../public/service-request/service-request.module').then(m => m.ServiceRequestPageModule)
      }, {
        path: 'request-detail',
        loadChildren: () =>
          import('../public/request-detail/request-detail.module').then(m => m.RequestDetailPageModule)
        }
    ]
  }, {
    path: 'history',
    children: [
      {
      path: '',
      loadChildren: () =>
        import('../public/history/history.module').then(m => m.HistoryPageModule)
      }, {
        path: 'request-detail',
        loadChildren: () =>
          import('../public/request-detail/request-detail.module').then(m => m.RequestDetailPageModule)
        }, {
          path: 'request-response',
          loadChildren: () =>
          import('../public/request-response/request-response.module').then(m => m.RequestResponsePageModule)
        }
    ]
  }, {
    path: 'profile',
    children: [
      {
      path: '',
      loadChildren: () =>
      import('../public/profile/profile.module').then(m => m.ProfilePageModule)
      }
    ]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRouter {}
