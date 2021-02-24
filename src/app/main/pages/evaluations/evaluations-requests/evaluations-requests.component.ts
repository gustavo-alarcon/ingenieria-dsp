import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestsObservationDialogComponent } from '../dialogs/requests-observation-dialog/requests-observation-dialog.component';
import { RequestsSettingDialogComponent } from '../dialogs/requests-setting-dialog/requests-setting-dialog.component';
import { RequestsStartDialogComponent } from '../dialogs/requests-start-dialog/requests-start-dialog.component';
import { RequestsTimeLineDialogComponent } from '../dialogs/requests-time-line-dialog/requests-time-line-dialog.component';


@Component({
  selector: 'app-evaluations-requests',
  templateUrl: './evaluations-requests.component.html',
  styleUrls: ['./evaluations-requests.component.scss']
})
export class EvaluationsRequestsComponent implements OnInit {

  constructor(
             public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
  }
  settingDialog(): void{
    this.dialog.open(RequestsSettingDialogComponent, {
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
