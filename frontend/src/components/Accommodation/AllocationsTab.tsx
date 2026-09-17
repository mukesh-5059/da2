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
            Student room assignments and checkout records (`ROOM_ALLOCATION` relation)
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
              <th>Academic Year</th>
              <th>Semester</th>
              <th>Check-in Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((alloc) => {
              const allocId = alloc.AllocationID || (alloc as any).allocation_id;
              const isActive = !alloc.CheckOutDate;
              return (
                <tr key={allocId}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{allocId}</td>
                  <td>
                    <div>
                      {onSelectStudent ? (
                        <button
                          onClick={() => onSelectStudent(alloc.StudentID || (alloc as any).student_id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-primary)',
                            fontWeight: 600,
                            padding: 0,
                            cursor: 'pointer',
                            textAlign: 'left',
                            textDecoration: 'underline',
                          }}
                        >
                          {alloc.StudentName || alloc.StudentID}
                        </button>
                      ) : (
                        <div style={{ fontWeight: 600 }}>{alloc.StudentName || alloc.StudentID}</div>
                      )}
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{alloc.Department || alloc.Email}</div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    {alloc.RoomNo}
                  </td>
                  <td>{alloc.AcademicYear}</td>
                  <td>{alloc.Semester}</td>
                  <td>{alloc.CheckInDate}</td>
                  <td>
                    {isActive ? (
                      <span className="badge badge-vacant" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> Active Resident
                      </span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(107, 114, 128, 0.2)', color: '#9ca3af' }}>
                        Checked Out ({alloc.CheckOutDate})
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={() => handleOpenEdit(alloc)}
                        title="Edit Allocation"
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      {isActive && (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}
                          onClick={() => onCheckOut(allocId)}
                          title="Check Out Resident"
                        >
                          <LogOut size={14} /> Check Out
                        </button>
                      )}
                      {onDeleteAllocation && (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                          onClick={() => onDeleteAllocation(allocId)}
                          title="Delete Allocation Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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

