import { Component, OnInit } from '@angular/core';
import { PartidosService } from '../../services/partidos.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styles: []
})
export class AdminComponent implements OnInit {

  // Formulario crear partido
  ligaId: number | null = null;
  clubLocalId: number | null = null;
  clubVisitanteId: number | null = null;
  fecha = '';
  arbitro = '';

  // Listados
  ligas: any[] = [];
  clubs: any[] = [];
  arbitros: any[] = [];
  partidos: any[] = [];
  partidosRevision: any[] = [];

  ediciones: Record<number, {
    fecha: string;
    arbitro: string;
    ubicacion: string;
    resultado: string;
  }> = {};

  constructor(private partidosService: PartidosService) {}

  ngOnInit(): void {
    this.cargarLigas();
    this.cargarClubs();
    this.cargarArbitros();
    this.cargarPartidos();
    this.cargarPartidosRevision();
  }

  // ======================
  // CREAR PARTIDO
  // ======================
  crearPartido() {
    if (
      !this.ligaId ||
      !this.clubLocalId ||
      !this.clubVisitanteId ||
      !this.fecha
    ) {
      alert('Completa todos los campos');
      return;
    }

    if (this.clubLocalId === this.clubVisitanteId) {
      alert('El club local y el visitante deben ser distintos');
      return;
    }

    const partido = {
      liga_id: this.ligaId,
      club_local_id: this.clubLocalId,
      club_visitante_id: this.clubVisitanteId,
      fecha: this.fecha,
      arbitro: this.arbitro || null,
    };

    this.partidosService.crearPartido(partido).subscribe({
      next: () => {
        alert('Partido creado');
        this.limpiarFormulario();
        this.cargarPartidos();
      },
      error: (err: Error) => {
        alert(err.message || 'No se pudo crear el partido');
      }
    });
  }

  limpiarFormulario() {
    this.ligaId = null;
    this.clubLocalId = null;
    this.clubVisitanteId = null;
    this.fecha = '';
    this.arbitro = '';
  }

  // ======================
  // LISTADOS
  // ======================
  cargarPartidos() {
    this.partidosService.obtenerPartidos().subscribe({
      next: (data) => {
        this.partidos = data;
        this.sincronizarEdiciones();
      },
      error: () => {
        this.partidos = [];
        this.ediciones = {};
      }
    });
  }

  cargarPartidosRevision() {
    this.partidosService.obtenerPartidosEnRevision().subscribe({
      next: (data) => this.partidosRevision = data,
      error: () => this.partidosRevision = []
    });
  }

  cargarLigas() {
    this.partidosService.obtenerLigas().subscribe({
      next: (data) => this.ligas = data,
      error: () => this.ligas = []
    });
  }

  cargarClubs() {
    this.partidosService.obtenerClubs().subscribe({
      next: (data) => this.clubs = data,
      error: () => this.clubs = []
    });
  }

  cargarArbitros() {
    this.partidosService.obtenerArbitros().subscribe({
      next: (data) => this.arbitros = data,
      error: () => this.arbitros = []
    });
  }

  actualizarPartido(partido: any) {
    const id = Number(partido?.id);
    if (!id || !this.ediciones[id]) {
      return;
    }

    const payload = {
      fecha: this.ediciones[id].fecha,
      arbitro: this.ediciones[id].arbitro || null,
      ubicacion: this.ediciones[id].ubicacion || null,
      resultado: this.ediciones[id].resultado || null,
    };

    this.partidosService.actualizarPartido(String(id), payload).subscribe({
      next: () => {
        alert('Partido actualizado');
        this.cargarPartidos();
        this.cargarPartidosRevision();
      },
      error: (err: Error) => {
        alert(err.message || 'No se pudo actualizar el partido');
      }
    });
  }

  nombreClub(partido: any, side: 'local' | 'visitante'): string {
    const relation = side === 'local' ? partido?.clubLocal : partido?.clubVisitante;
    if (typeof relation?.nombre === 'string' && relation.nombre.trim() !== '') {
      return relation.nombre;
    }

    const id = Number(side === 'local' ? partido?.club_local_id : partido?.club_visitante_id);
    if (!id) {
      return side === 'local' ? 'Club local' : 'Club visitante';
    }

    const match = this.clubs.find((club) => Number(club?.id) === id);
    return typeof match?.nombre === 'string'
      ? match.nombre
      : (side === 'local' ? 'Club local' : 'Club visitante');
  }

  private sincronizarEdiciones(): void {
    const nextEdiciones: typeof this.ediciones = {};

    for (const partido of this.partidos) {
      const id = Number(partido?.id);
      if (!id) {
        continue;
      }

      nextEdiciones[id] = {
        fecha: typeof partido?.fecha === 'string' ? partido.fecha : '',
        arbitro: typeof partido?.arbitro === 'string' ? partido.arbitro : '',
        ubicacion: typeof partido?.ubicacion === 'string' ? partido.ubicacion : '',
        resultado: typeof partido?.resultado === 'string' ? partido.resultado : '',
      };
    }

    this.ediciones = nextEdiciones;
  }
}