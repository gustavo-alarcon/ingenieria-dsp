import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Quality } from 'src/app/main/models/quality.model';

@Component({
  selector: 'app-detail-internal-dialog',
  templateUrl: './detail-internal-dialog.component.html',
  styleUrls: ['./detail-internal-dialog.component.scss']
})
export class DetailInternalDialogComponent implements OnInit {
  detailFormGroup: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  imagesGeneral = [];
  imagesDetail = [];
  nameFile: string;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    public dialogRef: MatDialogRef<DetailInternalDialogComponent>,  
  ) { }

  ngOnInit(): void {
    this.imagesGeneral = Object.values(this.data.generalImages);
    this.imagesDetail = Object.values(this.data.detailImages);
    this.nameFile =  this.data.file;

    this.initForm();
  }

  initForm(): void{
    this.detailFormGroup = this.fb.group({
      enventDetail: [this.data.enventDetail, Validators.required],
    });
  }

}
