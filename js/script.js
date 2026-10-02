/*
  Shared interactions:
  - Full-screen menu
  - Gallery filters and lightbox
  - FAQ accordion
  - Contact form placeholder response
  - Floating booking chatbot
*/

const body = document.body;

const menuOverlay = document.querySelector("[data-menu-overlay]");
const menuOpenButtons = document.querySelectorAll("[data-menu-open]");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");

function openMenu() {
  if (!menuOverlay) return;
  menuOverlay.classList.add("is-open");
  menuOverlay.setAttribute("aria-hidden", "false");
  body.classList.add("menu-open");
  menuOpenButtons.forEach((button) => button.setAttribute("aria-expanded", "true"));
}

function closeMenu() {
  if (!menuOverlay) return;
  menuOverlay.classList.remove("is-open");
  menuOverlay.setAttribute("aria-hidden", "true");
  body.classList.remove("menu-open");
  menuOpenButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
}

menuOpenButtons.forEach((button) => button.addEventListener("click", openMenu));
menuCloseButtons.forEach((button) => button.addEventListener("click", closeMenu));

// Clicking the dimmed area to the left of the 1/3 menu panel closes it
if (menuOverlay) {
  menuOverlay.addEventListener("click", (event) => {
    if (event.clientX < menuOverlay.getBoundingClientRect().left) closeMenu();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeLightbox();
  }
});

const filterButtons = document.querySelectorAll("[data-filter]");
const galleryItems = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    galleryItems.forEach((item) => {
      const shouldShow = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxTriggers = document.querySelectorAll("[data-lightbox-src]");

function openLightbox(src, caption) {
  if (!lightbox || !lightboxImage) return;
  lightboxImage.src = src;
  lightboxImage.alt = caption || "Вибране зображення з портфоліо";
  if (lightboxCaption) lightboxCaption.textContent = caption || "";
  lightbox.classList.add("is-open");
  body.classList.add("lightbox-open");
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("is-open");
  body.classList.remove("lightbox-open");
  lightboxImage.src = "";
}

lightboxTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openLightbox(trigger.dataset.lightboxSrc, trigger.dataset.lightboxCaption);
  });
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

const faqItems = document.querySelectorAll("[data-faq-item]");

faqItems.forEach((item) => {
  const question = item.querySelector("[data-faq-question]");
  const answer = item.querySelector("[data-faq-answer]");

  if (!question || !answer) return;

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((faqItem) => {
      const faqAnswer = faqItem.querySelector("[data-faq-answer]");
      faqItem.classList.remove("is-open");
      if (faqAnswer) faqAnswer.style.maxHeight = null;
      const faqQuestion = faqItem.querySelector("[data-faq-question]");
      if (faqQuestion) faqQuestion.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
      question.setAttribute("aria-expanded", "true");
    }
  });
});

const bookingForm = document.querySelector("[data-booking-form]");
const formNote = document.querySelector("[data-form-note]");

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (formNote) {
      formNote.textContent = "Дякую! Ваш запит готовий до підключення до реальної системи бронювання.";
    }
    bookingForm.reset();
  });
}

const chatbot = document.querySelector("[data-chatbot]");
const chatbotToggle = document.querySelector("[data-chatbot-toggle]");
const chatbotClose = document.querySelector("[data-chatbot-close]");
const chatbotMessages = document.querySelector("[data-chatbot-messages]");
const chatPrompts = document.querySelectorAll("[data-chat-prompt]");

const chatAnswers = {
  booking: "Сесію можна замовити через контактну форму. Я підтверджу доступність, локацію та деталі стилізації електронною поштою.",
  delivery: "Портретні та брендингові галереї зазвичай надаються протягом 10–14 днів. Весілля та більші історії можуть тривати 4–6 тижнів.",
  deposit: "Тут можна додати умови щодо передоплати. Багато фотографів закріплюють дату після підписання договору та внесення передоплати.",
};

function addMessage(text, type = "bot") {
  if (!chatbotMessages) return;
  const message = document.createElement("div");
  message.className = type === "user" ? "message message--user" : "message";
  message.textContent = text;
  chatbotMessages.appendChild(message);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function openChatbot() {
  if (!chatbot) return;
  chatbot.classList.add("is-open");
  chatbotToggle?.setAttribute("aria-expanded", "true");
}

function closeChatbot() {
  if (!chatbot) return;
  chatbot.classList.remove("is-open");
  chatbotToggle?.setAttribute("aria-expanded", "false");
}

if (chatbotToggle) {
  chatbotToggle.addEventListener("click", () => {
    const isOpen = chatbot?.classList.contains("is-open");
    if (isOpen) {
      closeChatbot();
    } else {
      openChatbot();
    }
  });
}

if (chatbotClose) chatbotClose.addEventListener("click", closeChatbot);

chatPrompts.forEach((prompt) => {
  prompt.addEventListener("click", () => {
    const key = prompt.dataset.chatPrompt;
    addMessage(prompt.textContent.trim(), "user");
    window.setTimeout(() => addMessage(chatAnswers[key] || "Я можу допомогти з бронюванням, термінами отримання фото та деталями сесії."), 350);
  });
});
