import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
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

  @Input() file: File;
  @Input() pathStorage: string;

  @Output() onNewImage: EventEmitter<File> = new EventEmitter<File>();

  resizedImage: string | ArrayBuffer;
  resizedFile: File;

  subscription = new Subscription();

  zipImage: any;
  selected = false;

  constructor(
    private ng2ImgMax: Ng2ImgMaxService
  ) { }

  ngOnInit(): void {
    this.startZipping();
  }

  startZipping(): void {
    this.loading.next(true);
    let reader = new FileReader();

    this.subscription.add(
      this.ng2ImgMax.resize([this.file], 10000, 800).subscribe((result) => {
        this.resizedFile = new File([result], result.name);
        this.onNewImage.emit(this.resizedFile);

        reader.readAsDataURL(this.file);
        reader.onload = (_event) => {
          this.zipImage = {
            'background-image': 'url(' + reader.result + ')'
          }
          // this.resizedImage = reader.result;
          this.loading.next(false)
        }
      })
    );
  }

  toggleSelection(): void {
    this.selected = !this.selected;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

