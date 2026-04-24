const GOOGLE_SCRIPT_URL = "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

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

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length >= 8) return digits.replace(/(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3");
  if (digits.length >= 4) return digits.replace(/(\d{3})(\d{0,4})/, "$1-$2");
  return digits;
}

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
      document.querySelector("#address").value = fullAddress;
      document.querySelector("#address_detail").focus();
    },
  }).open();
}

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

async function handleSubmit(event) {
  event.preventDefault();

  if (GOOGLE_SCRIPT_URL.includes("PASTE_GOOGLE_APPS_SCRIPT")) {
    formStatus.textContent = "Google Apps Script 웹앱 URL을 contact.js에 입력하면 접수가 전송됩니다.";
    formStatus.dataset.state = "warn";
    return;
  }

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
    submitButton.disabled = true;
    formStatus.textContent = "접수가 완료되었습니다. 확인 후 연락드리겠습니다.";
    formStatus.dataset.state = "success";
  } catch (error) {
    formStatus.textContent = "접수 중 오류가 발생했습니다. 카카오톡 또는 이메일로 문의해 주세요.";
    formStatus.dataset.state = "error";
    submitButton.disabled = !privacyAgree.checked;
    console.error("contact form submit error:", error);
  } finally {
    loadingMessage.hidden = true;
  }
}

phoneInput.addEventListener("input", (event) => {
  event.target.value = formatPhone(event.target.value);
});

privacyAgree.addEventListener("change", () => {
  submitButton.disabled = !privacyAgree.checked;
});

findAddress.addEventListener("click", openAddressSearch);
form.addEventListener("submit", handleSubmit);

viewPrivacy.addEventListener("click", () => {
  privacyModal.hidden = false;
});

closePrivacy.addEventListener("click", () => {
  privacyModal.hidden = true;
});

privacyModal.addEventListener("click", (event) => {
  if (event.target === privacyModal) privacyModal.hidden = true;
});
