import os
import sqlite3

# Load .env variables (using python-dotenv if available, else lightweight fallback)
ENV_PATH = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(ENV_PATH):
    try:
        from dotenv import load_dotenv
        load_dotenv(ENV_PATH)
    except ImportError:
        with open(ENV_PATH, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    os.environ.setdefault(k.strip(), v.strip().strip("'\""))

DB_PATH = os.path.join(os.path.dirname(__file__), 'hostel.db')
DB_MODE = os.getenv('DB_MODE', 'local').strip().lower()
DATABASE_URL = os.getenv('DATABASE_URL', '').strip()

def is_cloud_mode():
    return DB_MODE in ('cloud', 'postgres', 'postgresql', 'neon') or bool(DATABASE_URL and DB_MODE != 'local')


def _convert_query(query):
    """Converts SQLite '?' parameter placeholders to PostgreSQL '%s'."""
    if '?' not in query:
        return query
    parts = []
    in_quote = False
    quote_char = ''
    for char in query:
        if char in ("'", '"'):
            if not in_quote:
                in_quote = True
                quote_char = char
            elif quote_char == char:
                in_quote = False
            parts.append(char)
        elif char == '?' and not in_quote:
            parts.append('%s')
        else:
            parts.append(char)
    return ''.join(parts)


class PostgresRow:
    """Dict-like and index-accessible row wrapper that mirrors sqlite3.Row.

    dict(row) works because Python's dict() recognizes the mapping protocol:
    it calls row.keys() and then row[key] for each key.
    """
    def __init__(self, description, values):
        # psycopg2 returns lowercase column names; preserve them as-is.
        # The _lower_map allows case-insensitive lookup so routes using
        # 'MessName' or 'messname' both resolve correctly.
        self._keys = [col.name for col in description] if description else []
        self._values = list(values)
        self._lower_map = {k.lower(): i for i, k in enumerate(self._keys)}

    def __getitem__(self, key):
        if isinstance(key, int):
            return self._values[key]
        idx = self._lower_map.get(str(key).lower())
        if idx is not None:
            return self._values[idx]
        raise KeyError(key)

    def get(self, key, default=None):
        try:
            return self[key]
        except KeyError:
            return default

    def keys(self):
        return self._keys

    def values(self):
        return self._values

    def items(self):
        return list(zip(self._keys, self._values))

    def __iter__(self):
        # Iterating a mapping yields keys — dict() then calls __getitem__ per key.
        return iter(self._keys)

    def __len__(self):
        return len(self._keys)

    def __repr__(self):
        return repr(dict(zip(self._keys, self._values)))



class PostgresCursorWrapper:
    """Wraps psycopg2 / psycopg cursor to emulate sqlite3 cursor."""
    def __init__(self, raw_cursor):
        self._cursor = raw_cursor

    def execute(self, query, params=None):
        converted = _convert_query(query)
        if params is not None:
            # Convert list/tuple params to tuple for psycopg2
            self._cursor.execute(converted, tuple(params) if isinstance(params, (list, tuple)) else params)
        else:
            self._cursor.execute(converted)
        return self

    def executemany(self, query, params_seq):
        converted = _convert_query(query)
        params_list = list(params_seq)
        if not params_list:
            return self
        # execute_values batches all rows into a single multi-row INSERT,
        # sending one network round-trip instead of N (one per row).
        # Fall back to standard executemany for UPDATE/DELETE statements.
        stripped = converted.strip().upper()
        if stripped.startswith('INSERT') and hasattr(self, '_use_execute_values'):
            from psycopg2.extras import execute_values
            # execute_values expects a template with %s not (%s, %s, ...) tuple syntax
            # Convert "INSERT INTO T VALUES (%s, %s)" → template "INSERT INTO T VALUES %s"
            import re
            template = re.sub(r'\(%s(?:,\s*%s)*\)\s*$', '%s', converted, flags=re.IGNORECASE)
            execute_values(self._cursor, template, params_list, page_size=500)
        elif stripped.startswith('INSERT'):
            try:
                from psycopg2.extras import execute_values
                import re
                template = re.sub(r'\(%s(?:,\s*%s)*\)\s*$', '%s', converted, flags=re.IGNORECASE)
                execute_values(self._cursor, template, params_list, page_size=500)
            except Exception:
                self._cursor.executemany(converted, params_list)
        else:
            self._cursor.executemany(converted, params_list)
        return self


    def fetchone(self):
        row = self._cursor.fetchone()
        if row is None:
            return None
        return PostgresRow(self._cursor.description, row)

    def fetchall(self):
        rows = self._cursor.fetchall()
        desc = self._cursor.description
        return [PostgresRow(desc, r) for r in rows]

    def close(self):
        self._cursor.close()

    @property
    def rowcount(self):
        return self._cursor.rowcount

    @property
    def description(self):
        return self._cursor.description


class PostgresConnectionWrapper:
    """Wraps psycopg2 connection to provide a unified API with sqlite3."""
    def __init__(self, raw_conn):
        self._conn = raw_conn

    def cursor(self):
        return PostgresCursorWrapper(self._conn.cursor())

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        self._conn.close()

    def execute(self, query, params=None):
        cur = self.cursor()
        cur.execute(query, params)
        return cur


def get_db():
    """Returns database connection based on DB_MODE (local SQLite vs Neon PostgreSQL)."""
    if is_cloud_mode():
        if not DATABASE_URL:
            raise ValueError("DB_MODE is set to 'cloud' but DATABASE_URL is not configured in .env")
        try:
            import psycopg2
            raw_conn = psycopg2.connect(DATABASE_URL)
            return PostgresConnectionWrapper(raw_conn)
        except ImportError:
            try:
                import psycopg
                raw_conn = psycopg.connect(DATABASE_URL)
                return PostgresConnectionWrapper(raw_conn)
            except ImportError:
                raise ImportError(
                    "PostgreSQL driver not installed. Please install psycopg2-binary: pip install psycopg2-binary python-dotenv"
                )
    else:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        conn.execute('PRAGMA foreign_keys = ON')
        return conn


def init_db():
    """Initializes schema and tables for active database (SQLite or Neon PostgreSQL)."""
    conn = get_db()
    cursor = conn.cursor()
    
    # 1. WARDEN
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS WARDEN (
        WardenID TEXT PRIMARY KEY,
        FirstName TEXT NOT NULL,
        LastName TEXT NOT NULL,
        Email TEXT,
        Phone TEXT,
        Designation TEXT CHECK (Designation IN ('ChiefWarden','Warden','AssistantWarden')),
        JoiningDate TEXT
    )
    ''')
    
    # 2. STUDENT
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS STUDENT (
        StudentID TEXT PRIMARY KEY,
        FirstName TEXT NOT NULL,
        LastName TEXT NOT NULL,
        Gender TEXT,
        DOB TEXT,
        Email TEXT,
        Phone TEXT,
        BloodGroup TEXT,
        Department TEXT,
        AdmissionDate TEXT,
        IsActive INTEGER DEFAULT 1
    )
    ''')
    
    # 3. ROOM_TYPE
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS ROOM_TYPE (
        Type TEXT PRIMARY KEY,
        Capacity INTEGER NOT NULL,
        RoomRent REAL NOT NULL
    )
    ''')
    
    # 4. MESS
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS MESS (
        MessID TEXT PRIMARY KEY,
        MessName TEXT NOT NULL,
        MessType TEXT CHECK (MessType IN ('Veg','NonVeg','Both')) NOT NULL,
        Location TEXT,
        Phone TEXT,
        SeatingCapacity INTEGER
    )
    ''')
    
    # 5. SUPPLIER
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS SUPPLIER (
        SupplierID TEXT PRIMARY KEY,
        SupplierName TEXT NOT NULL,
        Phone TEXT,
        Email TEXT,
        Address TEXT
    )
    ''')
    
    # 6. INVENTORY_ITEM
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS INVENTORY_ITEM (
        ItemID TEXT PRIMARY KEY,
        ItemName TEXT NOT NULL,
        Category TEXT CHECK (Category IN ('Dairy','Vegetables','Grains','Spices','Cleaning','Other')) NOT NULL,
        Unit TEXT CHECK (Unit IN ('kg','litre','units','packets')) NOT NULL
    )
    ''')
    
    # 7. GUARDIAN
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS GUARDIAN (
        GuardianID TEXT PRIMARY KEY,
        StudentID TEXT NOT NULL,
        GuardianName TEXT NOT NULL,
        Relationship TEXT CHECK (Relationship IN ('Father','Mother','Sibling','Other')) NOT NULL,
        Phone TEXT NOT NULL,
        Email TEXT,
        Address TEXT,
        FOREIGN KEY (StudentID) REFERENCES STUDENT(StudentID)
    )
    ''')
    
    # 8. HOSTEL
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS HOSTEL (
        HostelID TEXT PRIMARY KEY,
        HostelName TEXT NOT NULL,
        HostelType TEXT CHECK (HostelType IN ('Boys','Girls')) NOT NULL,
        TotalFloors INTEGER NOT NULL,
        TotalRooms INTEGER NOT NULL,
        Location TEXT,
        WardenID TEXT,
        FOREIGN KEY (WardenID) REFERENCES WARDEN(WardenID)
    )
    ''')
    
    # 9. MEAL
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS MEAL (
        MealID TEXT PRIMARY KEY,
        MealName TEXT NOT NULL,
        Description TEXT,
        Cost REAL NOT NULL,
        MessID TEXT NOT NULL,
        FOREIGN KEY (MessID) REFERENCES MESS(MessID)
    )
    ''')
    
    # 10. MONTHLY_BILL
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS MONTHLY_BILL (
        BillID TEXT PRIMARY KEY,
        StudentID TEXT NOT NULL,
        BillingMonth INTEGER NOT NULL,
        BillingYear INTEGER NOT NULL,
        RoomRentCharges REAL NOT NULL,
        MessCharges REAL NOT NULL,
        OtherCharges REAL DEFAULT 0,
        TotalAmount REAL NOT NULL,
        DueDate TEXT NOT NULL,
        PaymentStatus TEXT CHECK (PaymentStatus IN ('Unpaid','Partial','Paid')) NOT NULL,
        FOREIGN KEY (StudentID) REFERENCES STUDENT(StudentID)
    )
    ''')
    
    # 11. VISITOR_LOG
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS VISITOR_LOG (
        VisitID TEXT PRIMARY KEY,
        StudentID TEXT NOT NULL,
        VisitorName TEXT NOT NULL,
        VisitorPhone TEXT,
        Relationship TEXT CHECK (Relationship IN ('Parent','Sibling','Friend','Other')),
        Purpose TEXT,
        CheckInTime TEXT NOT NULL,
        CheckOutTime TEXT,
        FOREIGN KEY (StudentID) REFERENCES STUDENT(StudentID)
    )
    ''')
    
    # 12. ATTENDANCE_LOG
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS ATTENDANCE_LOG (
        LogID TEXT PRIMARY KEY,
        StudentID TEXT NOT NULL,
        Date TEXT NOT NULL,
        Status TEXT CHECK (Status IN ('Present','Absent','OnLeave')) NOT NULL,
        PunchTime TEXT,
        FOREIGN KEY (StudentID) REFERENCES STUDENT(StudentID)
    )
    ''')
    
    # 13. INVENTORY_STOCK
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS INVENTORY_STOCK (
        MessID TEXT,
        ItemID TEXT,
        CurrentQuantity REAL NOT NULL,
        LastUpdatedDate TEXT NOT NULL,
        PRIMARY KEY (MessID, ItemID),
        FOREIGN KEY (MessID) REFERENCES MESS(MessID),
        FOREIGN KEY (ItemID) REFERENCES INVENTORY_ITEM(ItemID)
    )
    ''')
    
    # 14. ROOM
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS ROOM (
        RoomNo TEXT PRIMARY KEY,
        FloorNo INTEGER NOT NULL,
        Status TEXT CHECK (Status IN ('Occupied','Vacant','UnderMaintenance')) NOT NULL,
        Type TEXT NOT NULL,
        HostelID TEXT NOT NULL,
        FOREIGN KEY (Type) REFERENCES ROOM_TYPE(Type),
        FOREIGN KEY (HostelID) REFERENCES HOSTEL(HostelID)
    )
    ''')
    
    # 15. STAFF
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS STAFF (
        StaffID TEXT PRIMARY KEY,
        FirstName TEXT NOT NULL,
        LastName TEXT NOT NULL,
        Phone TEXT NOT NULL,
        JoinDate TEXT NOT NULL,
        Salary REAL NOT NULL,
        Role TEXT CHECK (Role IN ('Chef','Cleaner','Helper','Security')) NOT NULL,
        ShiftSlot TEXT CHECK (ShiftSlot IN ('Morning','Evening','Night')) NOT NULL,
        CuisineType TEXT,
        MessID TEXT,
        HostelID TEXT,
        CHECK (MessID IS NOT NULL OR HostelID IS NOT NULL),
        FOREIGN KEY (MessID) REFERENCES MESS(MessID),
        FOREIGN KEY (HostelID) REFERENCES HOSTEL(HostelID)
    )
    ''')
    
    # 16. PROCUREMENT_EVENT
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS PROCUREMENT_EVENT (
        PurchaseID TEXT PRIMARY KEY,
        MessID TEXT NOT NULL,
        SupplierID TEXT NOT NULL,
        ItemID TEXT NOT NULL,
        Quantity REAL NOT NULL,
        PurchaseDate TEXT NOT NULL,
        UnitPrice REAL NOT NULL,
        TotalCost REAL NOT NULL,
        FOREIGN KEY (MessID) REFERENCES MESS(MessID),
        FOREIGN KEY (SupplierID) REFERENCES SUPPLIER(SupplierID),
        FOREIGN KEY (ItemID) REFERENCES INVENTORY_ITEM(ItemID)
    )
    ''')
    
    # 17. PAYMENT_TRANSACTION
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS PAYMENT_TRANSACTION (
        PaymentID TEXT PRIMARY KEY,
        BillID TEXT NOT NULL,
        AmountPaid REAL NOT NULL,
        PaymentMode TEXT CHECK (PaymentMode IN ('Cash','UPI','Card','BankTransfer')) NOT NULL,
        PaymentDate TEXT NOT NULL,
        TransactionReference TEXT,
        FOREIGN KEY (BillID) REFERENCES MONTHLY_BILL(BillID)
    )
    ''')
    
    # 18. NOTICE
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS NOTICE (
        NoticeID TEXT PRIMARY KEY,
        HostelID TEXT NOT NULL,
        Title TEXT NOT NULL,
        Content TEXT NOT NULL,
        PostedDate TEXT NOT NULL,
        PostedBy TEXT NOT NULL,
        ExpiryDate TEXT,
        FOREIGN KEY (HostelID) REFERENCES HOSTEL(HostelID),
        FOREIGN KEY (PostedBy) REFERENCES WARDEN(WardenID)
    )
    ''')
    
    # 19. LEAVE_REQUEST
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS LEAVE_REQUEST (
        LeaveID TEXT PRIMARY KEY,
        StudentID TEXT NOT NULL,
        LeaveType TEXT CHECK (LeaveType IN ('Weekend','Medical','Vacation','Emergency')) NOT NULL,
        FromDate TEXT NOT NULL,
        ToDate TEXT NOT NULL,
        Reason TEXT,
        ApprovalStatus TEXT CHECK (ApprovalStatus IN ('Pending','Approved','Rejected')) NOT NULL,
        ApprovedBy TEXT,
        FOREIGN KEY (StudentID) REFERENCES STUDENT(StudentID),
        FOREIGN KEY (ApprovedBy) REFERENCES WARDEN(WardenID)
    )
    ''')
    
    # 20. MESS_SCHEDULE
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS MESS_SCHEDULE (
        ScheduleID TEXT PRIMARY KEY,
        MessID TEXT NOT NULL,
        MealID TEXT NOT NULL,
        DayOfWeek TEXT CHECK (DayOfWeek IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')) NOT NULL,
        MealTime TEXT CHECK (MealTime IN ('Breakfast','Lunch','Snack','Dinner')) NOT NULL,
        FOREIGN KEY (MessID) REFERENCES MESS(MessID),
        FOREIGN KEY (MealID) REFERENCES MEAL(MealID)
    )
    ''')
    
    # 21. MESS_ENROLLMENT
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS MESS_ENROLLMENT (
        EnrollmentID TEXT PRIMARY KEY,
        StudentID TEXT NOT NULL,
        MessID TEXT NOT NULL,
        MealPlanType TEXT CHECK (MealPlanType IN ('Veg','NonVeg','Special')) NOT NULL,
        StartDate TEXT NOT NULL,
        EndDate TEXT,
        IsActive INTEGER DEFAULT 1,
        FOREIGN KEY (StudentID) REFERENCES STUDENT(StudentID),
        FOREIGN KEY (MessID) REFERENCES MESS(MessID)
    )
    ''')
    
    # 22. ROOM_ALLOCATION
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS ROOM_ALLOCATION (
        AllocationID TEXT PRIMARY KEY,
        StudentID TEXT NOT NULL,
        RoomNo TEXT NOT NULL,
        AcademicYear TEXT NOT NULL,
        Semester TEXT CHECK (Semester IN ('Fall','Winter','Summer')) NOT NULL,
        CheckInDate TEXT NOT NULL,
        CheckOutDate TEXT,
        FOREIGN KEY (StudentID) REFERENCES STUDENT(StudentID),
        FOREIGN KEY (RoomNo) REFERENCES ROOM(RoomNo)
    )
    ''')
    
    # 23. COMPLAINT
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS COMPLAINT (
        ComplaintID TEXT PRIMARY KEY,
        StudentID TEXT NOT NULL,
        RoomNo TEXT,
        SpecificLocation TEXT,
        Category TEXT CHECK (Category IN ('Electrical','Plumbing','Furniture','Mess','Pest','Other')) NOT NULL,
        Description TEXT NOT NULL,
        DateFiled TEXT NOT NULL,
        Status TEXT CHECK (Status IN ('Open','InProgress','Resolved','Rejected')) NOT NULL,
        ResolvedDate TEXT,
        ResolutionRemarks TEXT,
        FOREIGN KEY (StudentID) REFERENCES STUDENT(StudentID),
        FOREIGN KEY (RoomNo) REFERENCES ROOM(RoomNo)
    )
    ''')

    conn.commit()
    conn.close()

