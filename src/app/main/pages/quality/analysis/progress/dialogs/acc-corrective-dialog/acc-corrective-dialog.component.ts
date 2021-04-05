import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Quality } from 'src/app/main/models/quality.model';
import { FormGroup, FormBuilder, Validators, FormArray, Form, FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { QualityBroadcastList } from '../../../../../../models/quality.model';
import { QualityService } from '../../../../../../services/quality.service';

@Component({
  selector: 'app-acc-corrective-dialog',
  templateUrl: './acc-corrective-dialog.component.html',
  styleUrls: ['./acc-corrective-dialog.component.scss']
})
export class AccCorrectiveDialogComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  listBahiasForm: FormGroup;
  nameFile;

  filteredBroadcast = [];
  emailArray: string[] = [];
  broadcastControl = new FormControl();
  // chips
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredBroadcast$: Observable<QualityBroadcastList[]>;

  nameFileSelect;
  fileSelect;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AccCorrectiveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    private qualityService: QualityService,
    ) { }

  ngOnInit(): void {
    this.initForm();

    console.log('this.data.emailList. : ', this.data.emailList);
  
    this.emailArray = Object.values(this.data.emailList['0']);

/* 
    this.data.emailList['0'].map(el =>{
      this.emailArray.push(el);
    }); */

    this.filteredBroadcast$ = this.qualityService.getAllBroadcastList().pipe(
      tap((res: QualityBroadcastList[]) => {
        return res;
      })
    );
  }

  initForm(): void{
    this.listBahiasForm = this.fb.group({
      bahias: this.fb.array([
        this.fb.group({
          workShop: ['', Validators.required],
          name: ['', Validators.required],
        })
      ])
    });
  }

  save(){

  }
  uploadFiles(event, i?: number): void {

   
   /*  if (!event.target.files[0]) {
      return;
    }
    const date = new Date();
    this.loading.next(true);
    const file = event.target.files[0];
    const filename = event.target.files[0].name;

    const name = `${this.pathStorageFile}/${date}-${filename}`;
    const fileRef = this.storage.ref(name);
    const task = this.storage.upload(name, file);

    this.uploadPercent$ = task.percentageChanges();
    this.subscription.add(
       task.snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              if (url) {
               this.uploadFile = url;
               this.nameFileSelect = filename ;
               this.fileSelect = true;
              }
            });
            this.loading.next(false);
          })
        ).subscribe()
    ); */
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
