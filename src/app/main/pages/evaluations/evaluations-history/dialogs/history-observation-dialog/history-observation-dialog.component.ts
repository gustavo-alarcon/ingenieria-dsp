import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Evaluation } from '../../../../../models/evaluations.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EvaluationsService } from '../../../../../services/evaluations.service';

@Component({
  selector: 'app-history-observation-dialog',
  templateUrl: './history-observation-dialog.component.html',
  styleUrls: ['./history-observation-dialog.component.scss']
})
export class HistoryObservationDialogComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  observationFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<HistoryObservationDialogComponent>,
    private snackbar: MatSnackBar,
    private  evaltService: EvaluationsService,
    ) { }

  ngOnInit(): void {
    this.observationFormGroup = this.fb.group({
      observation: ['', Validators.required],
    });
  }
  save(): void {

  }

  /* async save(): Promise<void> {
    try {
      const observation = this.observationFormGroup.get('observation').value;
      await this.evaltService.updateObservation(this.data , observation);
      // tslint:disable-next-line: no-string-literal
      this.dialogRef.close('result');

      this.snackbar.open('✅ Se actualizo correctamente', 'Aceptar', {
        duration: 6000
      });
    } catch (error) {
      this.snackbar.open('✅ Error al actualizar', 'Aceptar', {
        duration: 6000
      });
    }
  } */

}
