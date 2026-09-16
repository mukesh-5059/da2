import React, { useState } from 'react';
import { Staff, Hostel } from '../../types';
import { Plus, Edit2, Trash2, UserCheck, DollarSign, Clock, Utensils, Shield, Sparkles } from 'lucide-react';

interface StaffTabProps {
  staff: Staff[];
  hostels: Hostel[];
  onSaveStaff: (data: Partial<Staff>, isEdit: boolean) => Promise<void>;
  onDeleteStaff: (id: string) => Promise<void>;
}

export const StaffTab: React.FC<StaffTabProps> = ({
  staff,
  hostels,
  onSaveStaff,
  onDeleteStaff,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Partial<Staff> | null>(null);

  const [formData, setFormData] = useState<Partial<Staff>>({
    StaffID: '',
    FirstName: '',
    LastName: '',
    Phone: '',
    JoinDate: new Date().toISOString().split('T')[0],
    Salary: 25000,
    Role: 'Chef',
    ShiftSlot: 'Morning',
    CuisineType: '',
    MessID: 'MESS-1',
    HostelID: '',
  });

  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData({
      StaffID: `ST-${Math.floor(500 + Math.random() * 500)}`,
      FirstName: '',
      LastName: '',
      Phone: '',
      JoinDate: new Date().toISOString().split('T')[0],
      Salary: 25000,
      Role: 'Chef',
      ShiftSlot: 'Morning',
      CuisineType: 'North Indian',
      MessID: 'MESS-1',
      HostelID: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s: Staff) => {
    setEditingStaff(s);
    setFormData(s);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveStaff(formData, !!editingStaff);
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Staff & Service Crew</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Mess chefs, helpers, cleaners, and hostel security crew (`STAFF` relation)
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          Add Staff Member
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Full Name</th>
              <th>Role / Category</th>
              <th>Shift Slot</th>
              <th>Cuisine / Assignment</th>
              <th>Phone</th>
              <th>Salary / Mo</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((st) => (
              <tr key={st.StaffID}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{st.StaffID}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{st.FirstName} {st.LastName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Joined: {st.JoinDate}</div>
                </td>
                <td>
                  <span
                    className="badge"
                    style={{
                      background: st.Role === 'Chef' ? 'rgba(245, 158, 11, 0.15)' : st.Role === 'Security' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(107, 114, 128, 0.2)',
                      color: st.Role === 'Chef' ? '#f59e0b' : st.Role === 'Security' ? '#60a5fa' : '#9ca3af',
                    }}
                  >
                    {st.Role === 'Chef' && <Utensils size={12} />}
                    {st.Role === 'Security' && <Shield size={12} />}
                    {st.Role}
                  </span>
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                    <Clock size={14} style={{ color: 'var(--text-secondary)' }} /> {st.ShiftSlot} Shift
                  </span>
                </td>
                <td>
                  {st.Role === 'Chef' ? (
                    <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={14} /> {st.CuisineType || 'General Cuisine'} ({st.MessID || 'Mess'})
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {st.HostelID ? `Hostel: ${st.HostelID}` : st.MessID ? `Mess: ${st.MessID}` : 'Campus Central'}
                    </span>
                  )}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{st.Phone}</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 600 }}>
                  ₹{st.Salary.toLocaleString('en-IN')}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleOpenEdit(st)}>
                      <Edit2 size={13} />
                    </button>
                    <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => onDeleteStaff(st.StaffID)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingStaff ? 'Edit Staff Profile' : 'Add New Staff Member'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Staff ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.StaffID || ''}
                  onChange={(e) => setFormData({ ...formData, StaffID: e.target.value })}
                  disabled={!!editingStaff}
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
                  <label>Staff Role</label>
                  <select
                    className="form-select"
                    value={formData.Role || 'Chef'}
                    onChange={(e) => setFormData({ ...formData, Role: e.target.value as any })}
                  >
                    <option value="Chef">Chef</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Helper">Helper</option>
                    <option value="Security">Security</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Shift Slot</label>
                  <select
                    className="form-select"
                    value={formData.ShiftSlot || 'Morning'}
                    onChange={(e) => setFormData({ ...formData, ShiftSlot: e.target.value as any })}
                  >
                    <option value="Morning">Morning Shift</option>
                    <option value="Evening">Evening Shift</option>
                    <option value="Night">Night Shift</option>
                  </select>
                </div>
              </div>

              {formData.Role === 'Chef' && (
                <div className="form-group">
                  <label>Cuisine Specialization (Chefs Only)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.CuisineType || ''}
                    onChange={(e) => setFormData({ ...formData, CuisineType: e.target.value })}
                    placeholder="e.g. North Indian, Continental, South Indian"
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

                <div className="form-group">
                  <label>Monthly Salary (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.Salary || 0}
                    onChange={(e) => setFormData({ ...formData, Salary: parseFloat(e.target.value) })}
                    min="0"
                    step="1000"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStaff ? 'Save Profile' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
