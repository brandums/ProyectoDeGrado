import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from './services/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: any;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
    )
  { }

  ngOnInit(): void {
    this.authService.usuario.subscribe(usuario => {
      if (!usuario) {
        this.user = null;
        this.router.navigate(['/login']);
      }
      else {
        this.user = usuario;
      }
      this.cdr.detectChanges();
    });
  }

  title = 'jrc_abogados.client';
}
