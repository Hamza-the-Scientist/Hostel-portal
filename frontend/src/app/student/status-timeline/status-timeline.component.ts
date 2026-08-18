import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationTimelineStep } from '../application-workflow.service';

@Component({
  selector: 'app-status-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timeline-card">
      <div class="header-row">
        <h3>Application Status Tracking</h3>
        <span class="status-badge" [ngClass]="getBadgeClass(displayStatus)">
          {{ displayStatus }}
        </span>
      </div>

      <div class="timeline-container">
        <div 
          *ngFor="let step of timeline; let i = index" 
          class="timeline-step" 
          [class.completed]="step.isCompleted" 
          [class.current]="step.isCurrent"
        >
          <div class="node">
            <span *ngIf="step.isCompleted">✓</span>
            <span *ngIf="step.isCurrent && !step.isCompleted">●</span>
            <span *ngIf="!step.isCompleted && !step.isCurrent">○</span>
          </div>
          <div class="content">
            <div class="step-title">{{ step.stepName }}</div>
            <div class="step-desc">{{ step.description }}</div>
          </div>
          <div 
            *ngIf="i < timeline.length - 1" 
            class="line" 
            [class.filled]="step.isCompleted && (timeline[i+1]?.isCompleted || timeline[i+1]?.isCurrent)"
          ></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline-card {
      background: #FFFFFF;
      border-radius: var(--radius-card);
      padding: 1.5rem;
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      margin-bottom: 1.5rem;
      color: var(--color-text-main);
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 0.85rem;
    }
    .header-row h3 { margin: 0; font-size: 1.15rem; color: var(--color-primary-deep); font-weight: 700; }
    .status-badge {
      padding: 0.35rem 0.85rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .badge-not-processed { background: #F7F8FA; color: var(--color-text-muted); border: 1px solid var(--color-border); }
    .badge-in-processing { 
      background: #FEF3C7; 
      color: #B45309; 
      border: 1px solid #FCD34D; 
    }
    .badge-room-allocated { background: #D1FAE5; color: #047857; border: 1px solid #A7F3D0; }
    .badge-allocation-complete { background: #F3E8FF; color: #6B21A8; border: 1px solid #E9D5FF; }
    .badge-room-not-assigned { background: #FEE2E2; color: #991B1B; border: 1px solid #FCA5A5; }

    .timeline-container {
      display: flex;
      justify-content: space-between;
      position: relative;
      overflow-x: auto;
      padding: 1rem 0;
    }
    .timeline-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      position: relative;
      min-width: 100px;
    }
    .node {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #F7F8FA;
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.9rem;
      z-index: 2;
      border: 2px solid #FFFFFF;
      box-shadow: 0 0 0 2px var(--color-border);
    }
    .timeline-step.completed .node {
      background: var(--color-primary);
      color: #FFFFFF;
      box-shadow: 0 0 0 2px var(--color-primary);
    }
    .timeline-step.current .node {
      background: var(--color-secondary);
      color: #013828;
      box-shadow: 0 0 0 2px var(--color-secondary);
    }
    .content { text-align: center; margin-top: 0.75rem; }
    .step-title { font-size: 0.85rem; font-weight: 600; color: var(--color-primary-deep); margin-bottom: 0.2rem; }
    .step-desc { font-size: 0.75rem; color: var(--color-text-muted); }
    .line {
      position: absolute;
      top: 16px;
      left: 50%;
      width: 100%;
      height: 3px;
      background: var(--color-border);
      z-index: 1;
    }
    .line.filled { background: var(--color-primary); }
  `]
})
export class StatusTimelineComponent {
  @Input() displayStatus: string = 'In Progress';
  @Input() timeline: ApplicationTimelineStep[] = [];

  getBadgeClass(status: string): string {
    switch (status) {
      case 'In Processing':
      case 'In Progress':
      case 'Submitted':
      case 'Under Review':
      case 'Draft':
        return 'badge-in-processing';
      case 'Room Allocated': return 'badge-room-allocated';
      case 'Allocation Complete': return 'badge-allocation-complete';
      case 'Room Not Assigned': return 'badge-room-not-assigned';
      default: return 'badge-in-processing';
    }
  }
}
