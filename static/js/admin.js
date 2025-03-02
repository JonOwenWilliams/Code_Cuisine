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