import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-internal-events',
  templateUrl: './internal-events.component.html',
  styleUrls: ['./internal-events.component.scss']
})
export class InternalEventsComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  
  internalForm: FormGroup;
  
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
    this.internalForm = this.fb.group({
      description: ['', Validators.required],
      workdOrden: ['', Validators.required],
      workShop: ['', Validators.required],
      nPart: ['', Validators.required],
      eventoDetail: ['', Validators.required],
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
