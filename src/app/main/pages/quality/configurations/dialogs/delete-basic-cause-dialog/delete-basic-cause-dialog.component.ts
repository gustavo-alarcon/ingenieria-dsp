import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { BasicCause } from 'src/app/main/models/workshop.model';
import { QualityService } from 'src/app/main/services/quality.service';

@Component({
  selector: 'app-delete-basic-cause-dialog',
  templateUrl: './delete-basic-cause-dialog.component.html',
  styleUrls: ['./delete-basic-cause-dialog.component.scss'],
})
export class DeleteBasicCauseDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    public dialogRef: MatDialogRef<DeleteBasicCauseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BasicCause,
    private qualityService: QualityService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  deleteImmediateCause(): void {
    try {
      this.loading.next(false);

      this.qualityService
        .deleteImmediateCause(this.data.id)
        .pipe(take(1))
        .subscribe((batch) => {
          batch.commit().then(() => {
            this.snackbar.open('✅ Registro borrado correctamente', 'Aceptar', {
              duration: 6000,
            });
            this.loading.next(true);
            this.dialogRef.close('result');
          });
        });
    } catch (error) {
      this.snackbar.open('✅ Error al borrar el registro', 'Aceptar', {
        duration: 6000,
      });
    }
  }
}
