import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ImprovementsService } from 'src/app/main/services/improvements.service';

@Component({
  selector: 'app-delete-spare-part-dialog',
  templateUrl: './delete-spare-part-dialog.component.html',
  styleUrls: ['./delete-spare-part-dialog.component.sass']
})
export class DeleteSparePartDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    private impService: ImprovementsService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: string
  ) { }

  ngOnInit(): void {
  }

  delete() {
    this.loading.next(true);

    this.impService.removeImprovement(this.data)
      .pipe(
        take(1)
      ).subscribe(batch => {
        if (batch) {
          batch.commit()
            .then(() => {
              this.loading.next(false);
              this.snackbar.open('🗑️ Elemento removido!', 'Aceptar', {
                duration: 6000
              });
            })
            .catch(err => {
              console.log(err);
              this.loading.next(false);
              this.snackbar.open('🚨 Hubo un error guardando las mejoras!', 'Aceptar', {
                duration: 6000
              });
            });
        }
      });
  }

}
