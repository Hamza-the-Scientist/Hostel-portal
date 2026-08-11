// src/app/admin/eligibility/eligibility-builder.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../core/admin/admin.service';
import { EligibilityRuleDto } from '../../core/models/admin.model';

@Component({
  selector: 'app-eligibility-builder',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatInputModule, MatSelectModule, MatIconModule, ReactiveFormsModule],
  template: `
    <h2>Eligibility Rule Builder</h2>
    <table mat-table [dataSource]="rules.controls" class="mat-elevation-z2">
      <ng-container matColumnDef="field">
        <th mat-header-cell *matHeaderCellDef>Field</th>
        <td mat-cell *matCellDef="let ctrl; let i = index">
          <select matNativeControl [formControl]="ctrl.get('field')">
            <option value="gender">Gender</option>
            <option value="academicYear">Academic Year</option>
            <option value="program">Program</option>
            <option value="cpn">CPN</option>
            <option value="district">District</option>
          </select>
        </td>
      </ng-container>
      <ng-container matColumnDef="operator">
        <th mat-header-cell *matHeaderCellDef>Operator</th>
        <td mat-cell *matCellDef="let ctrl">
          <select matNativeControl [formControl]="ctrl.get('operator')">
            <option value="equals">=</option>
            <option value="in">IN</option>
            <option value=">=">>=</option>
            <option value="<="><=</option>
          </select>
        </td>
      </ng-container>
      <ng-container matColumnDef="value">
        <th mat-header-cell *matHeaderCellDef>Value</th>
        <td mat-cell *matCellDef="let ctrl">
          <input matInput [formControl]="ctrl.get('value')" placeholder="value">
        </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let ctrl; let i = index">
          <button mat-icon-button color="warn" (click)="removeRule(i)"><mat-icon>delete</mat-icon></button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayed"></tr>
      <tr mat-row *matRowDef="let row; columns: displayed;"></tr>
    </table>
    <button mat-raised-button color="primary" (click)="addRule()">Add Rule</button>
    <button mat-raised-button color="accent" (click)="save()">Save Rules</button>
  `,
  styles: [`.mat-table { width: 100%; margin-top: 1rem; }`]
})
export class EligibilityBuilderComponent implements OnInit {
  private fb = inject(FormBuilder);
  private admin = inject(AdminService);
  private snack = inject(MatSnackBar);

  displayed = ['field', 'operator', 'value', 'actions'];
  rules = this.fb.array<FormGroup>([]);

  ngOnInit() {
    // Load rules for first hostel (demo)
    this.admin.getHostels().subscribe(hostels => {
      if (hostels.length) {
        this.admin.getEligibilityRules(hostels[0].hostelId!).subscribe(rules => {
          rules.forEach(rule => this.rules.push(this.createRuleGroup(rule)));
        });
      }
    });
  }

  createRuleGroup(rule?: EligibilityRuleDto): FormGroup {
    return this.fb.group({
      field: [rule?.field ?? 'gender', Validators.required],
      operator: [rule?.operator ?? 'equals', Validators.required],
      value: [rule?.value ?? '', Validators.required]
    });
  }

  addRule() {
    this.rules.push(this.createRuleGroup());
  }

  removeRule(index: number) {
    this.rules.removeAt(index);
  }

  save() {
    this.admin.getHostels().subscribe(hostels => {
      if (!hostels.length) return;
      const payload: EligibilityRuleDto[] = this.rules.value;
      this.admin.saveEligibilityRules(hostels[0].hostelId!, payload).subscribe({
        next: () => this.snack.open('Rules saved', 'OK', { duration: 2000 }),
        error: err => this.snack.open('Error: ' + err.message, 'Close')
      });
    });
  }
}
