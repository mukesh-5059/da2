import React, { useState, useEffect } from 'react';
import { Mess, Meal, MessSchedule } from '../../types';
import { api } from '../../services/api';
import { X, Plus, Edit2, Trash2, Calendar } from 'lucide-react';

interface MessProfileModalProps {
  mess: Mess | null;
  onClose: () => void;
  onEditMess?: (mess: Mess) => void;
  onDeleteMess?: (id: string) => void;
}

export const MessProfileModal: React.FC<MessProfileModalProps> = ({ mess, onClose, onEditMess, onDeleteMess }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [schedules, setSchedules] = useState<MessSchedule[]>([]);
  const [loading, setLoading] = useState(false);

  // Sub-modal states
  const [showMealModal, setShowMealModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [mealFormData, setMealFormData] = useState<Partial<Meal>>({});

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<MessSchedule | null>(null);
  const [scheduleFormData, setScheduleFormData] = useState<Partial<MessSchedule>>({});

  const loadData = async () => {
    if (!mess) return;
    setLoading(true);
    try {
      // Assuming getMeals and getMessSchedules can take a messId filter
      // If not, we fetch all and filter in memory
      const [allMeals, allSchedules] = await Promise.all([
        api.getMeals(),
        api.getMessSchedules()
      ]);
      const mId = mess.MessID || (mess as any).mess_id;
      setMeals(allMeals.filter(m => (m.MessID || (m as any).mess_id) === mId));
      setSchedules(allSchedules.filter(s => (s.MessID || (s as any).mess_id) === mId));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mess) {
      loadData();
    }
  }, [mess]);

  if (!mess) return null;

  // Meal Handlers
  const handleOpenAddMeal = () => {
    setEditingMeal(null);
    setMealFormData({
      MealID: `ML_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      MessID: mess.MessID || (mess as any).mess_id,
      MealName: '',
      Description: '',
      Cost: 50,
      Price: 50
    });
    setShowMealModal(true);
  };

  const handleOpenEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setMealFormData({ ...meal });
    setShowMealModal(true);
  };

  const handleMealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMeal) {
        await api.updateMeal(editingMeal.MealID || (editingMeal as any).meal_id, mealFormData);
      } else {
        await api.createMeal(mealFormData);
      }
      setShowMealModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save meal');
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await api.deleteMeal(id);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete meal');
      }
    }
  };

  // Schedule Handlers
  const handleOpenScheduleModal = () => {
    setEditingSchedule(null);
    setScheduleFormData({
      ScheduleID: `SCH_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      MessID: mess.MessID || (mess as any).mess_id,
      MealID: '',
      DayOfWeek: 'Monday',
      MealTime: 'Breakfast',
    });
    setShowScheduleModal(true);
  };

  const handleOpenEditSchedule = (schedule: MessSchedule) => {
    setEditingSchedule(schedule);
    setScheduleFormData({ ...schedule });
    // Don't open the modal yet, the UI for schedules is a big standalone modal.
    // Wait, the big modal IS showScheduleModal.
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSchedule) {
        await api.updateMessSchedule(editingSchedule.ScheduleID || (editingSchedule as any).schedule_id, scheduleFormData);
      } else {
        // Hydrate meal name automatically
        const selectedMeal = meals.find(m => (m.MealID || (m as any).meal_id) === scheduleFormData.MealID);
        if (selectedMeal) {
          scheduleFormData.MealName = selectedMeal.MealName || (selectedMeal as any).meal_name;
        }
        await api.createMessSchedule(scheduleFormData);
      }
      setEditingSchedule(null);
      setScheduleFormData({
        ScheduleID: `SCH_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        MessID: mess.MessID || (mess as any).mess_id,
        MealID: '',
        DayOfWeek: 'Monday',
        MealTime: 'Breakfast',
      });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save schedule');
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await api.deleteMessSchedule(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete schedule');
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <>
      <div className="modal-backdrop" style={{ zIndex: 1050 }} onClick={onClose}>
        <div className="modal-card" style={{ width: '100%', maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{mess.MessName || (mess as any).name}</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Mess ID: {mess.MessID || (mess as any).mess_id} &nbsp;|&nbsp; Type: {mess.MessType || (mess as any).type}
              </div>
            </div>
            <button className="btn btn-secondary" style={{ padding: '6px' }} onClick={onClose}><X size={16} /></button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', background: 'var(--bg-surface)', padding: '16px', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location</div>
              <div style={{ fontWeight: 600 }}>{mess.Location || 'Main Campus Dining Complex'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Seating Capacity</div>
              <div style={{ fontWeight: 600 }}>{mess.Capacity || (mess as any).SeatingCapacity || 300} seats</div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Offered Meals</h4>
              <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={handleOpenAddMeal}>
                <Plus size={13} /> Add Meal
              </button>
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
              {loading ? (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading meals...</div>
              ) : meals.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No meals in catalog</div>
              ) : (
                meals.map((meal, idx) => (
                  <div key={meal.MealID || (meal as any).meal_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: idx < meals.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-link)', cursor: 'pointer' }} onClick={() => handleOpenEditMeal(meal)}>
                        {meal.MealName || (meal as any).meal_name}
                      </div>
                      {meal.Description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{meal.Description}</div>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#10b981' }}>₹{meal.Cost !== undefined ? meal.Cost : meal.Price || 0}</span>
                      <button style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }} onClick={() => handleDeleteMeal(meal.MealID || (meal as any).meal_id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" onClick={handleOpenScheduleModal}>
                <Calendar size={14} /> View Weekly Schedule
              </button>
              {onEditMess && (
                <button className="btn btn-secondary" onClick={() => onEditMess(mess)}>
                  <Edit2 size={14} /> Edit Mess
                </button>
              )}
            </div>
            {onDeleteMess && (
              <button className="btn btn-secondary" style={{ color: '#f87171' }} onClick={() => onDeleteMess(mess.MessID || (mess as any).mess_id)}>
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Meal Modal */}
      {showMealModal && (
        <div className="modal-backdrop" style={{ zIndex: 1100 }} onClick={() => setShowMealModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>
              {editingMeal ? 'Edit Meal Item' : `Add Meal Item (${mess.MessName || mess.MessID})`}
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
                <button type="button" className="btn btn-secondary" onClick={() => setShowMealModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingMeal ? 'Update Meal Item' : 'Add Meal Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Weekly Schedule Manager Modal */}
      {showScheduleModal && (
        <div className="modal-backdrop" style={{ zIndex: 1100 }} onClick={() => setShowScheduleModal(false)}>
          <div className="modal-card" style={{ width: '920px', maxWidth: '95vw', padding: '28px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.05em' }}>Weekly Menu Schedule Manager</span>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginTop: '2px' }}>{mess.MessName || (mess as any).name} ({mess.MessID})</h3>
              </div>
              <button onClick={() => setShowScheduleModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={22} /></button>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '14px 18px', borderRadius: '10px', border: '1px solid var(--border-medium)', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                {editingSchedule ? <><Edit2 size={14} style={{ color: 'var(--accent-primary)' }} /> Edit Schedule Entry</> : <><Plus size={14} style={{ color: 'var(--accent-primary)' }} /> Add Schedule Entry for this Mess</>}
              </h4>
              <form onSubmit={handleScheduleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 2.5fr auto', gap: '12px', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Day of Week</label>
                  <select className="form-select" style={{ padding: '6px 10px', fontSize: '0.85rem' }} value={scheduleFormData.DayOfWeek || 'Monday'} onChange={(e) => setScheduleFormData({ ...scheduleFormData, DayOfWeek: e.target.value as any })}>
                    {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Time of Day</label>
                  <select className="form-select" style={{ padding: '6px 10px', fontSize: '0.85rem' }} value={scheduleFormData.MealTime || 'Breakfast'} onChange={(e) => setScheduleFormData({ ...scheduleFormData, MealTime: e.target.value as any })}>
                    <option value="Breakfast">Breakfast (07:30 - 09:30)</option>
                    <option value="Lunch">Lunch (12:30 - 14:30)</option>
                    <option value="Snack">Snack (16:30 - 17:30)</option>
                    <option value="Dinner">Dinner (19:30 - 21:30)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Select Meal from Catalog</label>
                  <select className="form-select" style={{ padding: '6px 10px', fontSize: '0.85rem' }} value={scheduleFormData.MealID || ''} onChange={(e) => setScheduleFormData({ ...scheduleFormData, MealID: e.target.value })} required>
                    <option value="">Select Meal from Catalog...</option>
                    {meals.map(m => <option key={m.MealID} value={m.MealID}>{m.MealName} (₹{m.Cost || m.Price || 0})</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {editingSchedule && (
                    <button type="button" className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: '0.85rem' }} onClick={() => {
                      setEditingSchedule(null);
                      setScheduleFormData({ ScheduleID: `SCH_${Math.random().toString(36).substring(2, 10).toUpperCase()}`, MessID: mess.MessID, MealID: '', DayOfWeek: 'Monday', MealTime: 'Breakfast' });
                    }}>Cancel Edit</button>
                  )}
                  <button type="submit" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
                    {editingSchedule ? 'Update Entry' : <><Plus size={14} /> Add Entry</>}
                  </button>
                </div>
              </form>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', paddingRight: '4px' }}>
              {daysOfWeek.map(day => {
                const daySchedules = schedules.filter(s => (s.DayOfWeek || (s as any).day_of_week || '').toLowerCase() === day.toLowerCase());
                const mealTimeOrder: Record<string, number> = { Breakfast: 1, Lunch: 2, Snack: 3, Dinner: 4 };
                daySchedules.sort((a, b) => (mealTimeOrder[a.MealTime || (a as any).meal_time || 'Breakfast'] || 99) - (mealTimeOrder[b.MealTime || (b as any).meal_time || 'Breakfast'] || 99));

                return (
                  <div key={day} style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.9rem', marginBottom: '10px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{day}</span>
                      <span className="badge badge-vacant" style={{ fontSize: '0.65rem' }}>{daySchedules.length} Items</span>
                    </div>
                    {daySchedules.length === 0 ? (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px 0', textAlign: 'center' }}>No schedule entries.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {daySchedules.map(s => {
                          const sId = s.ScheduleID || (s as any).schedule_id;
                          const itemName = s.ItemName || s.MealName || 'Meal Entry';
                          const mealTime = s.MealTime || (s as any).meal_time || 'Breakfast';
                          
                          return (
                            <div key={sId} style={{ background: 'var(--bg-surface)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                  <span className="tag-pill">{mealTime}</span>
                                </div>
                                <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }} onClick={() => handleOpenEditSchedule(s)} title="Edit schedule item">{itemName}</strong>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px', flexShrink: 0 }}>
                                <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }} onClick={() => handleOpenEditSchedule(s)} title="Edit schedule item"><Edit2 size={13} /></button>
                                <button style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }} onClick={() => handleDeleteSchedule(sId)} title="Remove schedule item"><Trash2 size={13} /></button>
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
    </>
  );
};
