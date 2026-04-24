const page = document.body.dataset.page || "home";
const footerTitle =
  document.body.dataset.footerTitle || "행사 일정, 장소, 필요한 내용을 알려주세요.";
const contactEmail = "clemensound@naver.com";
const kakaoTalkUrl = "https://open.kakao.com/o/REPLACE_WITH_YOUR_LINK";
const faviconHref = "assets/icons/favicon_BK_512.png";

const navItems = [
  { key: "services", label: "서비스", href: "index.html#work" },
  { key: "profile", label: "프로필", href: "profile.html" },
  { key: "equipment", label: "보유 장비", href: "equipment.html" },
  { key: "portfolio", label: "포트폴리오", href: "portfolio.html" },
  { key: "contact", label: "문의", href: "contact.html" },
];

const homeSections = [
  { key: "services", id: "work" },
  { key: "services", id: "services" },
  { key: "services", id: "studio" },
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
        : item.href;

      return `<a href="${href}">${item.label}</a>`;
    })
    .join("");

  mount.outerHTML = `
    <header class="site-header">
      <div class="header-inner">

        <a class="brand" href="${brandHref}">
          <span>CLEMENSound</span>
        </a>

        <!-- 🍔 햄버거 버튼 추가 -->
        <button class="menu-toggle" aria-label="메뉴">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav class="nav-links">
          ${nav}
        </nav>

      </div>
    </header>
  `;
}

function renderFooter() {
 // ❗ contact 페이지에서는 footer 숨김
  if (page === "contact") return;
  const mount = document.querySelector("[data-footer]");
  if (!mount) return;

  mount.outerHTML = `
    <footer id="contact" class="site-footer">
      <div>
        <p class="eyebrow">Contact</p>
        <h2>${footerTitle}</h2>
      </div>
      <div class="footer-actions">
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

renderFavicon();
renderHeader();
renderFooter();
syncHomeNavigation();

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.classList.toggle("active");
  });

  // 메뉴 클릭 시 닫기
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("active");
    });
  });
});