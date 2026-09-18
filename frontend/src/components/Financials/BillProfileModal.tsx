import React from 'react';
import { MonthlyBill } from '../../types';
import { CreditCard, Edit2, Trash2 } from 'lucide-react';

interface BillProfileModalProps {
  bill: MonthlyBill;
  onClose: () => void;
  onEdit: (bill: MonthlyBill) => void;
  onPay: (bill: MonthlyBill) => void;
  onDelete: (billId: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const BillProfileModal: React.FC<BillProfileModalProps> = ({
  bill,
  onClose,
  onEdit,
  onPay,
  onDelete,
  onSelectStudent,
}) => {
  const bId = bill.BillID || (bill as any).bill_id;
  const status = bill.PaymentStatus || (bill as any).payment_status || 'PENDING';
  const isPaid = status === 'PAID';
  const isOverdue = status === 'OVERDUE';
  const sId = bill.StudentID || (bill as any).student_id;
  const name = `${bill.FirstName || ''} ${bill.LastName || ''}`.trim() || bill.StudentName || sId;
  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mStr = monthNames[bill.BillingMonth || (bill as any).billing_month] || `M${bill.BillingMonth}`;
  const yr = bill.BillingYear || (bill as any).billing_year;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1050 }}>
      <div className="modal-card" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {bId}
              </span>
              <span className={`badge ${isPaid ? 'badge-vacant' : isOverdue ? 'badge-maintenance' : 'badge-occupied'}`}>
                {status}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Statement for <strong>{mStr} {yr}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Total Billed</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isPaid ? '#10b981' : '#f87171', fontFamily: 'var(--font-mono)' }}>
              ₹{(bill.TotalAmount || (bill as any).total_amount || 0).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Student Link Box */}
        <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Student</div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {sId}</div>
          </div>
          <button
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            onClick={() => { onClose(); onSelectStudent(sId); }}
          >
            Student Profile ↗
          </button>
        </div>

        {/* Itemized Charges */}
        <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          Itemized Line Charges
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Room Rent</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              ₹{bill.RoomRentCharges || (bill as any).room_rent_charges || 0}
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mess Fee</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              ₹{bill.MessCharges || (bill as any).mess_charges || 0}
            </div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Other Charges</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              ₹{bill.OtherCharges || (bill as any).other_charges || 0}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Payment Due Date:</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isOverdue ? '#ef4444' : 'var(--text-primary)' }}>
            {bill.DueDate || (bill as any).due_date}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <div style={{ display: 'flex', gap: '12px' }}>
            {!isPaid && (
              <button className="btn btn-primary" style={{ background: '#10b981' }} onClick={() => { onClose(); onPay(bill); }}>
                <CreditCard size={16} /> Record Payment
              </button>
            )}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn btn-secondary" title="Edit Charges" style={{ padding: '8px 12px' }} onClick={() => { onClose(); onEdit(bill); }}>
                <Edit2 size={16} />
              </button>
              <button className="btn btn-danger" title="Delete" style={{ padding: '8px 12px' }} onClick={() => { onClose(); onDelete(bId); }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
