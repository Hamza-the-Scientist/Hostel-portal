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
      background: #001C3B;
      border-radius: 14px;
      padding: 1.5rem;
      border: 1px solid #002D5A;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      margin-bottom: 1.5rem;
      color: #FFFFFF;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #002D5A;
      padding-bottom: 0.85rem;
    }
    .header-row h3 { margin: 0; font-size: 1.15rem; color: #FFFFFF; font-weight: 700; }
    .status-badge {
      padding: 0.35rem 0.85rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .badge-not-processed { background: #00142A; color: #CBD5E1; border: 1px solid #002D5A; }
    .badge-in-processing { 
      background: rgba(253, 224, 71, 0.2); 
      color: #FEF08A; 
      border: 1px solid #FACC15; 
      box-shadow: 0 0 8px rgba(250, 204, 21, 0.25);
    }
    .badge-room-allocated { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); }
    .badge-allocation-complete { background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.4); }
    .badge-room-not-assigned { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }

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
      background: #00142A;
      color: #CBD5E1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.9rem;
      z-index: 2;
      border: 2px solid #001C3B;
      box-shadow: 0 0 0 2px #002D5A;
    }
    .timeline-step.completed .node {
      background: #00C7B6;
      color: #001832;
      box-shadow: 0 0 0 2px #00C7B6;
    }
    .timeline-step.current .node {
      background: #facc15;
      color: #001832;
      box-shadow: 0 0 0 2px #facc15;
    }
    .content { text-align: center; margin-top: 0.75rem; }
    .step-title { font-size: 0.85rem; font-weight: 600; color: #FFFFFF; margin-bottom: 0.2rem; }
    .step-desc { font-size: 0.75rem; color: #CBD5E1; }
    .line {
      position: absolute;
      top: 16px;
      left: 50%;
      width: 100%;
      height: 3px;
      background: #002D5A;
      z-index: 1;
    }
    .line.filled { background: #00C7B6; }
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
