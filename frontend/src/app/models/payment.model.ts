// ============================================================
// models/payment.model.ts — Payment & Challan models
// ============================================================

export interface ProcessingFee {
  feeId: number;
  applicationId: number;
  amount: number;
  dueDate: string;
  status: FeeStatus;
  challans: Challan[];
}

export type FeeStatus = 'Pending' | 'Paid' | 'Overdue' | 'Waived';

export interface Challan {
  challanId: number;
  feeId: number;
  challanNumber: string;
  generatedAt: string;
  expiresAt: string;
  payments: Payment[];
}

export interface Payment {
  paymentId: number;
  challanId: number;
  amount: number;
  paidAt: string;
  transactionRef: string;
  verifiedBy?: number;
}
