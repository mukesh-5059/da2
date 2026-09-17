import React, { useState } from 'react';
import { Student } from '../../types';
import { Plus, Edit2, Trash2, Phone, Mail, GraduationCap, Heart, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

interface StudentsTabProps {
  students: Student[];
  onSaveStudent: (data: Partial<Student>, isEdit: boolean) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
  onViewGuardians: (student: Student) => void;
  onSelectStudent?: (student: Student) => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
  students,
  onSaveStudent,
  onDeleteStudent,
  onViewGuardians,
  onSelectStudent,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [formData, setFormData] = useState<Partial<Student>>({
    StudentID: '',
    FirstName: '',
    LastName: '',
    Gender: 'Male',
    DOB: '2003-01-01',
    Email: '',
    Phone: '',
    BloodGroup: 'O+',
    Department: 'Computer Science',
    AdmissionDate: new Date().toISOString().split('T')[0],
    IsActive: 1,
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      StudentID: `STD_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      FirstName: '',
      LastName: '',
      Gender: 'Male',
      DOB: '2003-01-01',
      Email: '',
      Phone: '',
      BloodGroup: 'O+',
      Department: 'Computer Science',
      AdmissionDate: new Date().toISOString().split('T')[0],
      IsActive: 1,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s: Student) => {
    setEditingStudent(s);
    setFormData({
      StudentID: s.StudentID || (s as any).student_id,
      FirstName: s.FirstName || (s as any).name || (s as any).FirstName || '',
      LastName: s.LastName || '',
      Gender: s.Gender || (s as any).gender || 'Male',
      DOB: s.DOB || (s as any).dob || '',
      Email: s.Email || (s as any).email || '',
      Phone: s.Phone || (s as any).phone || '',
      BloodGroup: s.BloodGroup || (s as any).blood_group || 'O+',
      Department: s.Department || (s as any).department || 'CSE',
      AdmissionDate: s.AdmissionDate || (s as any).admission_date || '',
      IsActive: s.IsActive !== undefined ? s.IsActive : 1,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveStudent(formData, !!editingStudent);
    setShowModal(false);
  };

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const sId = (s.StudentID || (s as any).student_id || '').toLowerCase();
    const name = `${s.FirstName || ''} ${s.LastName || ''}`.toLowerCase();
    const dept = (s.Department || (s as any).department || '').toLowerCase();
    return sId.includes(q) || name.includes(q) || dept.includes(q);
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const activeStudent = filteredStudents.find(s => (s.StudentID || (s as any).student_id) === selectedStudentId) || paginatedStudents[0];
  const activeStudentId = activeStudent ? (activeStudent.StudentID || (activeStudent as any).student_id) : '';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Student Resident Directory</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Master-Detail Roster (`STUDENT` relation). Select any resident to inspect complete dossier.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="search-bar" style={{ padding: '8px 14px', width: '260px' }}>
            <input
              type="text"
              placeholder="Filter by name, ID or dept..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            Register Student
          </button>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="card-glass" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          No resident students found matching search term "{searchQuery}".
        </div>
      ) : (
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Department</th>
              <th>Blood Group</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student) => {
              const sId = student.StudentID || (student as any).student_id;
              const fName = student.FirstName || (student as any).name || (student as any).FirstName || '';
              const lName = student.LastName || '';
              const dept = student.Department || (student as any).department || 'CSE';
              const bg = student.BloodGroup || (student as any).blood_group || 'O+';

              return (
                <tr key={sId} style={{ cursor: 'pointer' }} onClick={() => setSelectedStudentId(sId)}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {sId}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{fName} {lName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.Email || (student as any).email || ''}</div>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <GraduationCap size={14} style={{ color: 'var(--accent-primary)' }} />
                      {dept}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <Heart size={12} /> {bg}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${student.IsActive !== 0 ? 'badge-vacant' : 'badge-maint'}`}>
                      {student.IsActive !== 0 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'var(--accent-glow)', color: 'var(--accent-primary)', borderColor: 'var(--accent-primary)' }}
                        onClick={() => setSelectedStudentId(sId)}
                      >
                        <Shield size={13} /> View Dossier
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={() => handleOpenEdit(student)}
                        title="Edit Resident"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={() => onDeleteStudent(sId)}
                        title="Delete Resident"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Showing page {currentPage} of {totalPages} ({filteredStudents.length} total students)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <button
                className="btn btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Student Detail Popup Modal */}
      {selectedStudentId && (() => {
        const student = students.find(s => (s.StudentID || (s as any).student_id) === selectedStudentId);
        if (!student) return null;
        const sId = student.StudentID || (student as any).student_id;
        const fName = student.FirstName || (student as any).name || (student as any).FirstName || '';
        const lName = student.LastName || '';
        const gender = student.Gender || (student as any).gender || 'M';
        const dob = student.DOB || (student as any).dob || 'N/A';
        const dept = student.Department || (student as any).department || 'CSE';
        const email = student.Email || (student as any).email;
        const phone = student.Phone || (student as any).phone;
        const bg = student.BloodGroup || (student as any).blood_group || 'O+';
        const admDate = student.AdmissionDate || (student as any).admission_date;

        return (
          <div className="modal-backdrop" onClick={() => setSelectedStudentId(null)}>
            <div className="modal-card" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent-primary)' }}>
                      {sId}
                    </span>
                    <span className={`badge ${student.IsActive !== 0 ? 'badge-vacant' : 'badge-maint'}`}>
                      {student.IsActive !== 0 ? 'Active Resident' : 'Inactive'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{fName} {lName}</h3>
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={() => { setSelectedStudentId(null); onViewGuardians(student); }}
                  style={{ border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}
                >
                  <Shield size={15} /> Emergency Guardians
                </button>
              </div>

              {/* Quick Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Department</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <GraduationCap size={15} style={{ color: 'var(--accent-primary)' }} />
                    {dept}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Blood Group</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ef4444', fontFamily: 'var(--font-mono)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={15} />
                    {bg}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gender / DOB</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {gender === 'M' || gender === 'Male' ? 'Male' : 'Female'} • {dob}
                  </div>
                </div>
              </div>

              {/* Contact Info Box */}
              <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Contact & Enrollment Metadata
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={14} /> Email Address
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{email || 'N/A'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} /> Phone Number
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{phone || 'N/A'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Admission Date</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{admDate || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <button className="btn btn-secondary" onClick={() => setSelectedStudentId(null)}>
                  Close
                </button>
                {onSelectStudent && (
                  <button className="btn btn-secondary" style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)' }} onClick={() => { setSelectedStudentId(null); onSelectStudent(student); }}>
                    Open 360° Profile
                  </button>
                )}
                <button className="btn btn-secondary" onClick={() => { setSelectedStudentId(null); handleOpenEdit(student); }}>
                  <Edit2 size={15} /> Edit Resident
                </button>
                <button className="btn btn-danger" onClick={() => { setSelectedStudentId(null); onDeleteStudent(sId); }}>
                  <Trash2 size={15} /> Delete Student
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingStudent ? 'Edit Student Profile' : 'Register New Student'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Student ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.StudentID || (formData as any).student_id || ''}
                  onChange={(e) => setFormData({ ...formData, StudentID: e.target.value, student_id: e.target.value } as any)}
                  disabled={!!editingStudent}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.FirstName || (formData as any).name || ''}
                    onChange={(e) => setFormData({ ...formData, FirstName: e.target.value, name: e.target.value } as any)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.LastName || ''}
                    onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    className="form-select"
                    value={formData.Gender || (formData as any).gender || 'M'}
                    onChange={(e) => setFormData({ ...formData, Gender: e.target.value, gender: e.target.value } as any)}
                  >
                    <option value="M">Male (M)</option>
                    <option value="F">Female (F)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.DOB || (formData as any).dob || ''}
                    onChange={(e) => setFormData({ ...formData, DOB: e.target.value, dob: e.target.value } as any)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.Email || (formData as any).email || ''}
                    onChange={(e) => setFormData({ ...formData, Email: e.target.value, email: e.target.value } as any)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.Phone || (formData as any).phone || ''}
                    onChange={(e) => setFormData({ ...formData, Phone: e.target.value, phone: e.target.value } as any)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.Department || (formData as any).department || ''}
                    onChange={(e) => setFormData({ ...formData, Department: e.target.value, department: e.target.value } as any)}
                    placeholder="e.g. Computer Science"
                  />
                </div>

                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    className="form-select"
                    value={formData.BloodGroup || (formData as any).blood_group || 'O+'}
                    onChange={(e) => setFormData({ ...formData, BloodGroup: e.target.value, blood_group: e.target.value } as any)}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Save Profile' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
