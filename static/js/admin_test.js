// Test incorrect admin loggins
function testAdminLogin() {
    console.log("Testing admin login...");

    let testCredentials = {username: "admin", password: "wrongpassword"};

    fetch('/admin_login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(testCredentials)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Fail: Admin login allowed incorrect login")
        } else {
            console.log("Pass: Admin login correctly rejected invalid credentials.")
        }
    })
    .catch(error => console.error("Error testing admin login", error));
}
// test for fetching admin bookings
function testFetchAdminBookings() {
    console.log("Test Fetch Admin Bookings...");

    fetch('/api/bookings')
    .then(response => response.json())
    .then(bookings => {
        if (!Array.isArray(bookings)) {
            console.log("Fail: API did not return an array");
        } else if (bookings.length === 0){
            console.log("Pass: No bookings exist");
        } else {
            console.log(`Pass: ${bookings.length} bookings retrieved`);
        }
    })
    .catch(error => console.error("Error testing FetchAdminBookings", error));
}
// Testing admin date selector
function testAdminDateSelector() {
    console.log("Testing admin date selector...");

    let testDate = "2025-03-10";
    document.getElementById("admin-booking-date").value = testDate;
    fetchAdminBookings();

    setTimeout(() => {
        let tableRows = document.querySelectorAll("#admin-booking-list tr");
        if (tableRows.length > 0) {
            console.log("Pass: date selection updates bookings");
        } else {
            console.log("Fail: No bookings loaded after date selection")
        }
    }, 2000);
}

// function to run all tests

function runAllTests () {

    testAdminLogin();

    setTimeout(() => {testFetchAdminBookings();}, 2000)

    setTimeout(() => {testAdminDateSelector();}, 4000)

}

document.addEventListener("DOMContentLoaded", runAllTests);
