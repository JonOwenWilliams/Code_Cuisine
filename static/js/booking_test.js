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
        // Checks to see if message is displayed
        let successMessage = document.getElementById("booking-message");

        if(!successMessage) {
            console.log("No Success Message Found In HTML")
        } else {
            console.log("Found successMessage element:", successMessage);
            console.log("successMessage.innerText BEFORE update:", successMessage.innerText);
        }

        if (successMessage && successMessage.innerText.includes("booked")) {
            console.log("Pass: Booking Success Message is Displayed");
        } else {
            console.log("Fail: No Booking Success Message is Displayed");
        }
    })
    .catch(error => console.error("Booking Test Failed", error))
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

        //Checks for successful cancel message
        let cancelMessage = document.getElementById("cancel-message");
        if (cancelMessage && cancelMessage.innerText.includes("Successfully Canceled")) {
            console.log("Pass: cancellation message is shown");
        } else {
            console.log("Fail: did not display any messsage");
        }
    })
    .catch(error => console.error("Cancellation Test Error:", error));
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