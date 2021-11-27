import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InitPage } from './init.page';
import { InitRouter } from './init.router';

const routes: Routes = [
  {
    path: '',
    component: InitPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InitRouter
  ],
  declarations: [InitPage]
})
export class InitPageModule {}
