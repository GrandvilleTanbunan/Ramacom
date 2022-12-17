import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EdithargaPageRoutingModule } from './editharga-routing.module';

import { EdithargaPage } from './editharga.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EdithargaPageRoutingModule
  ],
  declarations: [EdithargaPage]
})
export class EdithargaPageModule {}
