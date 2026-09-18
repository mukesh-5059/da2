# Hostel and Mess Management System

A full-stack web application for managing hostel accommodations, mess operations, financials, and inventory across a university campus. Built as part of the Database Systems (DA2) assignment.

**Live demo:** https://hostel-and-mess-management-system-cjn2.onrender.com/

> The backend is on Render's free tier — the first request after a period of inactivity may take up to 30 seconds to wake up. Subsequent requests are fast.

---

## What it does

The system handles the day-to-day administrative operations of a multi-hostel campus:

- **Accommodations** — room inventory, room types, floor-wise allocation, and student room assignments
- **Personnel** — student profiles, warden assignments, and support staff records
- **Mess & Dining** — mess facility management, meal schedules, and student enrollment
- **Financials** — monthly billing, payment tracking, and transaction history per student
- **Inventory & Supplies** — pantry stock levels, procurement events, supplier directory, and item catalog
- **Tables view** — raw table browser for all 20+ relations in the schema, with pagination, search, and sorting

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + TypeScript (Vite) |
| Backend | Python / Flask |
| Production DB | PostgreSQL (Neon serverless) |
| Local DB | SQLite (`hostel.db`) |
| Hosting | Render (backend), localhost (frontend dev) |

---

## Schema

The database has 23 relations across 6 domains. Key tables:

```
WARDEN, HOSTEL, ROOM_TYPE, ROOM, ROOM_ALLOCATION
STUDENT, GUARDIAN, STAFF
MESS, MEAL, MESS_SCHEDULE, MESS_ENROLLMENT
MONTHLY_BILL, PAYMENT_TRANSACTION
SUPPLIER, INVENTORY_ITEM, INVENTORY_STOCK, PROCUREMENT_EVENT
```

The schema went through 3 major versions during the course of the assignment. `schema_versions.md` documents each version, the design decisions, and deviations from the original ER diagram.

---

## Running locally

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```env
# Use 'local' for SQLite, 'cloud' for Neon PostgreSQL
DB_MODE=local
DATABASE_URL=postgresql://<your-neon-connection-string>
```

```bash
python3 app.py
```

The backend runs on `http://localhost:5000`.

To seed the database with sample data:

```bash
python3 seed.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000` and expects the backend at `http://localhost:5000`.

---

## Project structure

```
da2/
├── backend/
│   ├── app.py              # Flask app, blueprint registration
│   ├── database.py         # DB adapter — handles both SQLite and PostgreSQL
│   ├── utils.py            # Pagination, search, sort helper
│   ├── seed.py             # Sample data seeder
│   ├── requirements.txt
│   ├── .env                # DB mode config (not committed)
│   └── routes/
│       ├── accommodation.py
│       ├── personnel.py
│       ├── mess.py
│       ├── financials.py
│       ├── inventory.py
│       └── operations.py
├── frontend/
│   └── src/
│       ├── App.tsx
│       ├── components/     # Accommodation, Personnel, Mess, Financials, Inventory tabs
│       ├── services/       # API client
│       └── types/          # TypeScript interfaces
└── schema_versions.md      # ER design history and rationale
```

---

## API

All routes are prefixed with `/api`. A few examples:

```
GET  /api/hostels
GET  /api/rooms?hostel_id=H01
GET  /api/students?page=1&limit=25&search=kumar
GET  /api/monthly-bills?student_id=STD_20240001
POST /api/room-allocations
PUT  /api/inventory-stock
GET  /api/health
```

The backend supports server-side pagination (`page`, `limit`), search (`search`), and column sorting (`sortCol`, `sortDir`) on all list endpoints.
