import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HostelSummary, HostelDetail, Announcement } from './public.model';

@Injectable({ providedIn: 'root' })
export class PublicService {

  getHostels(): Observable<HostelSummary[]> {
    return of([
      {
        hostelId: 1,
        name: 'Allama I.I. Kazi Hostel',
        gender: 'Male',
        location: 'Main Campus, Jamshoro',
        mainImageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
        totalCapacity: 500,
        availableBeds: 45,
        rating: 4.5,
        keyAmenities: ['WiFi', 'Mess', 'Laundry']
      },
      {
        hostelId: 2,
        name: 'Marvi Girls Hostel',
        gender: 'Female',
        location: 'Main Campus, Jamshoro',
        mainImageUrl: 'https://images.unsplash.com/photo-1522771731478-44fb8965944e?auto=format&fit=crop&q=80&w=800',
        totalCapacity: 600,
        availableBeds: 120,
        rating: 4.8,
        keyAmenities: ['24/7 Security', 'Gym', 'Library']
      }
    ]);
  }

  getHostelById(id: number): Observable<HostelDetail> {
    return of({
        hostelId: id,
        name: 'Allama I.I. Kazi Hostel',
        gender: 'Male',
        location: 'Main Campus, Jamshoro',
        description: 'The premier accommodation facility for male students at the University of Sindh. Offering modern amenities and a conducive learning environment.',
        warden: 'Dr. Ahmed Khan',
        wardenPhone: '0300-1234567',
        totalCapacity: 500,
        occupiedBeds: 455,
        availableBeds: 45,
        rating: 4.5,
        reviewCount: 128,
        isAllocationOpen: true,
        images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200'],
        amenities: ['High-speed WiFi', 'Hygienic Mess', 'Laundry Room', 'Study Hall', 'Mosque'],
        eligibilitySummary: ['Min CGPA: 2.5', 'Enrollment: Regular Student', 'Gender: Male']
    });
  }

  getAnnouncements(): Observable<Announcement[]> {
    return of([
      { announcementId: 1, title: 'Fall 2026 Admissions Open', content: 'Hostel allocation for the new semester is now active.', publishedAt: new Date().toISOString() },
      { announcementId: 2, title: 'Maintenance Notice', content: 'Water supply in Block B will be interrupted on Sunday from 10 AM to 2 PM.', publishedAt: new Date().toISOString() }
    ]);
  }
}

