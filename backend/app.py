import json
import re
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse
from database import get_db, init_db

PORT = 5000

class RESTRequestHandler(BaseHTTPRequestHandler):

    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def _get_post_data(self):
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length > 0:
            body = self.rfile.read(content_length)
            return json.loads(body.decode("utf-8"))
        return {}

    def _respond_json(self, data, status=200):
        self._set_headers(status)
        self.wfile.write(json.dumps(data, default=str).encode("utf-8"))

    def _respond_error(self, message, status=400):
        self._set_headers(status)
        self.wfile.write(json.dumps({"error": message}).encode("utf-8"))

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        conn = get_db()
        cursor = conn.cursor()

        try:
            if path == "/api/health":
                self._respond_json({"status": "ok", "message": "Hostel Management System API operational"})

            # Hostels
            elif path == "/api/hostels":
                cursor.execute("""
                    SELECT h.*, w.FirstName || ' ' || w.LastName as WardenName
                    FROM HOSTEL h
                    LEFT JOIN WARDEN w ON h.WardenID = w.WardenID
                """)
                rows = [dict(r) for r in cursor.fetchall()]
                self._respond_json(rows)

            # Room Types
            elif path == "/api/room-types":
                cursor.execute("SELECT * FROM ROOM_TYPE")
                rows = [dict(r) for r in cursor.fetchall()]
                self._respond_json(rows)

            # Rooms
            elif path == "/api/rooms":
                hostel_id = query.get("hostel_id", [None])[0]
                sql = """
                    SELECT r.*, h.HostelName, rt.Capacity, rt.RoomRent
                    FROM ROOM r
                    JOIN HOSTEL h ON r.HostelID = h.HostelID
                    JOIN ROOM_TYPE rt ON r.Type = rt.Type
                """
                params = []
                if hostel_id and hostel_id != "ALL":
                    sql += " WHERE r.HostelID = ?"
                    params.append(hostel_id)
                sql += " ORDER BY r.HostelID, r.FloorNo, r.RoomNo"

                cursor.execute(sql, params)
                rows = [dict(r) for r in cursor.fetchall()]
                self._respond_json(rows)

            # Allocations
            elif path == "/api/allocations":
                room_no = query.get("room_no", [None])[0]
                sql = """
                    SELECT ra.*, s.FirstName || ' ' || s.LastName as StudentName, s.Email, s.Phone, s.Department
                    FROM ROOM_ALLOCATION ra
                    JOIN STUDENT s ON ra.StudentID = s.StudentID
                """
                params = []
                if room_no:
                    sql += " WHERE ra.RoomNo = ?"
                    params.append(room_no)
                sql += " ORDER BY ra.CheckInDate DESC"

                cursor.execute(sql, params)
                rows = [dict(r) for r in cursor.fetchall()]
                self._respond_json(rows)

            # Wardens
            elif path == "/api/wardens":
                cursor.execute("SELECT * FROM WARDEN")
                rows = [dict(r) for r in cursor.fetchall()]
                self._respond_json(rows)

            # Students
            elif path == "/api/students":
                cursor.execute("SELECT * FROM STUDENT ORDER BY StudentID")
                rows = [dict(r) for r in cursor.fetchall()]
                self._respond_json(rows)

            # Guardians
            elif path == "/api/guardians":
                student_id = query.get("student_id", [None])[0]
                if student_id:
                    cursor.execute("SELECT * FROM GUARDIAN WHERE StudentID = ?", (student_id,))
                else:
                    cursor.execute("SELECT * FROM GUARDIAN")
                rows = [dict(r) for r in cursor.fetchall()]
                self._respond_json(rows)

            # Staff
            elif path == "/api/staff":
                cursor.execute("SELECT * FROM STAFF ORDER BY Role, LastName")
                rows = [dict(r) for r in cursor.fetchall()]
                self._respond_json(rows)

            else:
                self._respond_error("Endpoint not found", 404)

        except Exception as e:
            self._respond_error(str(e), 500)
        finally:
            conn.close()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        data = self._get_post_data()

        conn = get_db()
        cursor = conn.cursor()

        try:
            if path == "/api/hostels":
                cursor.execute("""
                    INSERT INTO HOSTEL (HostelID, HostelName, HostelType, TotalFloors, TotalRooms, Location, WardenID)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (data["HostelID"], data["HostelName"], data["HostelType"],
                      int(data["TotalFloors"]), int(data["TotalRooms"]),
                      data.get("Location", ""), data.get("WardenID")))
                conn.commit()
                self._respond_json({"message": "Hostel created successfully"}, 201)

            elif path == "/api/room-types":
                cursor.execute("""
                    INSERT INTO ROOM_TYPE (Type, Capacity, RoomRent)
                    VALUES (?, ?, ?)
                """, (data["Type"], int(data["Capacity"]), float(data["RoomRent"])))
                conn.commit()
                self._respond_json({"message": "Room type created successfully"}, 201)

            elif path == "/api/rooms":
                cursor.execute("""
                    INSERT INTO ROOM (RoomNo, FloorNo, Status, Type, HostelID)
                    VALUES (?, ?, ?, ?, ?)
                """, (data["RoomNo"], int(data["FloorNo"]), data["Status"], data["Type"], data["HostelID"]))
                conn.commit()
                self._respond_json({"message": "Room created successfully"}, 201)

            elif path == "/api/allocations":
                cursor.execute("""
                    INSERT INTO ROOM_ALLOCATION (AllocationID, StudentID, RoomNo, AcademicYear, Semester, CheckInDate, CheckOutDate)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (data["AllocationID"], data["StudentID"], data["RoomNo"],
                      data["AcademicYear"], data["Semester"], data["CheckInDate"], data.get("CheckOutDate")))
                cursor.execute("UPDATE ROOM SET Status = 'Occupied' WHERE RoomNo = ?", (data["RoomNo"],))
                conn.commit()
                self._respond_json({"message": "Room allocated successfully"}, 201)

            elif path == "/api/students":
                cursor.execute("""
                    INSERT INTO STUDENT (StudentID, FirstName, LastName, Gender, DOB, Email, Phone, BloodGroup, Department, AdmissionDate, IsActive)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (data["StudentID"], data["FirstName"], data["LastName"], data.get("Gender"),
                      data.get("DOB"), data.get("Email"), data.get("Phone"), data.get("BloodGroup"),
                      data.get("Department"), data.get("AdmissionDate"), int(data.get("IsActive", 1))))
                conn.commit()
                self._respond_json({"message": "Student created successfully"}, 201)

            elif path == "/api/guardians":
                cursor.execute("""
                    INSERT INTO GUARDIAN (GuardianID, StudentID, GuardianName, Relationship, Phone, Email, Address)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (data["GuardianID"], data["StudentID"], data["GuardianName"], data["Relationship"],
                      data["Phone"], data.get("Email"), data.get("Address")))
                conn.commit()
                self._respond_json({"message": "Guardian added successfully"}, 201)

            elif path == "/api/wardens":
                cursor.execute("""
                    INSERT INTO WARDEN (WardenID, FirstName, LastName, Email, Phone, Designation, JoiningDate)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (data["WardenID"], data["FirstName"], data["LastName"], data.get("Email"),
                      data.get("Phone"), data.get("Designation"), data.get("JoiningDate")))
                conn.commit()
                self._respond_json({"message": "Warden created successfully"}, 201)

            elif path == "/api/staff":
                cursor.execute("""
                    INSERT INTO STAFF (StaffID, FirstName, LastName, Phone, JoinDate, Salary, Role, ShiftSlot, CuisineType, MessID, HostelID)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (data["StaffID"], data["FirstName"], data["LastName"], data["Phone"],
                      data["JoinDate"], float(data["Salary"]), data["Role"], data["ShiftSlot"],
                      data.get("CuisineType"), data.get("MessID"), data.get("HostelID")))
                conn.commit()
                self._respond_json({"message": "Staff member added successfully"}, 201)

            else:
                self._respond_error("Endpoint not found", 404)

        except Exception as e:
            self._respond_error(str(e), 500)
        finally:
            conn.close()

    def do_PUT(self):
        parsed = urlparse(self.path)
        path = parsed.path
        data = self._get_post_data()

        conn = get_db()
        cursor = conn.cursor()

        try:
            m_hostel = re.match(r"^/api/hostels/([^/]+)$", path)
            if m_hostel:
                cursor.execute("""
                    UPDATE HOSTEL
                    SET HostelName = ?, HostelType = ?, TotalFloors = ?, TotalRooms = ?, Location = ?, WardenID = ?
                    WHERE HostelID = ?
                """, (data["HostelName"], data["HostelType"], int(data["TotalFloors"]),
                      int(data["TotalRooms"]), data.get("Location", ""), data.get("WardenID"), m_hostel.group(1)))
                conn.commit()
                return self._respond_json({"message": "Hostel updated"})

            m_rtype = re.match(r"^/api/room-types/([^/]+)$", path)
            if m_rtype:
                cursor.execute("""
                    UPDATE ROOM_TYPE SET Capacity = ?, RoomRent = ? WHERE Type = ?
                """, (int(data["Capacity"]), float(data["RoomRent"]), m_rtype.group(1)))
                conn.commit()
                return self._respond_json({"message": "Room type updated"})

            m_room = re.match(r"^/api/rooms/([^/]+)$", path)
            if m_room:
                cursor.execute("""
                    UPDATE ROOM SET FloorNo = ?, Status = ?, Type = ?, HostelID = ? WHERE RoomNo = ?
                """, (int(data["FloorNo"]), data["Status"], data["Type"], data["HostelID"], m_room.group(1)))
                conn.commit()
                return self._respond_json({"message": "Room updated"})

            m_alloc = re.match(r"^/api/allocations/([^/]+)$", path)
            if m_alloc:
                cursor.execute("""
                    UPDATE ROOM_ALLOCATION SET CheckOutDate = ? WHERE AllocationID = ?
                """, (data.get("CheckOutDate"), m_alloc.group(1)))
                conn.commit()
                return self._respond_json({"message": "Allocation updated"})

            m_student = re.match(r"^/api/students/([^/]+)$", path)
            if m_student:
                cursor.execute("""
                    UPDATE STUDENT
                    SET FirstName = ?, LastName = ?, Gender = ?, DOB = ?, Email = ?, Phone = ?, BloodGroup = ?, Department = ?, IsActive = ?
                    WHERE StudentID = ?
                """, (data["FirstName"], data["LastName"], data.get("Gender"), data.get("DOB"),
                      data.get("Email"), data.get("Phone"), data.get("BloodGroup"), data.get("Department"),
                      int(data.get("IsActive", 1)), m_student.group(1)))
                conn.commit()
                return self._respond_json({"message": "Student updated"})

            m_warden = re.match(r"^/api/wardens/([^/]+)$", path)
            if m_warden:
                cursor.execute("""
                    UPDATE WARDEN
                    SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, Designation = ?
                    WHERE WardenID = ?
                """, (data["FirstName"], data["LastName"], data.get("Email"), data.get("Phone"),
                      data.get("Designation"), m_warden.group(1)))
                conn.commit()
                return self._respond_json({"message": "Warden updated"})

            m_staff = re.match(r"^/api/staff/([^/]+)$", path)
            if m_staff:
                cursor.execute("""
                    UPDATE STAFF
                    SET FirstName = ?, LastName = ?, Phone = ?, Salary = ?, Role = ?, ShiftSlot = ?, CuisineType = ?, MessID = ?, HostelID = ?
                    WHERE StaffID = ?
                """, (data["FirstName"], data["LastName"], data["Phone"], float(data["Salary"]),
                      data["Role"], data["ShiftSlot"], data.get("CuisineType"), data.get("MessID"),
                      data.get("HostelID"), m_staff.group(1)))
                conn.commit()
                return self._respond_json({"message": "Staff member updated"})

            self._respond_error("Endpoint not found", 404)

        except Exception as e:
            self._respond_error(str(e), 500)
        finally:
            conn.close()

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path

        conn = get_db()
        cursor = conn.cursor()

        try:
            m_hostel = re.match(r"^/api/hostels/([^/]+)$", path)
            if m_hostel:
                cursor.execute("DELETE FROM HOSTEL WHERE HostelID = ?", (m_hostel.group(1),))
                conn.commit()
                return self._respond_json({"message": "Hostel deleted"})

            m_rtype = re.match(r"^/api/room-types/([^/]+)$", path)
            if m_rtype:
                cursor.execute("DELETE FROM ROOM_TYPE WHERE Type = ?", (m_rtype.group(1),))
                conn.commit()
                return self._respond_json({"message": "Room type deleted"})

            m_room = re.match(r"^/api/rooms/([^/]+)$", path)
            if m_room:
                cursor.execute("DELETE FROM ROOM WHERE RoomNo = ?", (m_room.group(1),))
                conn.commit()
                return self._respond_json({"message": "Room deleted"})

            m_alloc = re.match(r"^/api/allocations/([^/]+)$", path)
            if m_alloc:
                cursor.execute("DELETE FROM ROOM_ALLOCATION WHERE AllocationID = ?", (m_alloc.group(1),))
                conn.commit()
                return self._respond_json({"message": "Allocation deleted"})

            m_student = re.match(r"^/api/students/([^/]+)$", path)
            if m_student:
                cursor.execute("DELETE FROM STUDENT WHERE StudentID = ?", (m_student.group(1),))
                conn.commit()
                return self._respond_json({"message": "Student deleted"})

            m_warden = re.match(r"^/api/wardens/([^/]+)$", path)
            if m_warden:
                cursor.execute("DELETE FROM WARDEN WHERE WardenID = ?", (m_warden.group(1),))
                conn.commit()
                return self._respond_json({"message": "Warden deleted"})

            m_staff = re.match(r"^/api/staff/([^/]+)$", path)
            if m_staff:
                cursor.execute("DELETE FROM STAFF WHERE StaffID = ?", (m_staff.group(1),))
                conn.commit()
                return self._respond_json({"message": "Staff member deleted"})

            self._respond_error("Endpoint not found", 404)

        except Exception as e:
            self._respond_error(str(e), 500)
        finally:
            conn.close()

def run_server():
    init_db()
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, RESTRequestHandler)
    print(f"Backend REST API running on http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down backend server.")

if __name__ == "__main__":
    run_server()
