document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('#menuToggle');
  const nav = document.querySelector('#mainNav');
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', open);
    if (open) nav.querySelector('a').focus();
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

  const whatsapp = document.querySelector('#whatsappCta');
  const phoneFromQuery = new URLSearchParams(window.location.search).get('t');
  const normalizePhone = (value) => {
    if (!value) return null;
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('00')) digits = digits.slice(2);
    if (digits.startsWith('0')) digits = `54${digits.slice(1)}`;
    if (digits.startsWith('54') && digits.charAt(2) === '0') digits = `54${digits.slice(3)}`;
    if (digits.length < 10 || digits.length > 15 || /^(\d)\1+$/.test(digits)) return null;
    return digits;
  };
  const phone = normalizePhone(phoneFromQuery);
  if (whatsapp && phone) {
    const message = encodeURIComponent('Hola, necesito ayuda con una emergencia de plomería.');
    whatsapp.href = `https://wa.me/${phone}?text=${message}`;
    whatsapp.target = '_blank';
    whatsapp.rel = 'noopener noreferrer';
  } else if (whatsapp) {
    whatsapp.textContent = 'Consultar emergencia ↗';
    whatsapp.setAttribute('aria-label', 'Consultar cómo funciona el canal de emergencias');
  }

  const params = new URLSearchParams(window.location.search);
  const brand = params.get('e') || params.get('n');
  if (brand) {
    document.querySelectorAll('[data-dynamic]').forEach((element) => { element.textContent = brand; });
    document.title = `${brand} | Demo de plomería`;
  }

  document.querySelectorAll('details').forEach((item) => {
    const summary = item.querySelector('summary');
    const syncFaqState = () => summary.setAttribute('aria-expanded', item.open ? 'true' : 'false');
    syncFaqState();
    item.addEventListener('toggle', syncFaqState);
  });

  const form = document.querySelector('#contactForm');
  const status = document.querySelector('#formStatus');
  if (form) form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = 'Consulta preparada. En una versión publicada, este paso abriría el canal verificado del profesional.';
    form.reset();
  });
});
