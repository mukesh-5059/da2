import React, { useState } from 'react';
import { Staff, Hostel } from '../../types';
import { Plus, Edit2, Trash2, UserCheck, DollarSign, Clock, Utensils, Shield, Sparkles } from 'lucide-react';
import { useTableFeatures, ColumnDef } from '../../hooks/useTableFeatures';
import { TableControls } from '../TableControls';
import { TableHeader } from '../TableHeader';

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

  const columns: ColumnDef<Staff>[] = [
    { key: 'StaffID', label: 'Staff ID', getValue: s => s.StaffID },
    { key: 'FullName', label: 'Full Name', getValue: s => `${s.FirstName} ${s.LastName}` },
    { key: 'Role', label: 'Role / Category', getValue: s => s.Role },
    { key: 'ShiftSlot', label: 'Shift Slot', getValue: s => s.ShiftSlot },
    { key: 'Assignment', label: 'Cuisine / Assignment', getValue: s => s.Role === 'Chef' ? (s.CuisineType || 'General') : (s.HostelID || s.MessID || 'Campus Central') },
    { key: 'Phone', label: 'Phone', getValue: s => s.Phone },
    { key: 'Salary', label: 'Salary / Mo', getValue: s => s.Salary }
  ];

  const { searchCol, setSearchCol, searchText, setSearchText, sortCol, sortDir, handleSort, processedData: filteredStaff } = useTableFeatures(staff, columns);

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

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <TableControls 
            columns={columns} 
            searchCol={searchCol} 
            setSearchCol={setSearchCol} 
            searchText={searchText} 
            setSearchText={setSearchText}
          />
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            Add Staff Member
          </button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <TableHeader columns={columns} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
          <tbody>
            {filteredStaff.map((st) => (
              <tr key={st.StaffID}>
                <td>
                  <div
                    style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-link)', cursor: 'pointer' }}
                    onClick={() => handleOpenEdit(st)}
                  >
                    {st.StaffID}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>
                    {st.FirstName} {st.LastName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Joined: {st.JoinDate}</div>
                </td>
                <td>
                  <span
                    className="tag-pill"
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <div>
                  {editingStaff && (
                    <button 
                      type="button" 
                      className="btn btn-danger" 
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${formData.FirstName}?`)) {
                          setShowModal(false);
                          if (formData.StaffID) onDeleteStaff(formData.StaffID);
                        }
                      }}
                    >
                      Delete Staff
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingStaff ? 'Save Profile' : 'Add Staff Member'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
