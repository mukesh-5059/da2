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

export interface Mess {
  MessID: string;
  MessName: string;
  MessType: 'Veg' | 'NonVeg' | 'Both' | 'VEG' | 'NONVEG' | 'BOTH';
  Location?: string;
  Phone?: string;
  SeatingCapacity?: number;
  Capacity?: number;
}

export interface Meal {
  MealID: string;
  MessID: string;
  MealName: string;
  Description?: string;
  Cost?: number;
  Price?: number;
  MessName?: string;
}

export interface MessSchedule {
  ScheduleID: string;
  MessID: string;
  MealID: string;
  DayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  ItemName?: string;
  MealName?: string;
  MealTime?: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
  Description?: string;
  MessName?: string;
}

export interface MessEnrollment {
  EnrollmentID: string;
  StudentID: string;
  MessID: string;
  MealPlanType?: 'Veg' | 'NonVeg' | 'Special';
  StartDate: string;
  EndDate?: string | null;
  IsActive?: number;
  StudentName?: string;
  FirstName?: string;
  LastName?: string;
  MessName?: string;
}

export interface MonthlyBill {
  BillID: string;
  StudentID: string;
  BillingMonth: number;
  BillingYear: number;
  RoomRentCharges: number;
  MessCharges: number;
  OtherCharges: number;
  TotalAmount: number;
  DueDate: string;
  PaymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  FirstName?: string;
  LastName?: string;
  StudentName?: string;
}

export interface PaymentTransaction {
  PaymentID: string;
  BillID: string;
  AmountPaid: number;
  PaymentMode: 'UPI' | 'NETBANKING' | 'CARD' | 'CASH';
  PaymentDate: string;
  TransactionReference: string;
  BillingMonth?: number;
  BillingYear?: number;
  StudentID?: string;
  FirstName?: string;
  LastName?: string;
}

