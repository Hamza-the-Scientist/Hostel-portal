// student/views/settings-view.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="view-container">
      <div class="view-header">
        <h2>Account & Portal Settings</h2>
        <p class="subtitle">Manage security settings, notifications, and portal preferences.</p>
      </div>

      <div class="card">
        <h3>Preferences & Security</h3>
        <div class="setting-item">
          <div>
            <strong>Email Notifications</strong>
            <p>Receive status updates via email</p>
          </div>
          <input type="checkbox" checked />
        </div>
        <div class="setting-item">
          <div>
            <strong>SMS Alerts</strong>
            <p>Receive urgent SMS alerts for room allocation & deadlines</p>
          </div>
          <input type="checkbox" checked />
        </div>
        <div class="setting-item">
          <div>
            <strong>Two-Factor Authentication (2FA)</strong>
            <p>Enhanced security for login</p>
          </div>
          <input type="checkbox" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .view-container { max-width: 700px; margin: 0 auto; }
    .view-header h2 { font-size: 1.5rem; font-weight: 800; color: #FFFFFF; margin-bottom: 0.25rem; }
    .subtitle { color: #CBD5E1; font-size: 0.9rem; margin-bottom: 1.5rem; }
    .card { background: #001C3B; border: 1px solid #002D5A; border-radius: 16px; padding: 1.75rem; box-shadow: 0 4px 16px rgba(0,0,0,0.25); }
    .card h3 { font-size: 1.1rem; font-weight: 700; color: #FFFFFF; margin-top: 0; margin-bottom: 1.25rem; }
    .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #002D5A; }
    .setting-item:last-child { border-bottom: none; }
    .setting-item strong { display: block; font-size: 0.92rem; color: #FFFFFF; }
    .setting-item p { font-size: 0.8rem; color: #CBD5E1; margin: 0.15rem 0 0 0; }
  `]
})
export class SettingsViewComponent {}
