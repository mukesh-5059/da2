import React, { useState, useEffect } from 'react';
import { MessEnrollment, Student, Mess } from '../../types';

interface EditMessEnrollmentModalProps {
  enrollment: Partial<MessEnrollment> | null;
  students: Student[];
  messes: Mess[];
  onSave: (data: Partial<MessEnrollment>, isEdit: boolean) => Promise<void>;
  onClose: () => void;
}

export const EditMessEnrollmentModal: React.FC<EditMessEnrollmentModalProps> = ({
  enrollment,
  students,
  messes,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<Partial<MessEnrollment>>({});

  useEffect(() => {
    if (enrollment) {
      setFormData({
        EnrollmentID: enrollment.EnrollmentID || (enrollment as any).enrollment_id,
        StudentID: enrollment.StudentID || (enrollment as any).student_id,
        MessID: enrollment.MessID || (enrollment as any).mess_id,
        MealPlanType: (enrollment.MealPlanType || (enrollment as any).meal_plan_type || 'Veg') as any,
        StartDate: enrollment.StartDate || (enrollment as any).start_date || new Date().toISOString().split('T')[0],
        EndDate: enrollment.EndDate || (enrollment as any).end_date || '',
        IsActive: enrollment.IsActive !== undefined ? enrollment.IsActive : 1,
      });
    } else {
      setFormData({
        EnrollmentID: `ME_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        StudentID: students[0]?.StudentID || '',
        MessID: messes[0]?.MessID || '',
        MealPlanType: 'Veg',
        StartDate: new Date().toISOString().split('T')[0],
        IsActive: 1,
      });
    }
  }, [enrollment, students, messes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData, !!enrollment);
    onClose();
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 1100 }} onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
          {enrollment ? 'Edit Mess Enrollment' : 'Enroll Student in Mess'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enrollment ID</label>
            <input
              type="text"
              className="form-input"
              value={formData.EnrollmentID || ''}
              onChange={(e) => setFormData({ ...formData, EnrollmentID: e.target.value })}
              required
              readOnly={!!enrollment}
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
            <label>Select Mess Facility</label>
            <select
              className="form-select"
              value={formData.MessID || ''}
              onChange={(e) => setFormData({ ...formData, MessID: e.target.value })}
              required
            >
              {messes.map((m) => (
                <option key={m.MessID} value={m.MessID}>
                  {m.MessName || (m as any).name} ({m.MessID})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Meal Plan Type</label>
              <select
                className="form-select"
                value={formData.MealPlanType || 'Veg'}
                onChange={(e) => setFormData({ ...formData, MealPlanType: e.target.value as any })}
              >
                <option value="Veg">Veg</option>
                <option value="NonVeg">NonVeg</option>
                <option value="Special">Special</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                className="form-select"
                value={formData.IsActive !== undefined ? formData.IsActive : 1}
                onChange={(e) => setFormData({ ...formData, IsActive: Number(e.target.value) })}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive / Cancelled</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.StartDate || ''}
                onChange={(e) => setFormData({ ...formData, StartDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date (Optional)</label>
              <input
                type="date"
                className="form-input"
                value={formData.EndDate || ''}
                onChange={(e) => setFormData({ ...formData, EndDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {enrollment ? 'Save Changes' : 'Confirm Enrollment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
