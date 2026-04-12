import { Component, OnInit } from '@angular/core';
import { PartidosService } from '../../services/partidos.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  // Formulario crear partido
  equipoLocal = '';
  equipoVisitante = '';
  deporte = '';
  fecha = '';
  arbitro = '';
  ubicacion = '';

  // Listados
  partidos: any[] = [];
  partidosRevision: any[] = [];

  // Confirmación admin
  resLocal = 0;
  resVisitante = 0;

  constructor(private partidosService: PartidosService) {}

  ngOnInit(): void {
    this.cargarPartidos();
    this.cargarPartidosRevision();
  }

  // ======================
  // CREAR PARTIDO
  // ======================
  crearPartido() {
    if (
      !this.equipoLocal ||
      !this.equipoVisitante ||
      !this.deporte ||
      !this.fecha ||
      !this.arbitro ||
      !this.ubicacion
    ) {
      alert('Completa todos los campos');
      return;
    }

    const partido = {
      equipoLocal: this.equipoLocal,
      equipoVisitante: this.equipoVisitante,
      deporte: this.deporte,
      fecha: this.fecha,
      arbitro: this.arbitro,
      ubicacion: this.ubicacion
    };

    this.partidosService.crearPartido(partido).subscribe(() => {
      alert('Partido creado');
      this.limpiarFormulario();
      this.cargarPartidos();
    });
  }

  limpiarFormulario() {
    this.equipoLocal = '';
    this.equipoVisitante = '';
    this.deporte = '';
    this.fecha = '';
    this.arbitro = '';
    this.ubicacion = '';
  }

  // ======================
  // LISTADOS
  // ======================
  cargarPartidos() {
    this.partidosService.obtenerPartidos().subscribe(data => {
      this.partidos = data;
    });
  }

  cargarPartidosRevision() {
    this.partidosService.obtenerPartidosEnRevision().subscribe(data => {
      this.partidosRevision = data;
    });
  }

  // ======================
  // CONFIRMAR RESULTADO
  // ======================
  confirmar(partido: any) {
    this.partidosService
      .confirmarResultado(partido._id, this.resLocal, this.resVisitante)
      .subscribe(() => {
        alert('Resultado confirmado por administrador');
        this.resLocal = 0;
        this.resVisitante = 0;
        this.cargarPartidos();
        this.cargarPartidosRevision();
      });
  }
}