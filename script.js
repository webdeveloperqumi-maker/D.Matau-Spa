/* =====================================
   D. MATAU SPA
   Main JavaScript
   ===================================== */

// MOBILE NAVIGATION

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navigation.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });
}


// AUTOMATIC COPYRIGHT YEAR

document.querySelectorAll(".current-year").forEach(element => {
    element.textContent = new Date().getFullYear();
});


// WHATSAPP SETTINGS

// South African number 084 655 8531 in international format.
const SPA_WHATSAPP_NUMBER = "27846558531";

function openSpaWhatsApp(message) {
    const whatsappURL =
        "https://wa.me/" +
        SPA_WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
}


// GENERAL WHATSAPP BUTTONS

document.querySelectorAll("[data-whatsapp]").forEach(button => {
    button.addEventListener("click", () => {
        const message =
            button.dataset.message ||
            "Hello D. Matau Spa, I would like to enquire about your services.";

        openSpaWhatsApp(message);
    });
});


// BOOKING FORM AND PRICE CALCULATOR

const bookingForm = document.querySelector("#booking-form");

if (bookingForm) {
    const serviceSelect = document.querySelector("#service");
    const hotStones = document.querySelector("#hot-stones");
    const footScrub = document.querySelector("#foot-scrub");
    const totalDisplay = document.querySelector("#total-price");

    const servicePrices = {
        deep: 1000,
        swedish: 800,
        aromatherapy: 850,
        reflexology: 1200
    };

    function updateBookingTotal() {
        let total = servicePrices[serviceSelect.value] || 0;

        if (hotStones && hotStones.checked) {
            total += 150;
        }

        if (footScrub && footScrub.checked) {
            total += 200;
        }

        if (totalDisplay) {
            totalDisplay.textContent = "Estimated total: R" + total;
        }
    }

    if (serviceSelect) {
        serviceSelect.addEventListener("change", updateBookingTotal);
    }

    if (hotStones) {
        hotStones.addEventListener("change", updateBookingTotal);
    }

    if (footScrub) {
        footScrub.addEventListener("change", updateBookingTotal);
    }

    updateBookingTotal();

    bookingForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!bookingForm.reportValidity()) {
            return;
        }

        const firstName =
            document.querySelector("#first-name")?.value.trim() || "";

        const lastName =
            document.querySelector("#last-name")?.value.trim() || "";

        const phone =
            document.querySelector("#phone")?.value.trim() || "";

        const email =
            document.querySelector("#email")?.value.trim() || "";

        const service =
            serviceSelect?.selectedOptions[0]?.text || "Not selected";

        const appointmentDate =
            document.querySelector("#appointment-date")?.value || "Not selected";

        const appointmentTime =
            document.querySelector("#appointment-time")?.value || "Not selected";

        const addOns = [];

        if (hotStones?.checked) {
            addOns.push("Hot stones (+R150)");
        }

        if (footScrub?.checked) {
            addOns.push("Foot scrubbing (+R200)");
        }

        const total = totalDisplay?.textContent || "To be confirmed";

        const consent =
            document.querySelector("#client-consent");

        if (consent && !consent.checked) {
            alert("Please agree to the client consent before continuing.");
            return;
        }

        const message = [
            "Hello D. Matau Spa!",
            "",
            "I would like to REQUEST an appointment.",
            "",
            "Name: " + firstName + " " + lastName,
            "Phone: " + phone,
            "Email: " + email,
            "Massage: " + service,
            "Add-ons: " + (addOns.join(", ") || "None"),
            "Preferred date: " + appointmentDate,
            "Preferred time: " + appointmentTime,
            total,
            "",
            "Please confirm availability and the final price. I understand this is a request, not a confirmed booking."
        ].join("\n");

        openSpaWhatsApp(message);
    });
}
