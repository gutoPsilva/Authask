import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { AuthenticatedUser } from 'src/interfaces/auth.interface';

@Injectable()
class PermissionsService {
  constructor(private authService: AuthService, private router: Router) {}
  private user: AuthenticatedUser | null = null;

  canActivate(): boolean {
    const user = this.authService.user.subscribe((user) => {
      this.user = user;
    });

    if(user) return true;
    this.router.navigate(['/login']);
    return true;
  }
}

export const LoginGuard: CanActivateFn = (route, state) => {
  return inject(PermissionsService).canActivate();
};
