import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-budgets-pending-approval',
  templateUrl: './budgets-pending-approval.component.html',
  styleUrls: ['./budgets-pending-approval.component.scss'],
})
export class BudgetsPendingApprovalComponent implements OnInit {
  constructor(
    public auth: AuthService,
    private breakpoint: BreakpointObserver
  ) {}

  public searchBoxes: Array<any> = [
    { placeholder: 'Taller', icon: 'business' },
    { placeholder: 'WO MAIN', icon: 'search' },
    { placeholder: 'WO CHILD', icon: 'search' },
    { placeholder: 'CLIENTE', icon: 'search' },
  ];

  public subscriptions: Subscription = new Subscription();

  public isMobile: boolean = false;

  public cantWO: number = 0;

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
