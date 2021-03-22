import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { InitialEvaluationsService } from 'src/app/main/services/initial-evaluations.service';
import { DialogDispatchGenerateComponent } from './dialogs/generate/dialog-dispatch-generate.component';

@Component({
  selector: 'app-generate-dispatch',
  templateUrl: './generate-dispatch.component.html',
  styleUrls: ['./generate-dispatch.component.scss']
})
export class GenerateDispatchComponent implements OnInit {
  loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  buttonStyle: any;

  subscriptions = new Subscription();
  isMobile = false;

  isHovering = false;

  files: Array<File> = [];
  pathStorage = 'init-eval-reports';
  resizedFiles: Object = {};
  imageCounter = 0;

  data: any;
  receptionFiles: Object = {};

  constructor(
    private dialog: MatDialog,
    private breakpoint: BreakpointObserver,
    private initEvalService: InitialEvaluationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.initEvalService.actualReception) {
      this.router.navigateByUrl('main/init-eval-reports');
    }

    this.subscriptions.add(this.breakpoint.observe([Breakpoints.HandsetPortrait])
      .subscribe(res => {
        if (res.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }
      })
    )



  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleHover(event: boolean): void {
    this.isHovering = event;
  }

  onDrop(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      if (!this.checkIfExist(files[i])) {
        this.files.push(files.item(i));
      }
    }
  }

  addNewImage(event): void {
    if (this.imageCounter > 12) {
      return
    }
    // we are using the name of file as key for the object to improve performance in search
    const name = event['name'];

    if (this.receptionFiles[name]) {
      return
    }

    if (this.resizedFiles[name] && this.resizedFiles[name]['selected'] === false) {
      delete this.resizedFiles[name];
    } else {
      this.resizedFiles[name] = { file: event['file'], selected: event['selected'], imageURL: event['imageURL'] };
    }

    this.imageCounter += event['counter'];
  }

  checkIfExist(file: File): boolean {
    return !!this.resizedFiles[file.name]
  }

  checkIfImagesSelected(): boolean {
    const entries = Object.entries(this.resizedFiles);
    let selected = false;

    entries.every(entry => {
      selected = entry[1]['selected'];
      return !selected;
    })

    return selected
  }

  generateReport(): void {
    console.log(this.resizedFiles);

    this.dialog.open(DialogDispatchGenerateComponent, {
      width: '90vw',
      maxWidth: '600px',
      disableClose: true,
      data: {
        files: this.resizedFiles,
        reception: this.initEvalService.actualReception
      }
    })
  }

  checkReception(data: any): boolean {
    let match = false;

    this.initEvalService.actualReception.data.every(file => {
      match = data['name'] === file.name
      return !match
    })

    return match
  }

}
