import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;
  private readonly rawHttp: HttpClient;

  constructor(
    private http: HttpClient,
    httpBackend: HttpBackend
  ) {
    this.rawHttp = new HttpClient(httpBackend);
  }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, usuario).pipe(
      map((res) => this.validateAuthPayload(res)),
      catchError((error) => this.handleHttpError(error, 'No se pudo registrar el usuario'))
    );
  }

  login(usuario: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { usuario, password }).pipe(
      map((res) => this.validateAuthPayload(res)),
      catchError((error) => this.handleHttpError(error, 'No se pudo iniciar sesión'))
    );
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No hay refresh token disponible'));
    }

    return this.rawHttp
      .post<{ access_token?: string; token?: string }>(`${this.apiUrl}/refresh`, {
        refresh_token: refreshToken
      })
      .pipe(
        map((res) => {
          const token = res?.access_token ?? res?.token;

          if (!token || typeof token !== 'string') {
            throw new Error('Respuesta de refresh inválida');
          }

          this.setAccessToken(token);
          return token;
        }),
        catchError((error) => this.handleHttpError(error, 'No se pudo renovar la sesión'))
      );
  }

  setUsuario(usuario: any): void {
    try {
      localStorage.setItem('usuario', JSON.stringify(usuario));

      const token = usuario?.access_token ?? usuario?.token ?? null;
      if (typeof token === 'string' && token.length > 0) {
        localStorage.setItem('token', token);
      }

      const refreshToken = usuario?.refresh_token ?? null;
      if (typeof refreshToken === 'string' && refreshToken.length > 0) {
        localStorage.setItem('refresh_token', refreshToken);
      }
    } catch (e) {
      // noop
    }
  }

  getUsuario(): any {
    try {
      const s = localStorage.getItem('usuario');
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  }

  logout(): void {
    try {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    } catch (e) {
      // noop
    }
  }

  getAccessToken(): string | null {
    try {
      return localStorage.getItem('token');
    } catch (e) {
      return null;
    }
  }

  setAccessToken(token: string): void {
    try {
      localStorage.setItem('token', token);
    } catch (e) {
      // noop
    }
  }

  getRefreshToken(): string | null {
    try {
      return localStorage.getItem('refresh_token');
    } catch (e) {
      return null;
    }
  }

  private validateAuthPayload(payload: any): any {
    console.log('[AUTH_SERVICE] validateAuthPayload - payload:', payload);
    
    const isValid =
      payload &&
      typeof payload === 'object' &&
      typeof payload.id !== 'undefined' &&
      typeof payload.usuario === 'string' &&
      typeof payload.rol === 'string';

    if (!isValid) {
      console.error('[AUTH_SERVICE] Validación falló - payload inválido:', {
        hasPayload: !!payload,
        isObject: typeof payload === 'object',
        hasId: typeof payload?.id !== 'undefined',
        usuarioType: typeof payload?.usuario,
        rolType: typeof payload?.rol,
        contents: payload
      });
      throw new Error('Formato de respuesta de autenticación inválido');
    }

    return payload;
  }

  private handleHttpError(error: unknown, fallbackMessage: string): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      return throwError(() => error);
    }

    if (error instanceof Error) {
      return throwError(() => error);
    }

    return throwError(() => new Error(fallbackMessage));
  }
}
