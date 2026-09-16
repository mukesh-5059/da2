import React, { useEffect, useState } from 'react';
import { Student, Guardian, RoomAllocation, MessEnrollment, MonthlyBill, PaymentTransaction } from '../../types';
import { api } from '../../services/api';
import { X, User, Shield, Bed, Utensils, CreditCard, Mail, Phone, Calendar, MapPin, GraduationCap, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ student, onClose }) => {
  const [activeTab, setActiveTab] = useState<'housing' | 'guardians' | 'mess' | 'financials'>('housing');
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [allocations, setAllocations] = useState<RoomAllocation[]>([]);
  const [enrollments, setMessEnrollments] = useState<MessEnrollment[]>([]);
  const [bills, setBills] = useState<MonthlyBill[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      const sId = student.StudentID || (student as any).student_id;
      setLoading(true);
      Promise.all([
        api.getGuardians(sId),
        api.getAllocations(),
        api.getMessEnrollments(sId),
        api.getMonthlyBills(sId),
        api.getPaymentTransactions(),
      ])
        .then(([gList, aList, mList, bList, pList]) => {
          setGuardians(gList);
          setAllocations(aList.filter((a) => (a.StudentID || (a as any).student_id) === sId));
          setMessEnrollments(mList);
          setBills(bList);
          setTransactions(pList.filter((p) => (p.StudentID || (p as any).student_id) === sId));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [student]);

  if (!student) return null;

  const sId = student.StudentID || (student as any).student_id;
  const fName = student.FirstName || (student as any).name || (student as any).FirstName || '';
  const lName = student.LastName || '';
  const email = student.Email || (student as any).email;
  const phone = student.Phone || (student as any).phone;
  const dept = student.Department || (student as any).department || 'Computer Science';
  const bg = student.BloodGroup || (student as any).blood_group || 'O+';
  const activeAlloc = allocations.find((a) => !a.CheckOutDate);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ width: '700px', maxWidth: '95vw', padding: '28px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Header Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-accent)' }}>
              <User size={30} style={{ color: 'var(--accent-primary)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Student 360° Profile
              </div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                {fName} {lName}
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                ID: {sId} • {dept} • Blood Group: <strong style={{ color: '#ef4444' }}>{bg}</strong>
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Modal Navigation Pills */}
        <div className="tab-pills" style={{ marginBottom: '20px', width: '100%' }}>
          <button
            className={`tab-pill ${activeTab === 'housing' ? 'active' : ''}`}
            onClick={() => setActiveTab('housing')}
            style={{ flex: 1 }}
          >
            <Bed size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Housing
          </button>
          <button
            className={`tab-pill ${activeTab === 'guardians' ? 'active' : ''}`}
            onClick={() => setActiveTab('guardians')}
            style={{ flex: 1 }}
          >
            <Shield size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Guardians ({guardians.length})
          </button>
          <button
            className={`tab-pill ${activeTab === 'mess' ? 'active' : ''}`}
            onClick={() => setActiveTab('mess')}
            style={{ flex: 1 }}
          >
            <Utensils size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Mess ({enrollments.length})
          </button>
          <button
            className={`tab-pill ${activeTab === 'financials' ? 'active' : ''}`}
            onClick={() => setActiveTab('financials')}
            style={{ flex: 1 }}
          >
            <CreditCard size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Financials
          </button>
        </div>

        {/* Tab 1: Housing */}
        {activeTab === 'housing' && (
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Current Housing Status</h4>
            {activeAlloc ? (
              <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-medium)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    Room {activeAlloc.RoomNo}
                  </div>
                  <span className="badge badge-vacant">Active Resident</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Academic Year: {activeAlloc.AcademicYear} ({activeAlloc.Semester} Semester)</div>
                  <div>Checked-in: {activeAlloc.CheckInDate}</div>
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No active room allocation assigned for this student.
              </div>
            )}

            <h4 style={{ fontSize: '0.95rem', margin: '16px 0 8px', color: 'var(--text-secondary)' }}>Allocation History</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {allocations.map((a) => (
                <div key={a.AllocationID} style={{ background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Room <strong>{a.RoomNo}</strong> ({a.AcademicYear})</span>
                  <span style={{ color: 'var(--text-muted)' }}>In: {a.CheckInDate} {a.CheckOutDate ? `| Out: ${a.CheckOutDate}` : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Guardians */}
        {activeTab === 'guardians' && (
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Emergency Guardians & Family Contacts</h4>
            {guardians.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No guardian contacts registered.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {guardians.map((g) => (
                  <div key={g.GuardianID || (g as any).guardian_id} style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{g.GuardianName || (g as any).name}</strong>
                      <span className="badge badge-occupied">{g.Relationship || (g as any).relation}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {g.Phone || (g as any).phone}</div>
                      {(g.Address || (g as any).address) && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {g.Address || (g as any).address}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Mess */}
        {activeTab === 'mess' && (
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Mess Subscriptions & Meal Plans</h4>
            {enrollments.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No active mess enrollment records found.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {enrollments.map((m) => (
                  <div key={m.EnrollmentID || (m as any).enrollment_id} style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{m.MessName || m.MessID}</strong>
                      <span className="badge badge-vacant">Active Subscription</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Start Date: {m.StartDate || (m as any).start_date} {m.EndDate || (m as any).end_date ? `• End: ${m.EndDate || (m as any).end_date}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Financials */}
        {activeTab === 'financials' && (
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-primary)' }}>Monthly Bills & Statements</h4>
            {bills.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No monthly billing statements issued for this student yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto' }}>
                {bills.map((b) => {
                  const status = b.PaymentStatus || (b as any).payment_status || 'PENDING';
                  const isPaid = status === 'PAID';
                  const isOverdue = status === 'OVERDUE';
                  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const mStr = monthNames[b.BillingMonth || (b as any).billing_month] || `Month ${b.BillingMonth || (b as any).billing_month}`;
                  const yr = b.BillingYear || (b as any).billing_year;
                  const total = b.TotalAmount || (b as any).total_amount || 0;
                  const roomRent = b.RoomRentCharges || (b as any).room_rent_charges || 0;
                  const messFee = b.MessCharges || (b as any).mess_charges || 0;
                  const otherFee = b.OtherCharges || (b as any).other_charges || 0;

                  return (
                    <div key={b.BillID || (b as any).bill_id} style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                          Statement {mStr} {yr} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 400 }}>({b.BillID || (b as any).bill_id})</span>
                        </div>
                        <span className={`badge ${isPaid ? 'badge-vacant' : isOverdue ? 'badge-maintenance' : 'badge-occupied'}`}>
                          {status}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        <div>Room Rent: <strong>₹{roomRent}</strong></div>
                        <div>Mess: <strong>₹{messFee}</strong></div>
                        <div>Other: <strong>₹{otherFee}</strong></div>
                        <div style={{ textAlign: 'right', fontWeight: 700, color: isPaid ? '#10b981' : '#f87171', fontSize: '0.9rem' }}>
                          Total: ₹{total}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Due Date: {b.DueDate || (b as any).due_date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {transactions.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h5 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Payment Audit Ledger</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {transactions.map((t) => (
                    <div key={t.PaymentID || (t as any).payment_id} style={{ background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Ref: <strong style={{ fontFamily: 'var(--font-mono)' }}>{t.TransactionReference || (t as any).transaction_reference}</strong> ({t.PaymentMode || (t as any).payment_mode})</span>
                      <span style={{ color: '#10b981', fontWeight: 600 }}>₹{t.AmountPaid || (t as any).amount_paid} on {t.PaymentDate || (t as any).payment_date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
