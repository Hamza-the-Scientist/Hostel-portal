// ============================================================
// models/complaint.model.ts — Complaints & Notifications models
// ============================================================

export interface Complaint {
  complaintId: number;
  residentId: number;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  attachments: ComplaintAttachment[];
}

export type ComplaintCategory =
  | 'Maintenance'
  | 'Cleanliness'
  | 'Noise'
  | 'Security'
  | 'Food'
  | 'Internet'
  | 'Other';

export type ComplaintStatus =
  | 'Open'
  | 'InProgress'
  | 'Resolved'
  | 'Closed'
  | 'Rejected';

export interface ComplaintAttachment {
  attachmentId: number;
  complaintId: number;
  fileUrl: string;
  fileType: string;
}

export interface Notification {
  notificationId: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  sentAt: string;
}

export interface Announcement {
  announcementId: number;
  title: string;
  content: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}
