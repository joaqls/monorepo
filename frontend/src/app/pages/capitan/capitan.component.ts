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
  clubs: any[] = [];
  resultados: Record<number, string> = {};
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
    this.partidosService.obtenerClubs().subscribe({
      next: (clubs) => this.clubs = clubs,
      error: () => this.clubs = []
    });

    const usuario = this.authService.getUsuario();

    if (usuario && usuario.equipo) {
      this.equipo = usuario.equipo;

      this.partidosService
        .obtenerPartidosPorEquipo(this.equipo)
        .subscribe((data: any[]) => {
          this.partidos = data;
          this.resultados = data.reduce((acc: Record<number, string>, partido: any) => {
            const id = Number(partido?.id);
            if (id) {
              acc[id] = '';
            }
            return acc;
          }, {});
        });
    }
  }

  // Determina si este capitán es local o visitante en ESTE partido
  obtenerRolCapitan(partido: any): 'capitanLocal' | 'capitanVisitante' {
    return this.nombreClub(partido, 'local') === this.equipo
      ? 'capitanLocal'
      : 'capitanVisitante';
  }

  // Comprueba si el partido ya se ha jugado
  partidoFinalizado(partido: any): boolean {
    return new Date(partido.fecha) <= new Date();
  }

  puedeEnviarResultado(partido: any): boolean {
    if (!this.partidoFinalizado(partido)) {
      return false;
    }

    const estado = this.getEstadoPartido(partido);
    if (estado === 'en_revision') {
      return false;
    }

    const rolCapitan = this.obtenerRolCapitan(partido);
    if (rolCapitan === 'capitanLocal') {
      return !partido?.resultado_capitan_local;
    }

    return !partido?.resultado_capitan_visitante;
  }

  haEnviadoResultado(partido: any): boolean {
    const rolCapitan = this.obtenerRolCapitan(partido);
    if (rolCapitan === 'capitanLocal') {
      return !!partido?.resultado_capitan_local;
    }

    return !!partido?.resultado_capitan_visitante;
  }

  resultadoCapitanActual(partido: any): string | null {
    const rolCapitan = this.obtenerRolCapitan(partido);
    if (rolCapitan === 'capitanLocal') {
      return partido?.resultado_capitan_local ?? null;
    }

    return partido?.resultado_capitan_visitante ?? null;
  }

  faltaResultadoContrario(partido: any): boolean {
    const rolCapitan = this.obtenerRolCapitan(partido);
    if (rolCapitan === 'capitanLocal') {
      return !partido?.resultado_capitan_visitante;
    }

    return !partido?.resultado_capitan_local;
  }

  mensajeEstado(partido: any): string {
    if (!this.partidoFinalizado(partido)) {
      return 'El partido aun no se ha jugado';
    }

    if (this.getEstadoPartido(partido) === 'en_revision') {
      return 'Resultado en conflicto. Resolucion pendiente de administrador.';
    }

    if (this.haEnviadoResultado(partido) && this.faltaResultadoContrario(partido)) {
      return 'Resultado enviado. A espera de capitan contrario.';
    }

    if (this.getEstadoPartido(partido) === 'confirmado') {
      return 'Resultado confirmado.';
    }

    return 'No se puede modificar este partido';
  }

  enviarResultado(partido: any) {
    const id = Number(partido?.id);
    if (!id) {
      return;
    }

    const resultado = (this.resultados[id] || '').trim();
    if (!resultado) {
      alert('Introduce un resultado');
      return;
    }

    const rolCapitan = this.obtenerRolCapitan(partido);

    this.partidosService
      .enviarResultado(String(id), rolCapitan, resultado)
      .subscribe(() => {
        alert('Resultado enviado');
        this.resultados[id] = '';
        this.ngOnInit();
      });
  }

  nombreClub(partido: any, side: 'local' | 'visitante'): string {
    const relation = side === 'local' ? partido?.clubLocal : partido?.clubVisitante;
    if (typeof relation?.nombre === 'string' && relation.nombre.trim() !== '') {
      return relation.nombre;
    }

    const id = Number(side === 'local' ? partido?.club_local_id : partido?.club_visitante_id);
    const match = this.clubs.find((club) => Number(club?.id) === id);
    if (typeof match?.nombre === 'string' && match.nombre.trim() !== '') {
      return match.nombre;
    }

    return side === 'local' ? 'Club local' : 'Club visitante';
  }
}