import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { AndonBroadcastList, AndonProblemType } from 'src/app/main/models/andon.model';
import { AndonService } from '../../../../../services/andon.service';

@Component({
  selector: 'app-edit-problem-type',
  templateUrl: './edit-problem-type.component.html',
  styleUrls: ['./edit-problem-type.component.scss']
})
export class EditProblemTypeComponent implements OnInit {

  editFormGroup: FormGroup;
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();
  emailFormArray = new FormArray([]);

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: AndonProblemType,
    private andonService: AndonService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  email: string[] = [];

  ngOnInit(): void {
    this.initForm();
    this.email = [...this.data.emailList]
  }

  initForm(){
    this.editFormGroup = this.fb.group({
      name: [
        this.data.name ? this.data.name: '',
        [Validators.required]
      ],
      emailList: ['',[
        Validators.pattern(/^[\w]{1,}[\w.+-]{0,}@[\w-]{1,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/)
        ]],
    });
  }

  addEmail (){
    if(this.editFormGroup.get('name').invalid){
      this.editFormGroup.markAllAsTouched()
      return
    }
    const value = { ...this.editFormGroup.value };

    if(value.emailList === ''){
      this.snackbar.open('🚨 No se pueden guardar procesos vacios  !', 'Aceptar', {
        duration: 6000
      });
      return
    }

    this.email.push(value.emailList);
    this.resetEmail();
  }

     resetEmail(){
       this.editFormGroup.get('emailList').reset
     }

     deleteEmail(index: number) {
    
      this.email.splice(index,1);
      // this.data.emailArray = [...this.email];
      
      // this.andonService.deleteAndonProblemType
      // this.dialog.open(DeleteProcessDialogComponent, {
      //   maxWidth: 500,
      //   width: '90vw',
      //   data: this.data,
      // });
      // this.process.splice(index, 1);
    }

    saveChanges(){
      try{
        this.loading.next(true);
        if(this.editFormGroup.invalid){
          this.editFormGroup.markAllAsTouched();     
          this.loading.next(false);
          return
        }
      
      
        if (this.editFormGroup.valid){
          this.andonService.updateProblemType( 
            this.data.id,
            this.editFormGroup.value,
            this.email)
            .subscribe((batch: firebase.default.firestore.WriteBatch) => {
              batch.commit().then(() => {
                this.loading.next(false);

                this.snackbar.open(
                  ' ✅ Archivo se modifico de forma correcta',
                  'Aceptar',
                  {
                    duration:6000,
                  }
                );
                this.dialog.closeAll();
              });
            });

    }
      }catch(error){
        console.log(error);
        this.loading.next(false);
      }

}
}
