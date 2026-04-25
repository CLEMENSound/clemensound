const page = document.body.dataset.page || "home";
const footerTitle =
  document.body.dataset.footerTitle || "행사 일정, 장소, 필요한 내용을 알려주세요.";
const contactEmail = "clemensound@naver.com";
const kakaoTalkUrl = "https://open.kakao.com/o/REPLACE_WITH_YOUR_LINK";
const instagramUrl = "https://www.instagram.com/REPLACE_WITH_YOUR_ID";
const faviconHref = "assets/icons/favicon_BK_512.png";
const brandLogoHref = "assets/images/CLEMENSound-Logo.jpg";

const navItems = [
  { key: "home", label: "홈", href: "index.html" },
  { key: "profile", label: "프로필", href: "profile.html" },
  { key: "equipment", label: "보유 장비", href: "equipment.html" },
  { key: "portfolio", label: "포트폴리오", href: "portfolio.html" },
  { key: "contact", label: "문의", href: "contact.html" },
];

const homeSections = [
  { key: "home", id: "top" },
  { key: "home", id: "work" },
  { key: "home", id: "services" },
  { key: "home", id: "studio" },
];

function renderFavicon() {
  const existing = document.querySelector('link[rel="icon"]');
  if (existing) {
    existing.href = faviconHref;
    existing.type = "image/png";
    return;
  }

  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.href = faviconHref;
  favicon.type = "image/png";
  document.head.append(favicon);
}

function renderHeader() {
  const mount = document.querySelector("[data-header]");
  if (!mount) return;

  const isHome = page === "home";
  const brandHref = isHome ? "#top" : "index.html";

  const nav = navItems
    .map((item) => {
      const href = isHome && item.href.startsWith("index.html#")
        ? item.href.replace("index.html", "")
        : isHome && item.href === "index.html"
          ? "#top"
        : item.href;
      const isActive = page === item.key;
      const activeAttrs = isActive ? ' aria-current="page" class="is-active"' : "";

      return `<a href="${href}" data-nav-key="${item.key}"${activeAttrs}>${item.label}</a>`;
    })
    .join("");

  mount.outerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="${brandHref}">
          <img src="${brandLogoHref}" alt="" aria-hidden="true" />
          <span>CLEMEMSound</span>
        </a>

        <button class="menu-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="site-navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav id="site-navigation" class="nav-links" aria-label="주요 메뉴">
          ${nav}
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  if (page === "contact" || page === "thanks") return;

  const mount = document.querySelector("[data-footer]");
  if (!mount) return;

  mount.outerHTML = `
    <footer id="contact" class="site-footer">
      <div>
        <p class="eyebrow">Contact</p>
        <h2>${footerTitle}</h2>
      </div>
      <div class="footer-actions">
        <a class="social-link instagram" href="${instagramUrl}" target="_blank" rel="noopener" aria-label="Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="4" y="4" width="16" height="16" rx="5"></rect>
            <circle cx="12" cy="12" r="3.5"></circle>
            <circle cx="16.6" cy="7.4" r="1"></circle>
          </svg>
        </a>
        <a class="button kakao" href="${kakaoTalkUrl}" target="_blank" rel="noopener">카카오톡 문의</a>
        <a class="button primary" href="contact.html">문의 접수하기</a>
      </div>
    </footer>
  `;
}

function setActiveNav(key) {
  document.querySelectorAll("[data-nav-key]").forEach((item) => {
    if (item.dataset.navKey === key) {
      item.setAttribute("aria-current", "page");
      item.classList.add("is-active");
    } else {
      item.removeAttribute("aria-current");
      item.classList.remove("is-active");
    }
  });
}

function syncHomeNavigation() {
  if (page !== "home") return;

  const sections = homeSections
    .map((section) => ({
      key: section.key,
      element: document.getElementById(section.id),
    }))
    .filter((section) => section.element);

  if (!sections.length) return;

  const update = () => {
    const marker = window.scrollY + window.innerHeight * 0.46;
    let active = sections[0].key;

    sections.forEach((section) => {
      if (section.element.offsetTop <= marker) {
        active = section.key;
      }
    });

    const bottomReached = window.innerHeight + window.scrollY >= document.body.scrollHeight - 8;
    setActiveNav(bottomReached ? "contact" : active);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const activeSection = sections.find((section) => section.element === visible.target);
      if (activeSection) {
        setActiveNav(activeSection.key);
      }
    },
    {
      root: null,
      rootMargin: "-34% 0px -48% 0px",
      threshold: [0, 0.18, 0.36, 0.54],
    },
  );

  sections.forEach((section) => observer.observe(section.element));
}

function setupMobileNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (!toggle || !nav) return;

  const setMenuOpen = (isOpen) => {
    nav.classList.toggle("open", isOpen);
    toggle.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
    document.body.classList.toggle("menu-open", isOpen);
  };

  toggle.addEventListener("click", () => {
    setMenuOpen(!nav.classList.contains("open"));
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) setMenuOpen(false);
  });
}

renderFavicon();
renderHeader();
renderFooter();
syncHomeNavigation();
setupMobileNavigation();
