// student/views/notifications-view.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="view-container">
      <div class="view-header">
        <h2>Notifications & Alerts</h2>
        <p class="subtitle">Stay updated with official hostel announcements, merit list releases, and maintenance schedules.</p>
      </div>

      <div class="notifications-list">
        <div class="notif-card unread" *ngFor="let item of notifications">
          <div class="notif-icon">{{ item.icon }}</div>
          <div class="notif-content">
            <div class="notif-header">
              <h4>{{ item.title }}</h4>
              <span class="time">{{ item.time }}</span>
            </div>
            <p>{{ item.message }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .view-container { max-width: 800px; margin: 0 auto; }
    .view-header h2 { font-size: 1.5rem; font-weight: 800; color: #FFFFFF; margin-bottom: 0.25rem; }
    .subtitle { color: #CBD5E1; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .notifications-list { display: flex; flex-direction: column; gap: 0.85rem; }
    .notif-card { display: flex; gap: 1rem; background: #001C3B; border: 1px solid #002D5A; padding: 1.2rem; border-radius: 12px; transition: background 0.2s; box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
    .notif-card.unread { border-left: 4px solid #00C7B6; background: #001C3B; }
    .notif-icon { font-size: 1.5rem; }
    .notif-content { flex: 1; }
    .notif-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem; }
    .notif-header h4 { font-size: 0.95rem; font-weight: 700; color: #FFFFFF; margin: 0; }
    .time { font-size: 0.78rem; color: #94A3B8; }
    .notif-content p { font-size: 0.86rem; color: #CBD5E1; margin: 0; }
  `]
})
export class NotificationsViewComponent {
  notifications = [
    { title: 'Merit List Released', message: 'The Phase 7 automated merit score list for session 2025-2026 has been published.', time: '2 hours ago', icon: '🏆' },
    { title: 'Hostel Challan Generated', message: 'Your final hostel accommodation fee challan is ready for download.', time: 'Yesterday', icon: '💳' },
    { title: 'Maintenance Notice', message: 'Water supply maintenance scheduled for Allama Iqbal Hostel on Saturday.', time: '3 days ago', icon: '🔧' }
  ];
}
