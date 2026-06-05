const page = document.body.dataset.page || "home";
const contactEmail = "clemensound@naver.com";
const kakaoJavaScriptKey = "";
const kakaoChannelUrl = "https://pf.kakao.com/_xkjYGX/chat";
const kakaoChannelPublicId = getKakaoChannelPublicId(kakaoChannelUrl);
const kakaoTalkUrl = getKakaoChannelChatUrl(kakaoChannelUrl);
const kakaoSdkScript = {
  src: "https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js",
  integrity: "sha384-OL+ylM/iuPLtW5U3XcvLSGhE8JzReKDank5InqlHGWPhb4140/yrBw0bg0y7+C9J",
};
const instagramUrl = "https://www.instagram.com/clemensound";
const daangnBusinessUrl = "https://www.daangn.com/kr/local-profile/vc8u3mpbromg";
const faviconHref = "assets/logo_bg_icons/favicon_BK_512.png";
const brandLogoHref = "assets/logo_bg_icons/CLEMENSound-Logo-WH.png";
const copyrightText = "© 2026 CLEMENSound. All rights reserved.";
const businessInfo = {
  company: "상호: 클레멘사운드",
  owner: "대표: 이기성",
  address: "소재지: 서울시 금천구 독산로22길 35-14, 201호",
  customerCenter: `고객센터: 010-3210-8314 / ${contactEmail}`,
	registration: "사업자등록번호: 575-34-01871",
};

const navItems = [
  { key: "home", label: "홈", href: "index.html" },
  { key: "profile", label: "프로필", href: "profile.html" },
  { key: "equipment", label: "보유 장비", href: "equipment.html" },
  { key: "portfolio", label: "포트폴리오", href: "portfolio.html" },
  { key: "contact", label: "문의", href: "contact.html" },
];

const homeSections = [
  { key: "home", id: "top" },
  { key: "home", id: "setup-operation" },
  { key: "home", id: "inspection" },
  { key: "home", id: "education" }, 
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
          <span>클레멘사운드</span>
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
  const mount = document.querySelector("[data-footer]");
  if (!mount) return;

  mount.outerHTML = `
    <footer id="contact" class="site-footer">
      <div>
        <p class="eyebrow">Contact</p>
        <div class="footer-legal" aria-label="사업자 정보">
          <span>${businessInfo.company}</span>
          <span>${businessInfo.owner}</span>
          <span>${businessInfo.address}</span>
          <span>${businessInfo.customerCenter}</span>
					<span>${businessInfo.registration}</span>
        </div>
        <div class="footer-meta">
          <button class="footer-privacy" type="button" data-privacy-open>개인정보처리방침</button>
          <span>${copyrightText}</span>
        </div>
      </div>
      <div class="footer-actions">
        <a class="social-link instagram" href="${instagramUrl}" target="_blank" rel="noopener" aria-label="Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="4" y="4" width="16" height="16" rx="5"></rect>
            <circle cx="12" cy="12" r="3.5"></circle>
            <circle cx="16.6" cy="7.4" r="1"></circle>
          </svg>
        </a>
        <a class="social-link kakao" href="${kakaoTalkUrl}" target="_blank" rel="noopener" aria-label="카카오톡 문의">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 4.2c-4.4 0-8 2.8-8 6.3 0 2.2 1.5 4.2 3.8 5.3l-.8 3.4 3.7-2.5c.4.1.9.1 1.3.1 4.4 0 8-2.8 8-6.3s-3.6-6.3-8-6.3Z"></path>
          </svg>
        </a>
        <a class="social-link daangn" href="${daangnBusinessUrl}" target="_blank" rel="noopener" aria-label="Danggeun Business">
          <svg viewBox="0 0 21.0491 36" aria-hidden="true" focusable="false">
            <path d="M10.5245 13.2822C4.71228 13.2822 0 17.8902 0 23.7078C0 31.7459 10.5548 36.0112 10.5245 35.9997C10.4957 36.0112 21.0491 31.7459 21.0491 23.7078C21.0491 17.8945 16.3368 13.2822 10.5245 13.2822ZM10.5245 27.9285C9.73639 27.9279 8.96612 27.6936 8.3111 27.2552C7.65609 26.8168 7.14574 26.194 6.84459 25.4656C6.54345 24.7371 6.46502 23.9357 6.61923 23.1626C6.77345 22.3896 7.15337 21.6796 7.71097 21.1226C8.26857 20.5655 8.97881 20.1862 9.75188 20.0328C10.525 19.8794 11.3261 19.9587 12.0542 20.2607C12.7822 20.5627 13.4043 21.0738 13.8419 21.7294C14.2795 22.385 14.5129 23.1557 14.5126 23.944C14.5136 24.4682 14.4111 24.9875 14.211 25.472C14.011 25.9565 13.7173 26.3968 13.3468 26.7676C12.9763 27.1384 12.5364 27.4325 12.0521 27.6329C11.5677 27.8334 11.0487 27.9362 10.5245 27.9357V27.9285Z" fill="#FF6F0F"></path>
            <path d="M12.8944 0C10.4381 0 8.72773 1.71648 8.4585 3.744C5.18452 2.83968 2.6189 5.328 2.6189 8.064C2.6189 10.1592 4.05864 11.8512 5.97782 12.4013C7.52554 12.8434 10.3129 12.5136 10.3129 12.5136C10.2985 11.8368 10.9219 11.0938 11.8836 10.417C14.6192 8.49312 16.7586 7.58592 17.0883 4.96224C17.4339 2.2176 15.3966 0 12.8944 0Z" fill="#00A05B"></path>
          </svg>
        </a>
        <a class="button primary" href="contact.html">문의</a>
      </div>
    </footer>
    <div id="footer-privacy-modal" class="modal" hidden>
      <div class="modal-content footer-privacy-content" role="dialog" aria-modal="true" aria-labelledby="footer-privacy-title">
        <button type="button" class="close" data-privacy-close aria-label="닫기">&times;</button>
        <h2 id="footer-privacy-title">개인정보처리방침</h2>
        <p>
          클레멘사운드는 문의 확인, 일정 조율, 견적 안내, 서비스 응대를 위해 필요한 최소한의 개인정보를 수집합니다.
          수집된 정보는 해당 목적 외에는 사용하지 않으며, 이용자는 언제든지 정보 삭제를 요청할 수 있습니다.
        </p>
        <p>
          수집 항목: 이름, 연락처, 이메일, 행사 정보, 문의 내용<br />
          이용 목적: 문의 응대, 일정 확인, 견적 및 서비스 안내<br />
          보유 기간: 처리 목적 달성 후 지체 없이 파기합니다.
        </p>
      </div>
    </div>
  `;
}

function setupFooterPrivacyModal() {
  const modal = document.getElementById("footer-privacy-modal");
  const openButton = document.querySelector("[data-privacy-open]");
  const closeButton = document.querySelector("[data-privacy-close]");

  if (!modal || !openButton || !closeButton) return;

  const openModal = () => {
    modal.hidden = false;
    closeButton.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    openButton.focus();
  };

  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
}

function isConfigured(value) {
  return value && !value.includes("REPLACE_WITH");
}

function getKakaoChannelPublicId(channelUrl) {
  const match = channelUrl.match(/pf\.kakao\.com\/([^/?#]+)/);
  return match ? match[1] : channelUrl;
}

function getKakaoChannelChatUrl(channelUrl) {
  const cleanUrl = channelUrl.replace(/\/$/, "");
  return cleanUrl.endsWith("/chat") ? cleanUrl : `${cleanUrl}/chat`;
}

function loadKakaoSdk() {
  if (window.Kakao) return Promise.resolve(window.Kakao);

  const existing = document.querySelector(`script[src="${kakaoSdkScript.src}"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(window.Kakao), { once: true });
      existing.addEventListener("error", reject, { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = kakaoSdkScript.src;
    script.integrity = kakaoSdkScript.integrity;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve(window.Kakao);
    script.onerror = reject;
    document.head.append(script);
  });
}

function setupKakaoTalkChannel() {
  const chatLink = document.querySelector(".social-link.kakao");
  if (!chatLink || !isConfigured(kakaoJavaScriptKey) || !isConfigured(kakaoChannelPublicId)) return;

  chatLink.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      const Kakao = await loadKakaoSdk();

      if (!Kakao.isInitialized()) {
        Kakao.init(kakaoJavaScriptKey);
      }

      Kakao.Channel.chat({
        channelPublicId: kakaoChannelPublicId,
      });
    } catch (error) {
      console.warn("Kakao channel chat failed. Opening fallback URL.", error);
      window.open(kakaoTalkUrl, "_blank", "noopener");
    }
  });
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

function setupImagePreview() {
  if (window.imagePreviewReady) return;

  document.querySelectorAll(".record-photo-main").forEach((trigger) => {
    const image = trigger.querySelector("img");
    if (!image) return;

    trigger.dataset.previewSrc = trigger.dataset.previewSrc || image.getAttribute("src") || "";
    trigger.dataset.previewTitle = trigger.dataset.previewTitle || image.getAttribute("alt") || "";
    trigger.setAttribute("role", "button");
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("aria-label", `${trigger.dataset.previewTitle || "이미지"} 크게 보기`);
  });

  const previewTriggers = document.querySelectorAll("[data-preview-src]");
  if (!previewTriggers.length) return;

  window.imagePreviewReady = true;

  const previewLayer = document.createElement("div");
  previewLayer.className = "image-preview-layer";
  previewLayer.hidden = true;
  previewLayer.innerHTML = `
    <div class="image-preview-card">
      <button class="image-preview-close" type="button" aria-label="닫기">&times;</button>
      <img alt="" />
      <p></p>
    </div>
  `;
  document.body.append(previewLayer);

  const previewImage = previewLayer.querySelector("img");
  const previewTitle = previewLayer.querySelector("p");
  const closeButton = previewLayer.querySelector(".image-preview-close");
  let locked = false;
  let suppressPreviewUntil = 0;

  function openPreview(trigger, lock = false) {
    if (Date.now() < suppressPreviewUntil) return;

    const image = trigger.querySelector("img");
    const src = trigger.dataset.previewSrc || image?.src;
    if (!src) return;

    locked = lock;
    previewImage.src = src;
    previewImage.alt = trigger.dataset.previewTitle || image?.alt || "미리보기 이미지";
    previewTitle.textContent = trigger.dataset.previewTitle || image?.alt || "";
    previewLayer.hidden = false;
    previewLayer.dataset.locked = String(locked);
  }

  function closePreview(force = false) {
    if (locked && !force) return;
    locked = false;
    if (force) suppressPreviewUntil = Date.now() + 350;
    previewLayer.hidden = true;
    previewImage.removeAttribute("src");
    previewLayer.dataset.locked = "false";
  }

  function forceClosePreview(event) {
    event.preventDefault();
    event.stopPropagation();
    closePreview(true);
  }

  previewTriggers.forEach((trigger) => {
    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (supportsHover) {
      trigger.addEventListener("mouseenter", () => openPreview(trigger));
      trigger.addEventListener("mouseleave", () => closePreview());
    }

    trigger.addEventListener("focus", () => {
      if (supportsHover) openPreview(trigger);
    });
    trigger.addEventListener("blur", () => closePreview());
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openPreview(trigger, true);
    });
    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openPreview(trigger, true);
    });
  });

  closeButton.addEventListener("click", forceClosePreview);
  closeButton.addEventListener("pointerup", forceClosePreview);
  closeButton.addEventListener("touchend", forceClosePreview);

  previewLayer.addEventListener("click", (event) => {
    if (event.target === previewLayer || event.target.closest(".image-preview-card")) {
      forceClosePreview(event);
    }
  });

  previewLayer.addEventListener("pointerup", (event) => {
    if (event.target === previewLayer || event.target.closest(".image-preview-card")) {
      forceClosePreview(event);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePreview(true);
  });
}

renderFavicon();
renderHeader();
renderFooter();
syncHomeNavigation();
setupMobileNavigation();
setupImagePreview();
setupFooterPrivacyModal();
setupKakaoTalkChannel();
