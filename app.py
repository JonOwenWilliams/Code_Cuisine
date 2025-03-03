import os
from flask import Flask, render_template, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from dotenv import load_dotenv
import re

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bookings.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# SQL table layout


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    table = db.Column(db.Integer, nullable=False)
    guests = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(20), default="pending")


with app.app_context():
    db.create_all()

# gets available tables


@app.route("/available_tables")
def available_tables():
    try:
        booked_tables = [b.table for b in Booking.query.all()]
        all_tables = list(range(1, 65))
        available = [t for t in all_tables if t not in booked_tables]
        return jsonify(available)
    except Exception as e:
        print(f"Error in available_tables(): {e}")
        return jsonify({"Error": "Server error fetching available tables"}),
        500

# gets availbe times


@app.route("/available_times")
def available_times():
    table = request.args.get("table", type=int)
    date = request.args.get("date")

    if not table or not date:
        return jsonify({"error": "Missing table or date"}), 400

    selected_date = datetime.strptime(date, "%Y-%m-%d").date()

    all_times = [datetime.strptime(
        f"{hour}:00", "%H:%M").time() for hour in range(10, 22)]

    booked_times = [b.time for b in Booking.query.filter_by(
        table=table, date=selected_date).all()]

    available_times = [t.strftime(
        "%H:%M") for t in all_times if t not in booked_times]

    return jsonify(available_times)


# Book a table


@app.route("/book", methods=["POST"])
def book_table():
    print("Raw Request Data:", request.data)
    data = request.get_json()
    print("Parsed JSON data:", data)
    if not data:
        return jsonify({"error": "invalid JSON format"}), 400

    required_fields = ["name", "email", "phone", "table", "guests", "date",
                       "time"]
    for field in required_fields:
        if field not in data or not data[field]:
            print(f"missing required field: {field}")
            return jsonify({"error": f"Missing required field: {field}"}), 400

    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, data["email"]):
        print("Invalid Email Format!")
        return jsonify({"message":
                        "Invalid Email Format! Please Use Valid Email address."
                        }), 400

    try:
        booking_date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        booking_time = datetime.strptime(data["time"], "%H:%M").time()
    except ValueError:
        print("invalid date or time format")
        return jsonify({"error": "Invalid date or time format"}), 400

    # Booking limits
    MAX_TABLES = 64
    MAX_PT = 6
    MAX_GUESTS = 225
    # opening and closing times
    opening_time = datetime.strptime("10:00", "%H:%M").time()
    closing_time = datetime.strptime("22:00", "%H:%M").time()
    # Validates Booking Time
    if not (opening_time <= booking_time <= closing_time):
        print("Invalid booking time")
        return jsonify({"message":
                        "Invalid Time! Opening Times Are From 10:00 till 22:00"
                        }), 400
    # Validates Table Numbers
    if not (1 <= int(data["table"]) <= MAX_TABLES):
        return jsonify({"message": "Invalid table number"}), 400
    # Validates Max Guests Per Table
    if int(data["guests"]) > MAX_PT:
        return jsonify({
         "message": f"Table cannot seat more than {MAX_PT} guests"}), 400
    # Checks For Full Capacity
    total_guests = db.session.query(db.func.sum(Booking.guests)).scalar() or 0
    if total_guests + int(data["guests"]) > MAX_GUESTS:
        return jsonify({"message": "Resturant is at full capacity!"}), 400
    # Checks If Tables Are Already Booked

    booking_datetime = datetime.combine(booking_date, booking_time)

    exists = db.session.query(Booking.id).filter(
        Booking.table == data["table"],
        Booking.date == booking_date,
        Booking.time.between(
            (booking_datetime - timedelta(minutes=30)).time(),
            (booking_datetime + timedelta(minutes=30)).time()
        )
    ).first()

    if exists:
        print("table already booked")
        return jsonify({"message": "Table is already booked!"}), 400
    # Creates And Saves New Cusomer Bookings
    new_booking = Booking(
        name=data["name"],
        email=data["email"],
        phone=data["phone"],
        table=int(data["table"]),
        guests=int(data["guests"]),
        date=booking_date,
        time=booking_time,
        status="Pending"
    )

    db.session.add(new_booking)
    db.session.commit()

    print("booking successful!")
    return jsonify({"message": f"Table {data['table']} is booked!"})

# Cancel Booking


@app.route("/cancel", methods=["POST"])
def cancel_booking():
    data = request.json

    # Search For Bookings
    booking = Booking.query.filter_by(
        table=int(data["table"]),
        name=data["name"],
        email=data["email"].lower(),
        phone=data["phone"]
    ).first()

    if booking:
        db.session.delete(booking)
        db.session.commit()
        return jsonify({"message":
                        "Your booking has been successfully canceled!"})
    else:
        return jsonify({"message": "No matching booking found!"}), 404

# Routes For Rendering All Pages

# ---------------------------------------------------admin login


@app.route("/admin_login", methods=["POST"])
def admin_login():
    data = request.get_json()
    if (data["username"] == ADMIN_USERNAME and
            data["password"] == ADMIN_PASSWORD):
        session["admin_logged_in"] = True
        return jsonify({"success": True})
    return jsonify({"success": False}), 401

# ---------------------------------------------------fetch booking for admin


@app.route("/api/bookings")
def get_bookings():
    date_filter = request.args.get("date")

    if date_filter:
        try:
            selected_date = datetime.strptime(date_filter, "%Y-%m-%d").date()
            bookings = Booking.query.filter_by(date=selected_date).all()
        except ValueError:
            return jsonify({"error": "Invalid date format"}), 400
    else:
        bookings = Booking.query.all()

    if not bookings:
        return jsonify([])

    return jsonify([
        {
            "id": b.id,
            "name": b.name,
            "phone": b.phone,
            "table": b.table,
            "time": b.time.strftime("%H:%M"),
            "status": b.status
        } for b in bookings
    ])

# ---------------------------------------------------update booking for admin


@app.route("/update_booking/<int:id>", methods=["POST"])
def update_booking(id):
    data = request.get_json()
    booking = Booking.query.get(id)
    if booking:
        booking.status = data["status"]
        db.session.commit()
        return jsonify({"message": "Booking updated successfully"})
    return jsonify({"message": "Booking not found"}), 404

# ---------------------------------------------------admin logout


@app.route("/admin_logout")
def admin_logout():
    session.pop("admin_logged_in", None)
    return jsonify({"success": True})

# ---------------------------------------------------admin cancel


@app.route("/admin_cancel/<int:id>", methods=["DELETE"])
def admin_cancel_booking(id):
    booking = Booking.query.get(id)
    if booking:
        db.session.delete(booking)
        db.session.commit()
        return jsonify({
            "message": f"Booking for table {booking.table} has been removed."})
    return jsonify({"message": "Booking not found."})


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/menu")
def menu():
    return render_template("menu.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


@app.route("/admin")
def admin_page():
    return render_template("admin.html")


# Error Handlers
@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad Request"}), 400


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource Not Found"}), 404


@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal Server Error"}), 500

# Run The Flask App


if __name__ == "__main__":
    app.run(debug=True)
