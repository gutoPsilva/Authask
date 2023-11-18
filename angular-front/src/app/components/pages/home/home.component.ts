import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthenticatedUser } from 'src/interfaces/auth.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  user: AuthenticatedUser | null = {
    discordId: '',
    email: '',
    password: '',
    id: 0,
    username:
      '',
  };
  fetchingUser: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // this.authService.getUser().subscribe({
    //   next: user => {
    //     this.user = user;
    //     this.fetchingUser = false;
    //   },
    //   error: err => {
    //     console.log(err);
    //     this.fetchingUser = false;
    //   }
    // });
  }
}
