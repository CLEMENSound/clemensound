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
      alert("주소 검색을 불러오지 못했습니다.");
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
     📁 파일 → Base64 변환
  ========================= */
  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  /* =========================
     📦 데이터 구성 (완전)
  ========================= */
  async function buildPayload() {
    const formData = new FormData(form);
    const obj = {};

    // 기본 값
    formData.forEach((value, key) => {
      if (key !== "attachment") {
        obj[key] = value;
      }
    });

    // 체크박스 처리
    obj.needs = formData.getAll("needs").join(", ");

    obj.created_at = new Date().toISOString();

    // 파일 처리
    const file = formData.get("attachment");

    if (file && file.size > 0) {
      const base64 = await toBase64(file);

      obj.file = base64.split(",")[1];
      obj.file_name = file.name;
      obj.file_type = file.type;
    }

    return obj;
  }

  /* =========================
     📩 폼 제출
  ========================= */
  async function handleSubmit(event) {
    event.preventDefault();

    loadingMessage.hidden = false;
    submitButton.disabled = true;
    formStatus.textContent = "";

    try {
      const payload = await buildPayload();

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();

      form.reset();

      window.scrollTo({ top: 0, behavior: "smooth" });

      formStatus.textContent = "접수가 완료되었습니다.";
      formStatus.dataset.state = "success";

      alert("접수가 완료되었습니다.");

    } catch (error) {
      formStatus.textContent = "접수 실패. 다시 시도해주세요.";
      formStatus.dataset.state = "error";

      alert("접수 오류입니다.");

      submitButton.disabled = !privacyAgree.checked;
      console.error(error);

    } finally {
      loadingMessage.hidden = true;
    }
  }

  /* =========================
     🎯 이벤트 연결
  ========================= */

  phoneInput.addEventListener("input", (e) => {
    e.target.value = formatPhone(e.target.value);
  });

  privacyAgree.addEventListener("change", () => {
    submitButton.disabled = !privacyAgree.checked;
  });

  addressInput.addEventListener("click", safeOpenAddress);

  form.addEventListener("submit", handleSubmit);

  viewPrivacy.addEventListener("click", () => {
    privacyModal.hidden = false;
  });

  closePrivacy.addEventListener("click", () => {
    privacyModal.hidden = true;
  });

  privacyModal.addEventListener("click", (e) => {
    if (e.target === privacyModal) privacyModal.hidden = true;
  });

});