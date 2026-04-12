import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';

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
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  registrar() {
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

    this.usuariosService.registrarUsuario(nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario registrado correctamente');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Error al registrar usuario');
      }
    });
  }
}