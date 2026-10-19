const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const toast = document.querySelector('#toast');
const toastMessage = document.querySelector('#toast-message');
const joinForm = document.querySelector('#join-form');
const emailInput = document.querySelector('#email-input');
const previewDialog = document.querySelector('#preview-dialog');
let toastTimer;

function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3600);
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'فتح القائمة' : 'إغلاق القائمة');
    mainNav.classList.toggle('is-open', !isOpen);
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'فتح القائمة');
      mainNav.classList.remove('is-open');
    });
  });
}

if (joinForm && emailInput) {
  joinForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    if (!validEmail) {
      emailInput.setAttribute('aria-invalid', 'true');
      emailInput.focus();
      showToast('تحقّق من كتابة بريد إلكتروني صحيح.');
      return;
    }

    emailInput.removeAttribute('aria-invalid');
    showToast('شكرًا لاهتمامك بمدونتي! هذا نموذج تجريبي للواجهة.');
    joinForm.reset();
  });

  emailInput.addEventListener('input', () => emailInput.removeAttribute('aria-invalid'));
}

function closePreview() {
  if (previewDialog && previewDialog.open) previewDialog.close();
}

document.querySelectorAll('[data-open-preview]').forEach((button) => {
  button.addEventListener('click', () => {
    if (previewDialog && typeof previewDialog.showModal === 'function') previewDialog.showModal();
  });
});

document.querySelectorAll('[data-close-preview]').forEach((button) => button.addEventListener('click', closePreview));
document.querySelectorAll('[data-close-preview-link]').forEach((link) => link.addEventListener('click', closePreview));

if (previewDialog) {
  previewDialog.addEventListener('click', (event) => {
    if (event.target === previewDialog) closePreview();
  });
}

document.querySelector('#current-year').textContent = String(new Date().getFullYear());

const sections = [...document.querySelectorAll('main section[id], main section .section-shell[id]')];
const navLinks = [...document.querySelectorAll('.nav-link')];
if ('IntersectionObserver' in window && sections.length && navLinks.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const sectionId = entry.target.id;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${sectionId}`;
        link.classList.toggle('active', active);
      });
    });
  }, { rootMargin: '-25% 0px -60% 0px' });
  sections.forEach((section) => observer.observe(section));
}
