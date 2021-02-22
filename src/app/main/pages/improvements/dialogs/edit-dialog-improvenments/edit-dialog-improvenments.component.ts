import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ImprovementEntry, ImprovementPart } from 'src/app/main/models/improvenents.model';
import { ImprovementsService } from 'src/app/main/services/improvements.service';

@Component({
  selector: 'app-edit-dialog-improvenments',
  templateUrl: './edit-dialog-improvenments.component.html',
  styleUrls: ['./edit-dialog-improvenments.component.scss']
})
export class EditDialogImprovenmentsComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  editImprovenmentsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ImprovementEntry,
    public dialogRef: MatDialogRef<EditDialogImprovenmentsComponent>,
    private auth: AuthService,
    private impService: ImprovementsService,
    private snackbar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.createFormListParts();
  }

  createFormListParts(): void {
    this.editImprovenmentsForm = this.fb.group({
      name: [this.data.name ? this.data.name : null, Validators.required],
      description: [this.data.description ? this.data.description : null, Validators.required],
      model: [this.data.model ? this.data.model : null, Validators.required],
      component: [this.data.component ? this.data.component : null, Validators.required],
      // tslint:disable-next-line: no-string-literal
      date: [this.data.date ? new Date(this.data.date['seconds'] * 1000) : null, Validators.required],
      criticalPart: [this.data.criticalPart ? this.data.criticalPart : false],
      rate: [this.data.rate ? this.data.rate : false],
      parts: this.fb.array([])
    });

    this.data.parts.forEach(part => {
      this.addControl(part);
    });

  }

  get parts(): FormArray {
    return this.editImprovenmentsForm.get('parts') as FormArray;
  }

  addControl(part?: ImprovementPart): void {
    let group;

    if (part) {
      group = this.fb.group({
        sparePart: [part.sparePart ? part.sparePart : null, Validators.required],
        quantity: [part.quantity ? part.quantity : null, Validators.required],
        currentPart: [part.currentPart ? part.currentPart : null, Validators.required],
        improvedPart: [part.improvedPart ? part.improvedPart : null, Validators.required],
        kit: [part.kit ? part.kit : null]
      });
    } else {
      group = this.fb.group({
        sparePart: ['', Validators.required],
        quantity: [null, Validators.required],
        currentPart: ['', Validators.required],
        improvedPart: ['', Validators.required],
        kit: [false],
      });
    }

    this.parts.push(group);
  }

  deleteControl(index: number): void {
    this.parts.removeAt(index);
  }


  save(): void {
    this.loading.next(true);

    if (this.editImprovenmentsForm.invalid) {
      this.editImprovenmentsForm.markAllAsTouched();
      return;
    } else {
      this.auth.user$.pipe(
        take(1),
        switchMap(user => {
          return this.impService.editImprovementEntry(this.data.id, this.editImprovenmentsForm.value, user);
        })
      ).subscribe(batch => {
        if (batch) {
          batch.commit()
            .then(() => {
              this.loading.next(false);
              this.snackbar.open('✅ Edición guardada!', 'Aceptar', {
                duration: 6000
              });
              this.dialogRef.close('result');
            })
            .catch(err => {
              this.loading.next(false);
              this.snackbar.open('🚨 Hubo un error guardando la edición!', 'Aceptar', {
                duration: 6000
              });
            });
        }
      });
    }
  }
}
