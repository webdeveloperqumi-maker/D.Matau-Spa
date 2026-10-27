"use strict";

const WHATSAPP_NUMBER = "27846558531";

const SERVICES = {
  deep: {
    name: "Deep Tissue Massage",
    price: 1000,
    hotStones: true,
    footScrub: false
  },
  swedish: {
    name: "Swedish massage",
    price: 800,
    hotStones: true,
    footScrub: true
  },
  aroma: {
    name: "Aromatherapy massage",
    price: 850,
    hotStones: false,
    footScrub: false
  },
  reflexology: {
    name: "Reflexology massage",
    price: 1200,
    hotStones: false,
    footScrub: false
  }
};

const HOT_STONES_PRICE = 150;
const FOOT_SCRUB_PRICE = 200;

const AVAILABLE_TIMES = [
  "10:00 am",
  "10:30 am",
  "11:00 am",
  "11:30 am",
  "2:00 pm",
  "2:30 pm",
  "3:00 pm",
  "3:30 pm"
];

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupBookingForm();
  setupCalendar();
  setupExperienceRating();
});

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");

    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupBookingForm() {
  const form = document.querySelector("#booking-form");

  if (!form) return;

  const serviceSelect = document.querySelector("#service");
  const hotStones = document.querySelector("#hot-stones");
  const footScrub = document.querySelector("#foot-scrub");
  const totalOutput = document.querySelector("#booking-total");
  const totalInput = document.querySelector("#booking-total-value");

  const dateInput = document.querySelector("#appointment-date");
  const timeInput = document.querySelector("#appointment-time");

  function updateBookingPrice() {
    const selectedService = SERVICES[serviceSelect.value];

    hotStones.disabled = !selectedService || !selectedService.hotStones;
    footScrub.disabled = !selectedService || !selectedService.footScrub;

    if (hotStones.disabled) hotStones.checked = false;
    if (footScrub.disabled) footScrub.checked = false;

    let total = selectedService ? selectedService.price : 0;

    if (selectedService && hotStones.checked) {
      total += HOT_STONES_PRICE;
    }

    if (
      selectedService &&
      selectedService.name === "Swedish massage" &&
      footScrub.checked
    ) {
      total += FOOT_SCRUB_PRICE;
    }

    totalOutput.textContent = `R${total}`;
    totalInput.value = String(total);
  }

  serviceSelect.addEventListener("change", updateBookingPrice);
  hotStones.addEventListener("change", updateBookingPrice);
  footScrub.addEventListener("change", updateBookingPrice);

  updateBookingPrice();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const service = SERVICES[serviceSelect.value];

    if (!service) {
      serviceSelect.focus();
      return;
    }

    if (!dateInput.value || !timeInput.value) {
      alert("Please select an appointment date and time.");
      return;
    }

    const selectedDate = new Date(`${dateInput.value}T12:00:00`);

    if (
      selectedDate.getFullYear() !== 2026 ||
      selectedDate.getMonth() !== 10 ||
      selectedDate.getDate() > 22
    ) {
      alert("Please select a date in the displayed November calendar.");
      return;
    }

    const firstName = document.querySelector("#first-name").value.trim();
    const lastName = document.querySelector("#last-name").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const email = document.querySelector("#email").value.trim();

    const addOns = [];

    if (hotStones.checked) addOns.push("Hot stones (+R150)");

    if (
      service.name === "Swedish massage" &&
      footScrub.checked
    ) {
      addOns.push("Foot scrubbing (+R200)");
    }

    if (service.name === "Reflexology massage") {
      addOns.push("Feet scrub included");
    }

    const total = Number(totalInput.value);

    const message = [
      "D. Matau Spa Massage",
      "",
      "Booking Request",
      `Name: ${firstName} ${lastName}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Massage: ${service.name}`,
      `Add-ons: ${addOns.length ? addOns.join(", ") : "None"}`,
      `Date: ${formatDate(dateInput.value)}`,
      `Time: ${timeInput.value}`,
      "Time Zone: SAST (South African Standard Time)",
      `Total: R${total}`,
      "",
      "CLIENT CONSENT: Accepted",
      "Client Full Consent & Intake Agreement: Accepted",
      `Client Photo & Video Recording Consent: ${
        document.querySelector("#photo-consent").checked
          ? "Accepted"
          : "Not given"
      }`
    ].join("\n");

    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  });
}

function setupCalendar() {
  const calendar = document.querySelector("#calendar-grid");
  const dateInput = document.querySelector("#appointment-date");
  const timeInput = document.querySelector("#appointment-time");
  const timeButtons = document.querySelector("#time-grid");

  if (!calendar || !dateInput || !timeInput || !timeButtons) return;

  const year = 2026;
  const month = 10; // November
  const numberOfDays = 22;

  const firstWeekday = new Date(year, month, 1).getDay();

  const weekdayNames = ["S", "M", "T", "W", "T", "F", "S"];

  weekdayNames.forEach((name) => {
    const heading = document.createElement("div");
    heading.className = "calendar-day-name";
    heading.textContent = name;
    calendar.appendChild(heading);
  });

  for (let i = 0; i < firstWeekday; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-date empty";
    empty.setAttribute("aria-hidden", "true");
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= numberOfDays; day++) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "calendar-date";
    button.textContent = String(day);
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `November ${day}, 2026`);

    button.addEventListener("click", () => {
      calendar.querySelectorAll(".calendar-date").forEach((dateButton) => {
        dateButton.setAttribute("aria-pressed", "false");
      });

      button.setAttribute("aria-pressed", "true");

      dateInput.value =
        `2026-11-${String(day).padStart(2, "0")}`;

      timeInput.value = "";

      timeButtons.querySelectorAll(".time-option").forEach((timeButton) => {
        timeButton.setAttribute("aria-pressed", "false");
      });
    });

    calendar.appendChild(button);
  }

  AVAILABLE_TIMES.forEach((time) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "time-option";
    button.textContent = time;
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
      if (!dateInput.value) {
        alert("Please select an appointment date first.");
        return;
      }

      timeButtons.querySelectorAll(".time-option").forEach((timeButton) => {
        timeButton.setAttribute("aria-pressed", "false");
      });

      button.setAttribute("aria-pressed", "true");
      timeInput.value = time;
    });

    timeButtons.appendChild(button);
  });

  dateInput.addEventListener("change", () => {
    const chosenDate = new Date(`${dateInput.value}T12:00:00`);

    if (
      chosenDate.getFullYear() !== 2026 ||
      chosenDate.getMonth() !== 10 ||
      chosenDate.getDate() < 1 ||
      chosenDate.getDate() > 22
    ) {
      dateInput.value = "";
      timeInput.value = "";
    }
  });
}

function setupExperienceRating() {
  const rating = document.querySelector("#experience-rating");

  if (!rating) return;

  // The rating is optional and is not required to request a booking.
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
