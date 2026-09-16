import random
from datetime import datetime, timedelta
import sqlite3
import uuid

# Helper lists for data generation
INDIAN_FIRST_NAMES_MALE = [
    'Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya',
    'Atharva', 'Aaryan', 'Dhruv', 'Kabir', 'Rishi', 'Rudra', 'Karan', 'Om', 'Shivansh', 'Ansh',
    'Dev', 'Rohan', 'Pranav', 'Neel', 'Samarth', 'Yash', 'Ayush', 'Kartik', 'Vedant', 'Abhinav',
    'Siddharth', 'Harsh', 'Mohit', 'Rahul', 'Nikhil', 'Manish', 'Saurabh', 'Vivek', 'Gaurav', 'Vikram'
]

INDIAN_FIRST_NAMES_FEMALE = [
    'Saanvi', 'Aanya', 'Aadhya', 'Aaradhya', 'Ananya', 'Pari', 'Diya', 'Avni', 'Myra', 'Isha',
    'Riya', 'Kriti', 'Neha', 'Sneha', 'Pooja', 'Shruti', 'Anjali', 'Kavya', 'Meera', 'Roshni',
    'Aditi', 'Trisha', 'Ishita', 'Mahi', 'Sanya', 'Tanvi', 'Kiara', 'Navya', 'Priya', 'Simran',
    'Vidya', 'Pragya', 'Srishti', 'Aisha', 'Swati', 'Kiran', 'Nidhi', 'Shreya', 'Rucha', 'Gauri'
]

INDIAN_LAST_NAMES = [
    'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Jain', 'Shah', 'Agarwal', 'Reddy',
    'Yadav', 'Mishra', 'Chauhan', 'Thakur', 'Joshi', 'Bhat', 'Desai', 'Kulkarni', 'Naidu', 'Rao',
    'Iyer', 'Menon', 'Nair', 'Pillai', 'Das', 'Sen', 'Bose', 'Dutta', 'Banerjee', 'Chakraborty',
    'Choudhury', 'Mehta', 'Khatri', 'Dubey', 'Tiwari', 'Pandey', 'Garg', 'Bansal', 'Rathi', 'Sinha'
]

DEPARTMENTS = [
    'Computer Science', 'Electrical Engg', 'Mechanical Engg', 'Civil Engg', 'Electronics',
    'Chemical Engg', 'Biotechnology', 'Mathematics', 'Physics', 'Information Technology'
]

BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

HOSTEL_NAMES_BOYS = ['Ramanujan Hall', 'Bose Hall', 'Visvesvaraya Hall', 'Kalam Hall']
HOSTEL_NAMES_GIRLS = ['Sarojini Hall', 'Kalpana Chawla Hall', 'Curie Hall', 'Teresa Hall']

ROOM_CAPACITIES = {'Single': 1, 'Double': 2, 'Triple': 3, 'Deluxe Single': 1}
ROOM_RENTS = {'Single': 3500.0, 'Double': 2500.0, 'Triple': 1800.0, 'Deluxe Single': 4500.0}

MESS_NAMES = ['Annapurna Mess', 'Cauvery Mess', 'Godavari Mess', 'Ganga Mess']
MESS_TYPES = ['Veg', 'NonVeg', 'Both', 'Veg']

LOCATIONS = ['North Campus', 'South Campus', 'East Campus', 'West Campus']

CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad']

MEALS = {
    'Breakfast': ['Idli Sambar', 'Poha', 'Aloo Paratha', 'Masala Dosa', 'Upma', 'Bread Omelette', 'Chole Bhature', 'Puri Sabji'],
    'Lunch': ['Rajma Chawal', 'Chicken Biryani', 'Paneer Butter Masala & Roti', 'Fish Curry & Rice', 'Dal Makhani & Jeera Rice', 'Veg Pulao', 'Egg Curry & Rice', 'Sambar Rice'],
    'Snack': ['Samosa', 'Vada Pav', 'Bhel Puri', 'Maggie', 'Tea & Biscuits', 'Pakora', 'Sandwich', 'Puff'],
    'Dinner': ['Dal Tadka & Roti', 'Mutton Curry & Rice', 'Palak Paneer & Naan', 'Kadai Chicken & Roti', 'Mix Veg & Paratha', 'Chana Masala & Rice', 'Veg Fried Rice', 'Aloo Gobi & Roti']
}

SUPPLIER_NAMES = ['Balaji Traders', 'Fresh Farms', 'Sri Ram Dairy', 'Global Foods', 'Quality Provisions', 'Metro Wholesale', 'Reliance Fresh', 'Sunrise Groceries']
ITEM_CATEGORIES = ['Dairy', 'Vegetables', 'Grains', 'Spices', 'Cleaning', 'Other']
UNITS = ['kg', 'litre', 'units', 'packets']

def generate_id(prefix):
    return f"{prefix}_{str(uuid.uuid4())[:8].upper()}"

def random_date(start, end):
    return start + timedelta(days=random.randint(0, int((end - start).days)))

def generate_phone():
    return f"+91 9{random.randint(100000000, 999999999)}"

def seed_all(conn):
    """Populate all tables with realistic sample data."""
    cur = conn.cursor()
    
    # 1. WARDEN
    print("Seeding WARDEN...")
    wardens = []
    for _ in range(10):
        w_id = generate_id('WRD')
        fname = random.choice(INDIAN_FIRST_NAMES_MALE + INDIAN_FIRST_NAMES_FEMALE)
        lname = random.choice(INDIAN_LAST_NAMES)
        email = f"{fname.lower()}.{lname[0].lower()}@univ.edu"
        phone = generate_phone()
        desig = random.choice(['ChiefWarden', 'Warden', 'AssistantWarden'])
        join_date = random_date(datetime(2015, 1, 1), datetime(2023, 12, 31)).strftime('%Y-%m-%d')
        wardens.append((w_id, fname, lname, email, phone, desig, join_date))
    cur.executemany("INSERT INTO WARDEN VALUES (?, ?, ?, ?, ?, ?, ?)", wardens)
    warden_ids = [w[0] for w in wardens]

    # 5. HOSTEL
    print("Seeding HOSTEL...")
    hostels = []
    hostel_objs = []
    for i, h_name in enumerate(HOSTEL_NAMES_BOYS + HOSTEL_NAMES_GIRLS):
        h_id = generate_id('HST')
        h_type = 'Boys' if i < 4 else 'Girls'
        floors = 4
        rooms = 40
        loc = random.choice(LOCATIONS)
        w_id = random.choice(warden_ids)
        hostels.append((h_id, h_name, h_type, floors, rooms, loc, w_id))
        hostel_objs.append({'id': h_id, 'type': h_type, 'floors': floors, 'rooms': rooms})
    cur.executemany("INSERT INTO HOSTEL VALUES (?, ?, ?, ?, ?, ?, ?)", hostels)

    # 6. ROOM_TYPE
    print("Seeding ROOM_TYPE...")
    room_types = []
    for rt_name, cap in ROOM_CAPACITIES.items():
        room_types.append((rt_name, cap, ROOM_RENTS[rt_name]))
    cur.executemany("INSERT INTO ROOM_TYPE VALUES (?, ?, ?)", room_types)
    room_type_names = list(ROOM_CAPACITIES.keys())

    # 7. ROOM
    print("Seeding ROOM...")
    rooms = []
    room_objs = []
    for h in hostel_objs:
        for f in range(1, h['floors'] + 1):
            for r in range(1, 11):
                r_no = f"{h['id']}_{f}0{r}" if r < 10 else f"{h['id']}_{f}{r}"
                r_type = random.choice(room_type_names)
                # Setting initial status to Vacant, will update later if occupied
                rooms.append((r_no, f, 'Vacant', r_type, h['id']))
                room_objs.append({'no': r_no, 'cap': ROOM_CAPACITIES[r_type], 'hostel_type': h['type'], 'occupants': 0})
    cur.executemany("INSERT INTO ROOM VALUES (?, ?, ?, ?, ?)", rooms)

    # 9. MESS
    print("Seeding MESS...")
    messes = []
    for i in range(4):
        m_id = generate_id('MSS')
        messes.append((m_id, MESS_NAMES[i], MESS_TYPES[i], LOCATIONS[i], generate_phone(), random.randint(150, 300)))
    cur.executemany("INSERT INTO MESS VALUES (?, ?, ?, ?, ?, ?)", messes)
    mess_ids = [m[0] for m in messes]

    # 4. STAFF
    print("Seeding STAFF...")
    staff = []
    for _ in range(60):
        s_id = generate_id('STF')
        fname = random.choice(INDIAN_FIRST_NAMES_MALE + INDIAN_FIRST_NAMES_FEMALE)
        lname = random.choice(INDIAN_LAST_NAMES)
        role = random.choice(['Chef', 'Cleaner', 'Helper', 'Security'])
        shift = random.choice(['Morning', 'Evening', 'Night'])
        
        m_id = None
        h_id = None
        cuisine = None
        
        if role == 'Chef' or (role == 'Helper' and random.choice([True, False])):
            m_id = random.choice(mess_ids)
            if role == 'Chef':
                cuisine = random.choice(['North Indian', 'South Indian', 'Chinese', 'Continental'])
        else:
            h_id = random.choice([h['id'] for h in hostel_objs])
            
        staff.append((s_id, fname, lname, generate_phone(), random_date(datetime(2018, 1, 1), datetime(2024, 1, 1)).strftime('%Y-%m-%d'), 
                      round(random.uniform(15000, 35000), 2), role, shift, cuisine, m_id, h_id))
    cur.executemany("INSERT INTO STAFF VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", staff)

    # 2. STUDENT
    print("Seeding STUDENT...")
    students = []
    student_objs = []
    for i in range(500):
        s_id = generate_id('STD')
        gender = random.choice(['Male', 'Female'])
        fname = random.choice(INDIAN_FIRST_NAMES_MALE) if gender == 'Male' else random.choice(INDIAN_FIRST_NAMES_FEMALE)
        lname = random.choice(INDIAN_LAST_NAMES)
        dob = random_date(datetime(2000, 1, 1), datetime(2005, 12, 31)).strftime('%Y-%m-%d')
        email = f"{fname.lower()}.{lname.lower()}_{s_id[-4:]}@univ.edu"
        dept = random.choice(DEPARTMENTS)
        adm_date = random_date(datetime(2021, 7, 1), datetime(2024, 8, 30)).strftime('%Y-%m-%d')
        students.append((s_id, fname, lname, gender, dob, email, generate_phone(), random.choice(BLOOD_GROUPS), dept, adm_date, 1))
        student_objs.append({'id': s_id, 'gender': gender})
    cur.executemany("INSERT INTO STUDENT VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", students)

    # 3. GUARDIAN
    print("Seeding GUARDIAN...")
    guardians = []
    for stu in student_objs:
        num_guardians = random.choice([1, 1, 1, 2]) # Mostly 1 guardian, sometimes 2
        for _ in range(num_guardians):
            g_id = generate_id('GRD')
            g_name = f"{random.choice(INDIAN_FIRST_NAMES_MALE + INDIAN_FIRST_NAMES_FEMALE)} {random.choice(INDIAN_LAST_NAMES)}"
            rel = random.choice(['Father', 'Mother', 'Sibling', 'Other'])
            guardians.append((g_id, stu['id'], g_name, rel, generate_phone(), f"{g_name.split()[0].lower()}@gmail.com", f"{random.randint(1,100)} Street, {random.choice(CITIES)}"))
    cur.executemany("INSERT INTO GUARDIAN VALUES (?, ?, ?, ?, ?, ?, ?)", guardians)

    # 8. ROOM_ALLOCATION & Update ROOM Status
    print("Seeding ROOM_ALLOCATION...")
    allocations = []
    allocated_rooms = set()
    
    # Shuffle students and rooms to randomize allocation
    random.shuffle(student_objs)
    random.shuffle(room_objs)
    
    for stu in student_objs:
        h_type_needed = 'Boys' if stu['gender'] == 'Male' else 'Girls'
        
        # Find a suitable room
        allocated = False
        for r in room_objs:
            if r['hostel_type'] == h_type_needed and r['occupants'] < r['cap']:
                a_id = generate_id('ALLC')
                check_in = random_date(datetime(2024, 7, 1), datetime(2024, 8, 15)).strftime('%Y-%m-%d')
                allocations.append((a_id, stu['id'], r['no'], '2024-2025', 'Fall', check_in, None))
                r['occupants'] += 1
                allocated_rooms.add(r['no'])
                allocated = True
                break
    
    cur.executemany("INSERT INTO ROOM_ALLOCATION VALUES (?, ?, ?, ?, ?, ?, ?)", allocations)
    
    # Update ROOM status
    for r_no in allocated_rooms:
        cur.execute("UPDATE ROOM SET Status = 'Occupied' WHERE RoomNo = ?", (r_no,))

    # 10. MEAL
    print("Seeding MEAL...")
    meals = []
    for m_id in mess_ids:
        for m_time, dishes in MEALS.items():
            for _ in range(2): # 2 options per meal time per mess
                meal_id = generate_id('ML')
                meal_name = random.choice(dishes)
                cost = random.uniform(30, 150)
                meals.append((meal_id, meal_name, f"Delicious {meal_name}", round(cost, 2), m_id))
    cur.executemany("INSERT INTO MEAL VALUES (?, ?, ?, ?, ?)", meals)
    
    # 11. MESS_SCHEDULE
    print("Seeding MESS_SCHEDULE...")
    schedules = []
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    meal_times = ['Breakfast', 'Lunch', 'Snack', 'Dinner']
    
    for m_id in mess_ids:
        mess_meals = [m for m in meals if m[4] == m_id]
        for day in days:
            for m_time in meal_times:
                time_meals = [m for m in mess_meals if m[1] in MEALS[m_time]]
                if time_meals:
                    sch_id = generate_id('MSCH')
                    schedules.append((sch_id, m_id, random.choice(time_meals)[0], day, m_time))
    cur.executemany("INSERT INTO MESS_SCHEDULE VALUES (?, ?, ?, ?, ?)", schedules)

    # 12. MESS_ENROLLMENT
    print("Seeding MESS_ENROLLMENT...")
    enrollments = []
    for stu in student_objs:
        e_id = generate_id('MSRB')
        m_id = random.choice(mess_ids)
        start_date = random_date(datetime(2024, 7, 1), datetime(2024, 8, 15)).strftime('%Y-%m-%d')
        plan = random.choice(['Veg', 'NonVeg', 'Special'])
        enrollments.append((e_id, stu['id'], m_id, plan, start_date, None, 1))
    cur.executemany("INSERT INTO MESS_ENROLLMENT VALUES (?, ?, ?, ?, ?, ?, ?)", enrollments)

    # 13. SUPPLIER
    print("Seeding SUPPLIER...")
    suppliers = []
    for s_name in SUPPLIER_NAMES:
        s_id = generate_id('SUP')
        suppliers.append((s_id, s_name, generate_phone(), f"contact@{s_name.replace(' ', '').lower()}.com", f"{random.randint(1,100)} Market, {random.choice(CITIES)}"))
    # Generate more random suppliers to reach ~25
    for _ in range(17):
        s_id = generate_id('SUP')
        s_name = f"{random.choice(INDIAN_LAST_NAMES)} Enterprises"
        suppliers.append((s_id, s_name, generate_phone(), f"info@{s_name.replace(' ', '').lower()}.com", f"{random.randint(1,200)} Ind Area, {random.choice(CITIES)}"))
    cur.executemany("INSERT INTO SUPPLIER VALUES (?, ?, ?, ?, ?)", suppliers)
    supplier_ids = [s[0] for s in suppliers]

    # 14. INVENTORY_ITEM
    print("Seeding INVENTORY_ITEM...")
    items = []
    item_names = ['Rice', 'Wheat Flour', 'Toor Dal', 'Moong Dal', 'Milk', 'Paneer', 'Chicken', 'Eggs', 'Potatoes', 'Onions', 'Tomatoes', 'Salt', 'Sugar', 'Oil', 'Detergent', 'Floor Cleaner']
    for i in range(35):
        i_id = generate_id('ITM')
        name = item_names[i] if i < len(item_names) else f"Item {i}"
        cat = random.choice(ITEM_CATEGORIES)
        unit = random.choice(UNITS)
        items.append((i_id, name, cat, unit))
    cur.executemany("INSERT INTO INVENTORY_ITEM VALUES (?, ?, ?, ?)", items)
    item_ids = [i[0] for i in items]

    # 15. PROCUREMENT_EVENT
    print("Seeding PROCUREMENT_EVENT...")
    procurements = []
    for _ in range(300):
        p_id = generate_id('PRC')
        m_id = random.choice(mess_ids)
        s_id = random.choice(supplier_ids)
        i_id = random.choice(item_ids)
        qty = round(random.uniform(10, 500), 2)
        p_date = random_date(datetime(2024, 7, 1), datetime(2024, 12, 31)).strftime('%Y-%m-%d')
        price = round(random.uniform(20, 500), 2)
        total = round(qty * price, 2)
        procurements.append((p_id, m_id, s_id, i_id, qty, p_date, price, total))
    cur.executemany("INSERT INTO PROCUREMENT_EVENT VALUES (?, ?, ?, ?, ?, ?, ?, ?)", procurements)

    # 16. INVENTORY_STOCK
    print("Seeding INVENTORY_STOCK...")
    stocks = []
    for m_id in mess_ids:
        for i_id in random.sample(item_ids, k=25): # 25 items per mess
            qty = round(random.uniform(5, 100), 2)
            upd_date = random_date(datetime(2024, 12, 1), datetime(2024, 12, 31)).strftime('%Y-%m-%d')
            stocks.append((m_id, i_id, qty, upd_date))
    cur.executemany("INSERT INTO INVENTORY_STOCK VALUES (?, ?, ?, ?)", stocks)

    # 17. MONTHLY_BILL
    print("Seeding MONTHLY_BILL...")
    bills = []
    bill_objs = []
    months = [6, 7, 8]
    year = 2025
    for stu in student_objs:
        for m in months:
            b_id = generate_id('BIL')
            rent = random.choice(list(ROOM_RENTS.values()))
            mess_chg = round(random.uniform(2500, 4000), 2)
            other_chg = round(random.uniform(100, 500), 2)
            total = round(rent + mess_chg + other_chg, 2)
            due_date = f"{year}-{m:02d}-15"
            status = random.choice(['Paid', 'Paid', 'Paid', 'Partial', 'Unpaid'])
            bills.append((b_id, stu['id'], m, year, rent, mess_chg, other_chg, total, due_date, status))
            bill_objs.append({'id': b_id, 'status': status, 'total': total})
    cur.executemany("INSERT INTO MONTHLY_BILL VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", bills)

    # 18. PAYMENT_TRANSACTION
    print("Seeding PAYMENT_TRANSACTION...")
    payments = []
    for b in bill_objs:
        if b['status'] == 'Unpaid':
            continue
            
        p_id = generate_id('PAY')
        amt = b['total'] if b['status'] == 'Paid' else round(b['total'] * random.uniform(0.3, 0.7), 2)
        mode = random.choice(['Cash', 'UPI', 'Card', 'BankTransfer'])
        p_date = random_date(datetime(2025, 6, 1), datetime(2025, 8, 30)).strftime('%Y-%m-%d')
        ref = f"TXN{random.randint(100000, 999999)}"
        payments.append((p_id, b['id'], amt, mode, p_date, ref))
    cur.executemany("INSERT INTO PAYMENT_TRANSACTION VALUES (?, ?, ?, ?, ?, ?)", payments)

    # 19. COMPLAINT
    print("Seeding COMPLAINT...")
    complaints = []
    for _ in range(150):
        c_id = generate_id('CMP')
        stu = random.choice(student_objs)
        r_no = random.choice(list(allocated_rooms)) if random.choice([True, False]) else None
        loc = random.choice(['Corridor', 'Washroom', 'Mess', 'Lobby']) if not r_no else None
        cat = random.choice(['Electrical', 'Plumbing', 'Furniture', 'Mess', 'Pest', 'Other'])
        desc = f"Issue with {cat.lower()} reported by student."
        file_date = random_date(datetime(2024, 8, 1), datetime(2024, 12, 31))
        status = random.choice(['Open', 'InProgress', 'Resolved', 'Rejected'])
        res_date = None
        remarks = None
        if status in ['Resolved', 'Rejected']:
            res_date = (file_date + timedelta(days=random.randint(1, 10))).strftime('%Y-%m-%d')
            remarks = "Handled accordingly."
        complaints.append((c_id, stu['id'], r_no, loc, cat, desc, file_date.strftime('%Y-%m-%d'), status, res_date, remarks))
    cur.executemany("INSERT INTO COMPLAINT VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", complaints)

    # 20. VISITOR_LOG
    print("Seeding VISITOR_LOG...")
    visitors = []
    for _ in range(200):
        v_id = generate_id('VS')
        stu = random.choice(student_objs)['id']
        v_name = f"{random.choice(INDIAN_FIRST_NAMES_MALE + INDIAN_FIRST_NAMES_FEMALE)} {random.choice(INDIAN_LAST_NAMES)}"
        rel = random.choice(['Parent', 'Sibling', 'Friend', 'Other'])
        purpose = random.choice(['Meeting', 'Drop luggage', 'Casual visit', 'Emergency'])
        check_in = random_date(datetime(2024, 8, 1), datetime(2024, 12, 31))
        check_out = check_in + timedelta(hours=random.uniform(0.5, 4))
        visitors.append((v_id, stu, v_name, generate_phone(), rel, purpose, check_in.strftime('%Y-%m-%d %H:%M:%S'), check_out.strftime('%Y-%m-%d %H:%M:%S')))
    cur.executemany("INSERT INTO VISITOR_LOG VALUES (?, ?, ?, ?, ?, ?, ?, ?)", visitors)

    # 21. LEAVE_REQUEST
    print("Seeding LEAVE_REQUEST...")
    leaves = []
    for _ in range(180):
        l_id = generate_id('LV')
        stu = random.choice(student_objs)['id']
        l_type = random.choice(['Weekend', 'Medical', 'Vacation', 'Emergency'])
        from_d = random_date(datetime(2024, 8, 1), datetime(2024, 12, 1))
        to_d = from_d + timedelta(days=random.randint(1, 15))
        reason = f"Going home for {l_type.lower()}."
        status = random.choice(['Pending', 'Approved', 'Rejected'])
        w_id = random.choice(warden_ids) if status != 'Pending' else None
        leaves.append((l_id, stu, l_type, from_d.strftime('%Y-%m-%d'), to_d.strftime('%Y-%m-%d'), reason, status, w_id))
    cur.executemany("INSERT INTO LEAVE_REQUEST VALUES (?, ?, ?, ?, ?, ?, ?, ?)", leaves)

    # 22. ATTENDANCE_LOG
    print("Seeding ATTENDANCE_LOG...")
    attendance = []
    # Just sample 6 random dates per student for ~3000 rows
    dates = [random_date(datetime(2024, 8, 1), datetime(2024, 12, 31)) for _ in range(6)]
    for stu in student_objs:
        for d in dates:
            a_id = generate_id('ATN')
            status = random.choice(['Present', 'Present', 'Present', 'Absent', 'OnLeave'])
            punch = (d + timedelta(hours=random.randint(20, 23), minutes=random.randint(0, 59))).strftime('%H:%M:%S') if status == 'Present' else None
            attendance.append((a_id, stu['id'], d.strftime('%Y-%m-%d'), status, punch))
    cur.executemany("INSERT INTO ATTENDANCE_LOG VALUES (?, ?, ?, ?, ?)", attendance)

    # 23. NOTICE
    print("Seeding NOTICE...")
    notices = []
    for _ in range(40):
        n_id = generate_id('NTC')
        h_id = random.choice([h['id'] for h in hostel_objs])
        title = random.choice(['Hostel Timings Update', 'Water Supply Maintenance', 'Festival Celebration', 'Mess Menu Change'])
        content = "Please be informed regarding the recent updates."
        p_date = random_date(datetime(2024, 7, 1), datetime(2024, 12, 31))
        w_id = random.choice(warden_ids)
        exp_date = (p_date + timedelta(days=random.randint(7, 30))).strftime('%Y-%m-%d')
        notices.append((n_id, h_id, title, content, p_date.strftime('%Y-%m-%d'), w_id, exp_date))
    cur.executemany("INSERT INTO NOTICE VALUES (?, ?, ?, ?, ?, ?, ?)", notices)

    conn.commit()
    print("All data seeded successfully!")
