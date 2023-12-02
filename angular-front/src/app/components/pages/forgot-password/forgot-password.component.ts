import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  faEye,
  faEyeSlash,
  faKey,
  faTicket,
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EmailService } from 'src/app/services/email/email.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  sendingEmail: boolean = false;
  emailError: string = '';
  tokenError: string = '';
  resetForm!: FormGroup;
  emailForm!: FormGroup;

  eye = faEye;
  eyeSlash = faEyeSlash;
  ticketIcon = faTicket;
  keyIcon = faKey;
  arrowIcon = faArrowDown;

  showPassword: boolean = false;
  showCpassword: boolean = false;
  unmatchingPasswords: boolean = false;
  passwordPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*_?.])[A-Za-z\\d!@#$%^&*_?.]*$'; // 1 lower, 1 upper, 1 number, 1 special in any order

  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      token: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    });

    this.emailForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email, // already limits the email to be 254 characters
      ]),
    });
  }

  get token() {
    return this.resetForm.get('token');
  }

  get password() {
    return this.resetForm.get('password');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  get email() {
    return this.emailForm.get('email');
  }

  sendEmail() {
    if (this.emailForm.valid) {
      this.sendingEmail = true;
      this.alertService.showLoadingAlert(
        'Sending email... This may take a few seconds.'
      );
      this.emailService.sendEmail(this.emailForm.value.email).subscribe({
        next: (res) => {
          this.alertService.showLoadingAlert('');
          this.alertService.showAlert('Token sent to your email.');
          this.emailError = '';
          this.sendingEmail = false;
        },
        error: (err) => {
          if (err.error.message === 'Invalid credentials') {
            this.emailError = 'Email not found.';
          }
          this.alertService.showLoadingAlert('');
        },
      });
    }
  }

  onSubmit() {
    if (this.password?.value !== this.confirmPassword?.value) {
      this.unmatchingPasswords = true;
      return; // do not proced even if all fields are fullfield, because these two inputs must be the same.
    } else this.unmatchingPasswords = false;

    if (this.resetForm.valid) {
      const { token, password } = this.resetForm.value;
      this.alertService.showLoadingAlert('Reseting password...');

      this.authService
        .resetPassword({
          token,
          password,
        })
        .subscribe({
          next: (res) => {
            this.alertService.showLoadingAlert('');
            this.alertService.showAlert('Password reseted successfully!');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.alertService.showLoadingAlert('');
            this.tokenError = err.error.message;
          },
        });
    }
  }

  togglePassword(field: 'password' | 'cpassword', event?: KeyboardEvent) {
    if (event && event.key !== 'Enter') return;
    field === 'password'
      ? (this.showPassword = !this.showPassword)
      : (this.showCpassword = !this.showCpassword);
  }
}
