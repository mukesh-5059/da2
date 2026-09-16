# Hostel Management System - REST API Documentation

Base URL: `http://localhost:5000/api`

All request and response payloads use JSON format (`Content-Type: application/json`).

---

## Overview of Domains & Endpoints

| Domain | Base Path | Key Entities |
|---|---|---|
| Accommodation | `/api` | Hostels, Room Types, Rooms, Allocations |
| Personnel | `/api` | Wardens, Students, Guardians, Staff |
| Mess | `/api` | Messes, Meals, Schedules, Enrollments |
| Inventory | `/api` | Suppliers, Items, Procurement, Stock |
| Financials | `/api` | Monthly Bills, Payment Transactions |
| Operations | `/api` | Complaints, Visitors, Leaves, Attendance, Notices |

---

## 1. Accommodation API

### Hostels
- **`GET /api/hostels`**
  - **Query Params**: `gender` (M/F), `type` (BOYS/GIRLS)
  - **Response**: `200 OK`
    ```json
    [
      { "hostel_id": "H-101", "name": "Block A", "capacity": 300, "gender_type": "M", "warden_id": "W-1" }
    ]
    ```
- **`POST /api/hostels`**
  - **Body**: `{ "hostel_id": "H-109", "name": "Block I", "capacity": 250, "gender_type": "M", "warden_id": "W-2" }`
  - **Response**: `201 Created` `{ "message": "Hostel created successfully" }`
- **`PUT /api/hostels/<hostel_id>`**
  - **Body**: Any subset of fields to update.
- **`DELETE /api/hostels/<hostel_id>`**
  - **Response**: `200 OK` `{ "message": "Hostel deleted successfully" }`

### Room Types
- **`GET /api/room-types`**
- **`POST /api/room-types`**
  - **Body**: `{ "type_name": "Single AC", "capacity": 1, "is_ac": 1, "rent_per_month": 12000.0 }`
- **`PUT /api/room-types/<type_name>`**
- **`DELETE /api/room-types/<type_name>`**

### Rooms
- **`GET /api/rooms`**
  - **Query Params**: `hostel_id`, `status` (AVAILABLE/OCCUPIED/MAINTENANCE), `type_name`
- **`POST /api/rooms`**
  - **Body**: `{ "room_no": "A-101", "hostel_id": "H-101", "type_name": "Single AC", "status": "AVAILABLE" }`
- **`PUT /api/rooms/<room_no>`**
- **`DELETE /api/rooms/<room_no>`**

### Room Allocations
- **`GET /api/allocations`**
  - **Query Params**: `student_id`, `hostel_id`, `status` (ACTIVE/TERMINATED)
- **`POST /api/allocations`**
  - **Body**: `{ "allocation_id": "AL-1001", "student_id": "S-1001", "room_no": "A-101", "start_date": "2026-01-01", "end_date": "2026-12-31", "status": "ACTIVE" }`
- **`PUT /api/allocations/<allocation_id>`**
- **`DELETE /api/allocations/<allocation_id>`**

---

## 2. Personnel API

### Wardens
- **`GET /api/wardens`** (Query: `hostel_id`)
- **`POST /api/wardens`**
  - **Body**: `{ "warden_id": "W-10", "name": "Dr. R. Sharma", "phone": "9876543210", "email": "sharma@vit.ac.in", "hostel_id": "H-101" }`
- **`PUT /api/wardens/<warden_id>`**
- **`DELETE /api/wardens/<warden_id>`**

### Students
- **`GET /api/students`**
  - **Query Params**: `search` (name/ID), `gender`, `year`
- **`POST /api/students`**
  - **Body**: `{ "student_id": "S-1500", "name": "Rahul Verma", "gender": "M", "dob": "2003-05-14", "phone": "9876501234", "email": "rahul@vit.ac.in", "year_of_study": 2, "department": "CSE" }`
- **`PUT /api/students/<student_id>`**
- **`DELETE /api/students/<student_id>`**

### Guardians
- **`GET /api/guardians`** (Query: `student_id`)
- **`POST /api/guardians`**
  - **Body**: `{ "guardian_id": "G-1500", "student_id": "S-1500", "name": "Sanjay Verma", "relation": "Father", "phone": "9876500000", "address": "Delhi" }`
- **`PUT /api/guardians/<guardian_id>`**
- **`DELETE /api/guardians/<guardian_id>`**

### Staff
- **`GET /api/staff`** (Query: `role`, `hostel_id`)
- **`POST /api/staff`**
  - **Body**: `{ "staff_id": "ST-100", "name": "Suresh Kumar", "role": "CLEANER", "phone": "9812345678", "hostel_id": "H-101" }`
- **`PUT /api/staff/<staff_id>`**
- **`DELETE /api/staff/<staff_id>`**

---

## 3. Mess API

### Messes
- **`GET /api/messes`** (Query: `hostel_id`)
- **`POST /api/messes`**
  - **Body**: `{ "mess_id": "M-101", "name": "Special Veg Mess", "hostel_id": "H-101", "type": "VEG", "capacity": 400 }`
- **`PUT /api/messes/<mess_id>`**
- **`DELETE /api/messes/<mess_id>`**

### Meals
- **`GET /api/meals`** (Query: `mess_id`, `meal_type`)
- **`POST /api/meals`**
  - **Body**: `{ "meal_id": "ML-101", "mess_id": "M-101", "meal_type": "BREAKFAST", "menu_description": "Idli, Sambar, Tea", "cost": 40.0 }`
- **`PUT /api/meals/<meal_id>`**
- **`DELETE /api/meals/<meal_id>`**

### Mess Schedules
- **`GET /api/mess-schedules`** (Query: `mess_id`, `day`)
- **`POST /api/mess-schedules`**
  - **Body**: `{ "schedule_id": "MS-101", "mess_id": "M-101", "day_of_week": "Monday", "meal_id": "ML-101", "start_time": "07:30", "end_time": "09:30" }`
- **`PUT /api/mess-schedules/<schedule_id>`**
- **`DELETE /api/mess-schedules/<schedule_id>`**

### Mess Enrollments
- **`GET /api/mess-enrollments`** (Query: `student_id`, `mess_id`)
- **`POST /api/mess-enrollments`**
  - **Body**: `{ "enrollment_id": "ME-1001", "student_id": "S-1001", "mess_id": "M-101", "start_date": "2026-01-01", "end_date": "2026-05-31" }`
- **`PUT /api/mess-enrollments/<enrollment_id>`**
- **`DELETE /api/mess-enrollments/<enrollment_id>`**

---

## 4. Inventory API

### Suppliers
- **`GET /api/suppliers`**
- **`POST /api/suppliers`**
  - **Body**: `{ "supplier_id": "SUP-10", "name": "Quality Dairy", "contact_person": "Amit", "phone": "9988776655", "email": "dairy@sup.com", "address": "Vellore" }`
- **`PUT /api/suppliers/<supplier_id>`**
- **`DELETE /api/suppliers/<supplier_id>`**

### Inventory Items
- **`GET /api/inventory-items`** (Query: `category`)
- **`POST /api/inventory-items`**
  - **Body**: `{ "item_id": "ITM-50", "name": "Milk (Liters)", "category": "RATION", "unit": "LITER" }`
- **`PUT /api/inventory-items/<item_id>`**
- **`DELETE /api/inventory-items/<item_id>`**

### Procurement Events
- **`GET /api/procurement-events`** (Query: `supplier_id`, `item_id`)
- **`POST /api/procurement-events`**
  - **Body**: `{ "purchase_id": "P-500", "supplier_id": "SUP-10", "item_id": "ITM-50", "quantity": 100, "unit_price": 50.0, "total_cost": 5000.0, "purchase_date": "2026-09-01" }`
- **`PUT /api/procurement-events/<purchase_id>`**
- **`DELETE /api/procurement-events/<purchase_id>`**

### Inventory Stock
- **`GET /api/inventory-stock`** (Query: `mess_id`)
- **`POST /api/inventory-stock`** (or `PUT`)
  - **Body**: `{ "mess_id": "M-101", "item_id": "ITM-50", "quantity": 150 }`
- **`DELETE /api/inventory-stock/<mess_id>/<item_id>`**

---

## 5. Financials API

### Monthly Bills
- **`GET /api/monthly-bills`**
  - **Query Params**: `student_id`, `status` (PENDING/PAID/OVERDUE), `month_year` (YYYY-MM)
- **`POST /api/monthly-bills`**
  - **Body**: `{ "bill_id": "B-9000", "student_id": "S-1001", "month_year": "2026-09", "room_rent": 10000.0, "mess_fee": 4000.0, "other_charges": 500.0, "total_amount": 14500.0, "due_date": "2026-09-25", "status": "PENDING" }`
- **`PUT /api/monthly-bills/<bill_id>`**
- **`DELETE /api/monthly-bills/<bill_id>`**

### Payment Transactions
- **`GET /api/payment-transactions`**
  - **Query Params**: `student_id`, `bill_id`, `mode` (UPI/NETBANKING/CARD/CASH)
- **`POST /api/payment-transactions`**
  - **Body**: `{ "payment_id": "PAY-9000", "bill_id": "B-9000", "amount_paid": 14500.0, "payment_date": "2026-09-10", "payment_mode": "UPI", "transaction_ref": "TXN123456789" }`
- **`PUT /api/payment-transactions/<payment_id>`**
- **`DELETE /api/payment-transactions/<payment_id>`**

---

## 6. Operations API

### Complaints
- **`GET /api/complaints`**
  - **Query Params**: `student_id`, `status` (OPEN/IN_PROGRESS/RESOLVED), `category` (PLUMBING/ELECTRICAL/CLEANLINESS/OTHER)
- **`POST /api/complaints`**
  - **Body**: `{ "complaint_id": "CMP-100", "student_id": "S-1001", "category": "ELECTRICAL", "description": "Fan speed regulator not working", "status": "OPEN", "created_at": "2026-09-15 10:00:00" }`
- **`PUT /api/complaints/<complaint_id>`**
- **`DELETE /api/complaints/<complaint_id>`**

### Visitor Logs
- **`GET /api/visitor-logs`** (Query: `student_id`, `date`)
- **`POST /api/visitor-logs`**
  - **Body**: `{ "visit_id": "V-500", "student_id": "S-1001", "visitor_name": "Ramesh Verma", "relation": "Father", "check_in": "2026-09-16 14:00:00", "check_out": "2026-09-16 17:00:00" }`
- **`PUT /api/visitor-logs/<visit_id>`**
- **`DELETE /api/visitor-logs/<visit_id>`**

### Leave Requests
- **`GET /api/leave-requests`**
  - **Query Params**: `student_id`, `status` (PENDING/APPROVED/REJECTED)
- **`POST /api/leave-requests`**
  - **Body**: `{ "leave_id": "L-300", "student_id": "S-1001", "start_date": "2026-09-20", "end_date": "2026-09-25", "reason": "Home visit for festival", "status": "PENDING" }`
- **`PUT /api/leave-requests/<leave_id>`**
- **`DELETE /api/leave-requests/<leave_id>`**

### Attendance Logs
- **`GET /api/attendance-logs`**
  - **Query Params**: `student_id`, `date`, `status` (PRESENT/ABSENT/LATE)
- **`POST /api/attendance-logs`**
  - **Body**: `{ "log_id": "ATT-5000", "student_id": "S-1001", "date": "2026-09-16", "status": "PRESENT", "remarks": "" }`
- **`PUT /api/attendance-logs/<log_id>`**
- **`DELETE /api/attendance-logs/<log_id>`**

### Notices
- **`GET /api/notices`**
  - **Query Params**: `target_audience` (ALL/STUDENTS/STAFF), `active_only` (true/false)
- **`POST /api/notices`**
  - **Body**: `{ "notice_id": "N-50", "title": "Mess Cleaning Drive", "content": "Mess 1 will remain closed for maintenance on Sunday morning.", "publish_date": "2026-09-16", "target_audience": "ALL" }`
- **`PUT /api/notices/<notice_id>`**
- **`DELETE /api/notices/<notice_id>`**

---

## Error Handling

Standard HTTP status codes returned by the API:

- `200 OK` - Request succeeded.
- `201 Created` - Resource created successfully.
- `400 Bad Request` - Missing required fields or database integrity violation.
- `404 Not Found` - Requested resource ID does not exist.
- `500 Internal Server Error` - Server or SQL error.

Error Response Body:
```json
{
  "error": "Detailed error message here"
}
```
