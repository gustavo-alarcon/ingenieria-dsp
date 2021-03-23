import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-external-events',
  templateUrl: './external-events.component.html',
  styleUrls: ['./external-events.component.scss']
})
export class ExternalEventsComponent implements OnInit {

  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  externalForm: FormGroup;
 
  imagesUpload: string[] = [''];
  files: File[] = [];
  pathStorage: string;
  isHovering: boolean;

  selected: any;


  constructor(
    private fb: FormBuilder,
  ) {  }

  ngOnInit(): void {

    this.initFormInternal();
  }

  initFormInternal(): void{
    this.externalForm = this.fb.group({
      description: ['', Validators.required],
      workdOrden: ['', Validators.required],
      component: ['', Validators.required],
      nPackage : ['', Validators.required],
      componentHourMeter : ['', Validators.required],
      nPart: ['', Validators.required],
      miningOperation: ['', Validators.required],
      question1: ['', Validators.required],
      question2: ['', Validators.required],
      question3: ['', Validators.required],
      question4: ['', Validators.required],
    });

  }

  onFileSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      let name = event.target.files[0].name

      var reader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        /* save data */
        this.selected = XLSX.utils.sheet_to_json(ws, { header: 1 });
       // this.upLoadXls(this.selected)
      };
      reader.readAsBinaryString(event.target.files[0]);
    }
  }

  save(): void{

  }

  addNewImage(image: string): void {
    this.imagesUpload.pop();
    this.imagesUpload.push(image);
    this.imagesUpload.push('');
  }
  
  toggleHover(event: boolean): void {
    this.isHovering = event;
  }

  onDrop(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }

}
