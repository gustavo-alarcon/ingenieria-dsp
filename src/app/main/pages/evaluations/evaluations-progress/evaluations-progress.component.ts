import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Evaluation } from 'src/app/main/models/evaluations.model';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';

import { EvaluationsConsultsDialogComponent } from './dialogs/evaluations-consults-dialog/evaluations-consults-dialog.component';
import { EvaluationsFinalizeDialogComponent } from './dialogs/evaluations-finalize-dialog/evaluations-finalize-dialog.component';
import { EvaluationsImagesDialogComponent } from './dialogs/evaluations-images-dialog/evaluations-images-dialog.component';
// tslint:disable-next-line: max-line-length
import { EvaluationsObservationsDialogComponent } from './dialogs/evaluations-observations-dialog/evaluations-observations-dialog.component';
import { EvaluationsResponseDialogComponent } from './dialogs/evaluations-response-dialog/evaluations-response-dialog.component';
import { EvaluationsSettingsDialogComponent } from './dialogs/evaluations-settings-dialog/evaluations-settings-dialog.component';

@Component({
  selector: 'app-evaluations-progress',
  templateUrl: './evaluations-progress.component.html',
  styleUrls: ['./evaluations-progress.component.scss']
})
export class EvaluationsProgressComponent implements OnInit, OnDestroy {
  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  evaluations: Evaluation[] = [];
  subcription: Subscription = new Subscription();
  state = 'processed';

  constructor(
    public dialog: MatDialog,
    private evaluationServices: EvaluationsService
  ) { }


  ngOnInit(): void {
    this.subcription.add(
      this.evaluationServices.getAllEvaluationsByInternalStatus(this.state).subscribe((resp) => {
        this.evaluations = resp;
        this.loading.next(false);
      })
    );
  }

  settingDialog(): void {
    this.dialog.open(EvaluationsSettingsDialogComponent, {
      width: '35%',
    });
  }

  finalizeDialog(item: Evaluation): void {
    const dialogRef = this.dialog.open(EvaluationsFinalizeDialogComponent, {
      width: '35%',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  imagesDialog(item: Evaluation): void {
    const dialogRef = this.dialog.open(EvaluationsImagesDialogComponent, {
      width: '35%',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  consultDialog(item: Evaluation): void {
    const dialogRef = this.dialog.open(EvaluationsConsultsDialogComponent, {
      width: '35%',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  responseDialog(item: Evaluation): void {
    const dialogRef = this.dialog.open(EvaluationsResponseDialogComponent, {
      width: '35%',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  observationsDialog(): void {
    this.dialog.open(EvaluationsObservationsDialogComponent, {
      width: '35%',
    });
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

}
