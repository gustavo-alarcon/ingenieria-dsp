import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgressRoutingModule } from './progress-routing.module';
import { ProgressComponent } from './progress.component';
import { MaterialModule } from '../../../../../material/material.module';
import { TimeLineDialogComponent } from './dialogs/time-line-dialog/time-line-dialog.component';
import { AccCorrectiveDialogComponent } from './dialogs/acc-corrective-dialog/acc-corrective-dialog.component';
import { ConfigurationsDialogComponent } from './dialogs/configurations-dialog/configurations-dialog.component';
import { DetailInternalDialogComponent } from './dialogs/detail-internal-dialog/detail-internal-dialog.component';
import { DetailExternalDialogComponent } from './dialogs/detail-external-dialog/detail-external-dialog.component';
import { AnalysisDialogComponent } from './dialogs/analysis-dialog/analysis-dialog.component';
import { CauseFailureDialogComponent } from './dialogs/cause-failure-dialog/cause-failure-dialog.component';
import { ProcessDialogComponent } from './dialogs/process-dialog/process-dialog.component';

@NgModule({
  declarations: [
    ProgressComponent,
    TimeLineDialogComponent,
    AccCorrectiveDialogComponent,
    ConfigurationsDialogComponent,
    DetailInternalDialogComponent,
    DetailExternalDialogComponent,
    AnalysisDialogComponent,
    CauseFailureDialogComponent,
    ProcessDialogComponent,
  ],
  imports: [CommonModule, ProgressRoutingModule, MaterialModule],
})
export class ProgressModule {}
