import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="auth-page-wrapper">
      <!-- Blurred Background Image -->
      <div class="auth-bg-image"></div>

      <!-- Top Brand Header Bar -->
      <header class="auth-header">
        <div class="auth-header-content">
          <a routerLink="/" class="brand-link" title="Return to Main Landing Page">
            <div class="logo-circle">SDP</div>
            <span class="brand-title">Sindh Dormitory Portal</span>
          </a>
        </div>
      </header>

      <!-- Auth Page Content -->
      <main class="auth-main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .auth-page-wrapper {
      height: 100vh;
      max-height: 100vh;
      overflow: hidden;
      position: relative;
      background-color: #001832;
      display: flex;
      flex-direction: column;
    }
    .auth-bg-image {
      position: absolute;
      top: -15px;
      left: -15px;
      right: -15px;
      bottom: -15px;
      background: url('https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
      filter: blur(10px);
      transform: scale(1.05);
      z-index: 1;
    }
    .auth-header {
      background: rgba(0, 24, 50, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(0, 199, 182, 0.2);
      padding: 0.85rem 2rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      position: relative;
      z-index: 10;
      flex-shrink: 0;
    }
    .auth-header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
    }
    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      text-decoration: none;
      transition: transform 0.2s ease, opacity 0.2s ease;
      cursor: pointer;
    }
    .brand-link:hover {
      transform: translateY(-1px);
      opacity: 0.95;
    }
    .logo-circle {
      width: 42px;
      height: 42px;
      background: #00C7B6;
      border-radius: 50%;
      color: #001832;
      font-weight: 800;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 14px rgba(0, 199, 182, 0.4);
    }
    .brand-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #00C7B6;
      letter-spacing: 0.02em;
    }
    .auth-main-content {
      position: relative;
      z-index: 10;
      flex: 1;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 1.5rem 1rem 1rem;
      overflow-y: auto;
    }
  `]
})
export class AuthLayoutComponent {}
