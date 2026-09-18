import React, { useState, useEffect, useMemo } from 'react';
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
  const getFKTable = (key: string) => {
    if (key === 'HostelID') return 'Hostels';
    if (key === 'WardenID') return 'Wardens';
    if (key === 'RoomNo') return 'Rooms';
    if (key === 'StudentID') return 'Students';
    if (key === 'MessID') return 'Messes';
    if (key === 'MealID') return 'Meals';
    if (key === 'BillID') return 'Monthly Bills';
    if (key === 'SupplierID') return 'Suppliers';
    if (key === 'ItemID') return 'Inventory';
    if (key === 'CategoryID') return 'Room Categories';
    return null;
  };

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);

  const [searchCol, setSearchCol] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isServerPaginated, setIsServerPaginated] = useState(false);
  const pageSize = 100;

  const activeConfig = TABLES[activeTableIdx];

  useEffect(() => {
    setSearchCol('');
    setSearchText('');
    setSortCol(null);
    setSortDir('asc');
    setCurrentPage(1);
  }, [activeTableIdx]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, sortCol, sortDir]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchText,
        sortCol: sortCol || '',
        sortDir: sortDir
      };
      const res = await activeConfig.fetch(params);
      if (res && typeof res === 'object' && 'totalRecords' in res) {
        setData(res.data);
        setTotalRecords(res.totalRecords);
        setIsServerPaginated(true);
      } else {
        setData(res);
        setTotalRecords(res.length);
        setIsServerPaginated(false);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to load table data');
    }
    setLoading(false);
  };

  const processedData = useMemo(() => {
    if (isServerPaginated) return data;
    let result = [...data];
    
    if (searchText) {
      const query = searchText.toLowerCase();
      result = result.filter(row => {
        if (searchCol) {
          const val = row[searchCol];
          return val != null && String(val).toLowerCase().includes(query);
        } else {
          return Object.values(row).some(val => 
            val != null && String(val).toLowerCase().includes(query)
          );
        }
      });
    }

    if (sortCol) {
      result.sort((a, b) => {
        const valA = a[sortCol];
        const valB = b[sortCol];
        if (valA === valB) return 0;
        if (valA == null) return sortDir === 'asc' ? -1 : 1;
        if (valB == null) return sortDir === 'asc' ? 1 : -1;
        
        const aNum = Number(valA);
        const bNum = Number(valB);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDir === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortDir === 'asc' ? -1 : 1;
        if (strA > strB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchCol, searchText, sortCol, sortDir, isServerPaginated]);

  const totalPages = isServerPaginated 
    ? Math.max(1, Math.ceil(totalRecords / pageSize)) 
    : Math.max(1, Math.ceil(processedData.length / pageSize));
    
  const paginatedData = useMemo(() => {
    if (isServerPaginated) return data;
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, isServerPaginated, data]);

  // Debounce-like effect for loading data on param change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTableIdx, currentPage, searchText, sortCol, sortDir]);

  useEffect(() => {
    if (highlightedRowId && !loading) {
      setTimeout(() => {
        const el = document.getElementById(`row-${highlightedRowId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [highlightedRowId, loading]);

  const handleFKClick = (e: React.MouseEvent, fkTableIndex: number, recordId: string) => {
    e.stopPropagation();
    setHighlightedRowId(recordId);
    onTabChange(fkTableIndex);
  };

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
    <div 
      style={{ display: 'flex', height: '100%', flexDirection: 'column' }}
      onClick={() => setHighlightedRowId(null)}
    >
      <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <h2>{activeConfig.name} Data</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-surface)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <select 
                value={searchCol}
                onChange={(e) => setSearchCol(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
              >
                <option value="">All Columns</option>
                {activeConfig.columns.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '8px', fontSize: '0.9rem' }}
              />
            </div>
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={16} /> Add New Record
            </button>
          </div>
        </div>

        {loading ? (
          <div>Loading data...</div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {activeConfig.columns.map(c => {
                    const isPK = c.key === activeConfig.primaryKey;
                    const fkTable = !isPK ? getFKTable(c.key) : null;
                    const isSorted = sortCol === c.key;
                    
                    const handleSort = () => {
                      if (sortCol === c.key) {
                        if (sortDir === 'asc') setSortDir('desc');
                        else setSortCol(null);
                      } else {
                        setSortCol(c.key);
                        setSortDir('asc');
                      }
                    };

                    return (
                      <th 
                        key={c.key} 
                        onClick={handleSort}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {c.label}
                          {isPK && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>[PK]</span>}
                          {fkTable && <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>[FK]</span>}
                          {isSorted && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-link)' }}>
                              {sortDir === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, idx) => {
                  const pKey = row[activeConfig.primaryKey] || ((currentPage - 1) * pageSize + idx);
                  const isHighlighted = String(pKey) === highlightedRowId;
                  return (
                    <tr 
                      key={pKey} 
                      id={`row-${pKey}`}
                      style={{ 
                        backgroundColor: isHighlighted ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                        transition: 'background-color 0.3s ease'
                      }}
                    >
                      {activeConfig.columns.map(c => {
                        const isPK = c.key === activeConfig.primaryKey;
                        const fkTable = !isPK ? getFKTable(c.key) : null;
                        const fkTableIndex = fkTable ? TABLES.findIndex(t => t.name === fkTable) : -1;
                        
                        return (
                          <td key={c.key}>
                            {fkTable && fkTableIndex !== -1 && row[c.key] ? (
                              <button 
                                onClick={(e) => handleFKClick(e, fkTableIndex, String(row[c.key]))}
                                style={{ 
                                  background: 'none', border: 'none', padding: 0, 
                                  color: 'var(--text-link)', textDecoration: 'underline', 
                                  cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit'
                                }}
                              >
                                {row[c.key]}
                              </button>
                            ) : (
                              row[c.key]
                            )}
                          </td>
                        );
                      })}
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
                {processedData.length === 0 && (
                  <tr>
                    <td colSpan={activeConfig.columns.length + 1} style={{ textAlign: 'center', padding: '20px' }}>
                      {data.length === 0 ? 'No records found' : 'No matches found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {!loading && paginatedData.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 8px 16px 8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, isServerPaginated ? totalRecords : processedData.length)} of {isServerPaginated ? totalRecords : processedData.length} entries
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button  
                    className="btn btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '0.85rem', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '0.85rem', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
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
