import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe enviar POST al registrar usuario y devolver la respuesta', () => {
    const mockUser = { nombre: 'Pepe', email: 'pepe@example.com' };
    const mockResp = { id: 1, usuario: 'Pepe', rol: 'usuario' };

    service.registrarUsuario(mockUser).subscribe(resp => {
      expect(resp).toEqual(mockResp);
    });

    const req = httpMock.expectOne((request) => request.url.endsWith('/auth/register'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);

    req.flush(mockResp);
  });
});
