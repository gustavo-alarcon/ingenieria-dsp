import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import * as XLSX from 'xlsx';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
  'aqua', 'blue', 'navy', 'black', 'gray'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

@Component({
  selector: 'app-evaluations-settings',
  templateUrl: './evaluations-settings.component.html',
  styleUrls: ['./evaluations-settings.component.scss']
})
export class EvaluationsSettingsComponent implements OnInit, AfterViewInit {


  loading = new BehaviorSubject<boolean>(true);
  loading$ = this.loading.asObservable();

  displayedColumns: string[] = ['id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('fileInput2', { read: ElementRef }) fileButton: ElementRef;

  panelOpenState = false;

  constructor(
    public auth: AuthService
  ) {
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    this.dataSource = new MatTableDataSource(users);
  }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFileSelected(event): void {
    this.loading.next(true);
    // this.uploading = 0;

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const arrAux = XLSX.utils.sheet_to_json(ws);
        const objArray = [];
        arrAux.forEach((element) => {
          const obj = {
            mail: '',
            shifMail: '',
            code: 0,
            description: '',
            shif: '',
            name: '',
            oficc: '',
            windowsUser: '',
            personalArea: ''
          };
          obj.mail = element['Correo'];
          obj.shifMail = element['Correo Jefe'];
          obj.code = element['Código'];
          obj.description = element['Descripción Posición'];
          obj.shif = element['Jefe'];
          obj.name = element['Nombre Completo'];
          obj.oficc = element['OFICC'];
          obj.windowsUser = element['Usuario Windows'];
          obj.personalArea = element['Área de personal'];
          objArray.push({...obj});
        });
        console.log(objArray);
      };
      reader.readAsBinaryString(event.target.files[0]);
    }
  }
}

function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}
