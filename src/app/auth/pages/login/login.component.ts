import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  version = environment.version;
  subscription: Subscription;
  constructor(
    private router: Router,
    public authSevice: AuthService,
  ) { }

  async loginGoogle(): Promise<void> {
    try {
      await this.authSevice.loginGoogle();
      this.router.navigate(['/main']);
    } catch (error) {
      console.log('error');
    }
  }
}
