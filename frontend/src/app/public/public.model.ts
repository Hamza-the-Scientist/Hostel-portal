export interface HostelSummary {
  hostelId: number;
  name: string;
  gender: string;
  location?: string;
  mainImageUrl?: string;
  totalCapacity: number;
  availableBeds: number;
  rating: number;
  keyAmenities: string[];
}

export interface HostelDetail {
  hostelId: number;
  name: string;
  gender: string;
  location?: string;
  description?: string;
  warden?: string;
  wardenPhone?: string;
  totalCapacity: number;
  occupiedBeds: number;
  availableBeds: number;
  rating: number;
  reviewCount: number;
  isAllocationOpen: boolean;
  images: string[];
  amenities: string[];
  eligibilitySummary: string[];
}

export interface Announcement {
  announcementId: number;
  title: string;
  content: string;
  publishedAt?: string;
}
