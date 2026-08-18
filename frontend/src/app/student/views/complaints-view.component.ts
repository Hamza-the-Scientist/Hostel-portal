// student/views/complaints-view.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-complaints-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="view-container">
      <div class="view-header">
        <h2>Complaints & Maintenance Support</h2>
        <p class="subtitle">Log room maintenance issues, electrical, plumbing or warden support requests.</p>
      </div>

      <div class="complaint-form-card">
        <h3>Submit New Complaint</h3>
        <div class="form-group">
          <label>Category</label>
          <select [(ngModel)]="category" class="form-control">
            <option value="Electrical">Electrical & Lighting</option>
            <option value="Plumbing">Plumbing & Water Supply</option>
            <option value="Furniture">Furniture & Fittings</option>
            <option value="Cleanliness">Cleanliness & Hygiene</option>
            <option value="Security">Security & Safety</option>
          </select>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea [(ngModel)]="description" rows="4" class="form-control" placeholder="Describe the issue in detail..."></textarea>
        </div>
        <button class="btn btn-primary" (click)="submitComplaint()">Submit Complaint</button>
      </div>
    </div>
  `,
  styles: [`
    .view-container { max-width: 800px; margin: 0 auto; }
    .view-header h2 { font-size: 1.5rem; font-weight: 800; color: var(--color-primary-deep); margin-bottom: 0.25rem; }
    .subtitle { color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
    .complaint-form-card { background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-card); padding: 1.75rem; box-shadow: var(--shadow-sm); }
    .complaint-form-card h3 { font-size: 1.1rem; font-weight: 700; color: var(--color-primary-deep); margin-top: 0; margin-bottom: 1.25rem; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: 0.35rem; }
    .form-control { width: 100%; padding: 0.75rem; background: #F7F8FA; border: 1px solid var(--color-border); border-radius: 8px; font-size: 0.9rem; color: var(--color-text-main); box-sizing: border-box; outline: none; }
    .form-control:focus { border-color: var(--color-primary); background: #FFFFFF; }
    .form-control option { background: #FFFFFF; color: var(--color-text-main); }
    .btn-primary { background: var(--color-primary); border: none; color: #FFFFFF; padding: 0.75rem 1.5rem; border-radius: var(--radius-btn); font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
    .btn-primary:hover { background: var(--color-primary-dark); box-shadow: var(--shadow-sm); }
  `]
})
export class ComplaintsViewComponent {
  category = 'Electrical';
  description = '';

  submitComplaint() {
    if (!this.description.trim()) {
      alert('Please enter a description of the issue.');
      return;
    }
    alert('Complaint submitted successfully! Ticket ID: CMP-' + Math.floor(1000 + Math.random() * 9000));
    this.description = '';
  }
}
