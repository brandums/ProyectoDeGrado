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

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: any) {
    this.loggingIn = true;
    this.isSubmitted = true;
    this.errorMessage = null;

    if (form.invalid) {
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loggingIn = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error desconocido.';
        this.loggingIn = false;
        console.error('Error en el inicio de sesión', err);
      }
    });
  }
}
