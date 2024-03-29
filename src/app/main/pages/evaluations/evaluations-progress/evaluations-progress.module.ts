import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationsProgressRoutingModule } from './evaluations-progress-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { EvaluationsProgressComponent } from './evaluations-progress.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EvaluationsSettingsDialogComponent } from './dialogs/evaluations-settings-dialog/evaluations-settings-dialog.component';
import { EvaluationsFinalizeDialogComponent } from './dialogs/evaluations-finalize-dialog/evaluations-finalize-dialog.component';
import { EvaluationsImagesDialogComponent } from './dialogs/evaluations-images-dialog/evaluations-images-dialog.component';
import { EvaluationsTimeLineDialogComponent } from './dialogs/evaluations-time-line-dialog/evaluations-time-line-dialog.component';
// tslint:disable-next-line: max-line-length
import { EvaluationsObservationsDialogComponent } from './dialogs/evaluations-observations-dialog/evaluations-observations-dialog.component';
import { EvaluationsConsultsDialogComponent } from './dialogs/evaluations-consults-dialog/evaluations-consults-dialog.component';
import { EvaluationsResponseDialogComponent } from './dialogs/evaluations-response-dialog/evaluations-response-dialog.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { EvaluationsPendingDialogComponent } from './dialogs/evaluations-pending-dialog/evaluations-pending-dialog.component';


@NgModule({
  declarations: [
    EvaluationsProgressComponent,
    EvaluationsSettingsDialogComponent,
    EvaluationsFinalizeDialogComponent,
    EvaluationsImagesDialogComponent,
    EvaluationsTimeLineDialogComponent,
    EvaluationsObservationsDialogComponent,
    EvaluationsConsultsDialogComponent,
    EvaluationsResponseDialogComponent,
    EvaluationsPendingDialogComponent,
  ],
  exports: [
    EvaluationsProgressComponent
  ],
  imports: [
    CommonModule,
    EvaluationsProgressRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2ImgMaxModule,
    LazyLoadImageModule,
    ComponentsModule
  ]
})
export class EvaluationsProgressModule { }
