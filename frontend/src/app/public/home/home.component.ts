import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicService } from '../public.service';
import { HostelSummary, Announcement } from '../public.model';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styles: [`
    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
      color: white;
      padding: 6rem 1.5rem;
      text-align: center;
    }
    .hero h1 { color: white; font-size: 3rem; margin-bottom: 1rem; }
    .hero p { font-size: 1.25rem; max-width: 600px; margin: 0 auto 2rem auto; opacity: 0.9; }
    .hero .btn-group { display: flex; gap: 1rem; justify-content: center; }

    /* Announcements Ticker */
    .ticker-wrap {
      background: #FFF9C4;
      border-bottom: 1px solid #F2C94C;
      padding: 0.75rem 0;
      overflow: hidden;
      white-space: nowrap;
    }
    .ticker {
      display: inline-block;
      white-space: nowrap;
      animation: ticker 25s linear infinite;
    }
    .ticker-item {
      display: inline-block;
      padding: 0 2rem;
      color: var(--color-primary-dark);
      font-weight: 500;
    }
    @keyframes ticker {
      0% { transform: translate3d(100%, 0, 0); }
      100% { transform: translate3d(-100%, 0, 0); }
    }

    /* Overview Section */
    .overview {
      padding: 4rem 1.5rem;
      background: white;
      text-align: center;
    }
    .overview h2 { font-size: 2rem; margin-bottom: 1.5rem; }
    .overview p { max-width: 800px; margin: 0 auto; color: var(--color-text-muted); font-size: 1.1rem; }

    /* Hostel Cards */
    .hostels-section {
      padding: 4rem 1.5rem;
    }
    .hostels-section h2 { text-align: center; font-size: 2rem; margin-bottom: 3rem; }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .card {
      background: white;
      border-radius: var(--radius-card);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }
    .card-img {
      height: 200px;
      background: #eee;
      background-size: cover;
      background-position: center;
    }
    .card-body {
      padding: 1.5rem;
    }
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--color-primary-dark);
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .badge.male { background: #E3F2FD; color: #1565C0; }
    .badge.female { background: #FCE4EC; color: #C2185B; }
    
    .card-info {
      font-size: 0.9rem;
      color: var(--color-text-muted);
      margin-bottom: 1rem;
    }
    .card-info p { margin: 0.25rem 0; }
    
    .amenities {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }
    .amenity-tag {
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      color: var(--color-text-main);
    }
  `]
})
export class HomeComponent implements OnInit {
  private publicService = inject(PublicService);

  hostels: HostelSummary[] = [];
  announcements: Announcement[] = [];

  ngOnInit() {
    this.publicService.getHostels().subscribe({
      next: (data) => this.hostels = data,
      error: (err) => console.error('Failed to load hostels', err)
    });

    this.publicService.getAnnouncements().subscribe({
      next: (data) => this.announcements = data,
      error: (err) => console.error('Failed to load announcements', err)
    });
  }
}
