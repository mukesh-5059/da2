import React, { useState, useEffect } from 'react';
import { Mess } from '../../types';

interface EditMessModalProps {
  mess: Partial<Mess> | null;
  onSave: (data: Partial<Mess>, isEdit: boolean) => Promise<void>;
  onClose: () => void;
}

export const EditMessModal: React.FC<EditMessModalProps> = ({ mess, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Mess>>({
    MessID: `M-${Date.now().toString().slice(-3)}`,
    MessName: '',
    MessType: 'Veg',
    Capacity: 300,
    Location: '',
  });

  useEffect(() => {
    if (mess) {
      setFormData({
        MessID: mess.MessID || (mess as any).mess_id || `M-${Date.now().toString().slice(-3)}`,
        MessName: mess.MessName || (mess as any).name || '',
        MessType: mess.MessType || (mess as any).type || 'Veg',
        Capacity: mess.Capacity || mess.SeatingCapacity || 300,
        Location: mess.Location || '',
      });
    } else {
      setFormData({
        MessID: `MSS_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        MessName: '',
        MessType: 'Veg',
        Capacity: 300,
        Location: '',
      });
    }
  }, [mess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData, !!mess);
    onClose();
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 1100 }} onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
          {mess ? 'Edit Mess Facility' : 'Add New Mess Facility'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mess ID</label>
            <input
              type="text"
              className="form-input"
              value={formData.MessID || ''}
              onChange={(e) => setFormData({ ...formData, MessID: e.target.value })}
              readOnly={!!mess}
              required
            />
          </div>
          <div className="form-group">
            <label>Facility Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Food Court, Special Mess"
              value={formData.MessName || ''}
              onChange={(e) => setFormData({ ...formData, MessName: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Dietary Type</label>
              <select
                className="form-select"
                value={formData.MessType || 'Veg'}
                onChange={(e) => setFormData({ ...formData, MessType: e.target.value as any })}
              >
                <option value="Veg">Vegetarian</option>
                <option value="NonVeg">Non-Vegetarian</option>
                <option value="Special">Special / Mixed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                className="form-input"
                value={formData.Capacity || 300}
                onChange={(e) => setFormData({ ...formData, Capacity: Number(e.target.value) })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. North Campus"
              value={formData.Location || ''}
              onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {mess ? 'Update Mess Facility' : 'Save Mess Facility'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
