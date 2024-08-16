import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isSubmitted: boolean = false;
  errorMessage: string | null = null;
  loggingIn = false;
  captchaResponse: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.renderCaptcha()
  }

  renderCaptcha() {
    if (typeof grecaptcha !== 'undefined') {
      grecaptcha.render('recaptcha-element', {
        sitekey: '6Le6RScqAAAAAJ2BPfa0I0Vm8EsNsaNhQsDBZBqZ',
        callback: (response: string) => {
          this.captchaResponse = response;
        }
      });
    } else {
      console.log('grecaptcha is not available');
    }
  }

  rechargeCaptcha() {
    if (typeof grecaptcha !== 'undefined') {
      grecaptcha.reset();
      this.captchaResponse = null;
    } else {
      console.log('grecaptcha is not available');
    }
  }

  onSubmit(form: any) {
    this.loggingIn = true;
    this.isSubmitted = true;
    this.errorMessage = null;

    if (form.invalid || !this.captchaResponse) {
      this.loggingIn = false;
      return;
    }

    this.authService.login(this.email, this.password, this.captchaResponse).subscribe({
      next: (response) => {
        this.loggingIn = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error desconocido.';
        this.loggingIn = false;
        console.error('Error en el inicio de sesión', err);
        this.rechargeCaptcha();
      }
    });
  }
}
