import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Evaluation, EvaluationsKindOfTest, EvaluationsResultTypeUser } from 'src/app/main/models/evaluations.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-evaluations-finalize-dialog',
  templateUrl: './evaluations-finalize-dialog.component.html',
  styleUrls: ['./evaluations-finalize-dialog.component.scss']
})
export class EvaluationsFinalizeDialogComponent implements OnInit, OnDestroy {


  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  finalizeForm: FormGroup;

  images: string[];
  imagesUpload: string[] = [''];
  date: string = new Date().toISOString();


  uploadPercent$: Observable<number>;
  filteredOptions: Observable<string[]>;

  private subscription = new Subscription();

  obsAutoComplete$: Observable<EvaluationsResultTypeUser[]>;
  kindOfTests$: Observable<EvaluationsKindOfTest[]>;


  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ng2ImgMax: Ng2ImgMaxService,
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<EvaluationsFinalizeDialogComponent>,
    private storage: AngularFireStorage,
    private evaluationServices: EvaluationsService,
    private auth: AuthService
  ) {
    if (data.images) {
      const arr = Object.values(data.images);
      this.images = [...arr];
    } else {
      this.images = [];
    }

    this.obsAutoComplete$ = this.evaluationServices.getAllEvaluationsSettingsResultType();

  }

  ngOnInit(): void {
    this.createFormFinalize();
    this.filteredOptions = this.finalizeForm.controls.result.valueChanges
      .pipe(
        tap(() => {
          this.loading.next(true);
        }),
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(val => {
          this.loading.next(false);
          return this.filter(val || '');
        }),
        tap(() => {
          this.loading.next(false);
        }),
      );


    this.kindOfTests$ = combineLatest(
      this.evaluationServices.getAllEvaluationsSettingsKindOfTest(),
      this.finalizeForm.controls.kindOfTest.valueChanges
        .pipe(
          startWith(''),
          debounceTime(200),
          distinctUntilChanged(),
          map(val => val.kindOfTest ? val.kindOfTest : val)
        )
    ).pipe(
      map(([list, term]) => {
        let search = term.trim().toLowerCase();
        return list.filter(element => element.kindOfTest.includes(search));
      })
    )


  }

  createFormFinalize(): void {
    this.finalizeForm = this.fb.group({
      result: ['', Validators.required],
      kindOfTest: ['', Validators.required],
      comments: [''],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.finalizeForm.invalid) {
      this.finalizeForm.markAllAsTouched();
      this.loading.next(false);
      this.scrollToFirstInvalidControl();
      return;
    }
    try {
      this.finalizeForm.markAsPending();
      this.finalizeForm.disable();
      this.loading.next(true);
      const imagesObj = {};
      this.images = [...this.images, ...this.imagesUpload];
      this.images.pop();
      this.images.forEach((value, index) => {
        imagesObj[index] = value;
      });

      this.auth.user$
        .pipe(
          take(1)
        ).subscribe(user => {
          this.evaluationServices.updateImagesFinalizeData(this.data, imagesObj, this.finalizeForm.value, user)
            .pipe(
              take(1)
            ).subscribe(batch => {
              if (batch) {
                batch.commit()
                  .then(() => {
                    this.loading.next(false);
                    this.snackBar.open('✅ se guardo correctamente!', 'Aceptar', {
                      duration: 6000
                    });
                    this.dialogRef.close('true');
                  })
              }
            })

        })

    } catch (error) {
      this.loading.next(false);
      this.snackBar.open('🚨 Hubo un error.', 'Aceptar', {
        duration: 6000
      });
    }
  }

  async deleteImage(imgForDelete: string, index: number): Promise<void> {
    try {
      this.loading.next(true);
      await this.evaluationServices.deleteImage(this.imagesUpload[index]);
      this.imagesUpload.splice(index, 1);
      this.loading.next(false);
    } catch (error) {
      console.log(error);
      this.loading.next(false);
      this.imagesUpload.splice(index, 1);
    }
  }

  uploadFile(event, i?: number): void {
    if (!event.target.files[0]) {
      return;
    }
    this.loading.next(true);
    const file = event.target.files[0];
    this.subscription.add(this.ng2ImgMax.resize([file], 800, 1000).subscribe((result) => {
      const name = `evaluations/${this.data.id}/pictures/${this.data.id}-${this.date}-${result.name}.png`;
      const fileRef = this.storage.ref(name);
      const task = this.storage.upload(name, file);
      this.uploadPercent$ = task.percentageChanges();
      this.subscription.add(task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            if (this.imagesUpload[i] === '') {
              this.imagesUpload.pop();
              this.imagesUpload.push(url);
              this.imagesUpload.push('');
            } else {
              this.imagesUpload[i] = url;
            }
          });
          this.loading.next(false);
        })
      ).subscribe()
      );
    }));

  }

  get imagesArray(): FormArray {
    return this.finalizeForm.get('images') as FormArray;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private scrollToFirstInvalidControl(): void {
    if (this.finalizeForm.get('result').errors) {
      document.getElementById('result').scrollIntoView();
    } else if (this.finalizeForm.get('kindOfTest').errors) {
      document.getElementById('kindOfTest').scrollIntoView();
    }
  }

  filter(val: string): Observable<any> {
    return this.obsAutoComplete$
      .pipe(
        map(response => response.filter(option => {
          return option.resultType.toLowerCase().indexOf(val.toLowerCase()) === 0;
        }))
      );
  }
}
