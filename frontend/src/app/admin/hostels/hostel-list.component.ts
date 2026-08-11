// src/app/admin/hostels/hostel-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../core/admin/admin.service';
import { HostelDto } from '../../core/models/admin.model';
import { HostelFormComponent } from './hostel-form.component';

@Component({
  selector: 'app-hostel-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <h2>Hostels</h2>
    <button mat-raised-button color="primary" (click)="openForm()">Add Hostel</button>
    <table mat-table [dataSource]="hostels" class="mat-elevation-z2">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let h">{{h.name}}</td>
      </ng-container>
      <ng-container matColumnDef="gender">
        <th mat-header-cell *matHeaderCellDef>Gender</th>
        <td mat-cell *matCellDef="let h">{{h.gender}}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let h">
          <button mat-icon-button (click)="openForm(h)"><mat-icon>edit</mat-icon></button>
          <button mat-icon-button color="warn" (click)="deactivate(h.hostelId!)"><mat-icon>delete</mat-icon></button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayed"></tr>
      <tr mat-row *matRowDef="let row; columns: displayed;"></tr>
    </table>
  `,
  styles: [`.mat-table { width: 100%; margin-top: 1rem; }`]
})
export class HostelListComponent implements OnInit {
  private admin = inject(AdminService);
  private dialog = inject(MatDialog);
  hostels: HostelDto[] = [];
  displayed = ['name', 'gender', 'actions'];

  ngOnInit() { this.load(); }

  load() {
    this.admin.getHostels().subscribe(data => this.hostels = data);
  }

  openForm(hostel?: HostelDto) {
    const ref = this.dialog.open(HostelFormComponent, {
      width: '600px',
      data: hostel ?? null
    });
    ref.afterClosed().subscribe(() => this.load());
  }

  deactivate(id: number) {
    if (confirm('Deactivate this hostel?')) {
      this.admin.deactivateHostel(id).subscribe(() => this.load());
    }
  }
}
