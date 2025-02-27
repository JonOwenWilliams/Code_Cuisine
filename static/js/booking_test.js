// First Test is to check if available tables is correctly fetched and displayed
function testAvailableTables() {
    console.log(" Testing for Available Tables...");

    fetch('/available_tables')
        .then(response => response.json())
        .then(data => {
            console.log("Available Tables Test:", data);
            if (data.length === 0) {
                console.log("pass: No tables available when all are booked");
            } else {
                console.log("pass: Only unbooked tables show up on dropdown");
            }
        })
        .catch(error => console.error("Error in Availble Tables Test", error));
}

// Second Test : testing if submission works and displays its message
function testBooking() {
    console.log("Testing Booking System...")

    let testBookingData = {
        name: "Test Test",
        email: "test@test.com",
        phone: "123567890",
        table: 1,
        guests: "2",
        date: "2025-02-10",
        time: "17:30"
    };

    fetch('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testBookingData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Booking Test Results:", data);

        if (data.message && data.message.includes("booked")) {
            console.log(`Pass: Booking confirmed for Table ${testBookingData.table} on ${testBookingData.date} at ${testBookingData.time}`);
        } else {
            console.log("Fail: No Booking confirmation received.");
        }
    })
    .catch(error => console.error("Booking Test Failed", error));
}

function testCancellation() {
    console.log("Testing Cancellation...");

    let cancelData = {
        name: "Test Test",
        email: "test@test.com",
        phone: "123567890",
        table: 1
    };

    fetch('/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(cancelData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Cancellation Test Results:", data);

        if (data.message && data.message.includes("successfully canceled")) {
            console.log("Pass: Booking successfully cancled");
        } else {
            console.log("Fail: No cancellation confirmation recived.");
        }
    })
    .catch(error => console.error("Error: Cancellation Test Error:", error));
}

// A test for double bookings

function testDoubleBooking() {
    console.log("Testing Double Booking Prevention...")

    let testBookingData = {
        name: "Test Test",
        email: "test@test.com",
        phone: "123567890",
        table: 1,
        guests: "2",
        date: "2025-02-10",
        time: "17:30"
    }

    fetch('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testBookingData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Pass: First booking test results:", data);

        if (data.message && data.message.includes("booked")) {
            console.log("Pass: First Booking was successful")

            fetch('/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testBookingData)
            })
            .then(response => {
                if (!response.ok) {
                    console.log("Pass: Double booking prevented as expected");
                    return response.json();
                }
                return response.json();
            })
            .then(data => {
                console.log("Double Booking Test Results:", data);

                if (data.message && data.message.includes("already booked")) {
                    console.log("Pass: Double Booking Prevention System worked!")
                } else {
                    console.log("Fail: Double booking was allowed")
                }
            })
            .catch(error => console.error("Error: Double Booking Failed"));
        } else {
            console.log("Fail: First Booking did not succeed")
        }
    })
    .catch(error => console.error("Error: First booking test failed"))
}

// testing for invalid time

function testBookingWithInvalidtime() {
    console.log("Testing Booking Submission With Invalid Time....")

    let testBookingData = {
        name: "Test Test",
        email: "test@test.com",
        phone: "123567890",
        table: 1,
        guests: "2",
        date: "2025-02-10",
        time: "03:00"
    };

    fetch('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testBookingData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                console.log("Booking With Invalid Time Results:", data);

                if (data.message && data.message.includes("Invalid Time!")) {
                    console.log("Pass: Booking With an Invalid Time Was Prevented");
                } else {
                    console.log("Fail: Expected Time Restriction Message:", data.message);
                }
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("booking With Invalid Time Test Results:", data);

        if (data.message && data.message.includes("Invalid time")) {
            console.log("PAss: Booking With An Invalid Time Was Rejected");
        } else {
            console.log("Fail: Booking Was Allowed Despite Invalid Time!")
        }
    })
    .catch(error => console.warn("Expected Rejection Due To Invalid Time"));
}
// Testing Invalid Email

function testBookingWithInvalidEmail() {
    console.log("Testing Booking Submission with Invalid Email...")

    let testBookingData = {
        name: "Test Test",
        email: "Invalid Email",
        phone: "123567890",
        table: 1,
        guests: "2",
        date: "2025-02-10",
        time: "11:00"
    };

    fetch('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testBookingData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                console.log("Booking With Invalid Email Test Results:", data);

                if (data.message && data.message.includes("Invalid Email Format!")) {
                    console.log("Pass: Booking With An Invalid Email Was Prevented.");
                } else {
                    console.log("Fail: Expected Invalid Email Response got:", data.message);
                }
                throw new Error("Expected faliure due to invalid email.")
            });
        }
        return response.json();
    })
    .then (data => {
        console.log("Fail: Booking Was Allowed Despite Invalid Email!", data);
    })
    .catch(error => {
        if (error.message === "Expected faliure due to invalid email."){
            // I want this to do nothing
        } else {
            console.warn("Unexpected error i email test:", error.message);
        }
    });
}
// function to run all tests 
function runAllTests() {
    testAvailableTables();

    setTimeout(() => {
        testBooking();    
    }, 2000);

    setTimeout(() => {
        testCancellation();
    }, 4000);

    setTimeout(() => {
        testDoubleBooking();
    }, 6000);

    setTimeout(() => {
        testCancellation();
    }, 8000);

    setTimeout(() => {
        testBookingWithInvalidtime()
    }, 10000);

    setTimeout(() => {
        testBookingWithInvalidEmail();
    }, 12000);

}

document.addEventListener("DOMContentLoaded", runAllTests);