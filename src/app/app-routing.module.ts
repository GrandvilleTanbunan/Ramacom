import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import {canActivate, redirectUnauthorizedTo, redirectLoggedInTo} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['stock-admin']);


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome)
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
    loadChildren: () => import('./stock-admin/stock-admin.module').then( m => m.StockAdminPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  
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
  },
  {
    path: 'kategori',
    loadChildren: () => import('./kategori/kategori.module').then( m => m.KategoriPageModule)
  },
  {
    path: 'daftarharga',
    loadChildren: () => import('./daftarharga/daftarharga.module').then( m => m.DaftarhargaPageModule)
  },
  {
    path: 'pengaturan',
    loadChildren: () => import('./pengaturan/pengaturan.module').then( m => m.PengaturanPageModule)
  },
  {
    path: 'editharga',
    loadChildren: () => import('./editharga/editharga.module').then( m => m.EdithargaPageModule)
  },
  {
    path: 'stocklain',
    loadChildren: () => import('./stocklain/stocklain.module').then( m => m.StocklainPageModule)
  },  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
