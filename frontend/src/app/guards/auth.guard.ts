import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const usuario = this.authService.getUsuario();

    if (!usuario) {
      this.router.navigate(['/login']);
      return false;
    }

    const rolRequerido = route.data['rol'];

    if (!rolRequerido || usuario.rol === rolRequerido) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
