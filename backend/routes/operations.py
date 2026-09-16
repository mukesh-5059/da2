from flask import Blueprint, request, jsonify
from database import get_db

operations_bp = Blueprint('operations', __name__)

@operations_bp.route('/complaints', methods=['GET'])
def get_complaints():
    student_id = request.args.get('student_id')
    status = request.args.get('status')
    category = request.args.get('category')
    
    query = """
        SELECT c.*, s.FirstName, s.LastName
        FROM COMPLAINT c
        LEFT JOIN STUDENT s ON c.StudentID = s.StudentID
        WHERE 1=1
    """
    params = []
    
    if student_id:
        query += " AND c.StudentID=?"
        params.append(student_id)
    if status:
        query += " AND c.Status=?"
        params.append(status)
    if category:
        query += " AND c.Category=?"
        params.append(category)
        
    query += " ORDER BY c.DateFiled DESC"
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return jsonify([dict(r) for r in rows]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/complaints', methods=['POST'])
def add_complaint():
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO COMPLAINT (ComplaintID, StudentID, RoomNo, SpecificLocation, Category, Description, DateFiled, Status, ResolvedDate, ResolutionRemarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (data.get('ComplaintID'), data.get('StudentID'), data.get('RoomNo'), data.get('SpecificLocation'), data.get('Category'), data.get('Description'), data.get('DateFiled'), data.get('Status'), data.get('ResolvedDate'), data.get('ResolutionRemarks'))
        )
        conn.commit()
        return jsonify({'message': 'Complaint created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/complaints/<complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE COMPLAINT SET StudentID=?, RoomNo=?, SpecificLocation=?, Category=?, Description=?, DateFiled=?, Status=?, ResolvedDate=?, ResolutionRemarks=? WHERE ComplaintID=?",
            (data.get('StudentID'), data.get('RoomNo'), data.get('SpecificLocation'), data.get('Category'), data.get('Description'), data.get('DateFiled'), data.get('Status'), data.get('ResolvedDate'), data.get('ResolutionRemarks'), complaint_id)
        )
        conn.commit()
        return jsonify({'message': 'Complaint updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/complaints/<complaint_id>', methods=['DELETE'])
def delete_complaint(complaint_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM COMPLAINT WHERE ComplaintID=?", (complaint_id,))
        conn.commit()
        return jsonify({'message': 'Complaint deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/visitor-logs', methods=['GET'])
def get_visitor_logs():
    student_id = request.args.get('student_id')
    
    query = """
        SELECT v.*, s.FirstName, s.LastName
        FROM VISITOR_LOG v
        LEFT JOIN STUDENT s ON v.StudentID = s.StudentID
        WHERE 1=1
    """
    params = []
    
    if student_id:
        query += " AND v.StudentID=?"
        params.append(student_id)
        
    query += " ORDER BY v.CheckInTime DESC"
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return jsonify([dict(r) for r in rows]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/visitor-logs', methods=['POST'])
def add_visitor_log():
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO VISITOR_LOG (VisitID, StudentID, VisitorName, VisitorPhone, Relationship, Purpose, CheckInTime, CheckOutTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (data.get('VisitID'), data.get('StudentID'), data.get('VisitorName'), data.get('VisitorPhone'), data.get('Relationship'), data.get('Purpose'), data.get('CheckInTime'), data.get('CheckOutTime'))
        )
        conn.commit()
        return jsonify({'message': 'Visitor log created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/visitor-logs/<visit_id>', methods=['PUT'])
def update_visitor_log(visit_id):
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE VISITOR_LOG SET StudentID=?, VisitorName=?, VisitorPhone=?, Relationship=?, Purpose=?, CheckInTime=?, CheckOutTime=? WHERE VisitID=?",
            (data.get('StudentID'), data.get('VisitorName'), data.get('VisitorPhone'), data.get('Relationship'), data.get('Purpose'), data.get('CheckInTime'), data.get('CheckOutTime'), visit_id)
        )
        conn.commit()
        return jsonify({'message': 'Visitor log updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/visitor-logs/<visit_id>', methods=['DELETE'])
def delete_visitor_log(visit_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM VISITOR_LOG WHERE VisitID=?", (visit_id,))
        conn.commit()
        return jsonify({'message': 'Visitor log deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/leave-requests', methods=['GET'])
def get_leave_requests():
    student_id = request.args.get('student_id')
    approval_status = request.args.get('approval_status')
    
    query = """
        SELECT l.*, s.FirstName, s.LastName, w.FirstName as ApproverName
        FROM LEAVE_REQUEST l
        LEFT JOIN STUDENT s ON l.StudentID = s.StudentID
        LEFT JOIN WARDEN w ON l.ApprovedBy = w.WardenID
        WHERE 1=1
    """
    params = []
    
    if student_id:
        query += " AND l.StudentID=?"
        params.append(student_id)
    if approval_status:
        query += " AND l.ApprovalStatus=?"
        params.append(approval_status)
        
    query += " ORDER BY l.FromDate DESC"
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return jsonify([dict(r) for r in rows]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/leave-requests', methods=['POST'])
def add_leave_request():
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO LEAVE_REQUEST (LeaveID, StudentID, LeaveType, FromDate, ToDate, Reason, ApprovalStatus, ApprovedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (data.get('LeaveID'), data.get('StudentID'), data.get('LeaveType'), data.get('FromDate'), data.get('ToDate'), data.get('Reason'), data.get('ApprovalStatus'), data.get('ApprovedBy'))
        )
        conn.commit()
        return jsonify({'message': 'Leave request created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/leave-requests/<leave_id>', methods=['PUT'])
def update_leave_request(leave_id):
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE LEAVE_REQUEST SET StudentID=?, LeaveType=?, FromDate=?, ToDate=?, Reason=?, ApprovalStatus=?, ApprovedBy=? WHERE LeaveID=?",
            (data.get('StudentID'), data.get('LeaveType'), data.get('FromDate'), data.get('ToDate'), data.get('Reason'), data.get('ApprovalStatus'), data.get('ApprovedBy'), leave_id)
        )
        conn.commit()
        return jsonify({'message': 'Leave request updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/leave-requests/<leave_id>', methods=['DELETE'])
def delete_leave_request(leave_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM LEAVE_REQUEST WHERE LeaveID=?", (leave_id,))
        conn.commit()
        return jsonify({'message': 'Leave request deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/attendance-logs', methods=['GET'])
def get_attendance_logs():
    student_id = request.args.get('student_id')
    date = request.args.get('date')
    status = request.args.get('status')
    
    query = """
        SELECT a.*, s.FirstName, s.LastName
        FROM ATTENDANCE_LOG a
        LEFT JOIN STUDENT s ON a.StudentID = s.StudentID
        WHERE 1=1
    """
    params = []
    
    if student_id:
        query += " AND a.StudentID=?"
        params.append(student_id)
    if date:
        query += " AND a.Date=?"
        params.append(date)
    if status:
        query += " AND a.Status=?"
        params.append(status)
        
    query += " ORDER BY a.Date DESC, a.StudentID"
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return jsonify([dict(r) for r in rows]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/attendance-logs', methods=['POST'])
def add_attendance_log():
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO ATTENDANCE_LOG (LogID, StudentID, Date, Status, PunchTime) VALUES (?, ?, ?, ?, ?)",
            (data.get('LogID'), data.get('StudentID'), data.get('Date'), data.get('Status'), data.get('PunchTime'))
        )
        conn.commit()
        return jsonify({'message': 'Attendance log created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/attendance-logs/<log_id>', methods=['PUT'])
def update_attendance_log(log_id):
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE ATTENDANCE_LOG SET StudentID=?, Date=?, Status=?, PunchTime=? WHERE LogID=?",
            (data.get('StudentID'), data.get('Date'), data.get('Status'), data.get('PunchTime'), log_id)
        )
        conn.commit()
        return jsonify({'message': 'Attendance log updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/attendance-logs/<log_id>', methods=['DELETE'])
def delete_attendance_log(log_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM ATTENDANCE_LOG WHERE LogID=?", (log_id,))
        conn.commit()
        return jsonify({'message': 'Attendance log deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/notices', methods=['GET'])
def get_notices():
    hostel_id = request.args.get('hostel_id')
    
    query = """
        SELECT n.*, h.HostelName, w.FirstName as PostedByName, w.LastName
        FROM NOTICE n
        LEFT JOIN HOSTEL h ON n.HostelID = h.HostelID
        LEFT JOIN WARDEN w ON n.PostedBy = w.WardenID
        WHERE 1=1
    """
    params = []
    
    if hostel_id:
        query += " AND n.HostelID=?"
        params.append(hostel_id)
        
    query += " ORDER BY n.PostedDate DESC"
    
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return jsonify([dict(r) for r in rows]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/notices', methods=['POST'])
def add_notice():
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO NOTICE (NoticeID, HostelID, Title, Content, PostedDate, PostedBy, ExpiryDate) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (data.get('NoticeID'), data.get('HostelID'), data.get('Title'), data.get('Content'), data.get('PostedDate'), data.get('PostedBy'), data.get('ExpiryDate'))
        )
        conn.commit()
        return jsonify({'message': 'Notice created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/notices/<notice_id>', methods=['PUT'])
def update_notice(notice_id):
    data = request.get_json()
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE NOTICE SET HostelID=?, Title=?, Content=?, PostedDate=?, PostedBy=?, ExpiryDate=? WHERE NoticeID=?",
            (data.get('HostelID'), data.get('Title'), data.get('Content'), data.get('PostedDate'), data.get('PostedBy'), data.get('ExpiryDate'), notice_id)
        )
        conn.commit()
        return jsonify({'message': 'Notice updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@operations_bp.route('/notices/<notice_id>', methods=['DELETE'])
def delete_notice(notice_id):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM NOTICE WHERE NoticeID=?", (notice_id,))
        conn.commit()
        return jsonify({'message': 'Notice deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
