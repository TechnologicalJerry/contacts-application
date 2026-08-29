import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { ContactService } from '../../core/services/contact.service';
import { Contact } from '../../core/models/contact.model';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, ContactModalComponent],
  template: `
    <div class="detail-wrapper">
      <app-navbar (openCreateModal)="goHome()"></app-navbar>

      <main class="detail-content">
        <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>

        @if (isLoading) {
          <div class="glass-panel skeleton-detail">
            <div class="avatar-skeleton"></div>
            <div class="line-skeleton"></div>
          </div>
        }

        @else if (contact) {
          <div class="glass-panel profile-card">
            <div class="profile-header">
              <div class="avatar-wrap">
                <div class="profile-avatar">
                  {{ contact.firstName.substring(0,1) }}{{ contact.lastName.substring(0,1) }}
                </div>
              </div>

              <div class="profile-title">
                <h2>{{ contact.firstName }} {{ contact.lastName }}</h2>
                <span class="badge">{{ contact.category || 'Personal' }}</span>
                @if (contact.jobTitle || contact.company) {
                  <p>{{ contact.jobTitle }} at <strong>{{ contact.company }}</strong></p>
                }
              </div>

              <div class="profile-actions">
                <button class="btn-fav" (click)="toggleFav()">
                  {{ contact.favorite ? '⭐ Favorited' : '☆ Favorite' }}
                </button>
                <button class="btn-edit" (click)="isModalOpen = true">Edit</button>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-card">
                <span class="info-label">Email Address</span>
                <p>{{ contact.email || 'Not provided' }}</p>
              </div>
              <div class="info-card">
                <span class="info-label">Phone Number</span>
                <p>{{ contact.phone || 'Not provided' }}</p>
              </div>
              <div class="info-card">
                <span class="info-label">Address</span>
                <p>{{ contact.address || 'Not provided' }}</p>
              </div>
              <div class="info-card">
                <span class="info-label">Added Date</span>
                <p>{{ contact.createdAt | date }}</p>
              </div>
            </div>

            @if (contact.notes) {
              <div class="notes-card">
                <span class="info-label">Notes & Comments</span>
                <p>{{ contact.notes }}</p>
              </div>
            }
          </div>
        }
      </main>

      <app-contact-modal
        [isOpen]="isModalOpen"
        [contactToEdit]="contact"
        (modalClosed)="isModalOpen = false"
        (contactSaved)="loadContact()"
      ></app-contact-modal>
    </div>
  `,
  styles: [`
    .detail-wrapper { min-height: 100vh; background: #0b0f19; color: white; }
    .detail-content { max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem; }
    .back-link { display: inline-block; color: #9ca3af; text-decoration: none; font-size: 0.85rem; font-weight: 600; margin-bottom: 1.5rem; &:hover { color: #818cf8; } }
    .profile-card { background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1.25rem; padding: 2rem; }
    .profile-header { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); flex-wrap: wrap; }
    .profile-avatar { width: 4.5rem; height: 4.5rem; border-radius: 9999px; background: linear-gradient(135deg, #1e1b4b, #311b92); color: #c7d2fe; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.5rem; border: 3px solid rgba(99, 102, 241, 0.4); }
    .profile-title { flex: 1; h2 { margin: 0; font-size: 1.5rem; font-weight: 700; } p { color: #9ca3af; margin: 0.25rem 0 0 0; font-size: 0.9rem; } }
    .badge { display: inline-block; background: rgba(99, 102, 241, 0.15); color: #818cf8; padding: 0.2rem 0.6rem; border-radius: 0.35rem; font-size: 0.75rem; font-weight: 600; margin-left: 0.5rem; }
    .profile-actions { display: flex; gap: 0.5rem; }
    .btn-fav { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
    .btn-edit { background: #6366f1; color: white; border: none; padding: 0.5rem 1.25rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; @media (max-width: 600px) { grid-template-columns: 1fr; } }
    .info-card { background: rgba(31, 41, 55, 0.5); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 0.75rem; padding: 1rem; }
    .info-label { font-size: 0.7rem; text-transform: uppercase; tracking-wider: true; color: #9ca3af; display: block; margin-bottom: 0.25rem; font-weight: 600; }
    .info-card p { margin: 0; font-size: 0.9rem; font-weight: 600; }
    .notes-card { background: rgba(31, 41, 55, 0.5); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 0.75rem; padding: 1.25rem; margin-top: 1rem; p { margin: 0.5rem 0 0 0; font-size: 0.9rem; white-space: pre-line; color: #d1d5db; } }
    .skeleton-detail { height: 300px; background: rgba(255, 255, 255, 0.03); }
  `]
})
export class ContactDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contactService = inject(ContactService);

  contact: Contact | null = null;
  isLoading = true;
  isModalOpen = false;

  ngOnInit(): void {
    this.loadContact();
  }

  loadContact(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.contactService.getContactById(id).subscribe({
        next: (c) => {
          this.contact = c;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  toggleFav(): void {
    if (this.contact) {
      this.contactService.toggleFavorite(this.contact).subscribe({
        next: (updated) => this.contact = updated
      });
    }
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
}
