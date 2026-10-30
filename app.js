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
  const arrow = document.createElement('span');
  arrow.textContent = '↗';
  caption.append(arrow);
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
  const check = document.createElement('b');
  check.textContent = '✓';
  fieldMap.append(check);
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
  demoNext.replaceChildren(document.createTextNode(demoStep === screens.length - 1 ? 'Restart ' : 'Continue '));
  const demoArrow = document.createElement('span');
  demoArrow.setAttribute('aria-hidden', 'true');
  demoArrow.textContent = demoStep === screens.length - 1 ? '↻' : '→';
  demoNext.append(demoArrow);
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
const earlyAccessSubmit = earlyAccessForm.querySelector('[type="submit"]');
function showFormMessage(message, state) {
  earlyAccessStatus.textContent = message;
  earlyAccessStatus.dataset.state = state;
  earlyAccessStatus.setAttribute('role', state === 'error' ? 'alert' : 'status');
}

earlyAccessForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (earlyAccessSubmit.disabled) return;

  if (!earlyAccessForm.reportValidity()) {
    showFormMessage('Please enter a valid work email and select Individual or Business.', 'error');
    return;
  }

  // Configure this global before app.js loads; this project intentionally has no default endpoint.
  const endpoint = typeof window.VERIIDIA_EARLY_ACCESS_ENDPOINT === 'string'
    ? window.VERIIDIA_EARLY_ACCESS_ENDPOINT.trim()
    : '';
  if (!endpoint) {
    showFormMessage('Your details are valid, but signup is not connected yet. Nothing has been sent or stored.', 'error');
    return;
  }

  earlyAccessSubmit.disabled = true;
  earlyAccessForm.setAttribute('aria-busy', 'true');
  earlyAccessSubmit.textContent = 'Sending request…';
  showFormMessage('Sending your request…', 'pending');
  const formData = new FormData(earlyAccessForm);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        userType: formData.get('userType'),
        message: formData.get('message')
      })
    });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    showFormMessage('Thank you. Your early-access request was received.', 'success');
    earlyAccessForm.reset();
    earlyAccessSubmit.textContent = 'Request received';
    earlyAccessSubmit.disabled = true;
  } catch {
    showFormMessage('We couldn’t send your request. Please try again later.', 'error');
    earlyAccessSubmit.textContent = 'Request early access ↗';
    earlyAccessSubmit.disabled = false;
  } finally {
    earlyAccessForm.removeAttribute('aria-busy');
  }
});

const revealTargets = document.querySelectorAll('.section-top, .problem-grid, .fragment-visual, .center-heading, .editorial-copy, .editorial-panels, .how-heading, .steps-track, .platform-heading, .product-carousel, .demo-heading, .demo-shell, .prototype-heading, .prototype-status, .audience-heading, .audience-grid, .trust-layout, .global-grid, .closing-content, .early-access-form');
revealTargets.forEach(element => element.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  revealTargets.forEach(element => observer.observe(element));
} else revealTargets.forEach(element => element.classList.add('in-view'));

document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    event.preventDefault();
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}));
