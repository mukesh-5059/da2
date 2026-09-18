from flask import Blueprint, request, jsonify
from database import get_db

financials_bp = Blueprint('financials', __name__)

@financials_bp.route('/financials/stats', methods=['GET'])
def get_financial_stats():
    query = """
        SELECT 
            COALESCE(SUM(CASE WHEN UPPER(PaymentStatus) IN ('PENDING', 'UNPAID', 'PARTIAL') THEN TotalAmount ELSE 0 END), 0) AS totalPendingAmount,
            COALESCE(SUM(CASE WHEN UPPER(PaymentStatus) = 'OVERDUE' OR (UPPER(PaymentStatus) IN ('UNPAID', 'PARTIAL') AND DueDate < date('now')) THEN TotalAmount ELSE 0 END), 0) AS totalOverdueAmount,
            COUNT(DISTINCT CASE WHEN UPPER(PaymentStatus) IN ('PENDING', 'UNPAID', 'PARTIAL') THEN StudentID END) AS pendingStudentsCount,
            COUNT(DISTINCT CASE WHEN UPPER(PaymentStatus) = 'OVERDUE' OR (UPPER(PaymentStatus) IN ('UNPAID', 'PARTIAL') AND DueDate < date('now')) THEN StudentID END) AS overdueStudentsCount
        FROM MONTHLY_BILL
    """
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute(query)
        row = cursor.fetchone()
        stats = {
            "totalPendingAmount": float(row['totalPendingAmount']) if row and row['totalPendingAmount'] is not None else 0.0,
            "totalOverdueAmount": float(row['totalOverdueAmount']) if row and row['totalOverdueAmount'] is not None else 0.0,
            "pendingStudentsCount": int(row['pendingStudentsCount']) if row and row['pendingStudentsCount'] is not None else 0,
            "overdueStudentsCount": int(row['overdueStudentsCount']) if row and row['overdueStudentsCount'] is not None else 0
        }
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@financials_bp.route('/monthly-bills', methods=['GET'])
def get_monthly_bills():
    student_id = request.args.get('student_id')
    payment_status = request.args.get('payment_status')
    billing_year = request.args.get('billing_year')
    
    query = """
        SELECT b.*, s.FirstName, s.LastName
        FROM MONTHLY_BILL b
        LEFT JOIN STUDENT s ON b.StudentID = s.StudentID
        WHERE 1=1
    """
    params = []
    
    if student_id:
        query += " AND b.StudentID=?"
        params.append(student_id)
    if payment_status and payment_status.upper() != 'ALL':
        if payment_status.upper() == 'PENDING':
            query += " AND UPPER(b.PaymentStatus) IN ('PENDING', 'UNPAID', 'PARTIAL')"
        elif payment_status.upper() == 'OVERDUE':
            query += " AND (UPPER(b.PaymentStatus) = 'OVERDUE' OR (UPPER(b.PaymentStatus) IN ('UNPAID', 'PARTIAL') AND b.DueDate < date('now')))"
        elif payment_status.upper() == 'PAID':
            query += " AND UPPER(b.PaymentStatus) = 'PAID'"
        else:
            query += " AND b.PaymentStatus=?"
            params.append(payment_status)
    if billing_year:
        query += " AND b.BillingYear=?"
        params.append(billing_year)
        
    query += " ORDER BY b.BillingYear DESC, b.BillingMonth DESC"
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['b.BillID', 's.FirstName', 's.LastName', 'b.PaymentStatus']
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@financials_bp.route('/monthly-bills', methods=['POST'])
def add_monthly_bill():
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO MONTHLY_BILL (BillID, StudentID, BillingMonth, BillingYear, RoomRentCharges, MessCharges, OtherCharges, TotalAmount, DueDate, PaymentStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (data.get('BillID'), data.get('StudentID'), data.get('BillingMonth'), data.get('BillingYear'), data.get('RoomRentCharges'), data.get('MessCharges'), data.get('OtherCharges'), data.get('TotalAmount'), data.get('DueDate'), data.get('PaymentStatus'))
        )
        conn.commit()
        return jsonify({'message': 'Monthly bill created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@financials_bp.route('/monthly-bills/<bill_id>', methods=['PUT'])
def update_monthly_bill(bill_id):
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM MONTHLY_BILL WHERE BillID=?", (bill_id,))
        existing = cursor.fetchone()
        if not existing:
            return jsonify({'error': 'Bill not found'}), 404
            
        student_id = data.get('StudentID', existing['StudentID'])
        billing_month = data.get('BillingMonth', existing['BillingMonth'])
        billing_year = data.get('BillingYear', existing['BillingYear'])
        room_rent = data.get('RoomRentCharges', existing['RoomRentCharges'])
        mess_charges = data.get('MessCharges', existing['MessCharges'])
        other_charges = data.get('OtherCharges', existing['OtherCharges'])
        total_amount = data.get('TotalAmount', existing['TotalAmount'])
        due_date = data.get('DueDate', existing['DueDate'])
        payment_status = data.get('PaymentStatus', existing['PaymentStatus'])

        cursor.execute(
            "UPDATE MONTHLY_BILL SET StudentID=?, BillingMonth=?, BillingYear=?, RoomRentCharges=?, MessCharges=?, OtherCharges=?, TotalAmount=?, DueDate=?, PaymentStatus=? WHERE BillID=?",
            (student_id, billing_month, billing_year, room_rent, mess_charges, other_charges, total_amount, due_date, payment_status, bill_id)
        )
        conn.commit()
        return jsonify({'message': 'Monthly bill updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@financials_bp.route('/monthly-bills/<bill_id>', methods=['DELETE'])
def delete_monthly_bill(bill_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM MONTHLY_BILL WHERE BillID=?", (bill_id,))
        conn.commit()
        return jsonify({'message': 'Monthly bill deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@financials_bp.route('/payment-transactions', methods=['GET'])
def get_payment_transactions():
    bill_id = request.args.get('bill_id')
    payment_mode = request.args.get('payment_mode')
    student_id = request.args.get('student_id')
    
    query = """
        SELECT p.*, b.BillingMonth, b.BillingYear, b.StudentID, s.FirstName, s.LastName
        FROM PAYMENT_TRANSACTION p
        LEFT JOIN MONTHLY_BILL b ON p.BillID = b.BillID
        LEFT JOIN STUDENT s ON b.StudentID = s.StudentID
        WHERE 1=1
    """
    params = []
    
    if bill_id:
        query += " AND p.BillID=?"
        params.append(bill_id)
    if payment_mode:
        query += " AND p.PaymentMode=?"
        params.append(payment_mode)
    if student_id:
        query += " AND b.StudentID=?"
        params.append(student_id)
        
    query += " ORDER BY p.PaymentDate DESC"
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['p.PaymentID', 'b.StudentID', 's.FirstName', 's.LastName', 'p.PaymentMode']
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@financials_bp.route('/payment-transactions', methods=['POST'])
def add_payment_transaction():
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO PAYMENT_TRANSACTION (PaymentID, BillID, AmountPaid, PaymentMode, PaymentDate, TransactionReference) VALUES (?, ?, ?, ?, ?, ?)",
            (data.get('PaymentID'), data.get('BillID'), data.get('AmountPaid'), data.get('PaymentMode'), data.get('PaymentDate'), data.get('TransactionReference'))
        )
        conn.commit()
        return jsonify({'message': 'Payment transaction created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@financials_bp.route('/payment-transactions/<payment_id>', methods=['PUT'])
def update_payment_transaction(payment_id):
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE PAYMENT_TRANSACTION SET BillID=?, AmountPaid=?, PaymentMode=?, PaymentDate=?, TransactionReference=? WHERE PaymentID=?",
            (data.get('BillID'), data.get('AmountPaid'), data.get('PaymentMode'), data.get('PaymentDate'), data.get('TransactionReference'), payment_id)
        )
        conn.commit()
        return jsonify({'message': 'Payment transaction updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@financials_bp.route('/payment-transactions/<payment_id>', methods=['DELETE'])
def delete_payment_transaction(payment_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM PAYMENT_TRANSACTION WHERE PaymentID=?", (payment_id,))
        conn.commit()
        return jsonify({'message': 'Payment transaction deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
