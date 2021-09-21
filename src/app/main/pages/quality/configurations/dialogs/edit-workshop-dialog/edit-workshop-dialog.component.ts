import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import {WorkshopModel} from 'src/app/main/models/workshop.model';
import { QualityService } from 'src/app/main/services/quality.service';
import { DeleteProcessDialogComponent } from './delete-process-dialog/delete-process-dialog.component';
import { workshopForm } from '../../../../../models/workshop.model';

@Component({
  selector: 'app-edit-workshop-dialog',
  templateUrl: './edit-workshop-dialog.component.html',
  styleUrls: ['./edit-workshop-dialog.component.scss'],
})
export class EditWorkshopDialogComponent implements OnInit {
  editFormGroup: FormGroup;
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  processFormArray = new FormArray([]);

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: WorkshopModel,
    private qualityService: QualityService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  process: string[] = [];

  ngOnInit(): void {
    this.initForm();
    this.process = [...this.data.workshopProcessName];
  
  }

  initForm() {
    this.editFormGroup = this.fb.group({
      workshopName: [
        this.data.workshopName ? this.data.workshopName : '',
        [Validators.required],
      ],
      workshopProcessName: [''],
    });
  }

  addWorkshopProcess(): void {
    if (this.editFormGroup.get('workshopName').invalid ) {
      this.editFormGroup.markAllAsTouched();
      return;
    }
    const value = { ...this.editFormGroup.value };
    

    if(value.workshopProcessName === ''){
      this.snackbar.open('🚨 No se pueden guardar procesos vacios  !', 'Aceptar', {
        duration: 6000
      });
      return
    }

    this.process.push(value.workshopProcessName);
    this.resetWorkshopProcess();
  }

  resetWorkshopProcess(): void {
    this.editFormGroup.get('workshopProcessName').reset();
  }

  deleteProcess(index: number) {
    
    this.data.workshopProcessName = [...this.process];
   
    this.dialog.open(DeleteProcessDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      data: this.data,
    });
    this.process.splice(index, 1);
  }

  saveChanges() {
    try {
      this.loading.next(true);
      if (this.editFormGroup.invalid) {
        this.editFormGroup.markAllAsTouched();
        this.loading.next(false);
        return;
      }

      this.qualityService
        .updateWorkShop(this.data.id, this.editFormGroup.value, this.process)
        .subscribe((batch: firebase.default.firestore.WriteBatch) => {
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
        });
    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }
  }
}
