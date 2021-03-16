import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { AndonService } from '../../../services/andon.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AngularFireStorage } from '@angular/fire/storage';
import { take, tap, finalize } from 'rxjs/operators';
import { Andon, AndonProblemType } from './../../../models/andon.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-report-2nd-step',
  templateUrl: './report-2nd-step.component.html',
  styleUrls: ['./report-2nd-step.component.scss'],
})
export class report2ndStepComponent implements OnInit, OnDestroy, AfterViewInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  reportForm: FormGroup;
  currentId: string;
  module = 'andon';

  images: string[];
  imagesUpload: string[] = [''];
  date: string = new Date().toISOString();

  uploadPercent$: Observable<number>;
  filteredOptions: Observable<string[]>;

  workShop: string;
  otChild: number;
  typeProblem$: Observable<AndonProblemType[]>;
  andOn$: Observable<Andon>;


  isHovering: boolean;
  files: File[] = [];
  pathStorage: string;
  subscription = new Subscription();

  isMobile = false;
  containerStyle: any;
  reportStyle: any;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private andonService: AndonService,
    private snackbar: MatSnackBar,
    private ng2ImgMax: Ng2ImgMaxService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private breakpoint: BreakpointObserver
  ) {
    this.currentId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.subscription.add(this.breakpoint.observe([Breakpoints.HandsetPortrait])
      .subscribe(res => {
        if (res.matches) {
          this.isMobile = true;
          this.setHandsetContainer();
          this.setHandsetReport();
        } else {
          this.isMobile = false;
          this.setDesktopContainer();
          this.setDesktopReport();
        }
      })
    )

    this.reportForm = this.fb.group({
      problemType: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.loading.next(true);
    this.pathStorage = `andon/${this.currentId}/pictures/${this.currentId}`;



    this.typeProblem$ = this.andonService.getAllAndonSettingsProblemType().pipe(
      tap((res) => {
        return res;
      })
    );
    this.loading.next(false);
  }

  ngAfterViewInit(): void {
    console.log(this.currentId)
    this.subscription.add(
      this.andonService.getAndonById(this.currentId).subscribe((res: Andon) => {
        if (res) {
          let andon: Andon;
          andon = res['0'];
          this.otChild = andon.otChild;
          this.workShop = andon.workShop;
        }

      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  save(): void {
    try {
      this.loading.next(true);
      if (this.reportForm.invalid) {
        this.reportForm.markAllAsTouched();
        this.loading.next(false);
        return;
      } else {
        this.images = [];
        const imagesObj = {};
        this.images = [...this.images, ...this.imagesUpload];
        this.images.pop();
        this.images.forEach((value, index) => {
          imagesObj[index] = value;
        });
        this.andonService.updateAndon(this.currentId, this.reportForm.value, imagesObj)
          .pipe(take(1))
          .subscribe((res) => {
            res.commit().then(() => {
              this.snackbar.open('✅ Se actualizo correctamente', 'Aceptar', {
                duration: 6000,
              });
              const code = this.workShop;
              this.router.navigate(['main/andon-reports', code]);
              this.loading.next(false);

            });
          });
      }
    } catch (error) {
      this.snackbar.open('🚨 Error al actualizar' + `${error}`, 'Aceptar', {
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
      this.ng2ImgMax.resize([file], 800, 10000).subscribe((result) => {
        const name = `andon/${this.currentId}/pictures/${this.currentId}-${this.date}-${result.name}.png`;
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
    return this.reportForm.get('images') as FormArray;
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

  toggleHover(event: boolean): void {
    this.isHovering = event;
  }

  onDrop(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

  addNewImage(image: string): void {
    this.imagesUpload.pop();
    this.imagesUpload.push(image);
    this.imagesUpload.push('');
  }

  setHandsetContainer(): void {
    this.containerStyle = {
      'margin': '30px 24px 30px 24px'
    }
  }

  setDesktopContainer(): void {
    this.containerStyle = {
      'margin': '30px 80px 30px 80px',
    }
  }

  setHandsetReport(): void {
    this.reportStyle = {
      'width': 'fit-content',
      'margin': '24px auto',
    }
  }

  setDesktopReport(): void {
    this.reportStyle = {
      'padding': '24px 24px',
      'border': '1px solid lightgrey',
      'border-radius': '10px 10px 10px 10px',
      'width': 'fit-content',
      'margin': '24px auto',
      'box-shadow': '2px 2px 4px lightgrey'
    }
  }
}
