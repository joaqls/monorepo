import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestUrl = this.resolveRequestUrl(req.url);
    const headers = this.buildHeaders(req.headers, req.body);
    const token = this.getToken();

    const request = req.clone({
      url: requestUrl,
      headers,
      setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
    });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = this.getErrorMessage(error);

        if (error.status === 401) {
          try {
            localStorage.removeItem('usuario');
          } catch (e) {
            // noop
          }
        }

        console.error(`[HTTP ${error.status}] ${message}`, error);
        return throwError(() => error);
      })
    );
  }

  private resolveRequestUrl(url: string): string {
    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    if (url.startsWith('/')) {
      return `${environment.apiUrl}${url}`;
    }

    return `${environment.apiUrl}/${url}`;
  }

  private buildHeaders(headers: HttpHeaders, body: any): HttpHeaders {
    let nextHeaders = headers;

    if (!nextHeaders.has('Accept')) {
      nextHeaders = nextHeaders.set('Accept', 'application/json');
    }

    if (!(body instanceof FormData) && !nextHeaders.has('Content-Type')) {
      nextHeaders = nextHeaders.set('Content-Type', 'application/json');
    }

    return nextHeaders;
  }

  private getToken(): string | null {
    try {
      const rawToken = localStorage.getItem('token');
      if (rawToken) {
        return rawToken;
      }

      const usuario = localStorage.getItem('usuario');
      if (!usuario) {
        return null;
      }

      const parsed = JSON.parse(usuario);
      return parsed?.token ?? parsed?.access_token ?? parsed?.jwt ?? null;
    } catch (e) {
      return null;
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (typeof error.error?.message === 'string' && error.error.message.trim().length > 0) {
      return error.error.message;
    }

    if (error.message) {
      return error.message;
    }

    return 'Error HTTP inesperado';
  }
}