import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { BehaviorSubject } from 'rxjs';
import { Evaluation } from 'src/app/main/models/evaluations.model';

@Component({
  selector: 'app-history-reports-dialog',
  templateUrl: './history-reports-dialog.component.html',
  styles: [
  ]
})
export class HistoryReportsDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  defaultImage = 'https://firebasestorage.googleapis.com/v0/b/ferreyros-mvp.appspot.com/o/assets%2Fwithout-image.jpg?alt=media&token=d0676f36-9c69-490c-b8e7-790e7a7038a8';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Evaluation[]
  ) { }

  ngOnInit(): void {
  }

  async generatePDF() {
    if (this.data.length > 0) {
      this.loading.next(true);

      let pdf = new jsPDF('p', 'pt', 'a4');

      const totalPages = Math.ceil(this.data.length/2);
      let index = 0;
      for (const element of this.data) {
        // header
        const header = new Image();
        header.src = '../../../../../../assets/img/template-evaluations-header.jpg';
        pdf.addImage(header, 'JPG', 29, 29, 535, 74);
        pdf.setFontSize(10)
        pdf.text(this.data[0].otMain.toString(), 492, 70);

        if (index % 2 === 0) {
          // first
          // horizontal lines
          pdf.rect(30, 133, 535, 325);
          pdf.setFillColor(178,228,199);
          pdf.rect(31, 134, 533, 24, 'F');
          pdf.rect(31, 184, 533, 24, 'F');
          pdf.rect(31, 409, 533, 24, 'F');
          pdf.line(30, 158, 565, 158);
          pdf.line(30, 183, 565, 183);
          pdf.line(30, 208, 565, 208);
          pdf.line(30, 408, 565, 408);
          pdf.line(30, 433, 565, 433);
          

          // vertical lines
          pdf.line(55, 133, 55, 183);
          pdf.line(298, 133, 298, 408);
          pdf.line(431, 133, 431, 183);
          pdf.line(152, 408, 152, 458);
          pdf.line(392, 408, 392, 458);

          // text
          // first grid
          pdf.text('#', 38, 153);
          pdf.text((index + 1).toString().padStart(2, '0'), 38, 174);
          pdf.text('OT CHILD', 65, 153);
          pdf.text(element.otChild ? (element.otChild).toString() : '---', 65, 174);
          pdf.text('WOF', 161, 153);
          pdf.text(element.wof ? (element.wof).toString() : '---', 161, 174);
          pdf.text('N/P', 238, 153);
          pdf.text(element.partNumber ? (element.partNumber).toString() : '---', 238, 174);
          pdf.text('CANT.', 350, 153);
          pdf.text(element.quantity ? (element.quantity).toString().padStart(2, '0') : '---', 360, 174);
          pdf.text('DESC.', 484, 153);
          pdf.text(element.description ? (element.description) : '---', 444, 174);
          pdf.text('FOTO 1', 147, 202);
          pdf.text('FOTO 2', 415, 202);

          // images
          let imagef1: HTMLImageElement;
          if (element.resultImage1) {
            imagef1 = await this.getDataUri(element.resultImage1);
          } else {
            imagef1 = await this.getDataUri(this.defaultImage);
          }
          pdf.addImage(imagef1, 49, 223, 230, 170);

          let imagef2: HTMLImageElement;
          if (element.resultImage2) {
            imagef2 = await this.getDataUri(element.resultImage2);
          } else {
            imagef2 = await this.getDataUri(this.defaultImage);
          }
          pdf.addImage(imagef2, 317, 223, 230, 170);


          pdf.addImage(imagef1, 317, 223, 230, 170);
          // second grid
          pdf.text('RESULTADO', 64, 427);
          pdf.text(element.result ? element.result.slice(0, 18) : '---', 44, 450);
          pdf.text('CONCLUSIONES', 236, 427);
          pdf.text(element.comments ? element.comments.slice(0, 38) : '---', 166, 450);
          pdf.text('TIPO DE ENSAYO', 435, 427);
          pdf.text(element.kindOfTest ? element.kindOfTest.slice(0, 18) : '---', 405, 450);

          const actualPage = Math.ceil((index+1)/2);
          const pagination = actualPage.toString().padStart(2,'0') + '/' + totalPages.toString().padStart(2,'0')
          pdf.text(pagination, 538, 820);

        } else {
          // second
          // horizontal lines
          pdf.rect(30, 479, 535, 325);
          pdf.setFillColor(178,228,199);
          pdf.rect(31, 480, 533, 24, 'F');
          pdf.rect(31, 530, 533, 24, 'F');
          pdf.rect(31, 755, 533, 24, 'F');
          pdf.line(30, 504, 565, 504);
          pdf.line(30, 529, 565, 529);
          pdf.line(30, 554, 565, 554);
          pdf.line(30, 754, 565, 754);
          pdf.line(30, 779, 565, 779);

          // vertical lines
          pdf.line(55, 479, 55, 529);
          pdf.line(298, 479, 298, 754);
          pdf.line(431, 479, 431, 529);
          pdf.line(152, 754, 152, 804);
          pdf.line(392, 754, 392, 804);

          // text
          // first grid
          pdf.text('#', 38, 499);
          pdf.text((index + 1).toString().padStart(2, '0'), 38, 520);
          pdf.text('OT CHILD', 65, 499);
          pdf.text(element.otChild ? (element.otChild).toString() : '---', 65, 520);
          pdf.text('WOF', 161, 499);
          pdf.text(element.wof ? (element.wof).toString() : '---', 161, 520);
          pdf.text('N/P', 238, 499);
          pdf.text(element.partNumber ? (element.partNumber).toString() : '---', 238, 520);
          pdf.text('CANT.', 350, 499);
          pdf.text(element.quantity ? (element.quantity).toString().padStart(2, '0') : '---', 360, 520);
          pdf.text('DESC.', 484, 499);
          pdf.text(element.description ? (element.description) : '---', 444, 520);
          pdf.text('FOTO 1', 147, 548);
          pdf.text('FOTO 2', 415, 548);

          // images
          let imagef1: HTMLImageElement;
          if (element.resultImage1) {
            imagef1 = await this.getDataUri(element.resultImage1);
          } else {
            imagef1 = await this.getDataUri(this.defaultImage);
          }
          pdf.addImage(imagef1, 49, 569, 230, 170);

          let imagef2: HTMLImageElement;
          if (element.resultImage2) {
            imagef2 = await this.getDataUri(element.resultImage2);
          } else {
            imagef2 = await this.getDataUri(this.defaultImage);
          }
          pdf.addImage(imagef2, 317, 569, 230, 170);

          // second grid
          pdf.text('RESULTADO', 64, 773);
          pdf.text(element.result ? element.result.slice(0, 18) : '---', 44, 798);
          pdf.text('CONCLUSIONES', 236, 773);
          pdf.text(element.comments ? element.comments.slice(0, 38) : '---', 166, 798);
          pdf.text('TIPO DE ENSAYO', 435, 773);
          pdf.text(element.kindOfTest ? element.kindOfTest.slice(0, 18) : '---', 405, 798);

          if ((index + 1) < this.data.length) {
            pdf.addPage()
          }
        }

        index++;
      }
      
      pdf.save('test.pdf');
    }

    this.loading.next(false);
  }

  getDataUri(url): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      var image = new Image();

      image.onload = () => {
        resolve(image);
      };

      image.src = url;
    })
  }

}
