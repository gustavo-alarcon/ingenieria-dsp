import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Quality } from 'src/app/main/models/quality.model';
import { FormGroup, FormBuilder, Validators, FormArray, Form } from '@angular/forms';

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

  nameFileSelect;
  fileSelect;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AccCorrectiveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality) { }

  ngOnInit(): void {
    this.initForm();
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

}
