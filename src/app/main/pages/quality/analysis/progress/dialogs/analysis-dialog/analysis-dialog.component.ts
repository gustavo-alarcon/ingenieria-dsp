import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Quality } from 'src/app/main/models/quality.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-analysis-dialog',
  templateUrl: './analysis-dialog.component.html',
  styleUrls: ['./analysis-dialog.component.scss']
})
export class AnalysisDialogComponent implements OnInit {
  analysisForm: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AnalysisDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality

  ) { }
  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void{
    this.analysisForm = this.fb.group({
      causeFailure: ['', Validators.required],
      process: ['', Validators.required],
      quality : ['', Validators.required],
      cost : ['', Validators.required],
      frequency: ['', Validators.required]
    });

  }
  save(): void{
    
  }


}
