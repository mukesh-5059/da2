import React, { useEffect, useState, useDeferredValue, useMemo } from 'react';
import { api } from './services/api';
import { Hostel, RoomType, Room, RoomAllocation, Warden, Student, Staff, Mess, Meal, MessSchedule, MessEnrollment, MonthlyBill, PaymentTransaction, Supplier, InventoryItem, InventoryStock, ProcurementEvent } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { RoomTypesTab } from './components/Accommodation/RoomTypesTab';
import { RoomsTab } from './components/Accommodation/RoomsTab';
import { AllocationsTab } from './components/Accommodation/AllocationsTab';
import { RoomDrawer } from './components/Accommodation/RoomDrawer';
import { PersonnelTab } from './components/Personnel/PersonnelTab';
import { StudentProfileModal } from './components/Personnel/StudentProfileModal';
import { MessProfileModal } from './components/Mess/MessProfileModal';
import { MessTab } from './components/Mess/MessTab';
import { FinancialsTab } from './components/Financials/FinancialsTab';
import { InventoryTab } from './components/Inventory/InventoryTab';
import { PureTablesView } from './components/PureTablesView';
import { Bed, Layers, CheckSquare, AlertCircle, Building2, X } from 'lucide-react';
import './styles/index.css';

export const App: React.FC = () => {
  const [activeNavTab, setActiveNavTab] = useState('accommodations');
  const [subTab, setSubTab] = useState<'rooms' | 'roomTypes' | 'allocations'>('rooms');
  const [viewMode, setViewMode] = useState<'dashboard' | 'pure_tables'>('dashboard');
  const [activeTableIdx, setActiveTableIdx] = useState(0);

  const [selectedHostelId, setSelectedHostelId] = useState('ALL');
  const [rawSearchQuery, setRawSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(rawSearchQuery);

  // Accommodations & Personnel
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [allocations, setAllocations] = useState<RoomAllocation[]>([]);
  const [wardens, setWardens] = useState<Warden[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  // Mess domain state
  const [messes, setMesses] = useState<Mess[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [schedules, setSchedules] = useState<MessSchedule[]>([]);
  const [messEnrollments, setMessEnrollments] = useState<MessEnrollment[]>([]);

  // Financials domain state
  const [bills, setBills] = useState<MonthlyBill[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  // Inventory domain state
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryStock, setInventoryStock] = useState<InventoryStock[]>([]);
  const [procurementEvents, setProcurementEvents] = useState<ProcurementEvent[]>([]);

  // Modals & Drawers state
  const [selectedRoomDrawer, setSelectedRoomDrawer] = useState<Room | null>(null);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [editingStudentFromModal, setEditingStudentFromModal] = useState<Student | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const showError = (err: string) => {
    setErrorMessage(err);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  const handleSelectStudentById = async (studentId: string) => {
    let s = students.find((st) => (st.StudentID || (st as any).student_id) === studentId);
    if (!s) {
      try {
        const fetched = await api.getStudent(studentId);
        if (fetched && (fetched.StudentID || (fetched as any).student_id)) {
          s = fetched;
        }
      } catch (err) {
        console.error('Failed to fetch student profile', err);
      }
    }
    if (s) {
      setSelectedStudentForProfile(s);
    } else {
      setSelectedStudentForProfile({ StudentID: studentId, FirstName: studentId, LastName: '' });
    }
  };

  const [selectedMessForProfile, setSelectedMessForProfile] = useState<Mess | null>(null);
  const handleSelectMessById = async (messId: string) => {
    // Try to find the mess from global if loaded, otherwise fetch from API
    let m = messes.find(x => x.MessID === messId || (x as any).mess_id === messId);
    if (!m) {
      try {
        const allMessesRes = await api.getMesses();
        const allMesses = (Array.isArray(allMessesRes) ? allMessesRes : (allMessesRes as any)?.data) || [];
        m = (allMesses as Mess[]).find(x => x.MessID === messId || (x as any).mess_id === messId);
      } catch (e) {
        console.error('Failed to load mess details');
      }
    }
    if (m) {
      setSelectedMessForProfile(m);
    }
  };

  const handleSelectRoomByNo = (roomNo: string) => {
    const r = rooms.find((rm) => rm.RoomNo === roomNo);
    if (r) {
      setSelectedRoomDrawer(r);
    } else {
      setSelectedRoomDrawer({
        RoomNo: roomNo,
        FloorNo: 1,
        Status: 'Occupied',
        Type: 'Standard',
        HostelID: 'HST',
      } as Room);
    }
  };

  const unwrap = (res: any) => res?.data || res || [];

  // 1. Initial Metadata Load (Hostels, Wardens, RoomTypes)
  const loadBaseMetadata = async () => {
    try {
      const [hList, rtList, wList] = await Promise.all([
        api.getHostels(),
        api.getRoomTypes(),
        api.getWardens(),
      ]);
      setHostels(unwrap(hList));
      setRoomTypes(unwrap(rtList));
      setWardens(unwrap(wList));
    } catch (err: any) {
      showError(err.message || 'Failed to connect to backend REST API');
    }
  };

  useEffect(() => {
    loadBaseMetadata();
  }, []);

  // 2. Scoped Data Loading based on active tab & hostel selection
  const loadTabSpecificData = async () => {
    setLoading(true);
    try {
      if (activeNavTab === 'accommodations') {
        if (subTab === 'rooms') {
          const rList = await api.getRooms(selectedHostelId);
          setRooms(unwrap(rList));
        } else if (subTab === 'allocations') {
          const [rList, sList] = await Promise.all([api.getRooms(), api.getStudents({ limit: 100 })]);
          setRooms(unwrap(rList));
          setStudents(unwrap(sList));
        }
      } else if (activeNavTab === 'personnel') {
        const stList = await api.getStaff();
        setStaff(unwrap(stList));
      } else if (activeNavTab === 'mess') {
        const [mList, mlList, schList, sList] = await Promise.all([
          api.getMesses(),
          api.getMeals(),
          api.getMessSchedules(),
          api.getStudents({ limit: 100 }),
        ]);
        setMesses(unwrap(mList));
        setMeals(unwrap(mlList));
        setSchedules(unwrap(schList));
        setStudents(unwrap(sList));
      } else if (activeNavTab === 'inventory') {
        const [supList, itmList, mList] = await Promise.all([
          api.getSuppliers(),
          api.getInventoryItems(),
          api.getMesses(),
        ]);
        setSuppliers(unwrap(supList));
        setInventoryItems(unwrap(itmList));
        setMesses(unwrap(mList));
      } else if (activeNavTab === 'financials') {
        const sList = await api.getStudents({ limit: 100 });
        setStudents(unwrap(sList));
      }
    } catch (err: any) {
      showError(err.message || 'Failed to load tab data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTabSpecificData();
  }, [activeNavTab, subTab, selectedHostelId]);

  // CRUD Handlers for Hostels
  const handleSaveHostel = async (data: Partial<Hostel>, isEdit: boolean) => {
    try {
      if (isEdit && (data.HostelID || (data as any).hostel_id)) {
        const id = data.HostelID || (data as any).hostel_id;
        await api.updateHostel(id, data);
        showToast(`Hostel updated successfully.`);
      } else {
        await api.createHostel(data);
        showToast(`Hostel created successfully.`);
      }
      loadBaseMetadata();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteHostel = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete Hostel ID ${id}?`)) return;
    try {
      await api.deleteHostel(id);
      showToast(`Hostel ${id} deleted.`);
      loadBaseMetadata();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // CRUD Handlers for Room Types
  const handleSaveRoomType = async (data: Partial<RoomType>, isEdit: boolean) => {
    try {
      if (isEdit && data.Type) {
        await api.updateRoomType(data.Type, data);
        showToast(`Room Type ${data.Type} updated.`);
      } else {
        await api.createRoomType(data);
        showToast(`Room Type ${data.Type} created.`);
      }
      loadBaseMetadata();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteRoomType = async (type: string) => {
    if (!window.confirm(`Delete Room Type "${type}"?`)) return;
    try {
      await api.deleteRoomType(type);
      showToast(`Room Type ${type} deleted.`);
      loadBaseMetadata();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // CRUD Handlers for Rooms
  const handleSaveRoom = async (data: Partial<Room>, isEdit: boolean) => {
    try {
      if (isEdit && data.RoomNo) {
        await api.updateRoom(data.RoomNo, data);
        showToast(`Room ${data.RoomNo} updated.`);
      } else {
        await api.createRoom(data);
        showToast(`Room ${data.RoomNo} created.`);
      }
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteRoom = async (roomNo: string) => {
    if (!window.confirm(`Delete Room ${roomNo}?`)) return;
    try {
      await api.deleteRoom(roomNo);
      showToast(`Room ${roomNo} deleted.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // CRUD Handlers for Allocations
  const handleAllocate = async (data: Partial<RoomAllocation>, isEdit?: boolean) => {
    try {
      const id = data.AllocationID || (data as any).allocation_id;
      if (isEdit && id) {
        await api.updateAllocation(id, data);
        showToast(`Allocation updated successfully.`);
      } else {
        await api.createAllocation(data);
        showToast(`Allocated Room successfully.`);
      }
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteAllocation = async (allocId: string) => {
    if (!window.confirm(`Delete allocation record ID ${allocId}?`)) return;
    try {
      await api.deleteAllocation(allocId);
      showToast(`Allocation ${allocId} deleted.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleCheckOut = async (allocId: string) => {
    if (!window.confirm(`Check out resident for Allocation ID ${allocId}?`)) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      await api.updateAllocation(allocId, { CheckOutDate: today });
      showToast(`Resident checked out successfully.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // CRUD Handlers for Personnel
  const handleSaveStudent = async (data: Partial<Student>, isEdit: boolean) => {
    try {
      const id = data.StudentID || (data as any).student_id;
      if (isEdit && id) {
        await api.updateStudent(id, data);
        showToast(`Student updated.`);
      } else {
        await api.createStudent(data);
        showToast(`Student registered.`);
      }
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm(`Delete student record ID ${id}?`)) return;
    try {
      await api.deleteStudent(id);
      showToast(`Student ${id} deleted.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleSaveWarden = async (data: Partial<Warden>, isEdit: boolean) => {
    try {
      const id = data.WardenID || (data as any).warden_id;
      if (isEdit && id) {
        await api.updateWarden(id, data);
        showToast(`Warden updated.`);
      } else {
        await api.createWarden(data);
        showToast(`Warden created.`);
      }
      loadBaseMetadata();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteWarden = async (id: string) => {
    if (!window.confirm(`Delete warden ID ${id}?`)) return;
    try {
      await api.deleteWarden(id);
      showToast(`Warden ${id} deleted.`);
      loadBaseMetadata();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleSaveStaff = async (data: Partial<Staff>, isEdit: boolean) => {
    try {
      const id = data.StaffID || (data as any).staff_id;
      if (isEdit && id) {
        await api.updateStaff(id, data);
        showToast(`Staff member updated.`);
      } else {
        await api.createStaff(data);
        showToast(`Staff member added.`);
      }
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!window.confirm(`Delete staff member ID ${id}?`)) return;
    try {
      await api.deleteStaff(id);
      showToast(`Staff member ${id} deleted.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // CRUD Handlers for Mess
  const handleSaveMess = async (data: Partial<Mess>, isEdit: boolean) => {
    try {
      const id = data.MessID || (data as any).mess_id;
      if (isEdit && id) {
        await api.updateMess(id, data);
        showToast(`Mess facility updated.`);
      } else {
        await api.createMess(data);
        showToast(`Mess facility created.`);
      }
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteMess = async (id: string) => {
    if (!window.confirm(`Delete Mess facility ID ${id}?`)) return;
    try {
      await api.deleteMess(id);
      showToast(`Mess facility deleted.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleSaveMeal = async (data: Partial<Meal>, isEdit: boolean) => {
    try {
      const id = data.MealID || (data as any).meal_id;
      if (isEdit && id) {
        await api.updateMeal(id, data);
        showToast(`Meal item updated.`);
      } else {
        await api.createMeal(data);
        showToast(`Meal item added to catalog.`);
      }
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!window.confirm(`Delete meal offering ID ${id}?`)) return;
    try {
      await api.deleteMeal(id);
      showToast(`Meal offering deleted.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleSaveMessSchedule = async (data: Partial<MessSchedule>, isEdit?: boolean) => {
    try {
      const id = data.ScheduleID || (data as any).schedule_id;
      if (isEdit && id) {
        await api.updateMessSchedule(id, data);
        showToast(`Updated schedule item.`);
      } else {
        await api.createMessSchedule(data);
        showToast(`Added schedule item.`);
      }
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteMessSchedule = async (id: string) => {
    try {
      await api.deleteMessSchedule(id);
      showToast(`Removed schedule item.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleSaveMessEnrollment = async (data: Partial<MessEnrollment>, isEdit?: boolean) => {
    try {
      const id = data.EnrollmentID || (data as any).enrollment_id;
      if (isEdit && id) {
        await api.updateMessEnrollment(id, data);
        showToast(`Updated mess enrollment.`);
      } else {
        await api.createMessEnrollment(data);
        showToast(`Enrolled student into mess.`);
      }
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteMessEnrollment = async (id: string) => {
    if (!window.confirm(`Cancel mess enrollment ID ${id}?`)) return;
    try {
      await api.deleteMessEnrollment(id);
      showToast(`Mess enrollment cancelled.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // CRUD Handlers for Financials
  const handleSaveBill = async (data: Partial<MonthlyBill>, isEdit?: boolean) => {
    try {
      const id = data.BillID || (data as any).bill_id;
      if (isEdit && id) {
        await api.updateMonthlyBill(id, data);
        showToast(`Updated bill ${id} successfully.`);
      } else {
        await api.createMonthlyBill(data);
        showToast(`Generated monthly bill successfully.`);
      }
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleUpdateBillStatus = async (billId: string, status: 'PAID' | 'PENDING' | 'OVERDUE') => {
    try {
      const existing = bills.find((b) => (b.BillID || (b as any).bill_id) === billId);
      if (existing) {
        await api.updateMonthlyBill(billId, { ...existing, PaymentStatus: status });
        showToast(`Updated bill ${billId} status to ${status}.`);
        loadTabSpecificData();
      }
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteBill = async (billId: string) => {
    if (!window.confirm(`Delete bill ${billId}?`)) return;
    try {
      await api.deleteMonthlyBill(billId);
      showToast(`Deleted bill ${billId}.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleRecordPayment = async (data: Partial<PaymentTransaction>, isEdit?: boolean) => {
    try {
      const id = data.PaymentID || (data as any).payment_id;
      if (isEdit && id) {
        await api.updatePaymentTransaction(id, data);
        showToast(`Payment transaction updated.`);
      } else {
        await api.createPaymentTransaction(data);
        showToast(`Recorded payment transaction successfully.`);
      }
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeletePaymentTransaction = async (paymentId: string) => {
    if (!window.confirm(`Delete payment transaction ${paymentId}?`)) return;
    try {
      await api.deletePaymentTransaction(paymentId);
      showToast(`Payment transaction deleted.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // CRUD Handlers for Inventory
  const handleSaveSupplier = async (data: Partial<Supplier>, isEdit: boolean) => {
    try {
      const id = data.SupplierID;
      if (isEdit && id) {
        await api.updateSupplier(id, data);
        showToast(`Supplier updated successfully.`);
      } else {
        await api.createSupplier(data);
        showToast(`Supplier registered successfully.`);
      }
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!window.confirm(`Delete supplier ID ${id}?`)) return;
    try {
      await api.deleteSupplier(id);
      showToast(`Supplier ${id} deleted.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleSaveInventoryItem = async (data: Partial<InventoryItem>, isEdit: boolean) => {
    try {
      const id = data.ItemID;
      if (isEdit && id) {
        await api.updateInventoryItem(id, data);
        showToast(`Inventory item updated.`);
      } else {
        await api.createInventoryItem(data);
        showToast(`Inventory item added.`);
      }
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteInventoryItem = async (id: string) => {
    if (!window.confirm(`Delete item ID ${id}?`)) return;
    try {
      await api.deleteInventoryItem(id);
      showToast(`Item ${id} deleted.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleSaveInventoryStock = async (data: Partial<InventoryStock>) => {
    try {
      await api.upsertInventoryStock(data);
      showToast(`Stock level updated.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteInventoryStock = async (messId: string, itemId: string) => {
    if (!window.confirm(`Delete stock entry?`)) return;
    try {
      await api.deleteInventoryStock(messId, itemId);
      showToast(`Stock entry removed.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleSaveProcurementEvent = async (data: Partial<ProcurementEvent>, isEdit: boolean) => {
    try {
      const id = data.PurchaseID;
      if (isEdit && id) {
        await api.updateProcurementEvent(id, data);
        showToast(`Procurement record updated.`);
      } else {
        await api.createProcurementEvent(data);
        showToast(`Procurement record created.`);
      }
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteProcurementEvent = async (id: string) => {
    if (!window.confirm(`Delete procurement record ${id}?`)) return;
    try {
      await api.deleteProcurementEvent(id);
      showToast(`Procurement record deleted.`);
      loadTabSpecificData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // Deferred Search Filters
  const filteredRooms = useMemo(() => {
    const q = deferredSearchQuery.toLowerCase().trim();
    if (!q) return rooms;
    return rooms.filter((r) => {
      const rNo = r.RoomNo || (r as any).room_no || '';
      const hName = r.HostelName || (r as any).hostel_name || '';
      const rType = r.Type || (r as any).type_name || '';
      const rStatus = r.Status || (r as any).status || '';
      return (
        rNo.toLowerCase().includes(q) ||
        hName.toLowerCase().includes(q) ||
        rType.toLowerCase().includes(q) ||
        rStatus.toLowerCase().includes(q)
      );
    });
  }, [rooms, deferredSearchQuery]);

  const filteredStudents = useMemo(() => {
    const q = deferredSearchQuery.toLowerCase().trim();
    if (!q) return students;
    return students.filter((s) => {
      const sId = s.StudentID || (s as any).student_id || '';
      const fName = s.FirstName || (s as any).name || '';
      const lName = s.LastName || '';
      const dept = s.Department || (s as any).department || '';
      return (
        sId.toLowerCase().includes(q) ||
        fName.toLowerCase().includes(q) ||
        lName.toLowerCase().includes(q) ||
        dept.toLowerCase().includes(q)
      );
    });
  }, [students, deferredSearchQuery]);

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeNavTab} 
        onTabChange={setActiveNavTab} 
        viewMode={viewMode}
        activeTableIdx={activeTableIdx}
        onTableTabChange={setActiveTableIdx}
      />

      <div className="main-content">
        <Header
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
        />

        {viewMode === 'pure_tables' ? (
          <main className="page-body" style={{ padding: 0 }}>
            <PureTablesView 
              activeTableIdx={activeTableIdx} 
              onTabChange={setActiveTableIdx} 
            />
          </main>
        ) : (
          <main className="page-body">
            {/* Feedback Banners */}
          {toastMessage && (
            <div style={{ background: '#10b981', color: '#fff', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
              <CheckSquare size={18} /> {toastMessage}
            </div>
          )}

          {errorMessage && (
            <div style={{ background: '#ef4444', color: '#fff', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
              <AlertCircle size={18} /> {errorMessage}
            </div>
          )}

          {activeNavTab === 'accommodations' && (
            <>
              {/* Combined Sub Navigation Pills */}
              <div className="tab-pills">
                <button
                  className={`tab-pill ${subTab === 'rooms' ? 'active' : ''}`}
                  onClick={() => setSubTab('rooms')}
                >
                  <Building2 size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Hostels & Rooms ({hostels.length} Hostels • {filteredRooms.length} Rooms)
                </button>
                <button
                  className={`tab-pill ${subTab === 'roomTypes' ? 'active' : ''}`}
                  onClick={() => setSubTab('roomTypes')}
                >
                  <Layers size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Room Categories ({roomTypes.length})
                </button>
                <button
                  className={`tab-pill ${subTab === 'allocations' ? 'active' : ''}`}
                  onClick={() => setSubTab('allocations')}
                >
                  <CheckSquare size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Allocations History ({allocations.length})
                </button>
              </div>

              {/* Sub Tab View Rendering */}
              {subTab === 'rooms' && (
                <RoomsTab
                  rooms={filteredRooms}
                  roomTypes={roomTypes}
                  hostels={hostels}
                  wardens={wardens}
                  selectedHostelId={selectedHostelId}
                  onSelectHostelScope={setSelectedHostelId}
                  onSaveRoom={handleSaveRoom}
                  onDeleteRoom={handleDeleteRoom}
                  onSaveHostel={handleSaveHostel}
                  onDeleteHostel={handleDeleteHostel}
                  onSelectRoomDrawer={setSelectedRoomDrawer}
                  loading={loading}
                />
              )}

              {subTab === 'roomTypes' && (
                <RoomTypesTab
                  roomTypes={roomTypes}
                  onSaveRoomType={handleSaveRoomType}
                  onDeleteRoomType={handleDeleteRoomType}
                />
              )}

              {subTab === 'allocations' && (
                <AllocationsTab
                  allocations={allocations}
                  students={students}
                  rooms={rooms}
                  onAllocate={handleAllocate}
                  onCheckOut={handleCheckOut}
                  onDeleteAllocation={handleDeleteAllocation}
                  onSelectStudent={handleSelectStudentById}
                  onSelectRoom={handleSelectRoomByNo}
                />
              )}
            </>
          )}

          {activeNavTab === 'personnel' && (
            <PersonnelTab
              students={filteredStudents}
              wardens={wardens}
              staff={staff}
              hostels={hostels}
              onSaveStudent={handleSaveStudent}
              onDeleteStudent={handleDeleteStudent}
              onSaveWarden={handleSaveWarden}
              onDeleteWarden={handleDeleteWarden}
              onSaveStaff={handleSaveStaff}
              onDeleteStaff={handleDeleteStaff}
              onSelectStudent={setSelectedStudentForProfile}
            />
          )}

          {activeNavTab === 'mess' && (
            <MessTab
              messes={messes}
              meals={meals}
              schedules={schedules}
              enrollments={messEnrollments}
              students={students}
              onSaveMess={handleSaveMess}
              onDeleteMess={handleDeleteMess}
              onSaveEnrollment={handleSaveMessEnrollment}
              onDeleteEnrollment={handleDeleteMessEnrollment}
              onSelectStudent={handleSelectStudentById}
            />
          )}

          {activeNavTab === 'inventory' && (
            <InventoryTab
              messes={messes}
              suppliers={suppliers}
              inventoryItems={inventoryItems}
              inventoryStock={inventoryStock}
              procurementEvents={procurementEvents}
              onSaveSupplier={handleSaveSupplier}
              onDeleteSupplier={handleDeleteSupplier}
              onSaveInventoryItem={handleSaveInventoryItem}
              onDeleteInventoryItem={handleDeleteInventoryItem}
              onSaveStock={handleSaveInventoryStock}
              onDeleteStock={handleDeleteInventoryStock}
              onSaveProcurement={handleSaveProcurementEvent}
              onDeleteProcurement={handleDeleteProcurementEvent}
            />
          )}

          {activeNavTab === 'financials' && (
            <FinancialsTab
              bills={bills}
              transactions={transactions}
              students={students}
              onSaveBill={handleSaveBill}
              onUpdateBillStatus={handleUpdateBillStatus}
              onDeleteBill={handleDeleteBill}
              onRecordPayment={handleRecordPayment}
              onDeletePaymentTransaction={handleDeletePaymentTransaction}
              onSelectStudent={handleSelectStudentById}
            />
          )}
        </main>
        )}
      </div>

      {/* Room Detail Modal */}
      <RoomDrawer
        room={selectedRoomDrawer}
        onClose={() => setSelectedRoomDrawer(null)}
        onRefreshRooms={loadTabSpecificData}
        onSelectStudent={handleSelectStudentById}
        onDeleteRoom={handleDeleteRoom}
      />

      {/* Student Profile Modal */}
      {selectedStudentForProfile && (
        <StudentProfileModal
          student={selectedStudentForProfile}
          onClose={() => setSelectedStudentForProfile(null)}
          onEditStudent={(s) => {
            setSelectedStudentForProfile(null);
            setEditingStudentFromModal(s);
          }}
          onDeleteStudent={handleDeleteStudent}
          onSelectRoom={handleSelectRoomByNo}
          onSelectMess={handleSelectMessById}
        />
      )}

      {/* Global Mess Profile Modal */}
      {selectedMessForProfile && (
        <MessProfileModal
          mess={selectedMessForProfile}
          onClose={() => setSelectedMessForProfile(null)}
        />
      )}

      {/* Standalone Edit Student Modal */}
      {editingStudentFromModal && (
        <div className="modal-backdrop" style={{ zIndex: 1000 }} onClick={() => setEditingStudentFromModal(null)}>
          <div className="modal-card" style={{ width: '560px', maxWidth: '95vw', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                Edit Student Profile ({editingStudentFromModal.StudentID || (editingStudentFromModal as any).student_id})
              </h3>
              <button onClick={() => setEditingStudentFromModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              await handleSaveStudent(editingStudentFromModal, true);
              setEditingStudentFromModal(null);
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingStudentFromModal.FirstName || (editingStudentFromModal as any).name || ''}
                    onChange={(e) => setEditingStudentFromModal({ ...editingStudentFromModal, FirstName: e.target.value, name: e.target.value } as any)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingStudentFromModal.LastName || ''}
                    onChange={(e) => setEditingStudentFromModal({ ...editingStudentFromModal, LastName: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editingStudentFromModal.Email || (editingStudentFromModal as any).email || ''}
                    onChange={(e) => setEditingStudentFromModal({ ...editingStudentFromModal, Email: e.target.value, email: e.target.value } as any)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingStudentFromModal.Phone || (editingStudentFromModal as any).phone || ''}
                    onChange={(e) => setEditingStudentFromModal({ ...editingStudentFromModal, Phone: e.target.value, phone: e.target.value } as any)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingStudentFromModal.Department || (editingStudentFromModal as any).department || ''}
                    onChange={(e) => setEditingStudentFromModal({ ...editingStudentFromModal, Department: e.target.value, department: e.target.value } as any)}
                  />
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    className="form-select"
                    value={editingStudentFromModal.BloodGroup || (editingStudentFromModal as any).blood_group || 'O+'}
                    onChange={(e) => setEditingStudentFromModal({ ...editingStudentFromModal, BloodGroup: e.target.value, blood_group: e.target.value } as any)}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingStudentFromModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Student Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
