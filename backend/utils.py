from flask import request
import re

# PostgreSQL folds unquoted column names to lowercase.
# This set contains all word segments that appear in our schema column names.
# e.g. "messname" → "MessName", "currentquantity" → "CurrentQuantity"
_PASCAL_SEGMENTS = sorted([
    'student', 'warden', 'hostel', 'room', 'type', 'mess', 'staff', 'supplier',
    'inventory', 'item', 'guardian', 'allocation', 'meal', 'bill', 'monthly',
    'payment', 'transaction', 'visitor', 'attendance', 'log', 'leave', 'request',
    'schedule', 'enrollment', 'complaint', 'procurement', 'notice', 'event',
    'id', 'name', 'first', 'last', 'gender', 'email', 'phone', 'date', 'status',
    'address', 'amount', 'balance', 'due', 'paid', 'total', 'unit', 'price',
    'cost', 'quantity', 'current', 'last', 'updated', 'joining', 'admission',
    'blood', 'group', 'department', 'designation', 'floor', 'number', 'count',
    'capacity', 'category', 'description', 'day', 'time', 'in', 'out', 'purpose',
    'type', 'reason', 'role', 'approved', 'processed', 'partial', 'overdue',
    'active', 'is', 'dob', 'message', 'subject', 'posted', 'resolved',
    'purchase', 'method', 'created', 'by', 'per', 'month', 'year', 'fee',
    'rent', 'other', 'charge', 'late', 'penalty', 'level', 'mode',
], key=len, reverse=True)  # longest segments first so greedy match works


def _restore_pascal_case(row_dict: dict) -> dict:
    """Convert psycopg2's lowercase column keys back to PascalCase.

    Only operates on pure-lowercase keys (psycopg2 output). Keys that already
    contain uppercase (sqlite3 mode) pass through unchanged.
    """
    result = {}
    for key, val in row_dict.items():
        if key == key.lower() and key != key.upper():
            result[_pascal_key(key)] = val
        else:
            result[key] = val
    return result


def _pascal_key(key: str) -> str:
    """Greedily decompose a lowercase compound word into PascalCase segments."""
    remaining = key
    parts = []
    while remaining:
        matched = False
        for seg in _PASCAL_SEGMENTS:
            if remaining.startswith(seg):
                parts.append(seg.capitalize())
                remaining = remaining[len(seg):]
                matched = True
                break
        if not matched:
            # Fallback: capitalize whatever is left
            parts.append(remaining.capitalize())
            break
    return ''.join(parts)


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
