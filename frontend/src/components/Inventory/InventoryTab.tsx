import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  ShoppingCart,
  Layers,
  Plus,
  Search,
  Trash2,
  Edit2,
  AlertTriangle,
  RefreshCw,
  Building2,
  DollarSign
} from 'lucide-react';
import { api } from '../../services/api';
import { EditSupplierModal } from './EditSupplierModal';
import { EditInventoryItemModal } from './EditInventoryItemModal';
import { EditStockModal } from './EditStockModal';
import { EditProcurementModal } from './EditProcurementModal';
import {
  Mess,
  Supplier,
  InventoryItem,
  InventoryStock,
  ProcurementEvent
} from '../../types';
import { ColumnDef } from '../../hooks/useTableFeatures';
import { TableControls } from '../TableControls';
import { TableHeader } from '../TableHeader';
import { PaginationFooter } from '../PaginationFooter';

interface InventoryTabProps {
  messes: Mess[];
  suppliers: Supplier[];
  inventoryItems: InventoryItem[];
  inventoryStock?: InventoryStock[];
  procurementEvents?: ProcurementEvent[];
  onSaveSupplier: (data: Partial<Supplier>, isEdit: boolean) => Promise<void>;
  onDeleteSupplier: (id: string) => Promise<void>;
  onSaveInventoryItem: (data: Partial<InventoryItem>, isEdit: boolean) => Promise<void>;
  onDeleteInventoryItem: (id: string) => Promise<void>;
  onSaveStock: (data: Partial<InventoryStock>) => Promise<void>;
  onDeleteStock: (messId: string, itemId: string) => Promise<void>;
  onSaveProcurement: (data: Partial<ProcurementEvent>, isEdit: boolean) => Promise<void>;
  onDeleteProcurement: (id: string) => Promise<void>;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  messes,
  suppliers,
  inventoryItems,
  inventoryStock,
  procurementEvents,
  onSaveSupplier,
  onDeleteSupplier,
  onSaveInventoryItem,
  onDeleteInventoryItem,
  onSaveStock,
  onDeleteStock,
  onSaveProcurement,
  onDeleteProcurement
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'stock' | 'items' | 'procurement' | 'suppliers'>('stock');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessFilter, setSelectedMessFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Supplier Modal state
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Item Modal state
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Stock Modal state
  const [showStockModal, setShowStockModal] = useState(false);

  // Procurement Modal state
  const [showProcurementModal, setShowProcurementModal] = useState(false);
  const [editingProcurement, setEditingProcurement] = useState<ProcurementEvent | null>(null);

  // Supplier Handlers
  const handleOpenAddSupplier = () => {
    setEditingSupplier(null);
    setShowSupplierModal(true);
  };

  const handleOpenEditSupplier = (sup: Supplier) => {
    setEditingSupplier(sup);
    setShowSupplierModal(true);
  };

  // Item Handlers
  const handleOpenAddItem = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  const handleOpenEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  // Stock Handlers
  const handleOpenAddStock = () => {
    setShowStockModal(true);
  };

  // Procurement Handlers
  const handleOpenAddProcurement = () => {
    setEditingProcurement(null);
    setShowProcurementModal(true);
  };

  const handleOpenEditProcurement = (ev: ProcurementEvent) => {
    setEditingProcurement(ev);
    setShowProcurementModal(true);
  };

  const stockColumns: ColumnDef<InventoryStock>[] = [
    { key: 'MessName', label: 'Mess Facility', getValue: s => s.MessName || s.MessID },
    { key: 'ItemName', label: 'Item Name', getValue: s => s.ItemName || s.ItemID },
    { key: 'Category', label: 'Category', getValue: s => s.Category || 'General' },
    { key: 'CurrentQuantity', label: 'Quantity', getValue: s => s.CurrentQuantity },
    { key: 'Unit', label: 'Unit', getValue: s => s.Unit || 'units' },
    { key: 'LastUpdatedDate', label: 'Last Updated', getValue: s => s.LastUpdatedDate },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  const [stockList, setStockList] = useState<InventoryStock[]>([]);
  const [stockTotalRecords, setStockTotalRecords] = useState(0);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockPage, setStockPage] = useState(1);
  const [stockSearchCol, setStockSearchCol] = useState('all');
  const [stockSearchText, setStockSearchText] = useState('');
  const [stockSortCol, setStockSortCol] = useState<string | null>(null);
  const [stockSortDir, setStockSortDir] = useState<'asc' | 'desc'>('asc');
  const stockItemsPerPage = 25;

  const loadStockData = async () => {
    setStockLoading(true);
    try {
      const params: any = {
        page: stockPage,
        limit: stockItemsPerPage,
        search: stockSearchText.trim(),
        sortCol: stockSortCol || '',
        sortDir: stockSortDir,
      };
      if (selectedMessFilter !== 'ALL') {
        params.mess_id = selectedMessFilter;
      }
      const res: any = await api.getInventoryStock(params);
      if (res && typeof res === 'object' && 'totalRecords' in res) {
        setStockList(res.data || []);
        setStockTotalRecords(Number(res.totalRecords) || 0);
      } else if (Array.isArray(res)) {
        setStockList(res);
        setStockTotalRecords(res.length);
      }
    } catch (e) {
      console.error('Failed to load inventory stock', e);
    } finally {
      setStockLoading(false);
    }
  };

  useEffect(() => {
    setStockPage(1);
  }, [stockSearchText, stockSortCol, stockSortDir, selectedMessFilter]);

  useEffect(() => {
    loadStockData();
  }, [stockPage, stockSearchText, stockSortCol, stockSortDir, selectedMessFilter]);

  const handleStockSort = (key: string) => {
    if (stockSortCol === key) {
      setStockSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setStockSortCol(key);
      setStockSortDir('asc');
    }
  };

  const procurementColumns: ColumnDef<ProcurementEvent>[] = [
    { key: 'PurchaseID', label: 'Purchase ID', getValue: p => p.PurchaseID },
    { key: 'MessName', label: 'Mess Facility', getValue: p => p.MessName || p.MessID },
    { key: 'SupplierName', label: 'Supplier', getValue: p => p.SupplierName || p.SupplierID },
    { key: 'ItemName', label: 'Item', getValue: p => p.ItemName || p.ItemID },
    { key: 'Quantity', label: 'Quantity', getValue: p => p.Quantity },
    { key: 'UnitPrice', label: 'Unit Price', getValue: p => p.UnitPrice },
    { key: 'TotalCost', label: 'Total Cost', getValue: p => p.TotalCost },
    { key: 'PurchaseDate', label: 'Date', getValue: p => p.PurchaseDate },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  const [procList, setProcList] = useState<ProcurementEvent[]>([]);
  const [procTotalRecords, setProcTotalRecords] = useState(0);
  const [procLoading, setProcLoading] = useState(false);
  const [procPage, setProcPage] = useState(1);
  const [procSearchCol, setProcSearchCol] = useState('all');
  const [procSearchText, setProcSearchText] = useState('');
  const [procSortCol, setProcSortCol] = useState<string | null>(null);
  const [procSortDir, setProcSortDir] = useState<'asc' | 'desc'>('asc');
  const procItemsPerPage = 25;

  const loadProcurementData = async () => {
    setProcLoading(true);
    try {
      const params: any = {
        page: procPage,
        limit: procItemsPerPage,
        search: procSearchText.trim(),
        sortCol: procSortCol || '',
        sortDir: procSortDir,
      };
      if (selectedMessFilter !== 'ALL') {
        params.mess_id = selectedMessFilter;
      }
      const res: any = await api.getProcurementEvents(params);
      if (res && typeof res === 'object' && 'totalRecords' in res) {
        setProcList(res.data || []);
        setProcTotalRecords(Number(res.totalRecords) || 0);
      } else if (Array.isArray(res)) {
        setProcList(res);
        setProcTotalRecords(res.length);
      }
    } catch (e) {
      console.error('Failed to load procurement events', e);
    } finally {
      setProcLoading(false);
    }
  };

  useEffect(() => {
    setProcPage(1);
  }, [procSearchText, procSortCol, procSortDir, selectedMessFilter]);

  useEffect(() => {
    loadProcurementData();
  }, [procPage, procSearchText, procSortCol, procSortDir, selectedMessFilter]);

  const handleProcSort = (key: string) => {
    if (procSortCol === key) {
      setProcSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setProcSortCol(key);
      setProcSortDir('asc');
    }
  };

  // Filtered Items
  const filteredItems = inventoryItems.filter((item) => {
    if (selectedCategoryFilter !== 'ALL' && item.Category !== selectedCategoryFilter) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return item.ItemName.toLowerCase().includes(q) || item.ItemID.toLowerCase().includes(q);
  });

  // Filtered Suppliers
  const filteredSuppliers = suppliers.filter((sup) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      sup.SupplierName.toLowerCase().includes(q) ||
      sup.SupplierID.toLowerCase().includes(q) ||
      (sup.Phone || '').includes(q)
    );
  });

  // Metrics
  return (
    <div>
      {/* Sub-Tab Navigation Pills */}
      <div className="tab-pills" style={{ marginBottom: '24px' }}>
        <button
          className={`tab-pill ${activeSubTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('stock')}
        >
          <Package size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Pantry Stock Levels ({stockTotalRecords})
        </button>

        <button
          className={`tab-pill ${activeSubTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('items')}
        >
          <Layers size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Item Catalog ({inventoryItems.length})
        </button>

        <button
          className={`tab-pill ${activeSubTab === 'procurement' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('procurement')}
        >
          <ShoppingCart size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Procurement Events ({procTotalRecords})
        </button>

        <button
          className={`tab-pill ${activeSubTab === 'suppliers' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('suppliers')}
        >
          <Truck size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Suppliers Directory ({suppliers.length})
        </button>
      </div>

      {/* Sub-Tab 1: Pantry Stock Levels */}
      {activeSubTab === 'stock' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Mess Pantry Stock Levels</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Real-time inventory levels per dining facility (`INVENTORY_STOCK` relation).
              </p>
            </div>
            
            <button className="btn btn-primary" onClick={handleOpenAddStock} style={{ whiteSpace: 'nowrap' }}>
              <Plus size={16} /> Update Stock Level
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <TableControls 
              columns={stockColumns} 
              searchCol={stockSearchCol} 
              setSearchCol={setStockSearchCol} 
              searchText={stockSearchText} 
              setSearchText={setStockSearchText}
            >
              <select
                value={selectedMessFilter}
                onChange={(e) => setSelectedMessFilter(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                <option value="ALL">All Dining Messes</option>
                {messes.map((m) => (
                  <option key={m.MessID} value={m.MessID}>
                    {m.MessName} ({m.MessID})
                  </option>
                ))}
              </select>
            </TableControls>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <TableHeader columns={stockColumns} sortCol={stockSortCol} sortDir={stockSortDir} onSort={handleStockSort} />
              <tbody>
                {stockLoading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Loading pantry stock levels...
                    </td>
                  </tr>
                ) : stockList.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No inventory stock entries found.
                    </td>
                  </tr>
                ) : (
                  stockList.map((s) => {
                    return (
                      <tr key={`${s.MessID}-${s.ItemID}`}>
                        <td>
                          <strong style={{ color: 'var(--text-primary)' }}>{s.MessName || s.MessID}</strong>
                        </td>
                        <td>
                          <strong>{s.ItemName || s.ItemID}</strong>
                        </td>
                        <td>
                          <span className="badge badge-vacant">{s.Category || 'General'}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {s.CurrentQuantity}
                          </span>
                        </td>
                        <td>{s.Unit || 'units'}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.LastUpdatedDate}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                            onClick={async () => {
                              await onDeleteStock(s.MessID, s.ItemID);
                              loadStockData();
                            }}
                            title="Delete Stock Entry"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <PaginationFooter
              currentPage={stockPage}
              totalPages={Math.ceil(stockTotalRecords / stockItemsPerPage) || 1}
              setCurrentPage={setStockPage}
              itemsPerPage={stockItemsPerPage}
              totalItems={stockTotalRecords}
            />
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Item Catalog */}
      {activeSubTab === 'items' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Master Inventory Catalog</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Master definition of raw materials, spices, and supplies (`INVENTORY_ITEM` table).
              </p>
            </div>

            <button className="btn btn-primary" onClick={handleOpenAddItem} style={{ whiteSpace: 'nowrap' }}>
              <Plus size={16} /> Add Inventory Item
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <TableControls 
              searchText={searchQuery} 
              setSearchText={setSearchQuery}
            >
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                <option value="ALL">All Categories</option>
                <option value="Dairy">Dairy</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Grains">Grains</option>
                <option value="Spices">Spices</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Other">Other</option>
              </select>
            </TableControls>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filteredItems.map((item) => (
              <div key={item.ItemID} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{item.ItemName}</h3>
                    <span className="badge badge-vacant">{item.Category}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    ID: {item.ItemID}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Measurement Unit: <strong>{item.Unit}</strong></span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}
                      onClick={() => handleOpenEditItem(item)}
                      title="Edit Item"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                      onClick={() => onDeleteInventoryItem(item.ItemID)}
                      title="Delete Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Procurement Events */}
      {activeSubTab === 'procurement' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Procurement & Purchase Logs</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Purchases made from external vendors (`PROCUREMENT_EVENT` relation).
              </p>
            </div>

            <button className="btn btn-primary" onClick={handleOpenAddProcurement} style={{ whiteSpace: 'nowrap' }}>
              <Plus size={16} /> Record Purchase
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <TableControls 
              columns={procurementColumns} 
              searchCol={procSearchCol} 
              setSearchCol={setProcSearchCol} 
              searchText={procSearchText} 
              setSearchText={setProcSearchText}
            >
              <select
                value={selectedMessFilter}
                onChange={(e) => setSelectedMessFilter(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                <option value="ALL">All Dining Messes</option>
                {messes.map((m) => (
                  <option key={m.MessID} value={m.MessID}>
                    {m.MessName} ({m.MessID})
                  </option>
                ))}
              </select>
            </TableControls>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <TableHeader columns={procurementColumns} sortCol={procSortCol} sortDir={procSortDir} onSort={handleProcSort} />
              <tbody>
                {procLoading ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      Loading procurement events...
                    </td>
                  </tr>
                ) : procList.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                      No procurement events recorded.
                    </td>
                  </tr>
                ) : (
                  procList.map((p) => (
                    <tr key={p.PurchaseID}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{p.PurchaseID}</td>
                      <td>{p.MessName || p.MessID}</td>
                      <td>
                        <strong>{p.SupplierName || p.SupplierID}</strong>
                      </td>
                      <td>{p.ItemName || p.ItemID}</td>
                      <td>{p.Quantity}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>₹{p.UnitPrice}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#10b981' }}>
                        ₹{p.TotalCost}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.PurchaseDate}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', marginRight: '6px' }}
                          onClick={() => handleOpenEditProcurement(p)}
                          title="Edit Procurement"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                          onClick={async () => {
                            await onDeleteProcurement(p.PurchaseID);
                            loadProcurementData();
                          }}
                          title="Delete Procurement"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <PaginationFooter
              currentPage={procPage}
              totalPages={Math.ceil(procTotalRecords / procItemsPerPage) || 1}
              setCurrentPage={setProcPage}
              itemsPerPage={procItemsPerPage}
              totalItems={procTotalRecords}
            />
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Suppliers Directory */}
      {activeSubTab === 'suppliers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>Suppliers Directory</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Registered vendors for raw food & material supplies (`SUPPLIER` table).
              </p>
            </div>

            <button className="btn btn-primary" onClick={handleOpenAddSupplier} style={{ whiteSpace: 'nowrap' }}>
              <Plus size={16} /> Register Supplier
            </button>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <TableControls 
              searchText={searchQuery} 
              setSearchText={setSearchQuery}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredSuppliers.map((sup) => (
              <div key={sup.SupplierID} className="card-glass" style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{sup.SupplierName}</h3>
                    <span className="badge badge-vacant" style={{ fontSize: '0.65rem' }}>{sup.SupplierID}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                    <div>Phone: <strong>{sup.Phone || 'N/A'}</strong></div>
                    <div>Email: <strong>{sup.Email || 'N/A'}</strong></div>
                    <div>Address: <strong>{sup.Address || 'N/A'}</strong></div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    onClick={() => handleOpenEditSupplier(sup)}
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#f87171' }}
                    onClick={() => onDeleteSupplier(sup.SupplierID)}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supplier Add/Edit Modal */}
      {showSupplierModal && (
        <EditSupplierModal
          supplier={editingSupplier}
          onSave={onSaveSupplier}
          onClose={() => setShowSupplierModal(false)}
        />
      )}

      {/* Item Add/Edit Modal */}
      {showItemModal && (
        <EditInventoryItemModal
          item={editingItem}
          onSave={onSaveInventoryItem}
          onClose={() => setShowItemModal(false)}
        />
      )}

      {/* Stock Upsert Modal */}
      {showStockModal && (
        <EditStockModal
          messes={messes}
          inventoryItems={inventoryItems}
          onSave={async (data) => {
            await onSaveStock(data);
            loadStockData();
          }}
          onClose={() => setShowStockModal(false)}
        />
      )}

      {/* Procurement Event Modal */}
      {showProcurementModal && (
        <EditProcurementModal
          procurement={editingProcurement}
          messes={messes}
          suppliers={suppliers}
          inventoryItems={inventoryItems}
          onSave={async (data, isEdit) => {
            await onSaveProcurement(data, isEdit);
            loadProcurementData();
          }}
          onClose={() => setShowProcurementModal(false)}
        />
      )}
    </div>
  );
};
