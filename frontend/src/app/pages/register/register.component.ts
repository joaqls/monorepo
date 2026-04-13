import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  usuario = '';
  password = '';
  rol = '';
  equipo = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registrar() {
    this.usuario = this.usuario.trim();
    this.equipo = this.equipo.trim();

    if (!this.usuario || !this.password || !this.rol) {
      alert('Completa los campos obligatorios');
      return;
    }

    // Validar equipo según rol
    if ((this.rol === 'usuario' || this.rol === 'capitan') && !this.equipo) {
      alert('Este rol necesita equipo');
      return;
    }

    const nuevoUsuario: any = {
      usuario: this.usuario,
      password: this.password,
      rol: this.rol
    };

    if (this.rol === 'usuario' || this.rol === 'capitan') {
      nuevoUsuario.equipo = this.equipo;
    }

    this.authService.registrarUsuario(nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario registrado correctamente');
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse | Error) => {
        console.error('[REGISTRO ERROR]', err);
        const apiMessage = err instanceof HttpErrorResponse ? err.error?.message : null;
        const fieldErrors = err instanceof HttpErrorResponse ? err.error?.errors : null;
        const plainMessage = err instanceof Error ? err.message : null;

        console.log('[REGISTRO DEBUG]', {
          isHttpError: err instanceof HttpErrorResponse,
          status: err instanceof HttpErrorResponse ? err.status : 'N/A',
          apiMessage,
          fieldErrors,
          plainMessage
        });

        if (fieldErrors) {
          const allErrors = Object.values(fieldErrors).flat().filter(
            (e): e is string => typeof e === 'string'
          );
          const duplicate = allErrors.find(e =>
            e.toLowerCase().includes('already been taken') ||
            e.toLowerCase().includes('ya ha sido')
          );

          if (duplicate) {
            alert('Ese nombre de usuario ya existe. Prueba con otro distinto.');
            return;
          }

          const firstField = Object.keys(fieldErrors)[0];
          const firstError = firstField ? fieldErrors[firstField]?.[0] : null;

          if (firstError) {
            alert(firstError);
            return;
          }
        }

        if (apiMessage) {
          if (apiMessage.toLowerCase().includes('equipo')) {
            alert('El equipo es obligatorio para los roles usuario y capitan.');
            return;
          }

          alert(apiMessage);
          return;
        }

        if (plainMessage) {
          alert(plainMessage);
          return;
        }

        alert('Error al registrar usuario');
      }
    });
  }
}