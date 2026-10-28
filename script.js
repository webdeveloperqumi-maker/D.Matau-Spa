"use strict";

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

  function closeMenu() {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.textContent = "☰";
  }

  menuButton.addEventListener("click", function () {
    const isOpen = !navigation.classList.contains("is-open");

    navigation.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
    menuButton.textContent = isOpen ? "×" : "☰";
  });

  navigation.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
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

      if (serviceSelect) serviceSelect.value = service;

      resetAddOns();
      updateAddOnAvailability();
      calculateTotal();

      const form = document.getElementById("booking-form");

      if (form) {
        form.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}

/* ==================================
   4. ADD-ONS
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

    if (checkbox) checkbox.checked = false;
  });
}

function updateAddOnAvailability() {
  const hotStones = document.getElementById("hot-stones");
  const footScrub = document.getElementById("foot-scrub");

  if (hotStones) {
    hotStones.disabled = !["deep", "swedish"].includes(selectedService);

    if (hotStones.disabled) hotStones.checked = false;
  }

  if (footScrub) {
    footScrub.disabled = selectedService !== "swedish";

    if (footScrub.disabled) footScrub.checked = false;
  }
}

/* ==================================
   5. PRICE CALCULATOR
================================== */

function calculateTotal() {
  let total = SERVICES[selectedService]?.price || 0;

  const hotStones = document.getElementById("hot-stones");
  const footScrub = document.getElementById("foot-scrub");

  if (hotStones?.checked && !hotStones.disabled) {
    total += ADD_ON_PRICES["hot-stones"];
  }

  if (footScrub?.checked && !footScrub.disabled) {
    total += ADD_ON_PRICES["foot-scrub"];
  }

  const totalDisplay = document.getElementById("booking-total");
  const hiddenTotal = document.getElementById("booking-total-value");

  if (totalDisplay) {
    totalDisplay.textContent = formatMoney(total);
  }

  if (hiddenTotal) hiddenTotal.value = String(total);

  return total;
}

function formatMoney(amount) {
  return "R" + Number(amount).toLocaleString("en-ZA");
}

/* ==================================
   6. APPOINTMENT CALENDAR
================================== */

function setupCalendar() {
  const calendar = document.getElementById("calendar-grid");
  const monthHeading = document.getElementById("calendar-month");
  const previous = document.getElementById("previous-month");
  const next = document.getElementById("next-month");
  const dateInput = document.getElementById("appointment-date");
  const timeInput = document.getElementById("appointment-time");
  const timeGrid = document.getElementById("time-grid");
  const selectButton = document.getElementById("select-appointment");
  const addButton = document.getElementById("add-appointment");

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

    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      .forEach(function (day) {
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

      const dateString = formatDate(date);
      const button = document.createElement("button");

      button.type = "button";
      button.textContent = String(day);
      button.className = "calendar-date";
      button.setAttribute("aria-pressed", String(dateString === selectedDate));

      if (date < today) button.disabled = true;

      if (dateString === selectedDate) {
        button.classList.add("selected");
      }

      button.addEventListener("click", function () {
        if (date < today) return;

        selectedDate = dateString;
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
      button.setAttribute("aria-pressed", String(time === selectedTime));

      if (time === selectedTime) button.classList.add("selected");

      button.addEventListener("click", function () {
        selectedTime = time;

        if (timeInput) timeInput.value = selectedTime;

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

  if (selectButton) {
    selectButton.addEventListener("click", function () {
      if (!selectedDate || !selectedTime) {
        alert("Please select both an appointment date and time.");
        return;
      }

      alert(
        "Appointment selected: " +
        formatDisplayDate(selectedDate) + " at " + selectedTime + "."
      );
    });
  }

  if (addButton) {
    addButton.addEventListener("click", function () {
      if (!selectedDate || !selectedTime) {
        alert("Please select an appointment date and time first.");
        return;
      }

      const form = document.getElementById("booking-form");
      const information = document.querySelector(
        'label[for="first-name"]'
      );

      if (information) {
        information.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        document.getElementById("first-name")?.focus({
          preventScroll: true
        });
      } else if (form) {
        form.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  renderCalendar();
  renderTimes();
}

function formatDisplayDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString + "T12:00:00");

  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

/* ==================================
   7. BOOKING FORM
================================== */

function setupBookingForm() {
  const form = document.getElementById("booking-form");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Read the service directly from the form.
    const serviceSelect = document.getElementById("service");

    if (serviceSelect) selectedService = serviceSelect.value;

    if (!SERVICES[selectedService]) {
      alert("Please select a massage.");
      serviceSelect?.focus();
      return;
    }

    // Read the selected calendar values.
    selectedDate =
      document.getElementById("appointment-date")?.value || selectedDate;

    selectedTime =
      document.getElementById("appointment-time")?.value || selectedTime;

    if (!selectedDate || !selectedTime) {
      alert("Please select an appointment date and time.");
      document.getElementById("calendar-grid")?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
      return;
    }

    const firstName =
      document.getElementById("first-name")?.value.trim() || "";

    const lastName =
      document.getElementById("last-name")?.value.trim() || "";

    const phone =
      document.getElementById("phone")?.value.trim() || "";

    const email =
      document.getElementById("email")?.value.trim() || "";

    if (!firstName || !lastName || !phone || !email) {
      alert("Please complete your name, phone number and email.");
      return;
    }

    const clientConsent = document.getElementById("client-consent");
    const intakeConsent = document.getElementById("intake-consent");

    if (clientConsent && !clientConsent.checked) {
      alert("Please accept the client consent.");
      clientConsent.focus();
      return;
    }

    if (intakeConsent && !intakeConsent.checked) {
      alert("Please confirm that you agree to the intake agreement.");
      intakeConsent.focus();
      return;
    }

    const hotStones = document.getElementById("hot-stones");
    const footScrub = document.getElementById("foot-scrub");

    const addOns = [];

    if (hotStones?.checked && !hotStones.disabled) {
      addOns.push("Hot stones (+R150)");
    }

    if (footScrub?.checked && !footScrub.disabled) {
      addOns.push("Foot scrubbing (+R200)");
    }

    if (selectedService === "reflexology") {
      addOns.push("Feet scrub included");
    }

    const total = calculateTotal();

    const booking = {
      firstName,
      lastName,
      phone,
      email,
      service: SERVICES[selectedService].name,
      serviceKey: selectedService,
      addOns,
      total,
      date: selectedDate,
      time: selectedTime
    };

    const message = [
      "D. MATAU SPA — APPOINTMENT REQUEST",
      "",
      `Client: ${booking.firstName} ${booking.lastName}`,
      `Phone: ${booking.phone}`,
      `Email: ${booking.email}`,
      `Treatment: ${booking.service}`,
      `Add-ons: ${booking.addOns.join(", ") || "None"}`,
      `Total: ${formatMoney(booking.total)}`,
      `Date: ${formatDisplayDate(booking.date)}`,
      `Time: ${booking.time}`,
      "",
      "Please confirm availability for this appointment."
    ].join("\n");

    const whatsappURL =
      "https://wa.me/" + WHATSAPP_NUMBER +
      "?text=" + encodeURIComponent(message);

    // Show the confirmation slip on this page.
    showConfirmationSlip(booking);

    // Open WhatsApp separately so the slip stays available to print.
    const whatsappWindow = window.open(
      whatsappURL,
      "_blank",
      "noopener,noreferrer"
    );

    if (!whatsappWindow) {
      const fallback = document.getElementById("whatsapp-fallback");

      if (fallback) {
        fallback.hidden = false;
        fallback.href = whatsappURL;
      }

      alert(
        "Your confirmation slip is ready. If WhatsApp did not open, " +
        "tap the WhatsApp booking link shown on the page."
      );
    }
  });
}

/* ==================================
   8. ONE-PAGE APPOINTMENT SLIP
================================== */

function showConfirmationSlip(booking) {
  let slip = document.getElementById("appointment-confirmation");

  if (!slip) {
    slip = document.createElement("section");
    slip.id = "appointment-confirmation";
    slip.className = "appointment-confirmation";
    slip.setAttribute("aria-labelledby", "confirmation-title");

    const form = document.getElementById("booking-form");

    if (form) {
      form.insertAdjacentElement("afterend", slip);
    } else {
      document.querySelector("main")?.appendChild(slip);
    }
  }

  const addOnsText = booking.addOns.length
    ? booking.addOns.join(", ")
    : "No additional treatments";

  slip.innerHTML = `
    <div class="slip-inner">
      <p class="slip-eyebrow">D. MATAU SPA</p>

      <h2 id="confirmation-title">Appointment Confirmation</h2>

      <p class="slip-subtitle">
        A moment of calm, reserved just for you.
      </p>

      <div class="slip-rule"></div>

      <p class="slip-status">
        APPOINTMENT REQUEST CREATED
      </p>

      <p class="slip-note">
        Your request has been prepared. Please wait for the spa to
        confirm the appointment through WhatsApp.
      </p>

      <dl class="slip-details">
        <div>
          <dt>Client</dt>
          <dd>${escapeHTML(booking.firstName)} ${escapeHTML(booking.lastName)}</dd>
        </div>

        <div>
          <dt>Treatment</dt>
          <dd>${escapeHTML(booking.service)}</dd>
        </div>

        <div>
          <dt>Appointment date</dt>
          <dd>${escapeHTML(formatDisplayDate(booking.date))}</dd>
        </div>

        <div>
          <dt>Appointment time</dt>
          <dd>${escapeHTML(booking.time)} SAST</dd>
        </div>

        <div>
          <dt>Additional treatments</dt>
          <dd>${escapeHTML(addOnsText)}</dd>
        </div>

        <div>
          <dt>Contact</dt>
          <dd>${escapeHTML(booking.phone)}<br>${escapeHTML(booking.email)}</dd>
        </div>
      </dl>

      <div class="slip-total">
        <span>Total quoted</span>
        <strong>${escapeHTML(formatMoney(booking.total))}</strong>
      </div>

      <p class="slip-footer">
        Thank you for choosing D. Matau Spa.<br>
        We look forward to helping you unwind.
      </p>

      <div class="slip-actions no-print">
        <button type="button" class="btn" id="print-confirmation">
          Print / Save as PDF
        </button>

        <a
          class="btn btn-light"
          id="whatsapp-fallback"
          href="https://wa.me/${WHATSAPP_NUMBER}"
          target="_blank"
          rel="noopener noreferrer"
          hidden
        >
          Continue to WhatsApp
        </a>
      </div>
    </div>
  `;

  const printButton = document.getElementById("print-confirmation");

  if (printButton) {
    printButton.addEventListener("click", function () {
      window.print();
    });
  }

  slip.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/* Escape customer-provided text before inserting it into HTML. */
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}
