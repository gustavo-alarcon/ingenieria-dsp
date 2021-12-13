import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsageMonitorComponent } from './usage-monitor.component';

const routes: Routes = [
  {
    path: '',
    component: UsageMonitorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsageMonitorRoutingModule {}
