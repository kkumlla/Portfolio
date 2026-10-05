const stack = document.getElementById("stack");
const cat = document.querySelector(".cat-rider");
const tabs = [...document.querySelectorAll(".tab")];
const buttons = tabs.filter((t) => t.tagName === "BUTTON");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let active = tabs[0]; // kucing mulai di tab judul

// Taruh kucing di atas tab yang aktif, di sisi kanan tab
function place() {
  const s = stack.getBoundingClientRect();
  const t = active.getBoundingClientRect();
  cat.style.left = t.right - s.left - cat.offsetWidth * 0.9 + "px";
  cat.style.top = t.top - s.top - cat.offsetHeight + 4 + "px";
}

// Posisi tab bergeser saat map membuka atau menutup, jadi kucing ikut dipantau sebentar
function track(ms = 700) {
  const end = performance.now() + ms;
  (function step() {
    place();
    if (performance.now() < end) requestAnimationFrame(step);
  })();
}

function hop() {
  if (reduce) return;
  cat.classList.remove("hop");
  void cat.offsetWidth; // memulai ulang animasi
  cat.classList.add("hop");
}

function toggle(btn) {
  const willOpen = btn.getAttribute("aria-expanded") !== "true";
  buttons.forEach((b) => {
    b.setAttribute("aria-expanded", "false");
    b.closest(".folder").classList.remove("open");
  });
  if (willOpen) {
    btn.setAttribute("aria-expanded", "true");
    btn.closest(".folder").classList.add("open");
    active = btn;
    // geser halaman supaya map yang dibuka naik ke dekat atas layar
    setTimeout(() => btn.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), 480);
  } else {
    active = tabs[0]; // semua tertutup: kucing kembali ke judul
  }
  hop();
  track();
}

buttons.forEach((b) => b.addEventListener("click", () => toggle(b)));
addEventListener("resize", place);
addEventListener("load", () => {
  place();
  requestAnimationFrame(() => cat.classList.add("ready")); // animasi geser aktif setelah posisi awal
});
if (document.fonts) document.fonts.ready.then(place);

const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');

function openLightbox(srcList) {
  lightboxContent.innerHTML = '';
  lightboxContent.classList.toggle('multi', srcList.length > 1);

  srcList.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src.trim();
    img.alt = srcList.length > 1 ? `Sertifikat halaman ${i + 1}` : 'Sertifikat';
    lightboxContent.appendChild(img);
  });

  lightbox.hidden = false;
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxContent.innerHTML = '';
}

// Klik link "Lihat sertifikat"
document.addEventListener('click', e => {
  const opener = e.target.closest('.open-lightbox');
  if (opener) {
    e.preventDefault();
    openLightbox(opener.dataset.src.split(','));
  }
});

// Klik latar hitam -> tutup (klik di fotonya tidak menutup)
lightbox.addEventListener('click', e => {
  if (e.target.tagName !== 'IMG') closeLightbox();
});

// Esc -> tutup
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

const bubble = document.getElementById("cat-bubble");
const catSvg = cat.querySelector("svg");
const catLines = [
  { text: "?", angry: false },
  { text: "💢", angry: true },
  { text: "(◣ _ ◢)", angry: true },
  { text: "(ㆆ_ㆆ)", angry: false },
];
let lastLine = -1;
let bubbleTimer;

catSvg.addEventListener("click", () => {
  // pilih kalimat acak, bukan yang sama dengan sebelumnya
  let i;
  do { i = Math.floor(Math.random() * catLines.length); } while (i === lastLine);
  lastLine = i;
  const line = catLines[i];

  bubble.textContent = line.text;
  bubble.classList.add("show");

  cat.classList.remove("angry");
  if (line.angry) {
    void cat.offsetWidth;   // mulai ulang animasi
    cat.classList.add("angry");
  }

  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => bubble.classList.remove("show"), 1800);
});