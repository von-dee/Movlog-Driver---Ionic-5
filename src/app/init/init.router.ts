import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitPage } from './init.page';

const routes: Routes = [{
    path: '',
    component: InitPage,
    children: [
        {
            path: '',
            // loadChildren: () => import('../auth/welcome/welcome.module').then(m => m.WelcomePageModule)
            loadChildren: () => import('../auth/login/login.module').then(m => m.LoginPageModule)
        }, {
            path: 'login',
            loadChildren: () => import('../auth/login/login.module').then(m => m.LoginPageModule)
        }, {
            path: 'register',
            loadChildren: () => import('../auth/register/register.module').then(m => m.RegisterPageModule)
        }, {
            path: 'client',
            loadChildren: () => import('../auth/client/client.module').then(m => m.ClientPageModule)
        }, {
            path: 'artisan',
            loadChildren: () => import('../auth/artisan/artisan.module').then(m => m.ArtisanPageModule)
        }, {
            path: 'merchant',
            loadChildren: () => import('../auth/merchant/merchant.module').then(m => m.MerchantPageModule)
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class InitRouter {}
