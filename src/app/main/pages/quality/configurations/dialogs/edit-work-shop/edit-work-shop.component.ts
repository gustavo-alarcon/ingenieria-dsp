import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { WorkShopModel } from 'src/app/main/models/workshop.model';
import { QualityService } from 'src/app/main/services/quality.service';

@Component({
  selector: 'app-edit-work-shop',
  templateUrl: './edit-work-shop.component.html',
  styleUrls: ['./edit-work-shop.component.scss']
})
export class EditWorkShopComponent implements OnInit {
  editFormGroup: FormGroup;
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: WorkShopModel,
    private qualityService: QualityService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {

  }

  initForm(){
    this.editFormGroup = this.fb.group({
      taller:['']
    })
  }

  saveChanges(){
     
    this.qualityService.updateWorkShop(
     this.editFormGroup,
     this.data
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
