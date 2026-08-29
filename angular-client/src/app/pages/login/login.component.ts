import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="glass-card auth-card">
        <div class="auth-header">
          <div class="auth-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.97 5.97 0 00-.942 3.197m0 0A9.093 9.093 0 012.25 18.241a3 3 0 014.682-2.72" />
            </svg>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your Angular 19 Contacts App</p>
        </div>

        @if (authService.authError(); as err) {
          <div class="alert-error">
            <span>⚠️ {{ err }}</span>
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" formControlName="email" placeholder="test@example.com" class="form-control" />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="••••••••" class="form-control" />
          </div>

          <div class="autofill-action">
            <button type="button" (click)="fillDemo()" class="btn-text">Auto-fill Test Credentials</button>
          </div>

          <button type="submit" class="btn-submit" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <div class="auth-footer">
          <span>Don't have an account?</span>
          <a routerLink="/register">Create Account</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      background: #0b0f19;
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 2.25rem;
      border-radius: 1.25rem;
      background: rgba(17, 24, 39, 0.7);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 1.75rem;
      h2 { font-size: 1.5rem; font-weight: 700; color: white; margin: 0.5rem 0 0.25rem 0; }
      p { font-size: 0.75rem; color: #9ca3af; margin: 0; }
    }
    .auth-icon {
      width: 3.5rem; height: 3.5rem; margin: 0 auto; border-radius: 1rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
      display: flex; align-items: center; justify-content: center; color: white;
      svg { width: 2rem; height: 2rem; }
    }
    .alert-error {
      background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5; padding: 0.625rem 0.875rem; border-radius: 0.5rem; font-size: 0.8rem; margin-bottom: 1.25rem;
    }
    .form-group {
      margin-bottom: 1rem;
      label { display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem; }
    }
    .form-control {
      width: 100%; padding: 0.625rem 0.875rem; background: rgba(31, 41, 55, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; color: white; font-size: 0.875rem; box-sizing: border-box;
      &:focus { outline: none; border-color: #6366f1; }
    }
    .autofill-action {
      display: flex; justify-content: flex-end; margin-bottom: 1.25rem;
    }
    .btn-text {
      background: none; border: none; color: #818cf8; font-size: 0.75rem; font-weight: 600; cursor: pointer; text-decoration: underline;
    }
    .btn-submit {
      width: 100%; background: #6366f1; color: white; border: none; padding: 0.75rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.9rem; cursor: pointer;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
      &:hover:not(:disabled) { background: #4f46e5; }
    }
    .auth-footer {
      text-align: center; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.75rem; color: #9ca3af;
      a { color: #818cf8; font-weight: 600; text-decoration: none; margin-left: 0.25rem; &:hover { text-decoration: underline; } }
    }
  `]
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm!: FormGroup;
  isLoading = false;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  fillDemo(): void {
    this.loginForm.setValue({
      email: 'test@example.com',
      password: 'Password456!'
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
