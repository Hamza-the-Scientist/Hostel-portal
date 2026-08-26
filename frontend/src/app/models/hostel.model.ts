// Hostel & Room interfaces

export interface Hostel {
  hostelId: number;
  name: string;
  gender: 'Male' | 'Female';
  totalCapacity: number;
  address: string;
  description?: string;
  isActive: boolean;
  images: HostelImage[];
  amenities: HostelAmenity[];
}

export interface HostelImage {
  imageId: number;
  imageUrl: string;
  isPrimary: boolean;
}

export interface HostelAmenity {
  amenityId: number;
  amenityName: string;
  description?: string;
}

export interface Block {
  blockId: number;
  hostelId: number;
  blockName: string;
  floors: Floor[];
}

export interface Floor {
  floorId: number;
  blockId: number;
  floorNumber: number;
  rooms: Room[];
}

export interface Room {
  roomId: number;
  floorId: number;
  roomNumber: string;
  roomType: 'Single' | 'Double' | 'Triple' | 'Quad';
  maxOccupancy: number;
  beds: Bed[];
}

export interface Bed {
  bedId: number;
  roomId: number;
  bedLabel: string;
  isAvailable: boolean;
}
