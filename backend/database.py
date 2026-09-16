import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "hostel.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.executescript("""
    CREATE TABLE IF NOT EXISTS WARDEN (
        WardenID TEXT PRIMARY KEY,
        FirstName TEXT NOT NULL,
        LastName TEXT NOT NULL,
        Email TEXT,
        Phone TEXT,
        Designation TEXT,
        JoiningDate TEXT
    );

    CREATE TABLE IF NOT EXISTS HOSTEL (
        HostelID TEXT PRIMARY KEY,
        HostelName TEXT NOT NULL,
        HostelType TEXT NOT NULL,
        TotalFloors INTEGER NOT NULL,
        TotalRooms INTEGER NOT NULL,
        Location TEXT,
        WardenID TEXT
    );

    CREATE TABLE IF NOT EXISTS ROOM_TYPE (
        Type TEXT PRIMARY KEY,
        Capacity INTEGER NOT NULL,
        RoomRent REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ROOM (
        RoomNo TEXT PRIMARY KEY,
        FloorNo INTEGER NOT NULL,
        Status TEXT NOT NULL,
        Type TEXT NOT NULL,
        HostelID TEXT NOT NULL
    );

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
    );

    CREATE TABLE IF NOT EXISTS GUARDIAN (
        GuardianID TEXT PRIMARY KEY,
        StudentID TEXT NOT NULL,
        GuardianName TEXT NOT NULL,
        Relationship TEXT NOT NULL,
        Phone TEXT NOT NULL,
        Email TEXT,
        Address TEXT
    );

    CREATE TABLE IF NOT EXISTS STAFF (
        StaffID TEXT PRIMARY KEY,
        FirstName TEXT NOT NULL,
        LastName TEXT NOT NULL,
        Phone TEXT NOT NULL,
        JoinDate TEXT NOT NULL,
        Salary REAL NOT NULL,
        Role TEXT NOT NULL,
        ShiftSlot TEXT NOT NULL,
        CuisineType TEXT,
        MessID TEXT,
        HostelID TEXT
    );

    CREATE TABLE IF NOT EXISTS ROOM_ALLOCATION (
        AllocationID TEXT PRIMARY KEY,
        StudentID TEXT NOT NULL,
        RoomNo TEXT NOT NULL,
        AcademicYear TEXT NOT NULL,
        Semester TEXT NOT NULL,
        CheckInDate TEXT NOT NULL,
        CheckOutDate TEXT
    );
    """)

    conn.commit()

    # Seed data if tables are empty
    cursor.execute("SELECT COUNT(*) FROM HOSTEL")
    if cursor.fetchone()[0] == 0:
        seed_sample_data(conn)
    else:
        # Seed GUARDIAN and STAFF if not seeded
        cursor.execute("SELECT COUNT(*) FROM GUARDIAN")
        if cursor.fetchone()[0] == 0:
            seed_personnel_extra(conn)

    conn.close()

def seed_sample_data(conn):
    cursor = conn.cursor()

    # Seed Wardens
    wardens = [
        ("W-101", "Dr. Rajesh", "Sharma", "r.sharma@univ.edu", "+91 9876543210", "Chief Warden", "2020-08-15"),
        ("W-102", "Prof. Sunita", "Rao", "s.rao@univ.edu", "+91 9876543211", "Warden", "2021-06-10"),
        ("W-103", "Dr. Amit", "Verma", "a.verma@univ.edu", "+91 9876543212", "Assistant Warden", "2022-01-20"),
        ("W-104", "Dr. Priya", "Nair", "p.nair@univ.edu", "+91 9876543213", "Warden", "2023-03-01"),
    ]
    cursor.executemany("INSERT INTO WARDEN VALUES (?, ?, ?, ?, ?, ?, ?)", wardens)

    # Seed Hostels
    hostels = [
        ("H-BOYS-1", "Tagore Boys Hostel", "Boys", 4, 40, "North Campus Block A", "W-101"),
        ("H-GIRLS-1", "Kalpana Girls Hostel", "Girls", 3, 30, "South Campus Block B", "W-102"),
        ("H-BOYS-2", "Ramanujan Boys Hostel", "Boys", 4, 40, "North Campus Block C", "W-103"),
        ("H-GIRLS-2", "Sarojini Girls Hostel", "Girls", 3, 30, "South Campus Block D", "W-104"),
    ]
    cursor.executemany("INSERT INTO HOSTEL VALUES (?, ?, ?, ?, ?, ?, ?)", hostels)

    # Seed Room Types
    room_types = [
        ("Single", 1, 45000.0),
        ("Double", 2, 32000.0),
        ("Triple", 3, 24000.0),
        ("Deluxe Single", 1, 55000.0),
    ]
    cursor.executemany("INSERT INTO ROOM_TYPE VALUES (?, ?, ?)", room_types)

    # Seed Students
    students = [
        ("S-2024-001", "Aarav", "Patel", "Male", "2003-05-12", "aarav.p@univ.edu", "+91 9123456780", "O+", "Computer Science", "2024-08-01", 1),
        ("S-2024-002", "Ananya", "Sen", "Female", "2003-09-25", "ananya.s@univ.edu", "+91 9123456781", "A+", "Electrical Engg", "2024-08-01", 1),
        ("S-2024-003", "Rohan", "Gupta", "Male", "2003-02-18", "rohan.g@univ.edu", "+91 9123456782", "B+", "Mechanical Engg", "2024-08-01", 1),
        ("S-2024-004", "Diya", "Reddy", "Female", "2003-11-04", "diya.r@univ.edu", "+91 9123456783", "AB+", "Biotechnology", "2024-08-01", 1),
        ("S-2024-005", "Kabir", "Mehta", "Male", "2002-12-30", "kabir.m@univ.edu", "+91 9123456784", "O-", "Civil Engg", "2023-08-01", 1),
        ("S-2024-006", "Ishani", "Roy", "Female", "2003-07-14", "ishani.r@univ.edu", "+91 9123456785", "A-", "Computer Science", "2024-08-01", 1),
        ("S-2024-007", "Vikram", "Singh", "Male", "2002-04-09", "vikram.s@univ.edu", "+91 9123456786", "B-", "Electronics", "2023-08-01", 1),
        ("S-2024-008", "Meera", "Joshi", "Female", "2003-01-22", "meera.j@univ.edu", "+91 9123456787", "O+", "Chemical Engg", "2024-08-01", 1),
    ]
    cursor.executemany("INSERT INTO STUDENT VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", students)

    # Seed Rooms
    rooms = []
    for floor in [1, 2, 3]:
        for r in range(101, 106):
            room_no = f"TB-{floor}{r%100:02d}"
            rtype = "Single" if r % 3 == 0 else ("Double" if r % 3 == 1 else "Triple")
            status = "Vacant" if r % 4 == 0 else ("UnderMaintenance" if r == 105 and floor == 2 else "Occupied")
            rooms.append((room_no, floor, status, rtype, "H-BOYS-1"))

    for floor in [1, 2, 3]:
        for r in range(101, 106):
            room_no = f"KG-{floor}{r%100:02d}"
            rtype = "Double" if r % 2 == 0 else "Single"
            status = "Occupied" if r % 3 != 0 else "Vacant"
            rooms.append((room_no, floor, status, rtype, "H-GIRLS-1"))

    cursor.executemany("INSERT INTO ROOM VALUES (?, ?, ?, ?, ?)", rooms)

    # Seed Allocations
    allocations = [
        ("ALLOC-001", "S-2024-001", "TB-101", "2025-26", "Fall", "2025-08-01", None),
        ("ALLOC-002", "S-2024-003", "TB-102", "2025-26", "Fall", "2025-08-01", None),
        ("ALLOC-003", "S-2024-005", "TB-103", "2025-26", "Fall", "2025-08-01", None),
        ("ALLOC-004", "S-2024-007", "TB-104", "2025-26", "Fall", "2025-08-01", None),
        ("ALLOC-005", "S-2024-002", "KG-101", "2025-26", "Fall", "2025-08-01", None),
        ("ALLOC-006", "S-2024-004", "KG-102", "2025-26", "Fall", "2025-08-01", None),
        ("ALLOC-007", "S-2024-006", "KG-104", "2025-26", "Fall", "2025-08-01", None),
        ("ALLOC-008", "S-2024-008", "KG-201", "2025-26", "Fall", "2025-08-01", None),
    ]
    cursor.executemany("INSERT INTO ROOM_ALLOCATION VALUES (?, ?, ?, ?, ?, ?, ?)", allocations)

    seed_personnel_extra(conn)
    conn.commit()

def seed_personnel_extra(conn):
    cursor = conn.cursor()

    # Seed Guardians
    guardians = [
        ("G-001", "S-2024-001", "Suresh Patel", "Father", "+91 9825012345", "suresh.p@gmail.com", "Ahmedabad, Gujarat"),
        ("G-002", "S-2024-002", "Debabrata Sen", "Father", "+91 9831098765", "d.sen@gmail.com", "Kolkata, West Bengal"),
        ("G-003", "S-2024-003", "Sunil Gupta", "Father", "+91 9811054321", "sunil.g@gmail.com", "Delhi NCR"),
        ("G-004", "S-2024-004", "Venkatesh Reddy", "Father", "+91 9848033221", "v.reddy@gmail.com", "Hyderabad, Telangana"),
    ]
    cursor.executemany("INSERT OR IGNORE INTO GUARDIAN VALUES (?, ?, ?, ?, ?, ?, ?)", guardians)

    # Seed Staff
    staff = [
        ("ST-501", "Ramesh", "Kumar", "+91 9711223344", "2021-04-10", 28000.0, "Chef", "Morning", "North Indian", "MESS-1", None),
        ("ST-502", "Lakshmi", "Devi", "+91 9711223345", "2022-01-15", 22000.0, "Cleaner", "Morning", None, None, "H-BOYS-1"),
        ("ST-503", "Sanjay", "Yadav", "+91 9711223346", "2020-11-01", 32000.0, "Chef", "Evening", "South Indian", "MESS-2", None),
        ("ST-504", "Bahadur", "Thapa", "+91 9711223347", "2019-08-20", 25000.0, "Security", "Night", None, None, "H-GIRLS-1"),
        ("ST-505", "Gopal", "Swamy", "+91 9711223348", "2023-02-01", 18000.0, "Helper", "Morning", None, "MESS-1", None),
    ]
    cursor.executemany("INSERT OR IGNORE INTO STAFF VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", staff)
    conn.commit()

if __name__ == "__main__":
    init_db()
    print("Database initialized and personnel records seeded.")
