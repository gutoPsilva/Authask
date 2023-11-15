import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  faArrowRight,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';  
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';

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
  github = faGithub;
  arrowRight = faArrowRight;
  eye = faEye;
  eyeSlash = faEyeSlash;

  constructor(
    private authService: AuthService,
    private alertService: AlertService
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

  async onSubmit() {
    if (this.loginForm.valid) {
      this.alertService.showLoadingAlert(
        'Logging in user, please wait a moment...'
      );

      await this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.authService.setUser(res);
          this.loginError = '';
          console.log(this.authService.getUser());
          this.alertService.showLoadingAlert('');
        },
        error: (err) => {
          this.loginError = err.error.message;
          this.alertService.showLoadingAlert('');
        },
      });
    }
  }

  async signinWithDiscord() {
    this.alertService.showLoadingAlert(
      'Please grant authorization and await login through Discord...'
    );
    await this.authService.signin().subscribe({
      next: (res) => {
        this.authService.setUser(res);
        this.loginError = '';
        console.log(this.authService.getUser());
        this.alertService.showLoadingAlert('');
      },
      error: (err) => {
        this.loginError = err.error.message;
        this.alertService.showLoadingAlert('');
      },
    });
  }

  togglePassword(event?: KeyboardEvent) {
    if (event && event.key !== 'Enter') return; // se houver evento e ele for diferente do Enter, não execute, esse parâmetro só é fornecido quando o eye está selecionado com o tab, e como é opcional, o clique não passa nada e já passa para o toggle abaixo

    this.showPassword = !this.showPassword;
  }
}
