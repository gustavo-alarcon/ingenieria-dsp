import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../auth/services/auth.service';
import { QualityService } from '../../../services/quality.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from '../../../models/user-model';
import { finalize, take } from 'rxjs/operators';

@Component({
  selector: 'app-external-events',
  templateUrl: './external-events.component.html',
  styleUrls: ['./external-events.component.scss']
})
export class ExternalEventsComponent implements OnInit {
  
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  externalForm: FormGroup;
  selected: any;

  // upload image general
  imagesUploadGeneral: string[] = [''];
  imagesGeneral: string[];
  filesGeneral: File[] = [];
  pathStorageGeneral: string;
  isHoveringGeneral: boolean;

  // upload images detail
  imagesUploadDetail: string[] = [''];
  imagesDetail: string[];
  filesDetail: File[] = [];
  pathStorageDetail: string;
  isHoveringDetail: boolean;

  // upload images detail
  uploadFile: string[] = [''];
  nameFiles: string[];
  files: File[] = [];
  pathStorageFile: string;
  fileSelect = false;
  nameFileSelect: string;
  isHoveringFile: boolean;
  uploadPercent$: Observable<number>;


  subscription = new Subscription();
  user: User;

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private qualityService: QualityService,
    private storage: AngularFireStorage
  ) {}


  ngOnInit(): void {
    this.subscription.add(
      this.authService.user$.subscribe((user) => {
        this.user = user;
      })
    );
    this.pathStorageGeneral = `quality/general/pictures`;
    this.pathStorageDetail = `quality/detail/pictures`;
    this.pathStorageFile = `quality/files`;

    this.initFormInternal();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initFormInternal(): void{
    this.externalForm = this.fb.group({
      description: ['', Validators.required],
      workdOrden: ['', Validators.required],
      component: ['', Validators.required],
      nPackage : ['', Validators.required],
      componentHourMeter : ['', Validators.required],
      nPart: ['', Validators.required],
      miningOperation: ['', Validators.required],
      question1: ['', Validators.required],
      question2: ['', Validators.required],
      question3: ['', Validators.required],
      question4: ['', Validators.required],
    });

  }


  uploadFiles(event, i?: number): void {
    if (!event.target.files[0]) {
      return;
    }
    const date = new Date();
    this.loading.next(true);
    const file = event.target.files[0];
    const filename = event.target.files[0].name;

    const name = `${this.pathStorageFile}/${date}-${filename}`;
    const fileRef = this.storage.ref(name);
    const task = this.storage.upload(name, file);

    this.uploadPercent$ = task.percentageChanges();
    this.subscription.add(
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              if (url) {
               this.uploadFile = url;
               this.nameFileSelect = filename ;
               this.fileSelect = true;
              }
            });
            this.loading.next(false);
          })
        ).subscribe()
    );
  }

  save(): void {
    try {
      this.loading.next(true);
      if (this.externalForm.invalid) {
        this.externalForm.markAllAsTouched();
        this.loading.next(false);
        return;
      } else {
        this.imagesGeneral = [];
        const imagesObjGeneral = {};
        this.imagesGeneral = [
          ...this.imagesGeneral,
          ...this.imagesUploadGeneral,
        ];
        this.imagesGeneral.pop();
        this.imagesGeneral.forEach((value, index) => {
          imagesObjGeneral[index] = value;
        });

        this.imagesDetail = [];
        const imagesObjDetail = {};
        this.imagesDetail = [...this.imagesDetail, ...this.imagesUploadDetail];
        this.imagesDetail.pop();
        this.imagesDetail.forEach((value, index) => {
          imagesObjDetail[index] = value;
        });

        this.qualityService
          .addQualityInternal(
            this.externalForm.value,
            this.user,
            imagesObjGeneral,
            imagesObjDetail,
            this.uploadFile
          )
          .pipe(take(1))
          .subscribe((res) => {
            res
              .commit()
              .then(() => {
                //this.loading.next(false)
                this.snackbar.open('✅ se guardo correctamente!', 'Aceptar', {
                  duration: 6000,
                });
                this.loading.next(false);
                this.externalForm.reset();
                this.filesDetail = [];
                this.filesGeneral = [];
                this.uploadFile = [];
                this.nameFileSelect = '';
              })
              .catch((err) => {
                this.snackbar.open('🚨 Hubo un error.', 'Aceptar', {
                  duration: 6000,
                });
              });
          });
      }
    } catch (error) {
      this.snackbar.open('🚨 Hubo un error.' + `${error}`, 'Aceptar', {
        duration: 6000,
      });
      this.loading.next(false);
    }
  }

  addNewImageGeneral(image: string): void {
    this.imagesUploadGeneral.pop();
    this.imagesUploadGeneral.push(image);
    this.imagesUploadGeneral.push('');
  }

  toggleHoverGeneral(event: boolean): void {
    this.isHoveringGeneral = event;
  }

  onDropGeneral(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      this.filesGeneral.push(files.item(i));
    }
  }

  addNewImageDetail(image: string): void {
    this.imagesUploadDetail.pop();
    this.imagesUploadDetail.push(image);
    this.imagesUploadDetail.push('');
  }
  toggleHoverDetail(event: boolean): void {
    this.isHoveringDetail = event;
  }

  onDropDetail(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      this.filesDetail.push(files.item(i));
    }
  }


}
