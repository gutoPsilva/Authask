import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { AuthenticatedUser } from 'src/interfaces/auth.interface';
import { AlertService } from '../services/alert/alert.service';

@Injectable()
export class PermissionsService {
  constructor(private authService: AuthService, private alertService: AlertService, private router: Router) {}
  private user: AuthenticatedUser | null = null;

  canActivate(): boolean {
    this.authService.user.subscribe((user) => {
      console.log(user);
      this.user = user;
    });

    if(this.user) return true;
    else {
      this.alertService.showAlert('You must login to access that page.');
      this.router.navigate(['/login']);
      return false;
    }
  }
}

export const AuthGuard: CanActivateFn = (route, state) => {
  return inject(PermissionsService).canActivate();
};
