import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StocklainPageRoutingModule } from './stocklain-routing.module';

import { StocklainPage } from './stocklain.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StocklainPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [StocklainPage]
})
export class StocklainPageModule {}
