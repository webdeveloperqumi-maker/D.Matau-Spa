/* ==========================================
   D. MATAU SPA — COMPLETE JAVASCRIPT
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    setupMobileNavigation();
    setupCalendar();
    setupBookingForm();
    setupServiceSelection();
});


/* ==========================================
   1. SPA DETAILS AND PRICES
   ========================================== */

const WHATSAPP_NUMBER = "27846558531";

const SERVICES = {
    "Deep Tissue Massage": {
        price: 1000,
        duration: "60 minutes"
    },

    "Swedish Massage": {
        price: 800,
        duration: "60 minutes"
    },

    "Aromatherapy Massage": {
        price: 850,
        duration: "60 minutes"
    },

    "Reflexology Massage": {
        price: 1200,
        duration: "60 minutes"
    }
};

const ADD_ONS = {
    "Hot Stones": 150,
    "Foot Scrubbing": 200
};

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
let selectedAddOns = [];
let selectedDate = "";
let selectedTime = "";
let appointmentSelected = false;


/* ==========================================
   2. MOBILE NAVIGATION
   ========================================== */

function setupMobileNavigation() {
    const menuButton = document.querySelector(
        "#menu-toggle, .menu-toggle, .nav-toggle"
    );

    const navigation = document.querySelector(
        "#nav-links, .nav-links, .navigation-links"
    );

    if (!menuButton || !navigation) {
        return;
    }

    menuButton.addEventListener("click", () => {
        navigation.classList.toggle("active");

        const isExpanded =
            navigation.classList.contains("active");

        menuButton.setAttribute(
            "aria-expanded",
            String(isExpanded)
        );
    });

    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navigation.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
        });
    });
}


/* ==========================================
   3. SERVICE SELECTION
   ========================================== */

function setupServiceSelection() {
    const serviceButtons = document.querySelectorAll(
        "[data-service], .service-select, .select-service"
    );

    serviceButtons.forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();

            let serviceName =
                button.dataset.service ||
                button.closest("[data-service]")?.dataset.service ||
                button.dataset.name ||
                "";

            if (!serviceName) {
                const card = button.closest(
                    ".service-card, .service-item, .service"
                );

                if (card) {
                    const heading = card.querySelector(
                        "h2, h3, h4, .service-title"
                    );

                    if (heading) {
                        serviceName = heading.textContent.trim();
                    }
                }
            }

            serviceName = findServiceName(serviceName);

            if (!serviceName) {
                alert("Please select a valid massage service.");
                return;
            }

            selectedService = serviceName;
            selectedAddOns = [];
            appointmentSelected = false;

            document.querySelectorAll(
                ".service-card, .service-item, .service"
            ).forEach(card => {
                card.classList.remove("selected");
            });

            const selectedCard = button.closest(
                ".service-card, .service-item, .service"
            );

            if (selectedCard) {
                selectedCard.classList.add("selected");
            }

            document.querySelectorAll(
                "[data-service], .service-select, .select-service"
            ).forEach(otherButton => {
                otherButton.classList.remove("selected");

                if (otherButton === button) {
                    otherButton.classList.add("selected");
                }
            });

            updateServiceDisplay();
            updatePriceDisplay();
            updateAddOnAvailability();
        });
    });

    setupAddOnSelection();
}


function findServiceName(name) {
    const normalisedName = name
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

    return Object.keys(SERVICES).find(service => {
        return service.toLowerCase() === normalisedName;
    }) || Object.keys(SERVICES).find(service => {
        return normalisedName.includes(service.toLowerCase());
    }) || null;
}


function updateServiceDisplay() {
    const serviceDisplay = document.querySelector(
        "#selected-service, [data-selected-service]"
    );

    if (serviceDisplay) {
        serviceDisplay.textContent = selectedService || "";
    }

    const serviceInput = document.querySelector(
        "#service, #massage-service, input[name='service']"
    );

    if (serviceInput) {
        serviceInput.value = selectedService;
    }
}


/* ==========================================
   4. ADD-ONS AND PRICES
   ========================================== */

function setupAddOnSelection() {
    const addOnInputs = document.querySelectorAll(
        "[data-addon], input[name='addons'], input[name='add-ons']"
    );

    addOnInputs.forEach(input => {
        input.addEventListener("change", () => {
            const addOnName =
                input.dataset.addon ||
                input.value ||
                "";

            if (!selectedService) {
                input.checked = false;

                alert("Please select a massage service first.");
                return;
            }

            if (!isAddOnAvailable(addOnName)) {
                input.checked = false;

                alert(
                    "This add-on is not available for the selected massage."
                );

                return;
            }

            if (input.checked) {
                if (!selectedAddOns.includes(addOnName)) {
                    selectedAddOns.push(addOnName);
                }
            } else {
                selectedAddOns = selectedAddOns.filter(
                    item => item !== addOnName
                );
            }

            appointmentSelected = false;

            updatePriceDisplay();
        });
    });
}


function isAddOnAvailable(addOnName) {
    const name = addOnName.toLowerCase();

    if (name.includes("hot")) {
        return (
            selectedService === "Deep Tissue Massage" ||
            selectedService === "Swedish Massage"
        );
    }

    if (name.includes("foot")) {
        return selectedService === "Swedish Massage";
    }

    return false;
}


function updateAddOnAvailability() {
    const addOnInputs = document.querySelectorAll(
        "[data-addon], input[name='addons'], input[name='add-ons']"
    );

    addOnInputs.forEach(input => {
        const addOnName =
            input.dataset.addon ||
            input.value ||
            "";

        const available = isAddOnAvailable(addOnName);

        input.disabled = !available;

        if (!available) {
            input.checked = false;

            selectedAddOns = selectedAddOns.filter(
                item => item !== addOnName
            );
        }
    });

    const hotStones = document.querySelector(
        "#hot-stones, input[value='Hot Stones']"
    );

    const footScrubbing = document.querySelector(
        "#foot-scrubbing, input[value='Foot Scrubbing']"
    );

    if (hotStones) {
        hotStones.disabled = !(
            selectedService === "Deep Tissue Massage" ||
            selectedService === "Swedish Massage"
        );
    }

    if (footScrubbing) {
        footScrubbing.disabled =
            selectedService !== "Swedish Massage";
    }
}


function calculateTotal() {
    if (!selectedService || !SERVICES[selectedService]) {
        return 0;
    }

    let total = SERVICES[selectedService].price;

    selectedAddOns.forEach(addOn => {
        if (ADD_ONS[addOn]) {
            total += ADD_ONS[addOn];
        }
    });

    return total;
}


function updatePriceDisplay() {
    const priceDisplay = document.querySelector(
        "#total-price, #service-price, [data-total-price]"
    );

    if (priceDisplay) {
        priceDisplay.textContent =
            "R" + calculateTotal().toLocaleString("en-ZA");
    }

    const basePriceDisplay = document.querySelector(
        "#base-price, [data-base-price]"
    );

    if (basePriceDisplay && selectedService) {
        basePriceDisplay.textContent =
            "R" +
            SERVICES[selectedService].price.toLocaleString("en-ZA");
    }
}


/* ==========================================
   5. FULL MONTHLY CALENDAR
   ========================================== */

function setupCalendar() {
    const calendarGrid = document.getElementById("calendar-grid");
    const monthHeading = document.getElementById("calendar-month");

    const previousButton = document.getElementById("previous-month");
    const nextButton = document.getElementById("next-month");

    const dateInput = document.getElementById("appointment-date");
    const timeGrid = document.getElementById("time-grid");
    const timeInput = document.getElementById("appointment-time");

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

    // Display the full current month.
    renderCalendar();

    previousButton.addEventListener("click", () => {
        displayedMonth--;

        if (displayedMonth < 0) {
            displayedMonth = 11;
            displayedYear--;
        }

        renderCalendar();
    });

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

        monthHeading.textContent = new Date(
            displayedYear,
            displayedMonth,
            1
        ).toLocaleDateString("en-ZA", {
            month: "long",
            year: "numeric"
        });

        previousButton.disabled =
            displayedYear === today.getFullYear() &&
            displayedMonth <= today.getMonth();

        const weekdayNames = [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
        ];

        weekdayNames.forEach(day => {
            const heading = document.createElement("div");

            heading.className = "calendar-day-name";
            heading.textContent = day;

            calendarGrid.appendChild(heading);
        });

        // Empty spaces before the first day of the month.
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement("div");

            emptyCell.className = "calendar-empty";
            emptyCell.setAttribute("aria-hidden", "true");

            calendarGrid.appendChild(emptyCell);
        }

        // Create every date in the month.
        for (let day = 1; day <= daysInMonth; day++) {
            const dateButton = document.createElement("button");

            dateButton.type = "button";
            dateButton.className = "calendar-date";
            dateButton.textContent = day;

            const date = new Date(
                displayedYear,
                displayedMonth,
                day
            );

            date.setHours(0, 0, 0, 0);

            const dateString = formatDate(date);

            dateButton.dataset.date = dateString;

            if (date < today) {
                dateButton.disabled = true;
                dateButton.classList.add("past-date");
            }

            if (dateString === selectedDate) {
                dateButton.classList.add("selected");
            }

            dateButton.addEventListener("click", () => {
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

            calendarGrid.appendChild(dateButton);
        }

        updateAppointmentButtons();
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
            timeButton.className = "time-slot";
            timeButton.textContent = time;

            timeButton.setAttribute(
                "aria-pressed",
                String(time === selectedTime)
            );

            if (time === selectedTime) {
                timeButton.classList.add("selected");
            }

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


    if (selectButton) {
        selectButton.addEventListener("click", () => {
            if (!selectedDate || !selectedTime) {
                alert("Please select both a date and a time.");
                return;
            }

            appointmentSelected = true;

            updateAppointmentButtons();

            alert(
                "Appointment selected: " +
                selectedDate +
                " at " +
                selectedTime
            );
        });
    }


    if (addButton) {
        addButton.addEventListener("click", () => {
            if (!selectedDate || !selectedTime) {
                alert("Please select both a date and a time.");
                return;
            }

            appointmentSelected = true;

            updateAppointmentButtons();

            const appointmentSummary = document.getElementById(
                "appointment-summary"
            );

            if (appointmentSummary) {
                appointmentSummary.textContent =
                    "Selected appointment: " +
                    selectedDate +
                    " at " +
                    selectedTime;
            } else {
                alert(
                    "Appointment selected: " +
                    selectedDate +
                    " at " +
                    selectedTime
                );
            }
        });
    }


    function updateAppointmentButtons() {
        const hasSelection = Boolean(selectedDate && selectedTime);

        if (selectButton) {
            selectButton.disabled = !hasSelection;
        }

        if (addButton) {
            addButton.disabled = !hasSelection;
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

    // Make the date formatter available to the rest of the script.
    window.formatSpaDate = formatDate;
}


/* ==========================================
   6. BOOKING FORM AND WHATSAPP
   ========================================== */

function setupBookingForm() {
    const bookingForm = document.querySelector(
        "#booking-form, #appointment-form, form[data-booking-form]"
    );

    if (!bookingForm) {
        return;
    }

    bookingForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!selectedService) {
            alert("Please select a massage service.");
            return;
        }

        if (!selectedDate || !selectedTime) {
            alert("Please select an appointment date and time.");
            return;
        }

        if (!appointmentSelected) {
            alert(
                'Please press "Select" or "Add To Appointment" to confirm your appointment time.'
            );

            return;
        }

        const firstName = getInputValue([
            "#first-name",
            "#firstName",
            "input[name='firstName']",
            "input[name='first_name']"
        ]);

        const lastName = getInputValue([
            "#last-name",
            "#lastName",
            "input[name='lastName']",
            "input[name='last_name']"
        ]);

        const phone = getInputValue([
            "#phone",
            "#phone-number",
            "input[name='phone']"
        ]);

        const email = getInputValue([
            "#email",
            "input[name='email']"
        ]);

        if (!firstName || !lastName || !phone || !email) {
            alert(
                "Please complete your first name, last name, phone number and email."
            );

            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const consentCheckbox = document.querySelector(
            "#client-consent, #consent, input[name='consent']"
        );

        if (consentCheckbox && !consentCheckbox.checked) {
            alert("Please accept the client consent before continuing.");
            consentCheckbox.focus();

            return;
        }

        const total = calculateTotal();

        const messageLines = [
            "D. Matau Spa — Booking Request",
            "",
            "Client: " + firstName + " " + lastName,
            "Phone: " + phone,
            "Email: " + email,
            "",
            "Massage: " + selectedService,
            "Duration: " + SERVICES[selectedService].duration,
            "Price: R" + SERVICES[selectedService].price
                .toLocaleString("en-ZA"),
            "Add-ons: " +
                (
                    selectedAddOns.length
                        ? selectedAddOns.join(", ")
                        : "None"
                ),
            "Total: R" + total.toLocaleString("en-ZA"),
            "",
            "Appointment date: " + selectedDate,
            "Appointment time: " + selectedTime,
            "Time zone: SAST (South African Standard Time)",
            "",
            "This is a booking request. Please confirm availability."
        ];

        const whatsappMessage = encodeURIComponent(
            messageLines.join("\n")
        );

        const whatsappURL =
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            whatsappMessage;

        window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
}


function getInputValue(selectors) {
    for (const selector of selectors) {
        const input = document.querySelector(selector);

        if (input) {
            return input.value.trim();
        }
    }

    return "";
}


/* ==========================================
   7. WHATSAPP BUTTONS
   ========================================== */

function openSpaWhatsApp(message = "Hello, D. Matau Spa. I would like to enquire about a massage appointment.") {
    const url =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);

    window.open(url, "_blank", "noopener,noreferrer");
}


document.querySelectorAll(
    ".whatsapp-button, #whatsapp-button, [data-whatsapp]"
).forEach(button => {
    button.addEventListener("click", event => {
        event.preventDefault();

        openSpaWhatsApp();
    });
});


/* ==========================================
   8. TIKTOK LINK
   ========================================== */

document.querySelectorAll(
    ".tiktok-button, #tiktok-button, [data-tiktok]"
).forEach(button => {
    button.addEventListener("click", event => {
        event.preventDefault();

        window.open(
            "https://www.tiktok.com/@d.mataumobilespa",
            "_blank",
            "noopener,noreferrer"
        );
    });
});


/* ==========================================
   9. FOOTER YEAR, IF PRESENT
   ========================================== */

const yearElement = document.getElementById("current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
