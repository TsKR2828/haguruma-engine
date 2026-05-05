let _ctx = null;
let _ambientSource = null;
let _ambientGain = null;
const _cache = {};

let _ambientVol = 0.6;
let _sfxVol = 0.8;

function ctx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

async function fetchBuffer(url) {
  if (_cache[url]) return _cache[url];
  try {
    const ac = ctx();
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    const decoded = await ac.decodeAudioData(buf);
    _cache[url] = decoded;
    return decoded;
  } catch (e) {
    console.warn("Audio load failed:", url, e);
    return null;
  }
}

export async function playAmbient(url, { loop = true, fadeIn = 1.5 } = {}) {
  if (!url) return;
  const ac = ctx();
  const buffer = await fetchBuffer(url);
  if (!buffer) return;

  if (_ambientSource) stopAmbient(1.0);

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, ac.currentTime);
  gain.gain.linearRampToValueAtTime(_ambientVol, ac.currentTime + fadeIn);
  gain.connect(ac.destination);

  const source = ac.createBufferSource();
  source.buffer = buffer;
  source.loop = loop;
  source.connect(gain);
  source.start();

  _ambientSource = source;
  _ambientGain = gain;
}

export function stopAmbient(fadeOut = 1.5) {
  if (!_ambientGain || !_ambientSource) return;
  const ac = ctx();
  const g = _ambientGain;
  const s = _ambientSource;
  g.gain.linearRampToValueAtTime(0, ac.currentTime + fadeOut);
  setTimeout(() => {
    try { s.stop(); } catch (_) {}
  }, fadeOut * 1000 + 100);
  _ambientSource = null;
  _ambientGain = null;
}

export async function playSfx(url) {
  if (!url || _sfxVol <= 0) return;
  const ac = ctx();
  const buffer = await fetchBuffer(url);
  if (!buffer) return;

  const gain = ac.createGain();
  gain.gain.value = _sfxVol;
  gain.connect(ac.destination);

  const source = ac.createBufferSource();
  source.buffer = buffer;
  source.connect(gain);
  source.start();
}

export function stopAllAudio(fadeOut = 1.5) {
  stopAmbient(fadeOut);
}

export function setVolumes({ ambientVol, sfxVol } = {}) {
  if (ambientVol !== undefined) _ambientVol = ambientVol;
  if (sfxVol !== undefined) _sfxVol = sfxVol;
  if (_ambientGain) {
    const ac = ctx();
    _ambientGain.gain.linearRampToValueAtTime(_ambientVol, ac.currentTime + 0.3);
  }
}
