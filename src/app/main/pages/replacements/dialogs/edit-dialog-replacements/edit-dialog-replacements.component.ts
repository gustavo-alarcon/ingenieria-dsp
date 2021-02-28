import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Replacement } from 'src/app/main/models/replacements.models';
import { ReplacementsService } from 'src/app/main/services/replacements.service';

@Component({
  selector: 'app-edit-dialog-replacements',
  templateUrl: './edit-dialog-replacements.component.html',
  styleUrls: ['./edit-dialog-replacements.component.sass']
})
export class EditDialogReplacementsComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  editReplacementForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Replacement,
    public dialogRef: MatDialogRef<EditDialogReplacementsComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private repService: ReplacementsService
  ) { }

  ngOnInit(): void {
    this.createFormListParts();
  }

  createFormListParts(): void {
    this.editReplacementForm = this.fb.group({
      parts: this.fb.array([
        this.fb.group({
          currentPart: [this.data.currentPart ? this.data.currentPart : null, Validators.required],
          replacedPart: [this.data.replacedPart ? this.data.replacedPart: null, Validators.required],
          description: [this.data.description ? this.data.description: null, Validators.required],
          kit: [this.data.kit ? this.data.kit : false],
        })
      ])
    });
  }

  get parts(): FormArray {
    return this.editReplacementForm.get('parts') as FormArray;
  }

  save(): void {
    this.loading.next(true);
    if (this.editReplacementForm.invalid) {
      this.editReplacementForm.markAllAsTouched();
      this.loading.next(false);
      return;
    } else {
      this.auth.user$.pipe(
        take(1),
        switchMap(user => {
          return this.repService.editReplacement(this.data.id, this.editReplacementForm.value, user);
        })
      ).subscribe(batch => {
        if (batch) {
          batch.commit()
            .then(() => {
              this.loading.next(false);
              this.snackbar.open('✅ Reemplazo editado!', 'Aceptar', {
                duration: 6000
              });
              this.dialogRef.close('result');
            })
            .catch(err => {
              this.loading.next(false);
              this.snackbar.open('🚨 Hubo un error editando el reemplazo!', 'Aceptar', {
                duration: 6000
              });
            });
        }
      });
    }

  }

}
