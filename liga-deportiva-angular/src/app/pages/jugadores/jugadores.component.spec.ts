import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { JugadoresComponent } from './jugadores.component';

describe('JugadoresComponent', () => {
  let component: JugadoresComponent;
  let fixture: ComponentFixture<JugadoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [JugadoresComponent]
    });
    fixture = TestBed.createComponent(JugadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('debe devolver todos los jugadores cuando filtro esté vacío', () => {
    component.filtro = '';
    const resultado = component.jugadoresFiltrados;
    expect(resultado.length).toBe(component.jugadores.length);
  });

  it('debe filtrar jugadores por nombre', () => {
    component.filtro = 'Ana';
    const resultado = component.jugadoresFiltrados;
    expect(resultado).toEqual([
      { nombre: 'Ana López', equipo: 'Baloncesto A', deporte: 'Baloncesto' }
    ]);
  });

  it('debe filtrar jugadores por equipo', () => {
    component.filtro = 'Fútbol B';
    const resultado = component.jugadoresFiltrados;
    expect(resultado).toEqual([
      { nombre: 'Luis Gómez', equipo: 'Fútbol B', deporte: 'Fútbol' }
    ]);
  });

  it('debe filtrar jugadores por deporte', () => {
    component.filtro = 'Voleibol';
    const resultado = component.jugadoresFiltrados;
    expect(resultado).toEqual([
      { nombre: 'Carlos Ruiz', equipo: 'Voleibol A', deporte: 'Voleibol' }
    ]);
  });

  it('debe ser insensible a mayúsculas y recortar espacios', () => {
    component.filtro = '  juan pÉRez  ';
    const resultado = component.jugadoresFiltrados;
    expect(resultado).toEqual([
      { nombre: 'Juan Pérez', equipo: 'Fútbol A', deporte: 'Fútbol' }
    ]);
  });

  it('debe devolver un array vacío cuando no hay coincidencias', () => {
    component.filtro = 'no existe';
    const resultado = component.jugadoresFiltrados;
    expect(resultado.length).toBe(0);
  });
});
