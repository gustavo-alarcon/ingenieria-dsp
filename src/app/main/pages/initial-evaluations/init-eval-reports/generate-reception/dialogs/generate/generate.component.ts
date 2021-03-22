import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, map, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss']
})
export class GenerateComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  @ViewChild('print_section', { static: true }) element: ElementRef;

  enumData: Array<any> = [];

  otControl = new FormControl('');

  firestoreFlag = false;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<GenerateComponent>
  ) {
    this.enumData = Object.entries(this.data);
  }

  ngOnInit(): void {
  }

  exportAsPDF() {
    if (this.otControl.value) {
      this.save();

      html2canvas(this.element.nativeElement).then(canvas => {

        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;

        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);

        PDF.save('recepción-' + this.otControl.value + '.pdf');
      });
    } else {
      this.snackbar.open('Debe asignar una OT', 'Aceptar', {
        duration: 6000
      })
    }
  }

  save(): void {
    if (this.firestoreFlag) {
      this.snackbar.open('La información ya fue subida al a base de datos', 'Aceptar', {
        duration: 10000
      })
    }

    this.loading.next(true);

    let uploads = [];
    const slicedData = this.enumData.slice(0, 5);
    let buildData = {};

    slicedData.forEach(data => {
      let task: AngularFireUploadTask;

      const path = `initial-evaluations/${data[1]['name']}`;
      const ref = this.storage.ref(path);
      task = this.storage.upload(path, data[1]['file']);
      uploads.push(
        task.snapshotChanges().pipe(
          finalize(async () => {
            const downloadURL = await ref.getDownloadURL().toPromise();
            buildData[data[1]['file']['name']] = downloadURL;
            // this.data[data[1]['file']['name']]['downloadURL'] = downloadURL;
            // this.data[data[1]['file']['name']]['name'] = data[1]['file']['name'];

            // delete this.data[data[1]['file']['name']]['selected'];
            // delete this.data[data[1]['file']['name']]['file'];
          })
        )
      )
    })

    let counter = 0;

    combineLatest(
      uploads
    ).pipe(
      map((values) => {
        if (values) {
          counter++;
        }

        if (counter === this.enumData.length) {
          const batch = this.afs.firestore.batch();
          const refEval = this.afs.firestore.collection('db/ferreyros/initialEvaluationsReports').doc();

          this.auth.user$
            .pipe(
              take(1)
            )
            .subscribe(user => {
              const data = {
                id: refEval.id,
                ot: this.otControl.value,
                data: buildData,
                createdAt: new Date(),
                createdBy: user
              }

              batch.set(refEval, data);

              batch.commit()
                .then(() => {
                  this.snackbar.open('Reporte de recepción guardado', 'Aceptar', {
                    duration: 6000
                  });
                  this.loading.next(false);
                  this.firestoreFlag = true;
                  this.dialogRef.close();
                })
            })
        }

        return values
      })
    ).subscribe()
  }

}
