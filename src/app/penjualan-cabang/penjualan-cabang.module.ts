import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PenjualanCabangPageRoutingModule } from './penjualan-cabang-routing.module';

import { PenjualanCabangPage } from './penjualan-cabang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PenjualanCabangPageRoutingModule
  ],
  declarations: [PenjualanCabangPage]
})
export class PenjualanCabangPageModule {}
