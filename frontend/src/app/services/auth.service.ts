import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  private getUsuariosRegistrados(): any[] {
    try {
      const raw = localStorage.getItem('usuarios');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  private setUsuariosRegistrados(usuarios: any[]): void {
    try {
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    } catch (e) {
      // noop
    }
  }

  private getUsuariosConDefault(): any[] {
    const usuarios = this.getUsuariosRegistrados();
    // Fallback mínimo para no bloquear el acceso inicial
    if (!usuarios.some(u => u.usuario === 'admin')) {
      usuarios.push({ usuario: 'admin', password: 'admin', rol: 'admin' });
      this.setUsuariosRegistrados(usuarios);
    }
    return usuarios;
  }

  registrarUsuario(usuario: any): Observable<any> {
    const usuarios = this.getUsuariosConDefault();
    const existe = usuarios.some(u => u.usuario === usuario.usuario);

    if (existe) {
      return throwError(() => new Error('Usuario ya existe'));
    }

    usuarios.push(usuario);
    this.setUsuariosRegistrados(usuarios);
    return of({ ok: true });
  }

  login(usuario: string, password: string): Observable<any> {
    const usuarios = this.getUsuariosConDefault();
    const encontrado = usuarios.find(
      u => u.usuario === usuario && u.password === password
    );

    if (!encontrado) {
      return throwError(() => new Error('Credenciales inválidas'));
    }

    return of(encontrado);
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