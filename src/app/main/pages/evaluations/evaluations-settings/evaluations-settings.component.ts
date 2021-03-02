import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-evaluations-settings',
  templateUrl: './evaluations-settings.component.html',
  styleUrls: ['./evaluations-settings.component.scss']
})
export class EvaluationsSettingsComponent implements OnInit {

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit(): void {
  }

}
