import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = 'https://monorepo-copy-production-6c9d.up.railway.app/api/usuarios';

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }
}