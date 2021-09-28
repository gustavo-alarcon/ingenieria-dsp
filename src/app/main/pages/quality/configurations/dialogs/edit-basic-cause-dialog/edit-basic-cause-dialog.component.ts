import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { BasicCause } from 'src/app/main/models/workshop.model';
import { QualityService } from 'src/app/main/services/quality.service';
import { DeleteImmediateCauseDialogComponent } from './delete-immediate-cause-dialog/delete-immediate-cause-dialog.component';

@Component({
  selector: 'app-edit-basic-cause-dialog',
  templateUrl: './edit-basic-cause-dialog.component.html',
  styleUrls: ['./edit-basic-cause-dialog.component.scss'],
})
export class EditBasicCauseDialogComponent implements OnInit {
  editFormGroup: FormGroup;
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  basicCauseFormArray = new FormArray([]);

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: BasicCause,
    private qualityService: QualityService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  basicCauses: string[] = [];

  ngOnInit(): void {
    this.initForm();
    this.basicCauses = [...this.data.basicCauses];
  }

  initForm() {
    this.editFormGroup = this.fb.group({
      immediateCause: [
        this.data.name ? this.data.name : '',
        [Validators.required],
      ],
      basicCause: [''],
    });
  }

  addBasicCause(): void {
    if (this.editFormGroup.get('basicCause').invalid) {
      this.editFormGroup.markAllAsTouched();
      return;
    }
    const value = { ...this.editFormGroup.value };

    if (value.basicCause === '') {
      this.snackbar.open(
        '🚨 No se pueden guardar campos vacíos  !',
        'Aceptar',
        {
          duration: 6000,
        }
      );
      return;
    }

    this.basicCauses.unshift(value.basicCause);
    this.resetBasicCause();
  }

  resetBasicCause(): void {
    this.editFormGroup.get('basicCause').reset();
  }

  deleteBasicCause(index: number) {
    this.data.basicCauses = [...this.basicCauses];

    const dialogRef = this.dialog.open(DeleteImmediateCauseDialogComponent, {
      maxWidth: 500,
      width: '90vw',
      data: this.data,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res) this.basicCauses.splice(index, 1);
      });
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
        .updateImmediateCause(
          this.data.id,
          this.editFormGroup.value['immediateCause'],
          this.basicCauses
        )
        .subscribe((batch) => {
          batch.commit().then(() => {
            this.loading.next(false);

            this.snackbar.open(
              ' ✅ Información modificada correctamente',
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
