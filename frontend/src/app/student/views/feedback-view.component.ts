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

        <button class="btn-submit" (click)="submit()">Send Feedback</button>
      </div>
    </div>
  `,
  styles: [`
    .view-container { max-width: 700px; margin: 0 auto; }
    .view-header h2 { font-size: 1.5rem; font-weight: 800; color: var(--color-primary-deep); margin-bottom: 0.25rem; }
    .subtitle { color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
    .card { background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-card); padding: 1.75rem; box-shadow: var(--shadow-sm); }
    .card h3 { font-size: 1.1rem; font-weight: 700; color: var(--color-primary-deep); margin-top: 0; margin-bottom: 1.25rem; }
    .rating-row { font-size: 2rem; color: #CBD5E1; cursor: pointer; margin-bottom: 1.25rem; }
    .star.active { color: #f59e0b; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: 0.35rem; }
    .form-control { width: 100%; padding: 0.75rem; background: #F7F8FA; border: 1px solid var(--color-border); border-radius: 8px; font-size: 0.9rem; color: var(--color-text-main); box-sizing: border-box; outline: none; }
    .form-control:focus { border-color: var(--color-primary); background: #FFFFFF; }
    .btn-submit { background: var(--color-primary); border: none; color: #FFFFFF; padding: 0.75rem 1.5rem; border-radius: var(--radius-btn); font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
    .btn-submit:hover { background: var(--color-primary-dark); box-shadow: var(--shadow-sm); }
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
