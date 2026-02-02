const card = document.getElementById("card");
const playArea = document.getElementById("playArea");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");
const success = document.getElementById("success");
const bgm = document.getElementById("bgm");

let noCount = 0;
let bgmStarted = false;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ---------- Background music (plays once) ---------- */
function startBgmOnce() {
  if (bgmStarted) return;
  bgmStarted = true;

  bgm.volume = 0.25;  // adjust 0.0 -> 1.0
  bgm.loop = true;   // plays once

  bgm.play().catch(() => {
    // If autoplay is blocked, it may still start on the next user interaction.
  });
}

// Start on FIRST interaction anywhere (works with browser autoplay rules)
window.addEventListener("pointerdown", startBgmOnce, { once: true });
window.addEventListener("keydown", startBgmOnce, { once: true });

/* ---------- Button layout ---------- */
function placeButtonsInitial() {
  const padding = 12;
  const gap = 60
  ;

  const areaW = playArea.clientWidth;
  const areaH = playArea.clientHeight;

  // Use offsetWidth/Height (must be visible)
  const yesW = yesBtn.offsetWidth;
  const yesH = yesBtn.offsetHeight;
  const noW = noBtn.offsetWidth;
  const noH = noBtn.offsetHeight;

  // Place both centered as a row near the bottom
  const totalW = yesW + gap + noW;
  const startX = Math.max(padding, Math.floor((areaW - totalW) / 2));
  const y = Math.max(padding, areaH - Math.max(yesH, noH) - 120);

  yesBtn.style.left = `${startX}px`;
  yesBtn.style.top = `${y}px`;

  noBtn.style.left = `${startX + yesW + gap}px`;
  noBtn.style.top = `${y}px`;
}

function moveNoButtonRandom() {
  const padding = 10;

  const areaW = playArea.clientWidth;
  const areaH = playArea.clientHeight;
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  const maxX = Math.max(padding, areaW - btnW - padding);
  const maxY = Math.max(padding, areaH - btnH - padding);

  // Keep No from overlapping too close to the bottom edge row
  const x = randInt(padding, maxX);
  const y = randInt(padding, maxY - 12);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function growYesAndUpdateText() {
  noCount += 1;

  const scale = Math.min(1 + noCount * 0.18, 2.4);
  yesBtn.style.transform = `scale(${scale})`;

  const hints = [
    "“No” seems a bit shy 🙂",
    "are you sure? 😳",
    "c’mon… just click yes 😭",
    "YES is looking pretty good rn 👀",
    "okay you HAVE to say yes now 😌",
    "its pointless to resist!",
    "Search your feelings, you know it to be TRUE!",
    "pwetty pwease!!",
    "wait… not even a little? 🥺",
    "are you positive? 😭",
    "No is acting kinda suspicious…",
    "okay but like… think again 😳",
    "that’s crazy. try Yes 👀",
    "my heart can’t take this 💔",
    "No button is scared today",
    "I saw that hover…",
    "the Yes button is literally right there…",
    "I’ll pretend I didn’t see that",
    "No has left the chat",
    "No is running for a reason",
    "No is taking a day of",
    "No button said ‘nah I’m good",
    "fine… but what if I said please?",
    "error: No not supported ✅",
    "No is unavailable. Please choose Yes."
  ];
  hint.textContent = hints[Math.min(noCount, hints.length - 1)];
}

/* ---------- No button runs away ---------- */
noBtn.addEventListener("pointerenter", () => {
  startBgmOnce();
  moveNoButtonRandom();
  growYesAndUpdateText();
});

// mobile/touch: runs away on tap attempt
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  startBgmOnce();
  moveNoButtonRandom();
  growYesAndUpdateText();
});

/* ---------- Yes click success ---------- */
yesBtn.addEventListener("click", () => {
  startBgmOnce();

  playArea.classList.add("hidden");
  hint.classList.add("hidden");

  success.classList.remove("hidden");
  card.classList.remove("celebrate");

  // Optional confetti
  if (typeof confetti === "function") {
    confetti({ particleCount: 450, spread: 150, origin: { y: 0.6 } });
  }
});

/* ---------- Init ---------- */
window.addEventListener("load", () => {
  placeButtonsInitial();
});

window.addEventListener("resize", () => {
  // Re-center buttons if user resizes the window
  if (!playArea.classList.contains("hidden")) {
    placeButtonsInitial();
  }
});
