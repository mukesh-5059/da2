export interface Warden {
  WardenID: string;
  FirstName: string;
  LastName: string;
  Email?: string;
  Phone?: string;
  Designation?: string;
  JoiningDate?: string;
}

export interface Hostel {
  HostelID: string;
  HostelName: string;
  HostelType: 'Boys' | 'Girls';
  TotalFloors: number;
  TotalRooms: number;
  Location?: string;
  WardenID?: string;
  WardenName?: string;
}

export interface RoomType {
  Type: string;
  Capacity: number;
  RoomRent: number;
}

export interface Room {
  RoomNo: string;
  FloorNo: number;
  Status: 'Vacant' | 'Occupied' | 'UnderMaintenance';
  Type: string;
  HostelID: string;
  HostelName?: string;
  Capacity?: number;
  RoomRent?: number;
}

export interface Student {
  StudentID: string;
  FirstName: string;
  LastName: string;
  Gender?: string;
  DOB?: string;
  Email?: string;
  Phone?: string;
  BloodGroup?: string;
  Department?: string;
  AdmissionDate?: string;
  IsActive?: number;
}

export interface Guardian {
  GuardianID: string;
  StudentID: string;
  GuardianName: string;
  Relationship: string;
  Phone: string;
  Email?: string;
  Address?: string;
}

export interface Staff {
  StaffID: string;
  FirstName: string;
  LastName: string;
  Phone: string;
  JoinDate: string;
  Salary: number;
  Role: 'Chef' | 'Cleaner' | 'Helper' | 'Security';
  ShiftSlot: 'Morning' | 'Evening' | 'Night';
  CuisineType?: string | null;
  MessID?: string | null;
  HostelID?: string | null;
}

export interface RoomAllocation {
  AllocationID: string;
  StudentID: string;
  RoomNo: string;
  AcademicYear: string;
  Semester: string;
  CheckInDate: string;
  CheckOutDate?: string | null;
  StudentName?: string;
  Email?: string;
  Phone?: string;
  Department?: string;
}
