from flask import Blueprint, request, jsonify
from database import get_db

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/suppliers', methods=['GET'])
def get_suppliers():
    try:
        conn = get_db()
        cursor = conn.cursor()
        query = "SELECT * FROM SUPPLIER"
        from utils import paginate_query
        search_columns = ['SupplierID', 'SupplierName', 'Phone', 'Email']
        result = paginate_query(cursor, query, search_columns)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@inventory_bp.route('/suppliers', methods=['POST'])
def add_supplier():
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO SUPPLIER (SupplierID, SupplierName, Phone, Email, Address) VALUES (?, ?, ?, ?, ?)",
            (data.get('SupplierID'), data.get('SupplierName'), data.get('Phone'), data.get('Email'), data.get('Address'))
        )
        conn.commit()
        return jsonify({'message': 'Supplier created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@inventory_bp.route('/suppliers/<supplier_id>', methods=['PUT'])
def update_supplier(supplier_id):
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE SUPPLIER SET SupplierName=?, Phone=?, Email=?, Address=? WHERE SupplierID=?",
            (data.get('SupplierName'), data.get('Phone'), data.get('Email'), data.get('Address'), supplier_id)
        )
        conn.commit()
        return jsonify({'message': 'Supplier updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@inventory_bp.route('/suppliers/<supplier_id>', methods=['DELETE'])
def delete_supplier(supplier_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM SUPPLIER WHERE SupplierID=?", (supplier_id,))
        conn.commit()
        return jsonify({'message': 'Supplier deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@inventory_bp.route('/inventory-items', methods=['GET'])
def get_inventory_items():
    category = request.args.get('category')
    try:
        conn = get_db()
        cursor = conn.cursor()
        query = "SELECT * FROM INVENTORY_ITEM"
        params = []
        if category:
            query += " WHERE Category=?"
            params.append(category)
        from utils import paginate_query
        search_columns = ['ItemID', 'ItemName', 'Category', 'Unit']
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@inventory_bp.route('/inventory-items', methods=['POST'])
def add_inventory_item():
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO INVENTORY_ITEM (ItemID, ItemName, Category, Unit) VALUES (?, ?, ?, ?)",
            (data.get('ItemID'), data.get('ItemName'), data.get('Category'), data.get('Unit'))
        )
        conn.commit()
        return jsonify({'message': 'Inventory item created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@inventory_bp.route('/inventory-items/<item_id>', methods=['PUT'])
def update_inventory_item(item_id):
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE INVENTORY_ITEM SET ItemName=?, Category=?, Unit=? WHERE ItemID=?",
            (data.get('ItemName'), data.get('Category'), data.get('Unit'), item_id)
        )
        conn.commit()
        return jsonify({'message': 'Inventory item updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@inventory_bp.route('/inventory-items/<item_id>', methods=['DELETE'])
def delete_inventory_item(item_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM INVENTORY_ITEM WHERE ItemID=?", (item_id,))
        conn.commit()
        return jsonify({'message': 'Inventory item deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@inventory_bp.route('/procurement-events', methods=['GET'])
def get_procurement_events():
    mess_id = request.args.get('mess_id')
    supplier_id = request.args.get('supplier_id')
    
    query = """
        SELECT p.*, m.MessName, s.SupplierName, i.ItemName 
        FROM PROCUREMENT_EVENT p
        LEFT JOIN MESS m ON p.MessID = m.MessID
        LEFT JOIN SUPPLIER s ON p.SupplierID = s.SupplierID
        LEFT JOIN INVENTORY_ITEM i ON p.ItemID = i.ItemID
        WHERE 1=1
    """
    params = []
    
    if mess_id:
        query += " AND p.MessID=?"
        params.append(mess_id)
    if supplier_id:
        query += " AND p.SupplierID=?"
        params.append(supplier_id)
        
    query += " ORDER BY p.PurchaseDate DESC"
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['p.PurchaseID', 'm.MessName', 's.SupplierName', 'i.ItemName']
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@inventory_bp.route('/procurement-events', methods=['POST'])
def add_procurement_event():
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO PROCUREMENT_EVENT (PurchaseID, MessID, SupplierID, ItemID, Quantity, PurchaseDate, UnitPrice, TotalCost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (data.get('PurchaseID'), data.get('MessID'), data.get('SupplierID'), data.get('ItemID'), data.get('Quantity'), data.get('PurchaseDate'), data.get('UnitPrice'), data.get('TotalCost'))
        )
        conn.commit()
        return jsonify({'message': 'Procurement event created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@inventory_bp.route('/procurement-events/<purchase_id>', methods=['PUT'])
def update_procurement_event(purchase_id):
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE PROCUREMENT_EVENT SET MessID=?, SupplierID=?, ItemID=?, Quantity=?, PurchaseDate=?, UnitPrice=?, TotalCost=? WHERE PurchaseID=?",
            (data.get('MessID'), data.get('SupplierID'), data.get('ItemID'), data.get('Quantity'), data.get('PurchaseDate'), data.get('UnitPrice'), data.get('TotalCost'), purchase_id)
        )
        conn.commit()
        return jsonify({'message': 'Procurement event updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@inventory_bp.route('/procurement-events/<purchase_id>', methods=['DELETE'])
def delete_procurement_event(purchase_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM PROCUREMENT_EVENT WHERE PurchaseID=?", (purchase_id,))
        conn.commit()
        return jsonify({'message': 'Procurement event deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@inventory_bp.route('/inventory-stock', methods=['GET'])
def get_inventory_stock():
    mess_id = request.args.get('mess_id')
    query = """
        SELECT s.*, m.MessName, i.ItemName, i.Category, i.Unit
        FROM INVENTORY_STOCK s
        LEFT JOIN MESS m ON s.MessID = m.MessID
        LEFT JOIN INVENTORY_ITEM i ON s.ItemID = i.ItemID
    """
    params = []
    
    if mess_id:
        query += " WHERE s.MessID=?"
        params.append(mess_id)
        
    try:
        conn = get_db()
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['s.MessID', 's.ItemID', 'm.MessName', 'i.ItemName', 'i.Category']
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@inventory_bp.route('/inventory-stock', methods=['POST', 'PUT'])
def upsert_inventory_stock():
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT OR REPLACE INTO INVENTORY_STOCK (MessID, ItemID, CurrentQuantity, LastUpdatedDate) VALUES (?, ?, ?, ?)",
            (data.get('MessID'), data.get('ItemID'), data.get('CurrentQuantity'), data.get('LastUpdatedDate'))
        )
        conn.commit()
        status_code = 201 if request.method == 'POST' else 200
        return jsonify({'message': 'Inventory stock updated successfully'}), status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@inventory_bp.route('/inventory-stock/<mess_id>/<item_id>', methods=['DELETE'])
def delete_inventory_stock(mess_id, item_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM INVENTORY_STOCK WHERE MessID=? AND ItemID=?", (mess_id, item_id))
        conn.commit()
        return jsonify({'message': 'Inventory stock deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
