import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject, concat, Observable, of, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Evaluation } from '../../../../../models/evaluations.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { EvaluationsService } from '../../../../../services/evaluations.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { take, switchMap, takeLast, finalize } from 'rxjs/operators';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-history-image-dialog',
  templateUrl: './history-image-dialog.component.html',
  styleUrls: ['./history-image-dialog.component.scss']
})
export class HistoryImageDialogComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();


  images: string[];
  imagesUpload: string[] = [''];
  date: string = new Date().toISOString();

  uploadPercent$: Observable<number>;

  private subscription = new Subscription();

  constructor(
    private snackBar: MatSnackBar,
    private ng2ImgMax: Ng2ImgMaxService,
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<HistoryImageDialogComponent>,
    private storage: AngularFireStorage,
    private evaluationServices: EvaluationsService

    ) { }

  ngOnInit(): void {
    if (this.data.images) {
      const arr = Object.values(this.data.images);
      this.images = [...arr];
    } else {
      this.images = [];
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async onSubmit(): Promise<void> {
    try {
      this.loading.next(true);
      const imagesObj = {};
      this.images = [...this.images, ...this.imagesUpload];
      this.images.pop();
      this.images.forEach((value, index) => {
        imagesObj[index] = value;
      });
      await this.evaluationServices.updateImage(this.data.id, imagesObj);
      this.dialogRef.close(true);

    } catch (error) {
      console.log(error);
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
    this.snackBar.open('🗜️ Comprimiendo', 'Aceptar', {
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

}
