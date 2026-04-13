import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl + '/register', usuario);
  }

  login(usuario: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + '/login', { usuario, password });
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
