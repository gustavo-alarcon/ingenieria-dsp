import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import jsPDF from 'jspdf';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/main/models/user-model';
import { InitialEvaluation } from 'src/app/main/models/initialEvaluations.models';

@Component({
  selector: 'app-print-reception-dispatch',
  templateUrl: './print-reception-dispatch.component.html',
  styleUrls: ['./print-reception-dispatch.component.scss']
})
export class PrintReceptionDispatchComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  enumData: Array<any> = [];
  images: any[];

  otControl = new FormControl('');

  firestoreFlag = false;

  constructor(
    private auth: AuthService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: { data: InitialEvaluation, type: string },
    private dialogRef: MatDialogRef<PrintReceptionDispatchComponent>
  ) {
    if (this.data.type === 'reception') {
      this.enumData = this.data.data.dataReception;

      // this.enumData.forEach(data => {
      //   this.getBase64ImageFromURL(data['imageURL']).subscribe(base64data => {
      //   console.log(base64data);
      //   // this is the image as dataUrl
      //   this.images.push('data:image/jpg;base64,' + base64data);
      // });
      // })

      
    } else {
      this.enumData = this.data.data.dataDispatch;
    }

    this.otControl.setValue(this.data.data.ot);
  }

  ngOnInit(): void {
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
        this.generatePDF(user);
      })

  }

  generatePDF(user: User): void {
    if (this.otControl.value) {

      let pdf = new jsPDF('p', 'pt', 'a4');

      // header
      const header = new Image();
      header.src = '../../../../../../assets/img/template-header.jpg';
      pdf.addImage(header, 'JPG', 29, 29, 535, 74);
      pdf.setFontSize(10)
      pdf.text(this.otControl.value, 492, 70);

      // grid
      pdf.rect(29, 135, 535, 600);
      pdf.line(297, 135, 297, 735);
      pdf.line(29, 335, 564, 335);
      pdf.line(29, 535, 564, 535);
      // images
      let row = 0;
      let col = 0;
      this.enumData.forEach((file, index) => {

        if (index != 0 && index % 2 === 0) {
          row++;
          col = 0;
        }

        if (index != 0 && index % 2 != 0) {
          col = 1;
        }

        const x = 48 + (col * (230 + 38));
        const y = 150 + (row * (170 + 30));

        const image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = file['imageURL'];
        pdf.addImage(image, 'JPG', x, y, 230, 170);
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

      pdf.save('recepción-' + this.otControl.value + '.pdf');

    } else {
      this.snackbar.open('Debe asignar una OT', 'Aceptar', {
        duration: 6000
      })
    }

  }

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    // This will draw image    
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

}
