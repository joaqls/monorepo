import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {

  private apiUrl = '/partidos';

  constructor(private http: HttpClient) {}

  // ADMIN — crear partido
  crearPartido(partido: any): Observable<any> {
    return this.http.post(this.apiUrl, partido).pipe(
      map((res) => this.normalizePartido(this.validateObjectPayload(res, 'partido'))),
      catchError((error) => this.handleHttpError(error, 'No se pudo crear el partido'))
    );
  }

  // ADMIN — listar todos
  obtenerPartidos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((res) => this.normalizePartidos(this.validateArrayPayload(res, 'partidos'))),
      catchError((error) => this.handleHttpError(error, 'No se pudieron cargar los partidos'))
    );
  }

  obtenerLigas(): Observable<any[]> {
    return this.http.get<any[]>('/ligas').pipe(
      map((res) => this.validateArrayPayload(res, 'ligas')),
      catchError((error) => this.handleHttpError(error, 'No se pudieron cargar las ligas'))
    );
  }

  obtenerClubs(): Observable<any[]> {
    return this.http.get<any[]>('/clubs').pipe(
      map((res) => this.validateArrayPayload(res, 'clubs')),
      catchError((error) => this.handleHttpError(error, 'No se pudieron cargar los clubs'))
    );
  }

  obtenerArbitros(): Observable<any[]> {
    return this.http.get<any[]>('/arbitros').pipe(
      map((res) => this.validateArrayPayload(res, 'arbitros')),
      catchError((error) => this.handleHttpError(error, 'No se pudieron cargar los arbitros'))
    );
  }

  // ADMIN — partidos en revisión
  obtenerPartidosEnRevision(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/revision`).pipe(
      map((res) => this.normalizePartidos(this.validateArrayPayload(res, 'partidos en revisión'))),
      catchError((error) => this.handleHttpError(error, 'No se pudieron cargar los partidos en revisión'))
    );
  }

  // ADMIN — confirmar resultado
  confirmarResultado(
    id: string,
    resultadoLocal: number,
    resultadoVisitante: number
  ): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/confirmar/${id}`, {
        resultadoLocal,
        resultadoVisitante
      })
      .pipe(
        map((res) => this.validateObjectPayload(res, 'confirmación de resultado')),
        catchError((error) => this.handleHttpError(error, 'No se pudo confirmar el resultado'))
      );
  }

  actualizarPartido(id: string, partido: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, partido).pipe(
      map((res) => this.normalizePartido(this.validateObjectPayload(res, 'actualizacion de partido'))),
      catchError((error) => this.handleHttpError(error, 'No se pudo actualizar el partido'))
    );
  }

  // ÁRBITRO
  obtenerPartidosPorArbitro(arbitro: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/arbitro/${arbitro}`).pipe(
      map((res) => this.normalizePartidos(this.validateArrayPayload(res, 'partidos del árbitro'))),
      catchError((error) => this.handleHttpError(error, 'No se pudieron cargar los partidos del árbitro'))
    );
  }

  // USUARIO / CAPITÁN
  obtenerPartidosPorEquipo(equipo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/equipo/${equipo}`).pipe(
      map((res) => this.normalizePartidos(this.validateArrayPayload(res, 'partidos del equipo'))),
      catchError((error) => this.handleHttpError(error, 'No se pudieron cargar los partidos del equipo'))
    );
  }

  // CAPITÁN — enviar resultado
  enviarResultado(
    id: string,
    rol: 'capitanLocal' | 'capitanVisitante',
    resultado: string
  ): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/resultado/${id}`, {
        rol,
        resultado
      })
      .pipe(
        map((res) => this.normalizePartido(this.validateObjectPayload(res, 'envío de resultado'))),
        catchError((error) => this.handleHttpError(error, 'No se pudo enviar el resultado'))
      );
  }

  private normalizePartidos(partidos: any[]): any[] {
    return partidos.map((partido) => this.normalizePartido(partido));
  }

  private normalizePartido(partido: any): any {
    if (!partido || typeof partido !== 'object') {
      return partido;
    }

    const normalized = { ...partido };

    normalized.clubLocal = normalized.clubLocal ?? normalized.club_local ?? null;
    normalized.clubVisitante = normalized.clubVisitante ?? normalized.club_visitante ?? null;

    normalized.club_local_id = normalized.club_local_id ?? normalized.clubLocal?.id ?? normalized.club_local?.id ?? null;
    normalized.club_visitante_id = normalized.club_visitante_id ?? normalized.clubVisitante?.id ?? normalized.club_visitante?.id ?? null;

    return normalized;
  }

  private validateArrayPayload(payload: any, source: string): any[] {
    if (!Array.isArray(payload)) {
      throw new Error(`Formato de respuesta inválido para ${source}`);
    }

    return payload;
  }

  private validateObjectPayload(payload: any, source: string): any {
    if (!payload || typeof payload !== 'object') {
      throw new Error(`Formato de respuesta inválido para ${source}`);
    }

    return payload;
  }

  private handleHttpError(error: unknown, fallbackMessage: string): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      const apiMessage = typeof error.error?.message === 'string' ? error.error.message : '';
      const message = apiMessage || fallbackMessage;
      return throwError(() => new Error(message));
    }

    if (error instanceof Error) {
      return throwError(() => error);
    }

    return throwError(() => new Error(fallbackMessage));
  }
}