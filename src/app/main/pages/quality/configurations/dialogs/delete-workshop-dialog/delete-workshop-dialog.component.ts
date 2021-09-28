import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WorkshopModel } from '../../../../../models/workshop.model';
import { QualityService } from '../../../../../services/quality.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-delete-workshop-dialog',
  templateUrl: './delete-workshop-dialog.component.html',
  styleUrls: ['./delete-workshop-dialog.component.scss'],
})
export class DeleteWorkshopDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    public dialogRef: MatDialogRef<DeleteWorkshopDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkshopModel,
    private qualityService: QualityService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  deleteWorkshop(): void {
    try {
      this.loading.next(false);

      this.qualityService
        .deleteWorkshop(this.data.id)
        .pipe(take(1))
        .subscribe((batch) => {
          batch.commit().then(() => {
            this.dialogRef.close('result');

            this.snackbar.open('✅ Registro borrado correctamente', 'Aceptar', {
              duration: 6000,
            });
            this.loading.next(true);
          });
        });
    } catch (error) {
      this.snackbar.open('✅ Error al borrar el registro', 'Aceptar', {
        duration: 6000,
      });
    }
  }
}
