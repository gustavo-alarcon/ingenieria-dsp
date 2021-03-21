import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

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
  resizedFiles: Array<File> = [];

  constructor(
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
      this.files.push(files.item(i));
    }
  }

  addNewImage(event): void {
    this.resizedFiles.push(event);
  }

}
