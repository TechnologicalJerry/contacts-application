import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Contact, ContactInput, PaginatedContacts } from '../models/contact.model';

export interface ListFilterOptions {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  favorite?: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private http = inject(HttpClient);
  private apiBase = 'http://localhost:5050';

  readonly contacts = signal<Contact[]>([]);
  readonly totalContacts = signal<number>(0);
  readonly currentPage = signal<number>(1);
  readonly totalPages = signal<number>(1);
  readonly isLoading = signal<boolean>(false);
  readonly contactError = signal<string | null>(null);

  fetchContacts(options: ListFilterOptions = {}): Observable<PaginatedContacts> {
    this.isLoading.set(true);
    this.contactError.set(null);

    let params = new HttpParams()
      .set('page', (options.page || 1).toString())
      .set('limit', (options.limit || 12).toString());

    if (options.q && options.q.trim()) {
      params = params.set('q', options.q.trim());
    }
    if (options.category && options.category !== 'All') {
      params = params.set('category', options.category);
    }
    if (options.favorite !== undefined && options.favorite !== null) {
      params = params.set('favorite', options.favorite.toString());
    }

    return this.http.get<PaginatedContacts>(`${this.apiBase}/api/contacts`, { params }).pipe(
      tap((res) => {
        this.contacts.set(res.contacts || []);
        this.totalContacts.set(res.total || 0);
        this.currentPage.set(res.page || 1);
        this.totalPages.set(res.totalPages || 1);
        this.isLoading.set(false);
      }),
      catchError((err) => {
        const errorMsg = err?.error?.error || 'Failed to fetch contacts';
        this.contactError.set(errorMsg);
        this.isLoading.set(false);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  getContactById(contactId: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiBase}/api/contacts/${contactId}`);
  }

  createContact(input: ContactInput): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiBase}/api/contacts`, input).pipe(
      tap(() => this.fetchContacts({ page: 1 }).subscribe())
    );
  }

  updateContact(contactId: string, input: Partial<ContactInput>): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiBase}/api/contacts/${contactId}`, input).pipe(
      tap((updated) => {
        const currentList = this.contacts();
        const idx = currentList.findIndex((c) => c.contactId === contactId);
        if (idx !== -1) {
          const newList = [...currentList];
          newList[idx] = { ...newList[idx], ...updated };
          this.contacts.set(newList);
        }
      })
    );
  }

  toggleFavorite(contact: Contact): Observable<Contact> {
    return this.updateContact(contact.contactId, { favorite: !contact.favorite });
  }

  deleteContact(contactId: string): Observable<any> {
    return this.http.delete(`${this.apiBase}/api/contacts/${contactId}`).pipe(
      tap(() => this.fetchContacts({ page: this.currentPage() }).subscribe())
    );
  }
}
