import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-history-create-dialog',
  templateUrl: './history-create-dialog.component.html',
  styleUrls: ['./history-create-dialog.component.scss']
})
export class HistoryCreateDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  createEvaluateForm: FormGroup;

  subscriptions: Subscription = new Subscription();

  indexAux: number[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HistoryCreateDialogComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.createForm();
  }
  createForm(): void{
    this.createEvaluateForm = this.fb.group({
      workOrder: ['', Validators.required],
      operation: ['', Validators.required],
      correlative: ['', Validators.required],
      nPart: ['', Validators.required],
      description: ['', Validators.required],
      state: ['', Validators.required],
      result: ['', Validators.required],
      observations: ['', Validators.required],
      quantity: ['', Validators.required],
      workshop: ['', Validators.required],
      workshopAttention: ['', Validators.required],
      applicationDate: ['', Validators.required],
    });
  }
  save(){

  }

}
