import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../core/admin/admin.service';
import { DashboardStats, AllocationStatusDto } from '../../core/models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DatePipe, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private admin = inject(AdminService);
  private snack = inject(MatSnackBar);
  stats?: DashboardStats;
  loading = false;
  allocationStatus$ = this.admin.getAllocationStatus();

  ngOnInit() {
    this.admin.getDashboardStats().subscribe({
      next: (s: DashboardStats) => {
        console.log('Dashboard raw response:', s);
        this.stats = s;
      },
      error: (err: any) => this.snack.open('Failed to load stats: ' + err.message, 'Close')
    });
  }

  toggle(open: boolean) {
    this.loading = true;
    this.admin.setAllocationStatus(open).subscribe({
      next: () => {
        this.snack.open('Allocation ' + (open ? 'opened' : 'closed'), 'OK', { duration: 3000 });
        this.allocationStatus$ = this.admin.getAllocationStatus();
        this.loading = false;
      },
      error: (err: any) => {
        this.snack.open('Error: ' + err.message, 'Close');
        this.loading = false;
      }
    });
  }
}
