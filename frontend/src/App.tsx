import React, { useEffect, useState, useDeferredValue, useMemo } from 'react';
import { api } from './services/api';
import { Hostel, RoomType, Room, RoomAllocation, Warden, Student, Staff } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { RoomTypesTab } from './components/Accommodation/RoomTypesTab';
import { RoomsTab } from './components/Accommodation/RoomsTab';
import { AllocationsTab } from './components/Accommodation/AllocationsTab';
import { RoomDrawer } from './components/Accommodation/RoomDrawer';
import { PersonnelTab } from './components/Personnel/PersonnelTab';
import { Bed, Layers, CheckSquare, AlertCircle, Building2 } from 'lucide-react';
import './styles/index.css';

export const App: React.FC = () => {
  const [activeNavTab, setActiveNavTab] = useState('accommodations');
  const [subTab, setSubTab] = useState<'rooms' | 'roomTypes' | 'allocations'>('rooms');

  const [selectedHostelId, setSelectedHostelId] = useState('ALL');
  const [rawSearchQuery, setRawSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(rawSearchQuery);

  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [allocations, setAllocations] = useState<RoomAllocation[]>([]);
  const [wardens, setWardens] = useState<Warden[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  const [selectedRoomDrawer, setSelectedRoomDrawer] = useState<Room | null>(null);
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

  // 1. Initial Metadata Load (Hostels, Wardens, RoomTypes)
  const loadBaseMetadata = async () => {
    try {
      const [hList, rtList, wList] = await Promise.all([
        api.getHostels(),
        api.getRoomTypes(),
        api.getWardens(),
      ]);
      setHostels(hList);
      setRoomTypes(rtList);
      setWardens(wList);
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
          // If viewing specific hostel, fetch only that hostel's rooms!
          const rList = await api.getRooms(selectedHostelId);
          setRooms(rList);
        } else if (subTab === 'allocations') {
          const [aList, sList] = await Promise.all([api.getAllocations(), api.getStudents()]);
          setAllocations(aList);
          setStudents(sList);
        }
      } else if (activeNavTab === 'personnel') {
        const [sList, stList] = await Promise.all([api.getStudents(), api.getStaff()]);
        setStudents(sList);
        setStaff(stList);
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
  const handleAllocate = async (data: Partial<RoomAllocation>) => {
    try {
      await api.createAllocation(data);
      showToast(`Allocated Room successfully.`);
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

  // Efficient Deferred Search Filters (Zero UI Lag)
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
      <Sidebar activeTab={activeNavTab} onTabChange={setActiveNavTab} />

      <div className="main-content">
        <Header
          hostels={hostels}
          selectedHostelId={selectedHostelId}
          onSelectHostel={setSelectedHostelId}
          searchQuery={rawSearchQuery}
          onSearchChange={setRawSearchQuery}
        />

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
            />
          )}
        </main>
      </div>

      {/* Slide-over Inspection Drawer */}
      <RoomDrawer
        room={selectedRoomDrawer}
        onClose={() => setSelectedRoomDrawer(null)}
        onRefreshRooms={loadTabSpecificData}
      />
    </div>
  );
};
