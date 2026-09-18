from flask import request
import re

# PostgreSQL folds all unquoted identifiers to lowercase.
# Complete explicit mapping: lowercase column name → original PascalCase DDL name.
# Covers every column across all 23 tables in the schema.
_COLUMN_NAME_MAP = {
    # IDs
    'wardenid': 'WardenID', 'hostelid': 'HostelID', 'roomno': 'RoomNo',
    'studentid': 'StudentID', 'staffid': 'StaffID', 'guardianid': 'GuardianID',
    'messid': 'MessID', 'mealid': 'MealID', 'billid': 'BillID',
    'transactionid': 'TransactionID', 'supplierid': 'SupplierID',
    'itemid': 'ItemID', 'stockid': 'StockID', 'purchaseid': 'PurchaseID',
    'noticeid': 'NoticeID', 'leaveid': 'LeaveID', 'visitorid': 'VisitorID',
    'logid': 'LogID', 'complaintid': 'ComplaintID', 'allocationid': 'AllocationID',
    'scheduleid': 'ScheduleID', 'enrollmentid': 'EnrollmentID',
    # Names
    'firstname': 'FirstName', 'lastname': 'LastName', 'hostelname': 'HostelName',
    'messname': 'MessName', 'suppliername': 'SupplierName', 'itemname': 'ItemName',
    'staffname': 'StaffName', 'guardianname': 'GuardianName', 'visitorname': 'VisitorName',
    'studentname': 'StudentName', 'wardenname': 'WardenName',
    # Personal info
    'gender': 'Gender', 'dob': 'DOB', 'email': 'Email', 'phone': 'Phone',
    'address': 'Address', 'bloodgroup': 'BloodGroup', 'department': 'Department',
    'designation': 'Designation', 'role': 'Role',
    # Room / Hostel
    'floorcount': 'FloorCount', 'totalfloors': 'TotalFloors', 'totalrooms': 'TotalRooms',
    'floorno': 'FloorNo', 'roomtype': 'RoomType', 'capacity': 'Capacity',
    'roomrent': 'RoomRent', 'isoccupied': 'IsOccupied',
    # Dates
    'joiningdate': 'JoiningDate', 'admissiondate': 'AdmissionDate',
    'allocationdate': 'AllocationDate', 'vacatingdate': 'VacatingDate',
    'purchasedate': 'PurchaseDate', 'duedate': 'DueDate', 'paymentdate': 'PaymentDate',
    'enrollmentdate': 'EnrollmentDate', 'startdate': 'StartDate', 'enddate': 'EndDate',
    'lastupdateddate': 'LastUpdatedDate', 'posteddate': 'PostedDate',
    'resolveddate': 'ResolvedDate', 'requestdate': 'RequestDate',
    'approveddate': 'ApprovedDate', 'visitdate': 'VisitDate', 'logdate': 'LogDate',
    # Financials / Billing
    'billingmonth': 'BillingMonth', 'billingyear': 'BillingYear',
    'roomrentcharge': 'RoomRentCharge', 'messfee': 'MessFee',
    'othercharges': 'OtherCharges', 'totalamount': 'TotalAmount',
    'amountpaid': 'AmountPaid', 'balancedue': 'BalanceDue',
    'paymentstatus': 'PaymentStatus', 'paymentmethod': 'PaymentMethod',
    'latepenalty': 'LatePenalty', 'transactionamount': 'TransactionAmount',
    # Inventory
    'category': 'Category', 'unit': 'Unit', 'currentquantity': 'CurrentQuantity',
    'unitprice': 'UnitPrice', 'totalcost': 'TotalCost', 'quantity': 'Quantity',
    # Mess / Schedule
    'mealtype': 'MealType', 'dayofweek': 'DayOfWeek', 'servingtime': 'ServingTime',
    'mealplantype': 'MealPlanType', 'menudetails': 'MenuDetails',
    'enrollmentstatus': 'EnrollmentStatus',
    # Operations
    'leavetype': 'LeaveType', 'leavereason': 'LeaveReason',
    'approvalstatus': 'ApprovalStatus', 'purposeofvisit': 'PurposeOfVisit',
    'checkintime': 'CheckInTime', 'checkouttime': 'CheckOutTime',
    'attendancestatus': 'AttendanceStatus', 'complainttype': 'ComplaintType',
    'complaintdescription': 'ComplaintDescription', 'resolutionstatus': 'ResolutionStatus',
    'subject': 'Subject', 'message': 'Message', 'noticetype': 'NoticeType',
    'description': 'Description', 'isactive': 'IsActive', 'isresolved': 'IsResolved',
    # Misc
    'academicyear': 'AcademicYear', 'status': 'Status', 'type': 'Type',
    'month': 'Month', 'year': 'Year',
}


def _restore_pascal_case(row_dict: dict) -> dict:
    """Convert psycopg2's lowercase column keys back to original PascalCase.

    Keys that already contain uppercase letters (sqlite3 mode) pass through unchanged.
    Unknown lowercase keys are title-cased as a fallback.
    """
    result = {}
    for key, val in row_dict.items():
        if key != key.lower():
            # Already has uppercase — sqlite3 mode, pass through
            result[key] = val
        else:
            result[_COLUMN_NAME_MAP.get(key, key.capitalize())] = val
    return result


def paginate_query(cursor, base_query, search_columns, params=None):
    """
    Applies server-side searching, sorting, and pagination to a SQL query.
    Returns a dict with 'data' (the rows) and 'totalRecords'.
    """
    if params is None:
        params = []
    else:
        # Make a copy so we don't modify the original list passed by reference
        params = list(params)
    
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10000, type=int)
    search = request.args.get('search', '').strip()
    sort_col = request.args.get('sortCol', '').strip()
    sort_dir = request.args.get('sortDir', 'asc').strip()

    # Extract pre-existing ORDER BY clause if present in base_query
    import re
    order_by_match = re.search(r'\s+(ORDER\s+BY\s+[\w\s.,]+)$', base_query, flags=re.IGNORECASE)
    default_order_by = ""
    if order_by_match:
        default_order_by = order_by_match.group(1).strip()
        base_query = base_query[:order_by_match.start()].strip()

    # 1. Apply Search (WHERE ... LIKE ...)
    where_clauses = []
    if search and search_columns:
        for col in search_columns:
            where_clauses.append(f"{col} LIKE ?")
            params.append(f"%{search}%")
        
    if where_clauses:
        # Check if base_query already has a WHERE clause to append safely
        if 'WHERE ' in base_query.upper():
            base_query += " AND (" + " OR ".join(where_clauses) + ")"
        else:
            base_query += " WHERE " + " OR ".join(where_clauses)

    # 2. Count total records BEFORE applying limit/offset
    # We wrap the query as a subquery with an alias for PostgreSQL & SQLite compatibility
    count_query = f"SELECT COUNT(*) FROM ({base_query}) AS _count_subq"
    cursor.execute(count_query, params)
    total_records = cursor.fetchone()[0]

    # 3. Apply Sorting (ORDER BY)
    if sort_col:
        # Strip out non-alphanumeric characters to prevent SQL injection in ORDER BY
        safe_col = ''.join(c for c in sort_col if c.isalnum() or c == '_')
        direction = 'DESC' if sort_dir.lower() == 'desc' else 'ASC'
        base_query += f" ORDER BY {safe_col} {direction}"
    elif default_order_by:
        base_query += f" {default_order_by}"

    # 4. Apply Pagination (LIMIT & OFFSET)
    offset = (page - 1) * limit
    base_query += " LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    # 5. Execute Final Query
    cursor.execute(base_query, params)
    raw_rows = cursor.fetchall()

    rows = []
    for r in raw_rows:
        d = dict(r)
        rows.append(_restore_pascal_case(d))

    return {
        "data": rows,
        "totalRecords": total_records
    }
