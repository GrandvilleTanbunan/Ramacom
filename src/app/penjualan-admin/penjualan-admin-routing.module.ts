import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PenjualanAdminPage } from './penjualan-admin.page';

const routes: Routes = [
  {
    path: '',
    component: PenjualanAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PenjualanAdminPageRoutingModule {}
