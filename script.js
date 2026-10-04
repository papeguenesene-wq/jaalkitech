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
const locationStatus = document.querySelector("#location-status");

function getLocationLink() {
  if (!("geolocation" in navigator) || !navigator.permissions?.query) {
    return Promise.reject(
      new Error("Activez la localisation dans les paramètres de votre navigateur, puis réessayez."),
    );
  }

  return navigator.permissions
    .query({ name: "geolocation" })
    .then((permission) => {
      if (permission.state !== "granted") {
        throw new Error(
          "Pour envoyer votre demande, activez la localisation et autorisez-la pour ce site dans les paramètres du navigateur.",
        );
      }

      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            resolve(
              `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
            );
          },
          () => {
            reject(
              new Error("Position inaccessible. Vérifiez que la localisation est activée sur votre appareil."),
            );
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
        );
      });
    });
}

// Soumission du formulaire : on reconstruit un message prêt à être envoyé via WhatsApp.
if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
    }
    if (locationStatus) {
      locationStatus.textContent = "Vérification de la localisation autorisée…";
    }

    let mapLink;
    try {
      mapLink = await getLocationLink();
    } catch (error) {
      if (locationStatus) {
        locationStatus.textContent = error.message;
      }
      if (submitButton) {
        submitButton.disabled = false;
      }
      return;
    }

    const formData = new FormData(contactForm);
    const message = [
      "Bonjour JAALKI-TECH SOLUTIONS,",
      `Je me nomme ${formData.get("nom")}`,
      `Mon adresse e-mail est : ${formData.get("email")}`,
      `Message ${formData.get("message")}`,
      `Ma position : ${mapLink}`,
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
