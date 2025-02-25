// Runs when the Booking.html is loaded
document.addEventListener("DOMContentLoaded", function () {
    fetchAvailableTables();
    setupNavigation();
});

// Fetches available tables from app.py and displays them in the drop down in the form
function fetchAvailableTables() {
    fetch('/available_tables')
        .then(response => response.json())
        .then(data => {
            let tableDropdown = document.getElementById("table");
            tableDropdown.innerHTML = '<option value="">Select a Table</option>';

            if (data.length === 0) {
                tableDropdown.innerHTML = '<option value="">No Tables Available</option>';
            } else {
                data.forEach(table => {
                    let option = document.createElement("option");
                    option.value = table;
                    option.textContent = `Table ${table}`;
                    tableDropdown.appendChild(option);
                });
            }
        })
        .catch(error => console.error("Error Fetching Available Tables:", error));
}

// Handles The Navigation between the forms
function showSection(sectionId) {
    document.querySelectorAll(".form-section").forEach(section => section.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");
}

// Checks That All Fields Are Filled Before Going Next
function goToNextSection(currentSection, nextSection) {
    let inputs = document.querySelectorAll(`#${currentSection} input`);
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add("error");
        } else {
            input.classList.remove("error");
        }
    })

    if (isValid) {
        showSection(nextSection);
    } else {
        alert("Please fill in all the required fields before proceeding");
    }
}

// Sends Booking Request To Back-end
function validateAndSubmit() {
    let bookingData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        table: document.getElementById("table").value,
        guests: document.getElementById("guests").value,
        datetime: document.getElementById("datetime").value
    };

    // Checks If All Fields Are Filled
    if (!bookingData.name || !bookingData.email || !bookingData.phone || 
        !bookingData.table || !bookingData.guests || !bookingData.datetime) {
            alert("Please complete all fields before submitting.");
            return;
    }

    fetch ('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    })

    .then(response => response.json())
    .then(data => {
        //Displays Successfull Message
        let successMessage = document.getElementById("booking-message");
        successMessage.innerText = data.message;
        successMessage.style.color = "green";

        // Resets Form After A Successfull Booking Request
        document.getElementById("booking-form").reset();
        fetchAvailableTables();
        showSection("form-part-1");
    })

    // Displays An Error Message When Something Doesnt Work
    .catch(error => {
        console.error("Error submitting Booking:", error);
        let errorMessage = document.getElementById("booking-message");
        errorMessage.innerText = "An error occured while processing your booking."
        errorMessage.style.color = "red"
    })
}

function cancelBooking() {
    let cancelData = {
        name: document.getElementById("cancel-name").value,
        email: document.getElementById("cancel-email").value,
        phone: document.getElementById("cancel-phone").value,
        table: document.getElementById("cancel-table").value
    };

    fetch('/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cancelData)
        })
    .then(response => response.json())
    .then(data => {
        let cancelMessage = document.getElementById("cancel-message");
        cancelMessage.innerText = data.message;
        cancelMessage.style.color = data.message.includes("successfully") ? "green" : "red";

        fetchAvailableTables();
        document.getElementById("cancel-form").reset();
    })
    .catch(error => {
        console.error("Error submitting cancellation:", error);
        let errorMessage = document.getElementById("cancel-message");
        errorMessage.innerText = "an error occured while processing your cancellation.";
        errorMessage.style.color = "red";
    });
}