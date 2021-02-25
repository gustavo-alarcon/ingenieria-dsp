import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EvaluationsConsultsDialogComponent } from './dialogs/evaluations-consults-dialog/evaluations-consults-dialog.component';
import { EvaluationsFinalizeDialogComponent } from './dialogs/evaluations-finalize-dialog/evaluations-finalize-dialog.component';
import { EvaluationsImagesDialogComponent } from './dialogs/evaluations-images-dialog/evaluations-images-dialog.component';
import { EvaluationsResponseDialogComponent } from './dialogs/evaluations-response-dialog/evaluations-response-dialog.component';
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

  imagesDialog(): void {
    this.dialog.open(EvaluationsImagesDialogComponent, {
      width: '35%',
      height: '90%'
    });
  }

  consultDialog(): void {
    this.dialog.open(EvaluationsConsultsDialogComponent, {
      width: '35%',
      height: '90%'
    });
  }

  responseDialog():void{
    this.dialog.open(EvaluationsResponseDialogComponent, {
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
