import { Component } from '@angular/core';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DiscordUser, LocalUser } from 'src/interfaces/auth.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    private authService: AuthService,
    private alertService: AlertService
  ) {}
  lock = faLock;
  user: LocalUser | DiscordUser | null = null;

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      this.user = user;
      console.log(this.user);
    });
  }

  async logout() {
    if (this.user) {
      this.alertService.showLoadingAlert('Logging out, please wait a moment...');
      await this.authService.logout().subscribe((res) => {
        console.log(res);
        this.alertService.showLoadingAlert('');

        if (res.loggedOut) {
          this.authService.setUser(null);
          localStorage.removeItem('user'); // remove storage, since the session is now destroyed
        } else {
          this.alertService.showAlert('Error logging out.');
        }
      });
    }
  }
}
