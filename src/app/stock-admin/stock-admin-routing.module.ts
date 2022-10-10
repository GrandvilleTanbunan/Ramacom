import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockAdminPage } from './stock-admin.page';

const routes: Routes = [
  {
    path: '',
    component: StockAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockAdminPageRoutingModule {}
