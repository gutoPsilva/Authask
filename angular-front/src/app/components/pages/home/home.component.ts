import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TaskService } from 'src/app/services/task/task.service';
import { AuthenticatedUser } from 'src/interfaces/auth.interface';
import { ITaskStats } from 'src/interfaces/tasks.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  user: AuthenticatedUser | null = null;
  userStats: ITaskStats | null = null;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.user = user;
        if (user) {
          this.taskService.userTaskStats().subscribe({
            next: (stats) => (this.userStats = stats),
            error: (err) => console.log(err),
          });
        }
      },
      error: (err) => console.log(err),
    });
  }

  loginRedirect() {
    this.router.navigate(['/login']);
  }

  manageTasksRedirect() {
    this.router.navigate(['/task-list']);
  }
}
