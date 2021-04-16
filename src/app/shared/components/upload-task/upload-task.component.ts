import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Ng2ImgMaxService } from 'ng2-img-max';

@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss'],
})
export class UploadTaskComponent implements OnInit, OnDestroy {
  @Input() file: File;
  @Input() pathStorage: string;

  @Output() onNewImage: EventEmitter<string> = new EventEmitter<string>();
  @Output() onDeleteImage: EventEmitter<string> = new EventEmitter<string>();

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  subcription = new Subscription();
  constructor(
    private storage: AngularFireStorage,
    private ng2ImgMax: Ng2ImgMaxService
  ) {}

  ngOnInit(): void {
    this.startUpload();
  }

  startUpload(): void {
    this.subcription.add(
      this.ng2ImgMax.resize([this.file], 800, 10000).subscribe((result) => {
        const path = `${this.pathStorage}-${new Date()}-${result.name}.png`;
        const ref = this.storage.ref(path);
        this.task = this.storage.upload(path, result);
        this.percentage = this.task.percentageChanges();
        this.snapshot = this.task.snapshotChanges().pipe(
          finalize(async () => {
            this.downloadURL = await ref.getDownloadURL().toPromise();
            this.onNewImage.emit(this.downloadURL);
          })
        );
      })
    );
  }

  isActive(snapshot): boolean {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

  deleteImage(url): void {
    this.onDeleteImage.emit(url);

    if (url) {
      this.downloadURL = '';
    }
  }
}
