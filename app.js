const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches) document.documentElement.classList.add('motion-enabled');

const capabilities = [
  {
    title: 'Intelligent Form Engine',
    heading: ['A form that', 'understands context.'],
    description: 'Supported fields are identified and organized into a clear, guided workflow.',
    caption: 'APPLICATION DETAILS',
    labels: [['FULL NAME', 'Jordan Avery'], ['DATE OF BIRTH', 'Add your date'], ['HOME ADDRESS', 'Enter address']],
    map: 'FIELD MAPPING'
  },
  {
    title: 'Contextual Data Mapping',
    heading: ['Your details,', 'in the right place.'],
    description: 'Information provided by a user can be mapped to relevant fields for review.',
    caption: 'INFORMATION MATCH',
    labels: [['APPLICANT NAME', 'Jordan Avery'], ['RESIDENTIAL ADDRESS', '18 Example Street'], ['CONTACT DETAILS', 'Review this field']],
    map: '3 FIELDS IDENTIFIED'
  },
  {
    title: 'Document Organization',
    heading: ['Every document,', 'accounted for.'],
    description: 'Keep supporting documents alongside the requirements they may relate to.',
    caption: 'SUPPORTING DOCUMENTS',
    labels: [['IDENTITY', 'Example document'], ['ADDRESS', 'Utility statement'], ['APPLICATION', 'In progress']],
    map: '2 ITEMS TO REVIEW'
  },
  {
    title: 'Human-Controlled Execution',
    heading: ['The next step', 'stays yours.'],
    description: 'Stay informed and in control through verification, payment, and final submission.',
    caption: 'YOUR REVIEW',
    labels: [['INFORMATION', 'Ready to inspect'], ['VERIFICATION', 'You take this step'], ['FINAL SUBMISSION', 'You stay in control']],
    map: 'NO ACTION TAKEN'
  }
];

const carousel = document.querySelector('[data-carousel]');
const capPanel = document.querySelector('#cap-panel');
const capTitle = document.querySelector('#cap-title');
const capDesc = document.querySelector('#cap-desc');
const capCount = document.querySelector('#cap-count');
const capUnderTitle = document.querySelector('#cap-under-title');
const capVisual = document.querySelector('#cap-visual');
const capKicker = document.querySelector('.interface-kicker');
const capStep = document.querySelector('.interface-step');
const capDots = [...document.querySelectorAll('.carousel-dots [role="tab"]')];
let capabilityIndex = 0;
let carouselPointerStart = null;

function renderCapability(index) {
  capabilityIndex = (index + capabilities.length) % capabilities.length;
  const item = capabilities[capabilityIndex];

  capTitle.replaceChildren();
  item.heading.forEach((line, lineIndex) => {
    if (lineIndex) capTitle.append(document.createElement('br'));
    capTitle.append(document.createTextNode(line));
  });
  capDesc.textContent = item.description;
  capCount.textContent = String(capabilityIndex + 1).padStart(2, '0');
  capUnderTitle.textContent = item.title;
  capKicker.textContent = item.title.toUpperCase();
  capStep.textContent = `${String(capabilityIndex + 1).padStart(2, '0')} — 04`;
  capPanel.setAttribute('aria-labelledby', `cap-tab-${capabilityIndex + 1}`);

  capVisual.replaceChildren();
  capVisual.dataset.variant = String(capabilityIndex + 1);
  const caption = document.createElement('div');
  caption.className = 'form-caption';
  caption.append(document.createTextNode(item.caption));
  capVisual.append(caption);

  item.labels.forEach(([labelText, valueText]) => {
    const label = document.createElement('label');
    label.append(document.createTextNode(labelText));
    const value = document.createElement('b');
    value.textContent = valueText;
    label.append(value);
    capVisual.append(label);
  });

  const fieldMap = document.createElement('div');
  fieldMap.className = 'form-map';
  const mapLabel = document.createElement('span');
  mapLabel.textContent = item.map;
  fieldMap.append(mapLabel);
  ['01', '02', '03'].forEach(value => {
    const marker = document.createElement('i');
    marker.textContent = value;
    fieldMap.append(marker);
  });
  capVisual.append(fieldMap);

  capDots.forEach((dot, dotIndex) => {
    const active = dotIndex === capabilityIndex;
    dot.classList.toggle('active', active);
    dot.setAttribute('aria-selected', String(active));
    dot.tabIndex = active ? 0 : -1;
  });

  capPanel.classList.remove('is-changing');
  requestAnimationFrame(() => capPanel.classList.add('is-changing'));
  window.setTimeout(() => capPanel.classList.remove('is-changing'), 220);
}

document.querySelectorAll('.prev,.prev-small').forEach(button => {
  button.addEventListener('click', () => renderCapability(capabilityIndex - 1));
});
document.querySelectorAll('.next,.next-small').forEach(button => {
  button.addEventListener('click', () => renderCapability(capabilityIndex + 1));
});
capDots.forEach((dot, index) => dot.addEventListener('click', () => renderCapability(index)));
document.querySelector('.carousel-dots').addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? capabilities.length - 1 : capabilityIndex + (event.key === 'ArrowRight' ? 1 : -1);
  renderCapability(nextIndex);
  capDots[capabilityIndex].focus();
});
carousel.addEventListener('pointerdown', event => {
  if (event.pointerType === 'touch') carouselPointerStart = { x: event.clientX, y: event.clientY };
});
carousel.addEventListener('pointerup', event => {
  if (!carouselPointerStart || event.pointerType !== 'touch') return;
  const deltaX = event.clientX - carouselPointerStart.x;
  const deltaY = event.clientY - carouselPointerStart.y;
  if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
    renderCapability(capabilityIndex + (deltaX < 0 ? 1 : -1));
  }
  carouselPointerStart = null;
});
carousel.addEventListener('pointercancel', () => { carouselPointerStart = null; });

let demoStep = 0;
const screens = [...document.querySelectorAll('.demo-screen')];
const progressDots = [...document.querySelectorAll('.demo-steps i')];
const progress = document.querySelector('.demo-steps');
const demoBack = document.querySelector('.demo-back');
const demoNext = document.querySelector('.demo-next');

function renderDemo() {
  screens.forEach((screen, index) => {
    screen.classList.toggle('active', index === demoStep);
    screen.setAttribute('aria-hidden', String(index !== demoStep));
  });
  progressDots.forEach((dot, index) => {
    dot.classList.toggle('active', index <= demoStep);
    dot.setAttribute('aria-hidden', 'true');
  });
  progress.setAttribute('aria-valuenow', String(demoStep + 1));
  document.querySelector('#demo-step-label').textContent = `STEP ${String(demoStep + 1).padStart(2, '0')}`;
  demoBack.disabled = demoStep === 0;
  demoNext.textContent = demoStep === screens.length - 1 ? 'Restart' : 'Continue';
  demoNext.setAttribute('aria-label', demoStep === screens.length - 1 ? 'Restart sample demonstration' : 'Continue sample demonstration');
}

demoBack.addEventListener('click', () => {
  if (demoStep > 0) {
    demoStep -= 1;
    renderDemo();
  }
});
demoNext.addEventListener('click', () => {
  demoStep = demoStep === screens.length - 1 ? 0 : demoStep + 1;
  renderDemo();
});
renderDemo();
renderCapability(0);

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
function setMenuOpen(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('open', open);
}
menuToggle.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

const earlyAccessForm = document.querySelector('#early-access-form');
const earlyAccessStatus = document.querySelector('#early-access-status');
if (earlyAccessForm && earlyAccessStatus) {
  const earlyAccessSubmit = earlyAccessForm.querySelector('[type="submit"]');
  const defaultSubmitLabel = earlyAccessSubmit.textContent.trim();
  function showFormMessage(message, state) {
    earlyAccessStatus.textContent = message;
    earlyAccessStatus.dataset.state = state;
    earlyAccessStatus.setAttribute('role', state === 'error' ? 'alert' : 'status');
  }
  earlyAccessSubmit.disabled = true;
  fetch('/api/early-access', { headers: { Accept: 'application/json' } })
    .then(response => response.ok ? response.json() : Promise.reject(new Error('Service check failed')))
    .then(result => {
      if (!result.configured) {
        showFormMessage('The application service is not configured. Your application cannot be saved yet.', 'error');
        return;
      }
      earlyAccessSubmit.disabled = false;
      showFormMessage('The application service is ready. We will confirm when your application is saved.', 'ready');
    })
    .catch(() => showFormMessage('We could not verify the application service. Please try again later.', 'error'));

  earlyAccessForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (earlyAccessSubmit.disabled) return;
    if (!earlyAccessForm.reportValidity()) {
      showFormMessage('Please review the required fields and privacy consent.', 'error');
      return;
    }
    earlyAccessSubmit.disabled = true;
    earlyAccessForm.setAttribute('aria-busy', 'true');
    earlyAccessSubmit.textContent = 'Submitting…';
    showFormMessage('Submitting your application securely…', 'pending');
    const formData = new FormData(earlyAccessForm);
    const payload = Object.fromEntries(formData.entries());
    payload.consent = formData.get('consent') === 'true';
    try {
      const response = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 201) {
        showFormMessage('Your application has been saved. Thank you for your interest.', 'success');
        earlyAccessForm.reset();
        earlyAccessSubmit.textContent = 'Application saved';
        return;
      }
      const messages = {
        400: result.error || 'Please review the required fields and try again.',
        409: 'An application with this email is already on the list.',
        429: result.error || 'Too many attempts. Please wait and try again.',
        503: result.error || 'The application service is unavailable. Nothing was saved.'
      };
      showFormMessage(messages[response.status] || 'We could not submit your application. Nothing was confirmed as saved.', 'error');
    } catch {
      showFormMessage('We could not reach the application service. Nothing was confirmed as saved.', 'error');
    } finally {
      earlyAccessForm.removeAttribute('aria-busy');
      if (earlyAccessSubmit.textContent !== 'Application saved') {
        earlyAccessSubmit.disabled = false;
        earlyAccessSubmit.textContent = defaultSubmitLabel;
      }
    }
  });
}

const revealTargets = document.querySelectorAll('.section-top, .problem-grid, .fragment-visual, .center-heading, .editorial-copy, .editorial-panels, .how-heading, .steps-track, .platform-heading, .product-carousel, .demo-heading, .demo-shell, .prototype-heading, .prototype-status, .audience-heading, .audience-grid, .trust-layout, .global-grid, .closing-content, .early-access-form');
revealTargets.forEach(element => element.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  }), { threshold: 0.12 });
  revealTargets.forEach(element => observer.observe(element));
} else revealTargets.forEach(element => element.classList.add('in-view'));

const wordReveal = document.querySelector('[data-word-reveal]');
if (wordReveal && !reducedMotion.matches) {
  const words = [];
  const source = wordReveal.textContent.trim();
  wordReveal.replaceChildren();
  source.split(/(\s+)/).forEach(part => {
    if (!part.trim()) {
      wordReveal.append(document.createTextNode(part));
      return;
    }
    const word = document.createElement('span');
    word.className = 'word-fill';
    word.textContent = part;
    wordReveal.append(word);
    words.push(word);
  });
  wordReveal.classList.add('word-reveal-ready');

  let wordRevealFrame = 0;
  const updateWordReveal = () => {
    wordRevealFrame = 0;
    const rect = wordReveal.getBoundingClientRect();
    const distance = rect.height + window.innerHeight * 0.7;
    const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.85 - rect.top) / distance));
    words.forEach((word, index) => {
      const fill = Math.max(0, Math.min(1, progress * words.length - index));
      word.style.setProperty('--word-fill', `${Math.round(fill * 100)}%`);
    });
  };
  const scheduleWordReveal = () => {
    if (!wordRevealFrame) wordRevealFrame = window.requestAnimationFrame(updateWordReveal);
  };
  window.addEventListener('scroll', scheduleWordReveal, { passive: true });
  window.addEventListener('resize', scheduleWordReveal, { passive: true });
  scheduleWordReveal();
}

const heroArt = document.querySelector('.hero-art');
if (heroArt && !reducedMotion.matches && window.matchMedia('(min-width: 901px) and (pointer: fine)').matches) {
  const parallaxLayers = [
    [heroArt.querySelector('.workflow-card'), 0.28],
    [heroArt.querySelector('.paper-back'), -0.5],
    [heroArt.querySelector('.note-left'), -0.8],
    [heroArt.querySelector('.note-right'), 0.65]
  ].filter(([element]) => element);
  let parallaxFrame = 0;
  let pointerX = 0;
  let pointerY = 0;
  const applyParallax = () => {
    parallaxFrame = 0;
    parallaxLayers.forEach(([element, depth]) => {
      element.style.setProperty('--parallax-x', `${(pointerX * depth).toFixed(2)}px`);
      element.style.setProperty('--parallax-y', `${(pointerY * depth).toFixed(2)}px`);
    });
  };
  heroArt.addEventListener('pointermove', event => {
    const bounds = heroArt.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
    pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
    if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(applyParallax);
  }, { passive: true });
  heroArt.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
    if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(applyParallax);
  }, { passive: true });
}

document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    event.preventDefault();
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}));
