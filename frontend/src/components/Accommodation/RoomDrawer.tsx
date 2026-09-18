import React, { useEffect, useState } from 'react';
import { Room, RoomAllocation } from '../../types';
import { api } from '../../services/api';
import { X, Bed, DollarSign, UserCheck, Calendar, Building, Edit2, Trash2 } from 'lucide-react';

interface RoomDrawerProps {
  room: Room | null;
  onClose: () => void;
  onRefreshRooms: () => void;
  onSelectStudent?: (studentId: string) => void;
  onEditRoom?: (room: Room) => void;
  onDeleteRoom?: (roomNo: string) => void;
}

export const RoomDrawer: React.FC<RoomDrawerProps> = ({ room, onClose, onRefreshRooms, onSelectStudent, onEditRoom, onDeleteRoom }) => {
  const [allocations, setAllocations] = useState<RoomAllocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Room>>({});

  useEffect(() => {
    if (room) {
      setLoading(true);
      setIsEditing(false);
      setEditFormData(room);
      api.getAllocations(room.RoomNo)
        .then(setAllocations)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [room]);

  if (!room) return null;

  const activeAllocations = allocations.filter((a) => !a.CheckOutDate);

  const handleUpdateStatus = async (newStatus: 'Vacant' | 'Occupied' | 'UnderMaintenance') => {
    await api.updateRoom(room.RoomNo, { ...room, Status: newStatus });
    onRefreshRooms();
    onClose();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.updateRoom(room.RoomNo, editFormData);
    onRefreshRooms();
    setIsEditing(false);
    onClose();
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === 'Vacant') return 'badge badge-vacant';
    if (status === 'Occupied') return 'badge badge-occupied';
    return 'badge badge-maint';
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ width: '680px', maxWidth: '95vw', padding: '28px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                Room Inspector
              </span>
              <span className={getStatusBadgeClass(room.Status)}>
                {room.Status}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              Room {room.RoomNo}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', fontSize: '1.2rem' }}
          >
            ✕
          </button>
        </div>

        {/* Normal Inspector View */}
        <>
            {/* Status Switcher */}
            <div style={{ marginBottom: '20px', background: 'var(--bg-surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>
                Quick Status Switch:
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['Vacant', 'Occupied', 'UnderMaintenance'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(st)}
                    className={`btn ${room.Status === st ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem', justifyContent: 'center' }}
                  >
                    {st === 'UnderMaintenance' ? 'Maintenance' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Attributes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building size={14} /> Hostel
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.85rem', marginTop: '4px' }}>
                  {room.HostelName || room.HostelID}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Bed size={14} /> Category
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.85rem', marginTop: '4px' }}>
                  {room.Type} ({room.Capacity || 1} Bed)
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <DollarSign size={14} /> Rent / sem
                </div>
                <div style={{ fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', marginTop: '4px' }}>
                  ₹{room.RoomRent?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Active Occupants */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={16} style={{ color: 'var(--accent-primary)' }} />
                Active Resident Occupants ({activeAllocations.length} / {room.Capacity || 1})
              </div>

              {loading ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px' }}>Loading occupant records...</div>
              ) : activeAllocations.length === 0 ? (
                <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '10px', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', border: '1px solid var(--border-subtle)' }}>
                  No active student assigned to this room.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeAllocations.map((alloc) => {
                    const rawName = alloc.StudentName?.trim() || '';
                    const sId = alloc.StudentID?.trim() || '';
                    const hasRealName = Boolean(rawName && rawName.toLowerCase() !== sId.toLowerCase());

                    return (
                      <div key={alloc.AllocationID} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          {hasRealName ? (
                            <>
                              <div
                                style={{
                                  fontWeight: 700,
                                  color: 'var(--accent-primary)',
                                  fontSize: '0.95rem',
                                  cursor: onSelectStudent ? 'pointer' : 'default',
                                }}
                                onClick={() => {
                                  if (onSelectStudent) {
                                    onSelectStudent(alloc.StudentID);
                                  }
                                }}
                                title="Click to open Student Profile"
                              >
                                {rawName}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                                ID: {sId} • {alloc.Department || 'Engineering'}
                              </div>
                            </>
                          ) : (
                            <div
                              style={{
                                fontWeight: 700,
                                color: 'var(--accent-primary)',
                                fontSize: '0.95rem',
                                fontFamily: 'var(--font-mono)',
                                cursor: onSelectStudent ? 'pointer' : 'default',
                              }}
                              onClick={() => {
                                if (onSelectStudent) {
                                  onSelectStudent(alloc.StudentID);
                                }
                              }}
                              title="Click to open Student Profile"
                            >
                              {sId} • {alloc.Department || 'Engineering'}
                            </div>
                          )}
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} /> Checked-in: {alloc.CheckInDate} ({alloc.Semester} {alloc.AcademicYear})
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (onEditRoom) {
                    onEditRoom(room);
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                <Edit2 size={14} /> Edit Room
              </button>
              {onDeleteRoom && (
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    onClose();
                    onDeleteRoom(room.RoomNo);
                  }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              )}
            </div>
          </>
        </div>
      </div>

      {/* Floating Edit Room Overlay */}
      {isEditing && (
        <div className="modal-backdrop" style={{ zIndex: 1100 }} onClick={() => setIsEditing(false)}>
          <div className="modal-card" style={{ width: '500px', maxWidth: '95vw', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                Edit Room Settings ({room.RoomNo})
              </h3>
              <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label>Room Status</label>
                <select
                  className="form-select"
                  value={editFormData.Status || room.Status}
                  onChange={(e) => setEditFormData({ ...editFormData, Status: e.target.value as any })}
                >
                  <option value="Vacant">Vacant</option>
                  <option value="Occupied">Occupied</option>
                  <option value="UnderMaintenance">Under Maintenance</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Floor Number</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editFormData.FloorNo ?? room.FloorNo}
                    onChange={(e) => setEditFormData({ ...editFormData, FloorNo: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Room Rent (₹ / sem)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editFormData.RoomRent ?? room.RoomRent ?? 0}
                    onChange={(e) => setEditFormData({ ...editFormData, RoomRent: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Room Category / Type</label>
                <input
                  type="text"
                  className="form-input"
                  value={editFormData.Type || room.Type}
                  onChange={(e) => setEditFormData({ ...editFormData, Type: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Room Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
