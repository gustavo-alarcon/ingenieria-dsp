import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { EvaluationsService } from 'src/app/main/services/evaluations.service';
import { Evaluation } from 'src/app/main/models/evaluations.model';


@Component({
  selector: 'app-evaluations-images-dialog',
  templateUrl: './evaluations-images-dialog.component.html',
  styleUrls: ['./evaluations-images-dialog.component.scss']
})

export class EvaluationsImagesDialogComponent implements OnInit, OnDestroy {

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
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<EvaluationsImagesDialogComponent>,
    private evaluationServices: EvaluationsService

  ) {

    if (data.images) {
      const arr = Object.values(data.images);
      this.images = [...arr];
    } else {
      this.images = [];
    }
  }

  ngOnInit(): void {
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



 // async deleteImage(imgForDelete: string, index: number): Promise<void> {
  //   try {
  //     this.loading.next(true);
  //     await this.evaluationServices.deleteImage(this.imagesUpload[index]);
  //     this.imagesUpload.splice(index, 1);
  //     this.loading.next(false);
  //   } catch (error) {
  //     console.log(error);
  //     this.loading.next(false);
  //     this.imagesUpload.splice(index, 1);
  //   }
  // }

   // uploadFile(event, i?: number): void {
  //   if (!event.target.files[0]) {
  //     return;
  //   }
  //   this.loading.next(true);
  //   this.snackBar.open('🗜️ Comprimiendo', 'Aceptar', {
  //     duration: 3000
  //   });

  //   const file = event.target.files[0];
  //   this.ng2ImgMax.resize([file], 800, 10000).subscribe((result) => {
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
  //   });

  // }
