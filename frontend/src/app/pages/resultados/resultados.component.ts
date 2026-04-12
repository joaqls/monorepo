import { Component } from '@angular/core';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent {

  filtroDeporte: string = 'todos';

  resultados = [
    { deporte: 'futbol', local: 'Fútbol A', resultado: '3 - 1', visitante: 'Fútbol B', fecha: '15/10/2025' },
    { deporte: 'futbol', local: 'Fútbol B', resultado: '2 - 2', visitante: 'Fútbol C', fecha: '22/10/2025' },
    { deporte: 'baloncesto', local: 'Baloncesto A', resultado: '65 - 59', visitante: 'Baloncesto B', fecha: '14/10/2025' },
    { deporte: 'voleibol', local: 'Voleibol A', resultado: '3 - 0', visitante: 'Voleibol B', fecha: '12/10/2025' },
    { deporte: 'tenis', local: 'Tenis A', resultado: '6-3, 6-4', visitante: 'Tenis B', fecha: '10/10/2025' }
  ];

  get resultadosFiltrados() {
    if (this.filtroDeporte === 'todos') {
      return this.resultados;
    }

    return this.resultados.filter(r =>
      r.deporte === this.filtroDeporte
    );
  }
}