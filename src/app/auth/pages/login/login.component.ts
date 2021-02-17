import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  version = environment.version;

  constructor(
    private router: Router,
    private authSevice: AuthService,
  ) { }

  async loginGoogle(): Promise<void> {
    try {
      const resp = await this.authSevice.loginGoogle();
      this.router.navigate(['/main']);
    } catch (error) {
      console.log('error');
    }
  }
}
