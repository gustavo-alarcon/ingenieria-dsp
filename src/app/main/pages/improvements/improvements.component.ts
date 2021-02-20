import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Improvements } from 'src/app/auth/models/inprovenents.model';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateDialogImprovenmentsComponent } from './dialogs/create-dialog-improvenments/create-dialog-improvenments.component';
import { EditDialogImprovenmentsComponent } from './dialogs/edit-dialog-improvenments/edit-dialog-improvenments.component';
import { DeleteDialogImprovenmentsComponent } from './dialogs/delete-dialog-improvenments/delete-dialog-improvenments.component';
import { ValidateDialogImprovenmentsComponent } from './dialogs/validate-dialog-improvenments/validate-dialog-improvenments.component';
import { tap } from 'rxjs/operators';
import { ImprovementsService } from '../../services/improvements.service';
import { ImproventmentModel1 } from '../../models/improvenents.model';

@Component({
  selector: 'app-improvements',
  templateUrl: './improvements.component.html',
  styleUrls: ['./improvements.component.scss']
})
export class ImprovementsComponent implements OnInit {

  dataSource = new MatTableDataSource();
  selected: any;

  improvement$: Observable<ImproventmentModel1[]>;

  // Improvement
  improvementDataSource = new MatTableDataSource<ImproventmentModel1>();
  improvementDisplayedColumns: string[] = ['date', 'name', 'component', 'model', 'review', 'user', 'state', 'actions'];

  available: number;
  component: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  current: string;
  date: number;
  description: string;
  half: string;
  improved: string;
  model: string;
  uid: string;
  qty: number;
  name: string;

  @ViewChild('improvementPaginator', { static: false }) set content(paginator: MatPaginator) {
    this.improvementDataSource.paginator = paginator;
  }

  constructor(
    private impvServices: ImprovementsService,
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.improvement$ = this.impvServices.getAllImprovement().pipe(
      tap(res => {
         console.log('Res : ',res);
        if (res) {
          this.improvementDataSource.data = res;
          // console.log(res);
        }

      })
    );

   }

  openDialog(value: string, index?: number): void {
    // console.log(this.improvementDataSource.data[index])
    const optionsDialog = {
      width: '100%',
      height: '90%',
      data: this.improvementDataSource.data
    };
    switch (value) {
      case 'insert':
        const dialogRefInsert = this.dialog.open(DialogInsertImprovementsComponent,
          sizeModal
        );
        dialogRefInsert.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'validate':
        dialogRef = this.dialog.open(ValidateDialogImprovenmentsComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'edit':
        const dialogRefEdit = this.dialog.open(DialogValidationLogisticsComponent,
          sizeModal
        );
        dialogRefEdit.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
    }
  }
}

