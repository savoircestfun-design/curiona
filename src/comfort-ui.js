function musicVolumeControl(){return `<details class="audio-settings"><summary aria-label="Régler le volume de la musique" title="Volume de la musique">${icon('sliders')}</summary><div class="audio-settings-panel"><label for="music-volume">Volume de la musique <output id="music-volume-value" for="music-volume">${state.musicVolume} %</output></label><input id="music-volume" type="range" min="0" max="100" step="5" value="${state.musicVolume}" aria-label="Volume de la musique"><p>Le volume est enregistré dans ce navigateur.</p></div></details>`;}
function updateMusicVolume(value){
  const volume=Number(value);if(!Number.isFinite(volume))return;
  state.musicVolume=Math.max(0,Math.min(100,volume));calmMusic.setVolume(state.musicVolume);
  const output=$('#music-volume-value');if(output)output.textContent=state.musicVolume+' %';
  save();
}
