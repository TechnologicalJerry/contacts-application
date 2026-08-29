import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Contact, ContactInput } from '../../core/models/contact.model';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    @if (isOpen) {
      <div class="modal-backdrop" (click)="close()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ isEdit ? 'Edit Contact' : 'Add New Contact' }}</h3>
            <button class="btn-close" (click)="close()">✕</button>
          </div>

          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <div class="form-group">
                <label>First Name *</label>
                <input type="text" formControlName="firstName" placeholder="e.g. Jane" class="form-control" />
              </div>
              <div class="form-group">
                <label>Last Name *</label>
                <input type="text" formControlName="lastName" placeholder="e.g. Doe" class="form-control" />
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Email</label>
                <input type="email" formControlName="email" placeholder="jane.doe@example.com" class="form-control" />
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="text" formControlName="phone" placeholder="+1-555-0199" class="form-control" />
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Company</label>
                <input type="text" formControlName="company" placeholder="Acme Corp" class="form-control" />
              </div>
              <div class="form-group">
                <label>Job Title</label>
                <input type="text" formControlName="jobTitle" placeholder="Software Engineer" class="form-control" />
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Category</label>
                <select formControlName="category" class="form-control">
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Family">Family</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label>Avatar URL</label>
                <input type="text" formControlName="avatar" placeholder="https://..." class="form-control" />
              </div>
            </div>

            <div class="form-group">
              <label>Address</label>
              <input type="text" formControlName="address" placeholder="123 Main St, City" class="form-control" />
            </div>

            <div class="form-group">
              <label>Notes</label>
              <textarea formControlName="notes" rows="2" placeholder="Add notes..." class="form-control"></textarea>
            </div>

            <div class="checkbox-group">
              <label>
                <input type="checkbox" formControlName="favorite" />
                <span>Mark as Favorite</span>
              </label>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-secondary" (click)="close()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="contactForm.invalid || isSubmitting">
                {{ isEdit ? 'Save Changes' : 'Create Contact' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 50;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .modal-card {
      background: rgba(17, 24, 39, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 1.25rem;
      width: 100%;
      max-width: 580px;
      padding: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 1rem;
      margin-bottom: 1rem;
      h3 { margin: 0; font-size: 1.125rem; font-weight: 700; color: white; }
    }
    .btn-close {
      background: transparent; border: none; color: #9ca3af; font-size: 1.25rem; cursor: pointer;
      &:hover { color: white; }
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      @media (max-width: 500px) { grid-template-columns: 1fr; }
    }
    .form-group {
      margin-bottom: 0.75rem;
      label { display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.25rem; }
    }
    .form-control {
      width: 100%;
      padding: 0.5rem 0.75rem;
      background: rgba(31, 41, 55, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      color: white;
      font-size: 0.875rem;
      box-sizing: border-box;
      &:focus { outline: none; border-color: #6366f1; }
    }
    .checkbox-group {
      margin: 0.5rem 0 1rem 0;
      label { display: flex; align-items: center; gap: 0.5rem; color: #fbbf24; font-size: 0.85rem; cursor: pointer; }
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    .btn-secondary {
      background: transparent; border: 1px solid rgba(255, 255, 255, 0.15); color: #d1d5db; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer;
      &:hover { background: rgba(255, 255, 255, 0.05); }
    }
    .btn-primary {
      background: #6366f1; border: none; color: white; padding: 0.5rem 1.25rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
      &:hover:not(:disabled) { background: #4f46e5; }
    }
  `]
})
export class ContactModalComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);

  @Input() isOpen = false;
  @Input() contactToEdit: Contact | null = null;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() contactSaved = new EventEmitter<void>();

  contactForm!: FormGroup;
  isSubmitting = false;

  get isEdit(): boolean {
    return !!this.contactToEdit;
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contactToEdit'] && this.contactForm) {
      if (this.contactToEdit) {
        this.contactForm.patchValue(this.contactToEdit);
      } else {
        this.contactForm.reset({ category: 'Personal', favorite: false });
      }
    }
  }

  private initForm(): void {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [''],
      phone: [''],
      company: [''],
      jobTitle: [''],
      address: [''],
      category: ['Personal'],
      avatar: [''],
      notes: [''],
      favorite: [false]
    });
  }

  close(): void {
    this.isOpen = false;
    this.modalClosed.emit();
  }

  onSubmit(): void {
    if (this.contactForm.invalid) return;
    this.isSubmitting = true;

    const val: ContactInput = this.contactForm.value;

    const req$ = this.isEdit && this.contactToEdit
      ? this.contactService.updateContact(this.contactToEdit.contactId, val)
      : this.contactService.createContact(val);

    req$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.contactSaved.emit();
        this.close();
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }
}
