import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProdPageRoutingModule } from './edit-prod-routing.module';

import { EditProdPage } from './edit-prod.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProdPageRoutingModule
  ],
  declarations: [EditProdPage]
})
export class EditProdPageModule {}
