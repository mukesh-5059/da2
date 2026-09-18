from flask import request

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
    rows = [dict(r) for r in cursor.fetchall()]

    return {
        "data": rows,
        "totalRecords": total_records
    }
