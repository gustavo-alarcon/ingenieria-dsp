import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Replacement } from 'src/app/main/models/replacements.models';
import { ReplacementsService } from 'src/app/main/services/replacements.service';

@Component({
  selector: 'app-create-dialog-replacements',
  templateUrl: './create-dialog-replacements.component.html',
  styleUrls: ['./create-dialog-replacements.component.sass']
})
export class CreateDialogReplacementsComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  createReplacementForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Replacement[],
    public dialogRef: MatDialogRef<CreateDialogReplacementsComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private repService: ReplacementsService
  ) { }

  ngOnInit(): void {
    this.createFormListParts();
  }

  createFormListParts(): void {
    this.createReplacementForm = this.fb.group({
      parts: this.fb.array([
        this.fb.group({
          currentPart: ['', Validators.required],
          replacedPart: [null, Validators.required],
          description: ['', Validators.required],
          kit: [false],
        })
      ])
    });
  }

  get parts(): FormArray {
    return this.createReplacementForm.get('parts') as FormArray;
  }

  save(): void {
    this.loading.next(true);
    if (this.createReplacementForm.invalid) {
      this.createReplacementForm.markAllAsTouched();
      this.loading.next(false);
      return;
    } else {
      this.auth.user$.pipe(
        take(1),
        switchMap(user => {
          return this.repService.createReplacements(this.createReplacementForm.value, user);
        })
      ).subscribe(batch => {
        if (batch) {
          batch.commit()
            .then(() => {
              this.loading.next(false);
              this.snackbar.open('✅ Reemplazo registrado!', 'Aceptar', {
                duration: 6000
              });
              this.dialogRef.close('result');
            })
            .catch(err => {
              this.loading.next(false);
              this.snackbar.open('🚨 Hubo un error guardando el reemplazo!', 'Aceptar', {
                duration: 6000
              });
            });
        }
      });
    }

  }

  addControl(): void {
    const group = this.fb.group({
      currentPart: ['', Validators.required],
      replacedPart: [null, Validators.required],
      description: ['', Validators.required],
      kit: [false],
    });

    this.parts.push(group);
  }

  deleteControl(index: number): void {
    this.parts.removeAt(index);
  }

}
