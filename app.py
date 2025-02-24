from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta


app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bookings.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    table = db.Column(db.Integer, nullable=False)
    guests = db.Column(db.Integer, nullable=False)
    datetime = db.Column(db.DateTime, nullable=False)


with app.app_context():
    db.create_all()


@app.route("/available_tables")
def available_tables():
    booked_tables = [b.table for b in Booking.query.all()]
    all_tables = list(range(1, 65))
    available = [t for t in all_tables if t not in booked_tables]
    return jsonify(available)


@app.route("/book", methods=["POST"])
def book_table():
    data = request.json
    booking_time = datetime.strptime(data["datetime"], "%Y-%m-%dT%H:%M")

    MAX_TABLES = 64
    MAX_PT = 6
    MAX_GUESTS = 225

    if not (1 <= int(data["table"]) <= MAX_TABLES):
        return jsonify({"message": "Invalid table number"}), 400

    if int(data["guests"]) > MAX_PT:
        return jsonify({
         "message": f"Table cannot seat more than {MAX_PT} guests"}), 400

    total_guests = db.session.query(db.func.sum(Booking.guests)).scalar() or 0
    if total_guests + int(data["guests"]) > MAX_GUESTS:
        return jsonify({"message": "Resturant is at full capacity!"}), 400

    exists = db.session.query(Booking.id).filter(
        Booking.table == data["table"],
        Booking.datetime.between(booking_time - timedelta(minutes=140),
                                 booking_time + timedelta(minutes=140))
    ).first()

    if exists:
        return jsonify({"message": "Table is already booked!"}), 400

    new_booking = Booking(
        name=data["name"],
        email=data["email"],
        phone=data["phone"],
        table=int(data["table"]),
        guests=int(data["guests"]),
        datetime=booking_time
    )

    db.session.add(new_booking)
    db.session.commit()

    return jsonify({"message": f"Table {data['table']} is booked!"})


@app.route("/cancel", methods=["POST"])
def cancel_booking():
    data = request.json

    print("cancellation request recived", data)

    booking = Booking.query.filter_by(
        table=int(data["table"]),
        name=data["name"],
        email=data["email"].lower(),
        phone=data["phone"]
    ).first()

    print("Booking Found", booking)

    if booking:
        db.session.delete(booking)
        db.session.commit()
        return jsonify({"message":
                        "Your booking has been successfully canceled!"})
    else:
        return jsonify({"message": "No matching booking found!"}), 404


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/menu")
def menu():
    return render_template("menu.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


if __name__ == "__main__":
    app.run(debug=True)
