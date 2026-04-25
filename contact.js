document.addEventListener("DOMContentLoaded", () => {

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyDrSbSNWlFIeDeGaSPAxvLbfuhcR5q1Bd5G1tgVBtNZsbuTPRT8ZrFnFLUrkbTieHh/exec";

  const form = document.querySelector("#contactForm");
  const submitButton = document.querySelector(".submit-button");
  const loadingMessage = document.querySelector("#loading-message");
  const formStatus = document.querySelector("#formStatus");

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async function buildPayload() {
    const obj = {};

    obj.name = document.querySelector("#name")?.value || "";
    obj.phone = document.querySelector("#phone")?.value || "";
    obj.email = document.querySelector("#email")?.value || "";
    obj.request_type = document.querySelector("#request_type")?.value || "";
    obj.event_date = document.querySelector("#event_date")?.value || "";
    obj.venue_type = document.querySelector("#venue_type")?.value || "";
    obj.audience_count = document.querySelector("#audience_count")?.value || "";
    obj.address = document.querySelector("#address")?.value || "";
    obj.address_detail = document.querySelector("#address_detail")?.value || "";
    obj.mic_count = document.querySelector("#mic_count")?.value || "";
    obj.has_system = document.querySelector("#has_system")?.value || "";
    obj.message = document.querySelector("#message")?.value || "";

    const needs = document.querySelectorAll('input[name="needs"]:checked');
    obj.needs = Array.from(needs).map(n => n.value).join(", ");

    const file = document.querySelector("#attachment")?.files[0];

    if (file) {
      const base64 = await toBase64(file);
      obj.file = base64.split(",")[1];
      obj.file_name = file.name;
      obj.file_type = file.type;
    }

    return obj;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    loadingMessage.hidden = false;
    submitButton.disabled = true;

    try {
      const payload = await buildPayload();

      console.log("🔥 payload:", payload); // 디버깅

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // 🔥 핵심
        body: JSON.stringify(payload),
      });

      // no-cors는 응답 못 읽음 → 성공 처리
      form.reset();

      alert("접수 완료");

    } catch (err) {
      alert("오류: " + err.message);
      console.error(err);
    } finally {
      loadingMessage.hidden = true;
      submitButton.disabled = false;
    }
  }

  form.addEventListener("submit", handleSubmit);

});