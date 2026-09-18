import React from 'react';
import { MessEnrollment } from '../../types';
import { X, Edit2, Trash2, CheckCircle } from 'lucide-react';

interface EnrollmentProfileModalProps {
  enrollment: MessEnrollment | null;
  onClose: () => void;
  onEdit: (enrollment: MessEnrollment) => void;
  onDelete: (id: string) => void;
}

export const EnrollmentProfileModal: React.FC<EnrollmentProfileModalProps> = ({
  enrollment,
  onClose,
  onEdit,
  onDelete
}) => {
  if (!enrollment) return null;

  return (
    <div className="modal-backdrop" style={{ zIndex: 1050 }} onClick={onClose}>
      <div className="modal-card" style={{ width: '100%', maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>Enrollment Details</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ID: {enrollment.EnrollmentID || (enrollment as any).enrollment_id}</div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '6px' }} onClick={onClose}><X size={16} /></button>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Student</span>
            <span style={{ fontWeight: 600 }}>{enrollment.FirstName || enrollment.StudentName || (enrollment as any).student_id}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Mess Facility</span>
            <span style={{ fontWeight: 600 }}>{enrollment.MessName || (enrollment as any).mess_name || enrollment.MessID}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Meal Plan</span>
            <span className="badge badge-vacant">{enrollment.MealPlanType || 'VEG'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Status</span>
            <span className="badge badge-vacant" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={12} /> Active
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Start Date</span>
            <span style={{ fontWeight: 600 }}>{enrollment.StartDate || (enrollment as any).start_date}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={() => onEdit(enrollment)}>
              <Edit2 size={14} /> Edit Enrollment
            </button>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ color: '#f87171' }}
            onClick={() => {
              if (window.confirm(`Are you sure you want to cancel enrollment ${enrollment.EnrollmentID}?`)) {
                onDelete(enrollment.EnrollmentID || (enrollment as any).enrollment_id);
                onClose();
              }
            }}
          >
            <Trash2 size={14} /> Cancel Enrollment
          </button>
        </div>
      </div>
    </div>
  );
};
