import { Component, OnInit } from '@angular/core';
import { PartidosService } from '../../services/partidos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-arbitro',
  templateUrl: './arbitro.component.html'
})
export class ArbitroComponent implements OnInit {

  partidos: any[] = [];
  arbitro: string | null = null;   // 👈 ESTA LÍNEA ES LA CLAVE

  constructor(
    private partidosService: PartidosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuario();

    if (usuario && usuario.usuario) {
      this.arbitro = usuario.usuario;

      this.partidosService
        .obtenerPartidosPorArbitro(usuario.usuario)
        .subscribe(data => this.partidos = data);
    }
  }
}