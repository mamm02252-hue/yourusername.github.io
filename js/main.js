// Book catalog — add a new object here whenever you publish a new story.
const BOOKS = [
  {
    id: "mystery-house",
    title: "The Mystery House",
    level: "beginner",
    levelLabel: "مبتدئ",
    coverColors: ["#2c3e50", "#12a894"],
    href: "books/mystery-house/read.html",
    comingSoon: false,
  },
  {
    id: "coming-intermediate",
    title: "قريباً",
    level: "intermediate",
    levelLabel: "متوسط",
    coverColors: ["#b56a0c", "#e0a253"],
    href: "#",
    comingSoon: true,
  },
  {
    id: "coming-advanced",
    title: "قريباً",
    level: "advanced",
    levelLabel: "متقدم",
    coverColors: ["#7a2e2e", "#b23b3b"],
    href: "#",
    comingSoon: true,
  },
];

function bookCardHTML(book) {
  const gradient = `linear-gradient(160deg, ${book.coverColors[0]}, ${book.coverColors[1]})`;
  const badgeClass = book.level;
  const disabledAttrs = book.comingSoon ? 'onclick="return false;" aria-disabled="true"' : "";

  return `
    <article class="book-card ${book.comingSoon ? "coming-soon" : ""}" data-level="${book.level}">
      <div class="book-cover" style="background:${gradient}">
        <svg class="cover-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4h9a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4Z" stroke="white" stroke-width="1.4" opacity="0.85"/>
          <path d="M16 7h4v13h-4" stroke="white" stroke-width="1.4" opacity="0.85"/>
        </svg>
        <span class="book-cover-title">${book.title}</span>
      </div>
      <span class="level-badge ${badgeClass}">${book.levelLabel}</span>
      <a class="btn btn-primary" href="${book.href}" ${disabledAttrs}>📖 اقرأ الرواية</a>
      <button class="btn btn-outline share-btn" data-title="${book.title}" data-url="${book.href}">📤 شارك مع من تحب</button>
    </article>
  `;
}

function renderBooks(filter) {
  const grid = document.getElementById("bookGrid");
  const list = filter === "all" ? BOOKS : BOOKS.filter((b) => b.level === filter);
  grid.innerHTML = list.map(bookCardHTML).join("");

  grid.querySelectorAll(".share-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.dataset.title;
      const url = new URL(btn.dataset.url, window.location.href).href;
      if (navigator.share) {
        navigator.share({ title, url }).catch(() => {});
      } else {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(title + " — " + url)}`;
        window.open(waUrl, "_blank");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderBooks("all");
  const select = document.getElementById("levelSelect");
  select.addEventListener("change", () => renderBooks(select.value));
});
