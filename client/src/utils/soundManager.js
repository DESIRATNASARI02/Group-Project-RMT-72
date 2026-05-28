let bgMusic = null;
let isBgPlaying = false;

function playAudio(src, volume = 1.0, loop = false) {
  const audio = new Audio(src);

  audio.volume = volume;
  audio.loop = loop;

  audio.play().catch((e) => {
    console.warn("Audio play failed:", e);
  });

  return audio;
}

// =========================
// Background Music
// =========================

export function startBgMusic() {
  if (isBgPlaying) return;

  try {
    bgMusic = playAudio("/sounds/intro.wav", 0.4, true);
    isBgPlaying = true;
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

export function stopBgMusic() {
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
    bgMusic = null;
    isBgPlaying = false;
  }
}

// Tidak dipakai lagi karena sudah tidak pakai AudioContext
export function resumeCtx() {
  return;
}

// =========================
// Sound Effects
// =========================

export function playShotSound() {
  try {
    playAudio("/sounds/shot.wav", 0.7);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

export function playHitSound() {
  try {
    playAudio("/sounds/hit.wav", 0.8);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

export function playSunkSound() {
  try {
    playAudio("/sounds/sunk.wav", 1.0);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

export function playMissSound() {
  try {
    playAudio("/sounds/miss.wav", 0.6);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

// =========================
// Result Sounds
// =========================

export function playWinJingle() {
  stopBgMusic();

  try {
    playAudio("/sounds/win.wav", 0.8);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

export function playLoseJingle() {
  stopBgMusic();

  try {
    playAudio("/sounds/lose.wav", 0.8);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}