/* =========================================
   D. MATAU SPA — WORKING WEBSITE JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    setupMobileNavigation();
    setupServices();
    setupAddOns();
    setupCalendar();
    setupBookingForm();
});


/* =========================================
   1. SETTINGS AND PRICES
   ========================================= */

const WHATSAPP_NUMBER = "27846558531";

const SERVICES = {
    deep: {
        name: "Deep Tissue Massage",
        price: 1000
    },

    swedish: {
        name: "Swedish massage",
        price: 800
    },

    aroma: {
        name: "Aromatherapy massage",
        price: 850
    },

    reflexology: {
        name: "Reflexology massage",
        price: 1200
    }
};

const HOT_STONES_PRICE = 150;
const FOOT_SCRUB_PRICE = 200;

const APPOINTMENT_TIMES = [
    "10:00 am",
    "10:30 am",
    "11:00 am",
    "11:30 am",
    "2:00 pm",
    "2:30 pm",
    "3:00 pm",
    "3:30 pm"
];

let selectedService = "";
let selectedDate = "";
let selectedTime = "";
let appointmentSelected = false;


/* =========================================
   2. MOBILE NAVIGATION
   ========================================= */

function setupMobileNavigation() {
    const menuButton = document.querySelector(".nav-toggle");
    const navigation = document.querySelector(".site-nav");

    if (!menuButton || !navigation) {
        return;
    }

    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("is-open");

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    });

    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navigation.classList.remove("is-open");

            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation");
        });
    });
}


/* =========================================
   3. SELECT A MASSAGE
   ========================================= */

function setupServices() {
    const serviceDropdown = document.getElementById("service");

    const serviceButtons = document.querySelectorAll(
        ".service-select"
    );

    if (serviceDropdown) {
        serviceDropdown.addEventListener("change", () => {
            chooseService(serviceDropdown.value);
        });
    }

    serviceButtons.forEach(button => {
        button.addEventListener("click", () => {
            const serviceKey = button.dataset.service;

            if (!SERVICES[serviceKey]) {
                alert("Please select a valid massage service.");
                return;
            }

            if (serviceDropdown) {
                serviceDropdown.value = serviceKey;
            }

            chooseService(serviceKey);

            // Bring the selected service and add-ons into view.
            const bookingForm = document.getElementById("booking-form");

            if (bookingForm) {
                bookingForm.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}


function chooseService(serviceKey) {
    const serviceDropdown = document.getElementById("service");

    if (!SERVICES[serviceKey]) {
        selectedService = "";

        if (serviceDropdown) {
            serviceDropdown.value = "";
        }
    } else {
        selectedService = serviceKey;
    }

    // Reset add-ons when the customer changes the massage.
    const hotStones = document.getElementById("hot-stones");
    const footScrub = document.getElementById("foot-scrub");

    if (hotStones) {
        hotStones.checked = false;
    }

    if (footScrub) {
        footScrub.checked = false;
    }

    // Highlight the selected massage card.
    document.querySelectorAll(".service-select").forEach(button => {
        const card = button.closest(".card");

        if (card) {
            card.classList.toggle(
                "selected",
                button.dataset.service === selectedService
            );
        }

        button.classList.toggle(
            "selected",
            button.dataset.service === selectedService
        );
    });

    updateAddOnAvailability();
    calculateTotal();
}


/* =========================================
   4. ADD-ONS
   ========================================= */

function setupAddOns() {
    const hotStones = document.getElementById("hot-stones");
    const footScrub = document.getElementById("foot-scrub");

    if (hotStones) {
        hotStones.addEventListener("change", () => {
            calculateTotal();
        });
    }

    if (footScrub) {
        footScrub.addEventListener("change", () => {
            calculateTotal();
        });
    }

    updateAddOnAvailability();
    calculateTotal();
}


function updateAddOnAvailability() {
    const hotStones = document.getElementById("hot-stones");
    const footScrub = document.getElementById("foot-scrub");

    const hotStonesAvailable =
        selectedService === "deep" ||
        selectedService === "swedish";

    const footScrubAvailable =
        selectedService === "swedish";

    if (hotStones) {
        hotStones.disabled = !hotStonesAvailable;

        if (!hotStonesAvailable) {
            hotStones.checked = false;
        }
    }

    if (footScrub) {
        footScrub.disabled = !footScrubAvailable;

        if (!footScrubAvailable) {
            footScrub.checked = false;
        }
    }
}


/* =========================================
   5. AUTOMATIC PRICE CALCULATION
   ========================================= */

function calculateTotal() {
    let total = 0;

    if (selectedService && SERVICES[selectedService]) {
        total = SERVICES[selectedService].price;
    }

    const hotStones = document.getElementById("hot-stones");
    const footScrub = document.getElementById("foot-scrub");

    if (hotStones && hotStones.checked) {
        total += HOT_STONES_PRICE;
    }

    if (footScrub && footScrub.checked) {
        total += FOOT_SCRUB_PRICE;
    }

    const totalDisplay = document.getElementById("booking-total");
    const totalHidden = document.getElementById("booking-total-value");

    if (totalDisplay) {
        totalDisplay.textContent =
            "R" + total.toLocaleString("en-ZA");
    }

    if (totalHidden) {
        totalHidden.value = total;
    }

    return total;
}


/* =========================================
   6. MONTHLY CALENDAR
   ========================================= */

function setupCalendar() {
    const calendarGrid = document.getElementById("calendar-grid");
    const monthHeading = document.getElementById("calendar-month");

    const previousButton = document.getElementById("previous-month");
    const nextButton = document.getElementById("next-month");

    const dateInput = document.getElementById("appointment-date");
    const timeInput = document.getElementById("appointment-time");

    const timeGrid = document.getElementById("time-grid");

    const selectButton = document.getElementById("select-appointment");
    const addButton = document.getElementById("add-appointment");

    if (
        !calendarGrid ||
        !monthHeading ||
        !previousButton ||
        !nextButton
    ) {
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let displayedYear = today.getFullYear();
    let displayedMonth = today.getMonth();

    renderCalendar();
    renderTimeSlots();
    updateAppointmentButtons();


    // Go to the previous month.
    previousButton.addEventListener("click", () => {
        displayedMonth--;

        if (displayedMonth < 0) {
            displayedMonth = 11;
            displayedYear--;
        }

        renderCalendar();
    });


    // Go to the next month.
    nextButton.addEventListener("click", () => {
        displayedMonth++;

        if (displayedMonth > 11) {
            displayedMonth = 0;
            displayedYear++;
        }

        renderCalendar();
    });


    function renderCalendar() {
        calendarGrid.innerHTML = "";

        monthHeading.textContent = new Date(
            displayedYear,
            displayedMonth,
            1
        ).toLocaleDateString("en-ZA", {
            month: "long",
            year: "numeric"
        });

        const firstDay = new Date(
            displayedYear,
            displayedMonth,
            1
        ).getDay();

        const daysInMonth = new Date(
            displayedYear,
            displayedMonth + 1,
            0
        ).getDate();

        const weekdayNames = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ];

        weekdayNames.forEach(day => {
            const heading = document.createElement("div");

            heading.className = "calendar-day-name";
            heading.textContent = day;

            calendarGrid.appendChild(heading);
        });

        // Blank cells before the first day.
        for (let i = 0; i < firstDay; i++) {
            const blank = document.createElement("div");

            blank.className = "calendar-empty";
            blank.setAttribute("aria-hidden", "true");

            calendarGrid.appendChild(blank);
        }

        // Display every day in the selected month.
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(
                displayedYear,
                displayedMonth,
                day
            );

            date.setHours(0, 0, 0, 0);

            const dateString = formatDate(date);

            const dayButton = document.createElement("button");

            dayButton.type = "button";
            dayButton.className = "calendar-date";
            dayButton.textContent = day;

            dayButton.setAttribute(
                "aria-pressed",
                String(dateString === selectedDate)
            );

            if (dateString === selectedDate) {
                dayButton.classList.add("selected");
            }

            // Customers cannot choose dates in the past.
            if (date < today) {
                dayButton.disabled = true;
            }

            dayButton.addEventListener("click", () => {
                if (date < today) {
                    return;
                }

                selectedDate = dateString;
                selectedTime = "";
                appointmentSelected = false;

                if (dateInput) {
                    dateInput.value = selectedDate;
                }

                if (timeInput) {
                    timeInput.value = "";
                }

                renderCalendar();
                renderTimeSlots();
                updateAppointmentButtons();
            });

            calendarGrid.appendChild(dayButton);
        }

        // Do not allow navigation to months before the current month.
        previousButton.disabled =
            displayedYear === today.getFullYear() &&
            displayedMonth <= today.getMonth();
    }


    function renderTimeSlots() {
        if (!timeGrid) {
            return;
        }

        timeGrid.innerHTML = "";

        if (!selectedDate) {
            const message = document.createElement("p");

            message.textContent = "Select a date first.";

            timeGrid.appendChild(message);

            return;
        }

        APPOINTMENT_TIMES.forEach(time => {
            const timeButton = document.createElement("button");

            timeButton.type = "button";
            timeButton.className = "time-option";
            timeButton.textContent = time;

            timeButton.setAttribute(
                "aria-pressed",
                String(time === selectedTime)
            );

            timeButton.addEventListener("click", () => {
                selectedTime = time;
                appointmentSelected = false;

                if (timeInput) {
                    timeInput.value = selectedTime;
                }

                renderTimeSlots();
                updateAppointmentButtons();
            });

            timeGrid.appendChild(timeButton);
        });
    }


    // Confirm the selected date and time.
    if (selectButton) {
        selectButton.addEventListener("click", () => {
            if (!selectedDate || !selectedTime) {
                alert("Please select a date and time first.");
                return;
            }

            appointmentSelected = true;

            updateAppointmentButtons();

            alert(
                "Selected appointment: " +
                selectedDate +
                " at " +
                selectedTime
            );
        });
    }


    // Add the selected appointment to the booking.
    if (addButton) {
        addButton.addEventListener("click", () => {
            if (!selectedDate || !selectedTime) {
                alert("Please select a date and time first.");
                return;
            }

            appointmentSelected = true;

            updateAppointmentButtons();

            let summary = document.getElementById(
                "appointment-summary"
            );

            if (!summary) {
                summary = document.createElement("p");
                summary.id = "appointment-summary";

                const calendar = document.querySelector(".calendar");

                if (calendar) {
                    calendar.appendChild(summary);
                }
            }

            if (summary) {
                summary.textContent =
                    "Selected appointment: " +
                    selectedDate +
                    " at " +
                    selectedTime;
            }
        });
    }


    function updateAppointmentButtons() {
        const ready = Boolean(selectedDate && selectedTime);

        if (selectButton) {
            selectButton.disabled = !ready;
        }

        if (addButton) {
            addButton.disabled = !ready;
        }
    }


    function formatDate(date) {
        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }
}


/* =========================================
   7. BOOKING FORM AND WHATSAPP
   ========================================= */

function setupBookingForm() {
    const form = document.getElementById("booking-form");

    if (!form) {
        return;
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (!selectedService || !SERVICES[selectedService]) {
            alert("Please select a massage.");
            return;
        }

        if (!selectedDate || !selectedTime) {
            alert("Please select an appointment date and time.");
            return;
        }

        if (!appointmentSelected) {
            alert(
                'Please press "Select" or "Add To Appointment" to confirm your appointment.'
            );
            return;
        }

        const firstName = document.getElementById("first-name").value.trim();
        const lastName = document.getElementById("last-name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();

        const clientConsent = document.getElementById("client-consent");
        const intakeConsent = document.getElementById("intake-consent");

        if (!firstName || !lastName || !phone || !email) {
            alert("Please complete all required booking information.");
            return;
        }

        if (!clientConsent.checked || !intakeConsent.checked) {
            alert("Please complete the required consent checkboxes.");
            return;
        }

        const hotStones = document.getElementById("hot-stones");
        const footScrub = document.getElementById("foot-scrub");

        const addOns = [];

        if (hotStones && hotStones.checked) {
            addOns.push("Hot stones (+R150)");
        }

        if (footScrub && footScrub.checked) {
            addOns.push("Foot scrubbing (+R200)");
        }

        if (selectedService === "reflexology") {
            addOns.push("Feet scrub included");
        }

        const total = calculateTotal();

        const message = [
            "D. Matau Spa — Booking Request",
            "",
            "First name: " + firstName,
            "Last name: " + lastName,
            "Phone: " + phone,
            "Email: " + email,
            "",
            "Massage: " + SERVICES[selectedService].name,
            "Massage price: R" +
                SERVICES[selectedService].price.toLocaleString("en-ZA"),
            "Add-ons: " + (addOns.length ? addOns.join(", ") : "None"),
            "Total: R" + total.toLocaleString("en-ZA"),
            "",
            "Appointment date: " + selectedDate,
            "Appointment time: " + selectedTime,
            "Time zone: SAST",
            "",
            "Please confirm appointment availability."
        ].join("\n");

        const whatsappURL =
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            encodeURIComponent(message);

        window.location.href = whatsappURL;
    });
}
