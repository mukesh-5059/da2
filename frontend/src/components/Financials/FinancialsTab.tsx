import React, { useState, useEffect } from 'react';
import { MonthlyBill, PaymentTransaction, Student, FinancialStats } from '../../types';
import { CreditCard, DollarSign, Plus, ArrowUpRight } from 'lucide-react';
import { api } from '../../services/api';
import { EditBillModal } from './EditBillModal';
import { RecordPaymentModal } from './RecordPaymentModal';
import { BillProfileModal } from './BillProfileModal';
import { TransactionAuditModal } from './TransactionAuditModal';
import { ColumnDef } from '../../hooks/useTableFeatures';
import { TableControls } from '../TableControls';
import { TableHeader } from '../TableHeader';
import { PaginationFooter } from '../PaginationFooter';

interface FinancialsTabProps {
  bills?: MonthlyBill[];
  transactions?: PaymentTransaction[];
  students: Student[];
  onSaveBill: (data: Partial<MonthlyBill>, isEdit?: boolean) => Promise<void>;
  onUpdateBillStatus: (billId: string, status: 'PAID' | 'PENDING' | 'OVERDUE') => Promise<void>;
  onDeleteBill: (billId: string) => Promise<void>;
  onRecordPayment: (data: Partial<PaymentTransaction>, isEdit?: boolean) => Promise<void>;
  onDeletePaymentTransaction?: (paymentId: string) => Promise<void>;
  onSelectStudent: (studentId: string) => void;
}

export const FinancialsTab: React.FC<FinancialsTabProps> = ({
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

  // Summary Stats from backend
  const [stats, setStats] = useState<FinancialStats>({
    totalPendingAmount: 0,
    totalOverdueAmount: 0,
    pendingStudentsCount: 0,
    overdueStudentsCount: 0,
  });

  const loadStats = async () => {
    try {
      const s = await api.getFinancialStats();
      setStats(s);
    } catch (e) {
      console.error('Failed to load financial stats', e);
    }
  };

  // Bills server-side state
  const [billsList, setBillsList] = useState<MonthlyBill[]>([]);
  const [billsTotalRecords, setBillsTotalRecords] = useState(0);
  const [billsLoading, setBillsLoading] = useState(false);
  const [billsCurrentPage, setBillsCurrentPage] = useState(1);
  const [billsSearchCol, setBillsSearchCol] = useState('all');
  const [billsSearchText, setBillsSearchText] = useState('');
  const [billsSortCol, setBillsSortCol] = useState<string | null>(null);
  const [billsSortDir, setBillsSortDir] = useState<'asc' | 'desc'>('asc');

  // Transactions server-side state
  const [txnsList, setTxnsList] = useState<PaymentTransaction[]>([]);
  const [txnsTotalRecords, setTxnsTotalRecords] = useState(0);
  const [txnsLoading, setTxnsLoading] = useState(false);
  const [txnsCurrentPage, setTxnsCurrentPage] = useState(1);
  const [txnsSearchCol, setTxnsSearchCol] = useState('all');
  const [txnsSearchText, setTxnsSearchText] = useState('');
  const [txnsSortCol, setTxnsSortCol] = useState<string | null>(null);
  const [txnsSortDir, setTxnsSortDir] = useState<'asc' | 'desc'>('asc');

  const pageSize = 25;

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

  const loadBills = async () => {
    setBillsLoading(true);
    try {
      const params: any = {
        page: billsCurrentPage,
        limit: pageSize,
        search: billsSearchText.trim(),
        sortCol: billsSortCol || '',
        sortDir: billsSortDir,
      };
      if (statusFilter !== 'ALL') {
        params.payment_status = statusFilter;
      }
      const res: any = await api.getMonthlyBills(params);
      if (res && typeof res === 'object' && 'totalRecords' in res) {
        setBillsList(res.data || []);
        setBillsTotalRecords(Number(res.totalRecords) || 0);
      } else if (Array.isArray(res)) {
        setBillsList(res);
        setBillsTotalRecords(res.length);
      }
    } catch (e) {
      console.error('Failed to load monthly bills', e);
    } finally {
      setBillsLoading(false);
    }
  };

  const loadTxns = async () => {
    setTxnsLoading(true);
    try {
      const params: any = {
        page: txnsCurrentPage,
        limit: pageSize,
        search: txnsSearchText.trim(),
        sortCol: txnsSortCol || '',
        sortDir: txnsSortDir,
      };
      const res: any = await api.getPaymentTransactions(params);
      if (res && typeof res === 'object' && 'totalRecords' in res) {
        setTxnsList(res.data || []);
        setTxnsTotalRecords(Number(res.totalRecords) || 0);
      } else if (Array.isArray(res)) {
        setTxnsList(res);
        setTxnsTotalRecords(res.length);
      }
    } catch (e) {
      console.error('Failed to load payment transactions', e);
    } finally {
      setTxnsLoading(false);
    }
  };

  // Initial stats load
  useEffect(() => {
    loadStats();
  }, []);

  // Reset page when bills filters change
  useEffect(() => {
    setBillsCurrentPage(1);
  }, [billsSearchText, statusFilter, billsSortCol, billsSortDir]);

  // Load bills when page or filters change
  useEffect(() => {
    loadBills();
  }, [billsCurrentPage, billsSearchText, statusFilter, billsSortCol, billsSortDir]);

  // Reset page when txns filters change
  useEffect(() => {
    setTxnsCurrentPage(1);
  }, [txnsSearchText, txnsSortCol, txnsSortDir]);

  // Load txns when page or filters change
  useEffect(() => {
    loadTxns();
  }, [txnsCurrentPage, txnsSearchText, txnsSortCol, txnsSortDir]);

  const handleBillsSort = (key: string) => {
    if (billsSortCol === key) {
      setBillsSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setBillsSortCol(key);
      setBillsSortDir('asc');
    }
  };

  const handleTxnsSort = (key: string) => {
    if (txnsSortCol === key) {
      setTxnsSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setTxnsSortCol(key);
      setTxnsSortDir('asc');
    }
  };

  const refreshAll = () => {
    loadStats();
    loadBills();
    loadTxns();
  };

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

  const billsTotalPages = Math.ceil(billsTotalRecords / pageSize) || 1;
  const txnsTotalPages = Math.ceil(txnsTotalRecords / pageSize) || 1;

  return (
    <div>
      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card-glass" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Pending</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            ₹{stats.totalPendingAmount.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="card-glass" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Overdue</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            ₹{stats.totalOverdueAmount.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="card-glass" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Students</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {stats.pendingStudentsCount}
          </div>
        </div>

        <div className="card-glass" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Overdue Students</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {stats.overdueStudentsCount}
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
          Monthly Student Bills ({billsTotalRecords})
        </button>

        <button
          className={`tab-pill ${subTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setSubTab('transactions')}
        >
          <DollarSign size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Payment Transactions ({txnsTotalRecords})
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
              searchCol={billsSearchCol} 
              setSearchCol={setBillsSearchCol} 
              searchText={billsSearchText} 
              setSearchText={setBillsSearchText}
            />
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <TableHeader columns={billsColumns} sortCol={billsSortCol} sortDir={billsSortDir} onSort={handleBillsSort} />
              <tbody>
                {billsLoading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Loading billing records...
                    </td>
                  </tr>
                ) : billsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No financial billing records match the selected status or search filter.
                    </td>
                  </tr>
                ) : (
                  billsList.map((b) => {
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
              currentPage={billsCurrentPage}
              totalPages={billsTotalPages}
              setCurrentPage={setBillsCurrentPage}
              itemsPerPage={pageSize}
              totalItems={billsTotalRecords}
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
              searchCol={txnsSearchCol} 
              setSearchCol={setTxnsSearchCol} 
              searchText={txnsSearchText} 
              setSearchText={setTxnsSearchText}
            />
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <TableHeader columns={txnColumns} sortCol={txnsSortCol} sortDir={txnsSortDir} onSort={handleTxnsSort} />
              <tbody>
                {txnsLoading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Loading payment transactions...
                    </td>
                  </tr>
                ) : txnsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No payment transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  txnsList.map((t) => {
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
              currentPage={txnsCurrentPage}
              totalPages={txnsTotalPages}
              setCurrentPage={setTxnsCurrentPage}
              itemsPerPage={pageSize}
              totalItems={txnsTotalRecords}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedBillId && (() => {
        const b = billsList.find(item => (item.BillID || (item as any).bill_id) === selectedBillId);
        if (!b) return null;
        return (
          <BillProfileModal
            bill={b}
            onClose={() => setSelectedBillId(null)}
            onEdit={handleOpenEditBill}
            onPay={handleOpenPay}
            onDelete={async (id) => {
              await onDeleteBill(id);
              setSelectedBillId(null);
              refreshAll();
            }}
            onSelectStudent={onSelectStudent}
          />
        );
      })()}

      {selectedTransactionId && (() => {
        const t = txnsList.find(item => (item.PaymentID || (item as any).payment_id) === selectedTransactionId);
        if (!t) return null;
        return (
          <TransactionAuditModal
            transaction={t}
            onClose={() => setSelectedTransactionId(null)}
            onEdit={handleOpenEditPayment}
            onDelete={async (id) => {
              if (onDeletePaymentTransaction) {
                await onDeletePaymentTransaction(id);
              }
              setSelectedTransactionId(null);
              refreshAll();
            }}
            onSelectStudent={onSelectStudent}
            onSelectBill={(bId) => setSelectedBillId(bId)}
          />
        );
      })()}

      {showBillModal && (
        <EditBillModal
          bill={editingBill}
          students={students}
          onSave={async (data, isEdit) => {
            await onSaveBill(data, isEdit);
            setShowBillModal(false);
            refreshAll();
          }}
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
            setShowPayModal(false);
            refreshAll();
          }}
          onClose={() => setShowPayModal(false)}
        />
      )}

      {showEditPayModal && (
        <RecordPaymentModal
          payment={editingPayment}
          bill={null}
          onSave={async (data) => {
            await onRecordPayment(data, true);
            setShowEditPayModal(false);
            refreshAll();
          }}
          onClose={() => setShowEditPayModal(false)}
        />
      )}
    </div>
  );
};
