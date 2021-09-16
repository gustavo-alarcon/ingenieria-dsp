import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from '@angular/forms';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription, Observable, combineLatest } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { QualityService } from 'src/app/main/services/quality.service';
import { User } from '../../../models/user-model';
import { finalize, take, startWith, map, tap, pluck } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ComponentList, WorkShopList, FileAdditional } from '../../../models/quality.model';
import { MatDialog } from '@angular/material/dialog';
import { AddWorkshopComponent } from './dialogs/add-workshop/add-workshop.component';
import { AddComponentComponent } from './dialogs/add-component/add-component.component';
import { Router } from '@angular/router';
import { WorkShopModel } from '../../../../main/models/workshop.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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
  nameFileSelect = '';
  isHoveringFile: boolean;
  uploadPercent$: Observable<number>;


  subscription = new Subscription();
  user: User;

  isMobile = false;

  workshop$: Observable<WorkShopList[]>;
  component$: Observable<ComponentList[]>;


  @ViewChild("fileInput2", { read: ElementRef }) fileButton: ElementRef;

  dataFiles: FileAdditional[] = [];

  allCompleteField: boolean = false;

  // optionsWorkShop: string[] = [];
  // optionsWorkShopProgress: string[] = [];
  // filteredOptionsWorkShop$: Observable<string[]>;
  // filteredOptionsWorkShopProgress$: Observable<string[]>;

  workShopName = new FormControl(null);
  workShopProgress = new FormControl(null);


  filteredOptionsWorkShopName$: Observable<WorkShopModel[]>;
  optionsWorkShopName: WorkShopModel[] = [];

  filteredOptionsWorkShopProgress$: Observable<string[]>;
  optionsWorkShopProgress: string[] = [];

  constructor(
    private breakpoint: BreakpointObserver,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private qualityService: QualityService,
    private storage: AngularFireStorage,
    private dialog: MatDialog,
    private router: Router
  ) { }




  ngOnInit(): void {
    this.initFormInternal();
    this.subscription.add(
      this.qualityService.getAllQualityInternalWorkShop().pipe(
      ).subscribe(resp => {
        this.optionsWorkShopName = resp;
        console.log(resp)
        this.filteredOptionsWorkShopName$ = this.workShopName.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filterWorkShopName(name) : this.optionsWorkShopName.slice())
          );
      })
    );

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

    this.workshop$ = combineLatest(
      this.internalForm.get('workShop').valueChanges.pipe(
        startWith(''),
        map((name) => (name ? name : ''))
      ),
      this.qualityService.getAllWorkshopList()
    ).pipe(
      map(([formValue, miningOperation]) => {
        const filter = miningOperation.filter((el) =>
          formValue
            ? el.name.toLowerCase().includes(formValue.toLowerCase())
            : true
        );
        if (!(filter.length === 1) && formValue.length) {
          this.internalForm.get('workShop').setErrors({ invalid: true });
        }

        return filter;
      })
    );

    this.component$ = combineLatest(
      this.internalForm.get('component').valueChanges.pipe(
        startWith(''),
        map((name) => (name ? name : ''))
      ),
      this.qualityService.getAllComponentsListInternal()
    ).pipe(
      map(([formValue, components]) => {
        const filter = components.filter((el) =>
          formValue
            ? el.name.toLowerCase().includes(formValue.toLowerCase())
            : true
        );
        if (!(filter.length === 1) && formValue.length) {
          this.internalForm.get('components').setErrors({ invalid: true });
        }

        return filter;
      })
    );
  }

  setFields(event: boolean): void {
    this.allCompleteField = !this.allCompleteField;
    if (event) {
      this.workShopName = new FormControl(null, Validators.required);
      this.workShopProgress = new FormControl(null, Validators.required);
      this.workShopName.markAllAsTouched();
      this.workShopProgress.markAllAsTouched();
    } else {
      this.workShopName = new FormControl(null);
      this.workShopProgress = new FormControl(null);
    }
  }

  

  private _filterWorkShopName(workShopName: string): WorkShopModel[] {
    const filterValue = workShopName.toLowerCase();
    return this.optionsWorkShopName.filter(option => option.workShopName.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterWorkShopProgress(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.optionsWorkShopProgress.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(workShop: WorkShopModel): string {
    return workShop && workShop.workShopName ? workShop.workShopName : '';
  }

  setSelectedArea(event: MatAutocompleteSelectedEvent): void {
    const { workShopProgressName } = event.option.value;
    this.optionsWorkShopProgress = [...workShopProgressName];

    this.filteredOptionsWorkShopProgress$ = this.workShopProgress.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterWorkShopProgress(value))
      );
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
            this.dataFiles,
            this.workShopName.value,
            this.workShopProgress.value
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
                this.internalForm.reset();
                this.filesDetail = [];
                this.filesGeneral = [];
                this.uploadFile = [];
                this.nameFileSelect = '';
                this.imagesGeneral = [];
                this.imagesDetail = [];
                this.dataFiles = [];
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
  onAddWorkshop(): void {
    this.dialog.open(AddWorkshopComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }

  onAddComponent(): void {
    this.dialog.open(AddComponentComponent, {
      maxWidth: 500,
      width: '90vw',
    });
  }

}
