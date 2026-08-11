// src/app/admin/rooms/room-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../core/admin/admin.service';
import { RoomDto } from '../../core/models/admin.model';
import { RoomFormComponent } from './room-form.component';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <h2>Rooms</h2>
    <button mat-raised-button color="primary" (click)="openForm()">Add Room</button>
    <table mat-table [dataSource]="rooms" class="mat-elevation-z2">
      <ng-container matColumnDef="block"><th mat-header-cell *matHeaderCellDef>Block</th><td mat-cell *matCellDef="let r">{{r.block}}</td></ng-container>
      <ng-container matColumnDef="floor"><th mat-header-cell *matHeaderCellDef>Floor</th><td mat-cell *matCellDef="let r">{{r.floor}}</td></ng-container>
      <ng-container matColumnDef="number"><th mat-header-cell *matHeaderCellDef>Room #</th><td mat-cell *matCellDef="let r">{{r.number}}</td></ng-container>
      <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let r">
          <button mat-icon-button (click)="openForm(r)"><mat-icon>edit</mat-icon></button>
          <button mat-icon-button color="warn" (click)="deactivate(r.roomId!)"><mat-icon>delete</mat-icon></button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayed"></tr>
      <tr mat-row *matRowDef="let row; columns: displayed;"></tr>
    </table>
  `,
  styles: [`.mat-table { width: 100%; margin-top: 1rem; }`]
})
export class RoomListComponent implements OnInit {
  private admin = inject(AdminService);
  private dialog = inject(MatDialog);
  rooms: RoomDto[] = [];
  displayed = ['block', 'floor', 'number', 'actions'];
  selectedHostelId: number | null = null;

  ngOnInit() {
    // For demo purpose, fetch first hostel then its rooms
    this.admin.getHostels().subscribe(hostels => {
      if (hostels.length) {
        this.selectedHostelId = hostels[0].hostelId!;
        this.loadRooms();
      }
    });
  }

  loadRooms() {
    if (this.selectedHostelId != null) {
      this.admin.getRooms(this.selectedHostelId).subscribe(r => this.rooms = r);
    }
  }

  openForm(room?: RoomDto) {
    const ref = this.dialog.open(RoomFormComponent, {
      width: '500px',
      data: { room, hostelId: this.selectedHostelId }
    });
    ref.afterClosed().subscribe(() => this.loadRooms());
  }

  deactivate(id: number) {
    if (confirm('Deactivate this room?') && this.selectedHostelId != null) {
      this.admin.deactivateRoom(this.selectedHostelId, id).subscribe(() => this.loadRooms());
    }
  }
}
