import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      const message = this.extractMessage(error, 'Error HTTP inesperado');
      console.error(`[GlobalErrorHandler][HTTP ${error.status}] ${message}`, error);
      return;
    }

    if (error instanceof Error) {
      console.error(`[GlobalErrorHandler] ${error.message}`, error);
      return;
    }

    console.error('[GlobalErrorHandler] Error no tipado', error);
  }

  private extractMessage(error: HttpErrorResponse, fallback: string): string {
    const payloadMessage =
      typeof error.error?.message === 'string' && error.error.message.trim().length > 0
        ? error.error.message
        : null;

    return payloadMessage ?? error.message ?? fallback;
  }
}
