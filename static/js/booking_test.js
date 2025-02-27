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

}

document.addEventListener("DOMContentLoaded", runAllTests);