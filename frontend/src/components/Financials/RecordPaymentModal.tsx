import React, { useState, useEffect } from 'react';
import { PaymentTransaction, MonthlyBill } from '../../types';

interface RecordPaymentModalProps {
  payment: Partial<PaymentTransaction> | null;
  bill: MonthlyBill | null;
  onSave: (data: Partial<PaymentTransaction>, isEdit?: boolean) => Promise<void>;
  onClose: () => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ payment, bill, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<PaymentTransaction>>({});

  useEffect(() => {
    if (payment) {
      setFormData({
        PaymentID: payment.PaymentID || (payment as any).payment_id,
        BillID: payment.BillID || (payment as any).bill_id,
        AmountPaid: payment.AmountPaid || (payment as any).amount_paid || 0,
        PaymentMode: (payment.PaymentMode || (payment as any).payment_mode || 'UPI') as any,
        PaymentDate: payment.PaymentDate || (payment as any).payment_date || new Date().toISOString().split('T')[0],
        TransactionReference: payment.TransactionReference || (payment as any).transaction_reference || '',
      });
    } else if (bill) {
      setFormData({
        PaymentID: `PAY-${Date.now().toString().slice(-4)}`,
        BillID: bill.BillID || (bill as any).bill_id,
        AmountPaid: bill.TotalAmount || (bill as any).total_amount,
        PaymentMode: 'UPI',
        PaymentDate: new Date().toISOString().split('T')[0],
        TransactionReference: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      });
    }
  }, [payment, bill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData, !!payment);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
          {payment ? 'Edit Payment Record' : 'Record Payment'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Payment ID</label>
            <input type="text" className="form-input" value={formData.PaymentID || ''} readOnly />
          </div>

          <div className="form-group">
            <label>Bill ID</label>
            <input type="text" className="form-input" value={formData.BillID || ''} readOnly />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Amount Paid (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.AmountPaid || 0}
                onChange={(e) => setFormData({ ...formData, AmountPaid: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Payment Mode</label>
              <select
                className="form-select"
                value={formData.PaymentMode || 'UPI'}
                onChange={(e) => setFormData({ ...formData, PaymentMode: e.target.value as any })}
              >
                <option value="UPI">UPI</option>
                <option value="NETBANKING">NETBANKING</option>
                <option value="CARD">CARD</option>
                <option value="CASH">CASH</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Transaction Reference Code</label>
            <input
              type="text"
              className="form-input"
              value={formData.TransactionReference || ''}
              onChange={(e) => setFormData({ ...formData, TransactionReference: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Payment Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.PaymentDate || ''}
              onChange={(e) => setFormData({ ...formData, PaymentDate: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
