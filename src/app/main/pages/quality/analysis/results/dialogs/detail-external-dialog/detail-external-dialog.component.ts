import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Quality } from 'src/app/main/models/quality.model';
import { QualityService } from '../../../../../../services/quality.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-detail-external-dialog',
  templateUrl: './detail-external-dialog.component.html',
  styleUrls: ['./detail-external-dialog.component.scss']
})
export class DetailExternalDialogComponent implements OnInit {
  detailFormGroup: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  imagesGeneral: any  = [];
  imagesDetail: any = [];
  urlFile: string;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    public dialogRef: MatDialogRef<DetailExternalDialogComponent>,  
  ) { }

  ngOnInit(): void {
    this.imagesGeneral = this.data.generalImages;
    this.imagesDetail = this.data.detailImages;

    this.urlFile =  this.data.file;
    this.initForm();
  }

  initForm(): void{
    this.detailFormGroup = this.fb.group({
      specialist: [this.data.specialist['name'], Validators.required],
      question1: [this.data.question1, Validators.required],
      question2: [this.data.question2, Validators.required],
      question3: [this.data.question3, Validators.required],
      question4: [this.data.question4, Validators.required],
    });
  }
}