import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Andon } from '../../../../../models/andon.model';
import { AndonService } from '../../../../../services/andon.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AngularFireStorage } from '@angular/fire/storage';
import { tap, finalize, take } from 'rxjs/operators';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { User } from '../../../../../models/user-model';

@Component({
  selector: 'app-return-dialog',
  templateUrl: './return-dialog.component.html',
  styleUrls: ['./return-dialog.component.scss']
})
export class ReturnDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  returnForm: FormGroup;

  images: string[];
  imagesUpload: string[] = [''];
  date: string = new Date().toISOString();

  uploadPercent$: Observable<number>;
  filteredOptions: Observable<string[]>;
  user: User;

  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private andonService: AndonService,
    public authService: AuthService,
    private snackbar: MatSnackBar,
    private ng2ImgMax: Ng2ImgMaxService,
    private storage: AngularFireStorage,
    @Inject(MAT_DIALOG_DATA) public data: Andon,
    public dialogRef: MatDialogRef<ReturnDialogComponent>,
  ) {
    if (data.images) {
      const arr = Object.values(data.images);
      this.images = [...arr];
    } else {
      this.images = [];
    }
  }

  ngOnInit(): void {
    this.returnForm = this.fb.group({
      comments: ['', Validators.required],
    });
    this.loading.next(true);
    this.subscription.add(this.authService.user$.subscribe(user => {
      this.user = user;
    }));
    this.loading.next(false);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  save(): void {
    try {
      this.loading.next(true);
      if (this.returnForm.invalid) {
        this.returnForm.markAllAsTouched();
        this.loading.next(false);
        return;
      } else {
        const imagesObj = {};
        this.images = [...this.images, ...this.imagesUpload];
        this.images.pop();
        this.images.forEach((value, index) => {
          imagesObj[index] = value;
        });
        this.andonService.updateAndonAddComments(this.data, this.returnForm.value, imagesObj, this.user )
          .pipe(take(1))
          .subscribe((res) => {
            res.commit().then(() => {
              this.snackbar.open('✅ Se retomo correctamente', 'Aceptar', {
                duration: 6000,
              });
              this.loading.next(false);
              this.dialogRef.close(true);
            });
            });
      }
    }catch (error) {
      this.snackbar.open( '🚨 Error al actualizar' + `${error}`, 'Aceptar', {
        duration: 6000,
      });
      this.loading.next(false);

    }
  }
  uploadFile(event, i?: number): void {
    if (!event.target.files[0]) {
      return;
    }
    this.loading.next(true);
    const file = event.target.files[0];
    this.subscription.add(
      this.ng2ImgMax.resize([file], 800, 1000).subscribe((result) => {
        const name = `andon/${this.data.id}/pictures/${this.data.id}-${this.date}-${result.name}.png`;
        const fileRef = this.storage.ref(name);
        const task = this.storage.upload(name, file);
        this.uploadPercent$ = task.percentageChanges();
        this.subscription.add(
          task
            .snapshotChanges()
            .pipe(
              finalize(() => {
                fileRef.getDownloadURL().subscribe((url) => {
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
      })
    );
  }

  get imagesArray(): FormArray {
    return this.returnForm.get('images') as FormArray;
  }
  async deleteImage(imgForDelete: string, index: number): Promise<void> {
    try {
      this.loading.next(true);
      await this.andonService.deleteImage(this.imagesUpload[index]);
      this.imagesUpload.splice(index, 1);
      this.loading.next(false);
    } catch (error) {
      console.log(error);
      this.loading.next(false);
      this.imagesUpload.splice(index, 1);
    }
  }
}
