import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Evaluation } from '../../../../../models/evaluations.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationsService } from '../../../../../services/evaluations.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-requests-start-dialog',
  templateUrl: './requests-start-dialog.component.html',
  styleUrls: ['./requests-start-dialog.component.sass'],
})
export class RequestsStartDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<RequestsStartDialogComponent>,
    private snackbar: MatSnackBar,
    private evaltService: EvaluationsService,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {}
  save(): void {
    try {
      const state = 'processed';
      this.evaltService
        .startRequest(this.data.id, state)
        .pipe(take(1))
        .subscribe((res) => {
          res.commit().then(() => {
            this.dialogRef.close('result');
            this.snackbar.open('✅ Se actualizo correctamente', 'Aceptar', {
              duration: 6000,
            });
          });
        });
      // tslint:disable-next-line: no-string-literal
    } catch (error) {
      this.snackbar.open('🚨 Error al actualizar', 'Aceptar', {
        duration: 6000,
      });
    }
  }
}
