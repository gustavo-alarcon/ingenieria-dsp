import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImprovementsService } from '../../../services/improvements.service';
import { switchMap, take, tap } from 'rxjs/operators';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { SparePart } from '../../../models/improvenents.model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FrequenciesService } from 'src/app/main/services/frequencies.service';
import { OtDialogComponent } from './dialogs/ot-dialog/ot-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-spare-parts',
  templateUrl: './spare-parts.component.html',
  styleUrls: ['./spare-parts.component.scss'],
})
export class SparePartsComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput2', { read: ElementRef }) fileButton: ElementRef;

  checked: boolean = false;
  selectCkeck: number;
  selected: any[];

  dataSparePart: SparePart[] = [];

  checkedParts$: Observable<SparePart[]>;

  subscriptions = new Subscription();
  isMobile: boolean;

  improvementControl = new FormControl();

  singleCheckedPart: SparePart;
  threshold: number = 0;

  constructor(
    private breakpoint: BreakpointObserver,
    private snackBar: MatSnackBar,
    private impServices: ImprovementsService,
    public authService: AuthService,
    private freqService: FrequenciesService,
    private dialog: MatDialog
  ) {}

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
      this.authService.getGeneralConfig().subscribe((generalConfig) => {
        this.threshold = generalConfig.frequencyThreshold;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onFileSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.selected = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });

        const csvRead = this.selected.slice(3, this.selected.length);
        let dataReconstructed = [];
        let readType;

        csvRead.forEach((element) => {
          if (element[5]) {
            readType = 1;
            element[0] = element[0].replaceAll('-', '');
            dataReconstructed.push(element);
          } else {
            // const fixedData = element[0].replaceAll('-', '').replaceAll('"', '').split(',')
            readType = 2;
            let tempArray = element[0].split(',');
            tempArray[0] = tempArray[0].replaceAll('-', '');

            dataReconstructed.push(tempArray);
          }
        });

        this.upLoadXls(dataReconstructed, readType);
      };
      reader.readAsBinaryString(event.target.files[0]);
    }
  }

  changeValue(value, i) {
    this.checked = !value;
    this.selectCkeck = i;
  }

  upLoadXls(xlsx, readType): void {
    xlsx.shift();

    let obsArray: Array<Observable<SparePart>> = [];

    if (xlsx.length > 0) {
      xlsx.forEach((el) => {
        let temp = Object.values(el);
        let obs = this.impServices.checkPart(temp, readType);
        obsArray.push(obs);
      });

      this.checkedParts$ = combineLatest(obsArray).pipe(
        switchMap((list) => {
          return this.freqService.getMatchedFrequencies(list).pipe(
            tap((res) => {
              this.dataSparePart = res;
              this.fileButton.nativeElement.value = null;
            })
          );
        }),
        tap((res) => {
          console.log(res);
        })
      );
    } else {
      this.snackBar.open('El archivo esta vacío', 'Aceptar', {
        duration: 3000,
      });
    }
  }

  downloadXls(): void {
    if (this.dataSparePart.length < 1) return;

    this.dialog.open(OtDialogComponent, {
      data: {
        list: this.dataSparePart,
        threshold: this.threshold
      }
    });
  }

  singleImprovementCheck(): void {
    this.singleCheckedPart = null;

    if (this.improvementControl.value) {
      const part = [this.improvementControl.value, '', '', '', '', '', '', ''];

      this.impServices
        .checkPart(part, 1)
        .pipe(take(1))
        .subscribe((spare) => {
          if (spare) {
            this.singleCheckedPart = spare;
          }
        });
    }
  }

  deleteResult(index: number): void {
    this.dataSparePart.splice(index, 1);
  }
}
