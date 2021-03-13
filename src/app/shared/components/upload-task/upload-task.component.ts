import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, take, tap } from 'rxjs/operators';
import { Andon } from 'src/app/main/models/andon.model';
import { AndonService } from '../../../main/services/andon.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ng2ImgMaxService } from 'ng2-img-max';


@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {

  @Input() file: File;
  @Input() id: string;
  @Input() module: string;

  task: AngularFireUploadTask;
  date: string = new Date().toISOString();

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  constructor(
    private storage: AngularFireStorage, 
    private db: AngularFirestore,
    private andonService: AndonService,
    private snackbar: MatSnackBar,
    private ng2ImgMax: Ng2ImgMaxService,

    ) { }

  ngOnInit(): void {
    this.startUpload();
  }

  startUpload(): void {

    this.ng2ImgMax.resize([this.file], 800, 1000).subscribe((result) => {
    // The storage path   module
    const path = `${this.module}/${this.id}/pictures/${this.id}-${this.date}-${result.name}.png`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, result);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
        finalize(async () => {
          this.downloadURL = await ref.getDownloadURL().toPromise();

          switch (this.module) {
            case 'andon':
              this.andonService.updateAndonImage(this.id, this.downloadURL)
              .pipe(take(1))
              .subscribe((res) => {
                res.commit().then(() => {
                  this.snackbar.open('✅ upload success', 'Aceptar', {
                    duration: 6000,
                  });
                });
              });
              break;

            default:
              break;
          }

        }),
      );
   });
  }

  isActive(snapshot): boolean {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}