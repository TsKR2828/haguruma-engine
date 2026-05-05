const SETTINGS_KEY = "haguruma_settings_v1";

const defaults = {
  textSpeed: 18,
  audioVolume: { ambient: 0.6, sfx: 0.8 },
  reducedMotion: false,
  autoplay: false,
  autoplayDelay: 2000,
};

let _current = { ...defaults, audioVolume: { ...defaults.audioVolume } };

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      _current = {
        ...defaults,
        ...saved,
        audioVolume: { ...defaults.audioVolume, ...saved.audioVolume },
      };
    }
  } catch (_) {}
  return _current;
}

export function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(_current));
  } catch (_) {}
}

export function getSettings() {
  return _current;
}

export function updateSettings(partial) {
  if (partial.audioVolume) {
    _current = {
      ..._current,
      ...partial,
      audioVolume: { ..._current.audioVolume, ...partial.audioVolume },
    };
  } else {
    _current = { ..._current, ...partial };
  }
  saveSettings();
  return _current;
}

export function resetSettings() {
  _current = { ...defaults, audioVolume: { ...defaults.audioVolume } };
  saveSettings();
  return _current;
}
