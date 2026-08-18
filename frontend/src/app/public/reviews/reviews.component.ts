import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublicService } from '../public.service';
import { HostelReview, HostelSummary } from '../public.model';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="reviews-page">
      <!-- Header Banner -->
      <section class="reviews-header">
        <div class="header-container">
          <h1 class="page-title">What Our Residents Say</h1>
          <p class="page-subtitle">
            Authentic, unedited reviews and ratings from current residents across all 17 hostels at the University of Sindh Jamshoro.
          </p>

          <!-- Overall Rating Summary Card -->
          <div class="summary-card" *ngIf="allReviews.length > 0">
            <div class="score-box">
              <span class="big-score">{{ averageRating | number:'1.1-1' }}</span>
              <div class="stars-row">
                <span class="star" *ngFor="let s of [1,2,3,4,5]" [class.filled]="s <= averageRating">★</span>
              </div>
              <span class="total-count">Based on {{ filteredReviews.length }} student reviews</span>
            </div>

            <!-- Breakdown Bars -->
            <div class="breakdown-box">
              <div class="bar-row" *ngFor="let star of [5,4,3,2,1]">
                <span class="bar-label">{{ star }} Stars</span>
                <div class="bar-track">
                  <div class="bar-fill" [style.width.%]="getRatingPercentage(star)"></div>
                </div>
                <span class="bar-count">{{ getRatingCount(star) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content Section -->
      <section class="reviews-body">
        <div class="body-container">

          <!-- Filter Controls Bar -->
          <div class="filter-bar">
            <!-- Search Input -->
            <div class="search-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                placeholder="Search reviews by student name, department, or keywords..."
                class="search-input"
              />
              <button *ngIf="searchQuery" (click)="searchQuery = ''" class="clear-btn">✕</button>
            </div>

            <!-- Hostel Dropdown -->
            <div class="select-wrap">
              <label>Hostel:</label>
              <select [(ngModel)]="selectedHostelId" class="filter-select">
                <option [ngValue]="0">All Hostels</option>
                <option *ngFor="let h of hostels" [ngValue]="h.hostelId">{{ getMinimalHostelName(h.name) }}</option>
              </select>
            </div>

            <!-- Star Rating Dropdown -->
            <div class="select-wrap">
              <label>Rating:</label>
              <select [(ngModel)]="selectedRating" class="filter-select">
                <option [ngValue]="0">All Ratings</option>
                <option [ngValue]="5">★★★★★</option>
                <option [ngValue]="4">★★★★</option>
                <option [ngValue]="3">★★★</option>
                <option [ngValue]="2">★★</option>
                <option [ngValue]="1">★</option>
              </select>
            </div>

            <button *ngIf="isFilterActive" (click)="resetFilters()" class="btn-reset">
              Reset Filters
            </button>
          </div>

          <!-- Reviews Grid -->
          <div class="reviews-grid" *ngIf="filteredReviews.length > 0">
            <div class="review-card" *ngFor="let r of filteredReviews">
              <!-- Card Header -->
              <div class="card-top">
                <div class="student-info">
                  <div class="avatar-circle">
                    {{ getInitials(r.studentName) }}
                  </div>
                  <div>
                    <h3 class="student-name">{{ r.studentName }}</h3>
                    <p class="student-dept">{{ r.studentDept }}</p>
                  </div>
                </div>

                <!-- Star Rating Badge -->
                <div class="rating-pill">
                  <span class="star-icon">★</span>
                  <span>{{ r.rating | number:'1.1-1' }}</span>
                </div>
              </div>

              <!-- Hostel Link Tag -->
              <div class="hostel-tag-row">
                <a [routerLink]="['/hostel', r.hostelId]" class="hostel-badge-link">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                  </svg>
                  <span>{{ r.hostelName }}</span>
                </a>
                <span class="review-date">{{ r.date }}</span>
              </div>

              <!-- Comment Body -->
              <p class="comment-text">"{{ r.comment }}"</p>

              <!-- Card Footer -->
              <div class="card-footer">
                <button (click)="toggleHelpful(r)" class="btn-helpful" [class.voted]="helpfulVoted[r.id]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  <span>Helpful ({{ r.helpfulCount }})</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="filteredReviews.length === 0">
            <div class="empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#015C3A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3>No Reviews Found</h3>
            <p>No student reviews match your current search and filter selections.</p>
            <button (click)="resetFilters()" class="btn-reset-large">Clear All Filters</button>
          </div>

        </div>
      </section>
    </div>
  `,
  styles: [`
    .reviews-page {
      background: var(--color-bg);
      color: var(--color-text-main);
      min-height: 100vh;
    }

    /* Header Banner */
    .reviews-header {
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      padding: 3.5rem 1.5rem 2.5rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-container {
      max-width: 1280px;
      margin: 0 auto;
      text-align: center;
    }

    .sub-badge {
      display: inline-block;
      padding: 0.3rem 0.9rem;
      background: rgba(212, 175, 55, 0.15);
      border: 1px solid rgba(212, 175, 55, 0.4);
      border-radius: 9999px;
      color: var(--color-secondary);
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 0.75rem;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.1rem;
      max-width: 720px;
      margin: 0 auto 2.5rem auto;
      line-height: 1.6;
    }

    /* Summary Card */
    .summary-card {
      background: #FFFFFF;
      border: 1.5px solid var(--color-border);
      border-radius: 16px;
      max-width: 750px;
      margin: 0 auto;
      padding: 2rem;
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 2rem;
      align-items: center;
      box-shadow: var(--shadow-sm);
      color: var(--color-text-main);
    }

    .score-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-right: 1px solid var(--color-border);
      padding-right: 1.5rem;
    }

    .big-score {
      font-size: 3.5rem;
      font-weight: 900;
      color: #F59E0B;
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    .stars-row {
      display: flex;
      gap: 0.3rem;
      font-size: 1.25rem;
      color: #CBD5E1;
      margin-bottom: 0.5rem;
    }

    .star.filled {
      color: #F59E0B;
    }

    .total-count {
      color: var(--color-text-muted);
      font-size: 0.85rem;
    }

    /* Breakdown Box */
    .breakdown-box {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .bar-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.85rem;
    }

    .bar-label {
      width: 55px;
      color: var(--color-text-muted);
      font-weight: 600;
    }

    .bar-track {
      flex: 1;
      height: 8px;
      background: #E2E8F0;
      border-radius: 9999px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: var(--color-primary);
      border-radius: 9999px;
      transition: width 400ms ease;
    }

    .bar-count {
      width: 25px;
      text-align: right;
      color: var(--color-text-muted);
      font-size: 0.8rem;
    }

    /* Main Body Section */
    .reviews-body {
      padding: 3rem 1.5rem 5rem 1.5rem;
    }

    .body-container {
      max-width: 1280px;
      margin: 0 auto;
    }

    /* Filter Bar */
    .filter-bar {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      padding: 1.25rem;
      border-radius: 12px;
      box-shadow: var(--shadow-sm);
    }

    .search-wrap {
      position: relative;
      flex: 1;
      min-width: 260px;
      display: flex;
      align-items: center;
    }

    .search-wrap svg {
      position: absolute;
      left: 1.1rem;
      color: var(--color-primary);
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 2.2rem 0.75rem 2.7rem;
      background: #F7F8FA;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      color: var(--color-text-main);
      font-size: 0.9rem;
      outline: none;
      transition: all 200ms ease;
    }

    .search-input:focus {
      border-color: var(--color-primary);
      background: #FFFFFF;
      box-shadow: 0 0 0 3px rgba(1, 92, 58, 0.12);
    }

    .clear-btn {
      position: absolute;
      right: 0.9rem;
      background: none;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
    }

    .select-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--color-text-muted);
      font-weight: 600;
    }

    .filter-select {
      padding: 0.7rem 1rem;
      background: #F7F8FA;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      color: var(--color-text-main);
      font-size: 0.88rem;
      outline: none;
      cursor: pointer;
    }

    .btn-reset {
      padding: 0.65rem 1.1rem;
      background: transparent;
      border: 1px solid #EF4444;
      border-radius: 8px;
      color: #DC2626;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-reset:hover {
      background: rgba(239, 68, 68, 0.15);
    }

    /* Cards Grid */
    .reviews-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 1.75rem;
    }

    .review-card {
      background: linear-gradient(180deg, #FFFFFF 0%, #F4FBF7 100%);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 250ms ease;
      box-shadow: var(--shadow-sm);
    }

    .review-card:hover {
      transform: translateY(-4px);
      border-color: var(--color-primary);
      box-shadow: var(--shadow-md);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .student-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #D4AF37 0%, #B8962A 100%);
      color: #013828;
      font-weight: 800;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
    }

    .student-name {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--color-primary-deep);
      margin: 0 0 0.2rem 0;
    }

    .student-dept {
      font-size: 0.8rem;
      color: var(--color-text-muted);
      margin: 0;
    }

    .rating-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.35rem 0.7rem;
      background: #FEF3C7;
      border: 1px solid #FCD34D;
      border-radius: 9999px;
      color: #F59E0B;
      font-size: 0.88rem;
      font-weight: 800;
    }

    .hostel-tag-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px dashed var(--color-border);
    }

    .hostel-badge-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.3rem 0.7rem;
      background: #F4FBF7;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      color: var(--color-primary-dark);
      font-size: 0.82rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 200ms ease;
    }

    .hostel-badge-link:hover {
      background: var(--color-primary);
      color: #FFFFFF;
    }

    .review-date {
      font-size: 0.78rem;
      color: var(--color-text-muted);
    }

    .comment-text {
      color: var(--color-text-main);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
      font-style: italic;
    }

    .card-footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 0.75rem;
      border-top: 1px solid var(--color-border);
    }

    .btn-helpful {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0.8rem;
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      color: var(--color-text-muted);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 200ms ease;
    }

    .btn-helpful:hover, .btn-helpful.voted {
      background: rgba(1, 92, 58, 0.1);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 1.5rem;
      background: #FFFFFF;
      border-radius: 12px;
      border: 1px solid var(--color-border);
      max-width: 550px;
      margin: 2rem auto;
    }

    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .empty-state h3 { font-size: 1.4rem; color: var(--color-primary-deep); margin-bottom: 0.5rem; }
    .empty-state p { color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; }

    .btn-reset-large {
      padding: 0.75rem 1.8rem;
      background: var(--color-primary);
      border: none;
      border-radius: 6px;
      color: #FFFFFF;
      font-weight: 800;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .summary-card { grid-template-columns: 1fr; text-align: center; }
      .score-box { border-right: none; border-bottom: 1px solid var(--color-border); padding-right: 0; padding-bottom: 1.5rem; }
      .filter-bar { flex-direction: column; align-items: stretch; }
      .reviews-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ReviewsComponent implements OnInit {
  private publicService = inject(PublicService);
  private route = inject(ActivatedRoute);

  hostels: HostelSummary[] = [];
  allReviews: HostelReview[] = [];
  helpfulVoted: { [id: number]: boolean } = {};

  searchQuery = '';
  selectedHostelId = 0;
  selectedRating = 0;

  ngOnInit() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Fetch Hostels for Dropdown
    this.publicService.getHostels().subscribe({
      next: (data) => this.hostels = data
    });

    // Check queryParams for pre-filtered hostel
    this.route.queryParams.subscribe(params => {
      if (params['hostelId']) {
        this.selectedHostelId = +params['hostelId'];
      }
    });

    // Fetch All Reviews
    this.publicService.getReviews().subscribe({
      next: (data) => this.allReviews = data
    });
  }

  get filteredReviews(): HostelReview[] {
    return this.allReviews.filter(r => {
      // Hostel Filter
      const matchesHostel = this.selectedHostelId === 0 || r.hostelId === this.selectedHostelId;

      // Rating Filter
      const matchesRating = this.selectedRating === 0 || r.rating >= this.selectedRating;

      // Search Query Filter
      const q = this.searchQuery.trim().toLowerCase();
      let matchesSearch = true;
      if (q) {
        matchesSearch =
          r.studentName.toLowerCase().includes(q) ||
          r.studentDept.toLowerCase().includes(q) ||
          r.hostelName.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q);
      }

      return matchesHostel && matchesRating && matchesSearch;
    });
  }

  get averageRating(): number {
    const list = this.filteredReviews;
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / list.length;
  }

  getRatingCount(star: number): number {
    return this.filteredReviews.filter(r => Math.floor(r.rating) === star).length;
  }

  getRatingPercentage(star: number): number {
    const total = this.filteredReviews.length;
    if (total === 0) return 0;
    return (this.getRatingCount(star) / total) * 100;
  }

  getInitials(name: string): string {
    if (!name) return 'S';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  getMinimalHostelName(name: string): string {
    if (!name) return '';
    return name.trim();
  }

  toggleHelpful(r: HostelReview) {
    if (this.helpfulVoted[r.id]) {
      r.helpfulCount--;
      this.helpfulVoted[r.id] = false;
    } else {
      r.helpfulCount++;
      this.helpfulVoted[r.id] = true;
    }
  }

  get isFilterActive(): boolean {
    return this.selectedHostelId !== 0 || this.selectedRating !== 0 || this.searchQuery.trim() !== '';
  }

  resetFilters() {
    this.selectedHostelId = 0;
    this.selectedRating = 0;
    this.searchQuery = '';
  }
}
