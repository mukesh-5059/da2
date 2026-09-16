import { Hostel, RoomType, Room, RoomAllocation, Warden, Student, Guardian, Staff } from '../types';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export const api = {
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
};
