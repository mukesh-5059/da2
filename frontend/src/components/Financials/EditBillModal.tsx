import React, { useState, useEffect } from 'react';
import { MonthlyBill, Student } from '../../types';

interface EditBillModalProps {
  bill: Partial<MonthlyBill> | null;
  students: Student[];
  onSave: (data: Partial<MonthlyBill>, isEdit?: boolean) => Promise<void>;
  onClose: () => void;
}

export const EditBillModal: React.FC<EditBillModalProps> = ({ bill, students, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<MonthlyBill>>({});

  useEffect(() => {
    if (bill) {
      setFormData({
        BillID: bill.BillID || (bill as any).bill_id,
        StudentID: bill.StudentID || (bill as any).student_id,
        BillingMonth: bill.BillingMonth || (bill as any).billing_month || (new Date().getMonth() + 1),
        BillingYear: bill.BillingYear || (bill as any).billing_year || new Date().getFullYear(),
        RoomRentCharges: bill.RoomRentCharges || (bill as any).room_rent_charges || 0,
        MessCharges: bill.MessCharges || (bill as any).mess_charges || 0,
        OtherCharges: bill.OtherCharges || (bill as any).other_charges || 0,
        TotalAmount: bill.TotalAmount || (bill as any).total_amount || 0,
        DueDate: bill.DueDate || (bill as any).due_date || new Date().toISOString().split('T')[0],
        PaymentStatus: (bill.PaymentStatus || (bill as any).payment_status || 'PENDING') as any,
      });
    } else {
      setFormData({
        BillID: `BILL-${Date.now().toString().slice(-4)}`,
        StudentID: students[0]?.StudentID || '',
        BillingMonth: new Date().getMonth() + 1,
        BillingYear: new Date().getFullYear(),
        RoomRentCharges: 10000,
        MessCharges: 4500,
        OtherCharges: 500,
        TotalAmount: 15000,
        DueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        PaymentStatus: 'PENDING',
      });
    }
  }, [bill, students]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = (Number(formData.RoomRentCharges) || 0) + (Number(formData.MessCharges) || 0) + (Number(formData.OtherCharges) || 0);
    await onSave({ ...formData, TotalAmount: total }, !!bill);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
          {bill ? 'Edit Monthly Bill' : 'Generate Monthly Bill'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Bill ID</label>
            <input
              type="text"
              className="form-input"
              value={formData.BillID || ''}
              onChange={(e) => setFormData({ ...formData, BillID: e.target.value })}
              readOnly={!!bill}
              required
            />
          </div>

          <div className="form-group">
            <label>Select Student</label>
            <select
              className="form-select"
              value={formData.StudentID || ''}
              onChange={(e) => setFormData({ ...formData, StudentID: e.target.value })}
              required
            >
              {students.map((s) => (
                <option key={s.StudentID} value={s.StudentID}>
                  {s.FirstName} {s.LastName} ({s.StudentID}) — {s.Department}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Billing Month (1-12)</label>
              <input
                type="number"
                min="1"
                max="12"
                className="form-input"
                value={formData.BillingMonth || 9}
                onChange={(e) => setFormData({ ...formData, BillingMonth: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Billing Year</label>
              <input
                type="number"
                className="form-input"
                value={formData.BillingYear || new Date().getFullYear()}
                onChange={(e) => setFormData({ ...formData, BillingYear: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label>Room Rent (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.RoomRentCharges || 0}
                onChange={(e) => setFormData({ ...formData, RoomRentCharges: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Mess Fee (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.MessCharges || 0}
                onChange={(e) => setFormData({ ...formData, MessCharges: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Other (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.OtherCharges || 0}
                onChange={(e) => setFormData({ ...formData, OtherCharges: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.DueDate || ''}
              onChange={(e) => setFormData({ ...formData, DueDate: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {bill ? 'Save Changes' : 'Generate Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
