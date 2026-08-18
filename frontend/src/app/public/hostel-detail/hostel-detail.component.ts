import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PublicService } from '../public.service';
import { HostelDetail, HostelReview } from '../public.model';

@Component({
  selector: 'app-hostel-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hostel-detail.component.html',
  styles: [`
    .detail-container {
      max-width: 1000px;
      margin: 2rem auto;
      background: #FFFFFF;
      border-radius: var(--radius-card);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      color: var(--color-text-main);
      border: 1px solid var(--color-border);
    }
    .banner {
      width: 100%;
      height: 400px;
      background-size: cover;
      background-position: center;
      background-color: #eee;
    }
    .content {
      padding: 3rem;
      color: var(--color-text-main);
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
    .title h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: var(--color-primary-deep);
      font-weight: 800;
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .badge.male { background: rgba(1, 92, 58, 0.1); color: var(--color-primary); border: 1px solid rgba(1, 92, 58, 0.25); }
    .badge.female { background: #FCE4EC; color: #C2185B; border: 1px solid #F48FB1; }

    .rating-reviews-link {
      display: inline-block;
      text-align: right;
      text-decoration: none;
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      transition: background 200ms ease;
    }

    .rating-reviews-link:hover {
      background: rgba(1, 92, 58, 0.08);
    }

    .rating-star {
      font-size: 1.5rem;
      color: #F2C94C;
      font-weight: 800;
    }

    .reviews-count-text {
      font-size: 0.85rem;
      color: var(--color-primary);
      font-weight: 700;
    }

    .stats {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--color-border);
    }
    .stat-item {
      display: flex;
      flex-direction: column;
    }
    .stat-label { font-size: 0.85rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .stat-value { font-size: 1.25rem; font-weight: 800; color: var(--color-primary-deep); }
    
    .section-title { font-size: 1.5rem; margin-bottom: 1rem; margin-top: 2rem; color: var(--color-primary-deep); font-weight: 800; }
    
    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    .amenity-item {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      background: #F4FBF7;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 1px solid var(--color-border);
      font-weight: 600;
      color: var(--color-text-main);
    }
    .amenity-icon {
      display: flex;
      align-items: center;
      color: var(--color-primary);
    }

    /* Reviews Section in Detail Page */
    .reviews-section-wrap {
      margin-top: 2.5rem;
      padding-top: 2rem;
      border-top: 1px solid var(--color-border);
    }

    .section-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .view-all-reviews-link {
      color: var(--color-primary);
      font-weight: 700;
      font-size: 0.9rem;
      text-decoration: none;
    }

    .view-all-reviews-link:hover {
      text-decoration: underline;
    }

    .detail-reviews-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .detail-review-card {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: 10px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .rev-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.85rem;
    }

    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #D4AF37 0%, #B8962A 100%);
      color: #013828;
      font-weight: 800;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .rev-user h4 { font-size: 0.95rem; font-weight: 700; margin: 0 0 0.15rem 0; color: var(--color-primary-deep); }
    .rev-user p { font-size: 0.78rem; color: var(--color-text-muted); margin: 0; }

    .rev-star {
      margin-left: auto;
      color: #F2C94C;
      font-weight: 800;
      font-size: 0.9rem;
      background: rgba(242, 201, 76, 0.15);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
    }

    .rev-body {
      font-size: 0.88rem;
      color: var(--color-text-main);
      line-height: 1.5;
      font-style: italic;
      margin-bottom: 0.85rem;
    }

    .rev-date {
      font-size: 0.78rem;
      color: var(--color-text-muted);
    }

    .cta-box {
      margin-top: 3rem;
      padding: 2rem;
      background: #F4FBF7;
      border-radius: 8px;
      text-align: center;
      border: 1px solid var(--color-border);
      color: var(--color-text-main);
    }
    .cta-box h3 {
      color: var(--color-primary-deep);
      font-weight: 700;
    }
    
    @media (max-width: 768px) {
      .header-row { flex-direction: column; gap: 1rem; }
      .stats { flex-wrap: wrap; }
      .content { padding: 1.5rem; }
      .banner { height: 250px; }
      .detail-reviews-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class HostelDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private publicService = inject(PublicService);
  private sanitizer = inject(DomSanitizer);

  hostel: HostelDetail | null = null;
  hostelReviews: HostelReview[] = [];
  isLoading = true;

  ngOnInit() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.publicService.getHostelById(+id).subscribe({
        next: (data) => {
          this.hostel = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });

      this.publicService.getReviews(+id).subscribe({
        next: (reviews) => this.hostelReviews = reviews
      });
    }
  }

  getInitials(name: string): string {
    if (!name) return 'S';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  getAmenityIcon(amenity: string): SafeHtml {
    const a = amenity.toLowerCase();
    let svg = '';
    if (a.includes('wifi') || a.includes('internet')) {
      svg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`;
    } else if (a.includes('mess') || a.includes('dining') || a.includes('cafeteria') || a.includes('food')) {
      svg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`;
    } else if (a.includes('security') || a.includes('cctv') || a.includes('guarded') || a.includes('gate')) {
      svg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
    } else if (a.includes('study') || a.includes('reading') || a.includes('library')) {
      svg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
    } else if (a.includes('water') || a.includes('plant') || a.includes('filter') || a.includes('ro')) {
      svg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`;
    } else if (a.includes('laundry')) {
      svg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="2" width="18" height="20" rx="2"></rect><circle cx="12" cy="13" r="5"></circle><line x1="8" y1="6" x2="8.01" y2="6"></line><line x1="12" y1="6" x2="12.01" y2="6"></line></svg>`;
    } else if (a.includes('generator') || a.includes('power') || a.includes('backup')) {
      svg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
    } else if (a.includes('bath') || a.includes('bathroom') || a.includes('attached')) {
      svg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"></path><path d="M6 12V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"></path></svg>`;
    } else if (a.includes('sport') || a.includes('game') || a.includes('ground') || a.includes('gym')) {
      svg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>`;
    } else {
      svg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    }
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}

