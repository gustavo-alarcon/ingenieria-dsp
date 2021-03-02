// import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { BehaviorSubject, Observable, Subscription } from 'rxjs';
// import { Evaluation, EvaluationInquiry } from 'src/app/main/models/evaluations.model';
// import { EvaluationsService } from 'src/app/main/services/evaluations.service';
// import { AuthService } from 'src/app/auth/services/auth.service';
// import { User } from 'src/app/main/models/user-model';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Ng2ImgMaxService } from 'ng2-img-max';
// import { AngularFireStorage } from '@angular/fire/storage';
// import { finalize } from 'rxjs/operators';

// @Component({
//   selector: 'app-evaluations-response-dialog',
//   templateUrl: './evaluations-response-dialog.component.html',
//   styleUrls: ['./evaluations-response-dialog.component.scss']
// })
// export class EvaluationsResponseDialogComponent implements OnInit, OnDestroy {


//   loading = new BehaviorSubject<boolean>(false);
//   loading$ = this.loading.asObservable();

//   responseForm: FormGroup;

//   user: User;

//   imagesUpload: string = null;
//   date: string = new Date().toISOString();

//   evaluationsById: EvaluationInquiry[] = [];

//   uploadPercent$: Observable<number>;
//   private subscription = new Subscription();

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: Evaluation,
//     public dialogRef: MatDialogRef<EvaluationsResponseDialogComponent>,
//     private fb: FormBuilder,
//     private evaluationServices: EvaluationsService,
//     public authService: AuthService,
//     private snackBar: MatSnackBar,
//     private ng2ImgMax: Ng2ImgMaxService,
//     private storage: AngularFireStorage,
//   ) { }

//   ngOnInit(): void {
//     this.loading.next(true);
//     this.createForm();
//     this.subscription.add(this.authService.user$.subscribe(user => {
//       this.user = user;
//     }));

//     this.subscription.add(
//       this.evaluationServices.getEvaluationInqueryById(this.data.id).subscribe((resp) => {
//         this.evaluationsById = resp;
//         this.addControls(this.evaluationsById);
//         this.loading.next(false);
//       })
//     );
//   }

//   createForm(): void {
//     this.responseForm = this.fb.group({
//       answers: this.fb.array([])
//     });
//   }

//   get answers(): FormArray {
//     return this.responseForm.get('answers') as FormArray;
//   }

//   addControls(resp: EvaluationInquiry[]): void {
//     if (resp.length === 0) {
//       return;
//     }
//     for (const item of resp) {
//       const group = this.fb.group({
//         answer: [item.answer, [Validators.required]],
//         answerImage: [item.answerImage],
//       });
//       this.answers.push(group);
//     }
//   }

//   onSubmit(): void {
//     this.loading.next(true);
//     if (this.responseForm.invalid) {
//       this.responseForm.markAllAsTouched();
//       this.loading.next(false);
//       this.scrollToFirstInvalidControl();
//       return;
//     }

//     this.loading.next(false);


    
//   }

//   async deleteImage(index: number): Promise<void> {
//     try {
//       this.loading.next(true);
//       await this.evaluationServices.deleteImage(this.answers.controls[index].get('answerImage').value);
//       this.loading.next(false);
//       this.answers.controls[index].get('answerImage').setValue(null);
//     } catch (error) {
//       console.log(error);
//       this.loading.next(false);
//     }
//   }


//   uploadFile(event, index?: number): void {
//     if (!event.target.files[0]) {
//       return;
//     }
//     this.loading.next(true);
//     const file = event.target.files[0];
//     this.subscription.add(this.ng2ImgMax.resize([file], 800, 1000).subscribe((result) => {
//       const name = `evaluations/${this.data.id}/pictures/${this.data.id}-${this.date}-${result.name}.png`;
//       const fileRef = this.storage.ref(name);
//       const task = this.storage.upload(name, file);
//       this.uploadPercent$ = task.percentageChanges();
//       this.subscription.add(task.snapshotChanges().pipe(
//         finalize(() => {
//           fileRef.getDownloadURL().subscribe(url => {
//             this.answers.controls[index].get('answerImage').setValue(url);
//           });
//           this.loading.next(false);
//         })
//       ).subscribe()
//       );
//     }));

//   }

//   private scrollToFirstInvalidControl(): void {
//     let index = 0;
//     for (const obj of this.evaluationsById) {
//       if (this.answers.controls[index].get('answer').errors) {
//         document.getElementById(`${index * 1000}`).scrollIntoView();
//         return;
//       }
//       index++;
//     }
//   }

//   ngOnDestroy(): void {
//     this.subscription.unsubscribe();
//   }

// }
