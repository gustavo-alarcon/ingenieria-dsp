import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskModule } from 'ngx-mask';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { environment } from '../environments/environment';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { LandingComponent } from './shared/landing/landing.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule,
    NgxMaskModule.forRoot(),
    LazyLoadImageModule,
  ],
  providers: [
    { provide: BUCKET, useValue: environment.firebase.storageBucket },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
