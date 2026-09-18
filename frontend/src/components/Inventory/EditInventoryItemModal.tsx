import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../../types';

interface EditInventoryItemModalProps {
  item: InventoryItem | null;
  onSave: (data: Partial<InventoryItem>, isEdit: boolean) => Promise<void>;
  onClose: () => void;
}

export const EditInventoryItemModal: React.FC<EditInventoryItemModalProps> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({});

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({
        ItemID: `ITM_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        ItemName: '',
        Category: 'Grains',
        Unit: 'kg'
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData, !!item);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
          {item ? 'Edit Inventory Item' : 'Add Inventory Item'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item ID</label>
            <input
              type="text"
              className="form-input"
              value={formData.ItemID || ''}
              onChange={(e) => setFormData({ ...formData, ItemID: e.target.value })}
              readOnly={!!item}
              required
            />
          </div>
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Basmati Rice, Toned Milk"
              value={formData.ItemName || ''}
              onChange={(e) => setFormData({ ...formData, ItemName: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Category</label>
              <select
                className="form-select"
                value={formData.Category || 'Grains'}
                onChange={(e) => setFormData({ ...formData, Category: e.target.value as any })}
              >
                <option value="Dairy">Dairy</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Grains">Grains</option>
                <option value="Spices">Spices</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Measurement Unit</label>
              <select
                className="form-select"
                value={formData.Unit || 'kg'}
                onChange={(e) => setFormData({ ...formData, Unit: e.target.value as any })}
              >
                <option value="kg">kg</option>
                <option value="litre">litre</option>
                <option value="units">units</option>
                <option value="packets">packets</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {item ? 'Update Item' : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
