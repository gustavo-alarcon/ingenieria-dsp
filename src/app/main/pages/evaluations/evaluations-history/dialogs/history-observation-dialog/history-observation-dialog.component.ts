import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Evaluation } from '../../../../../models/evaluations.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationsService } from '../../../../../../auth/services/evaluations.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

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
      area: ['', Validators.required],
    });
  }

}
