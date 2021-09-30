import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Evaluation, EvaluationInquiry } from 'src/app/main/models/evaluations.model';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/main/models/user-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
// @ts-ignore: Unreachable code error
import Painterro from 'painterro';

@Component({
  selector: 'app-evaluations-consults-dialog',
  templateUrl: './evaluations-consults-dialog.component.html',
  styleUrls: ['./evaluations-consults-dialog.component.scss']
})
export class EvaluationsConsultsDialogComponent implements OnInit, OnDestroy {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  consultForm: FormGroup;

  user: User;


  date: string = new Date().toISOString();

  evaluationsById: EvaluationInquiry[];

  uploadPercent$: Observable<number>;
  private subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<EvaluationsConsultsDialogComponent>,
    private fb: FormBuilder,
    private evaluationServices: EvaluationsService,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    private ng2ImgMax: Ng2ImgMaxService,
    private storage: AngularFireStorage,
  ) {

  }

  ngOnInit(): void {
    this.loading.next(true);
    this.createForm();
    this.subscription.add(this.authService.user$.subscribe(user => {
      this.user = user;
    }));

    this.subscription.add(
      this.evaluationServices.getEvaluationInquiriesById(this.data.id).subscribe((resp) => {
        this.evaluationsById = resp;
      })
    );
    this.loading.next(false);
  }

  createForm(): void {
    this.consultForm = this.fb.group({
      inquiry: ['', Validators.required],
      inquiryImage: [null],
    });
  }

  onSubmit(): void {
    this.loading.next(true);
    if (this.consultForm.invalid) {
      this.consultForm.markAllAsTouched();
      this.loading.next(false);
      this.scrollToFirstInvalidControl();
      return;
    }

    try {
      const resp = this.evaluationServices.saveInquiry(this.consultForm.value, this.user, this.data.id);
      this.subscription.add(resp.subscribe(
        batch => {
          if (batch) {
            batch.commit()
              .then(() => {
                this.loading.next(false);
                this.snackBar.open('✅ Consulta creada!', 'Aceptar', {
                  duration: 6000
                });
                this.dialogRef.close(true);
              })
              .catch(err => {
                this.loading.next(false);
                this.snackBar.open('🚨 Hubo un error creando la consulta!', 'Aceptar', {
                  duration: 6000
                });
              });
          }
        }
      ));
    } catch (error) {
      console.log(error);
    }


  }

  async deleteImage(): Promise<void> {
    try {
      this.loading.next(true);
      await this.evaluationServices.deleteImage(this.consultForm.get('inquiryImage').value);
      this.loading.next(false);
      this.consultForm.get('inquiryImage').setValue(null);
    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }
  }

  showPizarra(): void {
    const storage = this.storage;
    const id = this.data.id;
    const consultForm=this.consultForm.get('inquiryImage');
    Painterro({
      language: 'es',
      hiddenTools: ['rotate','resize'],
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
            consultForm.setValue(url);
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

  // uploadFile(event): void {
  //   if (!event.target.files[0]) {
  //     return;
  //   }

  //   this.loading.next(true);
  //   this.snackBar.open('🗜️ Comprimiendo', 'Aceptar', {
  //     duration: 3000
  //   });

  //   const file = event.target.files[0];
  //   this.subscription.add(this.ng2ImgMax.resize([file], 800, 10000).subscribe((result) => {
  //     const name = `evaluations/${this.data.id}/pictures/${this.data.id}-${this.date}-${result.name}.png`;
  //     const fileRef = this.storage.ref(name);
  //     const task = this.storage.upload(name, file);
  //     this.uploadPercent$ = task.percentageChanges();
  //     this.subscription.add(task.snapshotChanges().pipe(
  //       finalize(() => {
  //         fileRef.getDownloadURL().subscribe(url => {
  //           this.imagesUpload = url;
  //           this.consultForm.get('inquiryImage').setValue(url);
  //         });
  //         this.loading.next(false);
  //       })
  //     ).subscribe()
  //     );
  //   }));

  // }

  private scrollToFirstInvalidControl(): void {
    if (this.consultForm.get('inquiry').errors) {
      document.getElementById('inquiry').scrollIntoView();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
