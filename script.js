const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
if (toggle) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
  });
}

const contactForm = document.querySelector("#whatsapp-contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const message = [
      "Bonjour JAALKI-TECH SOLUTIONS,",
      `Nom : ${formData.get("nom")}`,
      `Adresse e-mail : ${formData.get("email")}`,
      `Message : ${formData.get("message")}`,
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
