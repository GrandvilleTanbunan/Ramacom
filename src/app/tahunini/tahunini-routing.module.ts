import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TahuniniPage } from './tahunini.page';

const routes: Routes = [
  {
    path: '',
    component: TahuniniPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TahuniniPageRoutingModule {}
