import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {

  private apiUrl = 'https://liga-deportiva-angular.onrender.com/api/partidos';

  constructor(private http: HttpClient) {}

  // ADMIN — crear partido
  crearPartido(partido: any): Observable<any> {
    return this.http.post(this.apiUrl, partido);
  }

  // ADMIN — listar todos
  obtenerPartidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // ADMIN — partidos en revisión
  obtenerPartidosEnRevision(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/revision`);
  }

  // ADMIN — confirmar resultado
  confirmarResultado(
    id: string,
    resultadoLocal: number,
    resultadoVisitante: number
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/confirmar/${id}`, {
      resultadoLocal,
      resultadoVisitante
    });
  }

  // ÁRBITRO
  obtenerPartidosPorArbitro(arbitro: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/arbitro/${arbitro}`);
  }

  // USUARIO / CAPITÁN
  obtenerPartidosPorEquipo(equipo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/equipo/${equipo}`);
  }

  // CAPITÁN — enviar resultado
  enviarResultado(
    id: string,
    rol: 'capitanLocal' | 'capitanVisitante',
    resultado: string
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/resultado/${id}`, {
      rol,
      resultado
    });
  }
}