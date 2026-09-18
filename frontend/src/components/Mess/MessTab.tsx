import React, { useState, useEffect } from 'react';
import { Mess, Meal, MessSchedule, MessEnrollment, Student } from '../../types';
import { Utensils, Calendar, Plus, Edit2, Trash2, CheckCircle, Search, User, DollarSign, X } from 'lucide-react';
import { MessProfileModal } from './MessProfileModal';
import { EditMessModal } from './EditMessModal';
import { EditMessEnrollmentModal } from './EditMessEnrollmentModal';
import { EnrollmentProfileModal } from './EnrollmentProfileModal';
import { useTableFeatures, ColumnDef } from '../../hooks/useTableFeatures';
import { TableControls } from '../TableControls';
import { TableHeader } from '../TableHeader';

interface MessTabProps {
  messes: Mess[];
  meals: Meal[];
  schedules: MessSchedule[];
  enrollments: MessEnrollment[];
  students: Student[];
  onSaveMess: (data: Partial<Mess>, isEdit: boolean) => Promise<void>;
  onDeleteMess: (id: string) => Promise<void>;
  onSaveEnrollment: (data: Partial<MessEnrollment>, isEdit?: boolean) => Promise<void>;
  onDeleteEnrollment: (id: string) => Promise<void>;
  onSelectStudent: (studentId: string) => void;
  preselectedMessId?: string | null;
  onClearPreselected?: () => void;
}

export const MessTab: React.FC<MessTabProps> = ({
  messes,
  meals,
  schedules,
  enrollments,
  students,
  onSaveMess,
  onDeleteMess,
  onSaveEnrollment,
  onDeleteEnrollment,
  onSelectStudent,
  preselectedMessId,
  onClearPreselected,
}) => {
  const [subTab, setSubTab] = useState<'facilities' | 'enrollments'>('facilities');
  const [searchQuery, setSearchQuery] = useState('');

  const enrollColumns: ColumnDef<MessEnrollment>[] = [
    { key: 'EnrollmentID', label: 'Enrollment ID', getValue: enr => enr.EnrollmentID || (enr as any).enrollment_id },
    { key: 'StudentName', label: 'Student Name', getValue: enr => `${enr.FirstName || ''} ${enr.LastName || ''}`.trim() || enr.StudentName || enr.StudentID || (enr as any).student_id },
    { key: 'MessFacility', label: 'Mess Facility', getValue: enr => enr.MessName || enr.MessID || (enr as any).mess_name || (enr as any).mess_id },
    { key: 'Status', label: 'Status', getValue: () => 'Active' }
  ];

  const { searchCol, setSearchCol, searchText, setSearchText, sortCol, sortDir, handleSort, processedData: filteredEnrollments } = useTableFeatures(enrollments, enrollColumns);

  // Detailed View states
  const [viewingMess, setViewingMess] = useState<Mess | null>(null);
  const [viewingEnrollment, setViewingEnrollment] = useState<MessEnrollment | null>(null);

  // Auto-open preselected mess logic
  useEffect(() => {
    if (preselectedMessId && messes.length > 0) {
      const foundMess = messes.find(m => m.MessID === preselectedMessId || (m as any).mess_id === preselectedMessId);
      if (foundMess) {
        setSubTab('facilities');
        setViewingMess(foundMess);
        if (onClearPreselected) onClearPreselected();
      }
    }
  }, [preselectedMessId, messes, onClearPreselected]);

  const [showMessModal, setShowMessModal] = useState(false);
  const [editingMess, setEditingMess] = useState<Partial<Mess> | null>(null);

  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Partial<MessEnrollment> | null>(null);

  // Form states - now handled inside the respective Modal components!

  // Mess Modal Handlers
  const handleOpenAddMess = () => {
    setEditingMess(null);
    setShowMessModal(true);
  };

  const handleOpenEditMess = (mess: Mess) => {
    setEditingMess(mess);
    setShowMessModal(true);
  };

  const handleOpenAddEnrollment = () => {
    setEditingEnrollment(null);
    setShowEnrollModal(true);
  };

  const handleOpenEditEnrollment = (enr: MessEnrollment) => {
    setEditingEnrollment(enr);
    setShowEnrollModal(true);
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div>
      {/* Sub Navigation Pills */}
      <div className="tab-pills" style={{ marginBottom: '24px' }}>
        <button
          className={`tab-pill ${subTab === 'facilities' ? 'active' : ''}`}
          onClick={() => setSubTab('facilities')}
        >
          <Utensils size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Mess Facilities & Meal Catalog ({messes.length} Messes • {meals.length} Meals)
        </button>

        <button
          className={`tab-pill ${subTab === 'enrollments' ? 'active' : ''}`}
          onClick={() => setSubTab('enrollments')}
        >
          <User size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          All Student Enrollments ({enrollments.length})
        </button>
      </div>

      {/* Sub-Tab 1: Facilities & Meal Catalog */}
      {subTab === 'facilities' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Dining Halls & Meal Catalog</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Each mess facility (`MESS`) maintains a catalog of offered meals (`MEAL`). Click "Weekly Schedule" for its weekly menu.
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleOpenAddMess}>
              <Plus size={16} /> Add Mess Facility
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {messes.map((mess) => {
              const mId = mess.MessID || (mess as any).mess_id;
              const messMeals = meals.filter((m) => (m.MessID || (m as any).mess_id) === mId);
              const messSchedules = schedules.filter((s) => (s.MessID || (s as any).mess_id) === mId);

              return (
                <div key={mId} className="card-glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 
                          style={{ fontSize: '1.15rem', color: 'var(--text-link)', cursor: 'pointer' }}
                          onClick={() => setViewingMess(mess)}
                          title="View Mess Details"
                        >
                          {mess.MessName || (mess as any).name}
                        </h3>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                        Mess ID: {mId}
                      </span>
                    </div>
                    <span className="badge badge-vacant">
                      {mess.MessType || (mess as any).type || 'VEG'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                    <div>Seating Capacity: <strong>{mess.Capacity || mess.SeatingCapacity || 300} seats</strong></div>
                    <div>Location: <strong>{mess.Location || 'Main Campus Dining Complex'}</strong></div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Meals: {messMeals.length} &bull; Schedules: {messSchedules.length}
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      onClick={() => setViewingMess(mess)}
                    >
                      View Details ↗
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Student Enrollments */}
      {subTab === 'enrollments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Mess Enrollments & Subscriptions</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Active student mess subscriptions (`MESS_ENROLLMENT` relation). Click on any student to view profile.
              </p>
            </div>

            <button className="btn btn-primary" onClick={handleOpenAddEnrollment}>
              <Plus size={16} />
              Enroll Student
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <TableControls 
              columns={enrollColumns} 
              searchCol={searchCol} 
              setSearchCol={setSearchCol} 
              searchText={searchText} 
              setSearchText={setSearchText}
            />
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <TableHeader columns={enrollColumns} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
              <tbody>
                {filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No mess enrollment records found matching your filter.
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((enr) => {
                    const sId = enr.StudentID || (enr as any).student_id;
                    const name = `${enr.FirstName || ''} ${enr.LastName || ''}`.trim() || enr.StudentName || sId;
                    return (
                      <tr key={enr.EnrollmentID || (enr as any).enrollment_id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          <div 
                            style={{ color: 'var(--text-link)', cursor: 'pointer' }}
                            onClick={() => setViewingEnrollment(enr)}
                          >
                            {enr.EnrollmentID || (enr as any).enrollment_id}
                          </div>
                        </td>
                        <td>
                          <button
                            onClick={() => onSelectStudent(sId)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-primary)',
                              fontWeight: 600,
                              padding: 0,
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            {name}
                          </button>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {sId}</div>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {enr.MessName || enr.MessID || (enr as any).mess_name || (enr as any).mess_id}
                        </td>
                        <td>
                          <span className="badge badge-vacant" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={12} /> Active
                          </span>
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

      {/* --- ADD / EDIT MESS MODAL --- */}
      {showMessModal && (
        <EditMessModal
          mess={editingMess}
          onSave={onSaveMess}
          onClose={() => setShowMessModal(false)}
        />
      )}

      {/* --- DETAILED VIEW MODALS --- */}
      {viewingMess && (
        <MessProfileModal
          mess={viewingMess}
          onClose={() => setViewingMess(null)}
          onEditMess={(mess) => {
            setViewingMess(null);
            handleOpenEditMess(mess);
          }}
          onDeleteMess={(id) => {
            if (window.confirm('Delete this mess?')) {
              setViewingMess(null);
              onDeleteMess(id);
            }
          }}
        />
      )}

      {viewingEnrollment && (
        <EnrollmentProfileModal
          enrollment={viewingEnrollment}
          onClose={() => setViewingEnrollment(null)}
          onEdit={(enr) => {
            setViewingEnrollment(null);
            handleOpenEditEnrollment(enr);
          }}
          onDelete={(id) => {
            setViewingEnrollment(null);
            onDeleteEnrollment(id);
          }}
        />
      )}

      {/* Enroll Student Modal */}
      {showEnrollModal && (
        <EditMessEnrollmentModal
          enrollment={editingEnrollment}
          students={students}
          messes={messes}
          onSave={onSaveEnrollment}
          onClose={() => setShowEnrollModal(false)}
        />
      )}
    </div>
  );
};
