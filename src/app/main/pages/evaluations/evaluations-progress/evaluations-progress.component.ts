import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestsSettingDialogComponent } from '../evaluations-requests/dialogs/requests-setting-dialog/requests-setting-dialog.component';

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
    this.dialog.open(RequestsSettingDialogComponent, {
      width: '35%',
    });
   }

}
