import {
  FormGroup,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { QualityService } from 'src/app/main/services/quality.service';
import { User } from '../../../models/user-model';
import { finalize, take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ComponentList, WorkShopList } from '../../../models/quality.model';

@Component({
  selector: 'app-internal-events',
  templateUrl: './internal-events.component.html',
  styleUrls: ['./internal-events.component.scss'],
})
export class InternalEventsComponent implements OnInit, OnDestroy {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  internalForm: FormGroup;
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
  
  isMobile = false;

  componentList: ComponentList[] = [
    { code: 1, name: 'Componente 1' },
    { code: 2, name: 'Componente 2'},
    { code: 3, name: 'Componente 3'},
    { code: 4, name: 'Componente 4'},
    { code: 5, name: 'Componente 5'},
  ];
  workShopList: WorkShopList[] = [
    { code: 1, name: 'Taller 1' },
    { code: 2, name: 'Taller 2'},
    { code: 3, name: 'Taller 3'},
    { code: 4, name: 'Taller 4'},
    { code: 5, name: 'Taller 5'},
  ];
  
  @ViewChild("fileInput2", { read: ElementRef }) fileButton: ElementRef;

  constructor(
    private breakpoint: BreakpointObserver,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private qualityService: QualityService,
    private storage: AngularFireStorage
  ) {}


  ngOnInit(): void {
    this.subscription.add(this.breakpoint.observe([Breakpoints.HandsetPortrait])
      .subscribe(res => {
        if (res.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      })
    )

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

  initFormInternal(): void {
    this.internalForm = this.fb.group({
      component: ['', Validators.required],
      workdOrden: ['', Validators.required],
      workShop: ['', Validators.required],
      nPart: ['', Validators.required],
      eventDetail: ['', Validators.required],
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

      this.internalForm.markAsPristine();
      this.internalForm.markAsUntouched();

      this.loading.next(true);
      if (this.internalForm.invalid) {
        this.internalForm.markAllAsTouched();
        this.loading.next(false);
        return;
      } else {

        this.imagesGeneral = [];
        this.imagesGeneral = [...this.imagesUploadGeneral];

        this.imagesDetail = [];
        this.imagesDetail = [...this.imagesUploadDetail];

        this.qualityService
          .addQualityInternal(
            this.internalForm.value,
            this.user,
            this.imagesGeneral,
            this.imagesDetail,
            this.uploadFile,
            this.nameFileSelect
          )
          .pipe(take(1))
          .subscribe((res) => {
            res
              .commit()
              .then(() => {
                //this.loading.next(false)
                this.snackbar.open('✅ Se guardo correctamente!', 'Aceptar', {
                  duration: 6000,
                });
                this.loading.next(false);
                this.internalForm.reset();
                this.filesDetail = [];
                this.filesGeneral = [];
                this.uploadFile = [];
                this.nameFileSelect = '';
                this.imagesGeneral = [];
                this.imagesDetail = [];
                this.internalForm.clearValidators();
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
    console.log('image general :', image)
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
