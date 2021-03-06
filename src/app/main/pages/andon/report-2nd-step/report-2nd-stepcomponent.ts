import { Andon } from './../../../models/andon.model';
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

  images: string[];
  imagesUpload: string[] = [''];
  date: string = new Date().toISOString();

  uploadPercent$: Observable<number>;
  filteredOptions: Observable<string[]>;

  name: string;
  otChild: string;

  typeProblem = [
    { name: 'Seguridad' },
    { name: 'Insumos' },
    { name: 'Calidad' },
    { name: 'Maquinas' },
    { name: 'Administrativo' },
    { name: 'Soporte' },
  ];

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
    let sep = '-';
    let arrayText = this.currentId.split(sep);
    this.name = arrayText[0];
    this.otChild = arrayText[1];

    console.log(this.name);
    console.log(this.otChild);
  }

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      problemType: ['', Validators.required],
      description: ['', Validators.required],
    });

    console.log(this.currentId);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  save(): void {
    this.loading.next(true);
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      this.loading.next(false);
      return;
    } else {
      this.auth.user$
        .pipe(
          take(1),
          switchMap((user) => {
            this.images = [];
            const imagesObj = {};
            this.images = [...this.images, ...this.imagesUpload];
            this.images.pop();
            this.images.forEach((value, index) => {
              imagesObj[index] = value;
            });
            return this.andonService.addAndon(
              this.reportForm.value,
              imagesObj,
              user,
              this.name,
              parseInt(this.otChild)
            );
          })
        )
        .subscribe((batch) => {
          if (batch) {
            batch
              .commit()
              .then(() => {
                this.loading.next(false);
                this.snackbar.open('✅ se guardo correctamente!', 'Aceptar', {
                  duration: 6000,
                });
                this.router.navigate(['main/andon-reports']);
              })
              .catch((err) => {
                this.loading.next(false);
                this.snackbar.open('🚨 Hubo un error.', 'Aceptar', {
                  duration: 6000,
                });
              });
          }
        });
    }
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

  uploadFile(event, i?: number): void {
    if (!event.target.files[0]) {
      return;
    }
    this.loading.next(true);
    const file = event.target.files[0];
    this.subscription.add(
      this.ng2ImgMax.resize([file], 800, 1000).subscribe((result) => {
        const name = `andon/${this.otChild}/pictures/${this.otChild}-${this.date}-${result.name}.png`;
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
            )
            .subscribe()
        );
      })
    );
  }

  get imagesArray(): FormArray {
    return this.reportForm.get('images') as FormArray;
  }
}
