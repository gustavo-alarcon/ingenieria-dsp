import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImprovementsRoutingModule } from './improvements-routing.module';
import { ImprovementsComponent } from './improvements.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateDialogImprovenmentsComponent } from './dialogs/create-dialog-improvenments/create-dialog-improvenments.component';
import { EditDialogImprovenmentsComponent } from './dialogs/edit-dialog-improvenments/edit-dialog-improvenments.component';
import { DeleteDialogImprovenmentsComponent } from './dialogs/delete-dialog-improvenments/delete-dialog-improvenments.component';
import { ValidateDialogImprovenmentsComponent } from './dialogs/validate-dialog-improvenments/validate-dialog-improvenments.component';


@NgModule({
  declarations: [
    ImprovementsComponent,
    CreateDialogImprovenmentsComponent,
    EditDialogImprovenmentsComponent,
    DeleteDialogImprovenmentsComponent,
    ValidateDialogImprovenmentsComponent,
  ],
  exports: [
    ImprovementsComponent,
  ],
  imports: [
    CommonModule,
    ImprovementsRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class ImprovementsModule { }
