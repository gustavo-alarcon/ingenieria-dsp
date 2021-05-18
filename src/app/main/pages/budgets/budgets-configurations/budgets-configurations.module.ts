import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetsConfigurationsRoutingModule } from './budgets-configurations-routing.module';
import { BudgetsConfigurationsComponent } from './budgets-configurations.component';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from 'src/app/material/material.module';
import { AddGroupDialogComponent } from './dialogs/add-group-dialog/add-group-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetsConfigurationsComponent,
  },
];

@NgModule({
  declarations: [BudgetsConfigurationsComponent, AddGroupDialogComponent],
  imports: [
    CommonModule,
    BudgetsConfigurationsRoutingModule,
    RouterModule.forChild(routes),
    MaterialModule,
  ],
  exports: [RouterModule],
})
export class BudgetsConfigurationsModule {}
