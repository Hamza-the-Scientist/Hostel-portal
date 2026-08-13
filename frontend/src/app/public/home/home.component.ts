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
      background: linear-gradient(135deg, #000E1F 0%, #001832 50%, #002244 100%);
      color: white;
      padding: 6rem 1.5rem;
      text-align: center;
      border-bottom: 1px solid var(--color-border);
    }
    .hero h1 { color: #FFFFFF; font-size: 3rem; margin-bottom: 1rem; font-weight: 800; }
    .hero p { font-size: 1.25rem; max-width: 650px; margin: 0 auto 2.5rem auto; color: #8CA5BD; }
    .hero .btn-group { display: flex; gap: 1.25rem; justify-content: center; }

    /* Light Buttons for Hero */
    .btn-primary-light {
      background: transparent;
      border: 2px solid #00C7B6;
      color: #00C7B6;
      font-weight: 700;
      padding: 0.85rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .btn-primary-light:hover {
      background: #00C7B6;
      color: #001832;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 199, 182, 0.4);
    }

    .btn-outline-light {
      background: transparent;
      border: 2px solid #00C7B6;
      color: #00C7B6;
      font-weight: 600;
      padding: 0.85rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .btn-outline-light:hover {
      background: #00C7B6;
      color: #001832;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 199, 182, 0.4);
    }

    /* Announcements Ticker */
    .ticker-wrap {
      background: #FFFFFF;
      border-bottom: 1px solid #E2E8F0;
      padding: 0.75rem 0;
      overflow: hidden;
      white-space: nowrap;
      box-shadow: 0 2px 5px rgba(0,0,0,0.03);
    }
    .ticker {
      display: inline-block;
      white-space: nowrap;
      animation: ticker 25s linear infinite;
    }
    .ticker-item {
      display: inline-block;
      padding: 0 2rem;
      color: #DC2626;
      font-weight: 700;
    }
    @keyframes ticker {
      0% { transform: translate3d(100%, 0, 0); }
      100% { transform: translate3d(-100%, 0, 0); }
    }

    /* Overview Section */
    .overview {
      padding: 4rem 1.5rem;
      background: #001832;
      text-align: center;
      border-bottom: 1px solid #003366;
    }
    .overview h2 { font-size: 2.2rem; color: #FFFFFF; margin-bottom: 1.5rem; font-weight: 800; }
    .overview p { max-width: 800px; margin: 0 auto; color: #8CA5BD; font-size: 1.1rem; line-height: 1.8; }

    /* Hostel Cards */
    .hostels-section {
      padding: 4rem 1.5rem;
      background: #00142A;
      border-bottom: 1px solid #003366;
    }
    .hostels-section h2 { text-align: center; font-size: 2.2rem; color: #FFFFFF; margin-bottom: 3rem; font-weight: 800; }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .card {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: var(--radius-card);
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.06);
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }
    .card:hover {
      transform: translateY(-4px);
      border-color: #001832;
      box-shadow: 0 8px 24px rgba(0, 24, 50, 0.18);
    }
    .card-img {
      height: 200px;
      background: #F1F5F9;
      background-size: cover;
      background-position: center;
    }
    .card-body {
      padding: 1.5rem;
    }
    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #001832;
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
      color: #475569;
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
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      color: #001832;
      font-weight: 600;
    }

    .btn-dark-details {
      display: inline-block;
      width: 100%;
      text-align: center;
      background: #001832;
      color: #FFFFFF;
      font-weight: 700;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      border: 1.5px solid #001832;
      transition: all 0.2s;
      box-sizing: border-box;
    }
    .btn-dark-details:hover {
      background: #002D56;
      border-color: #002D56;
      color: #FFFFFF;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 24, 50, 0.25);
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
