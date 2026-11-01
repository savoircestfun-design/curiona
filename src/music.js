// Composition originale, produite localement : huit accords, quelques notes
// espacées et des enveloppes lentes. Aucun fichier audio ni service distant.
function createCalmMusic() {
  const chords = [
    [48, 55, 60, 64], [45, 52, 57, 60],
    [41, 48, 53, 57], [43, 50, 55, 59],
    [48, 55, 60, 64], [41, 48, 53, 57],
    [45, 52, 57, 60], [43, 50, 55, 59]
  ];
  const melody = [
    [76, 72, 67, 72], [72, 69, 64, 67],
    [69, 72, 65, 69], [71, 67, 74, 67],
    [72, 67, 76, 72], [72, 69, 65, 69],
    [69, 64, 72, 69], [67, 71, 74, 71]
  ];
  const voices = new Set();
  const maxVoices = 24, beatSeconds = 2, lookAhead = 0.32;
  let context = null, master = null, analyser = null, samples = null;
  let timer = null, playing = false, wanted = false, generation = 0;
  let step = 0, nextTime = 0, scheduledNotes = 0, unavailable = false;
  let volumePercent = 35;

  function targetVolume() {
    // Le réglage initial conserve le niveau de la composition d'origine.
    // Le haut du curseur reste plafonné, sans gain disproportionné.
    return volumePercent <= 35
      ? 0.22 * volumePercent / 35
      : Math.min(0.42, 0.22 + 0.2 * (volumePercent - 35) / 65);
  }

  function status() {
    let outputRms = 0;
    if (analyser && context?.state === 'running') {
      analyser.getFloatTimeDomainData(samples);
      let energy = 0;
      for (const value of samples) energy += value * value;
      outputRms = Math.sqrt(energy / samples.length);
    }
    return {
      playing: playing && wanted && context?.state === 'running',
      contextState: context?.state || (unavailable ? 'unavailable' : 'not-created'),
      activeVoices: voices.size,
      scheduledNotes,
      outputRms,
      volume: volumePercent
    };
  }

  function ensureContext() {
    if (context && context.state !== 'closed') return context;
    const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Audio) { unavailable = true; return null; }
    context = new Audio({ latencyHint: 'playback' });
    master = context.createGain();
    master.gain.value = 0;
    const softness = context.createBiquadFilter();
    softness.type = 'lowpass';
    softness.frequency.value = 1450;
    softness.Q.value = 0.45;
    analyser = context.createAnalyser();
    analyser.fftSize = 512;
    samples = new Float32Array(analyser.fftSize);
    master.connect(softness);
    softness.connect(analyser);
    analyser.connect(context.destination);
    return context;
  }

  function hold(parameter, now) {
    if (typeof parameter.cancelAndHoldAtTime === 'function') parameter.cancelAndHoldAtTime(now);
    else {
      const value = parameter.value;
      parameter.cancelScheduledValues(now);
      parameter.setValueAtTime(value, now);
    }
  }

  function setVolume(percent) {
    if (!Number.isFinite(percent)) return status();
    const bounded = Math.max(0, Math.min(100, percent));
    if (bounded === volumePercent) return status();
    volumePercent = bounded;
    // Changer le réglage à l'arrêt ne doit ni interrompre le fondu vers
    // le silence, ni créer un contexte, ni reprendre la partition.
    if (playing && wanted && master && context?.state !== 'closed') {
      const now = context.currentTime;
      hold(master.gain, now);
      master.gain.linearRampToValueAtTime(targetVolume(), now + 0.12);
    }
    return status();
  }

  function release(voice) {
    if (!voices.delete(voice)) return;
    clearTimeout(voice.cleanup);
    voice.oscillator.onended = null;
    try { voice.oscillator.stop(); } catch { /* Déjà terminée. */ }
    voice.oscillator.disconnect();
    voice.gain.disconnect();
    voice.pan?.disconnect();
  }

  function note(midi, time, duration, volume, pad, pan) {
    if (!playing || !wanted || voices.size >= maxVoices) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const stereo = typeof context.createStereoPanner === 'function' ? context.createStereoPanner() : null;
    oscillator.type = pad ? 'triangle' : 'sine';
    oscillator.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    const attack = pad ? 1.25 : 0.065;
    const peak = Math.min(pad ? 0.026 : 0.075, volume);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(peak, time + Math.min(attack, duration / 3));
    if (pad) {
      gain.gain.linearRampToValueAtTime(peak * 0.7, time + Math.max(attack, duration - 1.5));
      gain.gain.linearRampToValueAtTime(0, time + duration);
    } else {
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration - 0.08);
      gain.gain.linearRampToValueAtTime(0, time + duration);
    }
    oscillator.connect(gain);
    if (stereo) {
      stereo.pan.value = Math.max(-0.25, Math.min(0.25, pan));
      gain.connect(stereo);
      stereo.connect(master);
    } else gain.connect(master);
    const voice = { oscillator, gain, pan: stereo, cleanup: null, stopping: false, startTime: time };
    voices.add(voice);
    oscillator.onended = () => release(voice);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.04);
    scheduledNotes = Math.min(1e9, scheduledNotes + 1);
  }

  function pad(chord, time, duration = 8.6) {
    chord.forEach((pitch, index) => note(pitch, time, duration, 0.022, true, (index - 1.5) * 0.12));
  }

  function schedule() {
    if (!playing || !wanted || context.state !== 'running') return;
    if (typeof document !== 'undefined' && document.hidden) { stop(); return; }
    const now = context.currentTime;
    // Un onglet ralenti ne doit pas rattraper en rafale les notes manquées.
    if (nextTime < now - lookAhead) nextTime = now + 0.05;
    let events = 0;
    while (nextTime < now + lookAhead && events < 4) {
      const chordIndex = Math.floor(step / 4), position = step % 4;
      if (position === 0) pad(chords[chordIndex], nextTime);
      const volume = position === 0 ? 0.065 : position === 2 ? 0.052 : 0.043;
      note(melody[chordIndex][position], nextTime + 0.04, 3.1, volume, false, position % 2 ? 0.13 : -0.13);
      step = (step + 1) % 32;
      nextTime += beatSeconds;
      events++;
    }
  }

  async function start() {
    if (typeof document !== 'undefined' && document.hidden) { stop(); return status(); }
    wanted = true;
    if (playing && context?.state === 'running') return status();
    const request = ++generation;
    try {
      const audio = ensureContext();
      if (!audio) { wanted = false; return status(); }
      await audio.resume();
      // stop() ou un nouveau start() a pu intervenir pendant resume().
      if (request !== generation || !wanted || audio.state !== 'running') return status();
      if (typeof document !== 'undefined' && document.hidden) { stop(); return status(); }
      playing = true;
      const now = audio.currentTime;
      hold(master.gain, now);
      master.gain.linearRampToValueAtTime(targetVolume(), now + 0.9);
      nextTime = now + 0.06;
      // Une reprise au milieu d'un accord retrouve doucement sa nappe.
      if (step % 4) pad(chords[Math.floor(step / 4)], nextTime, 8.6 - (step % 4) * beatSeconds);
      if (timer !== null) clearInterval(timer);
      schedule();
      timer = setInterval(schedule, 100);
    } catch {
      if (request === generation) stop();
      // L'absence de sortie audio n'empêche jamais de continuer le quiz.
    }
    return status();
  }

  function stop() {
    wanted = false;
    playing = false;
    generation++;
    if (timer !== null) clearInterval(timer);
    timer = null;
    if (!context || context.state === 'closed') return;
    const now = context.currentTime;
    hold(master.gain, now);
    master.gain.linearRampToValueAtTime(0, now + 0.45);
    for (const voice of voices) {
      if (voice.stopping) continue;
      voice.stopping = true;
      hold(voice.gain.gain, now);
      voice.gain.gain.linearRampToValueAtTime(0, now + 0.42);
      try { voice.oscillator.stop(now + (voice.startTime > now ? 0.01 : 0.46)); } catch { /* Déjà terminée. */ }
      // Nettoyage garanti même si Chrome suspend le temps audio de l'onglet.
      voice.cleanup = setTimeout(() => release(voice), 650);
    }
  }

  return { start, stop, setVolume, getStatus: status };
}
