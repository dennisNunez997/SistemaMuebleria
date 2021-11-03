import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProdPage } from './edit-prod.page';

const routes: Routes = [
  {
    path: '',
    component: EditProdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProdPageRoutingModule {}
