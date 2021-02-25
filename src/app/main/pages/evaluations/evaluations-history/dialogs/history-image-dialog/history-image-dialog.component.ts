import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject, concat, Observable, of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Evaluation } from '../../../../../models/evaluations.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { EvaluationsService } from '../../../../../services/evaluations.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { take, switchMap, takeLast } from 'rxjs/operators';
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

  createForm: FormGroup;

  noImage = '../../../../../../../assets/img/camara.png';
  photos: {
    resizing$: {
      photoURL: Observable<boolean>
    },
    data: {
      photoURL: File
    }
    } = {
      resizing$: {
        photoURL: new BehaviorSubject<boolean>(false)
      },
      data: {
        photoURL: null
      }
    };

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Evaluation,
    public dialogRef: MatDialogRef<HistoryImageDialogComponent>,
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private ng2ImgMax: Ng2ImgMaxService,
    private storage: AngularFireStorage,
    private  evaltService: EvaluationsService,
    private afs: AngularFirestore,

    ) { }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      photoURL: ['' , Validators.required],
    });
  }
  addNewPhoto(formControlName: string, image: File[]): void {
    this.createForm.get(formControlName).setValue(null);
    if (image.length === 0){
      return;
    }
    const reader = new FileReader();
    this.photos.resizing$[formControlName].next(true);

    this.ng2ImgMax.resizeImage(image[0], 10000, 426)
      .pipe(
        take(1)
      ).subscribe(result => {
        this.photos.data[formControlName] = new File([result], formControlName + result.name.match(/\..*$/));
        reader.readAsDataURL(image[0]);
        reader.onload = (_event) => {
          this.createForm.get(formControlName).setValue(reader.result);
          this.photos.resizing$[formControlName].next(false);
        }
      },
        error => {
          this.photos.resizing$[formControlName].next(false);
          this.snackbar.open('Por favor, elija una imagen en formato JPG, o PNG', 'Aceptar');
          this.createForm.get(formControlName).setValue(null);

        }
      );
  }

  uploadPhoto(id: string, file: File): Observable<string | number> {
    const path = `/evaluations/pictures/${id}-${file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);
    // The main task
    const uploadingTask = this.storage.upload(path, file);

    const snapshot$ = uploadingTask.percentageChanges();
    const url$ = of('url!').pipe(
      switchMap((res) => {
        return <Observable<string>>ref.getDownloadURL();
      }));

    const upload$ = concat(
      snapshot$,
      url$);

    return upload$;
  }

  create(data, photo?: File): void {
    const dataRef = this.afs.firestore.collection(`db/ferreyros/evaluations`).doc(this.data.id);
    const imgData = data;
    const batch = this.afs.firestore.batch();
    let arrayImg = [];
    arrayImg = [...this.data.images];

    this.uploadPhoto(this.data.id, photo).pipe(
      takeLast(1),
    ).subscribe((photoUrl) => {
      imgData.photoURL = <string>photoUrl;
      imgData.photoPath = `/brands/pictures/${this.data.id}-${photo.name}`;
      const url=<string>photoUrl;
      arrayImg.push(url);
      this.data.images = arrayImg;

      batch.update(dataRef, this.data);

      batch.commit().then(() => {
        this.dialogRef.close(true);
        this.loading.next(false);
        this.snackbar.open('se guardo correctamente', 'Cerrar', {
          duration: 6000
        });
      });
    });
  }

  onSubmitForm(): void {
    this.createForm.markAsPending();
    this.createForm.disable();
    this.loading.next(true);

    const newImg = {
      photoURL: '',
      photoPath: '',
    };
    this.create(newImg, this.photos.data.photoURL);
  }

}
