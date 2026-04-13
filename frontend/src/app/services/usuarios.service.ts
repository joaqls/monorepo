import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = '/usuarios';

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario).pipe(
      map((res) => this.validateUsuarioPayload(res)),
      catchError((error) => this.handleHttpError(error, 'No se pudo registrar el usuario'))
    );
  }

  private validateUsuarioPayload(payload: any): any {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Formato de respuesta de usuario inválido');
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