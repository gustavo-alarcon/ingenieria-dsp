import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { AndonService } from '../../../services/andon.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AngularFireStorage } from '@angular/fire/storage';
import { take, tap, finalize } from 'rxjs/operators';
import { Andon, AndonProblemType } from './../../../models/andon.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../../../auth/services/auth.service';
import { User } from '../../../models/user-model';
import { AndonBroadcastList } from '../../../models/andon.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-report-2nd-step',
  templateUrl: './report-2nd-step.component.html',
  styleUrls: ['./report-2nd-step.component.scss'],
})
export class report2ndStepComponent
  implements OnInit, OnDestroy, AfterViewInit {
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

  nameBahia: string;
  workShop: string;
  otChild: number;
  typeProblem$: Observable<AndonProblemType[]>;
  andOn$: Observable<Andon>;
  user: User;

  isHovering: boolean;
  files: File[] = [];
  pathStorage: string;

  subscriptions = new Subscription();
  isMobile = false;

  //Chip email
  emailArray: string[] = [];
  filteredBroadcast$: Observable<AndonBroadcastList[]>;
  broadcastControl = new FormControl();
  listBroadcast: string[] = [];
  // chips
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  counter = 0;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private andonService: AndonService,
    private snackbar: MatSnackBar,
    private ng2ImgMax: Ng2ImgMaxService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private breakpoint: BreakpointObserver,
    public authService: AuthService
  ) {
    const info = this.route.snapshot.paramMap.get('id');
    let parts = [];
    parts = info.split('-');

    this.workShop = parts['0'];
    this.nameBahia = parts['1'];
    this.otChild = parts['2'];

    this.currentId = this.otChild.toString();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.breakpoint
        .observe([Breakpoints.HandsetPortrait])
        .subscribe((res) => {
          if (res.matches) {
            this.isMobile = true;
          } else {
            this.isMobile = false;
          }
        })
    );

    this.subscriptions.add(
      this.authService.user$.subscribe((user) => {
        this.user = user;

        const email = this.user.email;

        this.counter++;
        if (this.counter === 1) {
          this.emailArray.push(email);
        }
      })
    );

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

    this.filteredBroadcast$ = this.andonService.getAllBroadcastList().pipe(
      tap((res: AndonBroadcastList[]) => {
        return res;
      })
    );

    this.loading.next(false);
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
        this.andonService
          .addAndOn(
            this.reportForm.value,
            this.workShop,
            this.nameBahia,
            this.otChild,
            this.user,
            imagesObj,
            this.emailArray)
          .pipe(take(1))
          .subscribe((res) => {
            res
              .commit()
              .then(() => {
                //this.loading.next(false)
                this.snackbar.open('✅ se guardo correctamente!', 'Aceptar', {
                  duration: 6000,
                });
                const code = this.workShop;
                this.router.navigate(['main/andon-reports', code]);
                this.loading.next(false);
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

  uploadFile(event, i?: number): void {
    if (!event.target.files[0]) {
      return;
    }
    this.loading.next(true);
    const file = event.target.files[0];
    this.subscriptions.add(
      this.ng2ImgMax.resize([file], 800, 10000).subscribe((result) => {
        const name = `andon/${this.currentId}/pictures/${this.currentId}-${this.date}-${result.name}.png`;
        const fileRef = this.storage.ref(name);
        const task = this.storage.upload(name, file);
        this.uploadPercent$ = task.percentageChanges();
        this.subscriptions.add(
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

  async deleteImage(imgForDelete: string, index: number): Promise<void> {
    try {
      this.loading.next(true);
      await this.andonService.deleteImage(this.imagesUpload[index]);
      this.imagesUpload.splice(index, 1);
      this.loading.next(false);
    } catch (error) {
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

  removeEmail(email: string): void {
    const index = this.emailArray.indexOf(email);

    if (index >= 0) {
      this.emailArray.splice(index, 1);
    }
  }
  addBroadcast(event: MatChipInputEvent): void {
    const input = event.input;
    console.log('input :', input);
    const value = event.value;
    console.log('value :', value);

    // Add our fruit
    if ((value || '').trim()) {
      this.emailArray.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.broadcastControl.setValue(null);
  }
  selectedBroadcast(event: MatAutocompleteSelectedEvent): void {
    event.option.value.emailList.map((el) => {
      this.emailArray.push(el);
    });

    this.emailInput.nativeElement.value = '';
    this.broadcastControl.setValue(null);
  }

  onClickProblemType(item): void {
    const email = item.email;

    this.emailArray.push(email);
  }
}
