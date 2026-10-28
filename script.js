document.addEventListener("DOMContentLoaded", function () {
    setupMobileMenu();
    setupMassageSelection();
    setupAddOns();
    setupCalendar();
    setupBookingForm();
});

/* ==================================
   1. SPA SETTINGS
================================== */

const WHATSAPP_NUMBER = "27846558531";

const SERVICES = {
    deep: { name: "Deep Tissue Massage", price: 1000 },
    swedish: { name: "Swedish Massage", price: 800 },
    aroma: { name: "Aromatherapy Massage", price: 850 },
    reflexology: { name: "Reflexology Massage", price: 1200 }
};

const ADD_ON_PRICES = {
    "hot-stones": 150,
    "foot-scrub": 200
};

let selectedService = "";
let selectedDate = "";
let selectedTime = "";


/* ==================================
   2. MOBILE NAVIGATION
================================== */

function setupMobileMenu() {
    const menuButton = document.querySelector(".nav-toggle");
    const navigation = document.querySelector(".site-nav");

    if (!menuButton || !navigation) return;

    menuButton.addEventListener("click", function () {
        const isOpen = navigation.classList.toggle("is-open");

        menuButton.setAttribute("aria-expanded", isOpen);
    });

    navigation.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navigation.classList.remove("is-open");
            menuButton.setAttribute("aria-expanded", "false");
        });
    });
}


/* ==================================
   3. MASSAGE SELECTION
================================== */

function setupMassageSelection() {
    const serviceSelect = document.getElementById("service");

    if (serviceSelect) {
        serviceSelect.addEventListener("change", function () {
            selectedService = serviceSelect.value;
            resetAddOns();
            updateAddOnAvailability();
            calculateTotal();
        });
    }

    document.querySelectorAll(".service-select").forEach(function (button) {
        button.addEventListener("click", function () {
            const service = button.dataset.service;

            if (!SERVICES[service]) {
                alert("Please select a valid massage.");
                return;
            }

            selectedService = service;

            if (serviceSelect) {
                serviceSelect.value = service;
            }

            resetAddOns();
            updateAddOnAvailability();
            calculateTotal();

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


/* ==================================
   4. ADD-ON SELECTION
================================== */

function setupAddOns() {
    ["hot-stones", "foot-scrub"].forEach(function (id) {
        const checkbox = document.getElementById(id);

        if (checkbox) {
            checkbox.addEventListener("change", calculateTotal);
        }
    });

    updateAddOnAvailability();
    calculateTotal();
}

function resetAddOns() {
    ["hot-stones", "foot-scrub"].forEach(function (id) {
        const checkbox = document.getElementById(id);

        if (checkbox) {
            checkbox.checked = false;
        }
    });
}

function updateAddOnAvailability() {
    const hotStones = document.getElementById("hot-stones");
    const footScrub = document.getElementById("foot-scrub");

    if (hotStones) {
        hotStones.disabled = !["deep", "swedish"].includes(selectedService);

        if (hotStones.disabled) {
            hotStones.checked = false;
        }
    }

    if (footScrub) {
        footScrub.disabled = selectedService !== "swedish";

        if (footScrub.disabled) {
            footScrub.checked = false;
        }
    }
}


/* ==================================
   5. AUTOMATIC PRICE CALCULATOR
================================== */

function calculateTotal() {
    let total = 0;

    if (SERVICES[selectedService]) {
        total = SERVICES[selectedService].price;
    }

    const hotStones = document.getElementById("hot-stones");
    const footScrub = document.getElementById("foot-scrub");

    if (hotStones && hotStones.checked) {
        total += ADD_ON_PRICES["hot-stones"];
    }

    if (footScrub && footScrub.checked) {
        total += ADD_ON_PRICES["foot-scrub"];
    }

    const totalDisplay = document.getElementById("booking-total");

    if (totalDisplay) {
        totalDisplay.textContent = "R" + total.toLocaleString("en-ZA");
    }

    const hiddenTotal = document.getElementById("booking-total-value");

    if (hiddenTotal) {
        hiddenTotal.value = total;
    }

    return total;
}


/* ==================================
   6. MONTHLY CALENDAR
================================== */

function setupCalendar() {
    const calendar = document.getElementById("calendar-grid");
    const monthHeading = document.getElementById("calendar-month");
    const previous = document.getElementById("previous-month");
    const next = document.getElementById("next-month");
    const dateInput = document.getElementById("appointment-date");
    const timeInput = document.getElementById("appointment-time");
    const timeGrid = document.getElementById("time-grid");

    if (!calendar || !monthHeading || !previous || !next) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let year = today.getFullYear();
    let month = today.getMonth();

    const times = [
        "10:00 am", "10:30 am",
        "11:00 am", "11:30 am",
        "2:00 pm", "2:30 pm",
        "3:00 pm", "3:30 pm"
    ];

    function formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");

        return `${y}-${m}-${d}`;
    }

    function renderCalendar() {
        calendar.innerHTML = "";

        monthHeading.textContent = new Date(year, month, 1)
            .toLocaleDateString("en-ZA", {
                month: "long",
                year: "numeric"
            });

        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        weekdays.forEach(function (day) {
            const heading = document.createElement("div");
            heading.textContent = day;
            heading.className = "calendar-day-name";
            calendar.appendChild(heading);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const blank = document.createElement("div");
            blank.className = "calendar-empty";
            calendar.appendChild(blank);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            date.setHours(0, 0, 0, 0);

            const button = document.createElement("button");
            button.type = "button";
            button.textContent = day;
            button.className = "calendar-date";

            if (date < today) {
                button.disabled = true;
            }

            if (formatDate(date) === selectedDate) {
                button.classList.add("selected");
            }

            button.addEventListener("click", function () {
                if (date < today) return;

                selectedDate = formatDate(date);
                selectedTime = "";

                if (dateInput) dateInput.value = selectedDate;
                if (timeInput) timeInput.value = "";

                renderCalendar();
                renderTimes();
            });

            calendar.appendChild(button);
        }

        previous.disabled =
            year === today.getFullYear() && month <= today.getMonth();
    }

    function renderTimes() {
        if (!timeGrid) return;

        timeGrid.innerHTML = "";

        if (!selectedDate) {
            timeGrid.textContent = "Select a date first.";
            return;
        }

        times.forEach(function (time) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "time-option";
            button.textContent = time;

            if (time === selectedTime) {
                button.classList.add("selected");
            }

            button.addEventListener("click", function () {
                selectedTime = time;

                if (timeInput) {
                    timeInput.value = selectedTime;
                }

                renderTimes();
            });

            timeGrid.appendChild(button);
        });
    }

    previous.addEventListener("click", function () {
        month--;

        if (month < 0) {
            month = 11;
            year--;
        }

        renderCalendar();
    });

    next.addEventListener("click", function () {
        month++;

        if (month > 11) {
            month = 0;
            year++;
        }

        renderCalendar();
    });

    renderCalendar();
    renderTimes();
}


/* ==================================
   7. BOOKING FORM AND WHATSAPP
================================== */

function setupBookingForm() {
    const form = document.getElementById("booking-form");

    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!SERVICES[selectedService]) {
            alert("Please select a massage.");
            return;
        }

        if (!selectedDate || !selectedTime) {
            alert("Please select an appointment date and time.");
            return;
        }

        const firstName = document.getElementById("first-name")?.value.trim() || "";
        const lastName = document.getElementById("last-name")?.value.trim() || "";
        const phone = document.getElementById("phone")?.value.trim() || "";
        const email = document.getElementById("email")?.value.trim() || "";

        if (!firstName || !lastName || !phone || !email) {
            alert("Please complete all required information.");
            return;
        }

        const consent = document.getElementById("client-consent");

        if (consent && !consent.checked) {
            alert("Please accept the client consent.");
            return;
        }

        const hotStones = document.getElementById("hot-stones");
        const footScrub = document.getElementById("foot-scrub");

        const addOns = [];

        if (hotStones?.checked) addOns.push("Hot stones (+R150)");
        if (footScrub?.checked) addOns.push("Foot scrubbing (+R200)");

        if (selectedService === "reflexology") {
            addOns.push("Feet scrub included");
        }

        const message = [
            "D. Matau Spa — Booking Request",
            "",
            `Name: ${firstName} ${lastName}`,
            `Phone: ${phone}`,
            `Email: ${email}`,
            `Massage: ${SERVICES[selectedService].name}`,
            `Add-ons: ${addOns.join(", ") || "None"}`,
            `Total: R${calculateTotal().toLocaleString("en-ZA")}`,
            `Date: ${selectedDate}`,
            `Time: ${selectedTime}`,
            "",
            "Please confirm availability."
        ].join("\n");

        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        window.location.href = whatsappURL;
    });
}
// Mobile hamburger menu
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".site-nav");

  if (!menuButton || !navigation) return;

  menuButton.addEventListener("click", function () {
    const isOpen = navigation.classList.toggle("is-open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );

    menuButton.textContent = isOpen ? "×" : "☰";
  });

  navigation.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      menuButton.textContent = "☰";
    });
  });
});
