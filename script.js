// Sélection des éléments du DOM nécessaires aux interactions du site.
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

// Gestion du bouton du menu mobile : ouvre ou ferme la navigation.
if (toggle) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
  });
}

// Sélection du formulaire de contact WhatsApp.
const contactForm = document.querySelector("#whatsapp-contact-form");
const locationButton = document.querySelector("#share-location");
const locationStatus = document.querySelector("#location-status");
let mapLink = "";

// La demande de permission n'est déclenchée qu'après le clic du contact.
if (locationButton && locationStatus) {
  locationButton.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      locationStatus.textContent =
        "La géolocalisation n’est pas disponible dans ce navigateur.";
      return;
    }

    if (!window.isSecureContext) {
      locationStatus.textContent =
        "La géolocalisation nécessite une connexion sécurisée HTTPS (ou un serveur local).";
      return;
    }

    locationButton.disabled = true;
    locationStatus.textContent =
      "Autorisez l’accès à votre position dans la fenêtre du navigateur…";

    try {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          mapLink = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
          locationButton.textContent = "Géolocalisation ajoutée";
          locationStatus.textContent =
            "Votre position sera incluse dans le message WhatsApp.";
          locationButton.disabled = false;
        },
        (error) => {
          mapLink = "";
          locationStatus.textContent =
            error.code === error.PERMISSION_DENIED
              ? "Autorisation refusée. Autorisez la localisation dans le navigateur, puis réessayez."
              : "Position indisponible. Vérifiez que la localisation est activée sur votre appareil, puis réessayez.";
          locationButton.disabled = false;
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
      );
    } catch (error) {
      locationButton.disabled = false;
      locationStatus.textContent =
        "Impossible de lancer la géolocalisation. Vérifiez les paramètres du navigateur et réessayez.";
      console.error("Échec de la demande de géolocalisation :", error);
    }
  });
}

// Soumission du formulaire : la position doit être récupérée par le bouton dédié.
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!mapLink) {
      if (locationStatus) {
        locationStatus.textContent =
          "Veuillez d’abord cliquer sur « Partager ma géolocalisation » et autoriser l’accès dans votre navigateur.";
      }
      locationButton?.focus();
      return;
    }

    const formData = new FormData(contactForm);
    const message = [
      "Bonjour JAALKI-TECH SOLUTIONS,",
      `Nom: ${formData.get("nom")}`,
      `E-mail: ${formData.get("email")}`,
      `Message: ${formData.get("message")}`,
      `Ma position: ${mapLink}`,
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
