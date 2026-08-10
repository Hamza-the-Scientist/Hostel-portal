import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PublicService } from '../public.service';
import { HostelDetail } from '../public.model';

@Component({
  selector: 'app-hostel-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hostel-detail.component.html',
  styles: [`
    .detail-container {
      max-width: 1000px;
      margin: 2rem auto;
      background: white;
      border-radius: var(--radius-card);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
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
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .badge.male { background: #E3F2FD; color: #1565C0; }
    .badge.female { background: #FCE4EC; color: #C2185B; }

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
    .stat-label { font-size: 0.85rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-size: 1.25rem; font-weight: 600; color: var(--color-primary-dark); }
    
    .section-title { font-size: 1.5rem; margin-bottom: 1rem; margin-top: 2rem; }
    
    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    .amenity-item {
      background: var(--color-bg);
      padding: 0.75rem 1rem;
      border-radius: 6px;
      border: 1px solid var(--color-border);
      font-weight: 500;
    }

    .cta-box {
      margin-top: 3rem;
      padding: 2rem;
      background: #F8F9FA;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #E9ECEF;
    }
    
    @media (max-width: 768px) {
      .header-row { flex-direction: column; gap: 1rem; }
      .stats { flex-wrap: wrap; }
      .content { padding: 1.5rem; }
      .banner { height: 250px; }
    }
  `]
})
export class HostelDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private publicService = inject(PublicService);

  hostel: HostelDetail | null = null;
  isLoading = true;

  ngOnInit() {
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
    }
  }
}
