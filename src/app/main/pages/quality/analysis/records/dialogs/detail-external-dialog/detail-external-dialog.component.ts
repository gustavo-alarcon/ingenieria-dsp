import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    public dialogRef: MatDialogRef<DetailExternalDialogComponent>,
    private qualityService: QualityService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }
  save(): void{
    
  }

}
