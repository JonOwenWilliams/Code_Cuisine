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

// function to run all tests 
function runAllTests() {
    testAvailableTables();

    setTimeout(() => {
        testBooking();    
    }, 3000);

    setTimeout(() => {
        testCancellation();
    }, 6000);

}

document.addEventListener("DOMContentLoaded", runAllTests);