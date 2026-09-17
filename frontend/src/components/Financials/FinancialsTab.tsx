import React, { useState } from 'react';
import { MonthlyBill, PaymentTransaction, Student } from '../../types';
import { CreditCard, DollarSign, Plus, CheckCircle, Clock, AlertTriangle, Trash2, Search, ArrowUpRight, Edit2 } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  // Modals state
  const [showBillModal, setShowBillModal] = useState(false);
  const [editingBill, setEditingBill] = useState<Partial<MonthlyBill> | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showEditPayModal, setShowEditPayModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Partial<PaymentTransaction> | null>(null);
  const [selectedBillForPay, setSelectedBillForPay] = useState<MonthlyBill | null>(null);

  const [billFormData, setBillFormData] = useState<Partial<MonthlyBill>>({
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

  const [payFormData, setPayFormData] = useState<Partial<PaymentTransaction>>({
    PaymentID: `PAY-${Date.now().toString().slice(-4)}`,
    BillID: '',
    AmountPaid: 0,
    PaymentMode: 'UPI',
    PaymentDate: new Date().toISOString().split('T')[0],
    TransactionReference: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
  });

  const handleOpenAddBill = () => {
    setEditingBill(null);
    setBillFormData({
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
    setShowBillModal(true);
  };

  const handleOpenEditBill = (b: MonthlyBill) => {
    setEditingBill(b);
    setBillFormData({
      BillID: b.BillID || (b as any).bill_id,
      StudentID: b.StudentID || (b as any).student_id,
      BillingMonth: b.BillingMonth || (b as any).billing_month || (new Date().getMonth() + 1),
      BillingYear: b.BillingYear || (b as any).billing_year || new Date().getFullYear(),
      RoomRentCharges: b.RoomRentCharges || (b as any).room_rent_charges || 0,
      MessCharges: b.MessCharges || (b as any).mess_charges || 0,
      OtherCharges: b.OtherCharges || (b as any).other_charges || 0,
      TotalAmount: b.TotalAmount || (b as any).total_amount || 0,
      DueDate: b.DueDate || (b as any).due_date || new Date().toISOString().split('T')[0],
      PaymentStatus: (b.PaymentStatus || (b as any).payment_status || 'PENDING') as any,
    });
    setShowBillModal(true);
  };

  const handleBillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = (Number(billFormData.RoomRentCharges) || 0) + (Number(billFormData.MessCharges) || 0) + (Number(billFormData.OtherCharges) || 0);
    await onSaveBill({ ...billFormData, TotalAmount: total }, !!editingBill);
    setShowBillModal(false);
  };

  const handleOpenPay = (bill: MonthlyBill) => {
    setSelectedBillForPay(bill);
    setPayFormData({
      PaymentID: `PAY-${Date.now().toString().slice(-4)}`,
      BillID: bill.BillID || (bill as any).bill_id,
      AmountPaid: bill.TotalAmount || (bill as any).total_amount,
      PaymentMode: 'UPI',
      PaymentDate: new Date().toISOString().split('T')[0],
      TransactionReference: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    });
    setShowPayModal(true);
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRecordPayment(payFormData);
    if (selectedBillForPay) {
      const bId = selectedBillForPay.BillID || (selectedBillForPay as any).bill_id;
      await onUpdateBillStatus(bId, 'PAID');
    }
    setShowPayModal(false);
  };

  const handleOpenEditPayment = (t: PaymentTransaction) => {
    setEditingPayment(t);
    setPayFormData({
      PaymentID: t.PaymentID || (t as any).payment_id,
      BillID: t.BillID || (t as any).bill_id,
      AmountPaid: t.AmountPaid || (t as any).amount_paid || 0,
      PaymentMode: (t.PaymentMode || (t as any).payment_mode || 'UPI') as any,
      PaymentDate: t.PaymentDate || (t as any).payment_date || new Date().toISOString().split('T')[0],
      TransactionReference: t.TransactionReference || (t as any).transaction_reference || '',
    });
    setShowEditPayModal(true);
  };

  const handleEditPaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRecordPayment(payFormData, true);
    setShowEditPayModal(false);
  };

  // Calculations
  const totalBilled = bills.reduce((acc, b) => acc + (b.TotalAmount || (b as any).total_amount || 0), 0);
  const totalCollected = bills
    .filter((b) => (b.PaymentStatus || (b as any).payment_status) === 'PAID')
    .reduce((acc, b) => acc + (b.TotalAmount || (b as any).total_amount || 0), 0);
  const totalOutstanding = totalBilled - totalCollected;
  const overdueCount = bills.filter((b) => (b.PaymentStatus || (b as any).payment_status) === 'OVERDUE').length;

  const filteredBills = bills.filter((b) => {
    const status = b.PaymentStatus || (b as any).payment_status || 'PENDING';
    if (statusFilter !== 'ALL' && status !== statusFilter) return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const sId = b.StudentID || (b as any).student_id || '';
    const bId = b.BillID || (b as any).bill_id || '';
    const sName = `${b.FirstName || ''} ${b.LastName || ''} ${b.StudentName || ''}`.toLowerCase();
    return sId.toLowerCase().includes(q) || bId.toLowerCase().includes(q) || sName.includes(q);
  });

  return (
    <div>
      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card-glass" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Invoiced</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            ₹{totalBilled.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="card-glass" style={{ padding: '16px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 600 }}>Collected Dues</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="card-glass" style={{ padding: '16px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 600 }}>Outstanding Balance</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="card-glass" style={{ padding: '16px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#ef4444', fontWeight: 600 }}>Overdue Accounts</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {overdueCount} Students
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

            <div className="search-bar" style={{ padding: '8px 14px', width: '280px' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search bill or student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Student Name</th>
                  <th>Period</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No financial billing records match the selected status or search filter.
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((b) => {
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
                          <div style={{ fontWeight: 600 }}>{name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {sId}</div>
                        </td>
                        <td>
                          <strong>{mStr} {yr}</strong>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: isPaid ? '#10b981' : '#f87171' }}>
                          ₹{(b.TotalAmount || (b as any).total_amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td>
                          <span className={`badge ${isPaid ? 'badge-vacant' : isOverdue ? 'badge-maintenance' : 'badge-occupied'}`}>
                            {status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'var(--accent-glow)', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}
                              onClick={() => setSelectedBillId(bId)}
                            >
                              <ArrowUpRight size={13} /> View Details
                            </button>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              onClick={() => handleOpenEditBill(b)}
                              title="Edit Bill Charges"
                            >
                              <Edit2 size={13} />
                            </button>
                            {!isPaid && (
                              <button
                                className="btn btn-secondary"
                                style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                                onClick={() => handleOpenPay(b)}
                                title="Record Payment"
                              >
                                Pay
                              </button>
                            )}
                            <button
                              className="btn btn-danger"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              onClick={() => onDeleteBill(bId)}
                              title="Delete Bill"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'transactions' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Payment Ledger & Audit Log</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Clean transaction table (`PAYMENT_TRANSACTION` relation). Click row or "View Details" to open audit modal.
            </p>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Student Name</th>
                  <th>Payment Mode</th>
                  <th>Amount Paid</th>
                  <th>Payment Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No payment transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => {
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
                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'var(--accent-glow)', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}
                              onClick={() => setSelectedTransactionId(tId)}
                            >
                              <ArrowUpRight size={13} /> View Details
                            </button>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              onClick={() => handleOpenEditPayment(t)}
                              title="Edit Transaction"
                            >
                              <Edit2 size={13} />
                            </button>
                            {onDeletePaymentTransaction && (
                              <button
                                className="btn btn-danger"
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                onClick={() => onDeletePaymentTransaction(tId)}
                                title="Delete Transaction"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bill Detail Popup Modal */}
      {selectedBillId && (() => {
        const b = bills.find(item => (item.BillID || (item as any).bill_id) === selectedBillId);
        if (!b) return null;
        const bId = b.BillID || (b as any).bill_id;
        const status = b.PaymentStatus || (b as any).payment_status || 'PENDING';
        const isPaid = status === 'PAID';
        const isOverdue = status === 'OVERDUE';
        const sId = b.StudentID || (b as any).student_id;
        const name = `${b.FirstName || ''} ${b.LastName || ''}`.trim() || b.StudentName || sId;
        const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mStr = monthNames[b.BillingMonth || (b as any).billing_month] || `M${b.BillingMonth}`;
        const yr = b.BillingYear || (b as any).billing_year;

        return (
          <div className="modal-backdrop" onClick={() => setSelectedBillId(null)}>
            <div className="modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
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
                    ₹{(b.TotalAmount || (b as any).total_amount || 0).toLocaleString('en-IN')}
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
                  onClick={() => { setSelectedBillId(null); onSelectStudent(sId); }}
                >
                  360° Student Profile
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
                    ₹{b.RoomRentCharges || (b as any).room_rent_charges || 0}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mess Fee</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    ₹{b.MessCharges || (b as any).mess_charges || 0}
                  </div>
                </div>
                <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Other Charges</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    ₹{b.OtherCharges || (b as any).other_charges || 0}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Payment Due Date:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isOverdue ? '#ef4444' : 'var(--text-primary)' }}>
                  {b.DueDate || (b as any).due_date}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedBillId(null)}>
                  Close
                </button>
                <button className="btn btn-secondary" onClick={() => { setSelectedBillId(null); handleOpenEditBill(b); }}>
                  <Edit2 size={14} /> Edit Charges
                </button>
                {!isPaid && (
                  <button className="btn btn-primary" style={{ background: '#10b981' }} onClick={() => { setSelectedBillId(null); handleOpenPay(b); }}>
                    <CreditCard size={14} /> Record Payment
                  </button>
                )}
                <button className="btn btn-danger" onClick={() => { setSelectedBillId(null); onDeleteBill(bId); }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Payment Transaction Detail Popup Modal */}
      {selectedTransactionId && (() => {
        const t = transactions.find(item => (item.PaymentID || (item as any).payment_id) === selectedTransactionId);
        if (!t) return null;
        const tId = t.PaymentID || (t as any).payment_id;
        const sId = t.StudentID || (t as any).student_id;
        const name = `${t.FirstName || ''} ${t.LastName || ''}`.trim() || sId || 'Student';

        return (
          <div className="modal-backdrop" onClick={() => setSelectedTransactionId(null)}>
            <div className="modal-card" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                      {tId}
                    </span>
                    <span className="badge badge-vacant">
                      {t.PaymentMode || (t as any).payment_mode}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Target Bill ID: <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{t.BillID || (t as any).bill_id}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Amount Settled</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                    ₹{(t.AmountPaid || (t as any).amount_paid || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Payer Resident:</span>
                  <button
                    onClick={() => { setSelectedTransactionId(null); sId && onSelectStudent(sId); }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                  >
                    {name} ({sId})
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Transaction Reference Code:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {t.TransactionReference || (t as any).transaction_reference || 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Payment Date:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {t.PaymentDate || (t as any).payment_date}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedTransactionId(null)}>
                  Close
                </button>
                <button className="btn btn-secondary" onClick={() => { setSelectedTransactionId(null); handleOpenEditPayment(t); }}>
                  <Edit2 size={14} /> Edit Record
                </button>
                {onDeletePaymentTransaction && (
                  <button className="btn btn-danger" onClick={() => { setSelectedTransactionId(null); onDeletePaymentTransaction(tId); }}>
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Generate Bill Modal */}
      {showBillModal && (
        <div className="modal-backdrop" onClick={() => setShowBillModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Generate Monthly Bill</h3>
            <form onSubmit={handleBillSubmit}>
              <div className="form-group">
                <label>Bill ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={billFormData.BillID || ''}
                  onChange={(e) => setBillFormData({ ...billFormData, BillID: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Student</label>
                <select
                  className="form-select"
                  value={billFormData.StudentID || ''}
                  onChange={(e) => setBillFormData({ ...billFormData, StudentID: e.target.value })}
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
                    value={billFormData.BillingMonth || 9}
                    onChange={(e) => setBillFormData({ ...billFormData, BillingMonth: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Billing Year</label>
                  <input
                    type="number"
                    className="form-input"
                    value={billFormData.BillingYear || 2026}
                    onChange={(e) => setBillFormData({ ...billFormData, BillingYear: Number(e.target.value) })}
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
                    value={billFormData.RoomRentCharges || 0}
                    onChange={(e) => setBillFormData({ ...billFormData, RoomRentCharges: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Mess Fee (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={billFormData.MessCharges || 0}
                    onChange={(e) => setBillFormData({ ...billFormData, MessCharges: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Other (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={billFormData.OtherCharges || 0}
                    onChange={(e) => setBillFormData({ ...billFormData, OtherCharges: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={billFormData.DueDate || ''}
                  onChange={(e) => setBillFormData({ ...billFormData, DueDate: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowBillModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Generate Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPayModal && (
        <div className="modal-backdrop" onClick={() => setShowPayModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Record Payment</h3>
            <form onSubmit={handlePaySubmit}>
              <div className="form-group">
                <label>Payment ID</label>
                <input type="text" className="form-input" value={payFormData.PaymentID || ''} readOnly />
              </div>

              <div className="form-group">
                <label>Bill ID</label>
                <input type="text" className="form-input" value={payFormData.BillID || ''} readOnly />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Amount Paid (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={payFormData.AmountPaid || 0}
                    onChange={(e) => setPayFormData({ ...payFormData, AmountPaid: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Payment Mode</label>
                  <select
                    className="form-select"
                    value={payFormData.PaymentMode || 'UPI'}
                    onChange={(e) => setPayFormData({ ...payFormData, PaymentMode: e.target.value as any })}
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
                  value={payFormData.TransactionReference || ''}
                  onChange={(e) => setPayFormData({ ...payFormData, TransactionReference: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPayModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
