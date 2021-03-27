import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImprovementsService } from '../../../services/improvements.service';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { SparePart } from '../../../models/improvenents.model';

@Component({
  selector: 'app-spare-parts',
  templateUrl: './spare-parts.component.html',
  styleUrls: ['./spare-parts.component.scss']
})
export class SparePartsComponent implements OnInit {

  @ViewChild("fileInput2", { read: ElementRef }) fileButton: ElementRef;

  checked: boolean = false;
  selectCkeck: number;
  selected: any;

  dataSparePart: SparePart[] = [];

  checkedParts$: Observable<SparePart[]>;

  constructor(
    private snackBar: MatSnackBar,
    private impServices: ImprovementsService,
  ) { }

  ngOnInit(): void {
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
        this.selected = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const csvRead = this.selected.slice(4, this.selected.length);
        let dataReconstructed = [];

        csvRead.forEach(element => {
          dataReconstructed.push(element[0].replaceAll('-', '').replaceAll('"', '').split(','));
        })

        this.upLoadXls(dataReconstructed)
      };
      reader.readAsBinaryString(event.target.files[0]);
    }
  }

  changeValue(value, i) {
    this.checked = !value;
    this.selectCkeck = i;
  }

  upLoadXls(xlsx): void {
    xlsx.shift();

    let obsArray: Array<Observable<SparePart>> = [];

    if (xlsx.length > 0) {
      xlsx.forEach(el => {
        let temp = Object.values(el);
        let obs = this.impServices.checkPart(temp);
        obsArray.push(obs);
      });

      this.checkedParts$ = combineLatest(
        obsArray
      ).pipe(map((list) => {
        console.log(list);

        this.dataSparePart = list;
        this.fileButton.nativeElement.value = null;
        return list
      }))

    } else {
      this.snackBar.open("El archivo esta vacío", "Aceptar", {
        duration: 3000,
      });
    }
  }

  downloadXls(): void {

    const table_xlsx: any[] = [];

    const headersXlsx = [
      'PART',
      '',
      '_1',
      'QTY',
      'Parts Category']

    table_xlsx.push(headersXlsx);

    this.dataSparePart.forEach(part => {
      if (!part.kit) {
        const temp = [
          'AA:' + part.evaluatedPart,
          '',
          '',
          part.quantity,
          'Additional'
        ];

        table_xlsx.push(temp);
      }
    });

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(table_xlsx);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SAP');

    /* save to file */
    const name = 'SAP' + '.xlsx';
    XLSX.writeFile(wb, name);

  }

}


