from flask import Blueprint, request, jsonify
from database import get_db

accommodation_bp = Blueprint('accommodation', __name__)

@accommodation_bp.route('/hostels', methods=['GET'])
def get_hostels():
    conn = get_db()
    try:
        hostel_type = request.args.get('hostel_type')
        query = '''
            SELECT h.*, w.FirstName || ' ' || w.LastName AS WardenName 
            FROM HOSTEL h
            LEFT JOIN WARDEN w ON h.WardenID = w.WardenID
        '''
        params = []
        if hostel_type:
            query += ' WHERE h.HostelType = ?'
            params.append(hostel_type)
            
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['h.HostelID', 'h.HostelName', 'h.Location', 'h.HostelType', "w.FirstName || ' ' || w.LastName"]
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@accommodation_bp.route('/hostels', methods=['POST'])
def add_hostel():
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO HOSTEL (HostelID, HostelName, HostelType, TotalFloors, TotalRooms, Location, WardenID)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (data['HostelID'], data['HostelName'], data['HostelType'], data['TotalFloors'], data['TotalRooms'], data['Location'], data.get('WardenID')))
        conn.commit()
        return jsonify({'message': 'Hostel added successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@accommodation_bp.route('/hostels/<hostel_id>', methods=['PUT'])
def update_hostel(hostel_id):
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE HOSTEL 
            SET HostelName = ?, HostelType = ?, TotalFloors = ?, TotalRooms = ?, Location = ?, WardenID = ?
            WHERE HostelID = ?
        ''', (data['HostelName'], data['HostelType'], data['TotalFloors'], data['TotalRooms'], data['Location'], data.get('WardenID'), hostel_id))
        conn.commit()
        return jsonify({'message': 'Hostel updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@accommodation_bp.route('/hostels/<hostel_id>', methods=['DELETE'])
def delete_hostel(hostel_id):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM HOSTEL WHERE HostelID = ?', (hostel_id,))
        conn.commit()
        return jsonify({'message': 'Hostel deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@accommodation_bp.route('/room-types', methods=['GET'])
def get_room_types():
    conn = get_db()
    try:
        cursor = conn.cursor()
        query = 'SELECT * FROM ROOM_TYPE'
        from utils import paginate_query
        search_columns = ['Type']
        result = paginate_query(cursor, query, search_columns)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@accommodation_bp.route('/room-types', methods=['POST'])
def add_room_type():
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO ROOM_TYPE (Type, Capacity, RoomRent)
            VALUES (?, ?, ?)
        ''', (data['Type'], data['Capacity'], data['RoomRent']))
        conn.commit()
        return jsonify({'message': 'Room type added successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@accommodation_bp.route('/room-types/<type_name>', methods=['PUT'])
def update_room_type(type_name):
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE ROOM_TYPE 
            SET Capacity = ?, RoomRent = ?
            WHERE Type = ?
        ''', (data['Capacity'], data['RoomRent'], type_name))
        conn.commit()
        return jsonify({'message': 'Room type updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@accommodation_bp.route('/room-types/<type_name>', methods=['DELETE'])
def delete_room_type(type_name):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM ROOM_TYPE WHERE Type = ?', (type_name,))
        conn.commit()
        return jsonify({'message': 'Room type deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@accommodation_bp.route('/rooms', methods=['GET'])
def get_rooms():
    conn = get_db()
    try:
        hostel_id = request.args.get('hostel_id')
        status = request.args.get('status')
        query = '''
            SELECT r.*, h.HostelName, rt.Capacity, rt.RoomRent
            FROM ROOM r
            JOIN HOSTEL h ON r.HostelID = h.HostelID
            JOIN ROOM_TYPE rt ON r.Type = rt.Type
            WHERE 1=1
        '''
        params = []
        if hostel_id:
            query += ' AND r.HostelID = ?'
            params.append(hostel_id)
        if status:
            query += ' AND r.Status = ?'
            params.append(status)
            
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['r.RoomNo', 'r.Type', 'h.HostelName', 'r.Status']
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@accommodation_bp.route('/rooms', methods=['POST'])
def add_room():
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO ROOM (RoomNo, FloorNo, Status, Type, HostelID)
            VALUES (?, ?, ?, ?, ?)
        ''', (data['RoomNo'], data['FloorNo'], data['Status'], data['Type'], data['HostelID']))
        conn.commit()
        return jsonify({'message': 'Room added successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@accommodation_bp.route('/rooms/<room_no>', methods=['PUT'])
def update_room(room_no):
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE ROOM 
            SET FloorNo = ?, Status = ?, Type = ?, HostelID = ?
            WHERE RoomNo = ?
        ''', (data['FloorNo'], data['Status'], data['Type'], data['HostelID'], room_no))
        conn.commit()
        return jsonify({'message': 'Room updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@accommodation_bp.route('/rooms/<room_no>', methods=['DELETE'])
def delete_room(room_no):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM ROOM WHERE RoomNo = ?', (room_no,))
        conn.commit()
        return jsonify({'message': 'Room deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@accommodation_bp.route('/allocations', methods=['GET'])
def get_allocations():
    conn = get_db()
    try:
        room_no = request.args.get('room_no')
        student_id = request.args.get('student_id')
        academic_year = request.args.get('academic_year')
        
        query = '''
            SELECT a.*, s.FirstName, s.LastName, s.Email, s.Phone, s.Department
            FROM ROOM_ALLOCATION a
            JOIN STUDENT s ON a.StudentID = s.StudentID
            WHERE 1=1
        '''
        params = []
        if room_no:
            query += ' AND a.RoomNo = ?'
            params.append(room_no)
        if student_id:
            query += ' AND a.StudentID = ?'
            params.append(student_id)
        if academic_year:
            query += ' AND a.AcademicYear = ?'
            params.append(academic_year)
            
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['a.AllocationID', 'a.RoomNo', 's.FirstName', 's.LastName', 's.Email']
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@accommodation_bp.route('/allocations', methods=['POST'])
def add_allocation():
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        semester = data.get('Semester', 'Fall')
        cursor.execute('''
            INSERT INTO ROOM_ALLOCATION (AllocationID, StudentID, RoomNo, AcademicYear, Semester, CheckInDate, CheckOutDate)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (data.get('AllocationID'), data['StudentID'], data['RoomNo'], data.get('AcademicYear', '2024-2025'), semester, data['CheckInDate'], data.get('CheckOutDate')))
        
        cursor.execute("UPDATE ROOM SET Status = 'Occupied' WHERE RoomNo = ?", (data['RoomNo'],))
        conn.commit()
        return jsonify({'message': 'Room allocation added successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@accommodation_bp.route('/allocations/<allocation_id>', methods=['PUT'])
def update_allocation(allocation_id):
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        updates = []
        params = []
        for key, value in data.items():
            if key in ['CheckOutDate', 'RoomNo', 'CheckInDate', 'AcademicYear', 'Semester', 'StudentID']:
                updates.append(f"{key} = ?")
                params.append(value)
        
        if updates:
            params.append(allocation_id)
            query = f"UPDATE ROOM_ALLOCATION SET {', '.join(updates)} WHERE AllocationID = ?"
            cursor.execute(query, params)
            conn.commit()
        return jsonify({'message': 'Allocation updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@accommodation_bp.route('/allocations/<allocation_id>', methods=['DELETE'])
def delete_allocation(allocation_id):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM ROOM_ALLOCATION WHERE AllocationID = ?', (allocation_id,))
        conn.commit()
        return jsonify({'message': 'Allocation deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
