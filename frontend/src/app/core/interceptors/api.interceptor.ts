import {
  HttpBackend,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpClient
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { catchError, filter, finalize, retry, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private readonly rawHttp: HttpClient;
  private isRefreshing = false;
  private readonly refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    httpBackend: HttpBackend,
    private authService: AuthService,
    private router: Router
  ) {
    this.rawHttp = new HttpClient(httpBackend);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestUrl = this.resolveRequestUrl(req.url);
    const headers = this.buildHeaders(req.headers, req.body);
    const token = this.authService.getAccessToken() ?? this.getToken();

    const request = req.clone({
      url: requestUrl,
      headers,
      setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
    });

    const request$ = next.handle(request);
    const handledRequest$ = this.isRetryableRequest(request)
      ? request$.pipe(
          retry({
            count: 1,
            delay: (error: unknown) => this.getRetryDelay(error)
          })
        )
      : request$;

    return handledRequest$.pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.canRefresh(request.url)) {
          return this.handleUnauthorized(request, next, error);
        }

        if (error.status === 401 || error.status === 403) {
          this.forceLogout();
        }

        const message = this.getErrorMessage(error);
        console.error(`[HTTP ${error.status}] ${message}`, error);
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorized(
    request: HttpRequest<any>,
    next: HttpHandler,
    originalError: HttpErrorResponse
  ): Observable<HttpEvent<any>> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token): token is string => Boolean(token)),
        take(1),
        switchMap((token) => {
          const retried = request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });

          return next.handle(retried);
        })
      );
    }

    const refreshToken = this.authService.getRefreshToken();
    if (!refreshToken) {
      this.forceLogout();
      return throwError(() => originalError);
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.rawHttp
      .post<{ access_token?: string; token?: string }>(`${environment.apiUrl}/auth/refresh`, {
        refresh_token: refreshToken
      })
      .pipe(
        switchMap((response) => {
          const nextToken = response?.access_token ?? response?.token;

          if (!nextToken) {
            throw originalError;
          }

          this.authService.setAccessToken(nextToken);
          this.refreshTokenSubject.next(nextToken);

          const retried = request.clone({
            setHeaders: { Authorization: `Bearer ${nextToken}` }
          });

          return next.handle(retried);
        }),
        catchError(() => {
          this.forceLogout();
          return throwError(() => originalError);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
  }

  private canRefresh(url: string): boolean {
    return !url.includes('/auth/login') && !url.includes('/auth/refresh');
  }

  private isRetryableRequest(request: HttpRequest<any>): boolean {
    return request.method === 'GET' || request.method === 'HEAD';
  }

  private getRetryDelay(error: unknown): Observable<number> {
    if (!(error instanceof HttpErrorResponse)) {
      return throwError(() => error);
    }

    const isNetworkError = error.status === 0;
    const isServerError = error.status >= 500;

    if (!isNetworkError && !isServerError) {
      return throwError(() => error);
    }

    return timer(300);
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

  private forceLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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