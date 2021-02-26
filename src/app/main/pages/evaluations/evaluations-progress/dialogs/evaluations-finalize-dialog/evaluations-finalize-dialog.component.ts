import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Evaluation } from 'src/app/main/models/evaluations.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-evaluations-finalize-dialog',
  templateUrl: './evaluations-finalize-dialog.component.html',
  styleUrls: ['./evaluations-finalize-dialog.component.scss']
})
export class EvaluationsFinalizeDialogComponent implements OnInit {


  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  finalizeForm: FormGroup;

  images: string[];
  imagesUpload: string[] = ['kj'];
  image: string = null;

  uploadPercent$: Observable<number>;

  private subscription = new Subscription();


  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<EvaluationsFinalizeDialogComponent>,
    private storage: AngularFireStorage,

  ) {
    if (data.images) {
      this.images = [...data.images];
    } else {
      this.images = [];
    }
  }

  ngOnInit(): void {
    this.createFormFinalize();
  }

  createFormFinalize(): void {
    this.finalizeForm = this.fb.group({
      result: ['', Validators.required],
      kindOfTest: ['', Validators.required],
      comments: [''],
      images: this.fb.array([])
    });
  }

  onSave(): void {
    this.loading.next(true);
    if (this.finalizeForm.invalid) {
      this.finalizeForm.markAllAsTouched();
      this.loading.next(false);
      return;
    }

  }

  uploadFile(event, i: number): void {
    if (this.image === null) {
      this.image = new Date().toISOString();
    }
    const file = event.target.files[0];
    const name = `evaluations/${this.data.id}/pictures/${this.data.id}-${this.image}-${event.target.files[0].name}-finalize.png`;
    const fileRef = this.storage.ref(name);
    const task = this.storage.upload(name, file);

    this.uploadPercent$ = task.percentageChanges();

    this.subscription.add(task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          if (this.imagesUpload[i] === '') {
            this.imagesUpload[i] = url;
            this.imagesUpload.push('');
          } else {
            this.imagesUpload[i] = url;
          }
        });
      })
    ).subscribe()
    );
  }



}
