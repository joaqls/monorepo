import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  usuario = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.usuario || !this.password) {
      alert('Introduce usuario y contraseña');
      return;
    }

    this.authService.logout();

    this.authService.login(this.usuario, this.password).subscribe({
      next: (res: any) => {
        this.authService.setUsuario(res);

        switch (res.rol) {
          case 'admin':
            this.router.navigate(['/admin']);
            break;
          case 'usuario':
            this.router.navigate(['/usuario']);
            break;
          case 'capitan':
            this.router.navigate(['/capitan']);
            break;
          case 'arbitro':
            this.router.navigate(['/arbitro']);
            break;
        }
      },
      error: () => {
        alert('Usuario o contraseña incorrectos');
      }
    });
  }
}