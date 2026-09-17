import React, { useState } from 'react';
import { RoomAllocation, Student, Room } from '../../types';
import { Plus, UserCheck, Calendar, LogOut, CheckCircle, Clock, Edit2, Trash2 } from 'lucide-react';

interface AllocationsTabProps {
  allocations: RoomAllocation[];
  students: Student[];
  rooms: Room[];
  onAllocate: (data: Partial<RoomAllocation>, isEdit?: boolean) => Promise<void>;
  onCheckOut: (allocationId: string) => Promise<void>;
  onDeleteAllocation?: (allocationId: string) => Promise<void>;
  onSelectStudent?: (studentId: string) => void;
}

export const AllocationsTab: React.FC<AllocationsTabProps> = ({
  allocations,
  students,
  rooms,
  onAllocate,
  onCheckOut,
  onDeleteAllocation,
  onSelectStudent,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingAlloc, setEditingAlloc] = useState<Partial<RoomAllocation> | null>(null);
  const [selectedAllocId, setSelectedAllocId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<RoomAllocation>>({
    AllocationID: `ALLOC-${Date.now().toString().slice(-4)}`,
    StudentID: students[0]?.StudentID || '',
    RoomNo: rooms.find((r) => r.Status === 'Vacant')?.RoomNo || rooms[0]?.RoomNo || '',
    AcademicYear: '2025-26',
    Semester: 'Fall',
    CheckInDate: new Date().toISOString().split('T')[0],
  });

  const handleOpenAdd = () => {
    setEditingAlloc(null);
    setFormData({
      AllocationID: `ALLOC-${Date.now().toString().slice(-4)}`,
      StudentID: students[0]?.StudentID || '',
      RoomNo: rooms.find((r) => r.Status === 'Vacant')?.RoomNo || rooms[0]?.RoomNo || '',
      AcademicYear: '2025-26',
      Semester: 'Fall',
      CheckInDate: new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const handleOpenEdit = (alloc: RoomAllocation) => {
    setEditingAlloc(alloc);
    setFormData({
      AllocationID: alloc.AllocationID || (alloc as any).allocation_id,
      StudentID: alloc.StudentID || (alloc as any).student_id,
      RoomNo: alloc.RoomNo || (alloc as any).room_no,
      AcademicYear: alloc.AcademicYear || (alloc as any).academic_year || '2025-26',
      Semester: alloc.Semester || (alloc as any).semester || 'Fall',
      CheckInDate: alloc.CheckInDate || (alloc as any).check_in_date || new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAllocate(formData, !!editingAlloc);
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Room Allocation History</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Master-Detail View (`ROOM_ALLOCATION` relation). Select an allocation record to inspect details or process check-out.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          Allocate Room
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Allocation ID</th>
              <th>Student Name</th>
              <th>Room No</th>
              <th>Academic Term</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((alloc) => {
              const allocId = alloc.AllocationID || (alloc as any).allocation_id;
              const isActive = !alloc.CheckOutDate;
              const sId = alloc.StudentID || (alloc as any).student_id;
              const studentName = alloc.StudentName || sId;

              return (
                <tr key={allocId} style={{ cursor: 'pointer' }} onClick={() => setSelectedAllocId(allocId)}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {allocId}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {sId}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    {alloc.RoomNo}
                  </td>
                  <td>{alloc.AcademicYear} ({alloc.Semester})</td>
                  <td>
                    {isActive ? (
                      <span className="badge badge-vacant" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> Active
                      </span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(107, 114, 128, 0.2)', color: '#9ca3af' }}>
                        Checked Out
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '0.75rem', background: 'var(--accent-glow)', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}
                      onClick={() => setSelectedAllocId(allocId)}
                    >
                      <UserCheck size={13} /> View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Allocation Detail Popup Modal */}
      {selectedAllocId && (() => {
        const alloc = allocations.find(a => (a.AllocationID || (a as any).allocation_id) === selectedAllocId);
        if (!alloc) return null;
        const allocId = alloc.AllocationID || (alloc as any).allocation_id;
        const isActive = !alloc.CheckOutDate;
        const sId = alloc.StudentID || (alloc as any).student_id;
        const studentName = alloc.StudentName || sId;
        const checkOutDate = alloc.CheckOutDate || (alloc as any).check_out_date;

        return (
          <div className="modal-backdrop" onClick={() => setSelectedAllocId(null)}>
            <div className="modal-card" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent-primary)' }}>
                    {allocId}
                  </span>
                  {isActive ? (
                    <span className="badge badge-vacant" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={12} /> Active Resident
                    </span>
                  ) : (
                    <span className="badge" style={{ background: 'rgba(107, 114, 128, 0.2)', color: '#9ca3af' }}>
                      Checked Out
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedAllocId(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer', padding: '4px' }}
                >
                  ✕
                </button>
              </div>

              {/* Main Info Box: Resident & Room */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                    Assigned Resident
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '2px' }}>
                    {studentName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    ID: {sId}
                  </div>
                  {onSelectStudent && (
                    <button
                      onClick={() => { setSelectedAllocId(null); onSelectStudent(sId); }}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                    >
                      View Student Profile →
                    </button>
                  )}
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                    Assigned Room
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', wordBreak: 'break-word' }}>
                    {alloc.RoomNo}
                  </div>
                </div>
              </div>

              {/* Term & Dates Grid */}
              <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isActive ? '1fr 1fr' : '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Academic Term</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {alloc.AcademicYear} ({alloc.Semester})
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Check-in Date</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {alloc.CheckInDate}
                    </div>
                  </div>

                  {!isActive && checkOutDate && (
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Check-out Date</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#9ca3af', marginTop: '2px' }}>
                        {checkOutDate}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedAllocId(null)}>
                  Close
                </button>
                <button className="btn btn-secondary" onClick={() => { setSelectedAllocId(null); handleOpenEdit(alloc); }}>
                  <Edit2 size={14} /> Edit
                </button>
                {isActive && (
                  <button className="btn btn-secondary" style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' }} onClick={() => { setSelectedAllocId(null); onCheckOut(allocId); }}>
                    <LogOut size={14} /> Check Out
                  </button>
                )}
                {onDeleteAllocation && (
                  <button className="btn btn-danger" onClick={() => { setSelectedAllocId(null); onDeleteAllocation(allocId); }}>
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingAlloc ? `Edit Allocation ${editingAlloc.AllocationID}` : 'Allocate Room to Student'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Allocation ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.AllocationID || ''}
                  onChange={(e) => setFormData({ ...formData, AllocationID: e.target.value })}
                  required
                  disabled={!!editingAlloc}
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

              <div className="form-group">
                <label>Select Room</label>
                <select
                  className="form-select"
                  value={formData.RoomNo || ''}
                  onChange={(e) => setFormData({ ...formData, RoomNo: e.target.value })}
                  required
                >
                  {rooms.map((r) => (
                    <option key={r.RoomNo} value={r.RoomNo}>
                      {r.RoomNo} ({r.HostelName || r.HostelID}) — Status: {r.Status} — ₹{r.RoomRent}/sem
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Academic Year</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.AcademicYear || '2025-26'}
                    onChange={(e) => setFormData({ ...formData, AcademicYear: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Semester</label>
                  <select
                    className="form-select"
                    value={formData.Semester || 'Fall'}
                    onChange={(e) => setFormData({ ...formData, Semester: e.target.value })}
                  >
                    <option value="Fall">Fall</option>
                    <option value="Winter">Winter</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Check-in Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.CheckInDate || ''}
                  onChange={(e) => setFormData({ ...formData, CheckInDate: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAlloc ? 'Update Allocation' : 'Confirm Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

