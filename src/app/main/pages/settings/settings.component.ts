import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Improvements } from '../../../auth/models/inprovenents.model';
import { MatPaginator } from '@angular/material/paginator';
import { ImprovementsService } from '../../../auth/services/improvements.service';
import { tap } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
  dataSource = new MatTableDataSource();
  selected:any;
  
  setting$: Observable<object[]>

   //Improvement
    
  settingDataSource = new MatTableDataSource<Improvements>();
  settingDisplayedColumns: string[] = ['date',  'name','component', 'model', 'half','qty','current','improved','description','stock','available'];

  @ViewChild("settingPaginator", { static: false }) set content(paginator: MatPaginator) {
    this.settingDataSource.paginator = paginator;
  } 

  currentData: Array<Improvements> = [];

  constructor(private impvServices:ImprovementsService,
              private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    /* this.setting$ = this.impvServices.getAllSettings().pipe(
      tap(res => {
        if (res) {
          this.settingDataSource.data = res
        }

      }) 
    ); */
  }
  change() {

    this.currentData = [];
    this.dataSource.data = [];

  }
  
  ifchange() {
  if (this.currentData.length) {
   
  } else {
    this.change()
  }
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
        this.selected = XLSX.utils.sheet_to_json(ws, { header: "A", defval: "" });
        
        this.upLoadXls(this.selected, name.split(".")[0])
      };
      reader.readAsBinaryString(event.target.files[0]);
    }
  }
  upLoadXls(array, name): void {  
    let arraydData = [];
    if (array.length>0) {
       array.forEach(el => {
        let array2 = Object.values(el);
        //let array2: Array<string> = Object.values(el);          
          let data = 
            {
              date:array2[0], //new Date(Date.parse(array2[0])*1000)
              name: array2[1],
              component:array2[2],
              model:array2[3],
              half:array2[4],
              qty:array2[5],
              current:array2[6],
              improved:array2[7],
              description:array2[8],
              stock:array2[9],
              available:array2[10],
            }
            arraydData.push(data)        
      });
    }else{
      this.snackBar.open("el archivo esta vacio ", "Aceptar", {
        duration: 3000,});
    }
    
     this.currentData=arraydData;

    this.settingDataSource.data = this.currentData;
     
   document.getElementById("fileInput2").nodeValue = "";
  }
  
  clearDataTable(){
    this.settingDataSource.data=[];
    document.getElementById("fileInput2").nodeValue = "";
  }

  saveDataTable(){
   this.settingDataSource.data.forEach(el => {
    this.impvServices.addSettings(el);
   });
   this.settingDataSource.data=[];
   this.snackBar.open("se guardo correctamente", "Aceptar", {
    duration: 3000,});
  }

  onFileSelectedSettings(event) {

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
        this.selected = XLSX.utils.sheet_to_json(ws, { header: "A", defval: "" });
        this.upLoadXlsSettings(this.selected)
      };
      reader.readAsBinaryString(event.target.files[0]);
    }
  }




  upLoadXlsSettings(array): void {
    
    let aux: boolean;
    array.forEach(el => { //slice(1)
      console.log('el : ',el);
      aux = false;
      let array2: Array<string> = Object.values(el);
      /* 
      aux = false;
      let array2: Array<string> = Object.values(el);
      //probando si nombre ya existe. si es asi, ejecuta editTagDestinations.
      //sino, crea nuevo destino.
       this.dataSourceListaDestinos.data.forEach(element =>{
        if(element["name"].toLowerCase() === array2[0].toLowerCase()){
          this.dbs.editTagDestinations({
            name: array2[0],
            description: array2[1],
            id: element["id"]
          });
          aux=true;
        }
      }); 
      console.log('array 2 : ',array2);
      console.log('aux : ',aux); 
      */

      aux === false ? this.impvServices.addSettings({ 

        date:new Date(array2[0]), //new Date(Date.parse(array2[0])*1000)
        name: array2[1],
        component:array2[2],
        model:array2[3],
        half:array2[4],
        qty:parseInt(array2[5]),
        current:array2[6],
        improved:array2[7],
        description:array2[8],
        stock:parseInt(array2[9]),
        available:new Date(array2[10]),// new Date(Date.parse(array2[10]))
      }) : null;
    })

    //Se limpia entrada de documento en el HTML
    document.getElementById("fileInput2").nodeValue = "";
}


}
