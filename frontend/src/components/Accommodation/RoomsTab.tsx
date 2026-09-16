import React, { useState } from 'react';
import { Room, RoomType, Hostel, Warden } from '../../types';
import { Plus, Edit2, Trash2, LayoutGrid, Table, Eye, Layers, ArrowLeft, Building2, MapPin, UserCheck } from 'lucide-react';

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
}) => {
  const [viewMode, setViewMode] = useState<'matrix' | 'table'>('matrix');

  // Room Modal State
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);
  const [roomFormData, setRoomFormData] = useState<Partial<Room>>({
    RoomNo: '',
    FloorNo: 1,
    Status: 'Vacant',
    Type: roomTypes[0]?.Type || 'Single',
    HostelID: hostels[0]?.HostelID || '',
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
      HostelID: selectedHostelId !== 'ALL' ? selectedHostelId : hostels[0]?.HostelID || '',
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
      HostelID: `H-${Date.now().toString().slice(-4)}`,
      HostelName: '',
      HostelType: 'Boys',
      TotalFloors: 4,
      TotalRooms: 40,
      Location: '',
      WardenID: wardens[0]?.WardenID || '',
    });
    setShowHostelModal(true);
  };

  const handleOpenEditHostel = (hostel: Hostel) => {
    setEditingHostel(hostel);
    setHostelFormData(hostel);
    setShowHostelModal(true);
  };

  const handleSubmitHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveHostel(hostelFormData, !!editingHostel);
    setShowHostelModal(false);
  };

  const selectedHostelObj = hostels.find((h) => h.HostelID === selectedHostelId);

  // Group rooms by Floor for the active hostel
  const floorGroups = rooms.reduce((acc, room) => {
    const floorKey = `Floor ${room.FloorNo}`;
    if (!acc[floorKey]) acc[floorKey] = [];
    acc[floorKey].push(room);
    return acc;
  }, {} as Record<string, Room[]>);

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
              const hostelRooms = rooms.filter((r) => r.HostelID === hostel.HostelID);
              const vacantCount = hostelRooms.filter((r) => r.Status === 'Vacant').length;
              const occupiedCount = hostelRooms.filter((r) => r.Status === 'Occupied').length;
              const maintCount = hostelRooms.filter((r) => r.Status === 'UnderMaintenance').length;

              return (
                <div
                  key={hostel.HostelID}
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
                          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{hostel.HostelName}</h3>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            ID: {hostel.HostelID}
                          </span>
                        </div>
                      </div>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: hostel.HostelType === 'Boys' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(236, 72, 153, 0.15)',
                          color: hostel.HostelType === 'Boys' ? '#60a5fa' : '#f472b6',
                          border: `1px solid ${hostel.HostelType === 'Boys' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(236, 72, 153, 0.3)'}`,
                        }}
                      >
                        {hostel.HostelType} Hostel
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={16} />
                        <span>{hostel.Location || 'Main Campus'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserCheck size={16} />
                        <span>Warden: <strong style={{ color: 'var(--text-primary)' }}>{hostel.WardenName || hostel.WardenID || 'Unassigned'}</strong></span>
                      </div>
                    </div>

                    {/* Occupancy Breakdown */}
                    <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '8px', fontWeight: 600 }}>
                        <span>Occupancy Status</span>
                        <span style={{ color: 'var(--text-primary)' }}>{hostelRooms.length} Rooms</span>
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
                          onDeleteHostel(hostel.HostelID);
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => onSelectHostelScope(hostel.HostelID)}
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
                {selectedHostelObj?.HostelName}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {selectedHostelObj?.HostelType} Hostel • {selectedHostelObj?.TotalFloors} Floors • Warden: {selectedHostelObj?.WardenName || 'Unassigned'}
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

          {/* ROOM MATRIX OR DATA GRID */}
          {viewMode === 'matrix' ? (
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
                        const statusClass = room.Status === 'Vacant' ? 'vacant' : room.Status === 'Occupied' ? 'occupied' : 'maint';
                        const badgeClass = room.Status === 'Vacant' ? 'badge-vacant' : room.Status === 'Occupied' ? 'badge-occupied' : 'badge-maint';

                        return (
                          <div
                            key={room.RoomNo}
                            className={`matrix-tile ${statusClass}`}
                            onClick={() => onSelectRoomDrawer(room)}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span className="room-no">{room.RoomNo}</span>
                              <Eye size={14} style={{ color: 'var(--text-muted)' }} />
                            </div>

                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              {room.Type}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span className={`badge ${badgeClass}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                                {room.Status}
                              </span>
                              <span style={{ fontSize: '0.7rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                                ₹{(room.RoomRent || 0) / 1000}k
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
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Room No</th>
                    <th>Floor</th>
                    <th>Room Type</th>
                    <th>Capacity</th>
                    <th>Rent / Sem</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.RoomNo}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{room.RoomNo}</td>
                      <td>Floor {room.FloorNo}</td>
                      <td>{room.Type}</td>
                      <td>{room.Capacity} Beds</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#10b981' }}>₹{room.RoomRent?.toLocaleString('en-IN')}</td>
                      <td>
                        <span className={`badge ${room.Status === 'Vacant' ? 'badge-vacant' : room.Status === 'Occupied' ? 'badge-occupied' : 'badge-maint'}`}>
                          {room.Status}
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
                          <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => onDeleteRoom(room.RoomNo)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                <label>Room Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={roomFormData.RoomNo || ''}
                  onChange={(e) => setRoomFormData({ ...roomFormData, RoomNo: e.target.value })}
                  placeholder="e.g. TB-101"
                  disabled={!!editingRoom}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Hostel Facility</label>
                  <select
                    className="form-select"
                    value={roomFormData.HostelID || ''}
                    onChange={(e) => setRoomFormData({ ...roomFormData, HostelID: e.target.value })}
                    required
                  >
                    {hostels.map((h) => (
                      <option key={h.HostelID} value={h.HostelID}>
                        {h.HostelName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Floor Number</label>
                  <input
                    type="number"
                    className="form-input"
                    value={roomFormData.FloorNo || 1}
                    onChange={(e) => setRoomFormData({ ...roomFormData, FloorNo: parseInt(e.target.value) })}
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
                    value={roomFormData.Type || ''}
                    onChange={(e) => setRoomFormData({ ...roomFormData, Type: e.target.value })}
                    required
                  >
                    {roomTypes.map((rt) => (
                      <option key={rt.Type} value={rt.Type}>
                        {rt.Type} ({rt.Capacity} Bed)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-select"
                    value={roomFormData.Status || 'Vacant'}
                    onChange={(e) => setRoomFormData({ ...roomFormData, Status: e.target.value as 'Vacant' | 'Occupied' | 'UnderMaintenance' })}
                  >
                    <option value="Vacant">Vacant</option>
                    <option value="Occupied">Occupied</option>
                    <option value="UnderMaintenance">Under Maintenance</option>
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
                  value={hostelFormData.HostelID || ''}
                  onChange={(e) => setHostelFormData({ ...hostelFormData, HostelID: e.target.value })}
                  disabled={!!editingHostel}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hostel Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={hostelFormData.HostelName || ''}
                  onChange={(e) => setHostelFormData({ ...hostelFormData, HostelName: e.target.value })}
                  placeholder="e.g. Tagore Boys Hostel"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Hostel Type</label>
                  <select
                    className="form-select"
                    value={hostelFormData.HostelType || 'Boys'}
                    onChange={(e) => setHostelFormData({ ...hostelFormData, HostelType: e.target.value as 'Boys' | 'Girls' })}
                  >
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Assigned Warden</label>
                  <select
                    className="form-select"
                    value={hostelFormData.WardenID || ''}
                    onChange={(e) => setHostelFormData({ ...hostelFormData, WardenID: e.target.value })}
                  >
                    <option value="">-- Select Warden --</option>
                    {wardens.map((w) => (
                      <option key={w.WardenID} value={w.WardenID}>
                        {w.FirstName} {w.LastName} ({w.Designation})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Total Floors</label>
                  <input
                    type="number"
                    className="form-input"
                    value={hostelFormData.TotalFloors || 1}
                    onChange={(e) => setHostelFormData({ ...hostelFormData, TotalFloors: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Rooms</label>
                  <input
                    type="number"
                    className="form-input"
                    value={hostelFormData.TotalRooms || 1}
                    onChange={(e) => setHostelFormData({ ...hostelFormData, TotalRooms: parseInt(e.target.value) })}
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
                  value={hostelFormData.Location || ''}
                  onChange={(e) => setHostelFormData({ ...hostelFormData, Location: e.target.value })}
                  placeholder="e.g. North Campus Block A"
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
