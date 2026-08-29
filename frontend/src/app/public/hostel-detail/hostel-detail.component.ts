import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PublicService } from '../public.service';
import { HostelDetail } from '../public.model';

@Component({
  selector: 'app-hostel-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hostel-detail.component.html',
  styles: [`
    .detail-container {
      max-width: 1040px;
      margin: 2.5rem auto;
      background: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      color: #2d3748;
      border: 1px solid #e2e8f0;
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    .banner {
      width: 100%;
      height: 420px;
      background-size: cover;
      background-position: center top !important;
      background-repeat: no-repeat;
      background-color: #013828;
    }

    .content {
      padding: 2.5rem 3rem;
      color: #2d3748;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .title h1 {
      font-size: 2.25rem;
      margin: 0 0 0.5rem 0;
      color: #013828;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .location-text {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      color: #718096;
      font-size: 0.92rem;
      margin-top: 0.5rem;
    }

    .location-text svg {
      color: #015C3A;
    }

    .badge {
      display: inline-block;
      padding: 0.3rem 0.85rem;
      border-radius: 50px;
      font-size: 0.82rem;
      font-weight: 700;
    }

    .badge.male {
      background: #E0F2FE;
      color: #0369A1;
      border: 1px solid #7DD3FC;
    }

    .badge.female {
      background: #FCE4EC;
      color: #C2185B;
      border: 1px solid #F48FB1;
    }

    /* ── Stats Grid (Total Capacity & Provost Only) ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }

    .stat-card {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.15rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.15rem;
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      border-color: #015C3A;
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.06);
    }

    .stat-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #e8f5ef 0%, #c6f6d5 100%);
      color: #015C3A;
      flex-shrink: 0;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .stat-label {
      font-size: 0.78rem;
      font-weight: 700;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-value {
      font-size: 1.15rem;
      font-weight: 800;
      color: #013828;
    }

    /* ── Section Titles ── */
    .section-title {
      font-size: 1.35rem;
      font-weight: 700;
      color: #013828;
      margin: 2rem 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e8f5ef;
    }

    .description-text {
      font-size: 1rem;
      line-height: 1.7;
      color: #4a5568;
      margin-bottom: 2rem;
    }

    /* ── Amenities Tiles ── */
    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    .amenity-tile {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.85rem 1.15rem;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }

    .amenity-tile:hover {
      border-color: #015C3A;
      background: #f0faf4;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.08);
    }

    .amenity-icon-box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: #e8f5ef;
      color: #015C3A;
      flex-shrink: 0;
    }

    .amenity-label {
      font-size: 0.88rem;
      font-weight: 600;
      color: #2d3748;
    }

    .no-amenities {
      color: #718096;
      font-size: 0.9rem;
      grid-column: 1 / -1;
    }

    /* ── Eligibility ── */
    .eligibility-list {
      padding-left: 1.25rem;
      margin-bottom: 2.5rem;
      color: #4a5568;
      font-size: 0.95rem;
      line-height: 1.7;
    }

    .eligibility-list li {
      margin-bottom: 0.4rem;
    }

    /* ── CTA Box ── */
    .cta-box {
      margin-top: 3rem;
      padding: 2.25rem 2rem;
      background: linear-gradient(135deg, #f0faf4 0%, #e8f5ef 100%);
      border-radius: 14px;
      text-align: center;
      border: 1.5px solid #c6f6d5;
      color: #2d3748;
    }

    .cta-box h3 {
      color: #013828;
      font-weight: 800;
      font-size: 1.3rem;
      margin: 0 0 0.5rem 0;
    }

    .cta-sub {
      margin-bottom: 1.5rem;
      color: #4a5568;
      font-size: 0.92rem;
    }

    .cta-btn {
      display: inline-block;
      padding: 0.85rem 2.5rem;
      font-size: 1rem;
      font-weight: 700;
      border-radius: 10px;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      color: #ffffff;
      border: none;
      box-shadow: 0 4px 12px rgba(1, 92, 58, 0.25);
    }

    .btn-primary:hover {
      background: linear-gradient(135deg, #015C3A 0%, #017A4A 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(1, 92, 58, 0.35);
    }

    .btn-outline {
      border: 2px solid #cbd5e0;
      background: #ffffff;
      color: #4a5568;
    }

    .btn-outline:hover {
      background: #edf2f7;
      color: #1a202c;
    }

    @media (max-width: 768px) {
      .header-row { flex-direction: column; gap: 1rem; }
      .stats-grid { grid-template-columns: 1fr; }
      .content { padding: 1.5rem; }
      .banner { height: 260px; }
      .amenities-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
    }
  `]
})
export class HostelDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private publicService = inject(PublicService);
  private sanitizer = inject(DomSanitizer);
  private cdr = inject(ChangeDetectorRef);

  hostel: HostelDetail | null = null;
  isLoading = true;

  ngOnInit() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.publicService.getHostelById(+id).subscribe({
        next: (data) => {
          this.hostel = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  getProvostName(): string {
    if (!this.hostel) return 'N/A';
    return this.hostel.gender?.toLowerCase() === 'female'
      ? 'Prof. Dr. Farhat Naureen Memon'
      : 'Dr. Punhal Khan Lashari';
  }

  getHostelDescription(): string {
    if (!this.hostel) return '';
    if (this.hostel.description && this.hostel.description.trim() !== '' && this.hostel.description !== 'No description provided.') {
      return this.hostel.description;
    }
    if (this.hostel.gender?.toLowerCase() === 'female') {
      return `${this.hostel.name} offers a safe, comfortable, and supportive residential environment for female students of the University of Sindh, Jamshoro. Equipped with round-the-clock security, clean dining, and serene study areas, it fosters academic excellence and community living.`;
    } else {
      return `${this.hostel.name} provides premier residential accommodation for male students at the University of Sindh, Jamshoro. It features spacious rooms, modern reading halls, high-speed connectivity, and vibrant sports grounds for holistic student development.`;
    }
  }

  getAmenityIcon(amenity: string): SafeHtml {
    const a = amenity.toLowerCase();
    let svg = '';
    if (a.includes('wifi') || a.includes('internet')) {
      svg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`;
    } else if (a.includes('mess') || a.includes('dining') || a.includes('cafeteria') || a.includes('food')) {
      svg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`;
    } else if (a.includes('security') || a.includes('cctv') || a.includes('guarded') || a.includes('gate')) {
      svg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
    } else if (a.includes('study') || a.includes('reading') || a.includes('library')) {
      svg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
    } else if (a.includes('water') || a.includes('plant') || a.includes('filter') || a.includes('ro')) {
      svg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`;
    } else if (a.includes('laundry')) {
      svg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="2" width="18" height="20" rx="2"></rect><circle cx="12" cy="13" r="5"></circle><line x1="8" y1="6" x2="8.01" y2="6"></line><line x1="12" y1="6" x2="12.01" y2="6"></line></svg>`;
    } else if (a.includes('generator') || a.includes('power') || a.includes('backup')) {
      svg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
    } else if (a.includes('bath') || a.includes('bathroom') || a.includes('attached')) {
      svg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"></path><path d="M6 12V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"></path></svg>`;
    } else if (a.includes('sport') || a.includes('game') || a.includes('ground') || a.includes('gym')) {
      svg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>`;
    } else {
      svg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    }
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
