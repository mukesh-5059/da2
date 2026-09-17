# Hostel and Mess Management System — Schema Versions

---

## Version 1: PDF-Faithful (Corrected)

Follows the original ER diagram's entities and relationships as closely as possible,
but fixes the broken cardinalities, misplaced relationships, and naming issues.

### Changes from original PDF

- Fixed Subscribes_to: moved from STUDENT→HOSTEL to STUDENT→MESS (via MessID FK + MealPlanType attribute)
- Fixed MENTORS cardinality: 1:1 → optional 1:N (nullable self-FK)
- Renamed PAYMENT_DETAIL → BILL_DETAIL (it holds charges, not payment info)
- Kept all separate phone tables since the original ER models PhoneNo as multi-valued
- Kept PROCURES as a ternary relationship table (original structure) but noted the no-date limitation
- Split WardenName → FirstName, LastName for consistency

### Relations (18 total)

```
1.  WARDEN (WardenID PK, FirstName, LastName, Email, JoiningDate, ExperienceYears)

2.  WARDEN_PHONE (WardenID PK/FK, PhoneNo PK)

3.  HOSTEL (HostelID PK, HostelName, TotalFloors, TotalRooms, WardenID FK)
      -- 1 warden manages 1 hostel

4.  ROOM_TYPE (Type PK, Capacity, RoomRent)

5.  ROOM (RoomNo PK, FloorNo, Type FK, HostelID FK)

6.  STUDENT (StudentID PK, FirstName, LastName, Gender, DOB, Email,
             BloodGroup, MealPlanType, MentorStudentID FK [nullable],
             RoomNo FK, MessID FK)
      -- MentorStudentID: self-FK, nullable (not every student has/is a mentor)
      -- MessID: moved here from the broken Subscribes_to→HOSTEL relationship
      -- MealPlanType: 'Veg' / 'NonVeg' / 'Special'

7.  STUDENT_PHONE (StudentID PK/FK, PhoneNo PK)

8.  MESS (MessID PK, MessName, MessType, Location)

9.  MESS_CONTACT (MessID PK/FK, ContactNo PK)

10. MEAL (MealID PK, MealName, Description, Cost, MessID FK)

11. STAFF (StaffID PK, StaffName, JoinDate, Salary, Role, MessID FK)
      -- Role: 'Chef' / 'Cleaner' / 'Helper'

12. STAFF_PHONE (StaffID PK/FK, PhoneNo PK)

13. SUPPLIER (SupplierID PK, SupplierName)

14. SUPPLIER_PHONE (SupplierID PK/FK, PhoneNo PK)

15. INVENTORY_ITEM (ItemID PK, ItemName, Category, Unit)

16. PROCURES (MessID PK/FK, SupplierID PK/FK, ItemID PK/FK, Quantity)
      -- Ternary relationship from ER, kept as-is
      -- Limitation: no date = can't record repeat purchases

17. PAYMENT (PaymentID PK, StudentID FK, Amount, PaymentMode, Status,
             PaymentDay, PaymentMonth, PaymentYear)

18. BILL_DETAIL (PaymentID PK/FK, DetailID PK, Month, Year,
                 MessCharges, OtherCharges)
      -- Renamed from PAYMENT_DETAIL — this is charge breakdown, not payment info
```

### What's still wrong (by design — staying faithful to PDF)

- PROCURES has no date column, so you can only record one purchase per (mess, supplier, item) combo ever.
- PAYMENT → BILL_DETAIL direction is backwards. Logically, a bill should exist first, then payments settle it. The PDF models it as payment first, details second.
- Separate phone tables for every entity is overkill for a hostel system where nobody has 5 contact numbers on file.
- STAFF has no specialization attributes (cuisine type, shift) — the PDF's ER doesn't model the EER specialization.
- No hostel type (boys/girls) — the PDF omits this.

---

## Version 2: Proper Schema for Hostel & Mess Management

Redesigned for how this system actually works in the real world.
Drops broken patterns, adds missing operational entities, fixes naming.

### Design decisions

- Single phone column per entity (no multi-phone tables)
- PROCUREMENT_EVENT with surrogate PK and date (supports repeat purchases)
- MONTHLY_BILL + PAYMENT_TRANSACTION (proper billing → payment flow)
- PaymentStatus enum instead of boolean IsPaid (handles partial payments)
- Added HostelType, Supplier address, Staff shift/cuisine attributes
- Added COMPLAINT for maintenance tracking (core hostel operation)
- Added MESS_SCHEDULE for weekly menu rotation
- Kept MentorStudentID as optional self-FK (simple, sufficient)

### Relations (16 total)

```
 1. WARDEN (
      WardenID        PK,
      FirstName,
      LastName,
      Email,
      Phone,
      JoiningDate,
      ExperienceYears
    )

 2. HOSTEL (
      HostelID        PK,
      HostelName,
      HostelType,         -- 'Boys' / 'Girls'
      TotalFloors,
      TotalRooms,
      WardenID        FK → WARDEN
    )

 3. ROOM_TYPE (
      Type            PK,  -- 'Single' / 'Double' / 'Triple'
      Capacity,
      RoomRent
    )

 4. ROOM (
      RoomNo          PK,
      FloorNo,
      Type            FK → ROOM_TYPE,
      HostelID        FK → HOSTEL
    )

 5. STUDENT (
      StudentID       PK,
      FirstName,
      LastName,
      Gender,
      DOB,
      Email,
      Phone,
      BloodGroup,
      MealPlanType,       -- 'Veg' / 'NonVeg' / 'Special'
      MentorStudentID FK → STUDENT [nullable],
      RoomNo          FK → ROOM,
      MessID          FK → MESS
    )

 6. MESS (
      MessID          PK,
      MessName,
      MessType,           -- 'Veg' / 'NonVeg' / 'Both'
      Location,
      Phone
    )

 7. MEAL (
      MealID          PK,
      MealName,
      Description,
      Cost,
      MessID          FK → MESS
    )

 8. MESS_SCHEDULE (
      ScheduleID      PK,
      MessID          FK → MESS,
      MealID          FK → MEAL,
      DayOfWeek,          -- 'Monday' ... 'Sunday'
      MealTime            -- 'Breakfast' / 'Lunch' / 'Snack' / 'Dinner'
    )

 9. STAFF (
      StaffID         PK,
      FirstName,
      LastName,
      Phone,
      JoinDate,
      Salary,
      Role,               -- 'Chef' / 'Cleaner' / 'Helper'
      ShiftSlot,          -- 'Morning' / 'Evening' / 'Night'
      CuisineType,        -- nullable, only when Role = 'Chef'
      MessID          FK → MESS
    )

10. SUPPLIER (
      SupplierID      PK,
      SupplierName,
      Phone,
      Address
    )

11. INVENTORY_ITEM (
      ItemID          PK,
      ItemName,
      Category,           -- 'Dairy' / 'Vegetables' / 'Grains' / 'Spices' / 'Other'
      Unit                -- 'kg' / 'litre' / 'units'
    )

12. PROCUREMENT_EVENT (
      PurchaseID      PK,
      MessID          FK → MESS,
      SupplierID      FK → SUPPLIER,
      ItemID          FK → INVENTORY_ITEM,
      Quantity,
      PurchaseDate,
      TotalCost
    )

13. MONTHLY_BILL (
      BillID          PK,
      StudentID       FK → STUDENT,
      BillingMonth,
      BillingYear,
      RoomRentCharges,
      MessCharges,
      OtherCharges,
      DueDate,
      PaymentStatus       -- 'Unpaid' / 'Partial' / 'Paid'
    )

14. PAYMENT_TRANSACTION (
      PaymentID       PK,
      BillID          FK → MONTHLY_BILL,
      AmountPaid,
      PaymentMode,        -- 'Cash' / 'UPI' / 'Card' / 'BankTransfer'
      PaymentDate,
      TransactionReference
    )

15. COMPLAINT (
      ComplaintID     PK,
      StudentID       FK → STUDENT,
      RoomNo          FK → ROOM,
      Category,           -- 'Electrical' / 'Plumbing' / 'Furniture' / 'Mess' / 'Other'
      Description,
      DateFiled,
      Status,             -- 'Open' / 'InProgress' / 'Resolved'
      ResolvedDate        -- nullable
    )

16. VISITOR_LOG (
      VisitID         PK,
      StudentID       FK → STUDENT,
      VisitorName,
      VisitorPhone,
      Purpose,
      CheckInTime,
      CheckOutTime        -- nullable (still on premises)
    )
```

### Relationship summary

| Relationship | Type | Description |
|---|---|---|
| WARDEN — HOSTEL | 1:1 | One warden manages one hostel |
| HOSTEL — ROOM | 1:N | Hostel contains many rooms |
| ROOM_TYPE — ROOM | 1:N | Room type defines capacity and rent |
| STUDENT — ROOM | N:1 | Multiple students can share a room |
| STUDENT — STUDENT | 1:N (self) | Senior mentors juniors (optional) |
| STUDENT — MESS | N:1 | Student subscribes to one mess |
| MESS — MEAL | 1:N | Mess serves multiple meals |
| MESS — MESS_SCHEDULE | 1:N | Weekly menu schedule |
| MESS — STAFF | 1:N | Mess employs multiple staff |
| MESS — PROCUREMENT_EVENT | 1:N | Mess makes purchases |
| SUPPLIER — PROCUREMENT_EVENT | 1:N | Supplier fulfills purchases |
| INVENTORY_ITEM — PROCUREMENT_EVENT | 1:N | Item appears in purchases |
| STUDENT — MONTHLY_BILL | 1:N | Student receives monthly bills |
| MONTHLY_BILL — PAYMENT_TRANSACTION | 1:N | Bill can have multiple payments |
| STUDENT — COMPLAINT | 1:N | Student can file complaints |
| STUDENT — VISITOR_LOG | 1:N | Student can have visitors |

### What Version 2 fixes over Version 1

| Issue | Version 1 (PDF) | Version 2 (Proper) |
|---|---|---|
| Subscribes_to target | Originally HOSTEL, moved to MESS but still awkward | Clean MessID FK + MealPlanType on STUDENT |
| Purchase history | No date on PROCURES, one record per combo | PROCUREMENT_EVENT with PurchaseDate |
| Billing flow | PAYMENT → PAYMENT_DETAIL (backwards) | MONTHLY_BILL → PAYMENT_TRANSACTION (correct) |
| Partial payments | Status field with no mechanism | PaymentStatus enum + multiple transactions per bill |
| Phone storage | 5 separate phone tables | Single Phone column per entity |
| Staff specialization | Flat, no role-specific attributes | ShiftSlot for all, CuisineType for chefs |
| Hostel gender | Not tracked | HostelType column |
| Maintenance | Not modeled | COMPLAINT entity |
| Visitor tracking | Not modeled | VISITOR_LOG entity |
| Menu scheduling | Not modeled | MESS_SCHEDULE entity |


---

## Version 3: Complete Real-World System

Designed purely from the problem domain — what does it take to actually run
a hostel and its attached mess facilities on a university campus?

No dependency on the original PDF. Every entity and attribute exists because
some real hostel operation needs it.

### Design rationale

**What got dropped from earlier versions:**
- `ExperienceYears` on WARDEN — HR data, no hostel process depends on it
- `MentorStudentID` on STUDENT — academic concern, not hostel management
- Direct `RoomNo` FK on STUDENT — replaced by ROOM_ALLOCATION (tracks history)
- Direct `MessID` / `MealPlanType` on STUDENT — replaced by MESS_ENROLLMENT (tracks changes)
- All separate phone tables — one phone column per entity is sufficient

**What got added:**
- GUARDIAN — emergency contacts, required at admission
- ROOM_ALLOCATION — semester-wise room assignment history
- MESS_ENROLLMENT — semester-wise mess subscription with plan type
- INVENTORY_STOCK — current pantry levels (not just purchase history)
- COMPLAINT — maintenance requests, nullable room for common-area issues
- VISITOR_LOG — gate security visitor tracking
- LEAVE_REQUEST — student outing/leave approval flow
- ATTENDANCE_LOG — nightly roll call / biometric check-in
- NOTICE — warden announcements to hostel residents
- `HostelID` on STAFF — non-mess staff (security, cleaners) need hostel assignment

### Relations (23 total)

**1. Users & Personnel**

```
 1. WARDEN (
      WardenID        PK,
      FirstName,
      LastName,
      Email,
      Phone,
      Designation,        -- 'ChiefWarden' / 'Warden' / 'AssistantWarden'
      JoiningDate
    )

 2. STUDENT (
      StudentID       PK,
      FirstName,
      LastName,
      Gender,
      DOB,
      Email,
      Phone,
      BloodGroup,
      Department,
      AdmissionDate,
      IsActive            -- true = currently residing, false = graduated/left
    )

 3. GUARDIAN (
      GuardianID      PK,
      StudentID       FK → STUDENT,
      GuardianName,
      Relationship,       -- 'Father' / 'Mother' / 'Sibling' / 'Other'
      Phone,
      Email [nullable],
      Address
    )

 4. STAFF (
      StaffID         PK,
      FirstName,
      LastName,
      Phone,
      JoinDate,
      Salary,
      Role,               -- 'Chef' / 'Cleaner' / 'Helper' / 'Security'
      ShiftSlot,          -- 'Morning' / 'Evening' / 'Night'
      CuisineType,        -- nullable, only when Role = 'Chef'
      MessID          FK → MESS [nullable],
      HostelID        FK → HOSTEL [nullable]
    )
      -- Mess staff: MessID is set, HostelID is null
      -- Hostel staff (security, cleaners): HostelID is set, MessID is null
      -- CHECK: at least one of MessID or HostelID must be non-null
```

**2. Accommodation**

```
 5. HOSTEL (
      HostelID        PK,
      HostelName,
      HostelType,         -- 'Boys' / 'Girls'
      TotalFloors,
      TotalRooms,
      Location,           -- campus-level location description
      WardenID        FK → WARDEN
    )

 6. ROOM_TYPE (
      Type            PK,  -- 'Single' / 'Double' / 'Triple'
      Capacity,
      RoomRent
    )

 7. ROOM (
      RoomNo          PK,
      FloorNo,
      Status,             -- 'Occupied' / 'Vacant' / 'UnderMaintenance'
      Type            FK → ROOM_TYPE,
      HostelID        FK → HOSTEL
    )

 8. ROOM_ALLOCATION (
      AllocationID    PK,
      StudentID       FK → STUDENT,
      RoomNo          FK → ROOM,
      AcademicYear,       -- '2025-26'
      Semester,           -- 'Fall' / 'Winter' / 'Summer'
      CheckInDate,
      CheckOutDate        -- nullable (still residing)
    )
      -- Current room = record where CheckOutDate IS NULL
      -- Full room history = all records for a StudentID
```

**3. Mess & Dining**

```
 9. MESS (
      MessID          PK,
      MessName,
      MessType,           -- 'Veg' / 'NonVeg' / 'Both'
      Location,
      Phone,
      SeatingCapacity
    )

10. MEAL (
      MealID          PK,
      MealName,
      Description,
      Cost,
      MessID          FK → MESS
    )

11. MESS_SCHEDULE (
      ScheduleID      PK,
      MessID          FK → MESS,
      MealID          FK → MEAL,
      DayOfWeek,          -- 'Monday' ... 'Sunday'
      MealTime            -- 'Breakfast' / 'Lunch' / 'Snack' / 'Dinner'
    )

12. MESS_ENROLLMENT (
      EnrollmentID    PK,
      StudentID       FK → STUDENT,
      MessID          FK → MESS,
      MealPlanType,       -- 'Veg' / 'NonVeg' / 'Special'
      StartDate,
      EndDate [nullable],
      IsActive            -- quick lookup: true = current enrollment
    )
      -- Supports semester-wise mess changes and plan switches
```

**4. Inventory & Procurement**

```
13. SUPPLIER (
      SupplierID      PK,
      SupplierName,
      Phone,
      Email,
      Address
    )

14. INVENTORY_ITEM (
      ItemID          PK,
      ItemName,
      Category,           -- 'Dairy' / 'Vegetables' / 'Grains' / 'Spices' / 'Cleaning' / 'Other'
      Unit                -- 'kg' / 'litre' / 'units' / 'packets'
    )

15. PROCUREMENT_EVENT (
      PurchaseID      PK,
      MessID          FK → MESS,
      SupplierID      FK → SUPPLIER,
      ItemID          FK → INVENTORY_ITEM,
      Quantity,
      PurchaseDate,
      UnitPrice,
      TotalCost
    )

16. INVENTORY_STOCK (
      MessID          PK/FK → MESS,
      ItemID          PK/FK → INVENTORY_ITEM,
      CurrentQuantity,
      LastUpdatedDate
    )
      -- Composite PK: (MessID, ItemID)
      -- Tracks what's currently in the pantry, not what was purchased
      -- Updated when procurement adds stock or daily usage draws it down
```

**5. Financials**

```
17. MONTHLY_BILL (
      BillID          PK,
      StudentID       FK → STUDENT,
      BillingMonth,
      BillingYear,
      RoomRentCharges,
      MessCharges,
      OtherCharges,
      TotalAmount,        -- RoomRent + Mess + Other
      DueDate,
      PaymentStatus       -- 'Unpaid' / 'Partial' / 'Paid'
    )

18. PAYMENT_TRANSACTION (
      PaymentID       PK,
      BillID          FK → MONTHLY_BILL,
      AmountPaid,
      PaymentMode,        -- 'Cash' / 'UPI' / 'Card' / 'BankTransfer'
      PaymentDate,
      TransactionReference
    )
```

**6. Operations**

```
19. COMPLAINT (
      ComplaintID     PK,
      StudentID       FK → STUDENT,
      RoomNo          FK → ROOM [nullable],
      SpecificLocation,   -- e.g. '3rd Floor Hallway', 'Laundry Room'
                          -- used when complaint is about a common area (RoomNo is null)
      Category,           -- 'Electrical' / 'Plumbing' / 'Furniture' / 'Mess' / 'Pest' / 'Other'
      Description,
      DateFiled,
      Status,             -- 'Open' / 'InProgress' / 'Resolved' / 'Rejected'
      ResolvedDate [nullable],
      ResolutionRemarks [nullable]
    )

20. VISITOR_LOG (
      VisitID         PK,
      StudentID       FK → STUDENT,
      VisitorName,
      VisitorPhone,
      Relationship,       -- 'Parent' / 'Sibling' / 'Friend' / 'Other'
      Purpose,
      CheckInTime,
      CheckOutTime [nullable]
    )

21. LEAVE_REQUEST (
      LeaveID         PK,
      StudentID       FK → STUDENT,
      LeaveType,          -- 'Weekend' / 'Medical' / 'Vacation' / 'Emergency'
      FromDate,
      ToDate,
      Reason,
      ApprovalStatus,     -- 'Pending' / 'Approved' / 'Rejected'
      ApprovedBy      FK → WARDEN [nullable]
    )

22. ATTENDANCE_LOG (
      LogID           PK,
      StudentID       FK → STUDENT,
      Date,
      Status,             -- 'Present' / 'Absent' / 'OnLeave'
      PunchTime [nullable]
    )
      -- Nightly attendance: biometric swipe or manual roll call
      -- PunchTime is null when status is manually marked (e.g. 'OnLeave', 'Absent')

23. NOTICE (
      NoticeID        PK,
      HostelID        FK → HOSTEL,
      Title,
      Content,
      PostedDate,
      PostedBy        FK → WARDEN,
      ExpiryDate [nullable]
    )
```

### Relationship summary

| Relationship | Type | Description |
|---|---|---|
| WARDEN — HOSTEL | 1:1 | One warden manages one hostel |
| HOSTEL — ROOM | 1:N | Hostel contains many rooms |
| HOSTEL — STAFF | 1:N | Hostel-level staff (security, cleaners) |
| HOSTEL — NOTICE | 1:N | Notices scoped to a hostel |
| ROOM_TYPE — ROOM | 1:N | Type defines capacity and rent |
| STUDENT — GUARDIAN | 1:N | Emergency contacts |
| STUDENT — ROOM_ALLOCATION | 1:N | Room assignments over time |
| ROOM — ROOM_ALLOCATION | 1:N | Occupants over time |
| STUDENT — MESS_ENROLLMENT | 1:N | Mess subscriptions over semesters |
| MESS — MESS_ENROLLMENT | 1:N | Enrolled students |
| MESS — MEAL | 1:N | Meals served |
| MESS — MESS_SCHEDULE | 1:N | Weekly rotating menu |
| MESS — STAFF | 1:N | Mess-level staff (chefs, helpers) |
| MESS — PROCUREMENT_EVENT | 1:N | Purchases over time |
| MESS — INVENTORY_STOCK | 1:N | Current pantry levels per item |
| SUPPLIER — PROCUREMENT_EVENT | 1:N | Fulfilled orders |
| INVENTORY_ITEM — PROCUREMENT_EVENT | 1:N | Purchase records per item |
| INVENTORY_ITEM — INVENTORY_STOCK | 1:N | Stock levels per mess |
| STUDENT — MONTHLY_BILL | 1:N | Monthly invoices |
| MONTHLY_BILL — PAYMENT_TRANSACTION | 1:N | Payments against a bill |
| STUDENT — COMPLAINT | 1:N | Maintenance complaints |
| STUDENT — VISITOR_LOG | 1:N | Visitor records |
| STUDENT — LEAVE_REQUEST | 1:N | Leave/outing requests |
| STUDENT — ATTENDANCE_LOG | 1:N | Nightly attendance records |
| WARDEN — LEAVE_REQUEST | 1:N | Approvals/rejections |
| WARDEN — NOTICE | 1:N | Posted announcements |


