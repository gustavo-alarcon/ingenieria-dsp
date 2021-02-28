import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationsService } from '../../../../../services/evaluations.service';
import { Evaluation } from '../../../../../models/evaluations.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-history-delete-dialog',
  templateUrl: './history-delete-dialog.component.html',
  styleUrls: ['./history-delete-dialog.component.sass']
})
export class HistoryDeleteDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<HistoryDeleteDialogComponent>,
    private snackbar: MatSnackBar,
    private evaltService: EvaluationsService,
  ) { }

  ngOnInit(): void {
  }

  deteteEvaluation(): void {
    try {
      this.loading.next(false);

      this.evaltService.removeEvaluation(this.data['id'])
        .pipe(
          take(1)
        ).subscribe(batch => {
          batch.commit()
            .then(() => {
              this.dialogRef.close('result');

              this.snackbar.open('✅ Registro borrado correctamente', 'Aceptar', {
                duration: 6000
              });
              this.loading.next(true);
            })
        })

    } catch (error) {
      this.snackbar.open('✅ Error al borrar el registro', 'Aceptar', {
        duration: 6000
      });
    }
  }

}
