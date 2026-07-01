import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from "../../../environments/environment";
import {TokenService} from "../../services/token-service";

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const router = inject(Router);
  const tokenService = inject(TokenService);

  const token = tokenService.getAccessToken();

  const authReq = token ? req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }) : req;

  console.log('interceptor: sending request to', authReq.url, 'token present:', !!token);
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 && error.status !== 403) {
        return throwError(() => error);
      }

      if (isRefreshing) {
        tokenService.clear();
        router.navigate(['/login']);
        return throwError(() => error);
      }

      isRefreshing = true;
      const refreshToken = tokenService.getRefreshToken();

      return http.post<{ accessToken: string }>(
        environment.apiUrl + '/refresh',
        { refreshToken },
        { responseType: 'json' }
      ).pipe(
        switchMap((res) => {
          isRefreshing = false;
          tokenService.setAccessToken(res.accessToken);
          return next(authReq.clone({
            setHeaders: { Authorization: `Bearer ${res.accessToken}` }
          }));
        }),
        catchError(refreshError => {
          isRefreshing = false;
          tokenService.clear();
          router.navigate(['/login']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};
