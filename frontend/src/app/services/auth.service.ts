import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/auth';

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, usuario);
  }

  login(usuario: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { usuario, password });
  }

  setUsuario(usuario: any): void {
    try {
      localStorage.setItem('usuario', JSON.stringify(usuario));
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
    } catch (e) {
      // noop
    }
  }
}
