import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BehaviorSubject } from 'rxjs';
import { take, finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';

import * as firebase from 'firebase';
import { InitialEvaluation } from 'src/app/main/models/initialEvaluations.models';
import { User } from 'src/app/main/models/user-model';

@Component({
  selector: 'app-dialog-dispatch-generate',
  templateUrl: './dialog-dispatch-generate.component.html',
  styleUrls: ['./dialog-dispatch-generate.component.scss']
})
export class DialogDispatchGenerateComponent implements OnInit {
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
    @Inject(MAT_DIALOG_DATA) private data: { files: any, reception: InitialEvaluation },
    private dialogRef: MatDialogRef<DialogDispatchGenerateComponent>
  ) {
    this.enumData = Object.entries(this.data.files);
  }

  ngOnInit(): void {
    this.otControl.setValue(this.data.reception.ot);
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
          dataDispatch: [],
          status: 'dispatch',
          createdAt: new Date(),
          createdBy: user
        }

        batch.set(refEval, dataBatch);

        batch.commit()
          .then(() => {
            this.generatePDF(user, refEval.id);

            this.enumData.forEach(data => {

              const file = data[1]['file'];
              const filePath = `initial-evaluations/${Date.now()}_${data[1]['file']['name']}`;
              const fileRef = this.storage.ref(filePath);
              const task = this.storage.upload(filePath, file);

              // get notified when the download URL is available
              task.snapshotChanges().pipe(
                finalize(() => {
                  fileRef.getDownloadURL().subscribe(res => {
                    let buildData = { name: data[1]['file']['name'], imageURL: res };

                    const batchImage = this.afs.firestore.batch();
                    const evalImageRef = this.afs.doc(refEval.path).ref;

                    batchImage.update(evalImageRef, { dataDispatch: firebase.default.firestore.FieldValue.arrayUnion(buildData) })

                    batchImage.commit()
                      .then(() => {
                        this.snackbar.open('Reporte de despacho guardado', 'Aceptar', {
                          duration: 6000
                        });
                        this.firestoreFlag = true;
                      })

                  })

                })
              ).subscribe()
            })

          })
      })

  }

  generatePDF(user: User, documentId): void {

    let pdf = new jsPDF('p', 'pt', 'a4');

    // header
    const header = new Image();
    header.src = '../../../../../../assets/img/template-header-dispatch.jpg';
    pdf.addImage(header, 'JPG', 29, 29, 535, 74);
    pdf.setFontSize(10)
    pdf.text(this.otControl.value, 492, 70);

    // grid
    pdf.rect(29, 135, 535, 600);
    pdf.line(297, 135, 297, 735);
    pdf.line(29, 335, 564, 335);
    pdf.line(29, 535, 564, 535);
    console.log(Object.entries(this.data.files));
    // images
    let row = 0;
    let col = 0;
    Object.entries(this.data.files).forEach((file, index) => {

      if (index != 0 && index % 2 === 0) {
        row++;
        col = 0;
      }

      if (index != 0 && index % 2 != 0) {
        col = 1;
      }

      const x = 48 + (col * (230 + 38));
      const y = 150 + (row * (170 + 30));
      console.log(index, x, y);


      pdf.addImage(file[1]['imageURL'], 'JPG', x, y, 230, 170);
    });

    // footer
    const now = new Date();
    const dateString = String(now.getDate()).padStart(2, '0') + '/'
      + String(now.getMonth()).padStart(2, '0') + '/'
      + now.getFullYear() + ' '
      + String(now.getHours()).padStart(2, '0') + ':'
      + String(now.getMinutes()).padStart(2, '0') + ':'
      + String(now.getSeconds()).padStart(2, '0') + ' '
      + (now.getHours() > 12 ? 'pm' : 'am');
    const footer = new Image();
    footer.src = '../../../../../../assets/img/footer.jpg';
    pdf.addImage(footer, 'JPG', 29, 770, 535, 46);
    pdf.text(dateString, 149, 780);
    pdf.text(user.name, 381, 780);

    pdf.save('despacho-' + this.otControl.value + '.pdf');

    // Uplaoding PDF
    const file = pdf.output("blob");

    const filePath = `initial-evaluations/${Date.now()}_reception_${this.otControl.value}.pdf`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(res => {

          const batchImage = this.afs.firestore.batch();
          const refEval = this.afs.firestore.doc(`db/ferreyros/initialEvaluationsReports/${documentId}`);

          batchImage.update(refEval, { pdfURL: res })

          batchImage.commit()
            .then(() => {
              this.snackbar.open('✅ Documento de recepción guardado', 'Aceptar', {
                duration: 6000
              });
              this.loading.next(false);
              this.firestoreFlag = true;
              this.dialogRef.close(true);
            })

        })

      })
    ).subscribe()

  }

}
