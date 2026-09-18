from flask import Blueprint, request, jsonify
from database import get_db

personnel_bp = Blueprint('personnel', __name__)

@personnel_bp.route('/wardens', methods=['GET'])
def get_wardens():
    conn = get_db()
    try:
        designation = request.args.get('designation')
        query = 'SELECT * FROM WARDEN'
        params = []
        if designation:
            query += ' WHERE Designation = ?'
            params.append(designation)
            
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['WardenID', 'FirstName', 'LastName', 'Email', 'Phone', 'Designation']
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@personnel_bp.route('/wardens', methods=['POST'])
def add_warden():
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO WARDEN (WardenID, FirstName, LastName, Phone, Email, Designation)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (data['WardenID'], data['FirstName'], data['LastName'], data['Phone'], data.get('Email'), data.get('Designation')))
        conn.commit()
        return jsonify({'message': 'Warden added successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@personnel_bp.route('/wardens/<warden_id>', methods=['PUT'])
def update_warden(warden_id):
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE WARDEN 
            SET FirstName = ?, LastName = ?, Phone = ?, Email = ?, Designation = ?
            WHERE WardenID = ?
        ''', (data['FirstName'], data['LastName'], data['Phone'], data.get('Email'), data.get('Designation'), warden_id))
        conn.commit()
        return jsonify({'message': 'Warden updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@personnel_bp.route('/wardens/<warden_id>', methods=['DELETE'])
def delete_warden(warden_id):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM WARDEN WHERE WardenID = ?', (warden_id,))
        conn.commit()
        return jsonify({'message': 'Warden deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@personnel_bp.route('/students', methods=['GET'])
def get_students():
    conn = get_db()
    try:
        is_active = request.args.get('is_active')
        department = request.args.get('department')
        gender = request.args.get('gender')
        
        query = 'SELECT * FROM STUDENT WHERE 1=1'
        params = []
        if is_active is not None:
            query += ' AND IsActive = ?'
            params.append(is_active)
        if department:
            query += ' AND Department = ?'
            params.append(department)
        if gender:
            query += ' AND Gender = ?'
            params.append(gender)
            
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['StudentID', 'FirstName', 'LastName', 'Email', 'Phone', 'Department', 'BloodGroup']
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@personnel_bp.route('/students/<student_id>', methods=['GET'])
def get_student(student_id):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM STUDENT WHERE StudentID = ?', (student_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({'error': 'Student not found'}), 404
        return jsonify(dict(row)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@personnel_bp.route('/students', methods=['POST'])
def add_student():
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        dob = data.get('DOB') or data.get('DateOfBirth')
        admission_date = data.get('AdmissionDate') or data.get('AdmissionYear', '2023-08-01')
        cursor.execute('''
            INSERT INTO STUDENT (StudentID, FirstName, LastName, Gender, DOB, Email, Phone, BloodGroup, Department, AdmissionDate, IsActive)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (data['StudentID'], data['FirstName'], data['LastName'], data.get('Gender'), dob, data.get('Email'), data.get('Phone'), data.get('BloodGroup'), data.get('Department'), admission_date, data.get('IsActive', 1)))
        conn.commit()
        return jsonify({'message': 'Student added successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@personnel_bp.route('/students/<student_id>', methods=['PUT'])
def update_student(student_id):
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        dob = data.get('DOB') or data.get('DateOfBirth')
        admission_date = data.get('AdmissionDate') or data.get('AdmissionYear', '2023-08-01')
        cursor.execute('''
            UPDATE STUDENT 
            SET FirstName = ?, LastName = ?, Gender = ?, DOB = ?, Email = ?, Phone = ?, BloodGroup = ?, Department = ?, AdmissionDate = ?, IsActive = ?
            WHERE StudentID = ?
        ''', (data['FirstName'], data['LastName'], data.get('Gender'), dob, data.get('Email'), data.get('Phone'), data.get('BloodGroup'), data.get('Department'), admission_date, data.get('IsActive', 1), student_id))
        conn.commit()
        return jsonify({'message': 'Student updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@personnel_bp.route('/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM STUDENT WHERE StudentID = ?', (student_id,))
        conn.commit()
        return jsonify({'message': 'Student deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@personnel_bp.route('/guardians', methods=['GET'])
def get_guardians():
    conn = get_db()
    try:
        student_id = request.args.get('student_id')
        query = '''
            SELECT g.*, s.FirstName || ' ' || s.LastName AS StudentName
            FROM GUARDIAN g
            LEFT JOIN STUDENT s ON g.StudentID = s.StudentID
            WHERE 1=1
        '''
        params = []
        if student_id:
            query += ' AND g.StudentID = ?'
            params.append(student_id)
            
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['g.GuardianID', 'g.GuardianName', 'g.Phone', 'g.Email', "s.FirstName || ' ' || s.LastName"]
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@personnel_bp.route('/guardians', methods=['POST'])
def add_guardian():
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        guardian_name = data.get('GuardianName') or f"{data.get('FirstName', '')} {data.get('LastName', '')}".strip() or 'Guardian'
        relationship = data.get('Relationship') or data.get('Relation', 'Other')
        cursor.execute('''
            INSERT INTO GUARDIAN (GuardianID, StudentID, GuardianName, Relationship, Phone, Email, Address)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (data.get('GuardianID'), data['StudentID'], guardian_name, relationship, data.get('Phone', ''), data.get('Email'), data.get('Address')))
        conn.commit()
        return jsonify({'message': 'Guardian added successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@personnel_bp.route('/guardians/<guardian_id>', methods=['PUT'])
def update_guardian(guardian_id):
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        guardian_name = data.get('GuardianName') or f"{data.get('FirstName', '')} {data.get('LastName', '')}".strip() or 'Guardian'
        relationship = data.get('Relationship') or data.get('Relation', 'Other')
        cursor.execute('''
            UPDATE GUARDIAN 
            SET StudentID = ?, GuardianName = ?, Relationship = ?, Phone = ?, Email = ?, Address = ?
            WHERE GuardianID = ?
        ''', (data.get('StudentID'), guardian_name, relationship, data.get('Phone', ''), data.get('Email'), data.get('Address'), guardian_id))
        conn.commit()
        return jsonify({'message': 'Guardian updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@personnel_bp.route('/guardians/<guardian_id>', methods=['DELETE'])
def delete_guardian(guardian_id):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM GUARDIAN WHERE GuardianID = ?', (guardian_id,))
        conn.commit()
        return jsonify({'message': 'Guardian deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@personnel_bp.route('/staff', methods=['GET'])
def get_staff():
    conn = get_db()
    try:
        role = request.args.get('role')
        mess_id = request.args.get('mess_id')
        hostel_id = request.args.get('hostel_id')
        
        query = 'SELECT * FROM STAFF WHERE 1=1'
        params = []
        if role:
            query += ' AND Role = ?'
            params.append(role)
        if mess_id:
            query += ' AND MessID = ?'
            params.append(mess_id)
        if hostel_id:
            query += ' AND HostelID = ?'
            params.append(hostel_id)
            
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['StaffID', 'FirstName', 'LastName', 'Phone', 'Role']
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@personnel_bp.route('/staff', methods=['POST'])
def add_staff():
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        shift = data.get('ShiftSlot') or data.get('Shift', 'Morning')
        join_date = data.get('JoinDate') or data.get('HireDate', '2024-01-01')
        cursor.execute('''
            INSERT INTO STAFF (StaffID, FirstName, LastName, Phone, JoinDate, Salary, Role, ShiftSlot, CuisineType, MessID, HostelID)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (data['StaffID'], data['FirstName'], data['LastName'], data.get('Phone', ''), join_date, data.get('Salary', 0), data.get('Role', 'Helper'), shift, data.get('CuisineType'), data.get('MessID'), data.get('HostelID')))
        conn.commit()
        return jsonify({'message': 'Staff added successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@personnel_bp.route('/staff/<staff_id>', methods=['PUT'])
def update_staff(staff_id):
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        shift = data.get('ShiftSlot') or data.get('Shift', 'Morning')
        join_date = data.get('JoinDate') or data.get('HireDate', '2024-01-01')
        cursor.execute('''
            UPDATE STAFF 
            SET FirstName = ?, LastName = ?, Phone = ?, JoinDate = ?, Salary = ?, Role = ?, ShiftSlot = ?, CuisineType = ?, MessID = ?, HostelID = ?
            WHERE StaffID = ?
        ''', (data['FirstName'], data['LastName'], data.get('Phone', ''), join_date, data.get('Salary', 0), data.get('Role', 'Helper'), shift, data.get('CuisineType'), data.get('MessID'), data.get('HostelID'), staff_id))
        conn.commit()
        return jsonify({'message': 'Staff updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@personnel_bp.route('/staff/<staff_id>', methods=['DELETE'])
def delete_staff(staff_id):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM STAFF WHERE StaffID = ?', (staff_id,))
        conn.commit()
        return jsonify({'message': 'Staff deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
