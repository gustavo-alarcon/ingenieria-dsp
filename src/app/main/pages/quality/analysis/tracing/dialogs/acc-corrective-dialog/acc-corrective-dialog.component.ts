import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { Quality } from '../../../../../../models/quality.model';

@Component({
  selector: 'app-acc-corrective-dialog',
  templateUrl: './acc-corrective-dialog.component.html',
  styleUrls: ['./acc-corrective-dialog.component.scss']
})
export class AccCorrectiveDialogComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  listAreaForm: FormGroup;
  
  fileSelect = false;
  nameFileSelect: string;
  constructor(
    public dialogRef: MatDialogRef<AccCorrectiveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Quality,
    private fb: FormBuilder,


  ) { }
  ngOnInit(): void {
    this.initForm();

    console.log('obdataject ', this.data);
    console.log('data correctiveActions ', this.data.correctiveActions);

  }

  initForm(): void{
    this.listAreaForm = this.fb.group({
      corrective: [this.data.correctiveActions['corrective'] , Validators.required],
      name: [this.data.correctiveActions['name'] , Validators.required],
      kit: ['', Validators.required]
    });

  }
  addFile(): void{

  }
  save(): void{

  }
  uploadFiles(event, item ): void {
    console.log('item', item)
    if (!event.target.files[0]) {
      return;
    }

    const filename = event.target.files[0].name;
    this.fileSelect = true;
    this.nameFileSelect = filename ;



    /* const date = new Date();
    this.loading.next(true);
    const file = event.target.files[0];
    const filename = event.target.files[0].name;

    const name = `${this.pathStorageFile}/${date}-${filename}`;
    const fileRef = this.storage.ref(name);
    const task = this.storage.upload(name, file);

    this.uploadPercent$ = task.percentageChanges();
    this.subscription.add(
      task
        .snapshotChanges()
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

}
