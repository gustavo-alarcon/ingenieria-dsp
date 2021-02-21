import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Improvement } from 'src/app/main/models/improvenents.model';
import { ImprovementsService } from 'src/app/main/services/improvements.service';


export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-create-dialog-improvenments',
  templateUrl: './create-dialog-improvenments.component.html',
  styleUrls: ['./create-dialog-improvenments.component.scss']
})
export class CreateDialogImprovenmentsComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  createImprovenmentsForm: FormGroup;

  options1: string[] = [];
  partsFilteredOptions1: Observable<string[]>;
  arrParts1 = [];

  options2: string[] = [];
  partsFilteredOptions2: Observable<string[]>;
  arrParts2 = [];

  subscriptions: Subscription = new Subscription();

  obs1$: { improved: string, qty: number, index: number };

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Improvement[],
    public dialogRef: MatDialogRef<CreateDialogImprovenmentsComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private impService: ImprovementsService
  ) {
  }

  ngOnInit(): void {
    this.createFormListParts();
  }

  createFormListParts(): void {
    this.createImprovenmentsForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      model: ['', Validators.required],
      component: ['', Validators.required],
      date: [{ value: '', disabled: true }, Validators.required],
      criticalPart: [false],
      rate: [false],
      parts: this.fb.array([
        this.fb.group({
          sparePart: ['', Validators.required],
          quantity: [null, Validators.required],
          currentPart: ['', Validators.required],
          improvedPart: ['', Validators.required],
          kit: [false],
        })
      ])
    });
  }

  get parts(): FormArray {
    return this.createImprovenmentsForm.get('parts') as FormArray;
  }


  save(): void {
    this.loading.next(true);
    console.log(this.createImprovenmentsForm.value);
    
    if (this.createImprovenmentsForm.invalid) {
      this.createImprovenmentsForm.markAllAsTouched();
      return;
    } else {
      this.auth.user$.pipe(
        take(1),
        switchMap(user => {
          return this.impService.createImprovementEntry(this.createImprovenmentsForm.value, user)
        })
      ).subscribe(batch => {
        if (batch) {
          batch.commit()
            .then(() => {
              this.loading.next(false);
              this.snackbar.open('✅ Mejoras registradas!', 'Aceptar', {
                duration: 6000
              });
              this.dialogRef.close('result');
            })
            .catch(err => {
              this.loading.next(false);
              this.snackbar.open('🚨 Hubo un error guardando las mejoras!', 'Aceptar', {
                duration: 6000
              })
            })
        }
      })
    }
    
  }

  addControl(): void {
    const group = this.fb.group({
      sparePart: ['', Validators.required],
      quantity: [null, Validators.required],
      currentPart: ['', Validators.required],
      improvedPart: ['', Validators.required],
      kit: [false],
    });

    this.parts.push(group);
  }

  deleteControl(index: number): void {
    this.parts.removeAt(index);
  }

}
