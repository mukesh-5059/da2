import React, { useState, useEffect } from 'react';
import { InventoryStock, Mess, InventoryItem } from '../../types';

interface EditStockModalProps {
  messes: Mess[];
  inventoryItems: InventoryItem[];
  onSave: (data: Partial<InventoryStock>) => Promise<void>;
  onClose: () => void;
}

export const EditStockModal: React.FC<EditStockModalProps> = ({ messes, inventoryItems, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<InventoryStock>>({});

  useEffect(() => {
    setFormData({
      MessID: messes[0]?.MessID || '',
      ItemID: inventoryItems[0]?.ItemID || '',
      CurrentQuantity: 100,
      LastUpdatedDate: new Date().toISOString().split('T')[0]
    });
  }, [messes, inventoryItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Update Mess Stock Level</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mess Facility</label>
            <select
              className="form-select"
              value={formData.MessID || ''}
              onChange={(e) => setFormData({ ...formData, MessID: e.target.value })}
              required
            >
              {messes.map((m) => (
                <option key={m.MessID} value={m.MessID}>
                  {m.MessName} ({m.MessID})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Item from Catalog</label>
            <select
              className="form-select"
              value={formData.ItemID || ''}
              onChange={(e) => setFormData({ ...formData, ItemID: e.target.value })}
              required
            >
              {inventoryItems.map((item) => (
                <option key={item.ItemID} value={item.ItemID}>
                  {item.ItemName} ({item.Category} - {item.Unit})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Current Quantity</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.CurrentQuantity || 0}
                onChange={(e) => setFormData({ ...formData, CurrentQuantity: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Updated Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.LastUpdatedDate || ''}
                onChange={(e) => setFormData({ ...formData, LastUpdatedDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Stock Level
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
