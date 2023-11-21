import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthenticatedUser } from 'src/interfaces/auth.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  user: AuthenticatedUser | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loginRedirect() {
    this.router.navigate(['/login']);
  }

  manageTasksRedirect() {
    this.router.navigate(['/task-list']);
  }
}
