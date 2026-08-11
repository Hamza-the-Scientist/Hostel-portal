// src/app/admin/students/student-management.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../core/admin/admin.service';
import { StudentDto } from '../../core/models/admin.model';

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatInputModule, MatButtonModule],
  template: `
    <h2>Student Management</h2>
    <form [formGroup]="filterForm" (ngSubmit)="search()" class="filter-form">
      <input matInput placeholder="Name" formControlName="name" />
      <input matInput placeholder="CNIC" formControlName="cnic" />
      <input matInput placeholder="Roll No." formControlName="rollNumber" />
      <button mat-raised-button color="primary" type="submit">Search</button>
    </form>
    <table mat-table [dataSource]="students" class="mat-elevation-z2">
      <ng-container matColumnDef="cnic"><th mat-header-cell *matHeaderCellDef>CNIC</th><td mat-cell *matCellDef="let s">{{s.cnic}}</td></ng-container>
      <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let s">{{s.name}}</td></ng-container>
      <ng-container matColumnDef="department"><th mat-header-cell *matHeaderCellDef>Dept.</th><td mat-cell *matCellDef="let s">{{s.department}}</td></ng-container>
      <ng-container matColumnDef="academicYear"><th mat-header-cell *matHeaderCellDef>Year</th><td mat-cell *matCellDef="let s">{{s.academicYear}}</td></ng-container>
      <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let s"><button mat-button (click)="view(s)">View</button></td></ng-container>
      <tr mat-header-row *matHeaderRowDef="displayed"></tr>
      <tr mat-row *matRowDef="let row; columns: displayed;"></tr>
    </table>
  `,
  styles: [`.filter-form { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: 1rem; }`]
})
export class StudentManagementComponent implements OnInit {
  private admin = inject(AdminService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  filterForm = this.fb.group({
    name: [''],
    cnic: [''],
    rollNumber: ['']
  });

  students: StudentDto[] = [];
  displayed = ['cnic', 'name', 'department', 'academicYear', 'actions'];

  ngOnInit() { this.search(); }

  search() {
    this.admin.searchStudents(this.filterForm.value).subscribe(data => this.students = data);
  }

  view(student: StudentDto) {
    alert(`Student: ${student.name}\nCNIC: ${student.cnic}\nRoll: ${student.rollNumber}\nDept: ${student.department}\nYear: ${student.academicYear}`);
  }
}
