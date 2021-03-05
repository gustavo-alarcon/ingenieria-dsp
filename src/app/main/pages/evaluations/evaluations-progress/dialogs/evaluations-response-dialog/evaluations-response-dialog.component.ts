import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';
import { Evaluation, EvaluationInquiry } from 'src/app/main/models/evaluations.model';
import { finalize, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/main/models/user-model';

@Component({
  selector: 'app-evaluations-response-dialog',
  templateUrl: './evaluations-response-dialog.component.html',
  styleUrls: ['./evaluations-response-dialog.component.scss']
})
export class EvaluationsResponseDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  inquiry$: Observable<EvaluationInquiry>;

  answerForm: FormGroup;
  user: User;
  inquiry: EvaluationInquiry;

  imagesUpload: string = null;
  uploadPercent$: Observable<number>;
  date: string = new Date().toISOString();

  private subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<EvaluationsResponseDialogComponent>,
    private ng2ImgMax: Ng2ImgMaxService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private evalService: EvaluationsService,
    private auth: AuthService,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    this.createForm();
    
    this.inquiry$ = this.evalService.getEvaluationInquiriesById(this.data.id)
      .pipe(
        map(list => {
          this.inquiry = list[list.length - 1];
          return list[list.length - 1];
        })
      )

    this.subscription.add(this.auth.user$.subscribe(user => {
      this.user = user;
    }));
  }

  createForm(): void {
    this.answerForm = this.fb.group({
      answer: ['', Validators.required],
      answerImage: [''],
    });
  }

  async deleteImage(): Promise<void> {
    try {
      this.loading.next(true);
      await this.evalService.deleteImage(this.imagesUpload);
      this.loading.next(false);
      this.imagesUpload = null;
      this.answerForm.get('answerImage').setValue(null);
    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }
  }

  uploadFile(event): void {
    if (!event.target.files[0]) {
      return;
    }

    this.loading.next(true);
    this.snackbar.open('🗜️ Comprimiendo', 'Aceptar', {
      duration: 3000
    });

    const file = event.target.files[0];
    this.subscription.add(this.ng2ImgMax.resize([file], 800, 10000).subscribe((result) => {
      const name = `evaluations/${this.data.id}/pictures/${this.data.id}-${this.date}-${result.name}.png`;
      const fileRef = this.storage.ref(name);
      const task = this.storage.upload(name, file);
      this.uploadPercent$ = task.percentageChanges();
      this.subscription.add(task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.imagesUpload = url;
            this.answerForm.get('answerImage').setValue(url);
          });
          this.loading.next(false);
        })
      ).subscribe()
      );
    }));

  }

  onSubmit(): void {
    this.loading.next(true);
    if (this.answerForm.invalid) {
      this.answerForm.markAllAsTouched();
      this.loading.next(false);
      // this.scrollToFirstInvalidControl();
      return;
    }

    try {
      const resp = this.evalService.saveAnswer(this.answerForm.value, this.user, this.data.id, this.inquiry.id);
      this.subscription.add(resp.subscribe(
        batch => {
          if (batch) {
            batch.commit()
              .then(() => {
                this.loading.next(false);
                this.snackbar.open('✅ Respuesta creada!', 'Aceptar', {
                  duration: 6000
                });
                this.dialogRef.close(true);
              })
              .catch(err => {
                this.loading.next(false);
                this.snackbar.open('🚨 Hubo un error creando la respuesta!', 'Aceptar', {
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

}
