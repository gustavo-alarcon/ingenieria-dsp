import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Improvements } from 'src/app/auth/models/inprovenents.model';
import * as XLSX from 'xlsx';
import { ImprovementsService } from '../../../auth/services/improvements.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-improvements',
  templateUrl: './improvements.component.html',
  styleUrls: ['./improvements.component.scss']
})
export class ImprovementsComponent implements OnInit {

  dataSource = new MatTableDataSource();
  selected:any;
  
  improvement$: Observable<object[]>

   //Improvement
  improvementDataSource = new MatTableDataSource<Improvements>();
  improvementDisplayedColumns: string[] = ['date',  'name','component', 'model', 'review','user','state','actions'];

  @ViewChild("improvementPaginator", { static: false }) set content(paginator: MatPaginator) {
    this.improvementDataSource.paginator = paginator;
  } 
  
  constructor(
              private impvServices:ImprovementsService
  ) { }

  ngOnInit(): void{
     //Improvements
     this.improvement$ = this.impvServices.getAllImprovement().pipe(
      tap(res => {
        if (res) {
          this.improvementDataSource.data = res
        }

      })
    )
  }

  onFileSelectedImprovements(event) {

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
        this.upLoadXlsImprovements(this.selected)
      };
      reader.readAsBinaryString(event.target.files[0]);
    }
  }


  upLoadXlsImprovements(array): void {
    
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

      aux === false ? this.impvServices.addTagDestinations({
        date: array2[0],
        name: array2[1],
        component:array2[2],
        model:array2[3],
        review:array2[4],
        user:array2[5],
        state: array2[6],
      }) : null;
    })
    //Se limpia entrada de documento en el HTML
    document.getElementById("fileInput2").nodeValue = "";
}
}

