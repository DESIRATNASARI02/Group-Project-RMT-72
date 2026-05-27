let bgMusic = null;
let isBgPlaying = false;

function playAudio(src, volume = 1.0, loop = false) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.loop = loop;
  audio.play().catch((e) => console.warn("Audio play failed:", e));
  return audio;
}

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
    isBgPlaying = false;
    bgMusic = null;
  }
}

export function resumeCtx() {
  // tidak dibutuhkan untuk file audio
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
    playAudio("/sounds/hit.wav", 1.0);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

export function playMissSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

export function playShotSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    source.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    source.start();
    source.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}

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
    playAudio("/sounds/loseeeee.wav", 0.8);
  } catch (e) {
    console.warn("Audio error:", e);
  }
}