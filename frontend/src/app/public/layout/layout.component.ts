import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styles: [`
    .public-layout { display: flex; flex-direction: column; min-height: 100vh; background-color: #001832; }
    
    .header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #001832;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      border-bottom: 1px solid var(--color-border);
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: #00C7B6;
      text-decoration: none;
    }
    .brand img { height: 40px; }
    
    .nav-links {
      display: flex;
      gap: 1.5rem;
    }
    .nav-links a {
      color: #FFFFFF;
      font-weight: 500;
    }
    .nav-links a:hover, .nav-links a.active {
      color: #00C7B6;
    }
    
    .auth-buttons {
      display: flex;
      gap: 1rem;
    }
    .btn-nav-outline {
      background: transparent;
      border: 2px solid #00C7B6;
      color: #00C7B6;
      font-weight: 600;
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .btn-nav-outline:hover {
      background: #00C7B6;
      color: #001832;
      box-shadow: 0 4px 12px rgba(0, 199, 182, 0.35);
      transform: translateY(-1px);
    }
    
    .main-content {
      flex: 1;
      background-color: #001832;
    }
    
    .footer {
      background: #001020;
      border-top: 1px solid var(--color-border);
      color: #8CA5BD;
      text-align: center;
      padding: 2rem 1.5rem;
      margin-top: 4rem;
    }

    @media (max-width: 768px) {
      .nav-links { display: none; } /* Simplified mobile for now */
      .auth-buttons { flex-direction: column; gap: 0.5rem; }
    }
  `]
})
export class LayoutComponent { }
