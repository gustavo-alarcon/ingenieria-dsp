import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { AndonService } from '../../../services/andon.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AngularFireStorage } from '@angular/fire/storage';
import { take, tap, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from '../../../../auth/services/auth.service';
import { Andon, AndonProblemType} from './../../../models/andon.model';

@Component({
  selector: 'app-report-2nd-step',
  templateUrl: './report-2nd-step.component.html',
  styleUrls: ['./report-2nd-step.component.scss'],
})
export class report2ndStepComponent implements OnInit, OnDestroy {
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

  wrokShop: string;
  otChild: number;
  typeProblem$: Observable<AndonProblemType[]>;
  andOn$: Observable<Andon>;


  isHovering: boolean;
  files: File[] = [];

  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private andonService: AndonService,
    private snackbar: MatSnackBar,
    private ng2ImgMax: Ng2ImgMaxService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.currentId = this.route.snapshot.paramMap.get('id');

  }

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      problemType: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.loading.next(true);

    this.subscription.add(
      this.andonService.getAndonById(this.currentId).subscribe((res: Andon) => {
        let andon: Andon;
        andon = res['0'];
        this.otChild = andon.otChild;
        this.wrokShop = andon.workShop;
      })
    );

    this.typeProblem$ = this.andonService.getAllAndonSettingsProblemType().pipe(
      tap((res) => {
        return res;
      })
    );
    this.loading.next(false);
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
        this.andonService.updateAndon(this.currentId, this.reportForm.value)
          .pipe(take(1))
          .subscribe((res) => {
            res.commit().then(() => {
              this.snackbar.open('✅ Se actualizo correctamente', 'Aceptar', {
                duration: 6000,
              });
              const code =  this.wrokShop;
              this.router.navigate(['main/andon-reports', code]);
              this.loading.next(false);

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
}
