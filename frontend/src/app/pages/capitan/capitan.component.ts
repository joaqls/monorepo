import { Component, OnInit } from '@angular/core';
import { PartidosService } from '../../services/partidos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-capitan',
  templateUrl: './capitan.component.html',
  styles: []
})
export class CapitanComponent implements OnInit {

  partidos: any[] = [];
  resultado: string = '';
  equipo: string = '';

  constructor(
    private partidosService: PartidosService,
    private authService: AuthService
  ) {}

  getEstadoPartido(partido: any): string {
    return typeof partido?.estado === 'string'
      ? partido.estado
      : (partido?.resultado ? 'confirmado' : 'pendiente');
  }

  ngOnInit(): void {
    const usuario = this.authService.getUsuario();

    if (usuario && usuario.equipo) {
      this.equipo = usuario.equipo;

      this.partidosService
        .obtenerPartidosPorEquipo(this.equipo)
        .subscribe((data: any[]) => {
          this.partidos = data;
        });
    }
  }

  // Determina si este capitán es local o visitante en ESTE partido
  obtenerRolCapitan(partido: any): 'capitanLocal' | 'capitanVisitante' {
    return partido?.clubLocal?.nombre === this.equipo
      ? 'capitanLocal'
      : 'capitanVisitante';
  }

  // Comprueba si el partido ya se ha jugado
  partidoFinalizado(partido: any): boolean {
    return new Date(partido.fecha) <= new Date();
  }

  enviarResultado(partido: any) {
    if (!this.resultado) {
      alert('Introduce un resultado');
      return;
    }

    const rolCapitan = this.obtenerRolCapitan(partido);

    this.partidosService
      .enviarResultado(String(partido.id), rolCapitan, this.resultado)
      .subscribe(() => {
        alert('Resultado enviado');
        this.resultado = '';
        this.ngOnInit();
      });
  }
}