// student/dashboard/dashboard.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { ResidencyService, StudentResidencyDto } from '../residency.service';
import { ResidentDashboardComponent } from './resident-dashboard/resident-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgFor, ResidentDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private residencyService = inject(ResidencyService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly residency = signal<StudentResidencyDto | null>(null);

  readonly applicationSteps = [
    { title: 'Verify Identity', desc: 'Confirm your university registration and CNIC details.' },
    { title: 'Check Eligibility', desc: 'System checks CGPA, semester, and district criteria.' },
    { title: 'Pay Processing Fee', desc: 'Generate and pay a one-time processing fee challan.' },
    { title: 'Select Preferences', desc: 'Rank your preferred hostels in order of priority.' },
    { title: 'Submit & Wait', desc: 'Merit list is generated. Top candidates are allocated rooms.' },
  ];

  ngOnInit(): void {
    this.loadResidency();
  }

  loadResidency(): void {
    this.loading.set(true);
    this.error.set(null);
    this.residencyService.getResidencyStatus().subscribe({
      next: (data) => {
        this.residency.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Could not connect to the server. Please try again.');
        this.loading.set(false);
      },
    });
  }

  reload(): void {
    this.loadResidency();
  }

  onResidencyChange(updated: StudentResidencyDto): void {
    this.residency.set(updated);
  }
}
