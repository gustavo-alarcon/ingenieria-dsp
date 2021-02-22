import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { switchMap, take } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ImprovementsService } from '../../services/improvements.service';
import { Improvement } from '../../models/improvenents.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  selected: any;

  //Improvement
  settingDataSource = new MatTableDataSource<Improvement>();
  settingDisplayedColumns: string[] = ['date', 'name', 'component', 'model', 'media', 'quantity', 'currentPart', 'improvedPart', 'description', 'stock', 'availability', 'actions'];

  @ViewChild("settingPaginator", { static: false }) set content(paginator: MatPaginator) {
    this.settingDataSource.paginator = paginator;
  }

  @ViewChild("fileInput2", {read: ElementRef}) fileButton: ElementRef;

  currentData: Array<Improvement> = [];

  constructor(
    private auth: AuthService,
    private impServices: ImprovementsService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onFileSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      let name = event.target.files[0].name

      var reader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.selected = XLSX.utils.sheet_to_json(ws, { header: 1 });

        this.upLoadXlsToTable(this.selected, name.split(".")[0])
      };
      reader.readAsBinaryString(event.target.files[0]);
    }
  }

  upLoadXlsToTable(xlsx, name): void {
    let xlsxData = [];
    if (xlsx.length > 0) {
      xlsx.forEach(el => {
        let temp = Object.values(el);
        let data =
        {
          date: temp[0],
          name: temp[1],
          component: temp[2],
          model: temp[3],
          media: temp[4],
          quantity: temp[5],
          currentPart: temp[6],
          improvedPart: temp[7],
          description: temp[8],
          stock: temp[9],
          availability: temp[10],
        }

        xlsxData.push(data)
      });

      this.currentData = xlsxData;

      this.settingDataSource.data = this.currentData;

      this.fileButton.nativeElement.value = null;
    } else {
      this.snackbar.open("el archivo esta vacio ", "Aceptar", {
        duration: 3000,
      });
    }


  }

  clearDataTable() {
    this.settingDataSource.data = [];
    document.getElementById("fileInput2").nodeValue = "";
  }

  saveDataTable() {
    this.loading.next(true);

    this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        return this.impServices.addSettings(this.settingDataSource.data, user);
      })
    ).subscribe(batch => {
      if (batch) {
        batch.commit()
          .then(() => {
            this.loading.next(false);
            this.snackbar.open('✅ Archivo subido correctamente!', 'Aceptar', {
              duration: 6000
            });
            this.settingDataSource.data = [];
          })
          .catch(err => {
            this.loading.next(false);
            this.snackbar.open('🚨 Hubo un error subiendo el archivo.', 'Aceptar', {
              duration: 6000
            })
          })
      }
    });

  }

  remove(index: number): void {
    let table = [...this.settingDataSource.data];
    table.splice(index, 1);
    this.settingDataSource.data = table;
    this.snackbar.open('🗑️ Elemento removido!', 'Aceptar', {
      duration: 6000
    });
  }

}
