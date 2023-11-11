import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faArrowRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  showPassword: boolean = false;

  loginForm!: FormGroup;

  arrowRight = faArrowRight;
  eye = faEye;
  eyeSlash = faEyeSlash;

  constructor() {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get username(){
    return this.loginForm.get('username');
  }

  get password(){
    return this.loginForm.get('password');
  }

  onSubmit(){
    if(this.loginForm.valid){
      console.log('Forms válido.')
      return;
    }
  }

  togglePassword(event?: KeyboardEvent) {
    if (event && event.key !== 'Enter') return; // se houver evento e ele for diferente do Enter, não execute, esse parâmetro só é fornecido quando o eye está selecionado com o tab, e como é opcional, o clique não passa nada e já passa para o toggle abaixo

    this.showPassword = !this.showPassword;
  }
}
