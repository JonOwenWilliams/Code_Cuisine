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
        table: "1",
        guests: "2",
        datetime: "2025-02-15T19:00"
    };

    fetch('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testBookingData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Booking Test Results:", data);
        // Checks to see if message is displayed
        let successMessage = document.getElementById("booking-message");

        if(!successMessage) {
            console.log("No Success Message Found In HTML")
        }

        if (successMessage && successMessage.innerText.includes("booked")) {
            console.log("Pass: Booking Success Message is Displayed");
        } else {
            console.log("Fail: No Booking Success Message is Displayed");
        }
    })
    .catch(error => console.error("Booking Test Failed", error))
}

// function to run all tests 
function runAllTests() {
    testAvailableTables();
    testBooking()
}

document.addEventListener("DOMContentLoaded", runAllTests);