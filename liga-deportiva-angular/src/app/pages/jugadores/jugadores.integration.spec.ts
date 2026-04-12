import { Component, Injectable, OnInit } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs';

interface Jugador {
  nombre: string;
  equipo: string;
  deporte: string;
}

@Injectable()
class JugadoresService {
  constructor(private http: HttpClient) {}

  getJugadores(): Observable<Jugador[]> {
    return this.http.get<Jugador[]>('/api/jugadores');
  }
}

@Component({
  selector: 'test-host',
  template: '{{ jugadores?.length }}'
})
class TestHostComponent implements OnInit {
  jugadores: Jugador[] | undefined;

  constructor(private svc: JugadoresService) {}

  ngOnInit(): void {
    this.svc.getJugadores().subscribe(j => (this.jugadores = j));
  }
}

describe('Integración Jugadores: servicio <-> componente', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TestHostComponent],
      providers: [JugadoresService]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('el componente recibe datos mock desde el servicio (GET)', () => {
    const mock: Jugador[] = [
      { nombre: 'Test Uno', equipo: 'Equipo A', deporte: 'Fútbol' },
      { nombre: 'Test Dos', equipo: 'Equipo B', deporte: 'Tenis' }
    ];

    // Inicializa ciclo de vida -> dispara la petición en ngOnInit
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/jugadores');
    expect(req.request.method).toBe('GET');

    // Responder con datos mock
    req.flush(mock);

    // Refrescar bindings
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    expect(comp.jugadores).toEqual(mock);
  });
});
