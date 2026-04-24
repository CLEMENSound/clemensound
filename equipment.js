const previewButtons = document.querySelectorAll("[data-preview-src]");

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

function openPreview(button, lock = false) {
  const image = button.querySelector("img");
  if (!image) return;

  locked = lock;
  previewImage.src = button.dataset.previewSrc;
  previewImage.alt = button.dataset.previewTitle || "장비 사진";
  previewTitle.textContent = button.dataset.previewTitle || "";
  previewLayer.hidden = false;
  previewLayer.dataset.locked = String(locked);
}

function closePreview(force = false) {
  if (locked && !force) return;
  locked = false;
  previewLayer.hidden = true;
  previewImage.removeAttribute("src");
  previewLayer.dataset.locked = "false";
}

previewButtons.forEach((button) => {
  button.addEventListener("mouseenter", () => openPreview(button));
  button.addEventListener("mouseleave", () => closePreview());
  button.addEventListener("focus", () => openPreview(button));
  button.addEventListener("blur", () => closePreview());
  button.addEventListener("click", () => openPreview(button, true));
});

closeButton.addEventListener("click", () => closePreview(true));

previewLayer.addEventListener("click", (event) => {
  if (event.target === previewLayer) closePreview(true);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePreview(true);
});
