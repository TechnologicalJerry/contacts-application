import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContactModalComponent } from '../../components/contact-modal/contact-modal.component';
import { ContactService } from '../../core/services/contact.service';
import { Contact } from '../../core/models/contact.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, ContactModalComponent],
  template: `
    <div class="dashboard-wrapper">
      <app-navbar (openCreateModal)="openCreateModal()"></app-navbar>

      <main class="dashboard-content">
        <!-- Stats Cards Overview -->
        <div class="stats-grid">
          <div class="stat-card">
            <div>
              <p class="stat-label">Total Contacts</p>
              <h3 class="stat-value">{{ contactService.totalContacts() }}</h3>
            </div>
            <div class="stat-icon icon-indigo">👥</div>
          </div>
          <div class="stat-card">
            <div>
              <p class="stat-label">Favorites</p>
              <h3 class="stat-value text-amber">{{ favoriteCount }}</h3>
            </div>
            <div class="stat-icon icon-amber">⭐</div>
          </div>
          <div class="stat-card">
            <div>
              <p class="stat-label">Work Contacts</p>
              <h3 class="stat-value text-cyan">{{ workCount }}</h3>
            </div>
            <div class="stat-icon icon-cyan">💼</div>
          </div>
          <div class="stat-card">
            <div>
              <p class="stat-label">Personal</p>
              <h3 class="stat-value text-emerald">{{ personalCount }}</h3>
            </div>
            <div class="stat-icon icon-emerald">🏠</div>
          </div>
        </div>

        <!-- Filters Toolbar -->
        <div class="glass-panel filter-toolbar">
          <div class="search-box">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearchInput()"
              placeholder="Search contacts by name, email, phone..."
              class="search-input"
            />
          </div>

          <div class="category-pills">
            @for (cat of categories; track cat) {
              <button
                class="pill-btn"
                [class.active]="selectedCategory === cat"
                (click)="selectCategory(cat)"
              >
                {{ cat }}
              </button>
            }

            <button
              class="pill-btn pill-amber"
              [class.active]="filterFavorite === true"
              (click)="toggleFavoriteFilter()"
            >
              ⭐ Favorites Only
            </button>
          </div>

          <div class="view-mode-toggle">
            <button class="toggle-btn" [class.active]="viewMode === 'grid'" (click)="viewMode = 'grid'">Grid</button>
            <button class="toggle-btn" [class.active]="viewMode === 'table'" (click)="viewMode = 'table'">Table</button>
          </div>
        </div>

        <!-- Loading Skeleton -->
        @if (contactService.isLoading()) {
          <div class="grid-layout">
            @for (n of [1,2,3,4,5,6]; track n) {
              <div class="glass-card skeleton-card"></div>
            }
          </div>
        }

        <!-- Empty State -->
        @else if (contactService.contacts().length === 0) {
          <div class="glass-panel empty-state">
            <div class="empty-icon">📇</div>
            <h3>No contacts found</h3>
            <p>{{ searchQuery ? 'No contacts matched your search query.' : 'Get started by creating your first contact.' }}</p>
            <button class="btn-primary" (click)="openCreateModal()">Add Contact</button>
          </div>
        }

        <!-- Grid View -->
        @else if (viewMode === 'grid') {
          <div class="grid-layout">
            @for (contact of contactService.contacts(); track contact.contactId) {
              <div class="glass-card contact-card">
                <div class="card-header">
                  <div class="avatar-wrap">
                    <div class="contact-avatar">
                      {{ contact.firstName.substring(0,1) }}{{ contact.lastName.substring(0,1) }}
                    </div>
                    @if (contact.favorite) {
                      <span class="fav-badge">⭐</span>
                    }
                  </div>

                  <button class="btn-fav" (click)="toggleFav(contact)">
                    {{ contact.favorite ? '★' : '☆' }}
                  </button>
                </div>

                <div class="card-body">
                  <h4 class="contact-name" (click)="viewContact(contact)">
                    {{ contact.firstName }} {{ contact.lastName }}
                  </h4>
                  @if (contact.jobTitle || contact.company) {
                    <p class="contact-subtitle">
                      {{ contact.jobTitle }} <span class="text-indigo">{{ contact.company }}</span>
                    </p>
                  }

                  <div class="contact-meta">
                    @if (contact.email) { <p>✉ {{ contact.email }}</p> }
                    @if (contact.phone) { <p>📞 {{ contact.phone }}</p> }
                  </div>
                </div>

                <div class="card-footer">
                  <span class="badge">{{ contact.category || 'Personal' }}</span>
                  <div class="card-actions">
                    <button (click)="viewContact(contact)" title="View">👁</button>
                    <button (click)="editContact(contact)" title="Edit">✏️</button>
                    <button (click)="deleteContact(contact)" title="Delete">🗑️</button>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Table View -->
        @else {
          <div class="glass-panel table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Category</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (contact of contactService.contacts(); track contact.contactId) {
                  <tr>
                    <td class="name-cell" (click)="viewContact(contact)">
                      <strong>{{ contact.firstName }} {{ contact.lastName }}</strong>
                    </td>
                    <td>{{ contact.email || '-' }}</td>
                    <td>{{ contact.phone || '-' }}</td>
                    <td><span class="badge">{{ contact.category || 'Personal' }}</span></td>
                    <td class="text-right actions-cell">
                      <button (click)="viewContact(contact)">👁</button>
                      <button (click)="editContact(contact)">✏️</button>
                      <button (click)="deleteContact(contact)">🗑️</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <!-- Pagination Controls -->
        @if (contactService.totalPages() > 1) {
          <div class="glass-panel pagination-wrap">
            <span>Page <strong>{{ contactService.currentPage() }}</strong> of <strong>{{ contactService.totalPages() }}</strong></span>
            <div class="page-btns">
              <button [disabled]="contactService.currentPage() <= 1" (click)="changePage(contactService.currentPage() - 1)">Previous</button>
              <button [disabled]="contactService.currentPage() >= contactService.totalPages()" (click)="changePage(contactService.currentPage() + 1)">Next</button>
            </div>
          </div>
        }
      </main>

      <!-- Contact Modal -->
      <app-contact-modal
        [isOpen]="isModalOpen"
        [contactToEdit]="selectedContact"
        (modalClosed)="isModalOpen = false"
        (contactSaved)="onContactSaved()"
      ></app-contact-modal>
    </div>
  `,
  styles: [`
    .dashboard-wrapper { min-height: 100vh; background: #0b0f19; color: white; }
    .dashboard-content { max-width: 1280px; margin: 0 auto; padding: 2rem 1.5rem; }
    
    .stats-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;
    }
    .stat-card {
      background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 1rem; padding: 1.25rem; display: flex; align-items: center; justify-content: space-between;
    }
    .stat-label { font-size: 0.7rem; text-transform: uppercase; tracking-wider: true; color: #9ca3af; margin: 0; }
    .stat-value { font-size: 1.5rem; font-weight: 700; margin: 0.25rem 0 0 0; }
    .stat-icon { width: 2.75rem; height: 2.75rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
    .icon-indigo { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
    .icon-amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .icon-cyan { background: rgba(6, 182, 212, 0.15); color: #22d3ee; }
    .icon-emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .text-amber { color: #fbbf24; } .text-cyan { color: #22d3ee; } .text-emerald { color: #34d399; } .text-indigo { color: #818cf8; }

    .filter-toolbar {
      padding: 1rem; margin-bottom: 1.5rem; display: flex; flex-wrap: wrap; items-center: center; justify-content: space-between; gap: 1rem;
      border-radius: 1rem; background: rgba(17, 24, 39, 0.65); border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .search-input {
      width: 280px; padding: 0.5rem 0.85rem; background: rgba(31, 41, 55, 0.7); border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem; color: white; font-size: 0.85rem;
      &:focus { outline: none; border-color: #6366f1; }
    }
    .category-pills { display: flex; gap: 0.4rem; overflow-x: auto; }
    .pill-btn {
      background: transparent; border: 1px solid rgba(255, 255, 255, 0.1); color: #9ca3af; padding: 0.35rem 0.75rem;
      border-radius: 0.5rem; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
      &.active { background: #6366f1; color: white; border-color: #6366f1; }
    }
    .pill-amber.active { background: #f59e0b; border-color: #f59e0b; color: #111827; }
    .view-mode-toggle { display: flex; background: rgba(0, 0, 0, 0.3); padding: 0.2rem; border-radius: 0.5rem; }
    .toggle-btn {
      background: transparent; border: none; color: #9ca3af; padding: 0.25rem 0.6rem; font-size: 0.75rem; border-radius: 0.35rem; cursor: pointer;
      &.active { background: #6366f1; color: white; }
    }

    .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem; }
    .contact-card {
      background: rgba(17, 24, 39, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 1rem; padding: 1.25rem;
      display: flex; flex-direction: column; justify-content: space-between; transition: all 0.2s;
      &:hover { transform: translateY(-2px); border-color: rgba(99, 102, 241, 0.3); box-shadow: 0 12px 24px -10px rgba(99, 102, 241, 0.25); }
    }
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
    .avatar-wrap { position: relative; }
    .contact-avatar {
      width: 2.75rem; height: 2.75rem; border-radius: 9999px; background: linear-gradient(135deg, #1e1b4b, #311b92);
      color: #c7d2fe; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem;
    }
    .fav-badge { position: absolute; top: -4px; right: -4px; font-size: 0.7rem; }
    .btn-fav { background: none; border: none; color: #fbbf24; font-size: 1.25rem; cursor: pointer; }

    .contact-name { font-size: 1rem; font-weight: 700; margin: 0; cursor: pointer; &:hover { color: #818cf8; } }
    .contact-subtitle { font-size: 0.75rem; color: #9ca3af; margin: 0.25rem 0 0.5rem 0; }
    .contact-meta { font-size: 0.75rem; color: #d1d5db; p { margin: 0.2rem 0; } }

    .card-footer {
      display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .badge { font-size: 0.65rem; background: rgba(99, 102, 241, 0.15); color: #818cf8; padding: 0.2rem 0.5rem; border-radius: 0.35rem; font-weight: 600; }
    .card-actions {
      display: flex; gap: 0.4rem; button { background: none; border: none; cursor: pointer; font-size: 0.85rem; opacity: 0.8; &:hover { opacity: 1; } }
    }

    .empty-state { text-align: center; padding: 3rem; margin: 2rem 0; .empty-icon { font-size: 3rem; margin-bottom: 0.5rem; } h3 { margin: 0; } p { color: #9ca3af; font-size: 0.85rem; margin: 0.5rem 0 1.5rem 0; } }
    .table-wrap { overflow-x: auto; margin-bottom: 1.5rem; border-radius: 1rem; background: rgba(17, 24, 39, 0.7); }
    .data-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; th { padding: 0.75rem 1rem; background: rgba(255, 255, 255, 0.03); color: #9ca3af; text-transform: uppercase; font-size: 0.7rem; } td { padding: 0.75rem 1rem; border-top: 1px solid rgba(255, 255, 255, 0.05); } }
    .name-cell { cursor: pointer; &:hover { color: #818cf8; } }
    .actions-cell button { background: none; border: none; cursor: pointer; margin-left: 0.3rem; }
    .pagination-wrap { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1.25rem; font-size: 0.8rem; background: rgba(17, 24, 39, 0.7); border-radius: 0.75rem; }
    .page-btns button { background: rgba(31, 41, 55, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 0.35rem 0.75rem; border-radius: 0.4rem; font-size: 0.75rem; margin-left: 0.4rem; cursor: pointer; &:disabled { opacity: 0.4; cursor: not-allowed; } }
    .skeleton-card { height: 160px; background: rgba(255, 255, 255, 0.03); border-radius: 1rem; }
    .btn-primary { background: #6366f1; color: white; border: none; padding: 0.5rem 1.25rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
  `]
})
export class DashboardComponent implements OnInit {
  contactService = inject(ContactService);
  private router = inject(Router);

  viewMode: 'grid' | 'table' = 'grid';
  searchQuery = '';
  selectedCategory = 'All';
  filterFavorite: boolean | null = null;
  categories = ['All', 'Work', 'Personal', 'Family'];

  isModalOpen = false;
  selectedContact: Contact | null = null;
  private searchTimeout: any;

  get favoriteCount(): number {
    return this.contactService.contacts().filter(c => c.favorite).length;
  }
  get workCount(): number {
    return this.contactService.contacts().filter(c => c.category === 'Work').length;
  }
  get personalCount(): number {
    return this.contactService.contacts().filter(c => c.category === 'Personal').length;
  }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(page = 1): void {
    this.contactService.fetchContacts({
      page,
      q: this.searchQuery,
      category: this.selectedCategory,
      favorite: this.filterFavorite
    }).subscribe();
  }

  onSearchInput(): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadContacts(1), 350);
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.loadContacts(1);
  }

  toggleFavoriteFilter(): void {
    this.filterFavorite = this.filterFavorite === true ? null : true;
    this.loadContacts(1);
  }

  openCreateModal(): void {
    this.selectedContact = null;
    this.isModalOpen = true;
  }

  editContact(contact: Contact): void {
    this.selectedContact = contact;
    this.isModalOpen = true;
  }

  viewContact(contact: Contact): void {
    this.router.navigate(['/contacts', contact.contactId]);
  }

  toggleFav(contact: Contact): void {
    this.contactService.toggleFavorite(contact).subscribe();
  }

  deleteContact(contact: Contact): void {
    if (confirm(`Delete ${contact.firstName} ${contact.lastName}?`)) {
      this.contactService.deleteContact(contact.contactId).subscribe();
    }
  }

  onContactSaved(): void {
    this.loadContacts(this.contactService.currentPage());
  }

  changePage(page: number): void {
    this.loadContacts(page);
  }
}
