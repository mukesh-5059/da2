import React, { useState } from 'react';
import { MonthlyBill, PaymentTransaction, Student } from '../../types';
import { CreditCard, DollarSign, Plus, CheckCircle, Clock, AlertTriangle, Trash2, Search, ArrowUpRight, Edit2 } from 'lucide-react';
import { EditBillModal } from './EditBillModal';
import { RecordPaymentModal } from './RecordPaymentModal';
import { BillProfileModal } from './BillProfileModal';
import { TransactionAuditModal } from './TransactionAuditModal';
import { useTableFeatures, ColumnDef } from '../../hooks/useTableFeatures';
import { TableControls } from '../TableControls';
import { TableHeader } from '../TableHeader';
import { PaginationFooter } from '../PaginationFooter';
interface FinancialsTabProps {
  bills: MonthlyBill[];
  transactions: PaymentTransaction[];
  students: Student[];
  onSaveBill: (data: Partial<MonthlyBill>, isEdit?: boolean) => Promise<void>;
  onUpdateBillStatus: (billId: string, status: 'PAID' | 'PENDING' | 'OVERDUE') => Promise<void>;
  onDeleteBill: (billId: string) => Promise<void>;
  onRecordPayment: (data: Partial<PaymentTransaction>, isEdit?: boolean) => Promise<void>;
  onDeletePaymentTransaction?: (paymentId: string) => Promise<void>;
  onSelectStudent: (studentId: string) => void;
}

export const FinancialsTab: React.FC<FinancialsTabProps> = ({
  bills,
  transactions,
  students,
  onSaveBill,
  onUpdateBillStatus,
  onDeleteBill,
  onRecordPayment,
  onDeletePaymentTransaction,
  onSelectStudent,
}) => {
  const [subTab, setSubTab] = useState<'bills' | 'transactions'>('bills');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');
  
  const billsColumns: ColumnDef<MonthlyBill>[] = [
    { key: 'BillID', label: 'Bill ID', getValue: b => b.BillID || (b as any).bill_id },
    { key: 'StudentName', label: 'Student Name', getValue: b => `${b.FirstName || ''} ${b.LastName || ''}`.trim() || b.StudentName || b.StudentID || (b as any).student_id },
    { key: 'Period', label: 'Period', getValue: b => `${['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][b.BillingMonth || (b as any).billing_month] || `M${b.BillingMonth}`} ${b.BillingYear || (b as any).billing_year}` },
    { key: 'TotalAmount', label: 'Total Amount', getValue: b => b.TotalAmount || (b as any).total_amount || 0 },
    { key: 'Status', label: 'Status', getValue: b => b.PaymentStatus || (b as any).payment_status || 'PENDING' },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  const txnColumns: ColumnDef<PaymentTransaction>[] = [
    { key: 'TransactionID', label: 'Transaction ID', getValue: t => t.PaymentID || (t as any).payment_id },
    { key: 'StudentName', label: 'Student Name', getValue: t => `${t.FirstName || ''} ${t.LastName || ''}`.trim() || t.StudentID || (t as any).student_id || 'Student' },
    { key: 'PaymentMode', label: 'Payment Mode', getValue: t => t.PaymentMode || (t as any).payment_mode },
    { key: 'AmountPaid', label: 'Amount Paid', getValue: t => t.AmountPaid || (t as any).amount_paid || 0 },
    { key: 'PaymentDate', label: 'Payment Date', getValue: t => t.PaymentDate || (t as any).payment_date },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  // For bills, filter by status first
  const statusFilteredBills = bills.filter((b) => {
    const status = b.PaymentStatus || (b as any).payment_status || 'PENDING';
    if (statusFilter !== 'ALL' && status !== statusFilter) return false;
    return true;
  });

  const billsTable = useTableFeatures(statusFilteredBills, billsColumns);
  const txnTable = useTableFeatures(transactions, txnColumns);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  // Modals state
  const [showBillModal, setShowBillModal] = useState(false);
  const [editingBill, setEditingBill] = useState<Partial<MonthlyBill> | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showEditPayModal, setShowEditPayModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Partial<PaymentTransaction> | null>(null);
  const [selectedBillForPay, setSelectedBillForPay] = useState<MonthlyBill | null>(null);

  const handleOpenAddBill = () => {
    setEditingBill(null);
    setShowBillModal(true);
  };

  const handleOpenEditBill = (b: MonthlyBill) => {
    setEditingBill(b);
    setShowBillModal(true);
  };

  const handleOpenPay = (bill: MonthlyBill) => {
    setSelectedBillForPay(bill);
    setShowPayModal(true);
  };

  const handleOpenEditPayment = (t: PaymentTransaction) => {
    setEditingPayment(t);
    setShowEditPayModal(true);
  };

  // Calculations
  const pendingBills = bills.filter((b) => (b.PaymentStatus || (b as any).payment_status) === 'PENDING');
  const overdueBills = bills.filter((b) => (b.PaymentStatus || (b as any).payment_status) === 'OVERDUE');

  const totalPendingAmount = pendingBills.reduce((acc, b) => acc + (b.TotalAmount || (b as any).total_amount || 0), 0);
  const totalOverdueAmount = overdueBills.reduce((acc, b) => acc + (b.TotalAmount || (b as any).total_amount || 0), 0);
  
  const pendingStudentsCount = new Set(pendingBills.map(b => b.StudentID || (b as any).student_id)).size;
  const overdueStudentsCount = new Set(overdueBills.map(b => b.StudentID || (b as any).student_id)).size;

  return (
    <div>
      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card-glass" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Pending</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            ₹{totalPendingAmount.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="card-glass" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Overdue</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            ₹{totalOverdueAmount.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="card-glass" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Students</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {pendingStudentsCount}
          </div>
        </div>

        <div className="card-glass" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Overdue Students</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {overdueStudentsCount}
          </div>
        </div>
      </div>

      {/* Sub Navigation Pills */}
      <div className="tab-pills" style={{ marginBottom: '24px' }}>
        <button
          className={`tab-pill ${subTab === 'bills' ? 'active' : ''}`}
          onClick={() => setSubTab('bills')}
        >
          <CreditCard size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Monthly Student Bills ({bills.length})
        </button>

        <button
          className={`tab-pill ${subTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setSubTab('transactions')}
        >
          <DollarSign size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Payment Transactions ({transactions.length})
        </button>
      </div>

      {subTab === 'bills' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Monthly Hostel & Mess Bills</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Clean summary table (`MONTHLY_BILL` relation). Click any row or "View Details" to open full breakdown modal.
              </p>
            </div>

            <button className="btn btn-primary" onClick={handleOpenAddBill}>
              <Plus size={16} />
              Generate Monthly Bill
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            {/* Status Filter Badges */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as const).map((st) => (
                <button
                  key={st}
                  className={`btn ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 12px', fontSize: '0.8rem', borderRadius: '20px' }}
                  onClick={() => setStatusFilter(st)}
                >
                  {st}
                </button>
              ))}
            </div>

            <TableControls 
              columns={billsColumns} 
              searchCol={billsTable.searchCol} 
              setSearchCol={billsTable.setSearchCol} 
              searchText={billsTable.searchText} 
              setSearchText={billsTable.setSearchText}
            />
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <TableHeader columns={billsColumns} sortCol={billsTable.sortCol} sortDir={billsTable.sortDir} onSort={billsTable.handleSort} />
              <tbody>
                {billsTable.processedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No financial billing records match the selected status or search filter.
                    </td>
                  </tr>
                ) : (
                  billsTable.paginatedData.map((b) => {
                    const status = b.PaymentStatus || (b as any).payment_status || 'PENDING';
                    const isPaid = status === 'PAID';
                    const isOverdue = status === 'OVERDUE';
                    const sId = b.StudentID || (b as any).student_id;
                    const bId = b.BillID || (b as any).bill_id;
                    const name = `${b.FirstName || ''} ${b.LastName || ''}`.trim() || b.StudentName || sId;
                    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const mStr = monthNames[b.BillingMonth || (b as any).billing_month] || `M${b.BillingMonth}`;
                    const yr = b.BillingYear || (b as any).billing_year;

                    return (
                      <tr key={bId} style={{ cursor: 'pointer' }} onClick={() => setSelectedBillId(bId)}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                          {bId}
                        </td>
                        <td>
                          <div
                            style={{ fontWeight: 600, color: 'var(--text-link)', cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectStudent(sId);
                            }}
                            title="Click to view Student Profile"
                          >
                            {name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ID: {sId}</div>
                        </td>
                        <td>
                          <strong>{mStr} {yr}</strong>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                          ₹{(b.TotalAmount || (b as any).total_amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span className={`badge ${isPaid ? 'badge-vacant' : isOverdue ? 'badge-maintenance' : 'badge-occupied'}`}>
                            {status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          >
                            <ArrowUpRight size={13} /> View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <PaginationFooter
              currentPage={billsTable.currentPage}
              totalPages={billsTable.totalPages}
              setCurrentPage={billsTable.setCurrentPage}
              itemsPerPage={billsTable.itemsPerPage}
              totalItems={billsTable.processedData.length}
            />
          </div>
        </div>
      )}

      {subTab === 'transactions' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Payment Ledger & Audit Log</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Clean transaction table (`PAYMENT_TRANSACTION` relation). Click row or "View Details" to open audit modal.
              </p>
            </div>
            <TableControls 
              columns={txnColumns} 
              searchCol={txnTable.searchCol} 
              setSearchCol={txnTable.setSearchCol} 
              searchText={txnTable.searchText} 
              setSearchText={txnTable.setSearchText}
            />
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <TableHeader columns={txnColumns} sortCol={txnTable.sortCol} sortDir={txnTable.sortDir} onSort={txnTable.handleSort} />
              <tbody>
                {txnTable.processedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No payment transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  txnTable.paginatedData.map((t) => {
                    const tId = t.PaymentID || (t as any).payment_id;
                    const sId = t.StudentID || (t as any).student_id;
                    const name = `${t.FirstName || ''} ${t.LastName || ''}`.trim() || sId || 'Student';

                    return (
                      <tr key={tId} style={{ cursor: 'pointer' }} onClick={() => setSelectedTransactionId(tId)}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                          {tId}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bill: {t.BillID || (t as any).bill_id}</div>
                        </td>
                        <td>
                          <span className="badge badge-vacant">{t.PaymentMode || (t as any).payment_mode}</span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#10b981' }}>
                          ₹{(t.AmountPaid || (t as any).amount_paid || 0).toLocaleString('en-IN')}
                        </td>
                        <td>{t.PaymentDate || (t as any).payment_date}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          >
                            <ArrowUpRight size={13} /> View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <PaginationFooter
              currentPage={txnTable.currentPage}
              totalPages={txnTable.totalPages}
              setCurrentPage={txnTable.setCurrentPage}
              itemsPerPage={txnTable.itemsPerPage}
              totalItems={txnTable.processedData.length}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedBillId && (() => {
        const b = bills.find(item => (item.BillID || (item as any).bill_id) === selectedBillId);
        if (!b) return null;
        return (
          <BillProfileModal
            bill={b}
            onClose={() => setSelectedBillId(null)}
            onEdit={handleOpenEditBill}
            onPay={handleOpenPay}
            onDelete={onDeleteBill}
            onSelectStudent={onSelectStudent}
          />
        );
      })()}

      {selectedTransactionId && (() => {
        const t = transactions.find(item => (item.PaymentID || (item as any).payment_id) === selectedTransactionId);
        if (!t) return null;
        return (
          <TransactionAuditModal
            transaction={t}
            onClose={() => setSelectedTransactionId(null)}
            onEdit={handleOpenEditPayment}
            onDelete={onDeletePaymentTransaction}
            onSelectStudent={onSelectStudent}
            onSelectBill={(bId) => setSelectedBillId(bId)}
          />
        );
      })()}

      {showBillModal && (
        <EditBillModal
          bill={editingBill}
          students={students}
          onSave={onSaveBill}
          onClose={() => setShowBillModal(false)}
        />
      )}

      {showPayModal && selectedBillForPay && (
        <RecordPaymentModal
          payment={null}
          bill={selectedBillForPay}
          onSave={async (data) => {
            await onRecordPayment(data);
            const bId = selectedBillForPay.BillID || (selectedBillForPay as any).bill_id;
            await onUpdateBillStatus(bId, 'PAID');
          }}
          onClose={() => setShowPayModal(false)}
        />
      )}

      {showEditPayModal && (
        <RecordPaymentModal
          payment={editingPayment}
          bill={null}
          onSave={(data) => onRecordPayment(data, true)}
          onClose={() => setShowEditPayModal(false)}
        />
      )}
    </div>
  );
};
