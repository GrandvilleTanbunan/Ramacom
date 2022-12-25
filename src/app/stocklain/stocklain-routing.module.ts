import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StocklainPage } from './stocklain.page';

const routes: Routes = [
  {
    path: '',
    component: StocklainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StocklainPageRoutingModule {}
