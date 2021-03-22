import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-zip-task',
  templateUrl: './zip-task.component.html',
  styleUrls: ['./zip-task.component.scss']
})
export class ZipTaskComponent implements OnInit, OnDestroy {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  @Input() counter: number;
  @Input() file: File;
  @Input() pathStorage: string;
  @Input() reception: boolean;

  @Output() onNewImage: EventEmitter<Object> = new EventEmitter<Object>();

  resizedImage: string | ArrayBuffer;
  resizedFile: File;

  subscription = new Subscription();

  zipImage: any;
  selected = false;
  data = {};

  constructor(
    private snackbar: MatSnackBar,
    private ng2ImgMax: Ng2ImgMaxService
  ) { }

  ngOnInit(): void {
    this.startZipping();
  }

  startZipping(): void {
    this.loading.next(true);
    let reader = new FileReader();

    if (this.reception) {
      reader.readAsDataURL(this.file);
      reader.onload = (_event) => {
        this.zipImage = {
          'background-image': 'url(' + reader.result + ')'
        }
        this.loading.next(false)
      }
    } else {
      this.subscription.add(
        this.ng2ImgMax.resize([this.file], 10000, 800).subscribe((result) => {
          this.resizedFile = new File([result], result.name);
          this.data['file'] = this.resizedFile;
          this.data['name'] = this.resizedFile.name;
  
          reader.readAsDataURL(this.file);
          reader.onload = (_event) => {
            this.zipImage = {
              'background-image': 'url(' + reader.result + ')'
            }
            this.data['imageURL'] = reader.result;
            // this.resizedImage = reader.result;
            this.loading.next(false)
          }
        })
      );
    }
    
  }

  toggleSelection(): void {
    
    if (this.counter > 5 && !this.selected) {
      this.snackbar.open('No se pueden seleccionar más imágenes', 'Aceptar', {
        duration: 6000
      })
      return
    }
    this.selected = !this.selected;
    this.data['selected'] = this.selected
    this.data['counter'] = this.selected ? 1 : -1;
    this.onNewImage.emit(this.data);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

