import React, { useState } from 'react';
import { Warden, Hostel } from '../../types';
import { Plus, Edit2, Trash2, ShieldCheck, Mail, Phone, Calendar, Building2 } from 'lucide-react';

interface WardensTabProps {
  wardens: Warden[];
  hostels: Hostel[];
  onSaveWarden: (data: Partial<Warden>, isEdit: boolean) => Promise<void>;
  onDeleteWarden: (id: string) => Promise<void>;
}

export const WardensTab: React.FC<WardensTabProps> = ({
  wardens,
  hostels,
  onSaveWarden,
  onDeleteWarden,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingWarden, setEditingWarden] = useState<Partial<Warden> | null>(null);

  const [formData, setFormData] = useState<Partial<Warden>>({
    WardenID: '',
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
    Designation: 'Warden',
    JoiningDate: new Date().toISOString().split('T')[0],
  });

  const handleOpenAdd = () => {
    setEditingWarden(null);
    setFormData({
      WardenID: `W-${Math.floor(100 + Math.random() * 900)}`,
      FirstName: '',
      LastName: '',
      Email: '',
      Phone: '',
      Designation: 'Warden',
      JoiningDate: new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const handleOpenEdit = (w: Warden) => {
    setEditingWarden(w);
    setFormData(w);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveWarden(formData, !!editingWarden);
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Warden Administration</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            System wardens and chief hostel officers (`WARDEN` relation)
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          Add Warden Profile
        </button>
      </div>

      <div className="grid-cols-3">
        {wardens.map((warden) => {
          const assignedHostels = hostels.filter((h) => h.WardenID === warden.WardenID);

          return (
            <div key={warden.WardenID} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'var(--accent-glow)', padding: '10px', borderRadius: '12px' }}>
                      <ShieldCheck size={24} style={{ color: 'var(--accent-primary)' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                        {warden.FirstName} {warden.LastName}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        ID: {warden.WardenID}
                      </span>
                    </div>
                  </div>

                  <span className="badge badge-occupied" style={{ fontSize: '0.7rem' }}>
                    {warden.Designation || 'Warden'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={15} /> <span>{warden.Email || 'No email registered'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={15} /> <span>{warden.Phone || 'No phone registered'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={15} /> <span>Joined: {warden.JoiningDate || 'N/A'}</span>
                  </div>
                </div>

                {/* Linked Hostels */}
                <div style={{ marginTop: '14px', background: 'var(--bg-surface)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                    Managed Hostel Facilities:
                  </div>
                  {assignedHostels.length === 0 ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No hostel assigned</span>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {assignedHostels.map((h) => (
                        <span key={h.HostelID} style={{ fontSize: '0.75rem', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Building2 size={12} /> {h.HostelName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleOpenEdit(warden)}>
                  <Edit2 size={14} /> Edit
                </button>
                <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => onDeleteWarden(warden.WardenID)}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingWarden ? 'Edit Warden Profile' : 'Add New Warden'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Warden ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.WardenID || ''}
                  onChange={(e) => setFormData({ ...formData, WardenID: e.target.value })}
                  disabled={!!editingWarden}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.FirstName || ''}
                    onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.LastName || ''}
                    onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.Email || ''}
                    onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.Phone || ''}
                    onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Designation</label>
                  <select
                    className="form-select"
                    value={formData.Designation || 'Warden'}
                    onChange={(e) => setFormData({ ...formData, Designation: e.target.value })}
                  >
                    <option value="Chief Warden">Chief Warden</option>
                    <option value="Warden">Warden</option>
                    <option value="Assistant Warden">Assistant Warden</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Joining Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.JoiningDate || ''}
                    onChange={(e) => setFormData({ ...formData, JoiningDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingWarden ? 'Save Profile' : 'Create Warden'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
