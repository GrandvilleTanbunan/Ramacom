import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockCabangPageRoutingModule } from './stock-cabang-routing.module';

import { StockCabangPage } from './stock-cabang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockCabangPageRoutingModule
  ],
  declarations: [StockCabangPage]
})
export class StockCabangPageModule {}
