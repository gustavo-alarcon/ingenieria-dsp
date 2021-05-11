import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-budgets-pending-send',
  templateUrl: './budgets-pending-send.component.html',
  styleUrls: ['./budgets-pending-send.component.scss'],
})
export class BudgetsPendingSendComponent implements OnInit {
  constructor(
    public auth: AuthService,
    private breakpoint: BreakpointObserver
  ) {}

  public searchBoxes: object = [
    { placeholder: 'WO MAIN', icon: 'search' },
    { placeholder: 'WO CHILD', icon: 'search' },
    { placeholder: 'CLIENTE', icon: 'search' },
  ];

  public subscriptions: Subscription = new Subscription();

  public isMobile: boolean = false;

  public cantWO: number = 2;

  public ngOnInit(): void {
    this.subscriptions.add(
      this.breakpoint
        .observe([Breakpoints.HandsetPortrait])
        .subscribe((res) => {
          if (res.matches) {
            this.isMobile = true;
          } else {
            this.isMobile = false;
          }
        })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
