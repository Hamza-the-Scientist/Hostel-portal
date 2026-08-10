import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styles: [`
    .public-layout { display: flex; flex-direction: column; min-height: 100vh; }
    
    .header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--color-surface);
      box-shadow: var(--shadow-sm);
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
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-primary-dark);
      text-decoration: none;
    }
    .brand img { height: 40px; }
    
    .nav-links {
      display: flex;
      gap: 1.5rem;
    }
    .nav-links a {
      color: var(--color-text-main);
      font-weight: 500;
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--color-primary);
    }
    
    .auth-buttons {
      display: flex;
      gap: 1rem;
    }
    
    .main-content {
      flex: 1;
    }
    
    .footer {
      background: var(--color-primary-dark);
      color: white;
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
export class LayoutComponent {}
