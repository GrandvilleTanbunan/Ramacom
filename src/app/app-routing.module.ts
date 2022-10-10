import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'stock-admin',
    loadChildren: () => import('./stock-admin/stock-admin.module').then( m => m.StockAdminPageModule)
  },
  {
    path: 'stock-cabang',
    loadChildren: () => import('./stock-cabang/stock-cabang.module').then( m => m.StockCabangPageModule)
  },
  {
    path: 'penjualan-admin',
    loadChildren: () => import('./penjualan-admin/penjualan-admin.module').then( m => m.PenjualanAdminPageModule)
  },
  {
    path: 'penjualan-cabang',
    loadChildren: () => import('./penjualan-cabang/penjualan-cabang.module').then( m => m.PenjualanCabangPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
