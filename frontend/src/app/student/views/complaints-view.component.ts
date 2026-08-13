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
        <button class="btn btn-primary" (click)="submitComplaint()">Submit Complaint 📝</button>
      </div>
    </div>
  `,
  styles: [`
    .view-container { max-width: 800px; margin: 0 auto; }
    .view-header h2 { font-size: 1.5rem; font-weight: 800; color: #FFFFFF; margin-bottom: 0.25rem; }
    .subtitle { color: #CBD5E1; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .complaint-form-card { background: #001C3B; border: 1px solid #002D5A; border-radius: 16px; padding: 1.75rem; box-shadow: 0 4px 16px rgba(0,0,0,0.25); }
    .complaint-form-card h3 { font-size: 1.1rem; font-weight: 700; color: #FFFFFF; margin-top: 0; margin-bottom: 1.25rem; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #CBD5E1; margin-bottom: 0.35rem; }
    .form-control { width: 100%; padding: 0.75rem; background: #00142A; border: 1px solid #002D5A; border-radius: 8px; font-size: 0.9rem; color: #FFFFFF; box-sizing: border-box; outline: none; }
    .form-control option { background: #001832; color: #FFFFFF; }
    .btn-primary { background: transparent; border: 2px solid #00C7B6; color: #00C7B6; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
    .btn-primary:hover { background: #00C7B6; color: #001832; box-shadow: 0 4px 12px rgba(0, 199, 182, 0.35); }
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
