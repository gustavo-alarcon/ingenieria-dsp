import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Andon, AndonBroadcastList, AndonListBahias, AndonProblemType } from 'src/app/main/models/andon.model';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AndonService } from 'src/app/main/services/andon.service';
import { debounceTime, distinctUntilChanged, map, startWith, take, tap } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/main/models/user-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Workshop } from '../../../../../models/evaluations.model';

@Component({
  selector: 'app-reasign-dialog',
  templateUrl: './reasign-dialog.component.html',
  styleUrls: ['./reasign-dialog.component.scss']
})
export class ReasignDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  reportForm: FormGroup;
  currentId: string;
  user: User;

  nameBahias$: Observable<AndonListBahias[]>;

  containerStyle: any;
  reportStyle: any;
  typeProblem$: Observable<AndonProblemType[]>;
  subscriptions = new Subscription();
  isMobile = false;
  imageArray: any = [];

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

  isHovering: boolean;
  files: File[] = [];
  pathStorage: string;

  images: string[];
  imagesUpload: string[] = [''];
  date: string = new Date().toISOString();
  counter = 0;
  
  nameBahia: string;
  workShop: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Andon,
    public dialogRef: MatDialogRef<DetailsDialogComponent>,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private andonService: AndonService,
    private breakpoint: BreakpointObserver,
    public authService: AuthService
  ) { }

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

    this.initForm();

    this.nameBahias$ = combineLatest(
      this.andonService.getAllAndonSettingsListBahias().pipe(
        tap((res: AndonListBahias[]) => {
          const arrayListBahia: AndonListBahias[] = res;
          arrayListBahia.sort((a, b) => {
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });

          return arrayListBahia;
        })
      ),
      this.reportForm.get('name').valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        map(value => typeof value === 'string' ? value.toLowerCase() : value['name'].toLowerCase())
      )
    ).pipe(
      map(([list, value]) => {
        const filteredList = list.filter(element => element['name'].toLowerCase().includes(value));
        return filteredList;
      })
    );

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

    this.imageArray = Object.values(this.data.images);
    this.loading.next(true);
    this.pathStorage = `andon/${this.currentId}/pictures/${this.currentId}`;

  }

  initForm(): void {
    this.reportForm = this.fb.group(
      {
        name: ['', [Validators.required, noSelection()]],
        problemType: ['', Validators.required],
        description: ['']
      }
    );
  }

  report(): void{

  }

  onClickBahia(item: any): void{
    this.nameBahia = item.name;
    this.workShop = item.Workshop;
  }

  displayBay(bay): string | null {
    return bay ? bay['name'] + ' - ' + bay['workShop'] : '';
  }

  updateAndon(): void{
    try {
      this.loading.next(true);
      if (this.reportForm.invalid) {
        this.reportForm.markAllAsTouched();
        this.loading.next(false);
        return;
      } else {
        this.images = [];
        const imagesObj = {};
        this.images = [...this.imageArray, ...this.imagesUpload];
        this.images.pop();
        this.images.forEach((value, index) => {
          imagesObj[index] = value;
        });
        this.andonService
          .updateReasignAndOn(
            this.data.id,
            this.reportForm.value,
            this.user,
            imagesObj,
            this.emailArray)
          .pipe(take(1))
          .subscribe((res) => {
            res
              .commit()
              .then(() => {
                this.snackbar.open('✅ se guardo correctamente!', 'Aceptar', {
                  duration: 6000,
                });
                this.sendEmail(this.emailArray);
                this.loading.next(false);
                this.dialogRef.close();
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

  sendEmail(email: Array<string> ): void{
    //console.log('send email ', email)
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

  async deleteImageAndon(item,index): Promise<void>{
    this.imageArray.splice(index, 1);

    await this.andonService.deleteImage(item);
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
    const value = event.value;

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

export function noSelection(): ValidatorFn {
  return (control: AbstractControl): { noSelection: string } | null => {
    return typeof control.value === 'object'
      ? null : { noSelection: 'Seleccionar una bahía de la lista' };
  }
}