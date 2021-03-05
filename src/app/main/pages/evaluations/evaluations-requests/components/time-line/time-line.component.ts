import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}



// import { Component, OnInit, Inject, ViewChild, ElementRef, OnDestroy,NgZone } from '@angular/core';
// import { BehaviorSubject, from } from 'rxjs';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { RequestsStartDialogComponent } from '../requests-start-dialog/requests-start-dialog.component';
// import { Evaluation } from '../../../../../models/evaluations.model';
// import { Square } from 'src/app/main/pages/evaluations/evaluations-requests/dialogs/requests-time-line-dialog/Square';

// @Component({
//   selector: 'app-requests-time-line-dialog',
//   templateUrl: './requests-time-line-dialog.component.html',
//   styleUrls: ['./requests-time-line-dialog.component.scss']
// })
// export class RequestsTimeLineDialogComponent implements OnInit,OnDestroy {

//   @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
//   ctx: CanvasRenderingContext2D;
//   requestId;
//   interval;
//   squares: Square[] = [];

//   loading = new BehaviorSubject<boolean>(false);
//   loading$ = this.loading.asObservable();


//   constructor(
//     public dialogRef: MatDialogRef<RequestsStartDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: Evaluation,
//     private ngZone: NgZone

//   ) { }
  
//   ngOnInit() {
//     this.ctx = this.canvas.nativeElement.getContext('2d');
//     this.ctx.fillStyle = 'red';
//     this.ngZone.runOutsideAngular(() => this.tick());
//     setInterval(() => {
//       this.tick();
//     }, 200);
//   }

//   tick() {
//     this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
//     this.squares.forEach((square: Square) => {
//       square.moveRight();
//     });
//     this.requestId = requestAnimationFrame(() => this.tick);
//   }

//   play() {
//     const square = new Square(this.ctx);
//     this.squares = this.squares.concat(square);
//   }

//   ngOnDestroy() {
//     clearInterval(this.interval);
//     cancelAnimationFrame(this.requestId);
//   }
// }

