import React, { useState } from 'react';
import { Room, RoomType, Hostel, Warden } from '../../types';
import { Plus, Edit2, Trash2, LayoutGrid, Table, Eye, Layers, ArrowLeft, Building2, MapPin, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';

interface RoomsTabProps {
  rooms: Room[];
  roomTypes: RoomType[];
  hostels: Hostel[];
  wardens: Warden[];
  selectedHostelId: string;
  onSelectHostelScope: (hostelId: string) => void;
  onSaveRoom: (data: Partial<Room>, isEdit: boolean) => Promise<void>;
  onDeleteRoom: (roomNo: string) => Promise<void>;
  onSaveHostel: (data: Partial<Hostel>, isEdit: boolean) => Promise<void>;
  onDeleteHostel: (id: string) => Promise<void>;
  onSelectRoomDrawer: (room: Room) => void;
  loading?: boolean;
}

export const RoomsTab: React.FC<RoomsTabProps> = ({
  rooms,
  roomTypes,
  hostels,
  wardens,
  selectedHostelId,
  onSelectHostelScope,
  onSaveRoom,
  onDeleteRoom,
  onSaveHostel,
  onDeleteHostel,
  onSelectRoomDrawer,
  loading = false,
}) => {
  const [viewMode, setViewMode] = useState<'matrix' | 'table'>('matrix');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Room Modal State
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);
  const [roomFormData, setRoomFormData] = useState<Partial<Room>>({
    RoomNo: '',
    FloorNo: 1,
    Status: 'Vacant',
    Type: roomTypes[0]?.Type || 'Single',
    HostelID: hostels[0]?.HostelID || (hostels[0] as any)?.hostel_id || '',
  });

  // Hostel Modal State
  const [showHostelModal, setShowHostelModal] = useState(false);
  const [editingHostel, setEditingHostel] = useState<Partial<Hostel> | null>(null);
  const [hostelFormData, setHostelFormData] = useState<Partial<Hostel>>({
    HostelID: '',
    HostelName: '',
    HostelType: 'Boys',
    TotalFloors: 4,
    TotalRooms: 40,
    Location: '',
    WardenID: '',
  });

  // Handlers for Room Modal
  const handleOpenAddRoom = () => {
    setEditingRoom(null);
    setRoomFormData({
      RoomNo: '',
      FloorNo: 1,
      Status: 'Vacant',
      Type: roomTypes[0]?.Type || 'Single',
      HostelID: selectedHostelId !== 'ALL' ? selectedHostelId : (hostels[0]?.HostelID || (hostels[0] as any)?.hostel_id || ''),
    });
    setShowRoomModal(true);
  };

  const handleOpenEditRoom = (room: Room) => {
    setEditingRoom(room);
    setRoomFormData(room);
    setShowRoomModal(true);
  };

  const handleSubmitRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveRoom(roomFormData, !!editingRoom);
    setShowRoomModal(false);
  };

  // Handlers for Hostel Modal
  const handleOpenAddHostel = () => {
    setEditingHostel(null);
    setHostelFormData({
      HostelID: `HST_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      HostelName: '',
      HostelType: 'Boys',
      TotalFloors: 4,
      TotalRooms: 40,
      Location: '',
      WardenID: wardens[0]?.WardenID || (wardens[0] as any)?.warden_id || '',
    });
    setShowHostelModal(true);
  };

  const handleOpenEditHostel = (hostel: Hostel) => {
    setEditingHostel(hostel);
    setHostelFormData({
      HostelID: hostel.HostelID || (hostel as any).hostel_id,
      HostelName: hostel.HostelName || (hostel as any).name,
      HostelType: (hostel.HostelType || (hostel as any).gender_type === 'M' ? 'Boys' : 'Girls') as any,
      TotalFloors: hostel.TotalFloors || 4,
      TotalRooms: hostel.TotalRooms || (hostel as any).capacity || 40,
      Location: hostel.Location || '',
      WardenID: hostel.WardenID || (hostel as any).warden_id || '',
    });
    setShowHostelModal(true);
  };

  const handleSubmitHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveHostel(hostelFormData, !!editingHostel);
    setShowHostelModal(false);
  };

  const selectedHostelObj = hostels.find((h) => (h.HostelID || (h as any).hostel_id) === selectedHostelId);

  // Group rooms by Floor for matrix
  const floorGroups = rooms.reduce((acc, room) => {
    const floorNo = room.FloorNo !== undefined ? room.FloorNo : (room as any).floor_no || 1;
    const floorKey = `Floor ${floorNo}`;
    if (!acc[floorKey]) acc[floorKey] = [];
    acc[floorKey].push(room);
    return acc;
  }, {} as Record<string, Room[]>);

  // Pagination for Data Grid
  const totalPages = Math.ceil(rooms.length / pageSize) || 1;
  const paginatedRooms = rooms.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      {/* 1. ALL HOSTELS OVERVIEW */}
      {selectedHostelId === 'ALL' ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Hostels & Room Facilities</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Select any hostel facility to inspect its room matrix or manage hostel settings
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleOpenAddHostel}>
              <Plus size={16} />
              Add Hostel Facility
            </button>
          </div>

          <div className="grid-cols-3">
            {hostels.map((hostel) => {
              const hId = hostel.HostelID || (hostel as any).hostel_id;
              const hName = hostel.HostelName || (hostel as any).name;
              const hType = hostel.HostelType || ((hostel as any).gender_type === 'M' ? 'Boys' : 'Girls');
              const hLocation = hostel.Location || (hostel as any).location || 'Campus Main';
              const hWarden = hostel.WardenName || (hostel as any).warden_name || hostel.WardenID || (hostel as any).warden_id || 'Unassigned';
              const hFloors = hostel.TotalFloors || 4;
              const hTotalRooms = hostel.TotalRooms || (hostel as any).capacity || 40;

              const hostelRooms = rooms.filter((r) => (r.HostelID || (r as any).hostel_id) === hId);
              const vacantCount = hostelRooms.filter((r) => (r.Status || (r as any).status) === 'Vacant' || (r as any).status === 'AVAILABLE').length;
              const occupiedCount = hostelRooms.filter((r) => (r.Status || (r as any).status) === 'Occupied' || (r as any).status === 'OCCUPIED').length;
              const maintCount = hostelRooms.filter((r) => (r.Status || (r as any).status) === 'UnderMaintenance' || (r as any).status === 'MAINTENANCE').length;

              return (
                <div
                  key={hId}
                  className="card"
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'var(--accent-glow)', padding: '10px', borderRadius: '12px' }}>
                          <Building2 size={24} style={{ color: 'var(--accent-primary)' }} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{hName}</h3>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            ID: {hId}
                          </span>
                        </div>
                      </div>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: hType === 'Boys' || hType === 'M' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(236, 72, 153, 0.15)',
                          color: hType === 'Boys' || hType === 'M' ? '#60a5fa' : '#f472b6',
                          border: `1px solid ${hType === 'Boys' || hType === 'M' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`,
                        }}
                      >
                        {hType} Hostel
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={16} />
                        <span>{hLocation}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserCheck size={16} />
                        <span>Warden: <strong style={{ color: 'var(--text-primary)' }}>{hWarden}</strong></span>
                      </div>
                    </div>

                    {/* Occupancy Breakdown */}
                    <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '8px', fontWeight: 600 }}>
                        <span>Capacity Standard</span>
                        <span style={{ color: 'var(--text-primary)' }}>{hFloors} Floors • {hTotalRooms} Rooms</span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
                        <span style={{ color: '#10b981', fontWeight: 600 }}>🟢 {vacantCount} Vacant</span>
                        <span style={{ color: '#6366f1', fontWeight: 600 }}>🔵 {occupiedCount} Occupied</span>
                        {maintCount > 0 && <span style={{ color: '#f59e0b', fontWeight: 600 }}>🟡 {maintCount} Maint</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditHostel(hostel);
                        }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHostel(hId);
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => onSelectHostelScope(hId)}
                    >
                      Inspect Matrix →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 2. SPECIFIC HOSTEL ROOM MATRIX VIEW */
        <div>
          {/* Breadcrumb Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <button
                onClick={() => onSelectHostelScope('ALL')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px',
                }}
              >
                <ArrowLeft size={16} /> Back to All Hostels
              </button>

              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={24} style={{ color: 'var(--accent-primary)' }} />
                {selectedHostelObj?.HostelName || (selectedHostelObj as any)?.name}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {selectedHostelObj?.HostelType || ((selectedHostelObj as any)?.gender_type === 'M' ? 'Boys' : 'Girls')} Hostel • Warden: {selectedHostelObj?.WardenName || (selectedHostelObj as any)?.warden_name || 'Unassigned'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setViewMode('matrix')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: viewMode === 'matrix' ? 'var(--accent-primary)' : 'transparent',
                    color: viewMode === 'matrix' ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  <LayoutGrid size={14} /> Floor Matrix
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: viewMode === 'table' ? 'var(--accent-primary)' : 'transparent',
                    color: viewMode === 'table' ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  <Table size={14} /> Data Grid
                </button>
              </div>

              <button className="btn btn-primary" onClick={handleOpenAddRoom}>
                <Plus size={16} />
                Add Room
              </button>
            </div>
          </div>

          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              Loading rooms from backend...
            </div>
          ) : viewMode === 'matrix' ? (
            <div>
              {Object.keys(floorGroups).length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No rooms added to this hostel yet. Click "+ Add Room" to create one.
                </div>
              ) : (
                Object.entries(floorGroups).map(([floorName, floorRooms]) => (
                  <div key={floorName} className="floor-section">
                    <div className="floor-title">
                      <Layers size={18} style={{ color: 'var(--accent-primary)' }} />
                      <span>{floorName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
                        ({floorRooms.length} Rooms)
                      </span>
                    </div>

                    <div className="matrix-grid">
                      {floorRooms.map((room) => {
                        const rNo = room.RoomNo || (room as any).room_no;
                        const rStatus = room.Status || (room as any).status || 'Vacant';
                        const rType = room.Type || (room as any).type_name || 'Single';
                        const rRent = room.RoomRent || (room as any).rent_per_month || (room as any).RoomRent || 0;

                        const isVacant = rStatus === 'Vacant' || rStatus === 'AVAILABLE';
                        const isOccupied = rStatus === 'Occupied' || rStatus === 'OCCUPIED';
                        const statusClass = isVacant ? 'vacant' : isOccupied ? 'occupied' : 'maint';
                        const badgeClass = isVacant ? 'badge-vacant' : isOccupied ? 'badge-occupied' : 'badge-maint';

                        return (
                          <div
                            key={rNo}
                            className={`matrix-tile ${statusClass}`}
                            onClick={() => onSelectRoomDrawer(room)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span className="room-no">{rNo}</span>
                              <Eye size={14} style={{ color: 'var(--text-muted)' }} />
                            </div>

                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {rType}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span className={`badge ${badgeClass}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                                {rStatus}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                                ₹{rRent}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* DATA GRID VIEW WITH PAGINATION */
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Room No</th>
                    <th>Floor</th>
                    <th>Room Type</th>
                    <th>Capacity</th>
                    <th>Rent</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRooms.map((room) => {
                    const rNo = room.RoomNo || (room as any).room_no;
                    const fNo = room.FloorNo !== undefined ? room.FloorNo : (room as any).floor_no;
                    const rType = room.Type || (room as any).type_name;
                    const cap = room.Capacity || (room as any).capacity || 1;
                    const rent = room.RoomRent || (room as any).rent_per_month || (room as any).RoomRent || 0;
                    const rStatus = room.Status || (room as any).status;

                    const isVacant = rStatus === 'Vacant' || rStatus === 'AVAILABLE';
                    const isOccupied = rStatus === 'Occupied' || rStatus === 'OCCUPIED';

                    return (
                      <tr key={rNo}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{rNo}</td>
                        <td>Floor {fNo}</td>
                        <td>{rType}</td>
                        <td>{cap} Beds</td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: '#10b981' }}>₹{rent}</td>
                        <td>
                          <span className={`badge ${isVacant ? 'badge-vacant' : isOccupied ? 'badge-occupied' : 'badge-maint'}`}>
                            {rStatus}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => onSelectRoomDrawer(room)}>
                              <Eye size={14} /> Details
                            </button>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleOpenEditRoom(room)}>
                              <Edit2 size={14} />
                            </button>
                            <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => onDeleteRoom(rNo)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Showing page {currentPage} of {totalPages} ({rooms.length} total rooms)
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft size={14} /> Previous
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="modal-backdrop" onClick={() => setShowRoomModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingRoom ? 'Edit Room' : 'Add New Room'}
            </h3>

            <form onSubmit={handleSubmitRoom}>
              <div className="form-group">
                <label>Room Number / ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={roomFormData.RoomNo || (roomFormData as any).room_no || ''}
                  onChange={(e) => setRoomFormData({ ...roomFormData, RoomNo: e.target.value, room_no: e.target.value } as any)}
                  placeholder="e.g. A-101"
                  disabled={!!editingRoom}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Hostel Facility</label>
                  <select
                    className="form-select"
                    value={roomFormData.HostelID || (roomFormData as any).hostel_id || ''}
                    onChange={(e) => setRoomFormData({ ...roomFormData, HostelID: e.target.value, hostel_id: e.target.value } as any)}
                    required
                  >
                    {hostels.map((h) => {
                      const id = h.HostelID || (h as any).hostel_id;
                      const name = h.HostelName || (h as any).name;
                      return (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label>Floor Number</label>
                  <input
                    type="number"
                    className="form-input"
                    value={roomFormData.FloorNo !== undefined ? roomFormData.FloorNo : (roomFormData as any).floor_no || 1}
                    onChange={(e) => setRoomFormData({ ...roomFormData, FloorNo: parseInt(e.target.value), floor_no: parseInt(e.target.value) } as any)}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Room Type</label>
                  <select
                    className="form-select"
                    value={roomFormData.Type || (roomFormData as any).type_name || ''}
                    onChange={(e) => setRoomFormData({ ...roomFormData, Type: e.target.value, type_name: e.target.value } as any)}
                    required
                  >
                    {roomTypes.map((rt) => {
                      const tName = rt.Type || (rt as any).type_name;
                      const cap = rt.Capacity || (rt as any).capacity || 1;
                      return (
                        <option key={tName} value={tName}>
                          {tName} ({cap} Bed)
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-select"
                    value={roomFormData.Status || (roomFormData as any).status || 'AVAILABLE'}
                    onChange={(e) => setRoomFormData({ ...roomFormData, Status: e.target.value as any, status: e.target.value } as any)}
                  >
                    <option value="AVAILABLE">AVAILABLE (Vacant)</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRoomModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingRoom ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hostel Modal */}
      {showHostelModal && (
        <div className="modal-backdrop" onClick={() => setShowHostelModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingHostel ? 'Edit Hostel' : 'Add New Hostel'}
            </h3>

            <form onSubmit={handleSubmitHostel}>
              <div className="form-group">
                <label>Hostel ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={hostelFormData.HostelID || (hostelFormData as any).hostel_id || ''}
                  onChange={(e) => setHostelFormData({ ...hostelFormData, HostelID: e.target.value, hostel_id: e.target.value } as any)}
                  disabled={!!editingHostel}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hostel Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={hostelFormData.HostelName || (hostelFormData as any).name || ''}
                  onChange={(e) => setHostelFormData({ ...hostelFormData, HostelName: e.target.value, name: e.target.value } as any)}
                  placeholder="e.g. Block A"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Gender / Type</label>
                  <select
                    className="form-select"
                    value={hostelFormData.HostelType || (hostelFormData as any).gender_type || 'M'}
                    onChange={(e) => setHostelFormData({ ...hostelFormData, HostelType: e.target.value as any, gender_type: e.target.value } as any)}
                  >
                    <option value="Boys">Boys (M)</option>
                    <option value="Girls">Girls (F)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Assigned Warden</label>
                  <select
                    className="form-select"
                    value={hostelFormData.WardenID || (hostelFormData as any).warden_id || ''}
                    onChange={(e) => setHostelFormData({ ...hostelFormData, WardenID: e.target.value, warden_id: e.target.value } as any)}
                  >
                    <option value="">-- Select Warden --</option>
                    {wardens.map((w) => {
                      const wId = w.WardenID || (w as any).warden_id;
                      const wName = w.FirstName ? `${w.FirstName} ${w.LastName}` : (w as any).name;
                      return (
                        <option key={wId} value={wId}>
                          {wName} ({wId})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Total Floors</label>
                  <input
                    type="number"
                    className="form-input"
                    value={hostelFormData.TotalFloors || 4}
                    onChange={(e) => setHostelFormData({ ...hostelFormData, TotalFloors: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Capacity / Total Rooms</label>
                  <input
                    type="number"
                    className="form-input"
                    value={hostelFormData.TotalRooms || (hostelFormData as any).capacity || 40}
                    onChange={(e) => setHostelFormData({ ...hostelFormData, TotalRooms: parseInt(e.target.value), capacity: parseInt(e.target.value) } as any)}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Campus Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={hostelFormData.Location || (hostelFormData as any).location || ''}
                  onChange={(e) => setHostelFormData({ ...hostelFormData, Location: e.target.value, location: e.target.value } as any)}
                  placeholder="e.g. North Campus"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowHostelModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingHostel ? 'Save Changes' : 'Create Hostel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
