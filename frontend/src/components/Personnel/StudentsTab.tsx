import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { Plus, Edit2, Trash2, Phone, Mail, GraduationCap, Heart, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { ColumnDef } from '../../hooks/useTableFeatures';
import { TableControls } from '../TableControls';
import { TableHeader } from '../TableHeader';
import { PaginationFooter } from '../PaginationFooter';

interface StudentsTabProps {
  students?: Student[];
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

  const columns: ColumnDef<Student>[] = [
    { key: 'StudentID', label: 'Student ID', getValue: (s) => s.StudentID || (s as any).student_id },
    { key: 'FullName', label: 'Full Name', getValue: (s) => `${s.FirstName || (s as any).name || (s as any).FirstName || ''} ${s.LastName || ''}` },
    { key: 'Department', label: 'Department', getValue: (s) => s.Department || (s as any).department || 'CSE' },
    { key: 'Phone', label: 'Contact Number', getValue: (s) => s.Phone || (s as any).phone || '' },
    { key: 'Status', label: 'Status', getValue: (s) => (s.IsActive !== 0 ? 'Active' : 'Inactive') },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  const [studentList, setStudentList] = useState<Student[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCol, setSearchCol] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 25;

  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await api.getStudents({
        page: currentPage,
        limit: itemsPerPage,
        search: searchText.trim(),
        sortCol: sortCol || '',
        sortDir: sortDir,
      });
      if (res && typeof res === 'object' && 'totalRecords' in res) {
        setStudentList(res.data || []);
        setTotalRecords(Number(res.totalRecords) || 0);
      } else if (Array.isArray(res)) {
        setStudentList(res);
        setTotalRecords(res.length);
      }
    } catch (e) {
      console.error('Failed to load students', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, sortCol, sortDir]);

  useEffect(() => {
    loadData();
  }, [currentPage, searchText, sortCol, sortDir]);

  const handleSort = (key: string) => {
    if (sortCol === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(key);
      setSortDir('asc');
    }
  };

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
    loadData();
  };





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
          <TableControls 
            columns={columns} 
            searchCol={searchCol} 
            setSearchCol={setSearchCol} 
            searchText={searchText} 
            setSearchText={setSearchText}
            onSearchChange={() => setCurrentPage(1)}
          />

          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            Register Student
          </button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <TableHeader columns={columns} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  Loading students...
                </td>
              </tr>
            ) : studentList.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No resident students found matching search criteria.
                </td>
              </tr>
            ) : (
              studentList.map((student) => {
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
              })
            )}
          </tbody>
        </table>

        <PaginationFooter
          currentPage={currentPage}
          totalPages={Math.ceil(totalRecords / itemsPerPage) || 1}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalRecords}
        />
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
