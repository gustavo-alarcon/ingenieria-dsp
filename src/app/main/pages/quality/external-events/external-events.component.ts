import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, Observable, combineLatest } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../auth/services/auth.service';
import { QualityService } from '../../../services/quality.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from '../../../models/user-model';
import { finalize, take, startWith, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ComponentList, MiningOperation, FileAdditional } from '../../../models/quality.model';
import { MatDialog } from '@angular/material/dialog';
import { AddMiningOperationDialogComponent } from './dialogs/add-mining-operation-dialog/add-mining-operation-dialog.component';
import { AddComponentComponent } from './dialogs/add-component/add-component.component';
import { Router } from '@angular/router';
import { WorkshopModel } from 'src/app/main/models/workshop.model';

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

  snapshot: Observable<any>;
  subscriptions = new Subscription();
  isMobile = false;

  miningOperation$: Observable<MiningOperation[]>;
  component$: Observable<ComponentList[]>;

  dataFiles: FileAdditional[] = [];

  filteredOptionsWorkshopName$: Observable<WorkshopModel[]>;
  optionsWorkshopName: WorkshopModel[] = [];

  constructor(
    public dialog: MatDialog,
    private breakpoint: BreakpointObserver,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private qualityService: QualityService,
    private storage: AngularFireStorage,
    private router: Router
  ) { }


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

    this.initFormInternal();

    this.subscription.add(
      this.qualityService.getAllQualityInternalWorkshop().pipe(
      ).subscribe(resp => {
        this.optionsWorkshopName = resp;
        this.filteredOptionsWorkshopName$ = this.externalForm.get('workshopName').valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filterWorkshopName(name) : this.optionsWorkshopName.slice())
          );
      })
    );

    this.miningOperation$ = combineLatest(
      this.externalForm.get('miningOperation').valueChanges.pipe(
        startWith(''),
        map((name) => (name ? name : ''))
      ),
      this.qualityService.getAllMiningOperationList()
    ).pipe(
      map(([formValue, miningOperation]) => {
        const filter = miningOperation.filter((el) =>
          formValue
            ? el.name.toLowerCase().includes(formValue.toLowerCase())
            : true
        );
        if (!(filter.length === 1) && formValue.length) {
          this.externalForm.get('miningOperation').setErrors({ invalid: true });
        }

        return filter;
      })
    );

    this.component$ = combineLatest(
      this.externalForm.get('component').valueChanges.pipe(
        startWith(''),
        map((name) => (name ? name : ''))
      ),
      this.qualityService.getAllComponentsListExternal()
    ).pipe(
      map(([formValue, components]) => {
        const filter = components.filter((el) =>
          formValue
            ? el.name.toLowerCase().includes(formValue.toLowerCase())
            : true
        );
        if (!(filter.length === 1) && formValue.length) {
          this.externalForm.get('component').setErrors({ invalid: true });
        }

        return filter;
      })
    );

    this.subscription.add(
      this.authService.user$.subscribe((user) => {
        this.user = user;
      })
    );
    this.pathStorageGeneral = `quality/general/pictures`;
    this.pathStorageDetail = `quality/detail/pictures`;
    this.pathStorageFile = `quality/files`;

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initFormInternal(): void {
    this.externalForm = this.fb.group({
      workdOrden: ['', Validators.required],
      component: ['', Validators.required],
      nPackage: ['', Validators.required],
      componentHourMeter: ['', [
        Validators.required,
        Validators.pattern(/^(0|\-?[1-9][0-9]*)$/)]],
      nPart: ['', Validators.required],
      miningOperation: ['', Validators.required],
      question1: ['', Validators.required],
      question2: ['', Validators.required],
      question3: ['', Validators.required],
      question4: ['', Validators.required],
      workshopName: ['', Validators.required]
    });

  }

  uploadFiles(event): void {
    const files = event.target.files;
    if (!files) {
      return;
    }

    const date = new Date();
    for (let event of files) {
      this.loading.next(true);
      const file = event;
      const filename = event.name;

      const name = `${this.pathStorageFile}/${date}-${filename}`;
      const fileRef = this.storage.ref(name);
      const task = this.storage.upload(name, file);

      this.uploadPercent$ = task.percentageChanges();
      this.subscription.add(
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((link) => {
                if (link) {
                  const dataImage: FileAdditional = {
                    name: filename,
                    url: link,
                  };

                  this.dataFiles.push(dataImage);

                  this.fileSelect = true;
                }
              });
              this.loading.next(false);
            })
          ).subscribe()
      );
    }

  }

  isActive(snapshot): boolean {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
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
        this.imagesGeneral = [...this.imagesUploadGeneral];

        this.imagesDetail = [];
        this.imagesDetail = [...this.imagesUploadDetail];

        this.qualityService
          .addQualityExternal(
            this.externalForm.value,
            this.user,
            this.imagesGeneral,
            this.imagesDetail,
            this.dataFiles
          )
          .pipe(take(1))
          .subscribe((res) => {
            res
              .commit()
              .then(() => {
                //this.loading.next(false)
                this.snackbar.open('✅ Evento guardado correctamente!', 'IR A ANALISIS', {
                  duration: 6000,
                }).onAction()
                  .pipe(
                    take(1)
                  )
                  .subscribe(() => {
                    this.router.navigateByUrl('main/quality-analysis/records')
                  })

                this.loading.next(false);
                this.externalForm.reset();
                this.filesDetail = [];
                this.filesGeneral = [];
                this.uploadFile = [];
                this.nameFileSelect = '';
                this.imagesDetail = [];
                this.imagesGeneral = [];
                this.dataFiles = [];
                this.externalForm.markAsPristine();
                this.externalForm.markAsUntouched();
              })
              .catch((err) => {
                this.snackbar.open('🚨 Hubo un error.', 'Aceptar', {
                  duration: 6000,
                });
              });
          });
      }
    } catch (error) {
      this.snackbar.open('🚨 Hubo un error, debe de ingresar todo los datos requeridos', 'Aceptar', {
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
  onAddminingOperation(): void {
    this.dialog.open(AddMiningOperationDialogComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }

  async deleteImageGeneral(event): Promise<void> {
    try {
      this.loading.next(true);
      this.qualityService.deleteImage(event);

      const i = this.imagesUploadGeneral.indexOf(event);
      if (i !== -1) {
        this.imagesUploadGeneral.splice(i, 1);
      }
      this.loading.next(false);

    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }

  }
  async deleteImageDetail(event): Promise<void> {
    try {
      this.loading.next(true);
      this.qualityService.deleteImage(event);

      const i = this.imagesUploadGeneral.indexOf(event);
      if (i !== -1) {
        this.imagesUploadGeneral.splice(i, 1);
      }
      this.loading.next(false);

    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }

  }

  async deleteDataFiles(url, index): Promise<void> {
    try {
      this.loading.next(true);
      this.qualityService.deleteImage(url);

      this.dataFiles.splice(index, 1);
      this.loading.next(false);

    } catch (error) {
      console.log(error);
      this.loading.next(false);
    }

  }

  onAddComponent(): void {
    this.dialog.open(AddComponentComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }

  displayFn(workshop: WorkshopModel): string {
    return workshop && workshop.workshopName ? workshop.workshopName : '';
  }

  private _filterWorkshopName(workshopName: string): WorkshopModel[] {
    const filterValue = workshopName.toLowerCase();
    return this.optionsWorkshopName.filter(option => option.workshopName.toLowerCase().indexOf(filterValue) === 0);
  }

}
