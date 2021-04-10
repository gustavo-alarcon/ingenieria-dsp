import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Quality } from '../../../../../../models/quality.model';
import { QualityService } from 'src/app/main/services/quality.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.sass']
})
export class DeleteDialogComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    private qualityService: QualityService,
    private snackbar: MatSnackBar,

  ) { }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  save(): void{
    try {
      if (this.data.id) {
        const resp = this.qualityService.deleteQuality(
          this.data.id
        );
        this.subscription.add(
          resp.subscribe((batch) => {
            if (batch) {
              batch
                .commit()
                .then(() => {
                  this.snackbar.open('✅ Se borro correctamente !', 'Aceptar', {
                    duration: 6000,
                  });
                  this.dialogRef.close(false);
                })
                .catch((err) => {
                  this.snackbar.open(
                    '🚨 Hubo un error !',
                    'Aceptar',
                    {
                      duration: 6000,
                    }
                  );
                });
            }
          })
        );
      }
    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }
  }

}
