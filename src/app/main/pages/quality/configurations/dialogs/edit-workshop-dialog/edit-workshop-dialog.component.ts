import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { workshopForm, WorkshopModel } from 'src/app/main/models/workshop.model';
import { QualityService } from 'src/app/main/services/quality.service';

@Component({
  selector: 'app-edit-workshop-dialog',
  templateUrl: './edit-workshop-dialog.component.html',
  styleUrls: ['./edit-workshop-dialog.component.scss']
})
export class EditWorkshopDialogComponent implements OnInit {


  editFormGroup: FormGroup;
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: WorkshopModel,
    @Inject(MAT_DIALOG_DATA) public data1: workshopForm,
    private qualityService: QualityService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  process = [];

  ngOnInit(): void {
    this.initForm();
    console.log(this.data)
    this.process = this.data.workshopProcessName
    

  }

  initForm(){
    this.editFormGroup = this.fb.group({
      workshopName:[this.data.workshopName ? this.data.workshopName:''],
      workshopProcessName: [this.data.workshopProcessName ? this.data.workshopProcessName  :'']
    })
    
  
  }

  deleteProcess(index:number): void{
    // this.loading.next(false)

    this.data.workshopProcessName.splice(index,1)
  }

  saveChanges(){
     
    this.qualityService.updateWorkShop(
     this.data.id,
     this.editFormGroup.value
    ).subscribe((batch: firebase.default.firestore.WriteBatch)=>{
      batch.commit().then(() => {
        this.loading.next(false);

        this.snackbar.open(
          ' ✅ Archivo se modifico de forma correcta',
          'Aceptar',
          {
            duration: 6000,
          }
        );
        this.dialog.closeAll();
      });
    })
  }

}
