import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faArrowRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  showPassword: boolean = false;
  showCpassword: boolean = false;
  unmatchingPasswords: boolean = false;
  passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]*'; // 1 lower, 1 upper, 1 number, 1 special in any order

  signForm!: FormGroup;

  arrowRight = faArrowRight;
  eye = faEye;
  eyeSlash = faEyeSlash;

  ngOnInit(): void {
    this.signForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
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

  onSubmit() {
    if (this.password?.value !== this.confirmPassword?.value) {
      this.unmatchingPasswords = true;
      return; // do not proced even if all fields are fullfield, because these two inputs must be the same.
    } else this.unmatchingPasswords = false;

    if (this.signForm.valid) console.log('valid');
  }

  togglePassword(field: 'password' | 'cpassword', event?: KeyboardEvent) {
    if (event && event.key !== 'Enter') return;
    field === 'password'
      ? (this.showPassword = !this.showPassword)
      : (this.showCpassword = !this.showCpassword);
  }
}
