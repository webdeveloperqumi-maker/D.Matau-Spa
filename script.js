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

const HOT_STONES_PRICE = 150;
const FOOT_SCRUB_PRICE = 200;

let appointmentSelected = false;

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupBookingForm();
  setupCalendar();
});

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
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

  function updatePrice() {
    const service = SERVICES[serviceSelect.value];

    hotStones.disabled = !service || !service.hotStones;
    footScrub.disabled = !service || !service.footScrub;

    if (hotStones.disabled) hotStones.checked = false;
    if (footScrub.disabled) footScrub.checked = false;

    let total = service ? service.price : 0;

    if (service && hotStones.checked) {
      total += HOT_STONES_PRICE;
    }

    if (
      service &&
      service.name === "Swedish massage" &&
      footScrub.checked
    ) {
      total += FOOT_SCRUB_PRICE;
    }

    totalOutput.textContent = `R${total}`;
    totalInput.value = String(total);
  }

  serviceSelect.addEventListener("change", () => {
    updatePrice();
    appointmentSelected = false;
  });

  hotStones.addEventListener("change", updatePrice);
  footScrub.addEventListener("change", updatePrice);

  document.querySelectorAll(".service-select").forEach((button) => {
    button.addEventListener("click", () => {
      serviceSelect.value = button.dataset.service;
      updatePrice();
      appointmentSelected = false;

      document.querySelector("#booking-form").scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  const selectAppointment = document.querySelector("#select-appointment");
  const addAppointment = document.querySelector("#add-appointment");

  if (selectAppointment) {
    selectAppointment.addEventListener("click", () => {
      if (!dateInput.value || !timeInput.value) {
        alert("Please select an appointment date and time.");
        return;
      }

      appointmentSelected = true;
    });
  }

  if (addAppointment) {
    addAppointment.addEventListener("click", () => {
      if (!dateInput.value || !timeInput.value) {
        alert("Please select an appointment date and time.");
        return;
      }

      appointmentSelected = true;

      document.querySelector("#first-name").scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    });
  }

  updatePrice();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const service = SERVICES[serviceSelect.value];

    if (!service) {
      serviceSelect.focus();
      return;
    }

    if (!dateInput.value || !timeInput.value || !appointmentSelected) {
      alert("Please select your appointment and choose Add To Appointment.");
      return;
    }

    const date = new Date(`${dateInput.value}T12:00:00`);

    if (
      date.getFullYear() !== 2026 ||
      date.getMonth() !== 10 ||
      date.getDate() < 1 ||
      date.getDate() > 22
    ) {
      alert("Please select a date from the November calendar.");
      return;
    }

    const firstName = document.querySelector("#first-name").value.trim();
    const lastName = document.querySelector("#last-name").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const email = document.querySelector("#email").value.trim();

    const addOns = [];

    if (hotStones.checked) {
      addOns.push("Hot stones (+R150)");
    }

    if (service.name === "Swedish massage" && footScrub.checked) {
      addOns.push("Foot scrubbing (+R200)");
    }

    if (service.name === "Reflexology massage") {
      addOns.push("Feet scrub included");
    }

    const photoConsent =
      document.querySelector("#photo-consent").checked;

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
        photoConsent ? "Accepted" : "Not given"
      }`
    ].join("\n");

    const url =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  });
}

function setupCalendar() {
  const calendar = document.querySelector("#calendar-grid");
  const dateInput = document.querySelector("#appointment-date");
  const timeInput = document.querySelector("#appointment-time");
  const timeGrid = document.querySelector("#time-grid");

  if (!calendar || !dateInput || !timeInput || !timeGrid) return;

  const year = 2026;
  const month = 10;
  const daysToDisplay = 22;
  const firstDay = new Date(year, month, 1).getDay();

  ["S", "M", "T", "W", "T", "F", "S"].forEach((day) => {
    const heading = document.createElement("div");
    heading.className = "calendar-day-name";
    heading.textContent = day;
    calendar.appendChild(heading);
  });

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-date empty";
    empty.setAttribute("aria-hidden", "true");
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= daysToDisplay; day++) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "calendar-date";
    button.textContent = String(day);
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `November ${day}, 2026`);

    button.addEventListener("click", () => {
      calendar.querySelectorAll(".calendar-date").forEach((item) => {
        item.setAttribute("aria-pressed", "false");
      });

      button.setAttribute("aria-pressed", "true");

      dateInput.value = `2026-11-${String(day).padStart(2, "0")}`;
      timeInput.value = "";
      appointmentSelected = false;

      timeGrid.querySelectorAll(".time-option").forEach((item) => {
        item.setAttribute("aria-pressed", "false");
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

      timeGrid.querySelectorAll(".time-option").forEach((item) => {
        item.setAttribute("aria-pressed", "false");
      });

      button.setAttribute("aria-pressed", "true");
      timeInput.value = time;
      appointmentSelected = false;
    });

    timeGrid.appendChild(button);
  });
}

function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
