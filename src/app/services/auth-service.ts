import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import {environment} from "../../environments/environment";
import {TokenService} from "./token-service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  private baseUrl = environment.apiUrl;

  constructor() {}

  login(username: string, password: string) {
    return this.http.post(
      `${this.baseUrl}/login`,
      { username, password },
      { withCredentials: true }
    );
  }

  logout() {
    this.tokenService.clear();
    return this.http.post(`${this.baseUrl}/logout`, {}, { responseType: 'text' });
  }

  isLoggedIn() {
    return this.http.get(
      `${this.baseUrl}/me`,
      { withCredentials: true }
    ).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
