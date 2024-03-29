import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Evaluation, EvaluationBroadcastList, EvaluationsKindOfTest, EvaluationsResultTypeUser } from 'src/app/main/models/evaluations.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, take, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { User } from '../../../../../models/user-model';
// @ts-ignore: Unreachable code error
import Painterro from 'painterro';

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
  result$: Observable<EvaluationsResultTypeUser[]>;

  arrayAux: string[];

  //Chip email
  emailArray: string[] = [];
  filteredBroadcast$: Observable<EvaluationBroadcastList[]>;
  broadcastControl = new FormControl();
  listBroadcast: string[] = [];
  // chips
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  user: User;
  counter = 0;

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
    if (data.extends) {
      this.arrayAux = data.extends;
    } else {
      this.arrayAux = [null];
    }

  }

  ngOnInit(): void {
    this.createFormFinalize();

    this.subscription.add(
      this.auth.user$.subscribe((user) => {
        this.user = user;
        const email = this.user.email;

        this.counter++;
        if (this.counter === 1) {
          this.emailArray.push(email);
        }
      })
    );

    if (this.data.createdBy) {
      this.emailArray.push(this.data.createdBy.email);
    }


    this.result$ = this.evaluationServices.getAllEvaluationsSettingsResultType();
    this.kindOfTests$ = this.evaluationServices.getAllEvaluationsSettingsKindOfTest();

    this.filteredBroadcast$ = this.evaluationServices.getAllBroadcastList().pipe(
      tap((res: EvaluationBroadcastList[]) => {
        return res;
      })
    );



  }

  createFormFinalize(): void {
    this.finalizeForm = this.fb.group({
      result: ['', Validators.required],
      kindOfTest: ['', Validators.required],
      comments: [''],
      length: [this.data.length ? this.data.length : null],
      extends: this.fb.array([])
    });

    this.arrayAux.forEach(val => {
      this.getExtendsArray.push(new FormControl(val));
    });
  }

  addControlExtends(): void {
    const control = this.fb.control([null]);
    this.getExtendsArray.push(control);
  }

  deleteControlExtends(i: number): void {
    this.getExtendsArray.removeAt(i);
  }

  get getExtendsArray(): FormArray {
    return this.finalizeForm.get('extends') as FormArray;
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
      // const imagesObj = {};
      // this.images = [...this.images, ...this.imagesUpload];
      // this.images.pop();
      // this.images.forEach((value, index) => {
      //   imagesObj[index] = value;
      // });

      this.auth.user$
        .pipe(
          take(1)
        ).subscribe(user => {
          this.evaluationServices.updateImagesFinalizeData(this.data, this.imagesUpload, this.finalizeForm.value, user, this.emailArray)
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

  showPizarra(i?: number): void {
    const storage = this.storage;
    const index = i;
    const id = this.data.id;
    const imagesAuxArray = this.imagesUpload;
    Painterro({
      language: 'es',
      hiddenTools: ['rotate', 'resize'],
      saveHandler: async function (image: any, done: any) {
        image.asBlob(image.hasAlphaChannel() ? 'image/png' : 'image/jpeg');
        this.imagen = await image.asDataURL()
        const metadata = {
          contentType: image.hasAlphaChannel() ? 'image/png' : 'image/jpeg',
        };

        const name = `evaluations/${id}/pictures/${id}-${new Date().toISOString()}`;
        await storage.ref(name).putString(this.imagen.split(/,(.+)/)[1], 'base64', metadata)
          .then(async (snapshot: any) => {
            const url = await snapshot.ref.getDownloadURL();
            if (imagesAuxArray[index] === '') {
              imagesAuxArray.pop();
              imagesAuxArray.push(url);
              imagesAuxArray.push('');
            } else {
              imagesAuxArray[index] = url;
            }
          });

        done(true)
      },
      onImageLoaded: function () {
        console.log('open')
      },
      doneCallback: function (image: any, done: any) {
      }
    }).show()
  }

  // uploadFile(event: any, i?: number): void {
  //   if (!event.target.files[0]) {
  //     return;
  //   }
  //   this.loading.next(true);
  //   const file = event.target.files[0];
  //   this.subscription.add(this.ng2ImgMax.resize([file], 800, 10000).subscribe((result) => {
  //     const name = `evaluations/${this.data.id}/pictures/${this.data.id}-${this.date}-${result.name}.png`;
  //     const fileRef = this.storage.ref(name);
  //     const task = this.storage.upload(name, file);
  //     this.uploadPercent$ = task.percentageChanges();
  //     this.subscription.add(task.snapshotChanges().pipe(
  //       finalize(() => {
  //         fileRef.getDownloadURL().subscribe(url => {
  //           if (this.imagesUpload[i] === '') {
  //             this.imagesUpload.pop();
  //             this.imagesUpload.push(url);
  //             this.imagesUpload.push('');
  //           } else {
  //             this.imagesUpload[i] = url;
  //           }
  //         });
  //         this.loading.next(false);
  //       })
  //     ).subscribe()
  //     );
  //   }));

  // }

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



  removeEmail(email: string): void {
    const index = this.emailArray.indexOf(email);

    if (index >= 0) {
      this.emailArray.splice(index, 1);
    }
  }
  addBroadcast(event: MatChipInputEvent): void {
    const input = event.input;
    console.log('input :', input);
    const value = event.value;
    console.log('value :', value);

    // Add our fruit
    if ((value || '').trim()) {
      this.emailArray.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.broadcastControl.setValue(null);
  }
  selectedBroadcast(event: MatAutocompleteSelectedEvent): void {
    event.option.value.emailList.map((el) => {
      this.emailArray.push(el);
    });

    this.emailInput.nativeElement.value = '';
    this.broadcastControl.setValue(null);
  }

  // showPizarra(imagen?: any) {
  // this.painterroService.showPizarra();
  // }
}
