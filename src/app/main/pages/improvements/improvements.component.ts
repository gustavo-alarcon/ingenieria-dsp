import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Improvements } from 'src/app/auth/models/inprovenents.model';
import { ImprovementsService } from '../../../auth/services/improvements.service';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreateDialogImprovenmentsComponent } from './dialogs/create-dialog-improvenments/create-dialog-improvenments.component';
import { EditDialogImprovenmentsComponent } from './dialogs/edit-dialog-improvenments/edit-dialog-improvenments.component';
import { DeleteDialogImprovenmentsComponent } from './dialogs/delete-dialog-improvenments/delete-dialog-improvenments.component';
import { ValidateDialogImprovenmentsComponent } from './dialogs/validate-dialog-improvenments/validate-dialog-improvenments.component';

@Component({
  selector: 'app-improvements',
  templateUrl: './improvements.component.html',
  styleUrls: ['./improvements.component.scss']
})
export class ImprovementsComponent implements OnInit {

  dataSource = new MatTableDataSource();
  selected: any;

  improvement$: Observable<object[]>;

  // Improvement
  improvementDataSource = new MatTableDataSource<Improvements>();
  improvementDisplayedColumns: string[] = ['date', 'name', 'component', 'model', 'review', 'user', 'state', 'actions'];

  @ViewChild('improvementPaginator', { static: false }) set content(paginator: MatPaginator) {
    this.improvementDataSource.paginator = paginator;
  }

  constructor(
    private impvServices: ImprovementsService,
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void { }


  openDialog(value: string, index?: number): void {
    // console.log(this.improvementDataSource.data[index])
    const optionsDialog = {
      width: '100%',
      height: '90%',
      data: {
        element: this.improvementDataSource.data[index]
      }
    };
    let dialogRef;

    switch (value) {
      case 'create':
        dialogRef = this.dialog.open(CreateDialogImprovenmentsComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'create':
        dialogRef = this.dialog.open(ValidateDialogImprovenmentsComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'edit':
        dialogRef = this.dialog.open(EditDialogImprovenmentsComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;

      case 'delete':
        dialogRef = this.dialog.open(DeleteDialogImprovenmentsComponent,
          optionsDialog,
        );
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
    }
  }


}

