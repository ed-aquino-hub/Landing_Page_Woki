const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const all = <T extends Element>(selector: string) => Array.from(document.querySelectorAll<T>(selector));

/** Ejecuta `fn` una sola vez cuando cada elemento entra en pantalla. */
function onceVisible(els: Element[], fn: (el: HTMLElement) => void, options: IntersectionObserverInit) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      fn(e.target as HTMLElement);
      io.unobserve(e.target);
    }
  }, options);
  els.forEach((el) => io.observe(el));
}

// Analítica (dataLayer de GTM con consentimiento): ver analytics.ts.
import { track } from './analytics';

const revealEls = all<HTMLElement>('[data-reveal]');

if (!('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('in'));
} else {
  // Aparición al hacer scroll
  onceVisible(revealEls, (el) => el.classList.add('in'), { threshold: 0.15 });

  // Taxímetro (contador) y PIN tipo tragamonedas
  const runCounter = (el: HTMLElement) => {
    const to = Number(el.dataset.count);
    const decimals = Number(el.dataset.dec ?? 0);
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min((t - t0) / 1800, 1);
      el.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(decimals);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const runSlot = (el: HTMLElement) => {
    const final = el.dataset.slot ?? '';
    let n = 0;
    const id = setInterval(() => {
      n++;
      el.textContent = [...final].map((c, i) => (n > 8 + i * 4 ? c : String(Math.floor(Math.random() * 10)))).join('');
      if (n > 8 + final.length * 4) clearInterval(id);
    }, 70);
  };
  if (!reduceMotion) {
    onceVisible(all<HTMLElement>('[data-count]'), runCounter, { threshold: 0.6 });
    onceVisible(all<HTMLElement>('[data-slot]'), runSlot, { threshold: 0.6 });
  }

  // Enlace activo del menú según la sección visible
  // Cada enlace se asocia a una sección: por hash en la misma página o, en el
  // inicio, por data-section (p. ej. Seguridad → #seguridad aunque apunte a /seguridad).
  const links = all<HTMLAnchorElement>('#menu a');
  const sectionFor = (a: HTMLAnchorElement) => {
    if (a.hash && a.pathname === location.pathname) return a.hash.slice(1);
    return location.pathname === '/' ? a.dataset.section : undefined;
  };
  const spy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((a) => a.classList.toggle('on', sectionFor(a) === e.target.id));
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  links.forEach((a) => {
    const id = sectionFor(a);
    const target = id ? document.getElementById(id) : null;
    if (target) spy.observe(target);
  });
}

// Navbar: estilo al bajar y menú móvil
const header = document.querySelector<HTMLElement>('.top');
const burger = document.querySelector<HTMLButtonElement>('.burger');
const scrollProgress = document.querySelector<HTMLElement>('.scroll-progress > span');
if (header && burger) {
  const onScroll = () => {
    header.classList.toggle('scrolled', header.hasAttribute('data-solid') || window.scrollY > 10);
    if (scrollProgress) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      scrollProgress.style.transform = `scaleX(${progress})`;
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open: boolean) => {
    header.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    if (!open) all<HTMLElement>('[data-nav-dropdown]').forEach((item) => {
      item.classList.remove('expanded');
      item.querySelector('[data-nav-trigger]')?.setAttribute('aria-expanded', 'false');
    });
  };
  burger.addEventListener('click', () => setMenu(!header.classList.contains('open')));
  all<HTMLAnchorElement>('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  all<HTMLButtonElement>('[data-nav-trigger]').forEach((button) => button.addEventListener('click', () => {
    const dropdown = button.closest<HTMLElement>('[data-nav-dropdown]');
    const open = !dropdown?.classList.contains('expanded');
    all<HTMLElement>('[data-nav-dropdown]').forEach((item) => {
      item.classList.toggle('expanded', item === dropdown && open);
      item.querySelector('[data-nav-trigger]')?.setAttribute('aria-expanded', String(item === dropdown && open));
    });
  }));
  document.addEventListener('click', (event) => {
    if (header && !header.contains(event.target as Node)) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      burger.focus();
    }
  });
}

// Selector de etapas (Seguridad): cada botón muestra su panel en la escena.
all<HTMLElement>('[data-journey]').forEach((journey) => {
  const scene = journey.querySelector<HTMLElement>('[data-ride-scene]');
  const buttons = Array.from(journey.querySelectorAll<HTMLButtonElement>('[data-step-button]'));
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      if (scene) scene.dataset.step = button.dataset.step ?? '0';
    });
  });
});

// "En esta página": resalta el atajo de la sección visible.
const pageNavLinks = all<HTMLAnchorElement>('[data-page-nav] a');
if (pageNavLinks.length && 'IntersectionObserver' in window) {
  const pageSpy = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      pageNavLinks.forEach((link) => link.classList.toggle('is-on', link.hash === `#${entry.target.id}`));
    }
  }, { rootMargin: '-40% 0px -55% 0px' });
  pageNavLinks.forEach((link) => {
    const section = document.getElementById(link.hash.slice(1));
    if (section) pageSpy.observe(section);
  });
}

// Barra fija de conductores (móvil): aparece al dejar atrás el hero.
const stickyCta = document.querySelector<HTMLElement>('[data-sticky-cta]');
const stickyAnchor = document.querySelector<HTMLElement>('.p-hero');
if (stickyCta && stickyAnchor && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    stickyCta.classList.toggle('is-visible', !entry.isIntersecting);
  }).observe(stickyAnchor);
} else stickyCta?.classList.add('is-visible');

// El formulario solo envía cuando Turnstile está configurado; la ruta propia
// verifica el CAPTCHA y entrega la consulta a soporte.
const contactForm = document.querySelector<HTMLFormElement>('[data-contact-form]');
if (contactForm) {
  const status = contactForm.querySelector<HTMLElement>('[data-form-status]');
  const fields = all<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('[data-contact-field]').filter((field) => field.closest('[data-contact-form]') === contactForm);
  const clearFieldError = (field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
    const name = field.dataset.contactField;
    field.removeAttribute('aria-invalid');
    field.classList.remove('is-invalid');
    const error = name && contactForm.querySelector<HTMLElement>(`[data-field-error="${name}"]`);
    if (error) {
      error.hidden = true;
      error.textContent = '';
    }
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      field.placeholder = field.dataset.defaultPlaceholder ?? '';
    }
    if (field instanceof HTMLSelectElement) {
      const placeholderOption = field.options[0];
      if (placeholderOption) placeholderOption.textContent = 'Elige una opción';
    }
  };
  const setFieldError = (field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, message: string) => {
    const name = field.dataset.contactField;
    field.setAttribute('aria-invalid', 'true');
    field.classList.add('is-invalid');
    const error = name && contactForm.querySelector<HTMLElement>(`[data-field-error="${name}"]`);
    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.placeholder = message;
    if (field instanceof HTMLSelectElement && field.options[0]) field.options[0].textContent = 'Falta elegir una opción';
  };
  const validateForm = () => {
    let firstInvalid: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | undefined;
    const mark = (field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | undefined, message: string) => {
      if (!field) return;
      setFieldError(field, message);
      firstInvalid ??= field;
    };
    const field = (name: string) => fields.find((item) => item.dataset.contactField === name);
    const name = field('nombre');
    const contact = field('contacto');
    const message = field('mensaje');
    const consent = field('consentimiento');

    if (name && !name.value.trim()) mark(name, 'Falta ingresar tu nombre.');
    if (contact) {
      const value = contact.value.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isEmail) mark(contact, 'Ingresa un correo electrónico válido.');
    }
    if (message && !message.value.trim()) mark(message, 'Falta escribir tu mensaje.');
    if (consent instanceof HTMLInputElement && !consent.checked) mark(consent, 'Acepta el uso de tus datos para responderte.');
    firstInvalid?.focus();
    return !firstInvalid;
  };

  fields.forEach((field) => {
    field.addEventListener(field instanceof HTMLSelectElement || (field instanceof HTMLInputElement && field.type === 'checkbox') ? 'change' : 'input', () => clearFieldError(field));
  });
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    const data = new FormData(contactForm);
    if (data.get('website')) return;
    const captchaToken = String(data.get('cf-turnstile-response') ?? '').trim();
    if (!captchaToken) {
      if (status) status.textContent = 'Completa la validación CAPTCHA antes de enviar.';
      return;
    }
    track('contact_submit', { cta_label: 'contact_form', cta_location: 'contacto_formulario' });
    const endpoint = contactForm.dataset.endpoint;
    if (endpoint) {
      if (status) status.textContent = 'Enviando tu mensaje…';
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: String(data.get('nombre') ?? '').trim(),
            email: String(data.get('contacto') ?? '').trim(),
            message: String(data.get('mensaje') ?? '').trim(),
            consent: Boolean(data.get('consentimiento')),
            website: String(data.get('website') ?? ''),
            turnstileToken: captchaToken,
          }),
        });
        const result = await response.json().catch(() => ({})) as { error?: string };
        if (!response.ok) throw new Error(result.error ?? 'No se pudo enviar el mensaje.');
        contactForm.reset();
        if (status) status.textContent = '¡Gracias! Recibimos tu mensaje.';
        (window as Window & { turnstile?: { reset: () => void } }).turnstile?.reset();
      } catch (error) {
        if (status) status.textContent = error instanceof Error ? error.message : 'No pudimos enviarlo ahora. Intenta de nuevo.';
      }
      return;
    }
  });
}

document.addEventListener('click', (event) => {
  const target = (event.target as Element | null)?.closest<HTMLElement>('[data-track]');
  if (!target) return;
  track(target.dataset.track ?? 'cta_click', {
    cta_label: target.dataset.trackLabel,
    cta_location: target.dataset.trackLocation,
    link_url: target instanceof HTMLAnchorElement ? target.href : undefined,
  });
});

all<HTMLDetailsElement>('details[data-faq]').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) track('faq_open', { cta_label: item.dataset.trackLabel ?? item.dataset.faq, cta_location: item.dataset.trackLocation ?? 'faq' });
  });
});
