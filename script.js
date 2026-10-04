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
let mapLink = "";

function setLocationFromBrowser() {
  if (!("geolocation" in navigator)) {
    return;
  }

  // Le navigateur ne doit pas demander d'autorisation ici : on ne lance la géolocalisation
  // que si la permission a déjà été accordée dans les paramètres du navigateur.
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
        },
        () => {
          mapLink = "";
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
      );
    })
    .catch(() => {
      // Le navigateur ne permet pas la vérification explicite de la permission.
      // Dans ce cas, on reste silencieux et on n'ouvre pas d'invite.
    });
}

// Vérification silencieuse de la permission existante au chargement de la page.
setLocationFromBrowser();

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
