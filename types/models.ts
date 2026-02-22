export interface BaseUser {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  password?: string; // Should not be accessible usually
  profilePic?: string;
  isVerified: boolean;
  isProfileCompleted: boolean;
  isActive: boolean;
  termsAccepted: boolean;
  lastLogin?: Date;
  role: "Patient" | "Doctor" | "Admin";
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface Patient extends BaseUser {
  role: "Patient";
  DOB?: Date;
  gender?: "male" | "female" | "others";
  height?: number;
  weight?: number;
  bloodGroup?: string;
  qrCode?: string;
  medicalHistory?: string[];
  physicalGoals?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  savedClinics?: string[]; // IDs
  age?: number;
}

export interface Doctor extends BaseUser {
  role: "Doctor";
  specialization: string;
  subSpecializations?: string[];
  bio?: string;
  licenseNumber: string;
  experienceYears?: number;
  qualifications?: {
    degree: string;
    college: string;
    year: number;
  }[];
  consultationFee: number;
  countryCode: string;
  clinics?: string[]; // IDs
  availability?: {
    day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
    startTime: string;
    endTime: string;
    isOff: boolean;
  }[];
  averageRating: number;
  totalRatings: number;
}

export interface Admin extends BaseUser {
  role: "Admin";
  permissions: string[];
  superAdmin: boolean;
}

export interface Service {
  _id: string;
  clinic: string; // Clinic ID (renamed from clinicId)
  doctor?: string; // Optional doctor ID for doctor-specific pricing
  name: string;
  description?: string;
  duration: number; // Minutes
  price: number;
  category: string;
  isHomeVisit?: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UnavailableSlot {
  startTime: string;
  endTime: string;
  reason?: string;
}

// Shifts-based timing structure (matches backend)
export interface Shift {
  open12h: string;
  close12h: string;
  open: string; // HH:MM format (24-hour)
  close: string; // HH:MM format (24-hour)
}

export interface DaySchedule {
  isClosed: boolean;
  shifts: Shift[];
}

// Appointment configuration
export interface AppointmentConfig {
  slotDuration: number; // Minutes per patient
  bufferTime: number; // Cleaning/Notes time
  advanceBookingLimit: number; // Max days in advance
  instantBooking: boolean; // Can book "now"?
  isVirtualConsultationAvailable: boolean;
}

// Home visit configuration
export interface HomeVisitConfig {
  isAvailable: boolean;
  radiusKm: number; // Max travel distance
  travelFee: number; // Extra charge
  minBookingAmount: number;
}

// Social media links
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface Clinic {
  _id: string;
  owner?: string; // Doctor ID
  staff?: string[]; // Additional doctors
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phoneNumber: string;
  email?: string;
  website?: string;
  socialLinks?: SocialLinks;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  open24hrs: boolean;
  timing: {
    sunday: DaySchedule;
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
  };
  holidays?: { date: Date; reason: string }[];
  images: string[];
  facilities: (
    | "Wheelchair Access"
    | "Parking"
    | "Waiting Room"
    | "X-Ray"
    | "MRI"
    | "Gym"
    | "Restroom"
    | "Wifi"
    | "Other"
    | "Waiting Area"
  )[];
  services: Service[] | string[]; // Populated or IDs
  consultationFee: number; // Required

  // Configuration
  appointmentConfig?: AppointmentConfig;
  homeVisitConfig?: HomeVisitConfig;

  // Metadata
  clinicType?:
    | "Private Clinic"
    | "Polyclinic"
    | "Hospital"
    | "Rehab Center"
    | "Home Visit Base";
  specializations?: string[];
  tags?: string[];

  // Financials
  platformCommissionRate?: number; // Platform's commission (e.g., 10%)
  gstNumber?: string;

  // Rating (simplified structure matching backend)
  rating: {
    overall: number;
    reviewCount: number;
  };

  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClinicSummary extends Clinic {
  doctorMetrics: {
    totalAppointments: number;
    completedAppointments: number;
    upcomingAppointments: number;
    totalRevenueGenerated: number;
    averageRating: number;
    totalReviews: number;
  };
}

export interface Appointment {
  _id: string;
  patient: string | Patient;
  clinic: string | Clinic;
  doctor: string | Doctor;
  service: string | Service;
  startDateTime: string;
  endDateTime: string;
  duration: number;
  bookingStatus:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "rejected"
    | "expired";
  status?: string; // Virtual field from backend
  appointmentType: "In-Clinic" | "Home-Visit" | "Video-Call";
  billAmount: number;
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  symptoms?: string;
  diagnosis?: string;

  rating?: {
    stars: number;
    comment?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PopulatedAppointment extends Omit<
  Appointment,
  "patient" | "clinic" | "doctor" | "service"
> {
  patient: Patient;
  clinic: Clinic;
  doctor: Doctor;
  service: Service;
  verificationCode?: string; // only visible to doctor via +verificationCode select
}

export interface AppointmentStats {
  total: number;
  byStatus: {
    [key: string]: {
      count: number;
      revenue: number;
    };
  };
  totalRevenue: number;
}

export interface DashboardAppointment {
  _id: string;
  patientName: string;
  patientImage: string | null;
  date: string; // ISO from startDateTime
  time: string; // formatted HH:MM
  status: string;
  clinicName: string;
  serviceName: string | null;
  appointmentType: "In-Clinic" | "Home-Visit" | "Video-Call";
}

export interface DashboardData {
  todayStats: {
    total: number;
    completed: number;
    pending: number;
    revenue: number;
  };
  appointmentStats: {
    total: number;
    trend: number;
    byStatus: {
      pending: number;
      confirmed: number;
      completed: number;
      cancelled: number;
      rejected: number;
      expired: number;
    };
  };
  revenue: {
    thisPeriod: number;
    lastPeriod: number;
    growth: number;
    allTime: number;
  };
  ratings: {
    average: number;
    count: number;
    trend: number;
  };
  patientStats: {
    total: number;
    currentPeriod: number;
    trend: number;
  };
  upcomingAppointments: DashboardAppointment[];
  timeframe: string;
}

export interface ClinicAnalytics {
  clinic: Partial<Clinic>;
  appointmentStats: {
    total: number;
    allTime: number;
    trend: number;
    byStatus: {
      pending: number;
      confirmed: number;
      completed: number;
      cancelled: number;
      rejected: number;
      expired: number;
    };
    busiestDay: {
      day: string;
      count: number;
    };
    busiestTimeSlot: {
      hour: string;
      count: number;
      formattedTime?: string;
    };
  };
  revenue: {
    total: number;
    currentPeriod: number;
    previousPeriod: number;
    trend: number;
    average: number;
  };
  ratings: {
    average: number;
    currentPeriod: number;
    count: number;
    trend: number;
  };
  patientDemographics: {
    total: number;
    currentPeriod: number;
    trend: number;
    gender: {
      male: number;
      female: number;
      other: number;
    };
  };
  upcomingAppointments: {
    _id: string;
    patientName: string;
    patientImage: string | null;
    date: string;
    time: string;
    status: string;
    service: { name?: string } | null;
    appointmentType: "In-Clinic" | "Home-Visit" | "Video-Call";
  }[];
  popularServices: { name: string; count: number }[];
  monthlyTrends: { month: string; count: number; revenue: number }[];
  dailyTrends: {
    date: string;
    day: number;
    weekday: string;
    count: number;
    revenue: number;
  }[];
  timeframe: string;
}

export interface Review {
  _id: string;
  userId: string | Patient;
  clinicId: string | Clinic;
  appointmentId?: string | Appointment;
  rating: number;
  title?: string;
  comment?: string;
  serviceQuality?: number;
  facilities?: number;
  staffBehavior?: number;
  isVerified: boolean;
  status: "pending" | "approved" | "rejected";
  response?: {
    text: string;
    date: Date;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
