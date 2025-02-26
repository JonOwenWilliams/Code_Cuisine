from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta


app = Flask(__name__)


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


with app.app_context():
    db.create_all()

# gets available tables


@app.route("/available_tables")
def available_tables():
    booked_tables = [b.table for b in Booking.query.all()]
    all_tables = list(range(1, 65))
    available = [t for t in all_tables if t not in booked_tables]
    return jsonify(available)

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
    data = request.json
    booking_date = datetime.strptime(data["date"], "%Y-%m-%d").date()
    booking_time = datetime.strptime(data["time"], "%H:%M").time()
    # Booking limits
    MAX_TABLES = 64
    MAX_PT = 6
    MAX_GUESTS = 225
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
        return jsonify({"message": "Table is already booked!"}), 400
    # Creates And Saves New Cusomer Bookings
    new_booking = Booking(
        name=data["name"],
        email=data["email"],
        phone=data["phone"],
        table=int(data["table"]),
        guests=int(data["guests"]),
        date=booking_date,
        time=booking_time
    )

    db.session.add(new_booking)
    db.session.commit()

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


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/menu")
def menu():
    return render_template("menu.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")

# Run The Flask App


if __name__ == "__main__":
    app.run(debug=True)
