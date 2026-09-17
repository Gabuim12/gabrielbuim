// ============ Ano do rodapé ============
document.getElementById("year").textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let currentLang = "pt";
try {
  if (localStorage.getItem("lang") === "en") currentLang = "en";
} catch {
  // localStorage indisponível — mantém pt
}

// ============ Scroll reveal ============
(function scrollReveal() {
  const items = document.querySelectorAll("[data-reveal]");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));
})();

// ============ Contadores ============
(function counters() {
  const counters = document.querySelectorAll(".stat-value");

  function animateCounter(el) {
    const target = parseInt(el.dataset.countTo, 10);
    const suffix = el.dataset.suffix || "";

    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (!("IntersectionObserver" in window)) {
    counters.forEach((el) => animateCounter(el));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => observer.observe(el));
})();

// ============ Nuvem de ícones (tech stack) ============
(function iconCloud() {
  const el = document.getElementById("icon-cloud");
  if (!el) return;

  const slugs = [
    "html5", "css", "javascript", "nodedotjs", "git", "github",
    "mysql", "figma", "netlify", "linux", "whatsapp", "npm",
  ];

  const items = slugs.map((slug) => {
    const img = document.createElement("img");
    img.src = `https://cdn.simpleicons.org/${slug}`;
    img.alt = slug;
    img.width = 44;
    img.height = 44;
    img.draggable = false;
    img.loading = "lazy";
    el.appendChild(img);
    return img;
  });

  if (prefersReducedMotion) {
    el.classList.add("icon-cloud--static");
    return;
  }

  const N = items.length;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const points = items.map((_, i) => {
    const y = 1 - (i / (N - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return {
      x: Math.cos(theta) * radiusAtY,
      y,
      z: Math.sin(theta) * radiusAtY,
    };
  });

  const R = 125;
  let rotY = 0;
  let rotX = 0.2;
  let velY = 0.0032;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  function project() {
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    points.forEach((p, i) => {
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;
      const y1 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const depth = (z2 + 1) / 2;
      const scale = 0.55 + depth * 0.6;
      const px = x1 * R;
      const py = y1 * R;

      const img = items[i];
      img.style.transform = `translate(-50%, -50%) translate(${px}px, ${py}px) scale(${scale})`;
      img.style.zIndex = Math.round(depth * 100);
      img.style.opacity = String(0.35 + depth * 0.65);
    });
  }

  function tick() {
    if (!dragging) rotY += velY;
    project();
    requestAnimationFrame(tick);
  }

  el.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    el.classList.add("is-dragging");
  });
  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    rotY += dx * 0.006;
    rotX += dy * 0.006;
    velY = dx * 0.0006;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  window.addEventListener("pointerup", () => {
    dragging = false;
    el.classList.remove("is-dragging");
  });

  project();
  tick();
})();

// ============ Certificados ============
(function certificates() {
  const grid = document.getElementById("cert-grid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");
  if (!grid || !lightbox) return;

  // Para adicionar um novo certificado: solte o arquivo em /certificados
  // e acrescente um item aqui (com tradução em inglês).
  const CERTIFICATES = [
    {
      file: "certificados/vibe-coding.webp",
      title: { pt: "Introdução ao Vibe Coding", en: "Introduction to Vibe Coding" },
      issuer: { pt: "Prime Cursos do Brasil", en: "Prime Cursos do Brasil" },
      meta: { pt: "20 horas · Julho de 2026", en: "20 hours · July 2026" },
    },
  ];

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  const cards = CERTIFICATES.map((cert) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "cert-card";

    const img = document.createElement("img");
    img.className = "cert-thumb";
    img.src = cert.file;
    img.loading = "lazy";

    const info = document.createElement("span");
    info.className = "cert-info";

    const title = document.createElement("span");
    title.className = "cert-title";

    const meta = document.createElement("span");
    meta.className = "cert-meta";

    info.append(title, meta);
    card.append(img, info);
    card.addEventListener("click", () => openLightbox(cert.file, cert.title[currentLang] || cert.title.pt));
    grid.appendChild(card);

    return { cert, img, title, meta };
  });

  function updateCertLang(lang) {
    cards.forEach(({ cert, img, title, meta }) => {
      const t = cert.title[lang] || cert.title.pt;
      img.alt = t;
      title.textContent = t;
      meta.textContent = `${cert.issuer[lang] || cert.issuer.pt} · ${cert.meta[lang] || cert.meta.pt}`;
    });
  }
  updateCertLang(currentLang);
  document.addEventListener("langchange", (e) => updateCertLang(e.detail.lang));

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
})();

// ============ Copiar link ============
const shareBtn = document.getElementById("share-btn");
const COPIED_MSG = { pt: "Link copiado!", en: "Link copied!" };
shareBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    const original = shareBtn.textContent;
    shareBtn.textContent = COPIED_MSG[currentLang] || COPIED_MSG.pt;
    setTimeout(() => { shareBtn.textContent = original; }, 1800);
  } catch {
    // clipboard indisponível — nada a fazer
  }
});

// ============ Idioma (PT / EN) ============
(function i18n() {
  const toggle = document.getElementById("lang-toggle");
  if (!toggle) return;

  const els = document.querySelectorAll("[data-i18n]");
  const original = new Map();
  els.forEach((el) => original.set(el, el.innerHTML));

  const titleEl = document.querySelector("title");
  const descEl = document.querySelector('meta[name="description"]');
  const originalTitle = document.title;
  const originalDesc = descEl ? descEl.getAttribute("content") : "";

  const EN_TITLE = "Gabriel Buim · Full Stack Developer & Cybersecurity";
  const EN_DESC = "Gabriel Buim, CEO of Nexus Digital. Full stack developer with a background in cybersecurity, building websites, systems and online stores for small and medium businesses.";

  const EN = {
    "nav-work": "Work",
    "nav-certs": "Certificates",
    "nav-about": "About",
    "nav-contact": "Contact",
    "topbar-cta": "Get in touch",
    "hero-kicker": "Vancouver, Canada · Available for new projects",
    "hero-role": 'Full stack developer with a solid foundation in cybersecurity.<br>Founder of <a href="https://nexusdigital.cloud" target="_blank" rel="noreferrer">Nexus Digital</a>.',
    "hero-desc": "I build custom websites, systems and online stores for small and medium businesses that want a real digital presence, with clean, secure code and real support after launch.",
    "hero-whatsapp": "Chat on WhatsApp",
    "hero-view-work": "View projects",
    "meta-college": "Computer Science · Canadian College",
    "meta-cyber": "Cybersecurity &amp; Full Stack",
    "stats-label": "Years of experience",
    "company-kicker": "My company",
    "company-desc": "Custom websites, systems and online stores, from briefing to launch, for businesses that want a real digital presence.",
    "company-cta": "Learn about Nexus Digital",
    "work-title": "Projects I've shipped",
    "work-sub": "Real deliveries for Nexus Digital clients",
    "work-desc-1": "Tattoo studio in Vancouver, with a portfolio and WhatsApp booking.",
    "work-desc-2": "Digital menu and product showcase, with orders via WhatsApp.",
    "work-desc-3": "Digital showcase for a popular fashion store in Rio, with WhatsApp ordering.",
    "work-desc-4": "Barbershop in Marília, Brazil, with WhatsApp booking and a photo gallery.",
    "work-desc-5": "Lead generation for a Brazilian social security (INSS) pension review specialist.",
    "work-desc-6": "Online store for phones, headphones and accessories, with a full shopping cart.",
    "tag-institutional": "Institutional",
    "stack-title": "My stack",
    "stack-sub": "What I use to build solid digital products",
    "stack-1-title": "Cybersecurity",
    "stack-1-desc": "Best practices applied from architecture through deployment.",
    "stack-2-desc": "From front to back, building complete, scalable products.",
    "stack-3-desc": "Institutional sites and conversion pages, fast and responsive.",
    "stack-4-title": "Custom systems",
    "stack-4-desc": "Automations and custom systems to organize everyday processes.",
    "icon-cloud-label": "Tools I use every day",
    "certs-title": "Certificates",
    "certs-sub": "Courses and training I've completed",
    "about-title": "About me",
    "about-lead": "Web development and cybersecurity, combined to build solid, custom-built digital products.",
    "about-p1": 'I\'m <strong>Gabriel Buim</strong>, a full stack developer and Computer Science student at Canadian College, in Vancouver. Along the way, I also dove deep into cybersecurity, and today I apply that knowledge to everything I build.',
    "about-p2": "I'm CEO &amp; Founder of Nexus Digital, a team dedicated to building custom websites, online stores and systems for small and medium businesses that want a real digital presence, no empty promises, with clean code and real support after launch.",
    "about-p3": "That's <strong>more than 18 projects delivered</strong>, with <strong>98% of clients satisfied</strong>.",
    "contact-title": "Let's talk?",
    "contact-desc": "Reach out about your project, I reply fast.",
    "share-btn": "Copy link",
  };

  function applyLang(lang) {
    els.forEach((el) => {
      const key = el.dataset.i18n;
      el.innerHTML = lang === "en" && EN[key] ? EN[key] : original.get(el);
    });
    document.title = lang === "en" ? EN_TITLE : originalTitle;
    if (descEl) descEl.setAttribute("content", lang === "en" ? EN_DESC : originalDesc);
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    toggle.textContent = lang === "en" ? "PT" : "EN";
    toggle.setAttribute("aria-label", lang === "en" ? "Mudar para português" : "Switch to English");

    currentLang = lang;
    try { localStorage.setItem("lang", lang); } catch {
      // localStorage indisponível — segue sem persistir
    }
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  }

  toggle.addEventListener("click", () => applyLang(currentLang === "pt" ? "en" : "pt"));

  applyLang(currentLang);
})();
