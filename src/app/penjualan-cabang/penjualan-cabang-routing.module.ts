import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PenjualanCabangPage } from './penjualan-cabang.page';

const routes: Routes = [
  {
    path: '',
    component: PenjualanCabangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PenjualanCabangPageRoutingModule {}
