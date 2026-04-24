document.addEventListener("DOMContentLoaded", () => {

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyDrSbSNWlFIeDeGaSPAxvLbfuhcR5q1Bd5G1tgVBtNZsbuTPRT8ZrFnFLUrkbTieHh/exec";

const form = document.querySelector("#contactForm");
const phoneInput = document.querySelector("#phone");
const privacyAgree = document.querySelector("#privacyAgree");
const submitButton = document.querySelector(".submit-button");
const loadingMessage = document.querySelector("#loading-message");
const formStatus = document.querySelector("#formStatus");
const privacyModal = document.querySelector("#privacy-modal");
const viewPrivacy = document.querySelector("#viewPrivacy");
const closePrivacy = document.querySelector(".close");
const findAddress = document.querySelector("#findAddress");
const addressInput = document.querySelector("#address");

/* =========================
   📞 전화번호 자동 포맷
========================= */
function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length >= 8) return digits.replace(/(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3");
  if (digits.length >= 4) return digits.replace(/(\d{3})(\d{0,4})/, "$1-$2");
  return digits;
}

/* =========================
   📍 주소 검색
========================= */
function openAddressSearch() {
  if (!window.daum?.Postcode) {
    alert("주소 검색을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    return;
  }

  new window.daum.Postcode({
    oncomplete(data) {
      let fullAddress = data.roadAddress || data.jibunAddress;
      const extras = [data.bname, data.buildingName].filter(Boolean).join(", ");
      if (extras) fullAddress += ` (${extras})`;

      addressInput.value = fullAddress;
      document.querySelector("#address_detail").focus();
    },
  }).open();
}

/* =========================
   🚫 중복 실행 방지
========================= */
let isOpening = false;

function safeOpenAddress() {
  if (isOpening) return;
  isOpening = true;

  openAddressSearch();

  setTimeout(() => {
    isOpening = false;
  }, 500);
}

/* =========================
   📦 데이터 구성
========================= */
function buildPayload() {
  const formData = new FormData(form);

  const selectedNeeds = formData.getAll("needs").join(", ");
  formData.delete("needs");
  formData.set("needs", selectedNeeds);

  formData.set("created_at", new Date().toISOString());

  const attachment = formData.get("attachment");
  if (attachment && attachment.name) {
    formData.set("attachment_name", attachment.name);
  } else {
    formData.set("attachment_name", "");
  }

  return formData;
}

/* =========================
   📩 폼 제출
========================= */
async function handleSubmit(event) {
  event.preventDefault();

  loadingMessage.hidden = false;
  submitButton.disabled = true;
  formStatus.textContent = "";
  formStatus.removeAttribute("data-state");

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: buildPayload(),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    form.reset();

    // ✅ UX 개선
    window.scrollTo({ top: 0, behavior: "smooth" });

    formStatus.textContent = "접수가 완료되었습니다. 확인 후 연락드리겠습니다.";
    formStatus.dataset.state = "success";

    alert("접수가 완료되었습니다.");

  } catch (error) {
    formStatus.textContent = "접수 중 오류가 발생했습니다. 카카오톡 또는 이메일로 문의해 주세요.";
    formStatus.dataset.state = "error";

    alert("접수 오류입니다. 다시 시도해주세요.");

    submitButton.disabled = !privacyAgree.checked;
    console.error("contact form submit error:", error);

  } finally {
    loadingMessage.hidden = true;
  }
}

/* =========================
   🎯 이벤트 연결
========================= */

// 전화번호 자동 포맷
phoneInput.addEventListener("input", (event) => {
  event.target.value = formatPhone(event.target.value);
});

// 개인정보 체크
privacyAgree.addEventListener("change", () => {
  submitButton.disabled = !privacyAgree.checked;
});

// ✅ 주소 검색 (핵심 수정 부분)
addressInput.addEventListener("click", safeOpenAddress);
findAddress.addEventListener("click", safeOpenAddress);

// 폼 제출
form.addEventListener("submit", handleSubmit);

// 개인정보 모달
viewPrivacy.addEventListener("click", () => {
  privacyModal.hidden = false;
});

closePrivacy.addEventListener("click", () => {
  privacyModal.hidden = true;
});

privacyModal.addEventListener("click", (event) => {
  if (event.target === privacyModal) privacyModal.hidden = true;
});
});