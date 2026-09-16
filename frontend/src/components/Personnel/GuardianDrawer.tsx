import React, { useEffect, useState } from 'react';
import { Student, Guardian } from '../../types';
import { api } from '../../services/api';
import { X, Plus, Shield, Phone, Mail, MapPin, User } from 'lucide-react';

interface GuardianDrawerProps {
  student: Student | null;
  onClose: () => void;
}

export const GuardianDrawer: React.FC<GuardianDrawerProps> = ({ student, onClose }) => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState<Partial<Guardian>>({
    GuardianID: '',
    GuardianName: '',
    Relationship: 'Father',
    Phone: '',
    Email: '',
    Address: '',
  });

  const loadGuardians = () => {
    if (student) {
      setLoading(true);
      api.getGuardians(student.StudentID)
        .then(setGuardians)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadGuardians();
  }, [student]);

  if (!student) return null;

  const handleAddGuardian = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createGuardian({
      ...formData,
      GuardianID: `G-${Date.now().toString().slice(-4)}`,
      StudentID: student.StudentID,
    });
    setShowAddForm(false);
    loadGuardians();
  };

  return (
    <div>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Emergency Contacts & Guardians
            </div>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              {student.FirstName} {student.LastName}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              ID: {student.StudentID} • {student.Department}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} style={{ color: 'var(--accent-primary)' }} /> Registered Guardians ({guardians.length})
          </h3>
          <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => setShowAddForm(true)}>
            <Plus size={14} /> Add Guardian
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddGuardian} style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-medium)' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '12px' }}>Add Guardian for {student.FirstName}</h4>
            <div className="form-group">
              <label>Guardian Full Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.GuardianName || ''}
                onChange={(e) => setFormData({ ...formData, GuardianName: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label>Relationship</label>
                <select
                  className="form-select"
                  value={formData.Relationship || 'Father'}
                  onChange={(e) => setFormData({ ...formData, Relationship: e.target.value })}
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
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
            <div className="form-group">
              <label>Home Address</label>
              <input
                type="text"
                className="form-input"
                value={formData.Address || ''}
                onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                placeholder="e.g. City, State"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
              <button type="button" className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                Save Guardian
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading emergency contacts...</div>
        ) : guardians.length === 0 ? (
          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No emergency guardian contacts registered for this student yet. Click "+ Add Guardian" to add one.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {guardians.map((g) => (
              <div key={g.GuardianID} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={16} /> {g.GuardianName}
                  </div>
                  <span className="badge badge-occupied" style={{ fontSize: '0.7rem' }}>
                    {g.Relationship}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} /> <span>{g.Phone}</span>
                  </div>
                  {g.Email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={14} /> <span>{g.Email}</span>
                    </div>
                  )}
                  {g.Address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={14} /> <span>{g.Address}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
