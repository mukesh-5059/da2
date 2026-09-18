import React, { useState, useEffect } from 'react';
import { Supplier } from '../../types';

interface EditSupplierModalProps {
  supplier: Supplier | null;
  onSave: (data: Partial<Supplier>, isEdit: boolean) => Promise<void>;
  onClose: () => void;
}

export const EditSupplierModal: React.FC<EditSupplierModalProps> = ({ supplier, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  useEffect(() => {
    if (supplier) {
      setFormData({ ...supplier });
    } else {
      setFormData({
        SupplierID: `SUP_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        SupplierName: '',
        Phone: '',
        Email: '',
        Address: ''
      });
    }
  }, [supplier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData, !!supplier);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
          {supplier ? 'Edit Supplier Details' : 'Add New Supplier'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Supplier ID</label>
            <input
              type="text"
              className="form-input"
              value={formData.SupplierID || ''}
              onChange={(e) => setFormData({ ...formData, SupplierID: e.target.value })}
              readOnly={!!supplier}
              required
            />
          </div>
          <div className="form-group">
            <label>Supplier Name / Company</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Fresh Agro Pvt Ltd"
              value={formData.SupplierName || ''}
              onChange={(e) => setFormData({ ...formData, SupplierName: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. +91 9876543210"
                value={formData.Phone || ''}
                onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. contact@agro.com"
                value={formData.Email || ''}
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Market Yard, Sector 4"
              value={formData.Address || ''}
              onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {supplier ? 'Update Supplier' : 'Save Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
