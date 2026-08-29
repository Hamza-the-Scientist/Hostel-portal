import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { HostelSummary, HostelDetail, Announcement, HostelReview } from './public.model';

@Injectable({ providedIn: 'root' })
export class PublicService {
  private readonly http = inject(HttpClient);

  private hostelsList: (HostelSummary & { description?: string; provost?: string; provostPhone?: string; warden?: string; wardenPhone?: string })[] = [
    // MALE HOSTELS
    {
      hostelId: 1,
      name: 'Marvi Girls Hostel',
      gender: 'Female',
      location: 'Girls Hostel Complex, Main Campus',
      mainImageUrl: '/images/marvi-hostel.jpeg',
      totalCapacity: 683,
      availableBeds: 25,
      rating: 4.6,
      keyAmenities: ['High-Speed WiFi', '24/7 Female Security', 'In-House Mess', 'Lush Green Lawn', 'Reading Room'],
      warden: 'Prof. Dr. Shaheen Shah',
      wardenPhone: '+92 300 9876543',
      description: 'The premier girls hostel offering top-notch security, beautiful central garden, and nutritious hygienic food options.'
    },
    {
      hostelId: 2,
      name: 'Lal Shahbaz Hostel',
      gender: 'Male',
      location: 'Main Campus, Jamshoro',
      mainImageUrl: '/images/lal-shahbaz-hostel.jpeg',
      totalCapacity: 412,
      availableBeds: 19,
      rating: 4.4,
      keyAmenities: ['High-Speed WiFi', 'Reading Hall', 'Cafeteria', 'Sports Ground', 'Guarded Gate'],
      warden: 'Engr. Mansoor Ali Soomro',
      wardenPhone: '+92 312 4567890',
      description: 'Named after the revered Sufi saint, this hostel combines traditional architecture with active student sports culture and spacious rooms.'
    },
    {
      hostelId: 3,
      name: 'P.G Girl Hostel',
      gender: 'Female',
      location: 'Main Campus, Jamshoro',
      mainImageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      totalCapacity: 204,
      availableBeds: 48,
      rating: 4.0,
      keyAmenities: ['24/7 Security & CCTV', 'Subsidized Mess', 'Laundry Area', 'Indoor Games', 'Generator'],
      warden: 'Prof. Fiza ',
      wardenPhone: '+92 333 9876542',
      description: 'The largest capacity hostel on campus, known for its bustling student community, budget-friendly mess facility, and open courtyard.'
    },
    {
      hostelId: 4,
      name: 'Under Graduate Girls Hostel',
      gender: 'Female',
      location: 'Main Campus, Jamshoro',
      mainImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      totalCapacity: 451,
      availableBeds: 8,
      rating: 4.1,
      keyAmenities: ['WiFi', 'Quiet Study Area', 'Filtered Water', 'Security Guard', 'Common Room'],
      warden: 'Dr. Ghulam Mustafa Shah',
      wardenPhone: '+92 300 1122334',
      description: 'A cozy, lower-density residential block providing a quiet and focused environment ideal for Under Graduate'
    },
    {
      hostelId: 5,
      name: 'Allama Iqbal Hostel',
      gender: 'Male',
      location: 'Main Campus, Jamshoro',
      mainImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      totalCapacity: 420,
      availableBeds: 32,
      rating: 4.3,
      keyAmenities: ['WiFi', 'Mess & Dining', '24/7 Security', 'Study Room', 'Water Plant'],
      warden: 'Dr. Farooq Ahmed Memon',
      wardenPhone: '+92 301 2345671',
      description: "A vibrant boys' hostel offering a balanced academic atmosphere, large common areas, and quick access to central campus departments."
    },
    {
      hostelId: 6,
      name: 'Sindh University Teachers Hostel',
      gender: 'Male',
      location: 'Main Campus, Jamshoro',
      mainImageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      totalCapacity: 75,
      availableBeds: 5,
      rating: 4.2,
      keyAmenities: ['WiFi', 'Dedicated Dining Hall', '24/7 Power Backup', 'Parking Space', 'Gardens'],
      warden: 'Mr. Abdul Rasheed Kalhoro',
      wardenPhone: '+92 305 6677889',
      description: 'Reserved for eligible university teachers and research fellows, offering well-maintained gardens and peace of mind.'
    }, 
    {
      hostelId: 7,
      name: 'Sindh University Employees Hostel',
      gender: 'Male',
      location: 'Main Campus, Jamshoro',
      mainImageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      totalCapacity: 75,
      availableBeds: 5,
      rating: 4.2,
      keyAmenities: ['WiFi', 'Dedicated Dining Hall', '24/7 Power Backup', 'Parking Space', 'Gardens'],
      warden: 'Mr. Abdul Rasheed Kalhoro',
      wardenPhone: '+92 305 6677889',
      description: 'Reserved for eligible university staff sons and research fellows, offering well-maintained gardens and peace of mind.'
    },
    {
      hostelId: 8,
      name: 'Blocks Hostel',
      gender: 'Male',
      location: 'Main Campus, Jamshoro',
      mainImageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      totalCapacity: 180,
      availableBeds: 12,
      rating: 3.9,
      keyAmenities: ['Mess Facility', 'RO Water Plant', 'Study Room', 'Night Security', 'Badminton Court'],
      warden: 'Mr. Imtiaz Ahmed Khoso',
      wardenPhone: '+92 334 5544332',
      description: 'Compact residential block featuring an active badminton court and easy access to the central university library.'
    },
    {
      hostelId: 9,
      name: 'Shaheed Benazir Bhutto International Hostel',
      gender: 'Male',
      location: 'Main Campus, Jamshoro',
      mainImageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      totalCapacity: 338,
      availableBeds: 14,
      rating: 4.6,
      keyAmenities: ['Air Conditioned Rooms', 'International Mess', '24/7 Security & Access Control', 'High-Speed WiFi', 'Laundry Service'],
      warden: 'Prof. Dr. Zahid Hussain Nizamani',
      wardenPhone: '+92 313 7766554',
      description: 'Specially designed to accommodate international exchange students and scholars with premium amenities and climate control.'
    },
    {
      hostelId: 10,
      name: 'Government Federal Hostel',
      gender: 'Male',
      location: 'Main Campus',
      mainImageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      totalCapacity: 570,
      availableBeds: 16,
      rating: 4.1,
      keyAmenities: ['WiFi', 'Study Lounge', 'Clean Dining', '24/7 Security Gate', 'Medical First Aid'],
      warden: 'Dr. Sultan',
      wardenPhone: '+92 303 5566778',
      description: 'Focuses on creating a disciplined yet supportive home-like environment for undergraduate female scholars.'
    },
    {
      hostelId: 11,
      name: "Shaheed Zulfiqar Ali Bhutto Hostel",
      gender: 'Male',
      location: ' Main Campus',
      mainImageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      totalCapacity: 200,
      availableBeds: 19,
      rating: 4.3,
      keyAmenities: ['High-Speed WiFi', 'Nutritious Mess Menu', 'Computer Room', 'Courtyard Garden', '24/7 Guarded Gate'],
      warden: 'Mrs. farz Memon',
      wardenPhone: '+92 315 8899001',
      description: 'Known for its friendly courtyard gathering space, delicious weekend mess menus, and quiet study quarters.'
    },
    {
      hostelId: 12,
      name: 'Khan Bahadur Syed Allahando Shah Hostel ',
      gender: 'Male',
      location: 'Main Campus',
      mainImageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      totalCapacity: 320,
      availableBeds: 21,
      rating: 4.5,
      keyAmenities: ['WiFi', 'Silent Study Library', 'Solar Power Generator', 'Purified Water Plant', 'Female Guarding Staff'],
      warden: 'Dr. Awais Unar',
      wardenPhone: '+92 307 1122445',
      description: 'Features a dedicated quiet study library open 24 hours during exam seasons and reliable solar power backup.'
    },
    {
      hostelId: 13,
      name: 'Makhdoom Ameen Fahmeen Hostel',
      gender: 'Male',
      location: 'Main Campus',
      mainImageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      totalCapacity: 184,
      availableBeds: 27,
      rating: 4.4,
      keyAmenities: ['WiFi', 'Central Mess', 'Tuck Shop', 'Medical Room', '24/7 Security Gate'],
      warden: 'Prof. Dr. Farz Baloch',
      wardenPhone: '+92 336 9900112',
      description: 'Conveniently located near the central departmental block with an in-house tuck shop and comprehensive healthcare support.'
    }
  ];

  // Realistic Pool of Student Reviews (6+ reviews per hostel)
  private reviewsList: HostelReview[] = [
    // Hostel 1: Allama Iqbal Hostel
    {
      id: 101,
      hostelId: 1,
      hostelName: 'Allama Iqbal Hostel',
      studentName: 'Syed Mansoor Shah',
      studentDept: 'Software Engineering, 3rd Year',
      rating: 4.5,
      date: 'January 2026',
      comment: 'Living at Allama Iqbal Hostel for two years now. The Wi-Fi connection in the reading room is remarkably fast for assignments, and the provost Dr. Farooq is very approachable whenever we need permission or room maintenance.',
      helpfulCount: 14
    },
    {
      id: 102,
      hostelId: 1,
      hostelName: 'Allama Iqbal Hostel',
      studentName: 'Zohaib Hassan Soomro',
      studentDept: 'Information Technology, Final Year',
      rating: 4.0,
      date: 'December 2025',
      comment: 'The mess menu is quite reasonable compared to private hostels in Jamshoro. Wednesday night biryani is always a highlight! Rooms are spacious enough for three students comfortably.',
      helpfulCount: 9
    },
    {
      id: 103,
      hostelId: 1,
      hostelName: 'Allama Iqbal Hostel',
      studentName: 'Muhammad Ali Junejo',
      studentDept: 'Physics Department, 2nd Year',
      rating: 4.5,
      date: 'November 2025',
      comment: 'Water filtration plant installed near the entrance ensures clean drinking water all day. Security guards at the main gate are strict about visitor entries which gives peace of mind.',
      helpfulCount: 11
    },
    {
      id: 104,
      hostelId: 1,
      hostelName: 'Allama Iqbal Hostel',
      studentName: 'Bilal Ahmed Mahar',
      studentDept: 'Civil Engineering, 1st Year',
      rating: 4.0,
      date: 'October 2025',
      comment: 'Freshly allocated room in Block B. The study room environment is quiet during late hours. Highly recommend applying early through the digital portal.',
      helpfulCount: 7
    },
    {
      id: 105,
      hostelId: 1,
      hostelName: 'Allama Iqbal Hostel',
      studentName: 'Fahad Mustafa Solangi',
      studentDept: 'Computer Science, 3rd Year',
      rating: 4.5,
      date: 'September 2025',
      comment: 'Great hostel culture and supportive seniors. We host regular group study sessions in the main hall before midterm exams.',
      helpfulCount: 15
    },
    {
      id: 106,
      hostelId: 1,
      hostelName: 'Allama Iqbal Hostel',
      studentName: 'Tariq Hussain Laghari',
      studentDept: 'Mathematics, 2nd Year',
      rating: 4.0,
      date: 'August 2025',
      comment: 'Electricity backup works smoothly during load shedding. Overall a very reliable place to stay on campus.',
      helpfulCount: 5
    },

    // Hostel 2: Government Federal Hostel
    {
      id: 201,
      hostelId: 2,
      hostelName: 'Government Federal Hostel',
      studentName: 'Hamza Khowaja',
      studentDept: 'Economics, 4th Year',
      rating: 4.0,
      date: 'January 2026',
      comment: 'As the largest hostel on campus, there is always a lively environment. The mess fee is very affordable for government scholars.',
      helpfulCount: 12
    },
    {
      id: 202,
      hostelId: 2,
      hostelName: 'Government Federal Hostel',
      studentName: 'Asadullah Rind',
      studentDept: 'Public Administration, 3rd Year',
      rating: 4.0,
      date: 'December 2025',
      comment: 'Spacious central courtyard where we play cricket on weekend evenings. The laundry service on-site is a huge convenience.',
      helpfulCount: 8
    },
    {
      id: 203,
      hostelId: 2,
      hostelName: 'Government Federal Hostel',
      studentName: 'Waqar Ahmed Jamali',
      studentDept: 'International Relations, 2nd Year',
      rating: 3.8,
      date: 'November 2025',
      comment: 'Good hostel with solid infrastructure. Wi-Fi reaches most rooms, though during peak evening hours it slows down slightly.',
      helpfulCount: 6
    },
    {
      id: 204,
      hostelId: 2,
      hostelName: 'Government Federal Hostel',
      studentName: 'Noman Ali Talpur',
      studentDept: 'Commerce, Final Year',
      rating: 4.2,
      date: 'October 2025',
      comment: 'Provost Prof. Tariq Hussain is quick to address any plumbing or electrical issues reported by students.',
      helpfulCount: 10
    },
    {
      id: 205,
      hostelId: 2,
      hostelName: 'Government Federal Hostel',
      studentName: 'Imran Shah',
      studentDept: 'Law Department, 3rd Year',
      rating: 4.0,
      date: 'September 2025',
      comment: 'Walking distance to the Law Faculty and central canteen. Perfect spot for students who have long class schedules.',
      helpfulCount: 13
    },
    {
      id: 206,
      hostelId: 2,
      hostelName: 'Government Federal Hostel',
      studentName: 'Sajjad Ahmed Sangi',
      studentDept: 'Sociology, 2nd Year',
      rating: 4.0,
      date: 'August 2025',
      comment: 'Clean hallways and regular morning cleaning staff make living here comfortable.',
      helpfulCount: 4
    },

    // Hostel 3: Lal Shahbaz Hostel
    {
      id: 301,
      hostelId: 3,
      hostelName: 'Lal Shahbaz Hostel',
      studentName: 'Ahsan Ali Bhutto',
      studentDept: 'Electrical Engineering, 3rd Year',
      rating: 4.5,
      date: 'January 2026',
      comment: 'Lal Shahbaz hostel has the best reading hall on campus! Silent, air-cooled, and open till 2 AM during semester exam weeks.',
      helpfulCount: 18
    },
    {
      id: 302,
      hostelId: 3,
      hostelName: 'Lal Shahbaz Hostel',
      studentName: 'Kashif Raza Memon',
      studentDept: 'Chemical Engineering, 4th Year',
      rating: 4.4,
      date: 'December 2025',
      comment: 'High speed Wi-Fi fiber link installed last month works like a charm. Watching lecture videos without buffering is a relief.',
      helpfulCount: 14
    },
    {
      id: 303,
      hostelId: 3,
      hostelName: 'Lal Shahbaz Hostel',
      studentName: 'Danish Kumar',
      studentDept: 'Pharmacy, Final Year',
      rating: 4.5,
      date: 'November 2025',
      comment: 'The hostel cafeteria serves hot tea and samosas till midnight. Very friendly room allotment staff.',
      helpfulCount: 9
    },
    {
      id: 304,
      hostelId: 3,
      hostelName: 'Lal Shahbaz Hostel',
      studentName: 'Zubair Ahmed Chandio',
      studentDept: 'Mechanical Engineering, 2nd Year',
      rating: 4.3,
      date: 'October 2025',
      comment: 'Large sports ground right outside the block. Volleyball matches after 5 PM are a great way to unwind after classes.',
      helpfulCount: 11
    },
    {
      id: 305,
      hostelId: 3,
      hostelName: 'Lal Shahbaz Hostel',
      studentName: 'Adeel Khan Jatoi',
      studentDept: 'Geology Department, 3rd Year',
      rating: 4.4,
      date: 'September 2025',
      comment: 'Proper security check-in system. Rooms have sturdy wooden study tables and built-in cupboards.',
      helpfulCount: 7
    },
    {
      id: 306,
      hostelId: 3,
      hostelName: 'Lal Shahbaz Hostel',
      studentName: 'Farhan Ali Abro',
      studentDept: 'Microbiology, 1st Year',
      rating: 4.5,
      date: 'August 2025',
      comment: 'Best hostel experience in Jamshoro campus. Provost Engr. Mansoor is polite and supportive.',
      helpfulCount: 16
    },

    // Hostel 7: Shah Abdul Latif Bhittai Hostel
    {
      id: 701,
      hostelId: 7,
      hostelName: 'Shah Abdul Latif Bhittai Hostel',
      studentName: 'Sikandar Ali Shah',
      studentDept: 'Software Engineering, 4th Year',
      rating: 4.6,
      date: 'January 2026',
      comment: 'Equipped with a modern indoor fitness gym and blazing fast internet. The overall maintenance standards here are top tier.',
      helpfulCount: 22
    },
    {
      id: 702,
      hostelId: 7,
      hostelName: 'Shah Abdul Latif Bhittai Hostel',
      studentName: 'Kamran Hyder Soomro',
      studentDept: 'Computer Science, Final Year',
      rating: 4.5,
      date: 'December 2025',
      comment: 'The central mess is kept clean and hygienic. Special chicken karahi on Sunday nights is popular among all residents.',
      helpfulCount: 17
    },
    {
      id: 703,
      hostelId: 7,
      hostelName: 'Shah Abdul Latif Bhittai Hostel',
      studentName: 'Rameez Raja Kalhoro',
      studentDept: 'Telecommunication, 3rd Year',
      rating: 4.5,
      date: 'November 2025',
      comment: '24/7 CCTV surveillance and modern electronic entry logs make this one of the safest boys hostels on campus.',
      helpfulCount: 12
    },
    {
      id: 704,
      hostelId: 7,
      hostelName: 'Shah Abdul Latif Bhittai Hostel',
      studentName: 'Rehan Ahmed Memon',
      studentDept: 'Biotechnology, 2nd Year',
      rating: 4.4,
      date: 'October 2025',
      comment: 'Quiet study lounge equipped with power outlets for laptops. Never faced water scarcity issues.',
      helpfulCount: 10
    },
    {
      id: 705,
      hostelId: 7,
      hostelName: 'Shah Abdul Latif Bhittai Hostel',
      studentName: 'Nabeel Ahmed Shaikh',
      studentDept: 'English Literature, 3rd Year',
      rating: 4.5,
      date: 'September 2025',
      comment: 'Great community atmosphere. The hostel administration listens to student feedback quickly.',
      helpfulCount: 15
    },
    {
      id: 706,
      hostelId: 7,
      hostelName: 'Shah Abdul Latif Bhittai Hostel',
      studentName: 'Usama Ali Solangi',
      studentDept: 'Statistics Department, 1st Year',
      rating: 4.5,
      date: 'August 2025',
      comment: 'Solid experience. Clean washrooms and well-lit corridor pathways.',
      helpfulCount: 8
    },

    // Hostel 8: International Boys Hostel
    {
      id: 801,
      hostelId: 8,
      hostelName: 'International Boys Hostel',
      studentName: 'Mustafa Al-Hassan',
      studentDept: 'Medicine & Surgery, 4th Year',
      rating: 4.8,
      date: 'January 2026',
      comment: 'Air-conditioned double rooms with attached washrooms. The international dining menu caters to various cultural tastes.',
      helpfulCount: 25
    },
    {
      id: 802,
      hostelId: 8,
      hostelName: 'International Boys Hostel',
      studentName: 'Tariq Al-Mansoor',
      studentDept: 'Computer Science, Master Scholar',
      rating: 4.7,
      date: 'December 2025',
      comment: 'Very quiet and secure environment. High-speed internet is seamless for international research calls and virtual labs.',
      helpfulCount: 19
    },
    {
      id: 803,
      hostelId: 8,
      hostelName: 'International Boys Hostel',
      studentName: 'Ahmed Omar',
      studentDept: 'Biochemistry PhD Scholar',
      rating: 4.6,
      date: 'November 2025',
      comment: 'Excellent laundry service and prompt housekeeping. Provost Prof. Dr. Zahid Nizamani is extremely accommodating.',
      helpfulCount: 14
    },
    {
      id: 804,
      hostelId: 8,
      hostelName: 'International Boys Hostel',
      studentName: 'Jean-Luc Habimana',
      studentDept: 'Environmental Science, 3rd Year',
      rating: 4.5,
      date: 'October 2025',
      comment: 'Comfortable living conditions and great security protocols around the clock.',
      helpfulCount: 11
    },
    {
      id: 805,
      hostelId: 8,
      hostelName: 'International Boys Hostel',
      studentName: 'Bilal Khan',
      studentDept: 'Software Engineering, MS',
      rating: 4.6,
      date: 'September 2025',
      comment: 'One of the best living quarters in Sindh University campus. Worth every bit of the fee.',
      helpfulCount: 16
    },
    {
      id: 806,
      hostelId: 8,
      hostelName: 'International Boys Hostel',
      studentName: 'Rashid Al-Kindi',
      studentDept: 'Geology PhD Scholar',
      rating: 4.7,
      date: 'August 2025',
      comment: 'Spacious rooms, AC climate control, and friendly staff support.',
      helpfulCount: 13
    },

    // Hostel 9: Marvi Girls Hostel
    {
      id: 901,
      hostelId: 9,
      hostelName: 'Marvi Girls Hostel',
      studentName: 'Ayesha Kalhoro',
      studentDept: 'Software Engineering, 3rd Year',
      rating: 4.8,
      date: 'January 2026',
      comment: 'Marvi Girls Hostel feels like a second home! The central garden is full of flowers and provides a peaceful evening stroll after tough lab hours. Strict security guards ensure complete peace of mind.',
      helpfulCount: 31
    },
    {
      id: 902,
      hostelId: 9,
      hostelName: 'Marvi Girls Hostel',
      studentName: 'Dua Fatima Nizamani',
      studentDept: 'Information Technology, Final Year',
      rating: 4.6,
      date: 'December 2025',
      comment: 'The provost Dr. Shaheen Shah is like a caring parent to all residents. Mess food is fresh, clean, and nutritious. Never had any issues with Wi-Fi signal strength in Block A.',
      helpfulCount: 24
    },
    {
      id: 903,
      hostelId: 9,
      hostelName: 'Marvi Girls Hostel',
      studentName: 'Zainab Solangi',
      studentDept: 'Biochemistry, 2nd Year',
      rating: 4.5,
      date: 'November 2025',
      comment: 'Reading rooms are well-lit and quiet. Having a purified water filter on every floor is a huge plus.',
      helpfulCount: 19
    },
    {
      id: 904,
      hostelId: 9,
      hostelName: 'Marvi Girls Hostel',
      studentName: 'Saima Parveen Chandio',
      studentDept: 'English Department, 4th Year',
      rating: 4.7,
      date: 'October 2025',
      comment: 'Safe gated access and polite female guards. The annual hostel gathering in the courtyard was beautifully organized.',
      helpfulCount: 22
    },
    {
      id: 905,
      hostelId: 9,
      hostelName: 'Marvi Girls Hostel',
      studentName: 'Hira Ali Memon',
      studentDept: 'Computer Science, 1st Year',
      rating: 4.6,
      date: 'September 2025',
      comment: 'Roommates were matched perfectly by the hostel committee. Very friendly and supportive environment for freshers.',
      helpfulCount: 15
    },
    {
      id: 906,
      hostelId: 9,
      hostelName: 'Marvi Girls Hostel',
      studentName: 'Nida Fatima Syed',
      studentDept: 'Microbiology, 3rd Year',
      rating: 4.5,
      date: 'August 2025',
      comment: 'Clean washrooms, regular sanitation, and cooperative provost office staff.',
      helpfulCount: 18
    },

    // Hostel 10: Elsa Kazi Girls Hostel
    {
      id: 1001,
      hostelId: 10,
      hostelName: 'Elsa Kazi Girls Hostel',
      studentName: 'Bismah Shah',
      studentDept: 'Fine Arts, 4th Year',
      rating: 4.5,
      date: 'January 2026',
      comment: 'Named after Elsa Kazi, this hostel has an artistic and tranquil vibe. The library room is packed with reference books and peaceful study spots.',
      helpfulCount: 20
    },
    {
      id: 1002,
      hostelId: 10,
      hostelName: 'Elsa Kazi Girls Hostel',
      studentName: 'Mariam Baloch',
      studentDept: 'Sociology, 3rd Year',
      rating: 4.3,
      date: 'December 2025',
      comment: 'Biometric gate security provides seamless entry for registered residents while keeping unauthorized visitors out.',
      helpfulCount: 16
    },
    {
      id: 1003,
      hostelId: 10,
      hostelName: 'Elsa Kazi Girls Hostel',
      studentName: 'Kinza Fatima Soomro',
      studentDept: 'Psychology, 2nd Year',
      rating: 4.4,
      date: 'November 2025',
      comment: 'Doctor on call facility proved very helpful when my roommate caught seasonal fever. The provost arranged medical aid immediately.',
      helpfulCount: 14
    },
    {
      id: 1004,
      hostelId: 10,
      hostelName: 'Elsa Kazi Girls Hostel',
      studentName: 'Mehak Ali Junejo',
      studentDept: 'Botany Department, 1st Year',
      rating: 4.2,
      date: 'October 2025',
      comment: 'Clean dining hall with freshly prepared chapattis every evening.',
      helpfulCount: 10
    },
    {
      id: 1005,
      hostelId: 10,
      hostelName: 'Elsa Kazi Girls Hostel',
      studentName: 'Sadaf Unar',
      studentDept: 'Pharmacy, 3rd Year',
      rating: 4.3,
      date: 'September 2025',
      comment: 'Strong female guard presence and well-maintained boundary security.',
      helpfulCount: 12
    },
    {
      id: 1006,
      hostelId: 10,
      hostelName: 'Elsa Kazi Girls Hostel',
      studentName: 'Tanzila Mahar',
      studentDept: 'Zoology, 2nd Year',
      rating: 4.4,
      date: 'August 2025',
      comment: 'High speed Wi-Fi in the main lobby area allows smooth download of academic papers.',
      helpfulCount: 9
    },

    // Hostel 12: Benazir Bhutto International Girls Hostel
    {
      id: 1201,
      hostelId: 12,
      hostelName: 'Benazir Bhutto International Girls Hostel',
      studentName: 'Fatima Al-Zahra',
      studentDept: 'Software Engineering, Final Year',
      rating: 4.9,
      date: 'January 2026',
      comment: 'State-of-the-art building with modern air conditioning and private study nooks. The fitness room is well-equipped with treadmills.',
      helpfulCount: 35
    },
    {
      id: 1202,
      hostelId: 12,
      hostelName: 'Benazir Bhutto International Girls Hostel',
      studentName: 'Mahnoor Khan',
      studentDept: 'Computer Science, 4th Year',
      rating: 4.7,
      date: 'December 2025',
      comment: 'Fiber internet connection works effortlessly everywhere in the building. High standards of safety and cleanliness throughout.',
      helpfulCount: 28
    },
    {
      id: 1203,
      hostelId: 12,
      hostelName: 'Benazir Bhutto International Girls Hostel',
      studentName: 'Sarah Jenkins',
      studentDept: 'Exchange Scholar, Cultural Studies',
      rating: 4.8,
      date: 'November 2025',
      comment: 'Wonderful international atmosphere. The staff is exceptionally polite, helpful, and fluent in English.',
      helpfulCount: 21
    },
    {
      id: 1204,
      hostelId: 12,
      hostelName: 'Benazir Bhutto International Girls Hostel',
      studentName: 'Rida Fatima Syed',
      studentDept: 'BBA, 3rd Year',
      rating: 4.6,
      date: 'October 2025',
      comment: 'Modern kitchen facilities and spacious double beds. Feels like living in a high-end private residence.',
      helpfulCount: 19
    },
    {
      id: 1205,
      hostelId: 12,
      hostelName: 'Benazir Bhutto International Girls Hostel',
      studentName: 'Samreen Laghari',
      studentDept: 'Electrical Engineering, 2nd Year',
      rating: 4.7,
      date: 'September 2025',
      comment: 'Strict 24/7 CCTV surveillance and digital access security at the gates.',
      helpfulCount: 16
    },
    {
      id: 1206,
      hostelId: 12,
      hostelName: 'Benazir Bhutto International Girls Hostel',
      studentName: 'Amna Bibi',
      studentDept: 'Biotechnology, MS Scholar',
      rating: 4.8,
      date: 'August 2025',
      comment: 'Truly international standard! Exceptional provost staff and top level hygiene.',
      helpfulCount: 24
    },

    // Additional Reviews for Remaining Hostels
    // Block Hostel C
    { id: 401, hostelId: 4, hostelName: '(Allama Dr. Daudpota) Block Hostel "C"', studentName: 'Imtiaz Ali Shah', studentDept: 'Physics MS', rating: 4.2, date: 'Jan 2026', comment: 'Very peaceful block for senior students. Quiet environment for thesis research.', helpfulCount: 8 },
    { id: 402, hostelId: 4, hostelName: '(Allama Dr. Daudpota) Block Hostel "C"', studentName: 'Faisal Solangi', studentDept: 'Maths 4th Year', rating: 4.0, date: 'Dec 2025', comment: 'Clean rooms with high ceilings. Filtered water plant on ground floor.', helpfulCount: 6 },
    { id: 403, hostelId: 4, hostelName: '(Allama Dr. Daudpota) Block Hostel "C"', studentName: 'Sheraz Memon', studentDept: 'Chemistry 3rd Year', rating: 4.1, date: 'Nov 2025', comment: 'Friendly provost Dr. Daudpota. Good security around the block.', helpfulCount: 5 },
    { id: 404, hostelId: 4, hostelName: '(Allama Dr. Daudpota) Block Hostel "C"', studentName: 'Ali Raza Soomro', studentDept: 'Geology 2nd Year', rating: 4.0, date: 'Oct 2025', comment: 'Wi-Fi reaches rooms reliably. Walking distance to central labs.', helpfulCount: 4 },
    { id: 405, hostelId: 4, hostelName: '(Allama Dr. Daudpota) Block Hostel "C"', studentName: 'Babar Chandio', studentDept: 'Stats 1st Year', rating: 4.1, date: 'Sep 2025', comment: 'Cozy building, spacious rooms.', helpfulCount: 7 },
    { id: 406, hostelId: 4, hostelName: '(Allama Dr. Daudpota) Block Hostel "C"', studentName: 'Tariq Mahar', studentDept: 'Botany 3rd Year', rating: 4.2, date: 'Aug 2025', comment: 'Quiet study room is very beneficial.', helpfulCount: 6 },

    // Employees Hostel
    { id: 501, hostelId: 5, hostelName: 'Sindh University Employees Hostel', studentName: 'Faraz Kalhoro', studentDept: 'Research Scholar', rating: 4.3, date: 'Jan 2026', comment: 'Well-maintained lawns and quiet surroundings. Excellent dining hall.', helpfulCount: 10 },
    { id: 502, hostelId: 5, hostelName: 'Sindh University Employees Hostel', studentName: 'Junaid Abro', studentDept: 'CS Department', rating: 4.2, date: 'Dec 2025', comment: 'Solar power backup guarantees uninterrupted study lights during exams.', helpfulCount: 9 },
    { id: 503, hostelId: 5, hostelName: 'Sindh University Employees Hostel', studentName: 'Waqas Khoso', studentDept: 'Engineering', rating: 4.1, date: 'Nov 2025', comment: 'Ample parking space and friendly administrative staff.', helpfulCount: 7 },
    { id: 504, hostelId: 5, hostelName: 'Sindh University Employees Hostel', studentName: 'Zahid Memon', studentDept: 'Law Faculty', rating: 4.2, date: 'Oct 2025', comment: 'Spacious rooms with proper ventilation.', helpfulCount: 5 },
    { id: 505, hostelId: 5, hostelName: 'Sindh University Employees Hostel', studentName: 'Hamid Shah', studentDept: 'Public Admin', rating: 4.3, date: 'Sep 2025', comment: 'Clean dining tables and fresh meals daily.', helpfulCount: 8 },
    { id: 506, hostelId: 5, hostelName: 'Sindh University Employees Hostel', studentName: 'Bilal Soomro', studentDept: 'Pharmacy', rating: 4.2, date: 'Aug 2025', comment: 'Peaceful garden for evening walks.', helpfulCount: 6 },

    // Hasrat Mohani Block D
    { id: 601, hostelId: 6, hostelName: '(Hasrat Mohani) Block Hostel "D"', studentName: 'Sameer Junejo', studentDept: 'English Lit 2nd Year', rating: 4.0, date: 'Jan 2026', comment: 'Active badminton matches in the courtyard every evening. Fun hostel environment.', helpfulCount: 11 },
    { id: 602, hostelId: 6, hostelName: '(Hasrat Mohani) Block Hostel "D"', studentName: 'Adnan Rind', studentDept: 'Sociology 3rd Year', rating: 3.9, date: 'Dec 2025', comment: 'Near central university library, which saves a lot of walking time.', helpfulCount: 8 },
    { id: 603, hostelId: 6, hostelName: '(Hasrat Mohani) Block Hostel "D"', studentName: 'Shoaib Khowaja', studentDept: 'Economics 4th Year', rating: 4.0, date: 'Nov 2025', comment: 'RO water plant provides cold purified drinking water.', helpfulCount: 7 },
    { id: 604, hostelId: 6, hostelName: '(Hasrat Mohani) Block Hostel "D"', studentName: 'Nabeel Jatoi', studentDept: 'Mass Comm 2nd Year', rating: 3.8, date: 'Oct 2025', comment: 'Decent food in mess, good provost response time.', helpfulCount: 5 },
    { id: 605, hostelId: 6, hostelName: '(Hasrat Mohani) Block Hostel "D"', studentName: 'Khurram Bhatti', studentDept: 'Commerce', rating: 3.9, date: 'Sep 2025', comment: 'Clean corridors and nightly security rounds.', helpfulCount: 6 },
    { id: 606, hostelId: 6, hostelName: '(Hasrat Mohani) Block Hostel "D"', studentName: 'Rizwan Laghari', studentDept: 'Physics', rating: 4.0, date: 'Aug 2025', comment: 'Friendly roommates and supportive study environment.', helpfulCount: 4 },

    // Fatima Jinnah Girls Hostel
    { id: 1101, hostelId: 11, hostelName: 'Fatima Jinnah Girls Hostel', studentName: 'Nida Fatima Jatoi', studentDept: 'Computer Science 3rd Year', rating: 4.5, date: 'Jan 2026', comment: 'In-house computer lab access is very helpful during project submission weeks.', helpfulCount: 19 },
    { id: 1102, hostelId: 11, hostelName: 'Fatima Jinnah Girls Hostel', studentName: 'Kinza Memon', studentDept: 'Software Eng 2nd Year', rating: 4.4, date: 'Dec 2025', comment: 'Solar backup keeps study lamps and fans running smoothly. High boundary walls.', helpfulCount: 15 },
    { id: 1103, hostelId: 11, hostelName: 'Fatima Jinnah Girls Hostel', studentName: 'Sana Kalhoro', studentDept: 'Pharmacy 4th Year', rating: 4.3, date: 'Nov 2025', comment: 'Clean dining hall with hygienic cooked meals.', helpfulCount: 12 },
    { id: 1104, hostelId: 11, hostelName: 'Fatima Jinnah Girls Hostel', studentName: 'Afshan Solangi', studentDept: 'Physics 1st Year', rating: 4.4, date: 'Oct 2025', comment: 'Spacious rooms with study desks for each student.', helpfulCount: 10 },
    { id: 1105, hostelId: 11, hostelName: 'Fatima Jinnah Girls Hostel', studentName: 'Bushra Unar', studentDept: 'Biotechnology', rating: 4.5, date: 'Sep 2025', comment: 'Prompt security checks at gate ensure maximum safety.', helpfulCount: 14 },
    { id: 1106, hostelId: 11, hostelName: 'Fatima Jinnah Girls Hostel', studentName: 'Zainab Soomro', studentDept: 'Maths 2nd Year', rating: 4.4, date: 'Aug 2025', comment: 'Provost Mrs. Parveen is very attentive to student needs.', helpfulCount: 11 },

    // Bakhtawar Bhutto Girls Hostel
    { id: 1301, hostelId: 13, hostelName: 'Bakhtawar Bhutto Girls Hostel', studentName: 'Sahar Solangi', studentDept: 'Microbiology 3rd Year', rating: 4.3, date: 'Jan 2026', comment: 'Newly renovated building with vibrant rooms. Table tennis board in common room is super fun.', helpfulCount: 13 },
    { id: 1302, hostelId: 13, hostelName: 'Bakhtawar Bhutto Girls Hostel', studentName: 'Alishba Shah', studentDept: 'Chemistry 2nd Year', rating: 4.2, date: 'Dec 2025', comment: 'Fresh mess menu changed every week based on student voting.', helpfulCount: 11 },
    { id: 1303, hostelId: 13, hostelName: 'Bakhtawar Bhutto Girls Hostel', studentName: 'Komal Chandio', studentDept: 'Botany 4th Year', rating: 4.1, date: 'Nov 2025', comment: 'Purified water filter on every floor works great.', helpfulCount: 9 },
    { id: 1304, hostelId: 13, hostelName: 'Bakhtawar Bhutto Girls Hostel', studentName: 'Faiza Junejo', studentDept: 'Zoology 1st Year', rating: 4.3, date: 'Oct 2025', comment: 'Friendly matron available 24/7 in provost office.', helpfulCount: 8 },
    { id: 1305, hostelId: 13, hostelName: 'Bakhtawar Bhutto Girls Hostel', studentName: 'Sumaira Khowaja', studentDept: 'English Lit', rating: 4.2, date: 'Sep 2025', comment: 'Good Wi-Fi coverage across all rooms.', helpfulCount: 7 },
    { id: 1306, hostelId: 13, hostelName: 'Bakhtawar Bhutto Girls Hostel', studentName: 'Noreen Abro', studentDept: 'Sociology', rating: 4.2, date: 'Aug 2025', comment: 'Clean corridors and peaceful atmosphere.', helpfulCount: 6 },

    // Hyder Bux Jatoi Girls Hostel
    { id: 1401, hostelId: 14, hostelName: 'Hyder Bux Jatoi Girls Hostel', studentName: 'Rabia Sultana', studentDept: 'International Relations 3rd Year', rating: 4.2, date: 'Jan 2026', comment: 'Disciplined home-like environment. Study lounge is bright and well ventilated.', helpfulCount: 12 },
    { id: 1402, hostelId: 14, hostelName: 'Hyder Bux Jatoi Girls Hostel', studentName: 'Shazia Jatoi', studentDept: 'Public Admin 2nd Year', rating: 4.1, date: 'Dec 2025', comment: 'Medical first aid box maintained carefully in female security post.', helpfulCount: 9 },
    { id: 1403, hostelId: 14, hostelName: 'Hyder Bux Jatoi Girls Hostel', studentName: 'Tazeen Bhatti', studentDept: 'Economics 4th Year', rating: 4.1, date: 'Nov 2025', comment: 'Clean mess area and polite cooks.', helpfulCount: 7 },
    { id: 1404, hostelId: 14, hostelName: 'Hyder Bux Jatoi Girls Hostel', studentName: 'Mehreen Memon', studentDept: 'Psychology 1st Year', rating: 4.0, date: 'Oct 2025', comment: 'Close to main girls hostel gate entrance.', helpfulCount: 6 },
    { id: 1405, hostelId: 14, hostelName: 'Hyder Bux Jatoi Girls Hostel', studentName: 'Farheen Solangi', studentDept: 'Mass Comm', rating: 4.2, date: 'Sep 2025', comment: 'Reliable security staff on night duty.', helpfulCount: 8 },
    { id: 1406, hostelId: 14, hostelName: 'Hyder Bux Jatoi Girls Hostel', studentName: 'Areeba Kalhoro', studentDept: 'Physics', rating: 4.1, date: 'Aug 2025', comment: 'Peaceful environment for daily studies.', helpfulCount: 5 },

    // Ra'ana Liaquat Ali Khan Girls Hostel
    { id: 1501, hostelId: 15, hostelName: "Ra'ana Liaquat Ali Khan Girls Hostel", studentName: 'Asma Memon', studentDept: 'Software Engineering 3rd Year', rating: 4.4, date: 'Jan 2026', comment: 'The courtyard garden is gorgeous! Weekend tea sessions with friends are unforgettable.', helpfulCount: 16 },
    { id: 1502, hostelId: 15, hostelName: "Ra'ana Liaquat Ali Khan Girls Hostel", studentName: 'Mehak Fatima', studentDept: 'Information Tech 4th Year', rating: 4.3, date: 'Dec 2025', comment: 'Mess food is very clean and tasty, especially Friday pulao.', helpfulCount: 14 },
    { id: 1503, hostelId: 15, hostelName: "Ra'ana Liaquat Ali Khan Girls Hostel", studentName: 'Fouzia Soomro', studentDept: 'Biochemistry 2nd Year', rating: 4.3, date: 'Nov 2025', comment: 'Computer room available for students without laptops.', helpfulCount: 10 },
    { id: 1504, hostelId: 15, hostelName: "Ra'ana Liaquat Ali Khan Girls Hostel", studentName: 'Nadia Chandio', studentDept: 'Maths 1st Year', rating: 4.2, date: 'Oct 2025', comment: '24/7 guarded gate ensures top security.', helpfulCount: 8 },
    { id: 1505, hostelId: 15, hostelName: "Ra'ana Liaquat Ali Khan Girls Hostel", studentName: 'Hafsa Shaikh', studentDept: 'Commerce', rating: 4.4, date: 'Sep 2025', comment: 'Quiet quarters ideal for exam preparation.', helpfulCount: 11 },
    { id: 1506, hostelId: 15, hostelName: "Ra'ana Liaquat Ali Khan Girls Hostel", studentName: 'Sadia Unar', studentDept: 'Chemistry', rating: 4.3, date: 'Aug 2025', comment: 'High speed Wi-Fi signal in every corridor.', helpfulCount: 9 },

    // Syeda Zainab Girls Hostel
    { id: 1601, hostelId: 16, hostelName: 'Syeda Zainab Girls Hostel', studentName: 'Farah Unar', studentDept: 'Medicine & Surgery 4th Year', rating: 4.6, date: 'Jan 2026', comment: 'The 24-hour silent library during exam season was a lifesaver for my professional exams! Solar generator keeps study lights on.', helpfulCount: 22 },
    { id: 1602, hostelId: 16, hostelName: 'Syeda Zainab Girls Hostel', studentName: 'Zainab Fatima', studentDept: 'Pharmacy 3rd Year', rating: 4.5, date: 'Dec 2025', comment: 'Purified water plant on ground floor, super clean washrooms, and strict female security staff.', helpfulCount: 18 },
    { id: 1603, hostelId: 16, hostelName: 'Syeda Zainab Girls Hostel', studentName: 'Komal Baloch', studentDept: 'Biotechnology 2nd Year', rating: 4.5, date: 'Nov 2025', comment: 'Very supportive provost Dr. Yasmin Unar.', helpfulCount: 13 },
    { id: 1604, hostelId: 16, hostelName: 'Syeda Zainab Girls Hostel', studentName: 'Saima Solangi', studentDept: 'Physics 1st Year', rating: 4.4, date: 'Oct 2025', comment: 'Wi-Fi connection is fast and continuous.', helpfulCount: 11 },
    { id: 1605, hostelId: 16, hostelName: 'Syeda Zainab Girls Hostel', studentName: 'Sidra Kalhoro', studentDept: 'CS 4th Year', rating: 4.5, date: 'Sep 2025', comment: 'Great solar power backup during load shedding.', helpfulCount: 15 },
    { id: 1606, hostelId: 16, hostelName: 'Syeda Zainab Girls Hostel', studentName: 'Mariam Soomro', studentDept: 'Law Faculty', rating: 4.5, date: 'Aug 2025', comment: 'Silent study corners on top floor.', helpfulCount: 10 },

    // Bibi Ayesha Girls Hostel
    { id: 1701, hostelId: 17, hostelName: 'Bibi Ayesha Girls Hostel', studentName: 'Naila Baloch', studentDept: 'Computer Science 3rd Year', rating: 4.5, date: 'Jan 2026', comment: 'In-house tuck shop is so convenient for late night snacks while working on assignments! Close to main departmental blocks.', helpfulCount: 17 },
    { id: 1702, hostelId: 17, hostelName: 'Bibi Ayesha Girls Hostel', studentName: 'Shazia Memon', studentDept: 'Software Eng 2nd Year', rating: 4.4, date: 'Dec 2025', comment: 'Medical room staff responds immediately when someone needs medicines or healthcare advice.', helpfulCount: 14 },
    { id: 1703, hostelId: 17, hostelName: 'Bibi Ayesha Girls Hostel', studentName: 'Amina Chandio', studentDept: 'Botany 4th Year', rating: 4.3, date: 'Nov 2025', comment: 'Central mess serves hot fresh meals on time every day.', helpfulCount: 11 },
    { id: 1704, hostelId: 17, hostelName: 'Bibi Ayesha Girls Hostel', studentName: 'Kinza Jatoi', studentDept: 'Economics 1st Year', rating: 4.4, date: 'Oct 2025', comment: '24/7 security gate with strict visitor log.', helpfulCount: 9 },
    { id: 1705, hostelId: 17, hostelName: 'Bibi Ayesha Girls Hostel', studentName: 'Yumna Soomro', studentDept: 'Sociology 3rd Year', rating: 4.4, date: 'Sep 2025', comment: 'Friendly female guards and supportive provost.', helpfulCount: 12 },
    { id: 1706, hostelId: 17, hostelName: 'Bibi Ayesha Girls Hostel', studentName: 'Hira Abro', studentDept: 'Zoology 2nd Year', rating: 4.3, date: 'Aug 2025', comment: 'Clean common room with TV and seating.', helpfulCount: 8 }
  ];

  // Announcements 
  private announcementsList: Announcement[] = [
    {
      announcementId: 1,
      title: 'Hostel Allocation Phase 1 Registration Open',
      content: 'Applications for Phase 1 allocation for academic year 2026 are now open. Eligible students can apply through the portal before Feb 28, 2026.',
      publishedAt: '2026-02-01'
    },
    {
      announcementId: 2,
      title: 'Challan Verification Deadline Extended',
      content: 'The deadline for annual hostel fee challan submission and online verification has been extended to March 15, 2026.',
      publishedAt: '2026-02-10'
    }
  ];


  getHostels(): Observable<HostelSummary[]> {
    return this.http.get<HostelSummary[]>(`${environment.apiUrl}/api/hostels`).pipe(
      map(res => (res && res.length > 0) ? res : this.hostelsList),
      catchError(() => of(this.hostelsList))
    );
  }

  getHostelById(id: number): Observable<HostelDetail | null> {
    return this.http.get<HostelDetail>(`${environment.apiUrl}/api/hostels/${id}`).pipe(
      map(res => res || this.getFallbackHostelDetail(id)),
      catchError(() => of(this.getFallbackHostelDetail(id)))
    );
  }

  private getFallbackHostelDetail(id: number): HostelDetail | null {
    const found = this.hostelsList.find(h => h.hostelId === id);
    if (!found) return null;

    const hostelReviews = this.reviewsList.filter(r => r.hostelId === id);

    return {
      hostelId: found.hostelId,
      name: found.name,
      gender: found.gender,
      location: found.location,
      description: found.description || 'Modern and secure hostel block on the main campus.',
      provost: (found as any).provost || found.warden,
      provostPhone: (found as any).provostPhone || found.wardenPhone,
      warden: (found as any).provost || found.warden,
      wardenPhone: (found as any).provostPhone || found.wardenPhone,
      totalCapacity: found.totalCapacity,
      occupiedBeds: found.totalCapacity - found.availableBeds,
      availableBeds: found.availableBeds,
      rating: found.rating,
      reviewCount: hostelReviews.length > 0 ? hostelReviews.length : 59,
      isAllocationOpen: true,
      images: [found.mainImageUrl || ''],
      amenities: found.keyAmenities,
      eligibilitySummary: [
        'Must be a currently enrolled full-time student of University of Sindh.',
        'Must belong to designated quota districts outside Jamshoro/Hyderabad.',
        'Academic attendance record above 75% in previous semester.'
      ]
    };
  }

  getAnnouncements(): Observable<Announcement[]> {
    return of(this.announcementsList);
  }

  /**
   *  reviews filtered by hostelId
   */
  getReviews(hostelId?: number): Observable<HostelReview[]> {
    if (hostelId && hostelId > 0) {
      return of(this.reviewsList.filter(r => r.hostelId === hostelId));
    }
    return of(this.reviewsList);
  }

  /**
   * Rom reviews for the landing page banner on every page refresh
   */
  getRandomReviews(count: number = 10): Observable<HostelReview[]> {
    // Fisher-Yates Shuffle copy of reviewsList
    const shuffled = [...this.reviewsList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return of(shuffled.slice(0, count));
  }
}
