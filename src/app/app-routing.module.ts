import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'init', pathMatch: 'full' },
  {
    path: 'init',
    loadChildren: () => import('./init/init.module').then(m => m.InitPageModule)
  },
  {
    path: 'index',
    loadChildren: () => import('./index/index.module').then(m => m.IndexPageModule)
  },
  { path: 'countrymodal', loadChildren: './public/countrymodal/countrymodal.module#CountrymodalPageModule' },
  { path: 'packagesmodal', loadChildren: './public/packagesmodal/packagesmodal.module#PackagesmodalPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
