import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/auth/services/auth.service';

import * as firebase from 'firebase';
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

    this.auth.user$
      .pipe(
        take(1)
      )
      .subscribe(user => {
        const batch = this.afs.firestore.batch();
        const refEval = this.afs.firestore.collection('db/ferreyros/initialEvaluationsReports').doc();

        const dataBatch = {
          id: refEval.id,
          ot: this.otControl.value,
          data: [],
          status: 'reception',
          createdAt: new Date(),
          createdBy: user
        }

        batch.set(refEval, dataBatch);

        batch.commit()
          .then(() => {

            this.enumData.forEach(data => {

              const file = data[1]['file'];
              const filePath = `initial-evaluations/${data[1]['name']}`;
              const fileRef = this.storage.ref(filePath);
              const task = this.storage.upload(filePath, file);

              // get notified when the download URL is available
              task.snapshotChanges().pipe(
                finalize(() => {
                  fileRef.getDownloadURL().subscribe(res => {
                    let buildData = { name: data[1]['file']['name'], imageURL: res };

                    const batchImage = this.afs.firestore.batch();
                    const evalImageRef = this.afs.doc(refEval.path).ref;

                    batchImage.update(evalImageRef, { data: firebase.default.firestore.FieldValue.arrayUnion(buildData) })

                    batchImage.commit()
                      .then(() => {
                        this.snackbar.open('Reporte de recepción guardado', 'Aceptar', {
                          duration: 6000
                        });
                        this.loading.next(false);
                        this.firestoreFlag = true;
                        this.dialogRef.close(true);
                      })

                  })

                })
              ).subscribe()
            })

          })
      })

  }

}
