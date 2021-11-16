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
      const { user } = await this.authSevice.loginGoogle();
      const userMail = user.email.split('@');
      if ((userMail[1] !== 'meraki-s.com' && userMail[1] !== 'ferreyros.com.pe')) {
        this.router.navigate(['/auth']);
        this.authSevice.logout();
      }
      this.router.navigate(['/main']);
    } catch (error) {
      console.log('error');
    }
  }
}
