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
              <th>Contact Number</th>
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
              const phone = student.Phone || (student as any).phone || '';

              return (
                <tr key={sId} style={{ cursor: 'pointer' }} onClick={() => onSelectStudent?.(student)}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {sId}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{fName} {lName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.Email || (student as any).email || ''}</div>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <GraduationCap size={14} style={{ color: 'var(--accent-primary)' }} />
                      {dept}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={13} style={{ color: 'var(--text-muted)' }} />
                      {phone || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${student.IsActive !== 0 ? 'badge-vacant' : 'badge-maint'}`}>
                      {student.IsActive !== 0 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                      onClick={() => onSelectStudent?.(student)}
                    >
                      View Profile
                    </button>
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
