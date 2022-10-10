import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockCabangPage } from './stock-cabang.page';

const routes: Routes = [
  {
    path: '',
    component: StockCabangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockCabangPageRoutingModule {}
