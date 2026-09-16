import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'hostel.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON')
    return conn

def init_db():
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

    # Seed data if tables are empty
    cursor.execute('SELECT COUNT(*) FROM WARDEN')
    if cursor.fetchone()[0] == 0:
        try:
            from seed import seed_all
            seed_all(conn)
        except ImportError:
            pass

    conn.close()
