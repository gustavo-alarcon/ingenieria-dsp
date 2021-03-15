import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Evaluation } from '../../../../../models/evaluations.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationsService } from '../../../../../services/evaluations.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-requests-observation-dialog',
  templateUrl: './requests-observation-dialog.component.html',
  styleUrls: ['./requests-observation-dialog.component.scss']
})
export class RequestsObservationDialogComponent implements OnInit {
  
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  observationFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<RequestsObservationDialogComponent>,
    private snackbar: MatSnackBar,
    private  evaltService: EvaluationsService,
    ) { }

  ngOnInit(): void {
    this.observationFormGroup = this.fb.group({
      observation: [this.data.observations ? this.data.observations : null, Validators.required],
    });
  }
  save(): void {
    try {
      const observation = this.observationFormGroup.get('observation').value;
      this.evaltService
        .updateObservation(this.data.id, observation)
        .pipe(take(1))
        .subscribe((res) => {
          res.commit().then(() => {
            this.dialogRef.close('result');
            this.snackbar.open('✅ Se actualizo correctamente', 'Aceptar', {
              duration: 6000,
            });
          });
        });
    } catch (error) {
      this.snackbar.open('🚨 Error al actualizar', 'Aceptar', {
        duration: 6000,
      });
    }
  }

}
