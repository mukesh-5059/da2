import React, { useEffect, useState } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const showError = (err: string) => {
    setErrorMessage(err);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  const loadData = async () => {
    try {
      const [hList, rtList, rList, aList, wList, sList, stList] = await Promise.all([
        api.getHostels(),
        api.getRoomTypes(),
        api.getRooms(selectedHostelId),
        api.getAllocations(),
        api.getWardens(),
        api.getStudents(),
        api.getStaff(),
      ]);
      setHostels(hList);
      setRoomTypes(rtList);
      setRooms(rList);
      setAllocations(aList);
      setWardens(wList);
      setStudents(sList);
      setStaff(stList);
    } catch (err: any) {
      showError(err.message || 'Failed to connect to backend REST API');
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedHostelId]);

  // CRUD Handlers for Hostels
  const handleSaveHostel = async (data: Partial<Hostel>, isEdit: boolean) => {
    try {
      if (isEdit && data.HostelID) {
        await api.updateHostel(data.HostelID, data);
        showToast(`Hostel ${data.HostelName} updated successfully.`);
      } else {
        await api.createHostel(data);
        showToast(`Hostel ${data.HostelName} created successfully.`);
      }
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteHostel = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete Hostel ID ${id}?`)) return;
    try {
      await api.deleteHostel(id);
      showToast(`Hostel ${id} deleted.`);
      loadData();
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
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteRoomType = async (type: string) => {
    if (!window.confirm(`Delete Room Type "${type}"?`)) return;
    try {
      await api.deleteRoomType(type);
      showToast(`Room Type ${type} deleted.`);
      loadData();
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
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteRoom = async (roomNo: string) => {
    if (!window.confirm(`Delete Room ${roomNo}?`)) return;
    try {
      await api.deleteRoom(roomNo);
      showToast(`Room ${roomNo} deleted.`);
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // CRUD Handlers for Allocations
  const handleAllocate = async (data: Partial<RoomAllocation>) => {
    try {
      await api.createAllocation(data);
      showToast(`Allocated Room ${data.RoomNo} to student ${data.StudentID}.`);
      loadData();
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
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // CRUD Handlers for Personnel
  const handleSaveStudent = async (data: Partial<Student>, isEdit: boolean) => {
    try {
      if (isEdit && data.StudentID) {
        await api.updateStudent(data.StudentID, data);
        showToast(`Student ${data.FirstName} ${data.LastName} updated.`);
      } else {
        await api.createStudent(data);
        showToast(`Student ${data.FirstName} ${data.LastName} registered.`);
      }
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm(`Delete student record ID ${id}?`)) return;
    try {
      await api.deleteStudent(id);
      showToast(`Student ${id} deleted.`);
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleSaveWarden = async (data: Partial<Warden>, isEdit: boolean) => {
    try {
      if (isEdit && data.WardenID) {
        await api.updateWarden(data.WardenID, data);
        showToast(`Warden ${data.FirstName} ${data.LastName} updated.`);
      } else {
        await api.createWarden(data);
        showToast(`Warden ${data.FirstName} ${data.LastName} created.`);
      }
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteWarden = async (id: string) => {
    if (!window.confirm(`Delete warden ID ${id}?`)) return;
    try {
      await api.deleteWarden(id);
      showToast(`Warden ${id} deleted.`);
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleSaveStaff = async (data: Partial<Staff>, isEdit: boolean) => {
    try {
      if (isEdit && data.StaffID) {
        await api.updateStaff(data.StaffID, data);
        showToast(`Staff member ${data.FirstName} ${data.LastName} updated.`);
      } else {
        await api.createStaff(data);
        showToast(`Staff member ${data.FirstName} ${data.LastName} added.`);
      }
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!window.confirm(`Delete staff member ID ${id}?`)) return;
    try {
      await api.deleteStaff(id);
      showToast(`Staff member ${id} deleted.`);
      loadData();
    } catch (err: any) {
      showError(err.message);
    }
  };

  // Search filter
  const filteredRooms = rooms.filter((r) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      r.RoomNo.toLowerCase().includes(q) ||
      (r.HostelName && r.HostelName.toLowerCase().includes(q)) ||
      r.Type.toLowerCase().includes(q) ||
      r.Status.toLowerCase().includes(q)
    );
  });

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      s.StudentID.toLowerCase().includes(q) ||
      s.FirstName.toLowerCase().includes(q) ||
      s.LastName.toLowerCase().includes(q) ||
      (s.Department && s.Department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="app-container">
      <Sidebar activeTab={activeNavTab} onTabChange={setActiveNavTab} />

      <div className="main-content">
        <Header
          hostels={hostels}
          selectedHostelId={selectedHostelId}
          onSelectHostel={setSelectedHostelId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
              {/* Combined Clean Sub Navigation Pills */}
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
        onRefreshRooms={loadData}
      />
    </div>
  );
};
