import React, { useState } from 'react';
import { Mess, Meal, MessSchedule, MessEnrollment, Student } from '../../types';
import { Utensils, Calendar, Plus, Edit2, Trash2, CheckCircle, Search, User, DollarSign, X } from 'lucide-react';

interface MessTabProps {
  messes: Mess[];
  meals: Meal[];
  schedules: MessSchedule[];
  enrollments: MessEnrollment[];
  students: Student[];
  onSaveMess: (data: Partial<Mess>, isEdit: boolean) => Promise<void>;
  onDeleteMess: (id: string) => Promise<void>;
  onSaveMeal: (data: Partial<Meal>, isEdit: boolean) => Promise<void>;
  onDeleteMeal: (id: string) => Promise<void>;
  onSaveSchedule: (data: Partial<MessSchedule>, isEdit?: boolean) => Promise<void>;
  onDeleteSchedule: (id: string) => Promise<void>;
  onSaveEnrollment: (data: Partial<MessEnrollment>, isEdit?: boolean) => Promise<void>;
  onDeleteEnrollment: (id: string) => Promise<void>;
  onSelectStudent: (studentId: string) => void;
}

export const MessTab: React.FC<MessTabProps> = ({
  messes,
  meals,
  schedules,
  enrollments,
  students,
  onSaveMess,
  onDeleteMess,
  onSaveMeal,
  onDeleteMeal,
  onSaveSchedule,
  onDeleteSchedule,
  onSaveEnrollment,
  onDeleteEnrollment,
  onSelectStudent,
}) => {
  const [subTab, setSubTab] = useState<'facilities' | 'enrollments'>('facilities');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Edit state
  const [showMessModal, setShowMessModal] = useState(false);
  const [editingMess, setEditingMess] = useState<Partial<Mess> | null>(null);

  const [showMealModal, setShowMealModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Partial<Meal> | null>(null);
  const [selectedMessForMeal, setSelectedMessForMeal] = useState<Mess | null>(null);

  const [selectedMessForSchedule, setSelectedMessForSchedule] = useState<Mess | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Partial<MessSchedule> | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Partial<MessEnrollment> | null>(null);

  // Form states
  const [messFormData, setMessFormData] = useState<Partial<Mess>>({
    MessID: `M-${Date.now().toString().slice(-3)}`,
    MessName: '',
    MessType: 'Veg',
    Capacity: 300,
    Location: '',
  });

  const [mealFormData, setMealFormData] = useState<Partial<Meal>>({
    MealID: `ML-${Date.now().toString().slice(-4)}`,
    MessID: '',
    MealName: '',
    Description: '',
    Cost: 50,
  });

  const [scheduleFormData, setScheduleFormData] = useState<Partial<MessSchedule>>({
    ScheduleID: `SCH-${Date.now().toString().slice(-4)}`,
    MessID: '',
    MealID: '',
    DayOfWeek: 'Monday',
    ItemName: '',
    Description: '',
  });

  const [enrollFormData, setEnrollFormData] = useState<Partial<MessEnrollment>>({
    EnrollmentID: `ME-${Date.now().toString().slice(-4)}`,
    StudentID: students[0]?.StudentID || '',
    MessID: messes[0]?.MessID || '',
    MealPlanType: 'Veg',
    StartDate: new Date().toISOString().split('T')[0],
  });

  // Mess Modal Handlers
  const handleOpenAddMess = () => {
    setEditingMess(null);
    setMessFormData({
      MessID: `MSS_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      MessName: '',
      MessType: 'Veg',
      Capacity: 300,
      Location: '',
    });
    setShowMessModal(true);
  };

  const handleOpenEditMess = (mess: Mess) => {
    setEditingMess(mess);
    setMessFormData({
      MessID: mess.MessID || (mess as any).mess_id,
      MessName: mess.MessName || (mess as any).name || '',
      MessType: mess.MessType || (mess as any).type || 'Veg',
      Capacity: mess.Capacity || mess.SeatingCapacity || 300,
      Location: mess.Location || '',
    });
    setShowMessModal(true);
  };

  const handleMessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveMess(messFormData, !!editingMess);
    setShowMessModal(false);
  };

  // Meal Modal Handlers
  const handleOpenAddMeal = (mess: Mess) => {
    setSelectedMessForMeal(mess);
    setEditingMeal(null);
    setMealFormData({
      MealID: `ML_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      MessID: mess.MessID || (mess as any).mess_id,
      MealName: '',
      Description: '',
      Cost: 50,
    });
    setShowMealModal(true);
  };

  const handleOpenEditMeal = (mess: Mess, meal: Meal) => {
    setSelectedMessForMeal(mess);
    setEditingMeal(meal);
    setMealFormData({
      MealID: meal.MealID || (meal as any).meal_id,
      MessID: meal.MessID || (meal as any).mess_id || (mess.MessID || (mess as any).mess_id),
      MealName: meal.MealName || (meal as any).meal_name || '',
      Description: meal.Description || (meal as any).description || '',
      Cost: meal.Cost !== undefined ? meal.Cost : (meal.Price || 0),
    });
    setShowMealModal(true);
  };

  const handleMealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveMeal(mealFormData, !!editingMeal);
    setShowMealModal(false);
  };

  // Schedule Modal Handlers
  const handleOpenScheduleModal = (mess: Mess) => {
    const mId = mess.MessID || (mess as any).mess_id;
    const messMeals = meals.filter((m) => (m.MessID || (m as any).mess_id) === mId);
    setSelectedMessForSchedule(mess);
    setEditingSchedule(null);
    setScheduleFormData({
      ScheduleID: `SCH_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      MessID: mId,
      MealID: messMeals[0]?.MealID || (messMeals[0] as any)?.meal_id || '',
      DayOfWeek: 'Monday',
      MealTime: 'Breakfast',
      ItemName: messMeals[0]?.MealName || '',
      Description: '',
    });
  };

  const handleOpenEditSchedule = (s: MessSchedule) => {
    setEditingSchedule(s);
    setScheduleFormData({
      ScheduleID: s.ScheduleID || (s as any).schedule_id,
      MessID: s.MessID || (s as any).mess_id,
      MealID: s.MealID || (s as any).meal_id,
      DayOfWeek: (s.DayOfWeek || (s as any).day_of_week || 'Monday') as any,
      MealTime: (s.MealTime || (s as any).meal_time || 'Breakfast') as any,
    });
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessForSchedule || !scheduleFormData.MealID) return;
    const mId = selectedMessForSchedule.MessID || (selectedMessForSchedule as any).mess_id;

    await onSaveSchedule(
      {
        ScheduleID: scheduleFormData.ScheduleID || `SCH_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        MessID: mId,
        MealID: scheduleFormData.MealID,
        DayOfWeek: scheduleFormData.DayOfWeek || 'Monday',
        MealTime: scheduleFormData.MealTime || 'Breakfast',
      },
      !!editingSchedule
    );

    setEditingSchedule(null);
    const messMeals = meals.filter((m) => (m.MessID || (m as any).mess_id) === mId);
    setScheduleFormData({
      ScheduleID: `SCH_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      MessID: mId,
      MealID: messMeals[0]?.MealID || (messMeals[0] as any)?.meal_id || '',
      DayOfWeek: scheduleFormData.DayOfWeek || 'Monday',
      MealTime: scheduleFormData.MealTime || 'Breakfast',
    });
  };

  const handleOpenAddEnrollment = () => {
    setEditingEnrollment(null);
    setEnrollFormData({
      EnrollmentID: `ME_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      StudentID: students[0]?.StudentID || '',
      MessID: messes[0]?.MessID || '',
      MealPlanType: 'Veg',
      StartDate: new Date().toISOString().split('T')[0],
      IsActive: 1,
    });
    setShowEnrollModal(true);
  };

  const handleOpenEditEnrollment = (enr: MessEnrollment) => {
    setEditingEnrollment(enr);
    setEnrollFormData({
      EnrollmentID: enr.EnrollmentID || (enr as any).enrollment_id,
      StudentID: enr.StudentID || (enr as any).student_id,
      MessID: enr.MessID || (enr as any).mess_id,
      MealPlanType: (enr.MealPlanType || (enr as any).meal_plan_type || 'Veg') as any,
      StartDate: enr.StartDate || (enr as any).start_date || new Date().toISOString().split('T')[0],
      EndDate: enr.EndDate || (enr as any).end_date || '',
      IsActive: enr.IsActive !== undefined ? enr.IsActive : 1,
    });
    setShowEnrollModal(true);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveEnrollment(enrollFormData, !!editingEnrollment);
    setShowEnrollModal(false);
  };

  const filteredEnrollments = enrollments.filter((enr) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const sId = enr.StudentID || (enr as any).student_id || '';
    const name = `${enr.FirstName || ''} ${enr.LastName || ''} ${enr.StudentName || ''}`.toLowerCase();
    const mName = (enr.MessName || enr.MessID || '').toLowerCase();
    return sId.toLowerCase().includes(q) || name.includes(q) || mName.includes(q);
  });

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
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{mess.MessName || (mess as any).name}</h3>
                        <button
                          style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '2px' }}
                          onClick={() => handleOpenEditMess(mess)}
                          title="Edit Mess Details"
                        >
                          <Edit2 size={14} />
                        </button>
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

                  {/* Meal Catalog Offered by this Mess */}
                  <div style={{ marginTop: 'auto', background: 'var(--bg-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                        OFFERED MEALS ({messMeals.length})
                      </span>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                        onClick={() => handleOpenAddMeal(mess)}
                      >
                        <Plus size={12} /> Add Meal
                      </button>
                    </div>

                    {messMeals.length === 0 ? (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No meal items added to catalog yet.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                        {messMeals.map((meal) => (
                          <div
                            key={meal.MealID || (meal as any).meal_id}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '8px 10px', background: 'var(--bg-card)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}
                          >
                            <div>
                              <strong style={{ color: 'var(--text-primary)' }}>{meal.MealName || (meal as any).meal_name}</strong>
                              {meal.Description && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                  {meal.Description}
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#10b981', marginRight: '4px' }}>
                                ₹{meal.Cost !== undefined ? meal.Cost : meal.Price || 0}
                              </span>
                              <button
                                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '2px' }}
                                onClick={() => handleOpenEditMeal(mess, meal)}
                                title="Edit Meal"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                                onClick={() => onDeleteMeal(meal.MealID || (meal as any).meal_id)}
                                title="Delete Meal"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => handleOpenScheduleModal(mess)}
                    >
                      <Calendar size={14} /> Weekly Schedule ({messSchedules.length})
                    </button>

                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#f87171', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => onDeleteMess(mId)}
                    >
                      <Trash2 size={13} /> Remove
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

          <div style={{ marginBottom: '16px', maxWidth: '360px' }}>
            <div className="search-bar" style={{ padding: '8px 14px' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Filter enrollments by student name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Enrollment ID</th>
                  <th>Student Name</th>
                  <th>Mess Facility</th>
                  <th>Meal Plan</th>
                  <th>Start Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
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
                          {enr.EnrollmentID || (enr as any).enrollment_id}
                        </td>
                        <td>
                          <button
                            onClick={() => onSelectStudent(sId)}
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
                            {name}
                          </button>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {sId}</div>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {enr.MessName || enr.MessID || (enr as any).mess_name || (enr as any).mess_id}
                        </td>
                        <td>
                          <span className="badge badge-vacant">
                            {enr.MealPlanType || (enr as any).meal_plan_type || 'VEG'}
                          </span>
                        </td>
                        <td>{enr.StartDate || (enr as any).start_date}</td>
                        <td>
                          <span className="badge badge-vacant" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={12} /> Active
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              onClick={() => handleOpenEditEnrollment(enr)}
                              title="Edit Enrollment"
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#f87171' }}
                              onClick={() => onDeleteEnrollment(enr.EnrollmentID || (enr as any).enrollment_id)}
                              title="Cancel Enrollment"
                            >
                              <Trash2 size={13} /> Cancel
                            </button>
                          </div>
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

      {/* Add / Edit Mess Modal */}
      {showMessModal && (
        <div className="modal-backdrop" onClick={() => setShowMessModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingMess ? 'Edit Mess Facility' : 'Add Mess Facility'}
            </h3>
            <form onSubmit={handleMessSubmit}>
              <div className="form-group">
                <label>Mess ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={messFormData.MessID || ''}
                  onChange={(e) => setMessFormData({ ...messFormData, MessID: e.target.value })}
                  readOnly={!!editingMess}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mess Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Special Veg Dining Hall"
                  value={messFormData.MessName || ''}
                  onChange={(e) => setMessFormData({ ...messFormData, MessName: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Mess Type</label>
                  <select
                    className="form-select"
                    value={messFormData.MessType || 'Veg'}
                    onChange={(e) => setMessFormData({ ...messFormData, MessType: e.target.value as any })}
                  >
                    <option value="Veg">VEG</option>
                    <option value="NonVeg">NONVEG</option>
                    <option value="Both">BOTH</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Seating Capacity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={messFormData.Capacity || 300}
                    onChange={(e) => setMessFormData({ ...messFormData, Capacity: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. North Campus"
                  value={messFormData.Location || ''}
                  onChange={(e) => setMessFormData({ ...messFormData, Location: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowMessModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMess ? 'Update Mess Facility' : 'Save Mess Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Meal Item Modal */}
      {showMealModal && (
        <div className="modal-backdrop" onClick={() => setShowMealModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingMeal ? 'Edit Meal Item' : `Add Meal Item (${selectedMessForMeal?.MessName || selectedMessForMeal?.MessID})`}
            </h3>
            <form onSubmit={handleMealSubmit}>
              <div className="form-group">
                <label>Meal ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={mealFormData.MealID || ''}
                  onChange={(e) => setMealFormData({ ...mealFormData, MealID: e.target.value })}
                  readOnly={!!editingMeal}
                  required
                />
              </div>

              <div className="form-group">
                <label>Meal / Dish Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Masala Dosa, Paneer Butter Masala"
                  value={mealFormData.MealName || ''}
                  onChange={(e) => setMealFormData({ ...mealFormData, MealName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Served with coconut chutney & sambar"
                  value={mealFormData.Description || ''}
                  onChange={(e) => setMealFormData({ ...mealFormData, Description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Cost / Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={mealFormData.Cost !== undefined ? mealFormData.Cost : mealFormData.Price || 50}
                  onChange={(e) => setMealFormData({ ...mealFormData, Cost: Number(e.target.value), Price: Number(e.target.value) })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowMealModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMeal ? 'Update Meal Item' : 'Add Meal Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BIG MODAL: Interactive Weekly Menu Schedule & Management */}
      {selectedMessForSchedule && (
        <div className="modal-backdrop" onClick={() => setSelectedMessForSchedule(null)}>
          <div className="modal-card" style={{ width: '920px', maxWidth: '95vw', padding: '28px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Weekly Menu Schedule Manager
                </span>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedMessForSchedule.MessName || (selectedMessForSchedule as any).name} ({selectedMessForSchedule.MessID})
                </h3>
              </div>
              <button onClick={() => setSelectedMessForSchedule(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            {/* Quick Add Schedule Entry Form */}
            <div style={{ background: 'var(--bg-surface)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border-medium)', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 700 }}>
                + Add Schedule Entry for this Mess
              </h4>

              <form onSubmit={handleScheduleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 2.5fr auto', gap: '12px', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Day of Week</label>
                  <select
                    className="form-select"
                    style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                    value={scheduleFormData.DayOfWeek || 'Monday'}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, DayOfWeek: e.target.value as any })}
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Time of Day</label>
                  <select
                    className="form-select"
                    style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                    value={scheduleFormData.MealTime || 'Breakfast'}
                    onChange={(e) => setScheduleFormData({ ...scheduleFormData, MealTime: e.target.value as any })}
                  >
                    <option value="Breakfast">Breakfast (07:30 - 09:30)</option>
                    <option value="Lunch">Lunch (12:30 - 14:30)</option>
                    <option value="Snack">Snack (16:30 - 17:30)</option>
                    <option value="Dinner">Dinner (19:30 - 21:30)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Select Meal from Catalog</label>
                  <select
                    className="form-select"
                    style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                    value={scheduleFormData.MealID || ''}
                    onChange={(e) => {
                      const mId = e.target.value;
                      setScheduleFormData({
                        ...scheduleFormData,
                        MealID: mId,
                      });
                    }}
                    required
                  >
                    <option value="">Select Meal from Catalog...</option>
                    {meals
                      .filter((m) => (m.MessID || (m as any).mess_id) === (selectedMessForSchedule.MessID || (selectedMessForSchedule as any).mess_id))
                      .map((m) => (
                        <option key={m.MealID} value={m.MealID}>
                          {m.MealName} (₹{m.Cost || m.Price || 0})
                        </option>
                      ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
                  <Plus size={14} /> Add Entry
                </button>
              </form>
            </div>

            {/* 7-Day Schedule Grid View */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', paddingRight: '4px' }}>
              {daysOfWeek.map((day) => {
                const mId = selectedMessForSchedule.MessID || (selectedMessForSchedule as any).mess_id;
                const daySchedules = schedules.filter(
                  (s) => (s.MessID || (s as any).mess_id) === mId && (s.DayOfWeek || (s as any).day_of_week || '').toLowerCase() === day.toLowerCase()
                );

                // Sort day schedules by MealTime order
                const mealTimeOrder: Record<string, number> = { Breakfast: 1, Lunch: 2, Snack: 3, Dinner: 4 };
                daySchedules.sort((a, b) => {
                  const tA = mealTimeOrder[a.MealTime || (a as any).meal_time || 'Breakfast'] || 99;
                  const tB = mealTimeOrder[b.MealTime || (b as any).meal_time || 'Breakfast'] || 99;
                  return tA - tB;
                });

                return (
                  <div key={day} style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.9rem', marginBottom: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{day}</span>
                      <span className="badge badge-vacant" style={{ fontSize: '0.65rem' }}>{daySchedules.length} Items</span>
                    </div>

                    {daySchedules.length === 0 ? (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px 0', textAlign: 'center' }}>
                        No schedule entries.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {daySchedules.map((s) => {
                          const sId = s.ScheduleID || (s as any).schedule_id;
                          const itemName = s.ItemName || s.MealName || 'Meal Entry';
                          const mealTime = s.MealTime || (s as any).meal_time || 'Breakfast';

                          let badgeBg = 'rgba(59, 130, 246, 0.15)';
                          let badgeColor = '#60a5fa';
                          if (mealTime === 'Lunch') {
                            badgeBg = 'rgba(234, 179, 8, 0.15)';
                            badgeColor = '#facc15';
                          } else if (mealTime === 'Snack') {
                            badgeBg = 'rgba(168, 85, 247, 0.15)';
                            badgeColor = '#c084fc';
                          } else if (mealTime === 'Dinner') {
                            badgeBg = 'rgba(244, 63, 94, 0.15)';
                            badgeColor = '#fb7185';
                          }

                          return (
                            <div key={sId} style={{ background: 'var(--bg-surface)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                  <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: badgeBg, color: badgeColor, fontWeight: 700, textTransform: 'uppercase' }}>
                                    {mealTime}
                                  </span>
                                </div>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {itemName}
                                </strong>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px', flexShrink: 0 }}>
                                <button
                                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
                                  onClick={() => handleOpenEditSchedule(s)}
                                  title="Edit schedule item"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                                  onClick={() => onDeleteSchedule && onDeleteSchedule(sId)}
                                  title="Remove schedule item"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {showEnrollModal && (
        <div className="modal-backdrop" onClick={() => setShowEnrollModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Enroll Student in Mess</h3>
            <form onSubmit={handleEnrollSubmit}>
              <div className="form-group">
                <label>Enrollment ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={enrollFormData.EnrollmentID || ''}
                  onChange={(e) => setEnrollFormData({ ...enrollFormData, EnrollmentID: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Student</label>
                <select
                  className="form-select"
                  value={enrollFormData.StudentID || ''}
                  onChange={(e) => setEnrollFormData({ ...enrollFormData, StudentID: e.target.value })}
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
                  value={enrollFormData.MessID || ''}
                  onChange={(e) => setEnrollFormData({ ...enrollFormData, MessID: e.target.value })}
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
                    value={enrollFormData.MealPlanType || 'Veg'}
                    onChange={(e) => setEnrollFormData({ ...enrollFormData, MealPlanType: e.target.value as any })}
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
                    value={enrollFormData.IsActive !== undefined ? enrollFormData.IsActive : 1}
                    onChange={(e) => setEnrollFormData({ ...enrollFormData, IsActive: Number(e.target.value) })}
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
                    value={enrollFormData.StartDate || ''}
                    onChange={(e) => setEnrollFormData({ ...enrollFormData, StartDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date (Optional)</label>
                  <input
                    type="date"
                    className="form-input"
                    value={enrollFormData.EndDate || ''}
                    onChange={(e) => setEnrollFormData({ ...enrollFormData, EndDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEnrollModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Mess Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
