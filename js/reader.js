(function () {
  const slides = BOOK.slides;
  let current = 0;
  let speaking = false;

  const card = document.getElementById("slideCard");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  function stopSpeech() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    speaking = false;
  }

  function speakText(text) {
    if (!("speechSynthesis" in window)) return;
    stopSpeech();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.92;
    speaking = true;
    utter.onend = () => (speaking = false);
    window.speechSynthesis.speak(utter);
  }

  function introSlideHTML() {
    return `
      <div class="intro-slide">
        <h2>مكتبة الروايات</h2>
        <h3>القصة ورا المكتبة!</h3>
        <p>القراءة من أهم المدخلات اللي تحتاج تركز عليها لتطوير لغتك وسرعة استيعابك. جمعنا لك روايات ممتعة ومقسمة بالمستويات، تختار منها المستوى اللي يناسبك. وكمان تقدر تسمع الرواية بالضغط على زر الصوت 🔊، وتتنقل بين الصفحات من الأسهم.</p>
        <h3>تعليمات مهمة للقراءة</h3>
        <ul class="checklist">
          <li>اقرأ الجولة الأولى بالإنجليزي وحاول تفهم بنفسك قبل أي شي.</li>
          <li>الهدف الأساسي إنك تقرأ بفهم واستيعاب، مو إنك تحفظ كلمات.</li>
          <li>راجع "الكلمات المهمة" في نهاية الرواية.</li>
        </ul>
        <p class="signature">بالتوفيق في رحلتك! 💚</p>
      </div>
    `;
  }

  function chapterSlideHTML(slide) {
    const gradient = `linear-gradient(160deg, ${slide.imageColors[0]}, ${slide.imageColors[1]})`;
    const fullText = slide.paragraphs.join(" ");
    return `
      <h2 class="chapter-title">${slide.chapterTitle}</h2>
      <div class="chapter-image" style="background:${gradient}"></div>
      <div class="chapter-text">
        ${slide.paragraphs.map((p) => `<p>${p}</p>`).join("")}
      </div>
      <button class="listen-btn" id="listenBtn" data-text="${encodeURIComponent(fullText)}" title="استمع للفصل">🔊</button>
    `;
  }

  function vocabSlideHTML(slide) {
    return `
      <div class="vocab-title">الكلمات المهمة</div>
      <table class="vocab-table">
        ${slide.words.map((w) => `<tr><td>${w.en}</td><td>${w.ar}</td></tr>`).join("")}
      </table>
    `;
  }

  function render() {
    stopSpeech();
    const slide = slides[current];
    card.scrollTop = 0;

    if (slide.type === "intro") card.innerHTML = introSlideHTML();
    else if (slide.type === "chapter") card.innerHTML = chapterSlideHTML(slide);
    else if (slide.type === "vocab") card.innerHTML = vocabSlideHTML(slide);

    const dots = slides
      .map((_, i) => `<span class="${i === current ? "active" : ""}"></span>`)
      .join("");
    card.insertAdjacentHTML("beforeend", `<div class="progress-dots">${dots}</div>`);

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;

    const listenBtn = document.getElementById("listenBtn");
    if (listenBtn) {
      listenBtn.addEventListener("click", () => {
        const text = decodeURIComponent(listenBtn.dataset.text);
        speaking ? stopSpeech() : speakText(text);
      });
    }
  }

  function goPrev() {
    if (current > 0) {
      current -= 1;
      render();
    }
  }
  function goNext() {
    if (current < slides.length - 1) {
      current += 1;
      render();
    }
  }

  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goNext();
    if (e.key === "ArrowRight") goPrev();
  });

  let touchStartX = null;
  document.querySelector(".reader-stage").addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });
  document.querySelector(".reader-stage").addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) diff > 0 ? goPrev() : goNext();
    touchStartX = null;
  });

  render();
})();
