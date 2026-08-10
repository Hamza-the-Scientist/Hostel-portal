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
          <div *ngIf="i < timeline.length - 1" class="line" [class.filled]="step.isCompleted"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #e0e0e0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.04);
      margin-bottom: 1.5rem;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 0.85rem;
    }
    .header-row h3 { margin: 0; font-size: 1.15rem; color: #333; }
    .status-badge {
      padding: 0.35rem 0.85rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-not-processed { background: #f5f5f5; color: #666; border: 1px solid #ccc; }
    .badge-in-processing { background: #e3f2fd; color: #0288d1; border: 1px solid #b3e5fc; }
    .badge-room-allocated { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
    .badge-allocation-complete { background: #d1c4e9; color: #4527a0; border: 1px solid #b39ddb; }
    .badge-room-not-assigned { background: #ffebee; color: #c62828; border: 1px solid #ffcdd2; }

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
      background: #eee;
      color: #777;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.9rem;
      z-index: 2;
      border: 2px solid #fff;
      box-shadow: 0 0 0 2px #ccc;
    }
    .timeline-step.completed .node {
      background: #015C3A;
      color: white;
      box-shadow: 0 0 0 2px #015C3A;
    }
    .timeline-step.current .node {
      background: #D4AF37;
      color: white;
      box-shadow: 0 0 0 2px #D4AF37;
    }
    .content { text-align: center; margin-top: 0.75rem; }
    .step-title { font-size: 0.85rem; font-weight: 600; color: #333; margin-bottom: 0.2rem; }
    .step-desc { font-size: 0.75rem; color: #777; }
    .line {
      position: absolute;
      top: 16px;
      left: 50%;
      width: 100%;
      height: 3px;
      background: #e0e0e0;
      z-index: 1;
    }
    .line.filled { background: #015C3A; }
  `]
})
export class StatusTimelineComponent {
  @Input() displayStatus: string = 'Not Processed';
  @Input() timeline: ApplicationTimelineStep[] = [];

  getBadgeClass(status: string): string {
    switch (status) {
      case 'In Processing': return 'badge-in-processing';
      case 'Room Allocated': return 'badge-room-allocated';
      case 'Allocation Complete': return 'badge-allocation-complete';
      case 'Room Not Assigned': return 'badge-room-not-assigned';
      default: return 'badge-not-processed';
    }
  }
}
