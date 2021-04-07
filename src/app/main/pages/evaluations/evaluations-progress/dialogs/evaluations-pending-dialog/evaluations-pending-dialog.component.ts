import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Evaluation } from 'src/app/main/models/evaluations.model';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';

@Component({
  selector: 'app-evaluations-pending-dialog',
  templateUrl: './evaluations-pending-dialog.component.html',
  styleUrls: ['./evaluations-pending-dialog.component.sass']
})
export class EvaluationsPendingDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  statusToUpdate = '';

  constructor(
    private dialogRef: MatDialogRef<EvaluationsPendingDialogComponent>,
    private snackbar: MatSnackBar,
    private evalService: EvaluationsService,
    @Inject(MAT_DIALOG_DATA) private data: Evaluation
  ) { }

  ngOnInit(): void {
    this.statusToUpdate = this.data.internalStatus === 'pending' ? 'processed' : 'pending';
  }

  activatePending(): void {
    this.evalService.activatePending(this.data.id, this.statusToUpdate)
      .pipe(
        take(1)
      )
      .subscribe(batch => {
        if (batch) {
          batch.commit()
            .then(() => {
              this.loading.next(false);
              this.snackbar.open('✅ Estado PENDIENTE actualizado!', 'Aceptar', {
                duration: 6000
              });
              this.dialogRef.close('true');
            })
            .catch(err => {
              console.log(err);
              this.loading.next(false);
              this.snackbar.open('🚨 Parece que hubo un error actualizando el estado! Vuelva a intentarlo.', 'Aceptar', {
                duration: 6000
              });
            })
        }
      })
  }

}
