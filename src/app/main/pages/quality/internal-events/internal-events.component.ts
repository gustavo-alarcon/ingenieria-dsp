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
import { ComponentList, WorkshopList, FileAdditional } from '../../../models/quality.model';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WorkshopModel } from '../../../../main/models/workshop.model';
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

  workshop$: Observable<WorkshopList[]>;
  component$: Observable<ComponentList[]>;


  @ViewChild("fileInput2", { read: ElementRef }) fileButton: ElementRef;

  dataFiles: FileAdditional[] = [];

  allCompleteField: boolean = false;

  workshopName = new FormControl(null);
  workshopProcess = new FormControl(null);


  filteredOptionsWorkshopName$: Observable<WorkshopModel[]>;
  optionsWorkshopName: WorkshopModel[] = [];

  filteredOptionsWorkshopProcess$: Observable<string[]>;
  optionsWorkshopProcess: string[] = [];

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
      this.qualityService.getAllQualityInternalWorkshop().pipe(
      ).subscribe(resp => {
        this.optionsWorkshopName = resp;
        this.filteredOptionsWorkshopName$ = this.workshopName.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filterWorkshopName(name) : this.optionsWorkshopName.slice())
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
      this.workshopName = new FormControl(null, Validators.required);
      this.workshopProcess = new FormControl(null, Validators.required);
      this.workshopName.markAllAsTouched();
      this.workshopProcess.markAllAsTouched();
    } else {
      this.workshopName = new FormControl(null);
      this.workshopProcess = new FormControl(null);
    }
  }

  

  private _filterWorkshopName(workshopName: string): WorkshopModel[] {
    const filterValue = workshopName.toLowerCase();
    return this.optionsWorkshopName.filter(option => option.workshopName.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterWorkshopProcess(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.optionsWorkshopProcess.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(workshop: WorkshopModel): string {
    return workshop && workshop.workshopName ? workshop.workshopName : '';
  }

  setSelectedWorkshop(event: MatAutocompleteSelectedEvent): void {
    const { workshopProcessName } = event.option.value;
    this.optionsWorkshopProcess = [...workshopProcessName];

    this.filteredOptionsWorkshopProcess$ = this.workshopProcess.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterWorkshopProcess(value))
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
            this.workshopName.value,
            this.workshopProcess.value
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
 

}
