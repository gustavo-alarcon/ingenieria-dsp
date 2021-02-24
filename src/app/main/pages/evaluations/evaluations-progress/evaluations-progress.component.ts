import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EvaluationsFinalizeDialogComponent } from './dialogs/evaluations-finalize-dialog/evaluations-finalize-dialog.component';
import { EvaluationsSettingsDialogComponent } from './dialogs/evaluations-settings-dialog/evaluations-settings-dialog.component';

@Component({
  selector: 'app-evaluations-progress',
  templateUrl: './evaluations-progress.component.html',
  styleUrls: ['./evaluations-progress.component.scss']
})
export class EvaluationsProgressComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  settingDialog(): void {
    this.dialog.open(EvaluationsSettingsDialogComponent, {
      width: '35%',
    });
  }

  finalizeDialog(): void {
    this.dialog.open(EvaluationsFinalizeDialogComponent, {
      width: '35%',
      height: '90%'
    });
  }

  // obsDialog(): void {
  //   this.dialog.open(RequestsObservationDialogComponent, {
  //     width: '35%',
  //   });
  // }
  // timeline(): void {
  //   this.dialog.open(RequestsTimeLineDialogComponent, {
  //     width: '90%',
  //   });
  // }

}
