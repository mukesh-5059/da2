import React from 'react';
import { PaymentTransaction } from '../../types';
import { Edit2, Trash2 } from 'lucide-react';

interface TransactionAuditModalProps {
  transaction: PaymentTransaction;
  onClose: () => void;
  onEdit: (transaction: PaymentTransaction) => void;
  onDelete?: (transactionId: string) => void;
  onSelectStudent: (studentId: string) => void;
  onSelectBill: (billId: string) => void;
}

export const TransactionAuditModal: React.FC<TransactionAuditModalProps> = ({
  transaction,
  onClose,
  onEdit,
  onDelete,
  onSelectStudent,
  onSelectBill,
}) => {
  const tId = transaction.PaymentID || (transaction as any).payment_id;
  const sId = transaction.StudentID || (transaction as any).student_id;
  const bId = transaction.BillID || (transaction as any).bill_id;
  const name = `${transaction.FirstName || ''} ${transaction.LastName || ''}`.trim() || sId || 'Student';

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1050 }}>
      <div className="modal-card" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {tId}
              </span>
              <span className="badge badge-vacant">
                {transaction.PaymentMode || (transaction as any).payment_mode}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Target Bill ID:{' '}
              <button 
                onClick={() => { onClose(); onSelectBill(bId); }} 
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-link)', background: 'none', border: 'none', padding: 0, textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
              >
                {bId}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Amount Settled</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
              ₹{(transaction.AmountPaid || (transaction as any).amount_paid || 0).toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Payer Resident:</span>
            <button
              onClick={() => { onClose(); sId && onSelectStudent(sId); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-link)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              {name} ({sId})
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Transaction Reference Code:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {transaction.TransactionReference || (transaction as any).transaction_reference || 'N/A'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Payment Date:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {transaction.PaymentDate || (transaction as any).payment_date}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={() => { onClose(); onEdit(transaction); }}>
              <Edit2 size={14} /> Edit Record
            </button>
            {onDelete && (
              <button className="btn btn-danger" onClick={() => { onClose(); onDelete(tId); }}>
                <Trash2 size={14} /> Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
