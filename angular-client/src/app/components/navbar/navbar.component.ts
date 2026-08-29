import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="glass-header">
      <div class="header-container">
        <!-- Brand Logo -->
        <a routerLink="/dashboard" class="brand-link">
          <div class="brand-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.97 5.97 0 00-.942 3.197m0 0A9.093 9.093 0 012.25 18.241a3 3 0 014.682-2.72" />
            </svg>
          </div>
          <div>
            <span class="brand-title">ContactHub</span>
            <span class="brand-subtitle">Angular 19 Standalone</span>
          </div>
        </a>

        <!-- User Profile & Actions -->
        @if (authService.currentUser(); as user) {
          <div class="user-actions">
            <button class="btn-primary" (click)="openCreateModal.emit()">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Add Contact</span>
            </button>

            <div class="user-profile">
              <div class="user-avatar">
                {{ user.name.substring(0, 2).toUpperCase() }}
              </div>
              <div class="user-info">
                <p class="user-name">{{ user.name }}</p>
                <p class="user-email">{{ user.email }}</p>
              </div>
            </div>

            <button class="btn-icon" (click)="authService.logout()" title="Logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H2.25" />
              </svg>
            </button>
          </div>
        }
      </div>
    </header>
  `,
  styles: [`
    .glass-header {
      position: sticky;
      top: 0;
      z-index: 40;
      background: rgba(17, 24, 39, 0.7);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.85rem 1.5rem;
    }
    .header-container {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }
    .brand-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
      svg { width: 1.5rem; height: 1.5rem; }
    }
    .brand-title {
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(to right, #ffffff, #c7d2fe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: block;
      line-height: 1.2;
    }
    .brand-subtitle {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #818cf8;
      font-weight: 600;
    }
    .user-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: #6366f1;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.625rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      svg { width: 1.25rem; height: 1.25rem; }
      &:hover {
        background: #4f46e5;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
      }
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding-left: 0.75rem;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
    }
    .user-avatar {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 9999px;
      background: #1e1b4b;
      color: #c7d2fe;
      border: 2px solid rgba(99, 102, 241, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.8rem;
    }
    .user-info {
      text-align: left;
      @media (max-width: 640px) { display: none; }
    }
    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #f3f4f6;
      margin: 0;
      line-height: 1;
    }
    .user-email {
      font-size: 0.75rem;
      color: #9ca3af;
      margin: 0;
    }
    .btn-icon {
      background: transparent;
      border: none;
      color: #9ca3af;
      padding: 0.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      svg { width: 1.25rem; height: 1.25rem; }
      &:hover {
        color: #f87171;
        background: rgba(239, 68, 68, 0.1);
      }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  @Output() openCreateModal = new EventEmitter<void>();
}
