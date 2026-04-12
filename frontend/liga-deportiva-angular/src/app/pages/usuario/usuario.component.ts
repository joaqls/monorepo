import { Component, OnInit } from '@angular/core';
import { PartidosService } from '../../services/partidos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html'
})
export class UsuarioComponent implements OnInit {

  partidos: any[] = [];
  equipo: string | null = null;

  constructor(
    private partidosService: PartidosService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const usuario = this.authService.getUsuario();

    if (usuario && usuario.equipo) {
      this.equipo = usuario.equipo;

      this.partidosService
        .obtenerPartidosPorEquipo(usuario.equipo)
        .subscribe(data => this.partidos = data);
    }
  }
}