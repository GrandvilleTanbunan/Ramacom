import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DaftarhargaPageRoutingModule } from './daftarharga-routing.module';

import { DaftarhargaPage } from './daftarharga.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DaftarhargaPageRoutingModule
  ],
  declarations: [DaftarhargaPage]
})
export class DaftarhargaPageModule {}
