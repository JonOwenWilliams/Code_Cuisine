import unittest
from app import app, db, Booking

# Testing The Booking System


class BookingTest(unittest.TestCase):
    # Set Up For Test And Clears DB Befor Each Test
    def setUp(self):
        self.app = app.test_client()
        with app.app_context():
            db.create_all()
            db.session.query(Booking).delete()
            db.session.commit()
    # Cleans Up After Each Test

    def tearDown(self):
        with app.app_context():
            db.session.query(Booking).delete()
            db.session.commit()
    # Testing Successfull Bookings

    def test_successful_booking(self):
        response = self.app.post('/book', json={
            "name": "Test",
            "email": "test@test.com",
            "phone": "123456789",
            "table": 6,
            "guests": 4,
            "date": "2025-02-10",
            "time": "19:00"
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("Table 6 is booked!", response.get_json()["message"])
    # Testing For Double Bookings

    def test_double_booking_prevention(self):

        first_booking = self.app.post('/book', json={
            "name": "Test 1",
            "email": "Test1@Test.com",
            "phone": "123456789",
            "table": 10,
            "guests": 3,
            "date": "2025-02-10",
            "time": "19:00"
        })
        self.assertEqual(first_booking.status_code, 200)
        print("First Booking Reponse:", first_booking.get_json())

        double_booking = self.app.post('/book', json={
            "name": "Test 2",
            "email": "Test2@Test.com",
            "phone": "987654321",
            "table": 10,
            "guests": 3,
            "date": "2025-02-10",
            "time": "19:15"
        })
        print("Double Booking Reponse:", double_booking.get_json())

        self.assertEqual(double_booking.status_code, 400)
        self.assertIn("Table is already booked!",
                      double_booking.get_json()["message"])
    # Testing for Table Limts

    def test_table_limit(self):

        response = self.app.post('/book', json={
            "name": "Test 3",
            "email": "Test3@Test.com",
            "phone": "112233445",
            "table": 65,
            "guests": 4,
            "date": "2025-02-25",
            "time": "10:30"
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid table number",
                      response.get_json()["message"])
    # Testing Guest Capacity

    def test_guest_capacity_limit(self):

        for i in range(45):
            self.app.post('/book', json={
                "name": f"Guest{i}",
                "email": f"Guest{i}@Test.com",
                "phone": f"12345{i}",
                "table": i+1,
                "guests": 5,
                "date": "2025-02-11",
                "time": "19:30"
            })

        response = self.app.post('/book', json={
            "name": "Overflow Test",
            "email": "Overflow@Test.com",
            "phone": "112233445",
            "table": 11,
            "guests": 6,
            "date": "2025-02-10",
            "time": "20:30"
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn("Resturant is at full capacity!",
                      response.get_json()["message"])
    # Testing Successfull Cancellation

    def test_sucessfull_cancellation(self):

        self.test_successful_booking()

        response = self.app.post('/cancel', json={
            "name": "Test",
            "email": "test@test.com",
            "phone": "123456789",
            "table": 6
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("successfully canceled",
                      response.get_json()["message"])
    # Testing Invalid Cancellations

    def test_invalid_cancellation(self):

        response = self.app.post('/cancel', json={
            "name": "false test",
            "email": "fake@test.com",
            "phone": "432156789",
            "table": 3
        })
        self.assertEqual(response.status_code, 404)
        self.assertIn("No matching booking found!",
                      response.get_json()["message"])
    # Testing invalid booking time

    def test_invalid_booking_times(self):
        response = self.app.post('/book', json={
            "name": "Late Night",
            "email": "latenight@test.com",
            "phone": "999999999",
            "table": 2,
            "guests": 2,
            "date": "2025-02-15",
            "time": "23:00"
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid Time! Opening Times Are From 10:00 till 22:00",
                      response.get_json()["message"])
# testing available tables

    def test_available_table(self):
        response = self.app.get('/available_tables?date=2025-02-15')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.get_json(), list)
# testing available times

    def test_available_times(self):
        response = self.app.get('/available_times?table=5&date=2025-02-15')
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.get_json(), list)


if __name__ == '__main__':
    unittest.main()
