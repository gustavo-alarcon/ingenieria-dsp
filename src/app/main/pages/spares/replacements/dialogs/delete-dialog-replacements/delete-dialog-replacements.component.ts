import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Replacement } from 'src/app/main/models/replacements.models';
import { ReplacementsService } from 'src/app/main/services/replacements.service';

@Component({
  selector: 'app-delete-dialog-replacements',
  templateUrl: './delete-dialog-replacements.component.html',
  styleUrls: ['./delete-dialog-replacements.component.sass']
})
export class DeleteDialogReplacementsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Replacement,
    private repServices: ReplacementsService,
    public dialogRef: MatDialogRef<DeleteDialogReplacementsComponent>,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  async deteteReplacement(): Promise<void> {
    try {
      // tslint:disable-next-line: no-string-literal
      await this.repServices.removeImprovementFef(this.data['id']);
      this.dialogRef.close('result');

      this.snackbar.open('🗑️ Reemplazo borrado correctamente', 'Aceptar', {
        duration: 6000
      });
    } catch (error) {
      this.snackbar.open('🚨 Error al borrar el reemplazo', 'Aceptar', {
        duration: 6000
      });
    }
  }

}
