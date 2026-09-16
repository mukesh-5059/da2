import React, { useState } from 'react';
import { Student, Guardian } from '../../types';
import { Plus, Edit2, Trash2, User, Phone, Mail, GraduationCap, Heart, Shield } from 'lucide-react';

interface StudentsTabProps {
  students: Student[];
  onSaveStudent: (data: Partial<Student>, isEdit: boolean) => Promise<void>;
  onDeleteStudent: (id: string) => Promise<void>;
  onViewGuardians: (student: Student) => void;
}

export const StudentsTab: React.FC<StudentsTabProps> = ({
  students,
  onSaveStudent,
  onDeleteStudent,
  onViewGuardians,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);

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
      StudentID: `S-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
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
    setFormData(s);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveStudent(formData, !!editingStudent);
    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Student Resident Directory</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            System student profiles, departments, and emergency contacts (`STUDENT` relation)
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} />
          Register Student
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Gender / DOB</th>
              <th>Department</th>
              <th>Contact Info</th>
              <th>Blood Group</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.StudentID}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {student.StudentID}
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{student.FirstName} {student.LastName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admitted: {student.AdmissionDate}</div>
                </td>
                <td>
                  <div>{student.Gender || 'N/A'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.DOB}</div>
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <GraduationCap size={14} style={{ color: 'var(--accent-primary)' }} />
                    {student.Department || 'Engineering'}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={12} /> {student.Email}
                  </div>
                  <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                    <Phone size={12} /> {student.Phone}
                  </div>
                </td>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <Heart size={12} /> {student.BloodGroup || 'O+'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${student.IsActive !== 0 ? 'badge-vacant' : 'badge-maint'}`}>
                    {student.IsActive !== 0 ? 'Active Resident' : 'Inactive'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      onClick={() => onViewGuardians(student)}
                    >
                      <Shield size={13} /> Guardian
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      onClick={() => handleOpenEdit(student)}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      onClick={() => onDeleteStudent(student.StudentID)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                  value={formData.StudentID || ''}
                  onChange={(e) => setFormData({ ...formData, StudentID: e.target.value })}
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
                    value={formData.FirstName || ''}
                    onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
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
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    className="form-select"
                    value={formData.Gender || 'Male'}
                    onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.DOB || ''}
                    onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.Email || ''}
                    onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.Phone || ''}
                    onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
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
                    value={formData.Department || ''}
                    onChange={(e) => setFormData({ ...formData, Department: e.target.value })}
                    placeholder="e.g. Computer Science"
                  />
                </div>

                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    className="form-select"
                    value={formData.BloodGroup || 'O+'}
                    onChange={(e) => setFormData({ ...formData, BloodGroup: e.target.value })}
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
