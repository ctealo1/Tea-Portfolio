/**
 * Dual-Role Portfolio Controller (Project Management & Quality Assurance)
 * Edit DEFAULT_PROFILE below if you want hardcoded contact details,
 * or customize them directly in the browser via "Personalize Contact Details".
 */

const DEFAULT_PROFILE = {
  fullName: "Your Name Here",
  location: "Manila, Philippines",
  email: "your.email@example.com",
  phone: "+63 9XX XXX XXXX",
  linkedin: "https://linkedin.com/in/your-profile",
  github: "https://github.com/your-handle",
};

const STORAGE_KEYS = {
  lens: "portfolio_role_lens_v1",
  theme: "portfolio_theme_v2",
  profile: "portfolio_profile_v1",
};

const LENS_COPY = {
  both: {
    label: "Dual-Role (PM + QA)",
    eyebrow: "Project Management • Quality & Delivery Assurance • Systems Analysis",
    title: "Project Manager, Systems Analyst & Quality Assurance Lead",
    subtitle:
      "Project Manager, Quality Assurance Lead & Systems Analyst capable of driving end-to-end SDLC execution from requirement scoping and sprint coordination to comprehensive test planning, defect governance, and release assurance.",
    skillFilter: "all",
  },
  pm: {
    label: "Project Manager Focus",
    eyebrow: "Project Coordination • Systems Analysis • Agile & ITIL v4 Delivery",
    title: "Project Coordinator & Systems Analyst — Agile & ITIL v4 Delivery",
    subtitle:
      "Project Coordinator & Systems Analyst specializing in requirement scoping, sprint velocity, risk mitigation, and cross-functional stakeholder alignment.",
    skillFilter: "pm",
  },
  qa: {
    label: "QA & Testing Lead Focus",
    eyebrow: "Quality & Delivery Assurance • Test Planning • UAT & Defect Governance",
    title: "Quality & Delivery Assurance Lead — Test Planning & UAT Governance",
    subtitle:
      "Quality & Delivery Assurance Lead specializing in comprehensive test plans, acceptance criteria, defect lifecycle management, and UAT governance.",
    skillFilter: "qa",
  },
};

const STAGE_SPOTLIGHTS = {
  "1": {
    badge: "Stage 01 Spotlight",
    html: "<strong>Discovery &amp; Scoping:</strong> Every functional and non-functional requirement is documented alongside measurable acceptance criteria from day one, preventing ambiguity before a single line of code is written.",
  },
  "2": {
    badge: "Stage 02 Spotlight",
    html: "<strong>Sprint Planning &amp; Architecture:</strong> Feature backlogs and milestone schedules are built in tandem with test plans, quality gates, and proactive delivery risk assessments.",
  },
  "3": {
    badge: "Stage 03 Spotlight",
    html: "<strong>Execution, Integration &amp; Defect Governance:</strong> Sub-team liaison and code review tracking run side-by-side with cross-module debugging and prioritized defect resolution workflows.",
  },
  "4": {
    badge: "Stage 04 Spotlight",
    html: "<strong>Quality Gates &amp; ITIL v4 Release:</strong> Milestone reviews, user acceptance testing (UAT), and ITIL v4 change impact assessments ensure reliable releases and continuous improvement.",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initRoleLens();
  initSkillFilters();
  initProjectTabs();
  initLifecycleStages();
  initProfileCustomizer();
  initMobileNav();
  initPrintButtons();
  initScrollSpy();
});

/* ==========================================================================
   Theme Toggle
   ========================================================================== */

function initTheme() {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  const initialTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "light";
  root.setAttribute("data-theme", initialTheme);

  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEYS.theme, next);
  });
}

/* ==========================================================================
   Global Role Lens Switcher
   ========================================================================== */

function initRoleLens() {
  applyLens("both", false);
}

function applyLens(lens, syncUserFilters = true) {
  const copy = LENS_COPY[lens] || LENS_COPY.both;
  document.documentElement.setAttribute("data-lens", lens);
  localStorage.setItem(STORAGE_KEYS.lens, lens);

  // Sync all lens switcher buttons across header and hero
  document.querySelectorAll("[data-lens-target]").forEach((btn) => {
    const isActive = btn.getAttribute("data-lens-target") === lens;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });

  // Update dynamic hero copy
  const labelEl = document.getElementById("active-lens-label");
  const eyebrowEl = document.getElementById("hero-eyebrow");
  const titleEl = document.getElementById("hero-title");
  const subtitleEl = document.getElementById("hero-subtitle");

  if (labelEl) labelEl.textContent = copy.label;
  if (eyebrowEl) eyebrowEl.textContent = copy.eyebrow;
  if (titleEl) titleEl.textContent = copy.title;
  if (subtitleEl) subtitleEl.textContent = copy.subtitle;

  if (syncUserFilters) {
    applySkillFilter(copy.skillFilter);
    syncAllProjectTabs(lens);
  }
}

/* ==========================================================================
   Skill Category & Role Filter
   ========================================================================== */

function initSkillFilters() {
  const filterBtns = document.querySelectorAll("[data-skill-filter]");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-skill-filter") || "all";
      applySkillFilter(filter);
    });
  });
}

function applySkillFilter(filter) {
  document.querySelectorAll("[data-skill-filter]").forEach((btn) => {
    const isActive = btn.getAttribute("data-skill-filter") === filter;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });

  const pills = document.querySelectorAll("#competencies .skill-pill");
  pills.forEach((pill) => {
    const track = pill.getAttribute("data-track") || "both";
    pill.classList.remove("is-dimmed", "is-highlighted-pm", "is-highlighted-qa");

    if (filter === "all") {
      return;
    }

    if (filter === "pm") {
      if (track === "pm" || track === "both") {
        pill.classList.add("is-highlighted-pm");
      } else {
        pill.classList.add("is-dimmed");
      }
    } else if (filter === "qa") {
      if (track === "qa" || track === "both") {
        pill.classList.add("is-highlighted-qa");
      } else {
        pill.classList.add("is-dimmed");
      }
    } else if (filter === "tech") {
      if (track === "tech" || pill.closest("[data-skill-card='technical']")) {
        pill.classList.add("is-highlighted-pm");
      } else {
        pill.classList.add("is-dimmed");
      }
    }
  });
}

/* ==========================================================================
   Project Card Contribution Tabs
   ========================================================================== */

function initProjectTabs() {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card) => {
    const tabs = card.querySelectorAll("[data-proj-tab]");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const mode = tab.getAttribute("data-proj-tab") || "both";
        setProjectCardMode(card, mode);
      });
    });
  });
}

function syncAllProjectTabs(mode) {
  document.querySelectorAll(".project-card").forEach((card) => {
    setProjectCardMode(card, mode);
  });
}

function setProjectCardMode(card, mode) {
  card.querySelectorAll("[data-proj-tab]").forEach((tab) => {
    const isActive = tab.getAttribute("data-proj-tab") === mode;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  const pmPanel = card.querySelector('[data-panel="pm"]');
  const qaPanel = card.querySelector('[data-panel="qa"]');

  if (pmPanel) {
    pmPanel.classList.toggle("is-hidden", mode === "qa");
  }
  if (qaPanel) {
    qaPanel.classList.toggle("is-hidden", mode === "pm");
  }
}

/* ==========================================================================
   Interactive SDLC Workflow Stages
   ========================================================================== */

function initLifecycleStages() {
  const stageCards = document.querySelectorAll(".stage-card");
  const detailBadge = document.querySelector(".stage-detail-badge");
  const detailText = document.getElementById("stage-detail-text");

  const activateStage = (card) => {
    const stageId = card.getAttribute("data-stage");
    const spotlight = STAGE_SPOTLIGHTS[stageId];
    if (!spotlight) return;

    stageCards.forEach((c) => c.classList.toggle("is-active", c === card));
    if (detailBadge) detailBadge.textContent = spotlight.badge;
    if (detailText) detailText.innerHTML = spotlight.html;
  };

  stageCards.forEach((card) => {
    card.addEventListener("click", () => activateStage(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateStage(card);
      }
    });
  });
}

/* ==========================================================================
   Profile Customizer (localStorage persisted)
   ========================================================================== */

function getProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.profile);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function normalizeUrl(url) {
  const trimmed = (url || "").trim();
  if (!trimmed) return "#contact";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function stripProtocol(url) {
  return (url || "").replace(/^https?:\/\//i, "");
}

function renderProfile(profile) {
  const displayName =
    profile.fullName && profile.fullName !== DEFAULT_PROFILE.fullName
      ? profile.fullName
      : "IS Portfolio";

  document.querySelectorAll('[data-profile="heroName"]').forEach((el) => {
    el.textContent = profile.fullName || DEFAULT_PROFILE.fullName;
  });

  document.querySelectorAll('[data-profile="displayName"]').forEach((el) => {
    el.textContent = displayName;
  });

  const fullNameEl = document.querySelector('[data-profile="fullName"]');
  if (fullNameEl) {
    fullNameEl.textContent =
      profile.fullName === DEFAULT_PROFILE.fullName
        ? 'Your Name (Click "Personalize" to set)'
        : profile.fullName;
  }

  document.querySelectorAll('[data-profile="location"]').forEach((el) => {
    el.textContent = profile.location || DEFAULT_PROFILE.location;
  });

  document.querySelectorAll('[data-profile="phone"]').forEach((el) => {
    el.textContent = profile.phone || DEFAULT_PROFILE.phone;
  });

  const emailEl = document.getElementById("profile-email-link");
  if (emailEl) {
    const emailVal = profile.email || DEFAULT_PROFILE.email;
    emailEl.textContent = emailVal;
    emailEl.href = emailVal === DEFAULT_PROFILE.email ? "#contact" : `mailto:${emailVal}`;
  }

  const linkedinEl = document.getElementById("profile-linkedin-link");
  if (linkedinEl) {
    const val = profile.linkedin || DEFAULT_PROFILE.linkedin;
    linkedinEl.textContent = stripProtocol(val);
    linkedinEl.href = val === DEFAULT_PROFILE.linkedin ? "#contact" : normalizeUrl(val);
  }

  const githubEl = document.getElementById("profile-github-link");
  if (githubEl) {
    const val = profile.github || DEFAULT_PROFILE.github;
    githubEl.textContent = stripProtocol(val);
    githubEl.href = val === DEFAULT_PROFILE.github ? "#contact" : normalizeUrl(val);
  }
}

function initProfileCustomizer() {
  const modal = document.getElementById("customizer-modal");
  const form = document.getElementById("customizer-form");
  const openBtns = [
    document.getElementById("open-customizer-hero"),
    document.getElementById("open-customizer-btn"),
  ].filter(Boolean);
  const closeBtns = [
    document.getElementById("close-customizer-btn"),
    document.getElementById("cancel-customizer-btn"),
  ].filter(Boolean);
  const resetBtn = document.getElementById("reset-profile-btn");

  renderProfile(getProfile());

  if (!modal || !form) return;

  const populateForm = () => {
    const current = getProfile();
    document.getElementById("input-fullName").value =
      current.fullName === DEFAULT_PROFILE.fullName ? "" : current.fullName;
    document.getElementById("input-location").value = current.location || "";
    document.getElementById("input-email").value =
      current.email === DEFAULT_PROFILE.email ? "" : current.email;
    document.getElementById("input-phone").value =
      current.phone === DEFAULT_PROFILE.phone ? "" : current.phone;
    document.getElementById("input-linkedin").value =
      current.linkedin === DEFAULT_PROFILE.linkedin ? "" : current.linkedin;
    document.getElementById("input-github").value =
      current.github === DEFAULT_PROFILE.github ? "" : current.github;
  };

  const openModal = () => {
    populateForm();
    modal.hidden = false;
    document.getElementById("input-fullName")?.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
  };

  openBtns.forEach((btn) => btn.addEventListener("click", openModal));
  closeBtns.forEach((btn) => btn.addEventListener("click", closeModal));

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const updated = {
      fullName: document.getElementById("input-fullName").value.trim() || DEFAULT_PROFILE.fullName,
      location: document.getElementById("input-location").value.trim() || DEFAULT_PROFILE.location,
      email: document.getElementById("input-email").value.trim() || DEFAULT_PROFILE.email,
      phone: document.getElementById("input-phone").value.trim() || DEFAULT_PROFILE.phone,
      linkedin: document.getElementById("input-linkedin").value.trim() || DEFAULT_PROFILE.linkedin,
      github: document.getElementById("input-github").value.trim() || DEFAULT_PROFILE.github,
    };
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(updated));
    renderProfile(updated);
    closeModal();
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEYS.profile);
      renderProfile(DEFAULT_PROFILE);
      populateForm();
    });
  }
}

/* ==========================================================================
   Mobile Drawer, Print & Scroll Spy
   ========================================================================== */

function initMobileNav() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const drawer = document.getElementById("mobile-drawer");
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener("click", () => {
    const isHidden = drawer.hidden;
    drawer.hidden = !isHidden;
    toggleBtn.setAttribute("aria-expanded", String(isHidden));
  });

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      drawer.hidden = true;
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });
}

function initPrintButtons() {
  ["hero-print-btn", "contact-print-btn"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => window.print());
    }
  });
}

function initScrollSpy() {
  const navLinks = document.querySelectorAll(".main-nav a");
  const sections = Array.from(navLinks)
    .map((link) => {
      const id = link.getAttribute("href");
      return id ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === id);
        });
      });
    },
    { rootMargin: "-30% 0px -60% 0px" }
  );

  sections.forEach((sec) => observer.observe(sec));
}
