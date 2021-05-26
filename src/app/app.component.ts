import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Config } from 'protractor';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GeneralConfig } from './auth/models/generalConfig.model';
import { AuthService } from './auth/services/auth.service';
import { UpdateReadyComponent } from './shared/update-ready/update-ready.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor() {}
}
