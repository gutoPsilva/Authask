import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  faArrowRight,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginError: string = '';

  showPassword: boolean = false;
  loginForm!: FormGroup;

  discord = faDiscord;
  arrowRight = faArrowRight;
  eye = faEye;
  eyeSlash = faEyeSlash;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.alertService.showLoadingAlert(
        'Logging in user, please wait a moment...'
      );
      this.loginError = ''; // always reset the error when submitted, so the user can notice he made a mistake again

      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.authService.setUser(res);
          console.log(this.authService.getUser());
          this.alertService.showLoadingAlert('');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.loginError = err.error.message;
          this.alertService.showLoadingAlert('');
        },
      });
    }
  }

  signinWithDiscord() {
    this.alertService.showLoadingAlert(
      'Please grant authorization and await login through Discord...'
    );
    this.authService.signin().subscribe({
      next: (res) => {
        this.authService.setUser(res);
        this.loginError = '';
        console.log(this.authService.getUser());
        this.alertService.showLoadingAlert('');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loginError = err.error.message;
        this.alertService.showLoadingAlert('');
      },
    });
  }

  redirectFgt() {
    this.router.navigate(['/forgot-password']);
  }

  togglePassword(event?: KeyboardEvent) {
    if (event && event.key !== 'Enter') return; // se houver evento e ele for diferente do Enter, não execute, esse parâmetro só é fornecido quando o eye está selecionado com o tab, e como é opcional, o clique não passa nada e já passa para o toggle abaixo

    this.showPassword = !this.showPassword;
  }
}
