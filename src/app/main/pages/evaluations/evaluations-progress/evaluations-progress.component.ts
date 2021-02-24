import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestsObservationDialogComponent } from '../evaluations-requests/dialogs/requests-observation-dialog/requests-observation-dialog.component';
import { RequestsSettingDialogComponent } from '../evaluations-requests/dialogs/requests-setting-dialog/requests-setting-dialog.component';
import { RequestsStartDialogComponent } from '../evaluations-requests/dialogs/requests-start-dialog/requests-start-dialog.component';
import { RequestsTimeLineDialogComponent } from '../evaluations-requests/dialogs/requests-time-line-dialog/requests-time-line-dialog.component';
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
  settingDialog(): void{
    this.dialog.open(EvaluationsSettingsDialogComponent, {
      width: '35%',
    });
   }

  initDialog(): void{
    this.dialog.open(RequestsStartDialogComponent, {
      width: '35%',
    });
  }
  obsDialog(): void{
    this.dialog.open(RequestsObservationDialogComponent, {
      width: '35%',
    });
  }
  timeline(): void{
    this.dialog.open(RequestsTimeLineDialogComponent, {
      width: '90%',
    });
  }

}
