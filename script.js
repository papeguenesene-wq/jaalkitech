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

// Sélection des éléments liés au formulaire de contact WhatsApp.
const contactForm = document.querySelector("#whatsapp-contact-form");
const locationButton = document.querySelector("#share-location");
const locationStatus = document.querySelector("#location-status");
let mapLink = "";

function setLocationFromBrowser() {
  if (!("geolocation" in navigator)) {
    if (locationStatus) {
      locationStatus.textContent = "La géolocalisation n’est pas disponible dans ce navigateur.";
    }
    return;
  }

  // On ne demande jamais d'autorisation ici. On essaie uniquement si le navigateur
  // a déjà une permission de géolocalisation accordée ou si le système l'autorise
  // sans intervention utilisateur.
  const permissionQuery = navigator.permissions?.query?.({ name: "geolocation" });

  if (!permissionQuery) {
    return;
  }

  permissionQuery
    .then((permission) => {
      if (permission.state !== "granted") {
        return;
      }

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          mapLink = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
          if (locationStatus) {
            locationStatus.textContent = "Position ajoutée automatiquement au message WhatsApp.";
          }
          if (locationButton) {
            locationButton.textContent = "Position ajoutée";
          }
        },
        () => {
          mapLink = "";
          if (locationStatus) {
            locationStatus.textContent = "La géolocalisation est désactivée ou inaccessible.";
          }
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
      );
    })
    .catch(() => {
      // Le navigateur ne permet pas l'inspection de la permission : on ne dévie pas.
    });
}

// Si l’appareil/broiwser a déjà la géolocalisation autorisée, on l'utilise automatiquement.
if (locationStatus || locationButton) {
  setLocationFromBrowser();
}

// Ajout d'une géolocalisation optionnelle dans le message envoyé sur WhatsApp.
if (locationButton && locationStatus) {
  locationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
      locationStatus.textContent = "La géolocalisation n’est pas disponible dans ce navigateur.";
      return;
    }

    // C'est un clic explicite de l'utilisateur, donc on peut demander l'autorisation.
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

// Soumission du formulaire : on reconstruit un message prêt à être envoyé via WhatsApp.
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
