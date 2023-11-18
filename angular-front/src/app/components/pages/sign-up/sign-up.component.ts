import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  faArrowRight,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IdbUsedDetails } from 'src/interfaces/auth.interface';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  showPassword: boolean = false;
  showCpassword: boolean = false;
  unmatchingPasswords: boolean = false;
  passwordPattern =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*_?.])[A-Za-z\\d!@#$%^&*_?.]*$'; // 1 lower, 1 upper, 1 number, 1 special in any order

  signForm!: FormGroup;

  arrowRight = faArrowRight;
  eye = faEye;
  eyeSlash = faEyeSlash;

  dbUsed: IdbUsedDetails = { email: '', username: '' };

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email, // already limits the email to be 254 characters
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  get username() {
    return this.signForm.get('username');
  }

  get email() {
    return this.signForm.get('email');
  }

  get password() {
    return this.signForm.get('password');
  }

  get confirmPassword() {
    return this.signForm.get('confirmPassword');
  }

  async onSubmit() {
    if (this.password?.value !== this.confirmPassword?.value) {
      this.unmatchingPasswords = true;
      return; // do not proced even if all fields are fullfield, because these two inputs must be the same.
    } else this.unmatchingPasswords = false;

    if (this.signForm.valid) {
      const { confirmPassword, ...registerInfo } = this.signForm.value;
      this.alertService.showLoadingAlert(
        'Creating user, please wait a moment...'
      );
      this.dbUsed = { email: '', username: '' }; // reset dbUsedDetails

      await this.authService.registerLocalUser(registerInfo).subscribe({
        next: (res) => {
          console.log(res);
          this.alertService.showAlert(
            // selfClosingAlert in 5secs
            'Account created successfully! Now you can login.'
          );
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.alertService.showAlert("Couldn't create account, bad request.");

          // only these 2 cases are returned by the API
          if (err.error.message.includes('Email'))
            this.dbUsed.email = err.error.message;
          else this.dbUsed.username = err.error.message;

          console.log(err.error.message);
        },
      });

      this.alertService.showLoadingAlert(''); // response retrieved, not loading anymore, but maybe an alert error
    }
  }

  togglePassword(field: 'password' | 'cpassword', event?: KeyboardEvent) {
    if (event && event.key !== 'Enter') return;
    field === 'password'
      ? (this.showPassword = !this.showPassword)
      : (this.showCpassword = !this.showCpassword);
  }
}
