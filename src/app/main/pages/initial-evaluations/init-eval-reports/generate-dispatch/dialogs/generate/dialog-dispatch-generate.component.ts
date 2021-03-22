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
  ) { }

  ngOnInit(): void {
    this.otControl.setValue(this.data.reception.ot);
    console.log(this.data);
    
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

        PDF.save('despacho-' + this.otControl.value + '.pdf');
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
        const refEval = this.afs.doc(`db/ferreyros/initialEvaluationsReports/${this.data.reception.id}`).ref
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

                batchImage.update(evalImageRef, { dataDispatch: firebase.default.firestore.FieldValue.arrayUnion(buildData), dispatchedAt: new Date(), dispatchedBy: user })

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

  }

}
