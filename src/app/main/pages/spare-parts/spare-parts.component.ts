import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImprovementsService } from '../../services/improvements.service';

@Component({
  selector: 'app-spare-parts',
  templateUrl: './spare-parts.component.html',
  styleUrls: ['./spare-parts.component.scss']
})
export class SparePartsComponent implements OnInit {

  @ViewChild("fileInput2", {read: ElementRef}) fileButton: ElementRef;

  checked: boolean = false;
  selectCkeck: number;
  selected: any;

  dataSparePart: SparePart[] = [];


  constructor(
    private snackBar: MatSnackBar,
    private impServices: ImprovementsService,
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
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        /* save data */
        this.selected = XLSX.utils.sheet_to_json(ws, { header: 1 });
        this.upLoadXls(this.selected)
      };
      reader.readAsBinaryString(event.target.files[0]);
    }
  }

  changeValue(value, i) {
    console.log(value)
    console.log(i)

    this.checked = !value;
    this.selectCkeck = i;
  }

  upLoadXls(array): void {
    let arraydData = [];

    if (array.length > 0) {
      array.forEach(el => {
        let array2 = Object.values(el);
        //let array2: Array<string> = Object.values(el);        
        let data =
        {
          partN: array2[0],
          qty: array2[1],
          type: array2[2],
          smcs: array2[3],
          partName: array2[4],
          groupN: array2[5],
          groupName: array2[6],
          note: array2[7],
          newGroupN: this.impServices.getCurrent_Improv(array2[5]),

        }
        arraydData.push(data)
      });

      console.log('arraydData : ', arraydData);

      this.dataSparePart = arraydData;

      this.fileButton.nativeElement.value = null;
    } else {
      this.snackBar.open("el archivo esta vacio ", "Aceptar", {
        duration: 3000,
      });
    }

    /*   this.currentData=arraydData;
 
     this.settingDataSource.data = this.currentData; */
    console.log('this.dataSpare : ', this.dataSparePart);
  }

  deleteControl() {

  }
  downloadData() {

  }

}

export interface SparePart {
  partN: string;
  qty: number;
  type: string;
  smcs: number;
  partName: string;
  groupN: string;
  groupName: string;
  note: string;
  newGroupN: string;
}