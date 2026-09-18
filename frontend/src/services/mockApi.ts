import { Hostel, RoomType, Room, RoomAllocation, Warden, Student, Guardian, Staff, Mess, Meal, MessSchedule, MessEnrollment, MonthlyBill, PaymentTransaction, Supplier, InventoryItem, InventoryStock, ProcurementEvent } from '../types';

let hostels: Hostel[] = [
  { HostelID: 'H1', HostelName: 'Men\'s Hostel Block A', HostelType: 'Boys', TotalFloors: 5, TotalRooms: 100, Location: 'North Campus', WardenID: 'W1' },
  { HostelID: 'H2', HostelName: 'Women\'s Hostel Block B', HostelType: 'Girls', TotalFloors: 4, TotalRooms: 80, Location: 'South Campus', WardenID: 'W2' }
];

let roomTypes: RoomType[] = [
  { Type: 'Single Non-AC', Capacity: 1, RoomRent: 15000 },
  { Type: 'Double AC', Capacity: 2, RoomRent: 25000 }
];

let rooms: Room[] = [
  { RoomNo: 'A-101', FloorNo: 1, Status: 'Occupied', Type: 'Single Non-AC', HostelID: 'H1' },
  { RoomNo: 'B-205', FloorNo: 2, Status: 'Vacant', Type: 'Double AC', HostelID: 'H2' }
];

let wardens: Warden[] = [
  { WardenID: 'W1', FirstName: 'John', LastName: 'Doe', Phone: '9876543210', Email: 'john.doe@example.com', Designation: 'Chief Warden', JoiningDate: '2023-01-10' },
  { WardenID: 'W2', FirstName: 'Jane', LastName: 'Smith', Phone: '8765432109', Email: 'jane.smith@example.com', Designation: 'Warden', JoiningDate: '2023-02-15' }
];

let students: Student[] = [
  { StudentID: 'STD_52540763', FirstName: 'Swati', LastName: 'Singh', DOB: '2002-05-14', Gender: 'F', BloodGroup: 'O+', Phone: '9998887776', Email: 'swati.singh@example.com', Department: 'Computer Science', AdmissionDate: '2022-07-01', IsActive: 1 },
  { StudentID: 'STD_98765432', FirstName: 'Rahul', LastName: 'Kumar', DOB: '2001-08-20', Gender: 'M', BloodGroup: 'A+', Phone: '8887776665', Email: 'rahul.kumar@example.com', Department: 'Mechanical', AdmissionDate: '2021-07-01', IsActive: 1 }
];

let allocations: RoomAllocation[] = [
  { AllocationID: 'AL_001', StudentID: 'STD_52540763', RoomNo: 'B-205', AcademicYear: '2024', Semester: 'Fall', CheckInDate: '2024-07-01', CheckOutDate: '' },
  { AllocationID: 'AL_002', StudentID: 'STD_98765432', RoomNo: 'A-101', AcademicYear: '2024', Semester: 'Fall', CheckInDate: '2024-07-05', CheckOutDate: '' }
];

let guardians: Guardian[] = [
  { GuardianID: 'G_001', StudentID: 'STD_52540763', GuardianName: 'Rajesh Singh', Relationship: 'Father', Phone: '9998887775', Email: 'rajesh.singh@example.com', Address: '123 Tech Park, Bangalore' },
  { GuardianID: 'G_002', StudentID: 'STD_98765432', GuardianName: 'Anita Kumar', Relationship: 'Mother', Phone: '8887776664', Email: 'anita.kumar@example.com', Address: '456 MG Road, Mumbai' }
];

let staff: Staff[] = [
  { StaffID: 'S_101', FirstName: 'Ramesh', LastName: 'Patel', Phone: '1112223334', JoinDate: '2020-05-10', Salary: 18000, Role: 'Chef', ShiftSlot: 'Morning', CuisineType: 'North Indian', MessID: 'M1', HostelID: null },
  { StaffID: 'S_102', FirstName: 'Suresh', LastName: 'Menon', Phone: '5556667778', JoinDate: '2021-08-15', Salary: 15000, Role: 'Helper', ShiftSlot: 'Evening', CuisineType: null, MessID: 'M2', HostelID: null },
  { StaffID: 'S_103', FirstName: 'Babu', LastName: 'Rao', Phone: '9990001112', JoinDate: '2019-11-20', Salary: 20000, Role: 'Security', ShiftSlot: 'Night', CuisineType: null, MessID: null, HostelID: 'H1' }
];

let messes: Mess[] = [
  { MessID: 'M1', MessName: 'North Indian Mess', MessType: 'Both', Capacity: 300, Location: 'Block A', Phone: '1112223334' },
  { MessID: 'M2', MessName: 'South Indian Mess', MessType: 'Both', Capacity: 250, Location: 'Block B', Phone: '5556667778' }
];

let meals: Meal[] = [
  { MealID: 'ML1', MessID: 'M1', MealName: 'Breakfast Special', Price: 50, Description: 'Idli, Dosa, Sambar' }
];

let schedules: MessSchedule[] = [
  { ScheduleID: 'SCH_001', MessID: 'M1', MealID: 'ML1', DayOfWeek: 'Monday', ItemName: 'Idli Sambar', MealName: 'Breakfast Special', MealTime: 'Breakfast', Description: 'Served hot with coconut chutney', MessName: 'North Indian Mess' },
  { ScheduleID: 'SCH_002', MessID: 'M2', MealID: 'ML1', DayOfWeek: 'Tuesday', ItemName: 'Masala Dosa', MealName: 'Breakfast Special', MealTime: 'Breakfast', Description: 'Served with aloo masala', MessName: 'South Indian Mess' }
];

let enrollments: MessEnrollment[] = [
  { EnrollmentID: 'ENR_001', StudentID: 'STD_52540763', MessID: 'M1', MealPlanType: 'Veg', StartDate: '2024-07-01', EndDate: null, IsActive: 1, StudentName: 'Swati Singh', FirstName: 'Swati', LastName: 'Singh', MessName: 'North Indian Mess' },
  { EnrollmentID: 'ENR_002', StudentID: 'STD_98765432', MessID: 'M2', MealPlanType: 'NonVeg', StartDate: '2024-07-01', EndDate: null, IsActive: 1, StudentName: 'Rahul Kumar', FirstName: 'Rahul', LastName: 'Kumar', MessName: 'South Indian Mess' }
];

let monthlyBills: MonthlyBill[] = [
  { BillID: 'BIL_390655F3', StudentID: 'STD_52540763', BillingMonth: 8, BillingYear: 2025, RoomRentCharges: 1800, MessCharges: 3221.2, OtherCharges: 281.81, TotalAmount: 5303.01, DueDate: '2025-08-15', PaymentStatus: 'PENDING' },
  { BillID: 'BIL_12345678', StudentID: 'STD_98765432', BillingMonth: 8, BillingYear: 2025, RoomRentCharges: 1500, MessCharges: 3000, OtherCharges: 100, TotalAmount: 4600, DueDate: '2025-08-15', PaymentStatus: 'PAID' }
];

let transactions: PaymentTransaction[] = [
  { PaymentID: 'PAY_001', BillID: 'BIL_12345678', StudentID: 'STD_98765432', AmountPaid: 4600, PaymentDate: '2025-08-10', PaymentMode: 'UPI', TransactionReference: 'UPI123456' }
];

let suppliers: Supplier[] = [
  { SupplierID: 'SUP_001', SupplierName: 'Fresh Farms Vegetables', Phone: '9871234560', Email: 'contact@freshfarms.com', Address: 'Market Road, Chennai' },
  { SupplierID: 'SUP_002', SupplierName: 'National Dairy Suppliers', Phone: '9871234561', Email: 'sales@nationaldairy.com', Address: 'Dairy Hub, Bangalore' }
];

let inventoryItems: InventoryItem[] = [
  { ItemID: 'ITM_001', ItemName: 'Onions', Category: 'Vegetables', Unit: 'kg' },
  { ItemID: 'ITM_002', ItemName: 'Milk', Category: 'Dairy', Unit: 'litre' },
  { ItemID: 'ITM_003', ItemName: 'Rice (Basmati)', Category: 'Grains', Unit: 'kg' }
];

let inventoryStock: InventoryStock[] = [
  { MessID: 'M1', ItemID: 'ITM_001', CurrentQuantity: 50, LastUpdatedDate: '2024-07-10', MessName: 'North Indian Mess', ItemName: 'Onions', Category: 'Vegetables', Unit: 'kg' },
  { MessID: 'M1', ItemID: 'ITM_003', CurrentQuantity: 200, LastUpdatedDate: '2024-07-10', MessName: 'North Indian Mess', ItemName: 'Rice (Basmati)', Category: 'Grains', Unit: 'kg' }
];

let procurementEvents: ProcurementEvent[] = [
  { PurchaseID: 'PR_001', MessID: 'M1', SupplierID: 'SUP_001', ItemID: 'ITM_001', Quantity: 100, PurchaseDate: '2024-07-05', UnitPrice: 30, TotalCost: 3000, MessName: 'North Indian Mess', SupplierName: 'Fresh Farms Vegetables', ItemName: 'Onions' },
  { PurchaseID: 'PR_002', MessID: 'M2', SupplierID: 'SUP_002', ItemID: 'ITM_002', Quantity: 50, PurchaseDate: '2024-07-06', UnitPrice: 40, TotalCost: 2000, MessName: 'South Indian Mess', SupplierName: 'National Dairy Suppliers', ItemName: 'Milk' }
];

// Helper
const delayed = <T>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 300));
const success = () => delayed({ message: 'Success (Mock)' });

export const mockApi = {
  getHostels: () => delayed([...hostels]),
  createHostel: (data: Partial<Hostel>) => success(),
  updateHostel: (id: string, data: Partial<Hostel>) => success(),
  deleteHostel: (id: string) => success(),

  getRoomTypes: () => delayed([...roomTypes]),
  createRoomType: (data: Partial<RoomType>) => success(),
  updateRoomType: (type: string, data: Partial<RoomType>) => success(),
  deleteRoomType: (type: string) => success(),

  getRooms: (hostelId?: string) => delayed(hostelId && hostelId !== 'ALL' ? rooms.filter(r => r.HostelID === hostelId) : [...rooms]),
  createRoom: (data: Partial<Room>) => success(),
  updateRoom: (roomNo: string, data: Partial<Room>) => success(),
  deleteRoom: (roomNo: string) => success(),

  getAllocations: (params?: any) => delayed(typeof params === 'string' ? allocations.filter(a => a.RoomNo === params) : params?.student_id ? allocations.filter(a => a.StudentID === params.student_id) : [...allocations]),
  createAllocation: (data: Partial<RoomAllocation>) => success(),
  updateAllocation: (id: string, data: Partial<RoomAllocation>) => success(),
  deleteAllocation: (id: string) => success(),

  getWardens: () => delayed([...wardens]),
  createWarden: (data: Partial<Warden>) => success(),
  updateWarden: (id: string, data: Partial<Warden>) => success(),
  deleteWarden: (id: string) => success(),

  getStudents: () => delayed([...students]),
  getStudent: (id: string) => delayed(students.find(s => s.StudentID === id) || students[0]),
  createStudent: (data: Partial<Student>) => success(),
  updateStudent: (id: string, data: Partial<Student>) => success(),
  deleteStudent: (id: string) => success(),

  getGuardians: (studentId?: string) => delayed(studentId ? guardians.filter(g => g.StudentID === studentId) : [...guardians]),
  createGuardian: (data: Partial<Guardian>) => success(),
  updateGuardian: (id: string, data: Partial<Guardian>) => success(),
  deleteGuardian: (id: string) => success(),

  getStaff: () => delayed([...staff]),
  createStaff: (data: Partial<Staff>) => success(),
  updateStaff: (id: string, data: Partial<Staff>) => success(),
  deleteStaff: (id: string) => success(),

  getMesses: () => delayed([...messes]),
  createMess: (data: Partial<Mess>) => success(),
  updateMess: (id: string, data: Partial<Mess>) => success(),
  deleteMess: (id: string) => success(),

  getMeals: (messId?: string) => delayed([...meals]),
  createMeal: (data: Partial<Meal>) => success(),
  updateMeal: (id: string, data: Partial<Meal>) => success(),
  deleteMeal: (id: string) => success(),

  getMessSchedules: (messId?: string) => delayed([...schedules]),
  createMessSchedule: (data: Partial<MessSchedule>) => success(),
  updateMessSchedule: (id: string, data: Partial<MessSchedule>) => success(),
  deleteMessSchedule: (id: string) => success(),

  getMessEnrollments: (params?: any) => delayed(typeof params === 'string' ? enrollments.filter(e => e.StudentID === params) : (params?.student_id ? enrollments.filter(e => e.StudentID === params.student_id) : [...enrollments])),
  createMessEnrollment: (data: Partial<MessEnrollment>) => success(),
  updateMessEnrollment: (id: string, data: Partial<MessEnrollment>) => success(),
  deleteMessEnrollment: (id: string) => success(),

  getMonthlyBills: (studentId?: string, paymentStatus?: string) => delayed([...monthlyBills]),
  createMonthlyBill: (data: Partial<MonthlyBill>) => success(),
  updateMonthlyBill: (billId: string, data: Partial<MonthlyBill>) => success(),
  deleteMonthlyBill: (billId: string) => success(),

  getPaymentTransactions: (params?: any, paymentMode?: string) => delayed([...transactions]),
  createPaymentTransaction: (data: Partial<PaymentTransaction>) => success(),
  updatePaymentTransaction: (paymentId: string, data: Partial<PaymentTransaction>) => success(),
  deletePaymentTransaction: (paymentId: string) => success(),
  getFinancialStats: () => delayed({
    totalPendingAmount: 428850.0,
    totalOverdueAmount: 428850.0,
    pendingStudentsCount: 66,
    overdueStudentsCount: 66
  }),

  getSuppliers: () => delayed([...suppliers]),
  createSupplier: (data: Partial<Supplier>) => success(),
  updateSupplier: (id: string, data: Partial<Supplier>) => success(),
  deleteSupplier: (id: string) => success(),

  getInventoryItems: (category?: string) => delayed([...inventoryItems]),
  createInventoryItem: (data: Partial<InventoryItem>) => success(),
  updateInventoryItem: (id: string, data: Partial<InventoryItem>) => success(),
  deleteInventoryItem: (id: string) => success(),

  getInventoryStock: (params?: any) => delayed(typeof params === 'string' ? inventoryStock.filter(s => s.MessID === params) : (params?.mess_id ? inventoryStock.filter(s => s.MessID === params.mess_id) : [...inventoryStock])),
  upsertInventoryStock: (data: Partial<InventoryStock>) => success(),
  deleteInventoryStock: (messId: string, itemId: string) => success(),

  getProcurementEvents: (params?: any, supplierId?: string) => delayed(typeof params === 'string' ? procurementEvents.filter(p => p.MessID === params) : (params?.mess_id ? procurementEvents.filter(p => p.MessID === params.mess_id) : [...procurementEvents])),
  createProcurementEvent: (data: Partial<ProcurementEvent>) => success(),
  updateProcurementEvent: (id: string, data: Partial<ProcurementEvent>) => success(),
  deleteProcurementEvent: (id: string) => success(),
};
