import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationsService } from '../../../../../services/evaluations.service';
import { EvaluationBroadcastList } from '../../../../../models/evaluations.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-delete-broadcast-dialog',
  templateUrl: './delete-broadcast-dialog.component.html',
  styleUrls: ['./delete-broadcast-dialog.component.scss']
})
export class DeleteBroadcastDialogComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  constructor(
          public dialogRef: MatDialogRef<DeleteBroadcastDialogComponent>,
          @Inject(MAT_DIALOG_DATA) public data: EvaluationBroadcastList,
          private evalService: EvaluationsService,
          private snackbar: MatSnackBar,
    ) {}

  ngOnInit(): void {}

  deleteBroadcastList(): void {
    try {
      this.loading.next(false);

      this.evalService.deleteListBroadcast(this.data.id).pipe(take(1)
        ).subscribe(batch => {
          batch.commit()
            .then(() => {
              this.dialogRef.close('result');

              this.snackbar.open('✅ Registro borrado correctamente', 'Aceptar', {
                duration: 6000
              });
              this.loading.next(true);
            });
        });

    } catch (error) {
      this.snackbar.open('✅ Error al borrar el registro', 'Aceptar', {
        duration: 6000
      });
    }
  }

}
