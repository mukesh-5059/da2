from flask import Blueprint, request, jsonify
from database import get_db

mess_bp = Blueprint('mess', __name__)

@mess_bp.route('/messes', methods=['GET'])
def get_messes():
    conn = get_db()
    try:
        mess_type = request.args.get('mess_type')
        query = 'SELECT * FROM MESS'
        params = []
        if mess_type:
            query += ' WHERE MessType = ?'
            params.append(mess_type)
            
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['MessID', 'MessName', 'Location', 'Phone', 'MessType']
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@mess_bp.route('/messes', methods=['POST'])
def add_mess():
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        capacity = data.get('SeatingCapacity') or data.get('Capacity', 100)
        cursor.execute('''
            INSERT INTO MESS (MessID, MessName, MessType, Location, Phone, SeatingCapacity)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (data['MessID'], data['MessName'], data['MessType'], data.get('Location'), data.get('Phone'), capacity))
        conn.commit()
        return jsonify({'message': 'Mess added successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@mess_bp.route('/messes/<mess_id>', methods=['PUT'])
def update_mess(mess_id):
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        capacity = data.get('SeatingCapacity') or data.get('Capacity', 100)
        cursor.execute('''
            UPDATE MESS 
            SET MessName = ?, MessType = ?, Location = ?, Phone = ?, SeatingCapacity = ?
            WHERE MessID = ?
        ''', (data['MessName'], data['MessType'], data.get('Location'), data.get('Phone'), capacity, mess_id))
        conn.commit()
        return jsonify({'message': 'Mess updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@mess_bp.route('/messes/<mess_id>', methods=['DELETE'])
def delete_mess(mess_id):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM MESS WHERE MessID = ?', (mess_id,))
        conn.commit()
        return jsonify({'message': 'Mess deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@mess_bp.route('/meals', methods=['GET'])
def get_meals():
    conn = get_db()
    try:
        mess_id = request.args.get('mess_id')
        query = '''
            SELECT m.*, me.MessName 
            FROM MEAL m
            LEFT JOIN MESS me ON m.MessID = me.MessID
            WHERE 1=1
        '''
        params = []
        if mess_id:
            query += ' AND m.MessID = ?'
            params.append(mess_id)
            
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['m.MealID', 'm.MealName', 'me.MessName', 'm.Description']
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@mess_bp.route('/meals', methods=['POST'])
def add_meal():
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cost = data.get('Cost') if data.get('Cost') is not None else data.get('Price', 0.0)
        cursor.execute('''
            INSERT INTO MEAL (MealID, MessID, MealName, Description, Cost)
            VALUES (?, ?, ?, ?, ?)
        ''', (data.get('MealID'), data['MessID'], data['MealName'], data.get('Description', ''), cost))
        conn.commit()
        return jsonify({'message': 'Meal added successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@mess_bp.route('/meals/<meal_id>', methods=['PUT'])
def update_meal(meal_id):
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cost = data.get('Cost') if data.get('Cost') is not None else data.get('Price', 0.0)
        cursor.execute('''
            UPDATE MEAL 
            SET MessID = ?, MealName = ?, Description = ?, Cost = ?
            WHERE MealID = ?
        ''', (data['MessID'], data['MealName'], data.get('Description', ''), cost, meal_id))
        conn.commit()
        return jsonify({'message': 'Meal updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@mess_bp.route('/meals/<meal_id>', methods=['DELETE'])
def delete_meal(meal_id):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM MEAL WHERE MealID = ?', (meal_id,))
        conn.commit()
        return jsonify({'message': 'Meal deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@mess_bp.route('/mess-schedules', methods=['GET'])
def get_mess_schedules():
    conn = get_db()
    try:
        mess_id = request.args.get('mess_id')
        day_of_week = request.args.get('day_of_week')
        query = '''
            SELECT ms.*, m.MessName, me.MealName
            FROM MESS_SCHEDULE ms
            JOIN MESS m ON ms.MessID = m.MessID
            JOIN MEAL me ON ms.MealID = me.MealID
            WHERE 1=1
        '''
        params = []
        if mess_id:
            query += ' AND ms.MessID = ?'
            params.append(mess_id)
        if day_of_week:
            query += ' AND ms.DayOfWeek = ?'
            params.append(day_of_week)
            
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['ms.ScheduleID', 'm.MessName', 'me.MealName', 'ms.DayOfWeek', 'ms.MealTime']
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@mess_bp.route('/mess-schedules', methods=['POST'])
def add_mess_schedule():
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO MESS_SCHEDULE (ScheduleID, MessID, MealID, DayOfWeek, MealTime)
            VALUES (?, ?, ?, ?, ?)
        ''', (data.get('ScheduleID'), data['MessID'], data['MealID'], data['DayOfWeek'], data.get('MealTime', 'Breakfast')))
        conn.commit()
        return jsonify({'message': 'Mess schedule added successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@mess_bp.route('/mess-schedules/<schedule_id>', methods=['PUT'])
def update_mess_schedule(schedule_id):
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE MESS_SCHEDULE 
            SET MessID = ?, MealID = ?, DayOfWeek = ?, MealTime = ?
            WHERE ScheduleID = ?
        ''', (data['MessID'], data['MealID'], data['DayOfWeek'], data.get('MealTime', 'Breakfast'), schedule_id))
        conn.commit()
        return jsonify({'message': 'Mess schedule updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@mess_bp.route('/mess-schedules/<schedule_id>', methods=['DELETE'])
def delete_mess_schedule(schedule_id):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM MESS_SCHEDULE WHERE ScheduleID = ?', (schedule_id,))
        conn.commit()
        return jsonify({'message': 'Mess schedule deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()


@mess_bp.route('/mess-enrollments', methods=['GET'])
def get_mess_enrollments():
    conn = get_db()
    try:
        student_id = request.args.get('student_id')
        mess_id = request.args.get('mess_id')
        is_active = request.args.get('is_active')
        
        query = '''
            SELECT me.*, s.FirstName, s.LastName, m.MessName
            FROM MESS_ENROLLMENT me
            JOIN STUDENT s ON me.StudentID = s.StudentID
            JOIN MESS m ON me.MessID = m.MessID
            WHERE 1=1
        '''
        params = []
        if student_id:
            query += ' AND me.StudentID = ?'
            params.append(student_id)
        if mess_id:
            query += ' AND me.MessID = ?'
            params.append(mess_id)
        if is_active is not None:
            query += ' AND me.IsActive = ?'
            params.append(is_active)
            
        cursor = conn.cursor()
        from utils import paginate_query
        search_columns = ['me.EnrollmentID', 's.FirstName', 's.LastName', 'm.MessName', 'me.MealPlanType']
        result = paginate_query(cursor, query, search_columns, params)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@mess_bp.route('/mess-enrollments', methods=['POST'])
def add_mess_enrollment():
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO MESS_ENROLLMENT (EnrollmentID, StudentID, MessID, MealPlanType, StartDate, EndDate, IsActive)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (data.get('EnrollmentID'), data['StudentID'], data['MessID'], data.get('MealPlanType', 'Veg'), data['StartDate'], data.get('EndDate'), data.get('IsActive', 1)))
        conn.commit()
        return jsonify({'message': 'Mess enrollment added successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@mess_bp.route('/mess-enrollments/<enrollment_id>', methods=['PUT'])
def update_mess_enrollment(enrollment_id):
    data = request.get_json()
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE MESS_ENROLLMENT 
            SET StudentID = ?, MessID = ?, MealPlanType = ?, StartDate = ?, EndDate = ?, IsActive = ?
            WHERE EnrollmentID = ?
        ''', (data['StudentID'], data['MessID'], data.get('MealPlanType', 'Veg'), data['StartDate'], data.get('EndDate'), data.get('IsActive', 1), enrollment_id))
        conn.commit()
        return jsonify({'message': 'Mess enrollment updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@mess_bp.route('/mess-enrollments/<enrollment_id>', methods=['DELETE'])
def delete_mess_enrollment(enrollment_id):
    conn = get_db()
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM MESS_ENROLLMENT WHERE EnrollmentID = ?', (enrollment_id,))
        conn.commit()
        return jsonify({'message': 'Mess enrollment deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
