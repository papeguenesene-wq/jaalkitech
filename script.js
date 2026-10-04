const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
if (toggle) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
  });
}

const contactForm = document.querySelector("#whatsapp-contact-form");
const locationButton = document.querySelector("#share-location");
const locationStatus = document.querySelector("#location-status");
let mapLink = "";

if (locationButton && locationStatus) {
  locationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
      locationStatus.textContent = "La géolocalisation n’est pas disponible dans ce navigateur.";
      return;
    }

    locationStatus.textContent = "Demande d’autorisation de localisation…";

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        mapLink = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
        locationStatus.textContent = "Position ajoutée au message WhatsApp.";
        locationButton.textContent = "Position ajoutée";
      },
      () => {
        mapLink = "";
        locationStatus.textContent = "Position non ajoutée. Vous pouvez continuer sans la partager.";
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const message = [
      "Bonjour JAALKI-TECH SOLUTIONS,",
      `Je me nomme ${formData.get("nom")}`,
      `Mon adresse e-mail est : ${formData.get("email")}`,
      `Message ${formData.get("message")}`,
      ...(mapLink ? [`Ma position : ${mapLink}`] : []),
    ].join("\n");
    const whatsappUrl = `https://wa.me/221774364759?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(whatsappUrl, "_blank");

    if (whatsappWindow) {
      whatsappWindow.opener = null;
    } else {
      window.location.assign(whatsappUrl);
    }
  });
}
