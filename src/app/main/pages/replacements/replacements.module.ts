import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReplacementsRoutingModule } from './replacements-routing.module';
import { ReplacementsComponent } from './replacements.component';
import { MaterialModule } from 'src/app/material/material.module';
import { CreateDialogReplacementsComponent } from './dialogs/create-dialog-replacements/create-dialog-replacements.component';
import { EditDialogReplacementsComponent } from './dialogs/edit-dialog-replacements/edit-dialog-replacements.component';
import { DeleteDialogReplacementsComponent } from './dialogs/delete-dialog-replacements/delete-dialog-replacements.component';


@NgModule({
  declarations: [
    ReplacementsComponent,
    CreateDialogReplacementsComponent,
    EditDialogReplacementsComponent,
    DeleteDialogReplacementsComponent
  ],
  imports: [
    CommonModule,
    ReplacementsRoutingModule,
    MaterialModule
  ]
})
export class ReplacementsModule { }
