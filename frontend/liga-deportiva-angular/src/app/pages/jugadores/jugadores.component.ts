import { Component } from '@angular/core';

interface Jugador {
  nombre: string;
  equipo: string;
  deporte: string;
}

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrls: ['./jugadores.component.css']
})
export class JugadoresComponent {

  filtro: string = '';
  errorMensaje: string = '';
  nuevoJugador: Jugador = this.crearJugadorVacio();

  jugadores: Jugador[] = [
    { nombre: 'Juan Pérez', equipo: 'Fútbol A', deporte: 'Fútbol' },
    { nombre: 'Luis Gómez', equipo: 'Fútbol B', deporte: 'Fútbol' },
    { nombre: 'Ana López', equipo: 'Baloncesto A', deporte: 'Baloncesto' },
    { nombre: 'Pedro Martínez', equipo: 'Baloncesto B', deporte: 'Baloncesto' },
    { nombre: 'Carlos Ruiz', equipo: 'Voleibol A', deporte: 'Voleibol' },
    { nombre: 'Marta Díaz', equipo: 'Tenis A', deporte: 'Tenis' }
  ];

  guardarJugador(): void {
    const nombre = this.nuevoJugador.nombre.trim();
    const equipo = this.nuevoJugador.equipo.trim();
    const deporte = this.nuevoJugador.deporte.trim();

    if (!nombre || !equipo || !deporte) {
      this.errorMensaje = 'Completa nombre, equipo y deporte.';
      return;
    }

    this.jugadores = [
      ...this.jugadores,
      { nombre, equipo, deporte }
    ];
    this.errorMensaje = '';
    this.nuevoJugador = this.crearJugadorVacio();
  }

  get jugadoresFiltrados() {
    const texto = this.filtro.toLowerCase().trim();

    if (!texto) {
      return this.jugadores;
    }

    return this.jugadores.filter(j =>
      j.nombre.toLowerCase().includes(texto) ||
      j.equipo.toLowerCase().includes(texto) ||
      j.deporte.toLowerCase().includes(texto)
    );
  }

  private crearJugadorVacio(): Jugador {
    return {
      nombre: '',
      equipo: '',
      deporte: ''
    };
  }
}