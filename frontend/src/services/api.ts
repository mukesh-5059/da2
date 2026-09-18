import { Hostel, RoomType, Room, RoomAllocation, Warden, Student, Guardian, Staff, Mess, Meal, MessSchedule, MessEnrollment, MonthlyBill, PaymentTransaction, Supplier, InventoryItem, InventoryStock, ProcurementEvent } from '../types';

import { mockApi } from './mockApi';

const API_BASE = '/api';

// Set this to true to use dummy data and disconnect from backend.
// Change it to false when the real backend is ready to be tested.
export const USE_MOCK_API = true;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

const realApi = {
  // Hostels
  getHostels: async (): Promise<Hostel[]> => {
    const res = await fetch(`${API_BASE}/hostels`);
    return handleResponse<Hostel[]>(res);
  },
  createHostel: async (data: Partial<Hostel>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/hostels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateHostel: async (id: string, data: Partial<Hostel>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/hostels/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteHostel: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/hostels/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Room Types
  getRoomTypes: async (): Promise<RoomType[]> => {
    const res = await fetch(`${API_BASE}/room-types`);
    return handleResponse<RoomType[]>(res);
  },
  createRoomType: async (data: Partial<RoomType>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/room-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateRoomType: async (type: string, data: Partial<RoomType>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/room-types/${encodeURIComponent(type)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteRoomType: async (type: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/room-types/${encodeURIComponent(type)}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Rooms
  getRooms: async (hostelId?: string): Promise<Room[]> => {
    const url = hostelId && hostelId !== 'ALL' ? `${API_BASE}/rooms?hostel_id=${hostelId}` : `${API_BASE}/rooms`;
    const res = await fetch(url);
    return handleResponse<Room[]>(res);
  },
  createRoom: async (data: Partial<Room>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateRoom: async (roomNo: string, data: Partial<Room>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/rooms/${encodeURIComponent(roomNo)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteRoom: async (roomNo: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/rooms/${encodeURIComponent(roomNo)}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Allocations
  getAllocations: async (roomNo?: string): Promise<RoomAllocation[]> => {
    const url = roomNo ? `${API_BASE}/allocations?room_no=${encodeURIComponent(roomNo)}` : `${API_BASE}/allocations`;
    const res = await fetch(url);
    return handleResponse<RoomAllocation[]>(res);
  },
  createAllocation: async (data: Partial<RoomAllocation>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/allocations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateAllocation: async (id: string, data: Partial<RoomAllocation>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/allocations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteAllocation: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/allocations/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Wardens
  getWardens: async (): Promise<Warden[]> => {
    const res = await fetch(`${API_BASE}/wardens`);
    return handleResponse<Warden[]>(res);
  },
  createWarden: async (data: Partial<Warden>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/wardens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateWarden: async (id: string, data: Partial<Warden>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/wardens/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteWarden: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/wardens/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Students
  getStudents: async (): Promise<Student[]> => {
    const res = await fetch(`${API_BASE}/students`);
    return handleResponse<Student[]>(res);
  },
  createStudent: async (data: Partial<Student>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateStudent: async (id: string, data: Partial<Student>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteStudent: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Guardians
  getGuardians: async (studentId?: string): Promise<Guardian[]> => {
    const url = studentId ? `${API_BASE}/guardians?student_id=${studentId}` : `${API_BASE}/guardians`;
    const res = await fetch(url);
    return handleResponse<Guardian[]>(res);
  },
  createGuardian: async (data: Partial<Guardian>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/guardians`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateGuardian: async (id: string, data: Partial<Guardian>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/guardians/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteGuardian: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/guardians/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Staff
  getStaff: async (): Promise<Staff[]> => {
    const res = await fetch(`${API_BASE}/staff`);
    return handleResponse<Staff[]>(res);
  },
  createStaff: async (data: Partial<Staff>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateStaff: async (id: string, data: Partial<Staff>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteStaff: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/staff/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Mess
  getMesses: async (): Promise<Mess[]> => {
    const res = await fetch(`${API_BASE}/messes`);
    return handleResponse<Mess[]>(res);
  },
  createMess: async (data: Partial<Mess>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/messes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateMess: async (id: string, data: Partial<Mess>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/messes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteMess: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/messes/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Meals
  getMeals: async (messId?: string): Promise<Meal[]> => {
    const url = messId ? `${API_BASE}/meals?mess_id=${messId}` : `${API_BASE}/meals`;
    const res = await fetch(url);
    return handleResponse<Meal[]>(res);
  },
  createMeal: async (data: Partial<Meal>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/meals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateMeal: async (id: string, data: Partial<Meal>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/meals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteMeal: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/meals/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Mess Schedules
  getMessSchedules: async (messId?: string): Promise<MessSchedule[]> => {
    const url = messId ? `${API_BASE}/mess-schedules?mess_id=${messId}` : `${API_BASE}/mess-schedules`;
    const res = await fetch(url);
    return handleResponse<MessSchedule[]>(res);
  },
  createMessSchedule: async (data: Partial<MessSchedule>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/mess-schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateMessSchedule: async (id: string, data: Partial<MessSchedule>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/mess-schedules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteMessSchedule: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/mess-schedules/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Mess Enrollments
  getMessEnrollments: async (studentId?: string): Promise<MessEnrollment[]> => {
    const url = studentId ? `${API_BASE}/mess-enrollments?student_id=${studentId}` : `${API_BASE}/mess-enrollments`;
    const res = await fetch(url);
    return handleResponse<MessEnrollment[]>(res);
  },
  createMessEnrollment: async (data: Partial<MessEnrollment>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/mess-enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateMessEnrollment: async (id: string, data: Partial<MessEnrollment>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/mess-enrollments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteMessEnrollment: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/mess-enrollments/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Monthly Bills
  getMonthlyBills: async (studentId?: string, paymentStatus?: string): Promise<MonthlyBill[]> => {
    const params = new URLSearchParams();
    if (studentId) params.append('student_id', studentId);
    if (paymentStatus) params.append('payment_status', paymentStatus);
    const url = `${API_BASE}/monthly-bills?${params.toString()}`;
    const res = await fetch(url);
    return handleResponse<MonthlyBill[]>(res);
  },
  createMonthlyBill: async (data: Partial<MonthlyBill>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/monthly-bills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateMonthlyBill: async (billId: string, data: Partial<MonthlyBill>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/monthly-bills/${billId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteMonthlyBill: async (billId: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/monthly-bills/${billId}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Payment Transactions
  getPaymentTransactions: async (billId?: string, paymentMode?: string): Promise<PaymentTransaction[]> => {
    const params = new URLSearchParams();
    if (billId) params.append('bill_id', billId);
    if (paymentMode) params.append('payment_mode', paymentMode);
    const url = `${API_BASE}/payment-transactions?${params.toString()}`;
    const res = await fetch(url);
    return handleResponse<PaymentTransaction[]>(res);
  },
  createPaymentTransaction: async (data: Partial<PaymentTransaction>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/payment-transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updatePaymentTransaction: async (paymentId: string, data: Partial<PaymentTransaction>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/payment-transactions/${paymentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deletePaymentTransaction: async (paymentId: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/payment-transactions/${paymentId}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Suppliers
  getSuppliers: async (): Promise<Supplier[]> => {
    const res = await fetch(`${API_BASE}/suppliers`);
    return handleResponse<Supplier[]>(res);
  },
  createSupplier: async (data: Partial<Supplier>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateSupplier: async (id: string, data: Partial<Supplier>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteSupplier: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/suppliers/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Inventory Items
  getInventoryItems: async (category?: string): Promise<InventoryItem[]> => {
    const url = category ? `${API_BASE}/inventory-items?category=${category}` : `${API_BASE}/inventory-items`;
    const res = await fetch(url);
    return handleResponse<InventoryItem[]>(res);
  },
  createInventoryItem: async (data: Partial<InventoryItem>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/inventory-items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateInventoryItem: async (id: string, data: Partial<InventoryItem>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/inventory-items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteInventoryItem: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/inventory-items/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Inventory Stock
  getInventoryStock: async (messId?: string): Promise<InventoryStock[]> => {
    const url = messId ? `${API_BASE}/inventory-stock?mess_id=${messId}` : `${API_BASE}/inventory-stock`;
    const res = await fetch(url);
    return handleResponse<InventoryStock[]>(res);
  },
  upsertInventoryStock: async (data: Partial<InventoryStock>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/inventory-stock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteInventoryStock: async (messId: string, itemId: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/inventory-stock/${messId}/${itemId}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  // Procurement Events
  getProcurementEvents: async (messId?: string, supplierId?: string): Promise<ProcurementEvent[]> => {
    const params = new URLSearchParams();
    if (messId) params.append('mess_id', messId);
    if (supplierId) params.append('supplier_id', supplierId);
    const url = `${API_BASE}/procurement-events?${params.toString()}`;
    const res = await fetch(url);
    return handleResponse<ProcurementEvent[]>(res);
  },
  createProcurementEvent: async (data: Partial<ProcurementEvent>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/procurement-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateProcurementEvent: async (id: string, data: Partial<ProcurementEvent>): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/procurement-events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteProcurementEvent: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/procurement-events/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },
};

export const api = USE_MOCK_API ? mockApi : realApi;
