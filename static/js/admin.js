// runs when admin page is loaded
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("admin-login-submit").addEventListener("click", loginAdmin);
    document.getElementById("logout-btn").addEventListener("click", logoutAdmin);
})

//shows admin login panel
function showAdminLogin() {
    document.getElementById("admin-login-section").style.display = "block";
    document.getElementById("admin-dashboard").style.display = "none";
}

//admin login
function loginAdmin() {
    let username = document.getElementById("admin-username").value;
    let password = document.getElementById("admin-password").value;

    fetch('/admin_login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("admin-login-section").style.display = "none";
            document.getElementById("admin-dashboard").style.display = "block";
            fetchAdminBookings();
        } else {
            alert("Invalid login credentials");
        }
    })
    .catch(error => {
        console.error("Admin Login Error:", error);
    });
}

// fetching bookings for admin dashboard
function fetchAdminBookings() {
    fetch("/api/bookings")
    .then(response => response.json())
    .then(bookings => {
        let tableBody = document.getElementById("admin-booking-list");
        tableBody.innerHTML = "";

        if (bookings.length === 0) {
            console.log("No Booking found");
            tableBody.innerHTML = "<tr><td colspan='6'>No Bookings Available.</td></tr>"
        }
        bookings.forEach(booking => {
            let row = `<tr id="booking-row-${booking.id}">
                            <td>${booking.table}</td>
                            <td>${booking.name}</td>
                            <td>${booking.phone}</td>
                            <td>${booking.time}</td>
                            <td id="status-${booking.id}">${booking.status}</td>
                            <td>
                                <button onclick="updateBooking(${booking.id}, 'Arrived')" class="btn btn-outline-success">Arrived</button>
                                <button onclick="adminCancelBooking(${booking.id}, 'Canceled')" class="btn btn-outline-danger">Cancel</button>
                                <button onclick="updateBooking(${booking.id}, 'Left')" class="btn btn-outline-warning">Left</button>
                            </td>
                        </tr>`;
            tableBody.innerHTML += row;
        });
        console.log("Admin bookings collected")
    })
    .catch(error => {
        console.error("Error fetching bookings:", error);
    })
}

// cancle bookings from admin dashboard
function adminCancelBooking(id) {
    if (!confirm("Are you sure you want to delete this booking")) return;

    fetch(`/admin_cancel/${id}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        let rowElement = document.getElementById(`booking-row-${id}`);
        if (rowElement) {
            rowElement.remove();
        } else {
            console.warn(`Row with ID booking-row-${id} not found.`)
            fetchAdminBookings();
        }
    })
    .catch(error => {
        console.error("Error removing booking:", error);
    });
}

// changes booking status

function updateBooking(id, status) {
    fetch(`/update_booking/${id}`, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById(`status-${id}`).textContent = status;
    });
}

// logout feature

function logoutAdmin() {
    document.getElementById("admin-dashboard").style.display = "none";
    document.getElementById("admin-login-section").style.display = " block";
}