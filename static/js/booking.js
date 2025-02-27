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

    dateInput.addEventListener("change", fetchAvailableTimes);
    tableDropdown.addEventListener("change", fetchAvailableTimes);
    timeDropdown.addEventListener("change", fetchAvailableTimes);
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
        times.forEach(time => {
                    let option = document.createElement("option");
        option.value = time;
        option.textContent = time;
        timeDropdown.appendChild(option);
        });

        if (times.length === 0) {
            timeDropdown.innerHTML = '<option value="">No Available Times</option>';
        }
    })
    .catch(error => console.error("Error Fetching Available Times:", error));
}


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

//    document.querySelectorAll(".form-section").forEach(section => section.style.display = "none");
//    document.getElementById(sectionId).style.display = "block";

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
        console.error("One or more elements are missing from the form.");
        return;
    }

    console.log("Submitting Booking Data:", bookingData)
    fetch('/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    })
    .then(response => response.json())
    .then(data => {
        let successMessage = document.getElementById("booking-message");
        if (successMessage) {
            successMessage.innerText = data.message || "Booking Successful!";
            successMessage.style.color = "green";
            successMessage.style.display = "block";
            successMessage.style.visibility = "visible";
            successMessage.style.opacity = "1";
        } else {
            console.error("Error: Booking-message element not found in html")
        }            



        document.getElementById("booking-form").reset();
        fetchAvailableTables();
        showSection("form-part-1");
    })
    .catch(error => {
        console.error("Error submitting Booking:", error);
        let errorMessage = document.getElementById("booking-message");
        errorMessage.innerText = "An error occurred while processing your booking.";
        errorMessage.style.color = "red";
    });
}
// displays only cancellation form
function showCancellationForm() {
    document.getElementById("booking-form").style.display = "none";
    document.getElementById("cancellation-section").style.display = "block";
}

function showBookingForm() {
    document.getElementById("booking-form").style.display = "block";
    document.getElementById("cancellation-section").style.display = "none";
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

        if (cancelMessage) {
            cancelMessage.innerText = data.message || "Cancellation Successfull!";
            cancelMessage.style.color = data.message.includes("successfully") ? "green" : "red";
            cancelMessage.style.display = "block"            
        } else {
            console.error("Error: cancle message element not found in html")
        }

        fetchAvailableTables();
        document.getElementById("cancel-form").reset();
        showSection("form-part-1");
    })

    .catch(error => {
        console.error("Error submitting cancellation:", error);
        let errorMessage = document.getElementById("cancel-message");
        errorMessage.innerText = "an error occured while processing your cancellation.";
        errorMessage.style.color = "red";
    });
}