import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="about-page">
      <!-- Hero Banner -->
      <section class="about-hero">
        <div class="hero-container">
          <span class="sub-badge">UNIVERSITY OF SINDH JAMSHORO</span>
          <h1 class="page-title">Digital Hostel Allotment &amp; Management System</h1>
          <p class="page-subtitle">
            Providing modern, transparent, and merit-based residential facilities for over 10,000 male and female students across 17 dedicated hostel blocks.
          </p>
        </div>
      </section>

      <!-- Key Pillars -->
      <section class="pillars-section">
        <div class="pillars-container">
          <div class="pillar-card">
            <div class="icon-wrap">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00D4B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="3" x2="12" y2="21"></line>
                <line x1="4" y1="7" x2="20" y2="7"></line>
                <path d="M4 7l4 7a3 3 0 0 0 6 0"></path>
                <path d="M14 7l4 7a3 3 0 0 0 6 0"></path>
              </svg>
            </div>
            <h3>Transparent Merit Allocation</h3>
            <p>Automated allotment criteria based on academic merit, quota reservation, and distance calculation without manual intervention.</p>
          </div>
          <div class="pillar-card">
            <div class="icon-wrap">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00D4B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3>24/7 Security &amp; Care</h3>
            <p>Guarded perimeters, CCTV coverage, resident wardens, and dedicated student support for round-the-clock peace of mind.</p>
          </div>
          <div class="pillar-card">
            <div class="icon-wrap">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00D4B2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <h3>Modern Amenities</h3>
            <p>High-speed Wi-Fi, air-conditioned study halls, clean dining facilities, RO water plants, and sports grounds.</p>
          </div>
        </div>
      </section>

      <!-- Mission Statement -->
      <section class="mission-section">
        <div class="mission-container">
          <h2>Our Mission</h2>
          <p>
            To create a safe, vibrant, and academic-friendly living environment for students pursuing higher education at the University of Sindh. We aim to streamline the hostel allocation process with zero paperwork and instant digital updates.
          </p>
          <div class="stats-row">
            <div class="stat-box">
              <span class="stat-num">17</span>
              <span class="stat-lbl">Hostel Blocks</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">6,500+</span>
              <span class="stat-lbl">Resident Capacity</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">100%</span>
              <span class="stat-lbl">Digital Allotment</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-page {
      background: #00142A;
      color: #FFFFFF;
      min-height: 100vh;
    }
    .about-hero {
      background: linear-gradient(180deg, #031B33 0%, #001832 100%);
      padding: 4rem 1.5rem 3rem 1.5rem;
      border-bottom: 1px solid #003366;
      text-align: center;
    }
    .hero-container {
      max-width: 900px;
      margin: 0 auto;
    }
    .sub-badge {
      display: inline-block;
      padding: 0.35rem 1rem;
      background: rgba(0, 212, 178, 0.12);
      border: 1px solid rgba(0, 212, 178, 0.3);
      border-radius: 9999px;
      color: #00D4B2;
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      margin-bottom: 1.25rem;
    }
    .page-title {
      font-size: 2.75rem;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 1rem;
    }
    .page-subtitle {
      color: #93B5D1;
      font-size: 1.15rem;
      line-height: 1.6;
    }
    .pillars-section {
      padding: 4rem 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .pillars-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    .pillar-card {
      background: #001E3C;
      border: 1px solid #003366;
      border-radius: 14px;
      padding: 2rem;
      transition: all 300ms ease;
    }
    .pillar-card:hover {
      transform: translateY(-4px);
      border-color: #00D4B2;
      box-shadow: 0 10px 25px rgba(0, 212, 178, 0.12);
    }
    .icon-wrap {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    .pillar-card h3 {
      font-size: 1.25rem;
      color: #FFFFFF;
      margin-bottom: 0.75rem;
    }
    .pillar-card p {
      color: #93B5D1;
      font-size: 0.95rem;
      line-height: 1.6;
    }
    .mission-section {
      background: #001A35;
      padding: 4rem 1.5rem;
      border-top: 1px solid #003366;
      text-align: center;
    }
    .mission-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .mission-container h2 {
      font-size: 2rem;
      color: #00D4B2;
      margin-bottom: 1rem;
    }
    .mission-container p {
      color: #CBD5E1;
      font-size: 1.1rem;
      line-height: 1.7;
      margin-bottom: 3rem;
    }
    .stats-row {
      display: flex;
      justify-content: space-around;
      gap: 2rem;
      flex-wrap: wrap;
    }
    .stat-box {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .stat-num {
      font-size: 3rem;
      font-weight: 900;
      color: #00D4B2;
    }
    .stat-lbl {
      color: #93B5D1;
      font-weight: 600;
      font-size: 0.9rem;
    }
  `]
})
export class AboutComponent implements OnInit {
  ngOnInit() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
}
