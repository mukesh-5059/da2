import React, { useState } from 'react';
import { Hostel, Warden } from '../../types';
import { Plus, Edit2, Trash2, Building2, MapPin, UserCheck, Layers } from 'lucide-react';

interface HostelsTabProps {
  hostels: Hostel[];
  wardens: Warden[];
  onSaveHostel: (data: Partial<Hostel>, isEdit: boolean) => Promise<void>;
  onDeleteHostel: (id: string) => Promise<void>;
}

export const HostelsTab: React.FC<HostelsTabProps> = ({
  hostels,
  wardens,
  onSaveHostel,
  onDeleteHostel,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingHostel, setEditingHostel] = useState<Partial<Hostel> | null>(null);

  const [formData, setFormData] = useState<Partial<Hostel>>({
    HostelID: '',
    HostelName: '',
    HostelType: 'Boys',
    TotalFloors: 4,
    TotalRooms: 40,
    Location: '',
    WardenID: '',
  });

  const handleOpenAdd = () => {
    setEditingHostel(null);
    setFormData({
      HostelID: `H-${Date.now().toString().slice(-4)}`,
      HostelName: '',
      HostelType: 'Boys',
      TotalFloors: 4,
      TotalRooms: 40,
      Location: '',
      WardenID: wardens[0]?.WardenID || '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (hostel: Hostel) => {
    setEditingHostel(hostel);
    setFormData(hostel);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveHostel(formData, !!editingHostel);
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Hostel Facilities</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            System-wide campus hostel management (`HOSTEL` relation)
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          Add Hostel
        </button>
      </div>

      <div className="grid-cols-3">
        {hostels.map((hostel) => (
          <div key={hostel.HostelID} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building2 size={24} style={{ color: 'var(--accent-primary)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{hostel.HostelName}</h3>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      ID: {hostel.HostelID}
                    </span>
                  </div>
                </div>
                <span className="tag-pill">
                  {hostel.HostelType} Hostel
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} />
                  <span>{hostel.Location || 'Campus Main Block'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserCheck size={16} />
                  <span>Warden: <strong style={{ color: 'var(--text-primary)' }}>{hostel.WardenName || hostel.WardenID || 'Unassigned'}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} />
                  <span>{hostel.TotalFloors} Floors • {hostel.TotalRooms} Total Rooms</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
              <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleOpenEdit(hostel)}>
                <Edit2 size={14} />
                Edit
              </button>
              <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => onDeleteHostel(hostel.HostelID)}>
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingHostel ? 'Edit Hostel' : 'Add New Hostel'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Hostel ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.HostelID || ''}
                  onChange={(e) => setFormData({ ...formData, HostelID: e.target.value })}
                  disabled={!!editingHostel}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hostel Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.HostelName || ''}
                  onChange={(e) => setFormData({ ...formData, HostelName: e.target.value })}
                  placeholder="e.g. Tagore Boys Hostel"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Hostel Type</label>
                  <select
                    className="form-select"
                    value={formData.HostelType || 'Boys'}
                    onChange={(e) => setFormData({ ...formData, HostelType: e.target.value as 'Boys' | 'Girls' })}
                  >
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Assigned Warden</label>
                  <select
                    className="form-select"
                    value={formData.WardenID || ''}
                    onChange={(e) => setFormData({ ...formData, WardenID: e.target.value })}
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
                    value={formData.TotalFloors || 1}
                    onChange={(e) => setFormData({ ...formData, TotalFloors: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Rooms</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.TotalRooms || 1}
                    onChange={(e) => setFormData({ ...formData, TotalRooms: parseInt(e.target.value) })}
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
                  value={formData.Location || ''}
                  onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
                  placeholder="e.g. North Campus Block A"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
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
