import React, { useState, useEffect } from 'react';
import { ProcurementEvent, Mess, Supplier, InventoryItem } from '../../types';

interface EditProcurementModalProps {
  procurement: ProcurementEvent | null;
  messes: Mess[];
  suppliers: Supplier[];
  inventoryItems: InventoryItem[];
  onSave: (data: Partial<ProcurementEvent>, isEdit: boolean) => Promise<void>;
  onClose: () => void;
}

export const EditProcurementModal: React.FC<EditProcurementModalProps> = ({ 
  procurement, messes, suppliers, inventoryItems, onSave, onClose 
}) => {
  const [formData, setFormData] = useState<Partial<ProcurementEvent>>({});

  useEffect(() => {
    if (procurement) {
      setFormData({ ...procurement });
    } else {
      const q = 50;
      const p = 60;
      setFormData({
        PurchaseID: `PUR_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        MessID: messes[0]?.MessID || '',
        SupplierID: suppliers[0]?.SupplierID || '',
        ItemID: inventoryItems[0]?.ItemID || '',
        Quantity: q,
        UnitPrice: p,
        TotalCost: q * p,
        PurchaseDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [procurement, messes, suppliers, inventoryItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData, !!procurement);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
          {procurement ? 'Edit Procurement Log' : 'Record New Purchase Event'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Purchase ID</label>
            <input
              type="text"
              className="form-input"
              value={formData.PurchaseID || ''}
              onChange={(e) => setFormData({ ...formData, PurchaseID: e.target.value })}
              readOnly={!!procurement}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
              <label>Supplier</label>
              <select
                className="form-select"
                value={formData.SupplierID || ''}
                onChange={(e) => setFormData({ ...formData, SupplierID: e.target.value })}
                required
              >
                {suppliers.map((s) => (
                  <option key={s.SupplierID} value={s.SupplierID}>
                    {s.SupplierName} ({s.SupplierID})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Purchased Item</label>
            <select
              className="form-select"
              value={formData.ItemID || ''}
              onChange={(e) => setFormData({ ...formData, ItemID: e.target.value })}
              required
            >
              {inventoryItems.map((item) => (
                <option key={item.ItemID} value={item.ItemID}>
                  {item.ItemName} ({item.Unit})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px' }}>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.Quantity || 0}
                onChange={(e) => {
                  const q = Number(e.target.value);
                  const u = formData.UnitPrice || 0;
                  setFormData({ ...formData, Quantity: q, TotalCost: q * u });
                }}
                required
              />
            </div>

            <div className="form-group">
              <label>Unit Price (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.UnitPrice || 0}
                onChange={(e) => {
                  const u = Number(e.target.value);
                  const q = formData.Quantity || 0;
                  setFormData({ ...formData, UnitPrice: u, TotalCost: q * u });
                }}
                required
              />
            </div>

            <div className="form-group">
              <label>Total Cost (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.TotalCost || 0}
                onChange={(e) => setFormData({ ...formData, TotalCost: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Purchase Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.PurchaseDate || ''}
              onChange={(e) => setFormData({ ...formData, PurchaseDate: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {procurement ? 'Update Purchase Log' : 'Record Purchase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
