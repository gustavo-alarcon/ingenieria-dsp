import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { UploadTaskComponent } from './upload-task/upload-task.component';
import { DropzoneDirective } from './upload-task/dropzone.directive';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { ZipTaskComponent } from './zip-task/zip-task.component';


@NgModule({
  declarations: [
    DropzoneDirective,
    UploadTaskComponent,
    ZipTaskComponent
  ],
  exports: [
    DropzoneDirective,
    UploadTaskComponent,
    ZipTaskComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    Ng2ImgMaxModule
  ]
})
export class ComponentsModule { }
