import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Andon } from 'src/app/main/models/andon.model';
import { AndonService } from '../../../../../services/andon.service';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  constructor(
          public dialogRef: MatDialogRef<DeleteDialogComponent>,
          @Inject(MAT_DIALOG_DATA) public data: Andon,
          private andonService: AndonService,
          private snackbar: MatSnackBar,
    ) {}

  ngOnInit(): void {}

  deleteAndon(): void {
    try {
      this.loading.next(false);

      this.andonService.removeAndon(this.data.id)
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
