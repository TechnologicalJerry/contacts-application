import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { User, AuthTokens, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiBase = 'http://localhost:5050';

  // Angular 19 Signals for reactive authentication state
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly authError = signal<string | null>(null);

  private readonly ACCESS_TOKEN_KEY = 'contacts_access_token';
  private readonly REFRESH_TOKEN_KEY = 'contacts_refresh_token';

  constructor() {
    this.restoreSession();
  }

  get accessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  get refreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    this.decodeAndSetUser(accessToken);
  }

  updateAccessToken(accessToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    this.decodeAndSetUser(accessToken);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.currentUser.set(null);
  }

  login(credentials: LoginRequest): Observable<AuthTokens> {
    this.authError.set(null);
    return this.http.post<AuthTokens>(`${this.apiBase}/api/sessions`, credentials).pipe(
      tap((tokens) => {
        this.setTokens(tokens.accessToken, tokens.refreshToken);
      }),
      catchError((err) => {
        const errorMsg = err?.error?.message || err?.error || 'Invalid email or password';
        this.authError.set(errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  register(credentials: RegisterRequest): Observable<User> {
    this.authError.set(null);
    return this.http.post<User>(`${this.apiBase}/api/users`, credentials).pipe(
      tap(() => {
        // Auto login after successful registration
        this.login({ email: credentials.email, password: credentials.password }).subscribe({
          next: () => this.router.navigate(['/dashboard'])
        });
      }),
      catchError((err) => {
        const errorMsg = err?.error?.message || err?.error || 'Registration failed';
        this.authError.set(errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  logout(): void {
    const token = this.accessToken;
    if (token) {
      this.http.delete(`${this.apiBase}/api/sessions`).subscribe({
        error: () => {} // ignore API error during logout
      });
    }
    this.clearTokens();
    this.router.navigate(['/login']);
  }

  private restoreSession(): void {
    const token = this.accessToken;
    if (token) {
      this.decodeAndSetUser(token);
    }
  }

  private decodeAndSetUser(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload && (payload.email || payload.name)) {
        this.currentUser.set({
          _id: payload._id || payload.id,
          email: payload.email,
          name: payload.name || payload.email.split('@')[0],
        });
      }
    } catch {
      this.clearTokens();
    }
  }
}
