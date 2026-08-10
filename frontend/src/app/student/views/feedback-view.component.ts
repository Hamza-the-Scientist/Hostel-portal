// student/views/feedback-view.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feedback-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="view-container">
      <div class="view-header">
        <h2>Feedback & Suggestions</h2>
        <p class="subtitle">Share your feedback to help us improve hostel facilities and portal features.</p>
      </div>

      <div class="card">
        <h3>Rate Your Experience</h3>
        <div class="rating-row">
          <span *ngFor="let s of [1,2,3,4,5]" (click)="rating = s" [class.active]="s <= rating" class="star">★</span>
        </div>

        <div class="form-group">
          <label>Comments / Suggestions</label>
          <textarea [(ngModel)]="feedbackText" rows="4" class="form-control" placeholder="Write your thoughts here..."></textarea>
        </div>

        <button class="btn-submit" (click)="submit()">Send Feedback 💬</button>
      </div>
    </div>
  `,
  styles: [`
    .view-container { max-width: 700px; margin: 0 auto; }
    .view-header h2 { font-size: 1.5rem; font-weight: 800; color: #013828; margin-bottom: 0.25rem; }
    .subtitle { color: #6b7280; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1.75rem; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
    .rating-row { font-size: 2rem; color: #d1d5db; cursor: pointer; margin-bottom: 1.25rem; }
    .star.active { color: #f59e0b; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem; }
    .form-control { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box; }
    .btn-submit { background: #015C3A; color: #fff; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
  `]
})
export class FeedbackViewComponent {
  rating = 5;
  feedbackText = '';

  submit() {
    alert('Thank you! Your feedback has been submitted to the hostel administration.');
    this.feedbackText = '';
  }
}
