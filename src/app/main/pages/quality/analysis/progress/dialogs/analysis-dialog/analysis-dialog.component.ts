import { Quality } from './../../../../../../models/quality.model';
import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { QualityBroadcastList } from '../../../../../../models/quality.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { QualityService } from '../../../../../../services/quality.service';
import { tap } from 'rxjs/operators';
import { CauseFailureDialogComponent } from '../cause-failure-dialog/cause-failure-dialog.component';
import { ProcessDialogComponent } from '../process-dialog/process-dialog.component';

@Component({
  selector: 'app-analysis-dialog',
  templateUrl: './analysis-dialog.component.html',
  styleUrls: ['./analysis-dialog.component.scss']
})
export class AnalysisDialogComponent implements OnInit {
  analysisForm: FormGroup;

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  
  category$: Observable<Quality[]>;
  //category$: Observable<string[]>;

  // step 1
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  // step 2
  listBahiasForm: FormGroup;

  // chips
  filteredBroadcast = [];
  emailArray: string[] = [];
  broadcastControl = new FormControl();
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredBroadcast$: Observable<QualityBroadcastList[]>;

  nameFileSelect;
  fileSelect;



  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AnalysisDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    private qualityService: QualityService,

  ) { }
  ngOnInit(): void {
    this.initForm();

    this.emailArray = Object.values(this.data.emailList['0']);
    
    this.filteredBroadcast$ = this.qualityService.getAllBroadcastList().pipe(
      tap((res: QualityBroadcastList[]) => {
        return res;
      })
    );

    this.category$ = this.qualityService.getAllQuality().pipe(
      tap(res => {

        console.log('categoria : ', res);
        const list = [];

        res.map(el => {
          list.push(el.causeFailureList);
        });
        console.log('list ', list)

      })
    );
   /*  this.category$ = this.qualityService.getAllCauseFailure().pipe(
      tap(res => {
        console.log('categoria : ', res);

      })
    ); */

    this.firstFormGroup = this.fb.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required]
    });

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

    this.listBahiasForm = this.fb.group({
      bahias: this.fb.array([
        this.fb.group({
          workShop: ['', Validators.required],
          name: ['', Validators.required],
        })
      ])
    });

  }
  get bahias(): FormArray {
    return this.listBahiasForm.get('bahias') as FormArray;
  }
  addControl(): void {
    const group = this.fb.group({
      workShop: ['', Validators.required],
      name: ['', Validators.required],
    });

    this.bahias.push(group);
  }
  deleteControl(index: number): void {
    this.bahias.removeAt(index);
  }

  save(): void{

  }
  onAddCategory() {
    this.dialog.open(CauseFailureDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }
  onAddCauseFailure(): void{
    this.dialog.open(CauseFailureDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }
  onAddProcess(): void{
    this.dialog.open(ProcessDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }


  
  removeEmail(email: string): void {
    const index = this.emailArray.indexOf(email);

    if (index >= 0) {
      this.emailArray.splice(index, 1);
    }
  }
  addBroadcast(event: MatChipInputEvent): void {
    const input = event.input;
    console.log('input :', input)
    const value = event.value;
    console.log('value :', value)

    // Add our fruit
    if ((value || '').trim()) {
      this.emailArray.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.broadcastControl.setValue(null);
  }
  selectedBroadcast(event: MatAutocompleteSelectedEvent): void {
    event.option.value.emailList.map((el) => {
       this.emailArray.push(el);
    });

    this.broadcastControl.setValue(null);
  }


}
