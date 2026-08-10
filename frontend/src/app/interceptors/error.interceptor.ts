// ============================================================
// interceptors/error.interceptor.ts — Global HTTP error handler
// ============================================================
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          // Unauthorized — clear token and redirect to login
          localStorage.removeItem('access_token');
          router.navigate(['/auth/student-login']);
          break;
        case 403:
          // Forbidden — redirect to appropriate area
          router.navigate(['/']);
          break;
        case 500:
          console.error('Server error:', error.message);
          break;
      }
      return throwError(() => error);
    })
  );
};
