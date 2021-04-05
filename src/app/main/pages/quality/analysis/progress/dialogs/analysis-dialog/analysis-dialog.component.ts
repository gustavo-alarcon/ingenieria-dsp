import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
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
  
  category$: Observable<string[]>

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AnalysisDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality

  ) { }
  ngOnInit(): void {
    this.initForm();

    /* this.category$ = combineLatest(
      this.productForm.get('category').valueChanges.pipe(
        startWith(''),
        map(name => name ? name : '')),
      this.dbs.getProductsListCategoriesValueChanges()
    ).pipe(map( ([formValue, categories]) => {
      let filter = categories.filter(el => formValue ? el.toLowerCase().includes(formValue.toLowerCase()) : true);
      if (!(filter.length == 1 && filter[0] === formValue) && formValue.length) {
        this.productForm.get('category').setErrors({ invalid: true });
      }
      return filter;
      }
     )) */


  }

  initForm(): void{
    this.analysisForm = this.fb.group({
      causeFailure: ['', Validators.required],
      process: ['', Validators.required],
      quality : ['', Validators.required],
      cost : ['', Validators.required],
      category : ['', Validators.required],
      frequency: ['', Validators.required]
    });

  }
  save(): void{
    
  }
  onAddCategory() {
   /*  this.dialog.open(ProductConfigCategoriesComponent); */
  }


}
