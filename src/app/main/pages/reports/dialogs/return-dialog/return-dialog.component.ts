import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-return-dialog',
  templateUrl: './return-dialog.component.html',
  styleUrls: ['./return-dialog.component.scss']
})
export class ReturnDialogComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  detailsForm: FormGroup;

  images: string[];
  imagesUpload: string[] = [''];
  date: string = new Date().toISOString();

  uploadPercent$: Observable<number>;
  
  constructor(  
              private fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.detailsForm = this.fb.group({
      comments: ['',Validators.required],
    });
  }

  async deleteImage(imgForDelete: string, index: number): Promise<void> {
    /* try {
      this.loading.next(true);
      await this.evaluationServices.deleteImage(this.imagesUpload[index]);
      this.imagesUpload.splice(index, 1);
      this.loading.next(false);
    } catch (error) {
       console.log(error);
       this.loading.next(false);
       this.imagesUpload.splice(index, 1);
    } */
  }

  uploadFile(event, i?: number): void {
    if (!event.target.files[0]) {
      return;
    }
   /*  this.loading.next(true);
    const file = event.target.files[0];
    this.subscription.add(this.ng2ImgMax.resize([file], 800, 1000).subscribe((result) => {
      const name = `evaluations/${this.data.id}/pictures/${this.data.id}-${this.date}-${result.name}.png`;
      const fileRef = this.storage.ref(name);
      const task = this.storage.upload(name, file);
      this.uploadPercent$ = task.percentageChanges();
      this.subscription.add(task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            if (this.imagesUpload[i] === '') {
              this.imagesUpload.pop();
              this.imagesUpload.push(url);
              this.imagesUpload.push('');
            } else {
              this.imagesUpload[i] = url;
            }
          });
          this.loading.next(false);
        })
      ).subscribe()
      );
    })); */

  }
}
