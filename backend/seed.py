import random
from datetime import datetime, timedelta
import uuid

# Helper lists for realistic Indian campus data generation
INDIAN_FIRST_NAMES_MALE = [
    'Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya',
    'Atharva', 'Aaryan', 'Dhruv', 'Kabir', 'Rishi', 'Rudra', 'Karan', 'Om', 'Shivansh', 'Ansh',
    'Dev', 'Rohan', 'Pranav', 'Neel', 'Samarth', 'Yash', 'Ayush', 'Kartik', 'Vedant', 'Abhinav',
    'Siddharth', 'Harsh', 'Mohit', 'Rahul', 'Nikhil', 'Manish', 'Saurabh', 'Vivek', 'Gaurav', 'Vikram',
    'Tanmay', 'Chirag', 'Aniket', 'Deepak', 'Mayank', 'Varun', 'Kunal', 'Tejas', 'Rajat', 'Alok'
]

INDIAN_FIRST_NAMES_FEMALE = [
    'Saanvi', 'Aanya', 'Aadhya', 'Aaradhya', 'Ananya', 'Pari', 'Diya', 'Avni', 'Myra', 'Isha',
    'Riya', 'Kriti', 'Neha', 'Sneha', 'Pooja', 'Shruti', 'Anjali', 'Kavya', 'Meera', 'Roshni',
    'Aditi', 'Trisha', 'Ishita', 'Mahi', 'Sanya', 'Tanvi', 'Kiara', 'Navya', 'Priya', 'Simran',
    'Vidya', 'Pragya', 'Srishti', 'Aisha', 'Swati', 'Kiran', 'Nidhi', 'Shreya', 'Rucha', 'Gauri',
    'Divya', 'Bhavna', 'Payal', 'Sonali', 'Pallavi', 'Akanksha', 'Garima', 'Megha', 'Ritika', 'Juhi'
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

# Varied, realistic hostel definitions with different heights, blocks, and room capacities
HOSTEL_CONFIGS = [
    {
        'id': 'HST_RMN',
        'code': 'RH',
        'name': 'Ramanujan Hall',
        'type': 'Boys',
        'floors': 5,
        'rooms_per_floor': 18,
        'location': 'North Campus'
    },
    {
        'id': 'HST_BSE',
        'code': 'BH',
        'name': 'Bose Hall',
        'type': 'Boys',
        'floors': 4,
        'rooms_per_floor': 15,
        'location': 'North Campus'
    },
    {
        'id': 'HST_VSV',
        'code': 'VH',
        'name': 'Visvesvaraya Hall',
        'type': 'Boys',
        'floors': 7,
        'rooms_per_floor': 20,
        'location': 'West Campus'
    },
    {
        'id': 'HST_KLM',
        'code': 'KH',
        'name': 'Kalam Hall',
        'type': 'Boys',
        'floors': 3,
        'rooms_per_floor': 12,
        'location': 'South Campus'
    },
    {
        'id': 'HST_SRJ',
        'code': 'SH',
        'name': 'Sarojini Hall',
        'type': 'Girls',
        'floors': 6,
        'rooms_per_floor': 18,
        'location': 'South Campus'
    },
    {
        'id': 'HST_KPC',
        'code': 'KCH',
        'name': 'Kalpana Chawla Hall',
        'type': 'Girls',
        'floors': 5,
        'rooms_per_floor': 16,
        'location': 'East Campus'
    },
    {
        'id': 'HST_CUR',
        'code': 'CH',
        'name': 'Curie Hall',
        'type': 'Girls',
        'floors': 4,
        'rooms_per_floor': 14,
        'location': 'East Campus'
    },
    {
        'id': 'HST_TRS',
        'code': 'TH',
        'name': 'Teresa Hall',
        'type': 'Girls',
        'floors': 3,
        'rooms_per_floor': 10,
        'location': 'South Campus'
    }
]

ROOM_CAPACITIES = {'Single': 1, 'Double': 2, 'Triple': 3, 'Deluxe Single': 1}
ROOM_RENTS = {'Single': 3500.0, 'Double': 2500.0, 'Triple': 1800.0, 'Deluxe Single': 4500.0}

MESS_CONFIGS = [
    {'id': 'MSS_ANN', 'name': 'Annapurna Mess (Veg & South)', 'type': 'Veg', 'location': 'North Campus', 'cap': 320},
    {'id': 'MSS_CAU', 'name': 'Cauvery Mess (NonVeg & South)', 'type': 'NonVeg', 'location': 'South Campus', 'cap': 280},
    {'id': 'MSS_GOD', 'name': 'Godavari Mess (Multi-Cuisine)', 'type': 'Both', 'location': 'East Campus', 'cap': 360},
    {'id': 'MSS_GAN', 'name': 'Ganga Mess (North & Special)', 'type': 'Both', 'location': 'West Campus', 'cap': 360}
]

CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Coimbatore']

MEALS = {
    'Breakfast': ['Idli Sambar', 'Poha & Jalebi', 'Aloo Paratha & Curd', 'Masala Dosa', 'Upma & Chutney', 'Bread Omelette', 'Chole Bhature', 'Puri Bhaji'],
    'Lunch': ['Rajma Chawal & Papad', 'Chicken Biryani & Raita', 'Paneer Butter Masala & Roti', 'Fish Curry & Steamed Rice', 'Dal Makhani & Jeera Rice', 'Veg Pulao & Kadhi', 'Egg Curry & Rice', 'South Indian Sambar Thali'],
    'Snack': ['Samosa & Chai', 'Vada Pav', 'Bhel Puri', 'Vegetable Sandwich', 'Tea & Biscuits', 'Paneer Pakora', 'Veg Puff', 'Bun Maska & Chai'],
    'Dinner': ['Dal Tadka, Sabzi & Roti', 'Mutton Curry & Rice', 'Palak Paneer & Naan', 'Kadai Chicken & Phulka', 'Mix Veg & Paratha', 'Chana Masala & Rice', 'Veg Fried Rice & Manchurian', 'Aloo Gobi & Roti']
}

SUPPLIER_ITEMS = [
    ('Sri Venkateswara Dairy', 'Dairy', ['Pasteurized Toned Milk', 'Fresh Paneer', 'Amul Butter', 'Curd (Dahi)']),
    ('Annapurna Agro Traders', 'Grains', ['Basmati Rice', 'Sona Masoori Rice', 'Whole Wheat Atta', 'Toor Dal', 'Moong Dal', 'Chana Dal']),
    ('Kisan Wholesale Mandi', 'Vegetables', ['Potatoes (Agra)', 'Red Onions', 'Tomatoes (Hybrid)', 'Ginger Garlic Paste', 'Green Chillies', 'Cauliflower']),
    ('Godavari Poultry & Fresh', 'Other', ['Farm Fresh Eggs', 'Broiler Chicken', 'Fish Fillet']),
    ('Bharat Spices & Oil Mill', 'Spices', ['Sunflower Cooking Oil', 'Mustard Oil', 'Iodized Salt', 'Refined Sugar', 'Turmeric Powder', 'Red Chilli Powder', 'Garam Masala']),
    ('CleanPro Sanitization Supplies', 'Cleaning', ['Floor Disinfectant (Phenyl)', 'Dishwashing Liquid', 'Bleaching Powder', 'Heavy Duty Mop Heads', 'Handwash Refill']),
    ('Metro Provisions Wholesale', 'Other', ['Tea Leaves', 'Filter Coffee Powder', 'Roasted Peanuts', 'Besan (Gram Flour)', 'Semolina (Sooji)']),
    ('Supreme Hardware & Utilities', 'Other', ['LED Tube Lights', 'Ceiling Fan Capacitors', 'Washroom Tap Washers', 'Door Locks & Keys'])
]

ITEM_UNITS = {
    'Pasteurized Toned Milk': 'litre', 'Fresh Paneer': 'kg', 'Amul Butter': 'kg', 'Curd (Dahi)': 'kg',
    'Basmati Rice': 'kg', 'Sona Masoori Rice': 'kg', 'Whole Wheat Atta': 'kg', 'Toor Dal': 'kg', 'Moong Dal': 'kg', 'Chana Dal': 'kg',
    'Potatoes (Agra)': 'kg', 'Red Onions': 'kg', 'Tomatoes (Hybrid)': 'kg', 'Ginger Garlic Paste': 'kg', 'Green Chillies': 'kg', 'Cauliflower': 'kg',
    'Farm Fresh Eggs': 'units', 'Broiler Chicken': 'kg', 'Fish Fillet': 'kg',
    'Sunflower Cooking Oil': 'litre', 'Mustard Oil': 'litre', 'Iodized Salt': 'kg', 'Refined Sugar': 'kg', 'Turmeric Powder': 'kg', 'Red Chilli Powder': 'kg', 'Garam Masala': 'kg',
    'Floor Disinfectant (Phenyl)': 'litre', 'Dishwashing Liquid': 'litre', 'Bleaching Powder': 'kg', 'Heavy Duty Mop Heads': 'units', 'Handwash Refill': 'litre',
    'Tea Leaves': 'kg', 'Filter Coffee Powder': 'kg', 'Roasted Peanuts': 'kg', 'Besan (Gram Flour)': 'kg', 'Semolina (Sooji)': 'kg',
    'LED Tube Lights': 'units', 'Ceiling Fan Capacitors': 'units', 'Washroom Tap Washers': 'units', 'Door Locks & Keys': 'units'
}

ITEM_APPROX_PRICES = {
    'Pasteurized Toned Milk': 56.0, 'Fresh Paneer': 340.0, 'Amul Butter': 480.0, 'Curd (Dahi)': 70.0,
    'Basmati Rice': 85.0, 'Sona Masoori Rice': 52.0, 'Whole Wheat Atta': 38.0, 'Toor Dal': 145.0, 'Moong Dal': 120.0, 'Chana Dal': 95.0,
    'Potatoes (Agra)': 24.0, 'Red Onions': 32.0, 'Tomatoes (Hybrid)': 28.0, 'Ginger Garlic Paste': 110.0, 'Green Chillies': 60.0, 'Cauliflower': 35.0,
    'Farm Fresh Eggs': 6.5, 'Broiler Chicken': 210.0, 'Fish Fillet': 280.0,
    'Sunflower Cooking Oil': 135.0, 'Mustard Oil': 145.0, 'Iodized Salt': 22.0, 'Refined Sugar': 42.0, 'Turmeric Powder': 190.0, 'Red Chilli Powder': 240.0, 'Garam Masala': 320.0,
    'Floor Disinfectant (Phenyl)': 85.0, 'Dishwashing Liquid': 95.0, 'Bleaching Powder': 45.0, 'Heavy Duty Mop Heads': 120.0, 'Handwash Refill': 110.0,
    'Tea Leaves': 260.0, 'Filter Coffee Powder': 380.0, 'Roasted Peanuts': 130.0, 'Besan (Gram Flour)': 85.0, 'Semolina (Sooji)': 48.0,
    'LED Tube Lights': 180.0, 'Ceiling Fan Capacitors': 65.0, 'Washroom Tap Washers': 25.0, 'Door Locks & Keys': 220.0
}

LEAVE_REASONS = [
    ('Weekend', 'Visiting parents in hometown for the long weekend.'),
    ('Vacation', 'Travelling home for semester break and festival holidays.'),
    ('Medical', 'Undergoing medical checkup and dental treatment at family clinic.'),
    ('Medical', 'Recovering from viral fever and throat infection at home.'),
    ('Emergency', 'Attending close family member’s wedding ceremony in hometown.'),
    ('Emergency', 'Family emergency requiring immediate presence at home.')
]

_id_counter = 10000

def generate_id(prefix):
    """Generate guaranteed collision-free alphanumeric primary key IDs."""
    global _id_counter
    _id_counter += 1
    return f"{prefix}_{uuid.uuid4().hex[:8].upper()}{_id_counter}"

def random_date(start, end):
    return start + timedelta(days=random.randint(0, int((end - start).days)))

def generate_phone():
    return f"+91 9{random.randint(100000000, 999999999)}"

def clear_all(conn):
    """Clear all records from database tables in foreign-key safe reverse order."""
    cur = conn.cursor()
    tables = [
        'PAYMENT_TRANSACTION', 'MONTHLY_BILL', 'ROOM_ALLOCATION',
        'MESS_ENROLLMENT', 'MESS_SCHEDULE', 'COMPLAINT', 'VISITOR_LOG',
        'LEAVE_REQUEST', 'ATTENDANCE_LOG', 'NOTICE', 'GUARDIAN',
        'PROCUREMENT_EVENT', 'INVENTORY_STOCK', 'INVENTORY_ITEM', 'SUPPLIER',
        'MEAL', 'STAFF', 'ROOM', 'ROOM_TYPE', 'HOSTEL', 'MESS', 'STUDENT', 'WARDEN'
    ]
    for table in tables:
        cur.execute(f"DELETE FROM {table}")
    conn.commit()

def seed_all(conn, clear_first=False):
    """Populate active operational tables with realistic, believable university hostel sample data."""
    if clear_first:
        clear_all(conn)

    cur = conn.cursor()
    random.seed(42)

    # 1. WARDEN
    print("Seeding WARDEN...")
    wardens = []
    warden_specs = [
        ('Dr. Rajesh', 'Sharma', 'ChiefWarden', 'rajesh.sharma@univ.edu', '2016-04-12'),
        ('Dr. Anita', 'Desai', 'ChiefWarden', 'anita.desai@univ.edu', '2017-06-15'),
        ('Prof. Vikram', 'Reddy', 'Warden', 'vikram.reddy@univ.edu', '2018-08-01'),
        ('Prof. Sunita', 'Menon', 'Warden', 'sunita.menon@univ.edu', '2019-01-10'),
        ('Dr. Manoj', 'Gupta', 'Warden', 'manoj.gupta@univ.edu', '2019-07-22'),
        ('Dr. Priya', 'Nair', 'Warden', 'priya.nair@univ.edu', '2020-02-14'),
        ('Prof. Amit', 'Patel', 'AssistantWarden', 'amit.patel@univ.edu', '2021-08-05'),
        ('Prof. Shweta', 'Iyer', 'AssistantWarden', 'shweta.iyer@univ.edu', '2022-03-01'),
        ('Dr. Suresh', 'Yadav', 'AssistantWarden', 'suresh.yadav@univ.edu', '2022-09-15'),
        ('Dr. Meenakshi', 'Rao', 'AssistantWarden', 'meenakshi.rao@univ.edu', '2023-01-20'),
    ]
    for i, (fn, ln, desig, email, jdate) in enumerate(warden_specs):
        w_id = f"WRD_{101 + i}"
        phone = generate_phone()
        wardens.append((w_id, fn, ln, email, phone, desig, jdate))
    cur.executemany("INSERT INTO WARDEN VALUES (?, ?, ?, ?, ?, ?, ?)", wardens)
    warden_ids = [w[0] for w in wardens]
    conn.commit()

    # 2. HOSTEL
    print("Seeding HOSTEL...")
    hostels = []
    hostel_objs = []
    for i, h in enumerate(HOSTEL_CONFIGS):
        h_id = h['id']
        w_id = warden_ids[i % len(warden_ids)]
        total_rooms = h['floors'] * h['rooms_per_floor']
        hostels.append((h_id, h['name'], h['type'], h['floors'], total_rooms, h['location'], w_id))
        hostel_objs.append({
            'id': h_id,
            'code': h['code'],
            'name': h['name'],
            'type': h['type'],
            'floors': h['floors'],
            'rooms_per_floor': h['rooms_per_floor'],
            'total_rooms': total_rooms,
            'location': h['location']
        })
    cur.executemany("INSERT INTO HOSTEL VALUES (?, ?, ?, ?, ?, ?, ?)", hostels)
    conn.commit()

    # 3. ROOM_TYPE
    print("Seeding ROOM_TYPE...")
    room_types = []
    for rt_name, cap in ROOM_CAPACITIES.items():
        room_types.append((rt_name, cap, ROOM_RENTS[rt_name]))
    cur.executemany("INSERT INTO ROOM_TYPE VALUES (?, ?, ?)", room_types)
    conn.commit()

    # 4. ROOM
    print("Seeding ROOM...")
    rooms = []
    room_objs = []
    for h in hostel_objs:
        for f in range(1, h['floors'] + 1):
            for r in range(1, h['rooms_per_floor'] + 1):
                r_no = f"{h['code']}-{f}{r:02d}"
                if f <= 2:
                    r_type = random.choices(['Double', 'Triple', 'Single'], weights=[55, 35, 10])[0]
                elif f < h['floors']:
                    r_type = random.choices(['Double', 'Single', 'Triple', 'Deluxe Single'], weights=[45, 30, 15, 10])[0]
                else:
                    r_type = random.choices(['Single', 'Deluxe Single', 'Double'], weights=[45, 35, 20])[0]

                rooms.append((r_no, f, 'Vacant', r_type, h['id']))
                room_objs.append({
                    'no': r_no,
                    'floor': f,
                    'type': r_type,
                    'cap': ROOM_CAPACITIES[r_type],
                    'rent': ROOM_RENTS[r_type],
                    'hostel_id': h['id'],
                    'hostel_type': h['type'],
                    'occupants': []
                })
    cur.executemany("INSERT INTO ROOM VALUES (?, ?, ?, ?, ?)", rooms)
    conn.commit()

    # 5. MESS
    print("Seeding MESS...")
    messes = []
    for m in MESS_CONFIGS:
        messes.append((m['id'], m['name'], m['type'], m['location'], generate_phone(), m['cap']))
    cur.executemany("INSERT INTO MESS VALUES (?, ?, ?, ?, ?, ?)", messes)
    mess_ids = [m['id'] for m in MESS_CONFIGS]
    conn.commit()

    # 6. STAFF
    print("Seeding STAFF...")
    staff = []
    for m in MESS_CONFIGS:
        for _ in range(4):
            s_id = generate_id('STF')
            fn = random.choice(INDIAN_FIRST_NAMES_MALE)
            ln = random.choice(INDIAN_LAST_NAMES)
            is_chef = random.choice([True, False])
            role = 'Chef' if is_chef else 'Helper'
            shift = random.choice(['Morning', 'Evening'])
            cuisine = random.choice(['North Indian', 'South Indian', 'Multi-Cuisine']) if is_chef else None
            salary = round(random.uniform(22000, 32000), 2) if is_chef else round(random.uniform(16000, 20000), 2)
            staff.append((s_id, fn, ln, generate_phone(), random_date(datetime(2020, 1, 1), datetime(2024, 1, 1)).strftime('%Y-%m-%d'),
                          salary, role, shift, cuisine, m['id'], None))
    for h in hostel_objs:
        for _ in range(3):
            s_id = generate_id('STF')
            gender = 'Female' if h['type'] == 'Girls' else 'Male'
            fn = random.choice(INDIAN_FIRST_NAMES_FEMALE if gender == 'Female' else INDIAN_FIRST_NAMES_MALE)
            ln = random.choice(INDIAN_LAST_NAMES)
            role = random.choice(['Cleaner', 'Cleaner', 'Security'])
            shift = random.choice(['Morning', 'Evening', 'Night'])
            salary = round(random.uniform(15000, 21000), 2)
            staff.append((s_id, fn, ln, generate_phone(), random_date(datetime(2020, 1, 1), datetime(2024, 1, 1)).strftime('%Y-%m-%d'),
                          salary, role, shift, None, None, h['id']))
    cur.executemany("INSERT INTO STAFF VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", staff)
    conn.commit()

    # 7. STUDENT
    print("Seeding STUDENT...")
    students = []
    student_objs = []
    batches = [
        (2021, datetime(2021, 8, 1), datetime(2002, 1, 1), datetime(2003, 12, 31)),
        (2022, datetime(2022, 8, 1), datetime(2003, 1, 1), datetime(2004, 12, 31)),
        (2023, datetime(2023, 8, 1), datetime(2004, 1, 1), datetime(2005, 12, 31)),
        (2024, datetime(2024, 8, 1), datetime(2005, 1, 1), datetime(2006, 12, 31))
    ]
    for i in range(100):
        s_id = f"STD_{20240001 + i}"
        gender = 'Male' if i < 54 else 'Female'
        fn = random.choice(INDIAN_FIRST_NAMES_MALE) if gender == 'Male' else random.choice(INDIAN_FIRST_NAMES_FEMALE)
        ln = random.choice(INDIAN_LAST_NAMES)
        batch_year, adm_base, dob_start, dob_end = random.choice(batches)
        dob = random_date(dob_start, dob_end).strftime('%Y-%m-%d')
        adm_date = (adm_base + timedelta(days=random.randint(0, 20))).strftime('%Y-%m-%d')
        dept = random.choice(DEPARTMENTS)
        email = f"{fn.lower()}.{ln.lower()}{str(batch_year)[-2:]}_{s_id[-4:]}@univ.edu"
        phone = generate_phone()
        bg = random.choice(BLOOD_GROUPS)
        is_active = 1 if i < 98 else 0
        students.append((s_id, fn, ln, gender, dob, email, phone, bg, dept, adm_date, is_active))
        student_objs.append({
            'id': s_id,
            'name': f"{fn} {ln}",
            'gender': gender,
            'dept': dept,
            'is_active': is_active,
            'batch': batch_year
        })
    cur.executemany("INSERT INTO STUDENT VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", students)
    conn.commit()

    # 8. GUARDIAN
    print("Seeding GUARDIAN...")
    guardians = []
    for stu in student_objs:
        num_g = random.choices([1, 2], weights=[80, 20])[0]
        for g_idx in range(num_g):
            g_id = generate_id('GRD')
            g_ln = stu['name'].split()[-1]
            if g_idx == 0:
                rel = 'Father'
                g_fn = random.choice(INDIAN_FIRST_NAMES_MALE)
            else:
                rel = 'Mother'
                g_fn = random.choice(INDIAN_FIRST_NAMES_FEMALE)
            g_name = f"{g_fn} {g_ln}"
            city = random.choice(CITIES)
            addr = f"{random.randint(12, 180)}, Sector {random.randint(1, 25)}, {city}"
            guardians.append((g_id, stu['id'], g_name, rel, generate_phone(), f"{g_fn.lower()}.{g_ln.lower()}@gmail.com", addr))
    cur.executemany("INSERT INTO GUARDIAN VALUES (?, ?, ?, ?, ?, ?, ?)", guardians)
    conn.commit()

    # 9. ROOM_ALLOCATION & Update ROOM Status
    print("Seeding ROOM_ALLOCATION...")
    allocations = []
    boys_rooms = [r for r in room_objs if r['hostel_type'] == 'Boys']
    girls_rooms = [r for r in room_objs if r['hostel_type'] == 'Girls']

    boys_rooms.sort(key=lambda x: (x['hostel_id'], x['floor'], x['no']))
    girls_rooms.sort(key=lambda x: (x['hostel_id'], x['floor'], x['no']))

    active_boys = [s for s in student_objs if s['gender'] == 'Male' and s['is_active'] == 1]
    room_ptr = 0
    student_allocated_room = {}

    for stu in active_boys:
        while room_ptr < len(boys_rooms) and len(boys_rooms[room_ptr]['occupants']) >= boys_rooms[room_ptr]['cap']:
            room_ptr += 1
        if room_ptr < len(boys_rooms):
            target_room = boys_rooms[room_ptr]
            a_id = generate_id('ALLC')
            cin_date = random_date(datetime(2024, 7, 20), datetime(2024, 8, 10)).strftime('%Y-%m-%d')
            allocations.append((a_id, stu['id'], target_room['no'], '2024-2025', 'Fall', cin_date, None))
            target_room['occupants'].append(stu['id'])
            student_allocated_room[stu['id']] = target_room

    active_girls = [s for s in student_objs if s['gender'] == 'Female' and s['is_active'] == 1]
    room_ptr = 0
    for stu in active_girls:
        while room_ptr < len(girls_rooms) and len(girls_rooms[room_ptr]['occupants']) >= girls_rooms[room_ptr]['cap']:
            room_ptr += 1
        if room_ptr < len(girls_rooms):
            target_room = girls_rooms[room_ptr]
            a_id = generate_id('ALLC')
            cin_date = random_date(datetime(2024, 7, 20), datetime(2024, 8, 10)).strftime('%Y-%m-%d')
            allocations.append((a_id, stu['id'], target_room['no'], '2024-2025', 'Fall', cin_date, None))
            target_room['occupants'].append(stu['id'])
            student_allocated_room[stu['id']] = target_room

    cur.executemany("INSERT INTO ROOM_ALLOCATION VALUES (?, ?, ?, ?, ?, ?, ?)", allocations)

    # Batch update room status
    room_status_updates = []
    for r in room_objs:
        if len(r['occupants']) > 0:
            st = 'Occupied'
        else:
            st = 'UnderMaintenance' if random.random() < 0.04 else 'Vacant'
        room_status_updates.append((st, r['no']))
    cur.executemany("UPDATE ROOM SET Status = ? WHERE RoomNo = ?", room_status_updates)
    conn.commit()

    # 10. MEAL
    print("Seeding MEAL...")
    meals = []
    for m in MESS_CONFIGS:
        for m_time, dishes in MEALS.items():
            for dish in dishes:
                meal_id = generate_id('ML')
                cost = round(random.uniform(40, 110), 2)
                meals.append((meal_id, dish, f"Fresh {dish} prepared at {m['name']}", cost, m['id']))
    cur.executemany("INSERT INTO MEAL VALUES (?, ?, ?, ?, ?)", meals)
    conn.commit()

    # 11. MESS_SCHEDULE
    print("Seeding MESS_SCHEDULE...")
    schedules = []
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    meal_times = ['Breakfast', 'Lunch', 'Snack', 'Dinner']
    for m in MESS_CONFIGS:
        mess_meals = [ml for ml in meals if ml[4] == m['id']]
        for day in days:
            for m_time in meal_times:
                time_meals = [ml for ml in mess_meals if ml[1] in MEALS[m_time]]
                if time_meals:
                    sch_id = generate_id('MSCH')
                    selected_meal = random.choice(time_meals)
                    schedules.append((sch_id, m['id'], selected_meal[0], day, m_time))
    cur.executemany("INSERT INTO MESS_SCHEDULE VALUES (?, ?, ?, ?, ?)", schedules)
    conn.commit()

    # 12. MESS_ENROLLMENT
    print("Seeding MESS_ENROLLMENT...")
    enrollments = []
    student_mess_plan = {}
    for stu in student_objs:
        if stu['is_active']:
            e_id = generate_id('MSRB')
            m_id = random.choice(mess_ids)
            plan = random.choices(['Veg', 'NonVeg', 'Special'], weights=[50, 40, 10])[0]
            start_date = random_date(datetime(2024, 7, 20), datetime(2024, 8, 10)).strftime('%Y-%m-%d')
            enrollments.append((e_id, stu['id'], m_id, plan, start_date, None, 1))
            student_mess_plan[stu['id']] = plan
    cur.executemany("INSERT INTO MESS_ENROLLMENT VALUES (?, ?, ?, ?, ?, ?, ?)", enrollments)
    conn.commit()

    # 13. SUPPLIER & 14. INVENTORY_ITEM & 15. PROCUREMENT_EVENT & 16. INVENTORY_STOCK
    print("Seeding SUPPLIER & INVENTORY...")
    suppliers = []
    inventory_items = []
    procurements = []
    stocks = []

    supplier_item_map = {}
    for s_name, cat, items_list in SUPPLIER_ITEMS:
        s_id = generate_id('SUP')
        phone = generate_phone()
        email = f"sales@{s_name.replace(' ', '').replace('&', '').lower()[:12]}.com"
        addr = f"Plot {random.randint(10, 80)}, Industrial Area, {random.choice(CITIES)}"
        suppliers.append((s_id, s_name, phone, email, addr))
        supplier_item_map[s_id] = []

        for item_name in items_list:
            i_id = generate_id('ITM')
            unit = ITEM_UNITS.get(item_name, 'kg')
            inventory_items.append((i_id, item_name, cat, unit))
            supplier_item_map[s_id].append((i_id, item_name, unit))
    cur.executemany("INSERT INTO SUPPLIER VALUES (?, ?, ?, ?, ?)", suppliers)
    cur.executemany("INSERT INTO INVENTORY_ITEM VALUES (?, ?, ?, ?)", inventory_items)

    for m in MESS_CONFIGS:
        for s_id, itm_list in supplier_item_map.items():
            for i_id, itm_name, unit in itm_list:
                for _ in range(1):  # 1 purchase record per item per mess
                    p_id = generate_id('PRC')
                    base_price = ITEM_APPROX_PRICES.get(itm_name, 50.0)
                    unit_price = round(base_price * random.uniform(0.95, 1.05), 2)
                    qty = round(random.uniform(25, 150) if unit != 'units' else random.randint(50, 250), 2)
                    total_cost = round(qty * unit_price, 2)
                    p_date = random_date(datetime(2024, 8, 1), datetime(2024, 12, 15)).strftime('%Y-%m-%d')
                    procurements.append((p_id, m['id'], s_id, i_id, qty, p_date, unit_price, total_cost))

                cur_qty = round(random.uniform(15, 80) if unit != 'units' else random.randint(20, 100), 2)
                upd_date = random_date(datetime(2024, 12, 10), datetime(2024, 12, 28)).strftime('%Y-%m-%d')
                stocks.append((m['id'], i_id, cur_qty, upd_date))
    cur.executemany("INSERT INTO PROCUREMENT_EVENT VALUES (?, ?, ?, ?, ?, ?, ?, ?)", procurements)
    cur.executemany("INSERT INTO INVENTORY_STOCK VALUES (?, ?, ?, ?)", stocks)
    conn.commit()

    # 17. MONTHLY_BILL & 18. PAYMENT_TRANSACTION
    print("Seeding MONTHLY_BILL & PAYMENT_TRANSACTION...")
    bills = []
    payments = []
    months = [8, 9]  # Only 2 billing months
    year = 2025

    for stu_idx, stu in enumerate(student_objs):
        if not stu['is_active']:
            continue

        stu_room = student_allocated_room.get(stu['id'])
        room_rent = stu_room['rent'] if stu_room else 2500.0
        plan = student_mess_plan.get(stu['id'], 'Veg')
        mess_fee = 3000.0 if plan == 'Veg' else (3600.0 if plan == 'NonVeg' else 4200.0)

        rand_val = random.random()
        if rand_val < 0.86:
            profile = 'ON_TIME'
        elif rand_val < 0.94:
            profile = 'CURRENT_PENDING'
        elif rand_val < 0.98:
            profile = 'CURRENT_PARTIAL'
        else:
            profile = 'OVERDUE'

        for m in months:
            b_id = generate_id('BIL')
            other_chg = round(random.choice([0, 0, 0, 150, 200, 300]), 2)
            total = round(room_rent + mess_fee + other_chg, 2)
            due_date = f"{year}-{m:02d}-15"

            if profile == 'ON_TIME':
                status = 'Paid'
            elif profile == 'CURRENT_PENDING':
                status = 'Paid' if m < 9 else 'Unpaid'
            elif profile == 'CURRENT_PARTIAL':
                status = 'Paid' if m < 9 else 'Partial'
            else:
                status = 'Paid' if m <= 8 else 'Unpaid'

            bills.append((b_id, stu['id'], m, year, room_rent, mess_fee, other_chg, total, due_date, status))

            if status == 'Paid':
                p_id = generate_id('PAY')
                pay_day = random.randint(1, 14)
                pay_date = f"{year}-{m:02d}-{pay_day:02d}"
                mode = random.choices(['UPI', 'BankTransfer', 'Card', 'Cash'], weights=[65, 20, 10, 5])[0]
                ref = f"TXN{year}{m:02d}{random.randint(10000, 99999)}"
                payments.append((p_id, b_id, total, mode, pay_date, ref))
            elif status == 'Partial':
                p_id = generate_id('PAY')
                part_amount = round(total * 0.5, 2)
                pay_date = f"{year}-{m:02d}-12"
                mode = 'UPI'
                ref = f"TXN{year}{m:02d}{random.randint(10000, 99999)}"
                payments.append((p_id, b_id, part_amount, mode, pay_date, ref))

    cur.executemany("INSERT INTO MONTHLY_BILL VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", bills)
    cur.executemany("INSERT INTO PAYMENT_TRANSACTION VALUES (?, ?, ?, ?, ?, ?)", payments)
    conn.commit()

    # 19. LEAVE_REQUEST
    print("Seeding LEAVE_REQUEST...")
    leaves = []
    for _ in range(20):
        l_id = generate_id('LV')
        stu = random.choice([s for s in student_objs if s['is_active']])
        l_type, l_reason = random.choice(LEAVE_REASONS)
        from_dt = random_date(datetime(2024, 8, 15), datetime(2024, 12, 1))
        dur_days = random.randint(2, 4) if l_type == 'Weekend' else random.randint(4, 12)
        to_dt = from_dt + timedelta(days=dur_days)
        status = random.choices(['Approved', 'Pending', 'Rejected'], weights=[75, 15, 10])[0]
        w_id = random.choice(warden_ids) if status != 'Pending' else None
        leaves.append((l_id, stu['id'], l_type, from_dt.strftime('%Y-%m-%d'), to_dt.strftime('%Y-%m-%d'), l_reason, status, w_id))
    cur.executemany("INSERT INTO LEAVE_REQUEST VALUES (?, ?, ?, ?, ?, ?, ?, ?)", leaves)
    conn.commit()

    # 20. NOTICE
    print("Seeding NOTICE...")
    notices = [
        ('Hostel Main Gate Curfew Timings', 'All residents are reminded that hostel biometric entry closes strictly at 10:30 PM on weekdays.', 30),
        ('Annual Water Tank Cleaning Schedule', 'Overhead and underground water tank cleaning will take place this Saturday between 9:00 AM and 2:00 PM. Water supply will be suspended temporarily.', 7),
        ('Hostel Premier League (HPL) Registration', 'Inter-hostel box cricket tournament registration is now open at the warden office. Submit team rosters by Friday.', 14),
        ('Special Diwali Dinner & Feast Menu', 'Special festival feast scheduled for Diwali night in the central dining hall from 7:30 PM onwards.', 5),
        ('Energy Conservation & AC Maintenance', 'Residents are requested to turn off lights and appliances before leaving rooms. Routine AC condenser checks start next week.', 20),
        ('Semester End Room Handover Protocol', 'Graduating seniors and vacation boarders must complete the room inventory clearance sheet before departure.', 45)
    ]
    notice_rows = []
    for h in hostel_objs:
        for title, content, validity in notices:
            n_id = generate_id('NTC')
            p_dt = random_date(datetime(2024, 9, 1), datetime(2024, 11, 15))
            exp_dt = (p_dt + timedelta(days=validity)).strftime('%Y-%m-%d')
            w_id = random.choice(warden_ids)
            notice_rows.append((n_id, h['id'], title, content, p_dt.strftime('%Y-%m-%d'), w_id, exp_dt))
    cur.executemany("INSERT INTO NOTICE VALUES (?, ?, ?, ?, ?, ?, ?)", notice_rows)
    conn.commit()

    print("Active database tables populated successfully with realistic data!")

if __name__ == '__main__':
    from database import get_db, init_db, is_cloud_mode
    print(f"Initializing & seeding database (Mode: {'Cloud / Neon PostgreSQL' if is_cloud_mode() else 'Local / SQLite'})...")
    init_db()
    conn = get_db()
    seed_all(conn, clear_first=True)
    conn.close()
