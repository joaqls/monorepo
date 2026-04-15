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
  resultado = '';

  // Listados
  ligas: any[] = [];
  clubs: any[] = [];
  partidos: any[] = [];
  partidosRevision: any[] = [];

  constructor(private partidosService: PartidosService) {}

  ngOnInit(): void {
    this.cargarLigas();
    this.cargarClubs();
    this.cargarPartidos();
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
      resultado: this.resultado || null,
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
    this.resultado = '';
  }

  // ======================
  // LISTADOS
  // ======================
  cargarPartidos() {
    this.partidosService.obtenerPartidos().subscribe({
      next: (data) => {
        this.partidos = data;
        this.partidosRevision = data.filter((p: any) => p?.estado === 'en_revision');
      },
      error: () => {
        this.partidos = [];
        this.partidosRevision = [];
      }
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
}