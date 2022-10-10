import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockAdminPageRoutingModule } from './stock-admin-routing.module';

import { StockAdminPage } from './stock-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockAdminPageRoutingModule
  ],
  declarations: [StockAdminPage]
})
export class StockAdminPageModule {}
