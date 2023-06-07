import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TahuniniPageRoutingModule } from './tahunini-routing.module';

import { TahuniniPage } from './tahunini.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TahuniniPageRoutingModule
  ],
  declarations: [TahuniniPage]
})
export class TahuniniPageModule {}
