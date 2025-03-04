// Runs when the Booking.html is loaded
document.addEventListener("DOMContentLoaded", function () {
    fetchAvailableTables();
    setupTimeSelection();
});
//setting up time selection

function setupTimeSelection() {
    let dateInput = document.getElementById("booking-date");
    let tableDropdown = document.getElementById("table");
    let timeDropdown = document.getElementById("booking-time");

    let now = new Date();
    let today = now.toISOString().split("T")[0];
    dateInput.setAttribute("min",today);
    
    dateInput.addEventListener("change", fetchAvailableTimes);
    tableDropdown.addEventListener("change", fetchAvailableTimes);
    timeDropdown.addEventListener("change", fetchAvailableTimes);

    dateInput.addEventListener("change", function() {
        let selectedDate = new Date(this.value);
        if (selectedDate.toDateString() === now.toDateString()) {
            let hours = now.getHours().toString().padStart(2, '0');
            let minutes = now.getMinutes().toString().padStart(2, '0');
            timeDropdown.setAttribute("min", `${hours}:${minutes}`);
        } else {
            timeDropdown.removeAttribute("min");
        }
    });
}

function fetchAvailableTimes() {
    let table = document.getElementById("table").value;
    let date = document.getElementById("booking-date").value;
    let timeDropdown = document.getElementById("booking-time");

    if (!table || !date) return;

    fetch(`/available_times?table=${table}&date=${date}`)
    .then(response => response.json())
    .then(times => {
        timeDropdown.innerHTML = '<option value="">Select a Time</option>';

        if (!Array.isArray(times)) {
            console.error("Backend Error:", times.error || "Unexpected error");
            return;
        }

        if (times.length === 0) {
            timeDropdown.innerHTML = '<option value="">No Avaiable Times</option>';
            return;
        }

        times.forEach(time => {
            let option = document.createElement("option");
        option.value = timeSlot.time;
        option.textContent = `${timeSlot.time} (Remaining Slots: ${timeSlot.remaining_slots})`;

        if (timeSlot.remaining_slots <= 0) {
            option.disabled = true
        }

        timeDropdown.appendChild(option);
        });

        if (times.length === 0) {
            timeDropdown.innerHTML = '<option value="">No Available Times</option>';
        }
    })
    .catch(error => console.error("Error Fetching Available Times:", error));
}
// adds an event listener for when people select date and times

function setupEventListeners() {
    let dateInput = document.getElementById("booking-date");
    let tableDropdown = document.getElementById("table")

    if (dateInput) {
        dateInput.addEventListener("change", fetchAvailableTables);
    }

    if (tableDropdown) {
        tableDropdown.addEventListener("change", fetchAvailableTimes);
    }
}


// Fetches available tables from app.py and displays them in the drop down in the form

function fetchAvailableTables() {
    let dateInputElement = document.getElementById("booking-date").value.trim();
    if (!dateInputElement) return;   
    
    console.log(`Date Selected: ${dateInput}`);

    fetch(`/available_tables?date=${dateInput}`)
        .then(response => response.json())
        .then(data => {
            let tableDropdown = document.getElementById("table");
            tableDropdown.innerHTML = '<option value="">Select a Table</option>';

            if (!Array.isArray(data)) {
                console.error("Backend Error:",data.error || "unexpected error");
                return;
            }

            if (data.length === 0) {
                tableDropdown.innerHTML = '<option value="">No Tables Available</option>';
                return;
            }
            data.forEach(table => {
                let option = document.createElement("option");
                option.value = table.table_id;
                option.textContent = `Table ${table.table_id} (${table.remaining_slots} slots left)`;
                tableDropdown.appendChild(option);
            });
            console.log("Tables Update");
        })
        .catch(error => console.error("Error Fetching Available Tables:", error));
}

// Handles The Navigation between the forms
function showSection(sectionId) {
    document.querySelectorAll(".form-section").forEach(section => {
        section.style.display = "none";
        section.classList.remove("active");
    });

    let activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add("active");
        activeSection.style.display = "flex";
        activeSection.style.flexDirection = "column";
        activeSection.style.alignItems = "center";
        activeSection.style.justifyContent = "center";
    }

    if (sectionId !== "form-part-1") {
        let successMessage = document.getElementById("booking-message");
        let cancelMessage = document.getElementById("cancel-message")

        if (successMessage) successMessage.style.display = "none";
        if (cancelMessage) cancelMessage.style.display = "none";        
    }

}

// creates and displays a popup notification
function showPopup(message, type) {
    console.log(`showPopup() called with message: "${message}" and type: "${type}"`)
    let popup = document.createElement("div");
    popup.innerText = message;
    popup.className = `popup-message ${type}`;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = "0"
        setTimeout(() => {
            popup.remove();
        }, 500);
    }, 3000);
}


// Checks That All Fields Are Filled Before Going Next
function goToNextSection(currentSection, nextSection) {
    let inputs = document.querySelectorAll(`#${currentSection} input, #${currentSection} select`);
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add("error");
        } else {
            input.classList.remove("error");
        }
    });

    if (isValid) {
        showSection(nextSection);
    } else {
        alert("Please fill in all required fields before proceeding.");
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
        date: document.getElementById("booking-date").value,
        time: document.getElementById("booking-time").value
    }


    if (!bookingData.name || !bookingData.email || !bookingData.phone || 
        !bookingData.table || !bookingData.guests || !bookingData.date || !bookingData.time) {
        alert("One or more elements are missing from the form.");
        return;
    }

    fetch('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error ||data.message.includes("Invalid") || data.message.includes("already booked")) {
            showPopup(`Error: ${data.message}`, "error");
        } else {
            showPopup(`Table ${bookingData.table} booked for ${bookingData.date} at ${bookingData.time}`, "success");
            document.getElementById("booking-form").reset();
            fetchAvailableTables();
        }
    })
    .catch(error => {
        console.error("Booking failed:", error);
        showPopup("An error occured while processing your booking.", "error");
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("admin-login-btn").addEventListener("click", function () {
        window.location.href = "/admin";
    });
});

// displays only cancellation form
function showCancellationForm() {
    document.getElementById("booking-form").style.display = "none";
    document.getElementById("cancellation-section").style.display = "block";
}

function showBookingForm() {
    document.getElementById("booking-form").style.display = "block";
    document.getElementById("cancellation-section").style.display = "none";
    document.getElementById("admin-login-btn").style.display = "block";
    document.getElementById("admin-login-btn-cancel").style.display = "none";
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
        if (data.error || data.message.includes("No matching Booking")) {
            showPopup(`Error: ${data.message}`, "error");
        } else {
            showPopup("Booking cancelled successfully!", "success");
        }
    })

    .catch(error => {
        console.error("Cancellation Failed:", error);
        showPopup("An Error occured while processing you cancellation.", "error")
    });
}