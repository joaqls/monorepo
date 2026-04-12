import { Component } from '@angular/core';

@Component({
  selector: 'app-clasificaciones',
  templateUrl: './clasificaciones.component.html',
  styleUrls: ['./clasificaciones.component.css']
})
export class ClasificacionesComponent {

  filtroDeporte: string = 'todos';

  clasificaciones = [
    { deporte: 'futbol', equipo: 'Fútbol A', pj: 3, g: 2, e: 1, p: 0, pts: 7 },
    { deporte: 'futbol', equipo: 'Fútbol B', pj: 3, g: 0, e: 2, p: 1, pts: 2 },
    { deporte: 'futbol', equipo: 'Fútbol C', pj: 2, g: 0, e: 1, p: 1, pts: 1 },

    { deporte: 'baloncesto', equipo: 'Baloncesto A', pj: 2, g: 1, e: 0, p: 1, pts: 2 },
    { deporte: 'baloncesto', equipo: 'Baloncesto B', pj: 2, g: 1, e: 0, p: 1, pts: 2 },
    { deporte: 'baloncesto', equipo: 'Baloncesto C', pj: 2, g: 1, e: 0, p: 1, pts: 2 },

    { deporte: 'voleibol', equipo: 'Voleibol A', pj: 2, g: 2, e: 0, p: 0, pts: 4 },
    { deporte: 'voleibol', equipo: 'Voleibol B', pj: 2, g: 0, e: 0, p: 2, pts: 0 },
    { deporte: 'voleibol', equipo: 'Voleibol C', pj: 2, g: 0, e: 0, p: 2, pts: 0 },

    { deporte: 'tenis', equipo: 'Tenis A', pj: 2, g: 2, e: 0, p: 0, pts: 4 },
    { deporte: 'tenis', equipo: 'Tenis B', pj: 2, g: 0, e: 0, p: 2, pts: 0 },
    { deporte: 'tenis', equipo: 'Tenis C', pj: 2, g: 0, e: 0, p: 2, pts: 0 }
  ];

  get clasificacionesFiltradas() {
    if (this.filtroDeporte === 'todos') {
      return this.clasificaciones;
    }

    return this.clasificaciones.filter(c => c.deporte === this.filtroDeporte);
  }
}