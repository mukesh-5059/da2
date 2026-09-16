import React, { useEffect, useState } from 'react';
import { Room, RoomAllocation } from '../../types';
import { api } from '../../services/api';
import { X, Bed, DollarSign, UserCheck, Calendar, MapPin, Building, ShieldAlert } from 'lucide-react';

interface RoomDrawerProps {
  room: Room | null;
  onClose: () => void;
  onRefreshRooms: () => void;
}

export const RoomDrawer: React.FC<RoomDrawerProps> = ({ room, onClose, onRefreshRooms }) => {
  const [allocations, setAllocations] = useState<RoomAllocation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (room) {
      setLoading(true);
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

  return (
    <div>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Room Inspection Drawer
            </div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {room.RoomNo}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Status Pill & Quick Change */}
        <div style={{ marginBottom: '24px', background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Current Room Status:
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['Vacant', 'Occupied', 'UnderMaintenance'] as const).map((st) => (
              <button
                key={st}
                onClick={() => handleUpdateStatus(st)}
                className={`btn ${room.Status === st ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '6px 8px', fontSize: '0.75rem', justifyContent: 'center' }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Room Attributes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Building size={16} /> Hostel Facility
            </span>
            <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{room.HostelName || room.HostelID}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Bed size={16} /> Room Category & Capacity
            </span>
            <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{room.Type} ({room.Capacity} Beds)</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-card)', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <DollarSign size={16} /> Semester Room Rent
            </span>
            <strong style={{ color: '#10b981', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
              ₹{room.RoomRent?.toLocaleString('en-IN')}
            </strong>
          </div>
        </div>

        {/* Active Occupants */}
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={18} style={{ color: 'var(--accent-primary)' }} />
            Active Occupants ({activeAllocations.length} / {room.Capacity || 1})
          </h3>

          {loading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: '12px' }}>Loading occupant records...</div>
          ) : activeAllocations.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '10px', color: 'var(--text-muted)', fontSize: '0.85rem', textStyle: 'italic' }}>
              No active student assigned to this room.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeAllocations.map((alloc) => (
                <div key={alloc.AllocationID} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    {alloc.StudentName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    ID: {alloc.StudentID} • {alloc.Department || 'Engineering'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> Checked-in: {alloc.CheckInDate} ({alloc.Semester} {alloc.AcademicYear})
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
