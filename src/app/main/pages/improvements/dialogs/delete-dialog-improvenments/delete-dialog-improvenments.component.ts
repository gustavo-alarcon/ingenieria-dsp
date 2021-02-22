import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Improvement } from 'src/app/main/models/improvenents.model';
import { ImprovementsService } from 'src/app/main/services/improvements.service';

@Component({
  selector: 'app-delete-dialog-improvenments',
  templateUrl: './delete-dialog-improvenments.component.html',
  styleUrls: ['./delete-dialog-improvenments.component.scss']
})
export class DeleteDialogImprovenmentsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Improvement[],
    private impServices: ImprovementsService,
    public dialogRef: MatDialogRef<DeleteDialogImprovenmentsComponent>,
    private snackbar: MatSnackBar,
  ) {
  }
  ngOnInit(): void {
  }

  async deteteImprovenment(): Promise<void> {
    try {
      await this.impServices.removeImprovementFef(this.data['id']);
      this.dialogRef.close('result');

      this.snackbar.open('✅ Registro borrado correctamente', 'Aceptar', {
        duration: 6000
      });
    } catch (error) {
      this.snackbar.open('✅ Error al borrar el registro', 'Aceptar', {
        duration: 6000
      });
    }
  }

}
