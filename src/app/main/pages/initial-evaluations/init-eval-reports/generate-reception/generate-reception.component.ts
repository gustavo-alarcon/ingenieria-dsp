import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GenerateComponent } from './dialogs/generate/generate.component';

@Component({
  selector: 'app-generate-reception',
  templateUrl: './generate-reception.component.html',
  styleUrls: ['./generate-reception.component.sass']
})
export class GenerateReceptionComponent implements OnInit, OnDestroy {
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

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private breakpoint: BreakpointObserver
  ) { }

  ngOnInit(): void {
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
    if (this.imageCounter > 6) {
      return
    }
    // we are using the name of file as key for the object to improve performance in search
    const name = event['name'];
    if (this.resizedFiles[name]) {
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
    this.dialog.open(GenerateComponent, {
      width: '90vw',
      maxWidth: '600px',
      disableClose: true,
      data: this.resizedFiles
    }).afterClosed().subscribe(res => {
      if (res) {
        this.router.navigateByUrl('main/init-eval-reports')
      }
    })
  }

}
