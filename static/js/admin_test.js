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

// function to run all tests

function runAllTests () {

    testAdminLogin();

    setTimeout(() => { }, 2000)
}

document.addEventListener("DOMContentLoaded", runAllTests);
