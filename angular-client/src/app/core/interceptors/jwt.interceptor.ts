import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken;
  const refreshToken = authService.refreshToken;

  let headers = req.headers;

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  if (refreshToken) {
    headers = headers.set('x-refresh', refreshToken);
  }

  const authReq = req.clone({ headers });

  return next(authReq).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const newAccessToken = event.headers.get('x-access-token');
        if (newAccessToken) {
          authService.updateAccessToken(newAccessToken);
        }
      }
    })
  );
};
