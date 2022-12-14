import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DaftarhargaPage } from './daftarharga.page';

const routes: Routes = [
  {
    path: '',
    component: DaftarhargaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DaftarhargaPageRoutingModule {}
