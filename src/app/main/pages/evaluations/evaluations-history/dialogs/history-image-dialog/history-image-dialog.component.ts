import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Evaluation } from '../../../../../models/evaluations.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluationsService } from '../../../../../services/evaluations.service';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-history-image-dialog',
  templateUrl: './history-image-dialog.component.html',
  styleUrls: ['./history-image-dialog.component.scss']
})
export class HistoryImageDialogComponent implements OnInit, OnDestroy {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();


  images: string[];
  imagesUpload: string[] = [''];
  date: string = new Date().toISOString();

  uploadPercent$: Observable<number>;

  isHovering: boolean;

  files: File[] = [];

  pathStorage: string;
  pathDb: string;

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
    this.pathStorage = `evaluations/${this.data.id}/pictures/${this.data.id}`;
    this.pathDb = `/db/ferreyros/evaluations`;
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

  addNewImage(image: string): void {
    this.imagesUpload.pop();
    this.imagesUpload.push(image);
    this.imagesUpload.push('');
  }

  toggleHover(event: boolean): void {
    this.isHovering = event;
  }

  onDrop(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

}
