import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="glass-card auth-card">
        <div class="auth-header">
          <div class="auth-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <h2>Create Account</h2>
          <p>Get started with your Angular 19 Contacts Dashboard</p>
        </div>

        @if (authService.authError() || localError; as err) {
          <div class="alert-error">
            <span>⚠️ {{ localError || err }}</span>
          </div>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" formControlName="name" placeholder="Jane Doe" class="form-control" />
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input type="email" formControlName="email" placeholder="jane.doe@example.com" class="form-control" />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="Minimum 6 characters" class="form-control" />
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" formControlName="passwordConfirmation" placeholder="Repeat password" class="form-control" />
          </div>

          <button type="submit" class="btn-submit" [disabled]="registerForm.invalid || isLoading">
            {{ isLoading ? 'Creating Account...' : 'Register & Continue' }}
          </button>
        </form>

        <div class="auth-footer">
          <span>Already have an account?</span>
          <a routerLink="/login">Sign In</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; background: #0b0f19;
    }
    .auth-card {
      width: 100%; max-width: 440px; padding: 2.25rem; border-radius: 1.25rem;
      background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    }
    .auth-header {
      text-align: center; margin-bottom: 1.75rem;
      h2 { font-size: 1.5rem; font-weight: 700; color: white; margin: 0.5rem 0 0.25rem 0; }
      p { font-size: 0.75rem; color: #9ca3af; margin: 0; }
    }
    .auth-icon {
      width: 3.5rem; height: 3.5rem; margin: 0 auto; border-radius: 1rem;
      background: linear-gradient(135deg, #8b5cf6, #6366f1, #06b6d4);
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
      &:focus { outline: none; border-color: #8b5cf6; }
    }
    .btn-submit {
      width: 100%; background: #8b5cf6; color: white; border: none; padding: 0.75rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.9rem; cursor: pointer; margin-top: 0.5rem;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
      &:hover:not(:disabled) { background: #7c3aed; }
    }
    .auth-footer {
      text-align: center; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.75rem; color: #9ca3af;
      a { color: #a78bfa; font-weight: 600; text-decoration: none; margin-left: 0.25rem; &:hover { text-decoration: underline; } }
    }
  `]
})
export class RegisterComponent implements OnInit {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);

  registerForm!: FormGroup;
  localError: string | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.localError = null;
    if (this.registerForm.invalid) return;

    const val = this.registerForm.value;
    if (val.password !== val.passwordConfirmation) {
      this.localError = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.authService.register(val).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
