import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PublicService } from '../public.service';
import { HostelSummary } from '../public.model';

@Component({
  selector: 'app-hostels',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="hostels-page">
      <!-- Header Banner -->
      <section class="hostels-header">
        <div class="header-container">
          <h1 class="page-title">University Hostel Directory</h1>
          <p class="page-subtitle">
            Explore residential blocks across the University of Sindh Jamshoro main campus.
            Find complete information on capacity, amenities, and available beds.
          </p>

          <!-- Search & Filter Bar Controls -->
          <div class="controls-bar">
            <!-- Top Search Input & Filter Toggle Row -->
            <div class="search-filter-row">
              <div class="search-box">
                <span class="search-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
                <input 
                  type="text" 
                  [(ngModel)]="draftSearch" 
                  (keyup.enter)="applyFilters()"
                  placeholder="Search hostel by name, location, or warden..."
                  class="search-input"
                />
                <button *ngIf="draftSearch" (click)="draftSearch = ''; applyFilters()" class="clear-input-btn" aria-label="Clear Search">✕</button>
              </div>

              <!-- Filter Toggle Button -->
              <button 
                class="btn-toggle-filter" 
                [class.active]="isFilterPanelOpen || activeFilterCount > 0"
                (click)="isFilterPanelOpen = !isFilterPanelOpen"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                <span>Filters</span>
                <span class="filter-badge" *ngIf="activeFilterCount > 0">{{ activeFilterCount }}</span>
              </button>
            </div>

            <!-- Expandable Advanced Filter Panel -->
            <div class="filter-panel" *ngIf="isFilterPanelOpen">
              <!-- Gender Filter Section -->
              <div class="filter-group">
                <label class="filter-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Gender Category</span>
                </label>
                <div class="gender-options">
                  <button 
                    type="button"
                    class="gender-chip"
                    [class.active]="draftGender === 'All'"
                    (click)="draftGender = 'All'"
                  >
                    All Hostels
                  </button>
                  <button 
                    type="button"
                    class="gender-chip male"
                    [class.active]="draftGender === 'Male'"
                    (click)="draftGender = 'Male'"
                  >
                    Boys Hostels
                  </button>
                  <button 
                    type="button"
                    class="gender-chip female"
                    [class.active]="draftGender === 'Female'"
                    (click)="draftGender = 'Female'"
                  >
                    Girls Hostels
                  </button>
                </div>
              </div>

              <!-- Amenities Filter Section -->
              <div class="filter-group">
                <label class="filter-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  <span>Amenities</span>
                </label>
                <div class="amenities-grid">
                  <button 
                    type="button"
                    *ngFor="let amenity of availableAmenities"
                    class="amenity-chip"
                    [class.selected]="isAmenitySelected(amenity)"
                    (click)="toggleAmenity(amenity)"
                  >
                    <span class="chip-check" *ngIf="isAmenitySelected(amenity)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <span>{{ amenity }}</span>
                  </button>
                </div>
              </div>

              <!-- Filter Action Buttons Row -->
              <div class="filter-actions-row">
                <button type="button" class="btn-clear-all" (click)="clearAllFilters()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  <span>Clear All Filters</span>
                </button>

                <button type="button" class="btn-apply-filters" (click)="applyFilters()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Apply Filters</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Hostels Grid Section -->
      <section class="hostels-list-section">
        <div class="list-container">
          <!-- Results Count & Active Filter Tags -->
          <div class="results-header">
            <div class="results-meta">
              <span>Showing <strong>{{ filteredHostels.length }}</strong> of {{ hostels.length }} hostels</span>
            </div>

            <!-- Active Applied Filters Chips -->
            <div class="active-tags-row" *ngIf="activeFilterCount > 0">
              <span class="active-tag" *ngIf="appliedGender !== 'All'">
                Gender: {{ appliedGender }}
                <button (click)="appliedGender = 'All'; draftGender = 'All'" class="tag-remove" aria-label="Remove Gender Filter">✕</button>
              </span>
              <span class="active-tag" *ngFor="let a of appliedAmenities">
                {{ a }}
                <button (click)="removeAmenity(a)" class="tag-remove" aria-label="Remove Amenity Filter">✕</button>
              </span>
              <span class="active-tag" *ngIf="appliedSearch">
                Search: "{{ appliedSearch }}"
                <button (click)="appliedSearch = ''; draftSearch = ''" class="tag-remove" aria-label="Remove Search Filter">✕</button>
              </span>

              <button (click)="clearAllFilters()" class="clear-tags-btn">Clear All</button>
            </div>
          </div>

          <!-- Cards Grid -->
          <div class="hostels-grid" *ngIf="filteredHostels.length > 0">
            <div class="hostel-card" *ngFor="let hostel of filteredHostels">
              <!-- Image Banner -->
              <div 
                class="card-image" 
                [style.background-image]="'url(' + (hostel.mainImageUrl || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80') + ')'"
              >
                <div class="badge-overlay">
                  <span class="gender-badge" [ngClass]="hostel.gender.toLowerCase()">{{ hostel.gender }}</span>
                  <span class="rating-badge">★ {{ hostel.rating | number:'1.1-1' }}</span>
                </div>
              </div>

              <!-- Card Body -->
              <div class="card-content">
                <h3 class="hostel-name">{{ hostel.name }}</h3>

                <div class="card-details">
                  <p class="detail-row">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#015C3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{{ hostel.location || 'Main Campus, Jamshoro' }}</span>
                  </p>
                  <p class="detail-row">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#015C3A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M2 4v16M2 8h20M2 17h20M22 8v9"></path>
                    </svg>
                    <span>Capacity: <strong>{{ hostel.totalCapacity }}</strong> beds</span>
                  </p>
                  <p class="detail-row vacancy" [class.low-beds]="hostel.availableBeds < 10">
                    <span class="status-dot"></span>
                    <span>Available Beds: <strong>{{ hostel.availableBeds }}</strong></span>
                  </p>
                </div>

                <!-- Key Amenities -->
                <div class="amenities-container">
                  <span class="amenity-pill" *ngFor="let amenity of hostel.keyAmenities.slice(0, 4)">
                    <span class="amenity-icon" [innerHTML]="getAmenityIcon(amenity)"></span>
                    <span>{{ amenity }}</span>
                  </span>
                  <span class="amenity-pill extra" *ngIf="hostel.keyAmenities.length > 4">
                    +{{ hostel.keyAmenities.length - 4 }} more
                  </span>
                </div>

                <!-- View Details Button -->
                <a [routerLink]="['/hostel', hostel.hostelId]" class="btn-view-details">
                  View Details
                </a>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="filteredHostels.length === 0">
            <div class="empty-icon-wrap">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                <line x1="9" y1="6" x2="9.01" y2="6"></line>
                <line x1="15" y1="6" x2="15.01" y2="6"></line>
                <line x1="9" y1="10" x2="9.01" y2="10"></line>
                <line x1="15" y1="10" x2="15.01" y2="10"></line>
                <line x1="9" y1="14" x2="9.01" y2="14"></line>
                <line x1="15" y1="14" x2="15.01" y2="14"></line>
                <line x1="9" y1="18" x2="15" y2="18"></line>
              </svg>
            </div>
            <h3>No Hostels Found</h3>
            <p>No hostels match your selected search criteria and filters.</p>
            <button (click)="clearAllFilters()" class="reset-search-btn">Reset All Filters</button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hostels-page {
      background: var(--color-bg);
      color: var(--color-text-main);
      min-height: 100vh;
    }

    /* Header Banner */
    .hostels-header {
      background: linear-gradient(135deg, #013828 0%, #015C3A 100%);
      padding: 3.5rem 1.5rem 2.5rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-container {
      max-width: 1280px;
      margin: 0 auto;
      text-align: center;
    }

    .page-title {
      font-size: 2.25rem;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
    }

    .page-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1rem;
      max-width: 700px;
      margin: 0 auto 2rem auto;
      line-height: 1.5;
    }

    /* Controls Bar */
    .controls-bar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 850px;
      margin: 0 auto;
    }

    .search-filter-row {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      width: 100%;
    }

    .search-box {
      position: relative;
      flex: 1;
    }

    .search-icon {
      position: absolute;
      left: 1.1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-secondary);
      display: flex;
      align-items: center;
    }

    .search-input {
      width: 100%;
      padding: 0.8rem 2.5rem 0.8rem 2.8rem;
      background: #FFFFFF;
      border: 1.5px solid var(--color-border);
      border-radius: 9999px;
      color: var(--color-text-main);
      font-size: 0.9rem;
      outline: none;
      transition: all 250ms ease;
      box-sizing: border-box;
    }

    .search-input:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 15px rgba(1, 92, 58, 0.2);
    }

    .clear-input-btn {
      position: absolute;
      right: 1.1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--color-text-muted);
      font-size: 0.9rem;
      cursor: pointer;
    }

    .clear-input-btn:hover { color: var(--color-text-main); }

    .btn-toggle-filter {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 1.3rem;
      background: #FFFFFF;
      border: 1.5px solid var(--color-border);
      border-radius: 9999px;
      color: var(--color-primary);
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: all 250ms ease;
    }

    .btn-toggle-filter:hover, .btn-toggle-filter.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #FFFFFF;
      box-shadow: var(--shadow-sm);
    }

    .filter-badge {
      background: var(--color-secondary);
      color: #013828;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 800;
    }

    /* Minimal Filter Panel */
    .filter-panel {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-card);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      text-align: left;
      box-shadow: var(--shadow-md);
      animation: slideDown 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .filter-label {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--color-primary-deep);
      display: flex;
      align-items: center;
      gap: 0.4rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .gender-options {
      display: flex;
      gap: 0.6rem;
      flex-wrap: wrap;
    }

    .gender-chip {
      padding: 0.5rem 1.1rem;
      background: #F7F8FA;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      color: var(--color-text-muted);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 200ms ease;
    }

    .gender-chip:hover {
      background: #E2E8F0;
      color: var(--color-text-main);
    }

    .gender-chip.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #FFFFFF;
      font-weight: 700;
    }

    .gender-chip.male.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #FFFFFF;
    }

    .gender-chip.female.active {
      background: #C2185B;
      border-color: #C2185B;
      color: #FFFFFF;
    }

    /* Minimal Amenities Grid */
    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 0.5rem;
    }

    .amenity-chip {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.8rem;
      background: #F7F8FA;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      color: var(--color-text-muted);
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 200ms ease;
      text-align: left;
    }

    .amenity-chip:hover {
      background: #E2E8F0;
      color: var(--color-text-main);
    }

    .amenity-chip.selected {
      background: rgba(1, 92, 58, 0.1);
      border-color: var(--color-primary);
      color: var(--color-primary);
      font-weight: 700;
    }

    .chip-check {
      display: flex;
      align-items: center;
      color: var(--color-primary);
    }

    /* Action Buttons Row */
    .filter-actions-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.85rem;
      border-top: 1px solid var(--color-border);
      gap: 1rem;
    }

    .btn-clear-all {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.55rem 1rem;
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      color: var(--color-text-muted);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 200ms ease;
    }

    .btn-clear-all:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: #EF4444;
      color: #DC2626;
    }

    .btn-apply-filters {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.65rem 1.5rem;
      background: var(--color-primary);
      border: none;
      border-radius: 6px;
      color: #FFFFFF;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 200ms ease;
      box-shadow: var(--shadow-sm);
    }

    .btn-apply-filters:hover {
      background: var(--color-primary-dark);
      box-shadow: var(--shadow-md);
    }

    /* List Section */
    .hostels-list-section {
      padding: 2.5rem 1.5rem 5rem 1.5rem;
    }

    .list-container {
      max-width: 1280px;
      margin: 0 auto;
    }

    .results-header {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.75rem;
    }

    .results-meta {
      color: var(--color-text-muted);
      font-size: 0.9rem;
    }

    .active-tags-row {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .active-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.65rem;
      background: #F4FBF7;
      border: 1px solid var(--color-border);
      border-radius: 9999px;
      color: var(--color-primary-dark);
      font-size: 0.8rem;
      font-weight: 600;
    }

    .tag-remove {
      background: none;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      font-size: 0.8rem;
      padding: 0;
      display: inline-flex;
      align-items: center;
    }

    .tag-remove:hover { color: var(--color-text-main); }

    .clear-tags-btn {
      background: none;
      border: none;
      color: var(--color-text-muted);
      font-size: 0.8rem;
      text-decoration: underline;
      cursor: pointer;
      padding: 0 0.4rem;
    }

    .clear-tags-btn:hover { color: #DC2626; }

    /* Cards Grid */
    .hostels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 2rem;
    }

    .hostel-card {
      background: linear-gradient(180deg, #FFFFFF 0%, #F4FBF7 100%);
      border-radius: var(--radius-card);
      border: 1.5px solid var(--color-border);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 250ms ease;
      box-shadow: var(--shadow-sm);
    }

    .hostel-card:hover {
      transform: translateY(-4px);
      border-color: var(--color-primary);
      box-shadow: var(--shadow-md);
    }

    .card-image {
      height: 190px;
      background-size: cover;
      background-position: center;
      position: relative;
    }

    .badge-overlay {
      position: absolute;
      top: 0.85rem;
      left: 0.85rem;
      right: 0.85rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .gender-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .gender-badge.male {
      background: rgba(1, 92, 58, 0.1);
      color: var(--color-primary);
      border: 1px solid rgba(1, 92, 58, 0.25);
    }

    .gender-badge.female {
      background: #FCE4EC;
      color: #C2185B;
      border: 1px solid #F48FB1;
    }

    .rating-badge {
      background: #FEF3C7;
      border: 1px solid #FCD34D;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #B45309;
    }

    .card-content {
      padding: 1.35rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .hostel-name {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--color-primary-deep);
      margin-bottom: 0.85rem;
      line-height: 1.35;
      min-height: 2.6rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-details {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      margin-bottom: 1.15rem;
      font-size: 0.88rem;
      color: var(--color-text-muted);
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      display: inline-block;
    }

    .vacancy.low-beds .status-dot {
      background: #EF4444;
    }

    .vacancy.low-beds {
      color: #DC2626;
    }

    .amenities-container {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
      margin-top: auto;
      min-height: 2.5rem;
    }

    .amenity-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: #F0FDFA;
      border: 1px solid #99F6E4;
      color: #0F766E;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      font-size: 0.76rem;
      font-weight: 600;
    }

    .amenity-pill.extra {
      background: #F1F5F9;
      border-color: #CBD5E1;
      color: var(--color-text-muted);
    }

    .btn-view-details {
      display: block;
      width: 100%;
      text-align: center;
      background: var(--color-primary);
      color: #FFFFFF;
      border: 1.5px solid var(--color-primary);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-btn);
      font-weight: 700;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 200ms ease;
      box-sizing: border-box;
    }

    .btn-view-details:hover {
      background: var(--color-primary-dark);
      border-color: var(--color-primary-dark);
      color: #FFFFFF;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 1.5rem;
    }
    .empty-state h3 { color: var(--color-primary-deep); font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
    .empty-state p { color: var(--color-text-muted); margin-bottom: 1.5rem; }
    .reset-search-btn { background: var(--color-primary); color: #FFFFFF; border: none; padding: 0.6rem 1.25rem; border-radius: var(--radius-btn); font-weight: 700; cursor: pointer; }

    @media (max-width: 768px) {
      .hostels-grid { grid-template-columns: 1fr; }
      .search-filter-row { flex-direction: column; }
      .btn-toggle-filter { width: 100%; justify-content: center; }
      .page-title { font-size: 1.75rem; }
      .amenities-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class HostelsComponent implements OnInit {
  private publicService = inject(PublicService);
  private sanitizer = inject(DomSanitizer);

  hostels: HostelSummary[] = [];
  
  availableAmenities: string[] = [
    'WiFi',
    'Mess & Dining',
    '24/7 Security',
    'Study Room',
    'Water Filter',
    'Laundry Area',
    'Generator',
    'Attached Bathrooms',
    'Sports Ground',
    'Cafeteria'
  ];

  // Draft Filter States
  draftSearch = '';
  draftGender: 'All' | 'Male' | 'Female' = 'All';
  draftAmenities: string[] = [];

  // Applied Filter States
  appliedSearch = '';
  appliedGender: 'All' | 'Male' | 'Female' = 'All';
  appliedAmenities: string[] = [];

  // Closed by default for minimal appearance
  isFilterPanelOpen = false;

  ngOnInit() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    this.publicService.getHostels().subscribe({
      next: (data) => this.hostels = data,
      error: (err) => console.error('Failed to fetch hostels', err)
    });
  }

  toggleAmenity(amenity: string) {
    const idx = this.draftAmenities.indexOf(amenity);
    if (idx >= 0) {
      this.draftAmenities.splice(idx, 1);
    } else {
      this.draftAmenities.push(amenity);
    }
  }

  isAmenitySelected(amenity: string): boolean {
    return this.draftAmenities.includes(amenity);
  }

  applyFilters() {
    this.appliedSearch = this.draftSearch;
    this.appliedGender = this.draftGender;
    this.appliedAmenities = [...this.draftAmenities];
    this.isFilterPanelOpen = false; // Automatically vanish filter box on apply!
  }

  clearAllFilters() {
    this.draftSearch = '';
    this.draftGender = 'All';
    this.draftAmenities = [];

    this.appliedSearch = '';
    this.appliedGender = 'All';
    this.appliedAmenities = [];
    this.isFilterPanelOpen = false;
  }

  removeAmenity(amenity: string) {
    this.draftAmenities = this.draftAmenities.filter(a => a !== amenity);
    this.appliedAmenities = this.appliedAmenities.filter(a => a !== amenity);
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.appliedGender !== 'All') count++;
    if (this.appliedSearch.trim() !== '') count++;
    count += this.appliedAmenities.length;
    return count;
  }

  get filteredHostels(): HostelSummary[] {
    return this.hostels.filter(h => {
      // Gender Filter
      const matchesGender = this.appliedGender === 'All' || h.gender.toLowerCase() === this.appliedGender.toLowerCase();

      // Search Query Filter
      const q = this.appliedSearch.trim().toLowerCase();
      let matchesSearch = true;
      if (q) {
        matchesSearch = 
          h.name.toLowerCase().includes(q) ||
          (h.location && h.location.toLowerCase().includes(q)) ||
          h.keyAmenities.some(a => a.toLowerCase().includes(q));
      }

      // Amenities Filter (Hostel must match ALL applied amenities)
      let matchesAmenities = true;
      if (this.appliedAmenities.length > 0) {
        matchesAmenities = this.appliedAmenities.every(req => 
          h.keyAmenities.some(a => a.toLowerCase().includes(req.toLowerCase()))
        );
      }

      return matchesGender && matchesSearch && matchesAmenities;
    });
  }

  getAmenityIcon(amenity: string): SafeHtml {
    const a = amenity.toLowerCase();
    let svg = '';
    if (a.includes('wifi') || a.includes('internet')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>`;
    } else if (a.includes('mess') || a.includes('dining') || a.includes('cafeteria') || a.includes('food')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`;
    } else if (a.includes('security') || a.includes('cctv') || a.includes('guarded') || a.includes('gate')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
    } else if (a.includes('study') || a.includes('reading') || a.includes('library')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
    } else if (a.includes('water') || a.includes('plant') || a.includes('filter') || a.includes('ro')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`;
    } else if (a.includes('laundry')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="2" width="18" height="20" rx="2"></rect><circle cx="12" cy="13" r="5"></circle><line x1="8" y1="6" x2="8.01" y2="6"></line><line x1="12" y1="6" x2="12.01" y2="6"></line></svg>`;
    } else if (a.includes('generator') || a.includes('power') || a.includes('backup')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
    } else if (a.includes('bath') || a.includes('bathroom') || a.includes('attached')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z"></path><path d="M6 12V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2"></path></svg>`;
    } else if (a.includes('sport') || a.includes('game') || a.includes('ground') || a.includes('gym')) {
      svg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>`;
    } else {
      svg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    }
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
