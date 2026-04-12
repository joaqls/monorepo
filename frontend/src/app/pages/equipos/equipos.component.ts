import { Component } from '@angular/core';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.css']
})
export class EquiposComponent {

  filtroDeporte: string = 'todos';

  equipos = [
    { deporte: 'futbol', nombre: 'Fútbol A', descripcion: 'Equipo masculino de fútbol', imagen: 'assets/img/futbol.jpg.avif' },
    { deporte: 'futbol', nombre: 'Fútbol B', descripcion: 'Equipo femenino de fútbol', imagen: 'assets/img/futbol.jpg.avif' },

    { deporte: 'baloncesto', nombre: 'Baloncesto A', descripcion: 'Equipo mixto', imagen: 'assets/img/baloncesto.jpeg' },
    { deporte: 'baloncesto', nombre: 'Baloncesto B', descripcion: 'Equipo masculino', imagen: 'assets/img/baloncesto.jpeg' },

    { deporte: 'voleibol', nombre: 'Voleibol A', descripcion: 'Equipo mixto', imagen: 'assets/img/voleibol.jpg.avif' },
    { deporte: 'voleibol', nombre: 'Voleibol B', descripcion: 'Equipo femenino', imagen: 'assets/img/voleibol.jpg.avif' },

    { deporte: 'tenis', nombre: 'Tenis A', descripcion: 'Modalidad individual', imagen: 'assets/img/tenis.jpg.avif' },
    { deporte: 'tenis', nombre: 'Tenis B', descripcion: 'Modalidad parejas', imagen: 'assets/img/tenis.jpg.avif' }
  ];

  get equiposFiltrados() {
    if (this.filtroDeporte === 'todos') {
      return this.equipos;
    }

    return this.equipos.filter(e => e.deporte === this.filtroDeporte);
  }
}