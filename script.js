
"use strict";

/* ==================================
   D. MATAU SPA — COMPLETE SCRIPT
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

document.addEventListener("DOMContentLoaded", function () {
  setupMobileMenu();
  setupMassageSelection();
  setupAddOns();
  setupCalendar();
  setupBookingForm();
});

/* ==================================
   1. MOBILE NAVIGATION
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
   2. MASSAGE SELECTION
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

      document.getElementById("booking-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
}

/* ==================================
   3. ADD-ONS
================================== */

function setupAddOns() {
  ["hot-stones", "foot-scrub"].forEach(function (id) {
    document.getElementById(id)?.addEventListener(
      "change",
      calculateTotal
    );
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
   4. PRICE CALCULATOR
================================== */

function formatMoney(amount) {
  return "R" + Number(amount).toLocaleString("en-ZA");
}

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

  const display = document.getElementById("booking-total");
  const hiddenTotal = document.getElementById("booking-total-value");

  if (display) display.textContent = formatMoney(total);
  if (hiddenTotal) hiddenTotal.value = String(total);

  return total;
}

/* ==================================
   5. APPOINTMENT CALENDAR
================================== */

function setupCalendar() {
  const calendar = document.getElementById("calendar-grid");
  const heading = document.getElementById("calendar-month");
  const previous = document.getElementById("previous-month");
  const next = document.getElementById("next-month");
  const dateInput = document.getElementById("appointment-date");
  const timeInput = document.getElementById("appointment-time");
  const timeGrid = document.getElementById("time-grid");
  const selectButton = document.getElementById("select-appointment");
  const addButton = document.getElementById("add-appointment");

  if (!calendar || !heading || !previous || !next) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let year = today.getFullYear();
  let month = today.getMonth();

  const times = [
    "10:00 am",
    "10:30 am",
    "11:00 am",
    "11:30 am",
    "2:00 pm",
    "2:30 pm",
    "3:00 pm",
    "3:30 pm"
  ];

  function formatDate(date) {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-");
  }

  function renderCalendar() {
    calendar.innerHTML = "";

    heading.textContent = new Date(year, month, 1).toLocaleDateString(
      "en-ZA",
      { month: "long", year: "numeric" }
    );

    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(
      function (day) {
        const item = document.createElement("div");
        item.className = "calendar-day-name";
        item.textContent = day;
        calendar.appendChild(item);
      }
    );

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
      button.className = "calendar-date";
      button.textContent = String(day);
      button.setAttribute(
        "aria-pressed",
        String(dateString === selectedDate)
      );

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
      button.setAttribute(
        "aria-pressed",
        String(time === selectedTime)
      );

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
        "Selected: " + formatDisplayDate(selectedDate) +
        " at " + selectedTime
      );
    });
  }

  if (addButton) {
    addButton.addEventListener("click", function () {
      if (!selectedDate || !selectedTime) {
        alert("Please select an appointment date and time first.");
        return;
      }

      document.getElementById("first-name")?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      document.getElementById("first-name")?.focus({
        preventScroll: true
      });
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
   6. BOOKING FORM + WHATSAPP
================================== */

function setupBookingForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const serviceSelect = document.getElementById("service");
    if (serviceSelect) selectedService = serviceSelect.value;

    if (!SERVICES[selectedService]) {
      alert("Please select a massage.");
      serviceSelect?.focus();
      return;
    }

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
      alert("Please accept the intake agreement.");
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
      addOns.push("Foot scrub included");
    }

    const booking = {
      firstName,
      lastName,
      phone,
      email,
      service: SERVICES[selectedService].name,
      addOns,
      total: calculateTotal(),
      date: selectedDate,
      time: selectedTime
    };

    const message = [
      "D. MATAU SPA — APPOINTMENT REQUEST",
      "",
      "Client: " + booking.firstName + " " + booking.lastName,
      "Phone: " + booking.phone,
      "Email: " + booking.email,
      "Treatment: " + booking.service,
      "Add-ons: " + (booking.addOns.join(", ") || "None"),
      "Total: " + formatMoney(booking.total),
      "Date: " + formatDisplayDate(booking.date),
      "Time: " + booking.time,
      "",
      "Please confirm availability for this appointment."
    ].join("\n");

    const whatsappURL =
      "https://wa.me/" + WHATSAPP_NUMBER +
      "?text=" + encodeURIComponent(message);

    // Display the slip before opening WhatsApp.
    showConfirmationSlip(booking);

    // Navigate to WhatsApp in a new tab/window.
    const fallback = document.getElementById("whatsapp-fallback");

    if (fallback) {
      fallback.href = whatsappURL;
      fallback.hidden = false;
    }

    const whatsappWindow = window.open(
      whatsappURL,
      "_blank",
      "noopener,noreferrer"
    );

    // Keep the confirmation slip on this page if popups are blocked.
    if (!whatsappWindow) {
      alert(
        "Your appointment request slip is ready. " +
        "If WhatsApp did not open, use the WhatsApp link below the slip."
      );
    }
  });
}

/* ==================================
   7. CONFIRMATION SLIP
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

      <p class="slip-status">APPOINTMENT REQUEST CREATED</p>

      <p class="slip-note">
        This slip records your appointment request. Please wait for
        D. Matau Spa to confirm availability through WhatsApp.
      </p>

      <dl class="slip-details">
        <div>
          <dt>Client name</dt>
          <dd>${escapeHTML(booking.firstName)} ${escapeHTML(booking.lastName)}</dd>
        </div>

        <div>
          <dt>Phone number</dt>
          <dd>${escapeHTML(booking.phone)}</dd>
        </div>

        <div>
          <dt>Email address</dt>
          <dd>${escapeHTML(booking.email)}</dd>
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
      </dl>

      <div class="slip-total">
        <span>Total quoted</span>
        <strong>${escapeHTML(formatMoney(booking.total))}</strong>
      </div>

      <p class="slip-footer">
        Thank you for choosing D. Matau Spa.<br>
        We look forward to helping you unwind.<br>
        <strong>See you there!</strong>
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

/* ==================================
   8. SAFE TEXT OUTPUT
================================== */

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
