import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Edit2, Trash2, Plus, X } from 'lucide-react';

interface ColumnDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
  required?: boolean;
}

interface TableConfig {
  name: string;
  primaryKey: string;
  fetch: () => Promise<any[]>;
  create: (data: any) => Promise<any>;
  update: (id: string, data: any) => Promise<any>;
  delete: (id: string) => Promise<any>;
  columns: ColumnDef[];
}

export const TABLES: TableConfig[] = [
  {
    name: 'Hostels',
    primaryKey: 'HostelID',
    fetch: api.getHostels,
    create: api.createHostel,
    update: api.updateHostel,
    delete: api.deleteHostel,
    columns: [
      { key: 'HostelID', label: 'Hostel ID', type: 'text', required: true },
      { key: 'HostelName', label: 'Hostel Name', type: 'text', required: true },
      { key: 'HostelType', label: 'Hostel Type', type: 'select', options: ['Boys', 'Girls'], required: true },
      { key: 'TotalFloors', label: 'Total Floors', type: 'number', required: true },
      { key: 'TotalRooms', label: 'Total Rooms', type: 'number', required: true },
      { key: 'Location', label: 'Location', type: 'text' },
      { key: 'WardenID', label: 'Warden ID', type: 'text' }
    ]
  },
  {
    name: 'Room Types',
    primaryKey: 'Type',
    fetch: api.getRoomTypes,
    create: api.createRoomType,
    update: api.updateRoomType,
    delete: api.deleteRoomType,
    columns: [
      { key: 'Type', label: 'Type Name', type: 'text', required: true },
      { key: 'Capacity', label: 'Capacity', type: 'number', required: true },
      { key: 'RoomRent', label: 'Room Rent', type: 'number', required: true }
    ]
  },
  {
    name: 'Rooms',
    primaryKey: 'RoomNo',
    fetch: api.getRooms,
    create: api.createRoom,
    update: api.updateRoom,
    delete: api.deleteRoom,
    columns: [
      { key: 'RoomNo', label: 'Room No', type: 'text', required: true },
      { key: 'FloorNo', label: 'Floor No', type: 'number', required: true },
      { key: 'Status', label: 'Status', type: 'select', options: ['Vacant', 'Occupied', 'UnderMaintenance'], required: true },
      { key: 'Type', label: 'Room Type', type: 'text', required: true },
      { key: 'HostelID', label: 'Hostel ID', type: 'text', required: true }
    ]
  },
  {
    name: 'Wardens',
    primaryKey: 'WardenID',
    fetch: api.getWardens,
    create: api.createWarden,
    update: api.updateWarden,
    delete: api.deleteWarden,
    columns: [
      { key: 'WardenID', label: 'Warden ID', type: 'text', required: true },
      { key: 'FirstName', label: 'First Name', type: 'text', required: true },
      { key: 'LastName', label: 'Last Name', type: 'text', required: true },
      { key: 'Email', label: 'Email', type: 'text' },
      { key: 'Phone', label: 'Phone', type: 'text' },
      { key: 'Designation', label: 'Designation', type: 'text' },
      { key: 'JoiningDate', label: 'Joining Date', type: 'date' }
    ]
  },
  {
    name: 'Students',
    primaryKey: 'StudentID',
    fetch: api.getStudents,
    create: api.createStudent,
    update: api.updateStudent,
    delete: api.deleteStudent,
    columns: [
      { key: 'StudentID', label: 'Student ID', type: 'text', required: true },
      { key: 'FirstName', label: 'First Name', type: 'text', required: true },
      { key: 'LastName', label: 'Last Name', type: 'text', required: true },
      { key: 'Gender', label: 'Gender', type: 'select', options: ['M', 'F', 'Other'] },
      { key: 'DOB', label: 'DOB', type: 'date' },
      { key: 'Email', label: 'Email', type: 'text' },
      { key: 'Phone', label: 'Phone', type: 'text' },
      { key: 'BloodGroup', label: 'Blood Group', type: 'text' },
      { key: 'Department', label: 'Department', type: 'text' },
      { key: 'AdmissionDate', label: 'Admission Date', type: 'date' }
    ]
  },
  {
    name: 'Room Allocations',
    primaryKey: 'AllocationID',
    fetch: api.getAllocations,
    create: api.createAllocation,
    update: api.updateAllocation,
    delete: api.deleteAllocation,
    columns: [
      { key: 'AllocationID', label: 'Allocation ID', type: 'text', required: true },
      { key: 'StudentID', label: 'Student ID', type: 'text', required: true },
      { key: 'RoomNo', label: 'Room No', type: 'text', required: true },
      { key: 'AcademicYear', label: 'Academic Year', type: 'text', required: true },
      { key: 'Semester', label: 'Semester', type: 'text', required: true },
      { key: 'CheckInDate', label: 'Check In', type: 'date', required: true },
      { key: 'CheckOutDate', label: 'Check Out', type: 'date' }
    ]
  },
  {
    name: 'Guardians',
    primaryKey: 'GuardianID',
    fetch: api.getGuardians,
    create: api.createGuardian,
    update: api.updateGuardian,
    delete: api.deleteGuardian,
    columns: [
      { key: 'GuardianID', label: 'Guardian ID', type: 'text', required: true },
      { key: 'StudentID', label: 'Student ID', type: 'text', required: true },
      { key: 'GuardianName', label: 'Guardian Name', type: 'text', required: true },
      { key: 'Relationship', label: 'Relationship', type: 'text', required: true },
      { key: 'Phone', label: 'Phone', type: 'text', required: true },
      { key: 'Email', label: 'Email', type: 'text' },
      { key: 'Address', label: 'Address', type: 'text' }
    ]
  },
  {
    name: 'Staff',
    primaryKey: 'StaffID',
    fetch: api.getStaff,
    create: api.createStaff,
    update: api.updateStaff,
    delete: api.deleteStaff,
    columns: [
      { key: 'StaffID', label: 'Staff ID', type: 'text', required: true },
      { key: 'FirstName', label: 'First Name', type: 'text', required: true },
      { key: 'LastName', label: 'Last Name', type: 'text', required: true },
      { key: 'Phone', label: 'Phone', type: 'text', required: true },
      { key: 'JoinDate', label: 'Join Date', type: 'date', required: true },
      { key: 'Salary', label: 'Salary', type: 'number', required: true },
      { key: 'Role', label: 'Role', type: 'select', options: ['Chef', 'Cleaner', 'Helper', 'Security'], required: true },
      { key: 'ShiftSlot', label: 'Shift Slot', type: 'select', options: ['Morning', 'Evening', 'Night'], required: true },
      { key: 'MessID', label: 'Mess ID', type: 'text' },
      { key: 'HostelID', label: 'Hostel ID', type: 'text' }
    ]
  },
  {
    name: 'Messes',
    primaryKey: 'MessID',
    fetch: api.getMesses,
    create: api.createMess,
    update: api.updateMess,
    delete: api.deleteMess,
    columns: [
      { key: 'MessID', label: 'Mess ID', type: 'text', required: true },
      { key: 'MessName', label: 'Mess Name', type: 'text', required: true },
      { key: 'MessType', label: 'Mess Type', type: 'select', options: ['Veg', 'NonVeg', 'Both'], required: true },
      { key: 'Capacity', label: 'Capacity', type: 'number', required: true },
      { key: 'Location', label: 'Location', type: 'text' },
      { key: 'Phone', label: 'Phone', type: 'text' }
    ]
  },
  {
    name: 'Meals',
    primaryKey: 'MealID',
    fetch: api.getMeals,
    create: api.createMeal,
    update: api.updateMeal,
    delete: api.deleteMeal,
    columns: [
      { key: 'MealID', label: 'Meal ID', type: 'text', required: true },
      { key: 'MessID', label: 'Mess ID', type: 'text', required: true },
      { key: 'MealName', label: 'Meal Name', type: 'text', required: true },
      { key: 'Description', label: 'Description', type: 'text' },
      { key: 'Price', label: 'Price', type: 'number' }
    ]
  },
  {
    name: 'Mess Schedules',
    primaryKey: 'ScheduleID',
    fetch: api.getMessSchedules,
    create: api.createMessSchedule,
    update: api.updateMessSchedule,
    delete: api.deleteMessSchedule,
    columns: [
      { key: 'ScheduleID', label: 'Schedule ID', type: 'text', required: true },
      { key: 'MessID', label: 'Mess ID', type: 'text', required: true },
      { key: 'MealID', label: 'Meal ID', type: 'text', required: true },
      { key: 'DayOfWeek', label: 'Day of Week', type: 'select', options: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], required: true },
      { key: 'MealTime', label: 'Meal Time', type: 'select', options: ['Breakfast','Lunch','Snack','Dinner'] },
      { key: 'ItemName', label: 'Item Name', type: 'text' },
      { key: 'Description', label: 'Description', type: 'text' }
    ]
  },
  {
    name: 'Mess Enrollments',
    primaryKey: 'EnrollmentID',
    fetch: api.getMessEnrollments,
    create: api.createMessEnrollment,
    update: api.updateMessEnrollment,
    delete: api.deleteMessEnrollment,
    columns: [
      { key: 'EnrollmentID', label: 'Enrollment ID', type: 'text', required: true },
      { key: 'StudentID', label: 'Student ID', type: 'text', required: true },
      { key: 'MessID', label: 'Mess ID', type: 'text', required: true },
      { key: 'MealPlanType', label: 'Meal Plan Type', type: 'select', options: ['Veg', 'NonVeg', 'Special'] },
      { key: 'StartDate', label: 'Start Date', type: 'date', required: true },
      { key: 'EndDate', label: 'End Date', type: 'date' },
      { key: 'IsActive', label: 'Is Active (1/0)', type: 'number' }
    ]
  },
  {
    name: 'Monthly Bills',
    primaryKey: 'BillID',
    fetch: api.getMonthlyBills,
    create: api.createMonthlyBill,
    update: api.updateMonthlyBill,
    delete: api.deleteMonthlyBill,
    columns: [
      { key: 'BillID', label: 'Bill ID', type: 'text', required: true },
      { key: 'StudentID', label: 'Student ID', type: 'text', required: true },
      { key: 'BillingMonth', label: 'Billing Month', type: 'number', required: true },
      { key: 'BillingYear', label: 'Billing Year', type: 'number', required: true },
      { key: 'RoomRentCharges', label: 'Room Rent', type: 'number', required: true },
      { key: 'MessCharges', label: 'Mess Charges', type: 'number', required: true },
      { key: 'OtherCharges', label: 'Other Charges', type: 'number', required: true },
      { key: 'TotalAmount', label: 'Total Amount', type: 'number', required: true },
      { key: 'DueDate', label: 'Due Date', type: 'date', required: true },
      { key: 'PaymentStatus', label: 'Payment Status', type: 'select', options: ['PENDING','PAID','OVERDUE'], required: true }
    ]
  },
  {
    name: 'Payment Transactions',
    primaryKey: 'PaymentID',
    fetch: api.getPaymentTransactions,
    create: api.createPaymentTransaction,
    update: api.updatePaymentTransaction,
    delete: api.deletePaymentTransaction,
    columns: [
      { key: 'PaymentID', label: 'Payment ID', type: 'text', required: true },
      { key: 'BillID', label: 'Bill ID', type: 'text', required: true },
      { key: 'AmountPaid', label: 'Amount Paid', type: 'number', required: true },
      { key: 'PaymentMode', label: 'Payment Mode', type: 'select', options: ['UPI','NETBANKING','CARD','CASH'], required: true },
      { key: 'PaymentDate', label: 'Payment Date', type: 'date', required: true },
      { key: 'TransactionReference', label: 'Reference', type: 'text', required: true }
    ]
  },
  {
    name: 'Suppliers',
    primaryKey: 'SupplierID',
    fetch: api.getSuppliers,
    create: api.createSupplier,
    update: api.updateSupplier,
    delete: api.deleteSupplier,
    columns: [
      { key: 'SupplierID', label: 'Supplier ID', type: 'text', required: true },
      { key: 'SupplierName', label: 'Supplier Name', type: 'text', required: true },
      { key: 'Phone', label: 'Phone', type: 'text' },
      { key: 'Email', label: 'Email', type: 'text' },
      { key: 'Address', label: 'Address', type: 'text' }
    ]
  },
  {
    name: 'Inventory Items',
    primaryKey: 'ItemID',
    fetch: api.getInventoryItems,
    create: api.createInventoryItem,
    update: api.updateInventoryItem,
    delete: api.deleteInventoryItem,
    columns: [
      { key: 'ItemID', label: 'Item ID', type: 'text', required: true },
      { key: 'ItemName', label: 'Item Name', type: 'text', required: true },
      { key: 'Category', label: 'Category', type: 'select', options: ['Dairy','Vegetables','Grains','Spices','Cleaning','Other'], required: true },
      { key: 'Unit', label: 'Unit', type: 'select', options: ['kg','litre','units','packets'], required: true }
    ]
  },
  {
    name: 'Inventory Stock',
    primaryKey: 'ItemID', // Composite key really, but we use ItemID as fallback
    fetch: api.getInventoryStock,
    create: api.upsertInventoryStock,
    update: (id, data) => api.upsertInventoryStock(data), // Using upsert
    delete: (id) => { throw new Error('Delete unsupported for composite key stock in pure view'); },
    columns: [
      { key: 'MessID', label: 'Mess ID', type: 'text', required: true },
      { key: 'ItemID', label: 'Item ID', type: 'text', required: true },
      { key: 'CurrentQuantity', label: 'Current Quantity', type: 'number', required: true },
      { key: 'LastUpdatedDate', label: 'Last Updated', type: 'date', required: true }
    ]
  },
  {
    name: 'Procurement Events',
    primaryKey: 'PurchaseID',
    fetch: api.getProcurementEvents,
    create: api.createProcurementEvent,
    update: api.updateProcurementEvent,
    delete: api.deleteProcurementEvent,
    columns: [
      { key: 'PurchaseID', label: 'Purchase ID', type: 'text', required: true },
      { key: 'MessID', label: 'Mess ID', type: 'text', required: true },
      { key: 'SupplierID', label: 'Supplier ID', type: 'text', required: true },
      { key: 'ItemID', label: 'Item ID', type: 'text', required: true },
      { key: 'Quantity', label: 'Quantity', type: 'number', required: true },
      { key: 'PurchaseDate', label: 'Purchase Date', type: 'date', required: true },
      { key: 'UnitPrice', label: 'Unit Price', type: 'number', required: true },
      { key: 'TotalCost', label: 'Total Cost', type: 'number', required: true }
    ]
  }
];

export const PureTablesView: React.FC<{ activeTableIdx: number, onTabChange: (idx: number) => void }> = ({ activeTableIdx, onTabChange }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  
  const activeConfig = TABLES[activeTableIdx];

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await activeConfig.fetch();
      setData(res);
    } catch (e) {
      console.error(e);
      alert('Failed to load table data');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [activeTableIdx]);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFormData({});
    setShowModal(true);
  };

  const handleOpenEdit = (record: any) => {
    setEditingRecord(record);
    setFormData({ ...record });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await activeConfig.delete(id);
      loadData();
    } catch (e) {
      console.error(e);
      alert('Delete failed');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        const id = editingRecord[activeConfig.primaryKey];
        await activeConfig.update(id, formData);
      } else {
        await activeConfig.create(formData);
      }
      setShowModal(false);
      loadData();
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Save failed');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>{activeConfig.name} Data</h2>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Add New Record
          </button>
        </div>

        {loading ? (
          <div>Loading data...</div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {activeConfig.columns.map(c => (
                    <th key={c.key}>{c.label}</th>
                  ))}
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => {
                  const pKey = row[activeConfig.primaryKey] || idx;
                  return (
                    <tr key={pKey}>
                      {activeConfig.columns.map(c => (
                        <td key={c.key}>{row[c.key]}</td>
                      ))}
                      <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => handleOpenEdit(row)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-danger" style={{ padding: '4px 8px' }} onClick={() => handleDelete(row[activeConfig.primaryKey])}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={activeConfig.columns.length + 1} style={{ textAlign: 'center', padding: '20px' }}>No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ width: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>{editingRecord ? 'Edit' : 'Add'} {activeConfig.name}</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
                {activeConfig.columns.map(c => (
                  <div key={c.key}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      {c.label} {c.required && <span style={{ color: 'red' }}>*</span>}
                    </label>
                    {c.type === 'select' && c.options ? (
                      <select 
                        className="form-input" 
                        required={c.required} 
                        value={formData[c.key] || ''} 
                        onChange={(e) => setFormData({...formData, [c.key]: e.target.value})}
                      >
                        <option value="">Select...</option>
                        {c.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input 
                        type={c.type} 
                        className="form-input" 
                        required={c.required}
                        value={formData[c.key] || ''}
                        onChange={(e) => setFormData({...formData, [c.key]: c.type === 'number' ? Number(e.target.value) : e.target.value})}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
