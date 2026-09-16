import React, { useState } from 'react';
import { RoomType } from '../../types';
import { Plus, Edit2, Trash2, Bed, DollarSign, Users } from 'lucide-react';

interface RoomTypesTabProps {
  roomTypes: RoomType[];
  onSaveRoomType: (data: Partial<RoomType>, isEdit: boolean) => Promise<void>;
  onDeleteRoomType: (type: string) => Promise<void>;
}

export const RoomTypesTab: React.FC<RoomTypesTabProps> = ({
  roomTypes,
  onSaveRoomType,
  onDeleteRoomType,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState<Partial<RoomType> | null>(null);

  const [formData, setFormData] = useState<Partial<RoomType>>({
    Type: '',
    Capacity: 1,
    RoomRent: 30000,
  });

  const handleOpenAdd = () => {
    setEditingType(null);
    setFormData({ Type: '', Capacity: 1, RoomRent: 30000 });
    setShowModal(true);
  };

  const handleOpenEdit = (rt: RoomType) => {
    setEditingType(rt);
    setFormData(rt);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveRoomType(formData, !!editingType);
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Room Categories & Pricing</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Capacity standards and rental rates (`ROOM_TYPE` relation)
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          Add Room Type
        </button>
      </div>

      <div className="grid-cols-3">
        {roomTypes.map((rt) => (
          <div key={rt.Type} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'var(--accent-glow)', padding: '10px', borderRadius: '10px' }}>
                  <Bed size={22} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{rt.Type}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Room Classification</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={16} /> Capacity
                  </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{rt.Capacity} {rt.Capacity === 1 ? 'Student' : 'Students'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={16} /> Room Rent / Sem
                  </span>
                  <strong style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    ₹{rt.RoomRent.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleOpenEdit(rt)}>
                <Edit2 size={14} />
                Edit
              </button>
              <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => onDeleteRoomType(rt.Type)}>
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingType ? 'Edit Room Type' : 'Add New Room Type'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Type Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.Type || ''}
                  onChange={(e) => setFormData({ ...formData, Type: e.target.value })}
                  placeholder="e.g. Deluxe Single"
                  disabled={!!editingType}
                  required
                />
              </div>

              <div className="form-group">
                <label>Occupant Capacity</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.Capacity || 1}
                  onChange={(e) => setFormData({ ...formData, Capacity: parseInt(e.target.value) })}
                  min="1"
                  max="10"
                  required
                />
              </div>

              <div className="form-group">
                <label>Room Rent Amount (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.RoomRent || 0}
                  onChange={(e) => setFormData({ ...formData, RoomRent: parseFloat(e.target.value) })}
                  min="0"
                  step="500"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingType ? 'Save Changes' : 'Create Room Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
