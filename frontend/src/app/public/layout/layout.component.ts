import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styles: [`
    .public-layout { display: flex; flex-direction: column; min-height: 100vh; background-color: var(--color-bg); }
    
    .header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      box-shadow: var(--shadow-md);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
      font-weight: 800;
      color: var(--color-secondary);
      text-decoration: none;
    }
    .brand img { height: 40px; }
    
    .nav-links {
      display: flex;
      gap: 0.6rem;
      align-items: center;
    }
    .nav-links a {
      color: rgba(255, 255, 255, 0.85);
      font-weight: 600;
      font-size: 0.95rem;
      padding: 0.45rem 0.95rem;
      border-radius: var(--radius-btn);
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid transparent;
    }
    .nav-links a:hover {
      color: var(--color-secondary);
      background: rgba(212, 175, 55, 0.15);
      transform: translateY(-1px);
    }
    .nav-links a.active {
      color: var(--color-secondary);
      background: rgba(212, 175, 55, 0.25);
      border-color: var(--color-secondary);
      box-shadow: var(--shadow-sm);
    }
    
    .auth-buttons {
      display: flex;
      gap: 1rem;
    }
    .btn-nav-outline {
      background: transparent;
      border: 2px solid var(--color-secondary);
      color: var(--color-secondary);
      font-weight: 700;
      padding: 0.5rem 1.25rem;
      border-radius: var(--radius-btn);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .btn-nav-outline:hover {
      background: var(--color-secondary);
      color: #013828;
      box-shadow: var(--shadow-sm);
      transform: translateY(-1px);
    }
    
    .main-content {
      flex: 1;
      background-color: var(--color-bg);
      position: relative;
    }
    
    .footer {
      background: #013828;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.8);
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
