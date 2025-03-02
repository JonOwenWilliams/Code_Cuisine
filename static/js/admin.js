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
    })

}