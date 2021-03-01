import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Replacement } from '../../models/replacements.models';
import { ReplacementsService } from '../../services/replacements.service';
import { CreateDialogReplacementsComponent } from './dialogs/create-dialog-replacements/create-dialog-replacements.component';
import { DeleteDialogReplacementsComponent } from './dialogs/delete-dialog-replacements/delete-dialog-replacements.component';
import { EditDialogReplacementsComponent } from './dialogs/edit-dialog-replacements/edit-dialog-replacements.component';
import { UploadFileDialogReplacementsComponent } from './dialogs/upload-file-dialog-replacements/upload-file-dialog-replacements.component';


@Component({
  selector: 'app-replacements',
  templateUrl: './replacements.component.html',
  styleUrls: ['./replacements.component.scss']
})
export class ReplacementsComponent implements OnInit {

  replacement$: Observable<Replacement[]>;

  // replacement
  replacementDataSource = new MatTableDataSource<Replacement>();
  replacementDisplayedColumns: string[] = ['date', 'replacedPart', 'currentPart', 'description', 'kit', 'support', 'actions'];

  @ViewChild('replacementPaginator', { static: false }) set content(paginator: MatPaginator) {
    this.replacementDataSource.paginator = paginator;
  }

  constructor(
    private repServices: ReplacementsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.replacement$ = this.repServices.getAllReplacements().pipe(
      tap(res => {
        if (res) {
          this.replacementDataSource.data = res;
        }
      })
    );
  }



  openDialog(value: string, entry?: Replacement, index?: number): void {
    const optionsDialog = {
      width: '100%',
      data: entry
    };
    let dialogRef;

    switch (value) {
      case 'create':
        dialogRef = this.dialog.open(CreateDialogReplacementsComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'create-bulk':
        dialogRef = this.dialog.open(UploadFileDialogReplacementsComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
      case 'edit':
        dialogRef = this.dialog.open(EditDialogReplacementsComponent,
          optionsDialog,
        );

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;

      case 'delete':
        dialogRef = this.dialog.open(DeleteDialogReplacementsComponent, {
          width: '350px',
          data: this.replacementDataSource.data[index]
        }
        );
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
        break;
    }
  }

}
