import { Hostel, RoomType, Room, RoomAllocation, Warden, Student, Guardian, Staff, Mess, Meal, MessSchedule, MessEnrollment, MonthlyBill, PaymentTransaction, FinancialStats, Supplier, InventoryItem, InventoryStock, ProcurementEvent } from '../types';

import { mockApi } from './mockApi';

const API_BASE = '/api';

// Set this to true to use dummy data and disconnect from backend.
// Change it to false when the real backend is ready to be tested.
export const USE_MOCK_API = false;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

const realApi = {
  // Hostels
  getHostels: async (params?: any): Promise<{data: Hostel[], totalRecords: number} | Hostel[]> => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/hostels${qs}`);
    return handleResponse(res);
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
  getRoomTypes: async (params?: any): Promise<{data: RoomType[], totalRecords: number} | RoomType[]> => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/room-types${qs}`);
    return handleResponse(res);
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
  getRooms: async (params?: any): Promise<{data: Room[], totalRecords: number} | Room[]> => {
    let qs = '';
    if (typeof params === 'string') {
        qs = params !== 'ALL' ? `?hostel_id=${params}` : '';
    } else if (params) {
        qs = '?' + new URLSearchParams(params).toString();
    }
    const res = await fetch(`${API_BASE}/rooms${qs}`);
    return handleResponse(res);
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
  getAllocations: async (params?: any): Promise<{data: RoomAllocation[], totalRecords: number} | RoomAllocation[]> => {
    let qs = '';
    if (typeof params === 'string') {
        qs = `?room_no=${encodeURIComponent(params)}`;
    } else if (params) {
        qs = '?' + new URLSearchParams(params).toString();
    }
    const res = await fetch(`${API_BASE}/allocations${qs}`);
    return handleResponse(res);
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
  getWardens: async (params?: any): Promise<{data: Warden[], totalRecords: number} | Warden[]> => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/wardens${qs}`);
    return handleResponse(res);
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
  getStudents: async (params?: any): Promise<{data: Student[], totalRecords: number} | Student[]> => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/students${qs}`);
    return handleResponse(res);
  },
  getStudent: async (id: string): Promise<Student> => {
    const res = await fetch(`${API_BASE}/students/${id}`);
    return handleResponse(res);
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
  getGuardians: async (params?: any): Promise<{data: Guardian[], totalRecords: number} | Guardian[]> => {
    // If it's a string, it's the old studentId param signature. Handle appropriately or rewrite.
    // For now, PureTablesView will pass an object for pagination.
    let qs = '';
    if (typeof params === 'string') {
        qs = `?student_id=${params}`;
    } else if (params) {
        qs = '?' + new URLSearchParams(params).toString();
    }
    const res = await fetch(`${API_BASE}/guardians${qs}`);
    return handleResponse(res);
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
  getStaff: async (params?: any): Promise<{data: Staff[], totalRecords: number} | Staff[]> => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/staff${qs}`);
    return handleResponse(res);
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
  getMesses: async (params?: any): Promise<{data: Mess[], totalRecords: number} | Mess[]> => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/messes${qs}`);
    return handleResponse(res);
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
  getMeals: async (params?: any): Promise<{data: Meal[], totalRecords: number} | Meal[]> => {
    let qs = '';
    if (typeof params === 'string') {
        qs = `?mess_id=${params}`;
    } else if (params) {
        qs = '?' + new URLSearchParams(params).toString();
    }
    const res = await fetch(`${API_BASE}/meals${qs}`);
    return handleResponse(res);
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
  getMessSchedules: async (params?: any): Promise<{data: MessSchedule[], totalRecords: number} | MessSchedule[]> => {
    let qs = '';
    if (typeof params === 'string') {
        qs = `?mess_id=${params}`;
    } else if (params) {
        qs = '?' + new URLSearchParams(params).toString();
    }
    const res = await fetch(`${API_BASE}/mess-schedules${qs}`);
    return handleResponse(res);
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
  getMessEnrollments: async (params?: any): Promise<{data: MessEnrollment[], totalRecords: number} | MessEnrollment[]> => {
    let qs = '';
    if (typeof params === 'string') {
        qs = `?student_id=${params}`;
    } else if (params) {
        qs = '?' + new URLSearchParams(params).toString();
    }
    const res = await fetch(`${API_BASE}/mess-enrollments${qs}`);
    return handleResponse(res);
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
  getMonthlyBills: async (params?: any, paymentStatus?: string): Promise<{data: MonthlyBill[], totalRecords: number} | MonthlyBill[]> => {
    let qs = '';
    if (typeof params === 'string') {
        const p = new URLSearchParams();
        if (params) p.append('student_id', params);
        if (paymentStatus) p.append('payment_status', paymentStatus);
        qs = '?' + p.toString();
    } else if (params) {
        qs = '?' + new URLSearchParams(params).toString();
    }
    const res = await fetch(`${API_BASE}/monthly-bills${qs}`);
    return handleResponse(res);
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
  getPaymentTransactions: async (params?: any, paymentMode?: string): Promise<{data: PaymentTransaction[], totalRecords: number} | PaymentTransaction[]> => {
    let qs = '';
    if (typeof params === 'string') {
        const p = new URLSearchParams();
        if (params) p.append('bill_id', params);
        if (paymentMode) p.append('payment_mode', paymentMode);
        qs = '?' + p.toString();
    } else if (params) {
        qs = '?' + new URLSearchParams(params).toString();
    }
    const res = await fetch(`${API_BASE}/payment-transactions${qs}`);
    return handleResponse(res);
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
  getFinancialStats: async (): Promise<FinancialStats> => {
    const res = await fetch(`${API_BASE}/financials/stats`);
    return handleResponse(res);
  },

  // Suppliers
  getSuppliers: async (params?: any): Promise<{data: Supplier[], totalRecords: number} | Supplier[]> => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${API_BASE}/suppliers${qs}`);
    return handleResponse(res);
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
  getInventoryItems: async (params?: any): Promise<{data: InventoryItem[], totalRecords: number} | InventoryItem[]> => {
    let qs = '';
    if (typeof params === 'string') {
        qs = `?category=${params}`;
    } else if (params) {
        qs = '?' + new URLSearchParams(params).toString();
    }
    const res = await fetch(`${API_BASE}/inventory-items${qs}`);
    return handleResponse(res);
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
  getInventoryStock: async (params?: any): Promise<{data: InventoryStock[], totalRecords: number} | InventoryStock[]> => {
    let qs = '';
    if (typeof params === 'string') {
        qs = `?mess_id=${params}`;
    } else if (params) {
        qs = '?' + new URLSearchParams(params).toString();
    }
    const res = await fetch(`${API_BASE}/inventory-stock${qs}`);
    return handleResponse(res);
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
  getProcurementEvents: async (params?: any, supplierId?: string): Promise<{data: ProcurementEvent[], totalRecords: number} | ProcurementEvent[]> => {
    let qs = '';
    if (typeof params === 'string') {
        const p = new URLSearchParams();
        if (params) p.append('mess_id', params);
        if (supplierId) p.append('supplier_id', supplierId);
        qs = '?' + p.toString();
    } else if (params) {
        qs = '?' + new URLSearchParams(params).toString();
    }
    const res = await fetch(`${API_BASE}/procurement-events${qs}`);
    return handleResponse(res);
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
