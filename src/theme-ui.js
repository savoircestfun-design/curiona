// Le thème et la façon de jouer sont deux choix indépendants.
let themeSearch='';
let lastMilestone=null;
function searchThemes(){return `<div class="theme-search" role="search"><label for="theme-search">${icon('compass')}<span class="sr-only">Rechercher un univers ou un sous-thème</span><input id="theme-search" type="search" placeholder="Trouver un thème… plantes, logique, espace" value="${esc(themeSearch)}" autocomplete="off"></label><span class="search-shortcut" aria-hidden="true">/</span></div><p id="theme-search-empty" class="empty" hidden>Aucun thème trouvé. Essaie un autre mot.</p><span id="theme-search-status" class="sr-only" role="status"></span>`;}
function filterThemeCards(query){
  themeSearch=query;
  const normalize=text=>text.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const term=normalize(query.trim());let matches=0;
  document.querySelectorAll('[data-skill-theme]').forEach(card=>{const c=CATEGORIES.find(c=>c.id===card.dataset.skillTheme),text=normalize([c.name,...c.subs].join(' '));const match=!term||term.split(/\s+/).every(word=>text.includes(word));card.hidden=!match;if(match)matches++;});
  const surprise=document.querySelector('.world-card.surprise');if(surprise)surprise.hidden=!!term;
  const empty=$('#theme-search-empty');if(empty)empty.hidden=matches>0;
  const status=$('#theme-search-status');if(status)status.textContent=term?`${matches} univers trouvé${matches>1?'s':''}`:'';
}
function milestoneCard(q){
  if(lastMilestone?.id!==q.id)return '';
  const parts=[];if(lastMilestone.skill)parts.push(`${q.subtheme} passe au niveau ${lastMilestone.skill}`);if(lastMilestone.player)parts.push(`Explorateur niveau ${lastMilestone.player}`);
  return parts.length?`<div class="milestone-card" role="status">${icon('spark')}<div><strong>Un nouveau palier !</strong><span>${parts.map(esc).join(' · ')}</span></div></div>`:'';
}
const PLAY_STYLES = [
  {id:'learn',label:'Apprendre',icon:'book',description:'Sans chrono, avec une explication après chaque réponse.'},
  {id:'challenge',label:'Défi',icon:'flag',description:'30 secondes par question et un objectif de points.'},
  {id:'relax',label:'Détente',icon:'cup',description:'Une balade tranquille, sans chronomètre.'},
  {id:'review',label:'Révision',icon:'repeat',description:'Les rappels arrivés à échéance dans tes thèmes.'}
];
function scopeOf(config){return config.scope||(['specific','custom'].includes(config.mode)?config.mode==='specific'?'single':'custom':'all');}
function styleOf(config){return ['general','specific','custom'].includes(config.mode)?'learn':config.mode;}
function learningMode(scope){return scope==='single'?'specific':scope==='custom'?'custom':'general';}
function validTheme(key){return typeof key==='string'&&CATEGORIES.some(c=>key===c.id||c.subs.some(s=>key===c.id+'::'+s));}
function normalizeConfig(config){
  const scope=scopeOf(config),themes=Array.isArray(config.themes)?config.themes.filter(validTheme):[];
  return {mode:styleOf(config)==='learn'?learningMode(scope):config.mode,scope,themes:scope==='all'?[]:scope==='single'?themes.slice(0,1):[...new Set(themes)],difficulty:config.difficulty,count:config.count};
}
function themeName(key){const [id,sub]=key.split('::');return sub||CATEGORIES.find(c=>c.id===id)?.name||'Univers';}
function scopeTitle(config){const scope=scopeOf(config);return scope==='all'?'Tous les univers':scope==='single'?themeName(config.themes[0]||'animals'):'Mon mélange';}
function scopeDescription(config){
  const scope=scopeOf(config);
  if(scope==='all')return 'Les 7 univers, au fil de tes découvertes.';
  if(scope==='custom')return config.themes.length?config.themes.map(themeName).join(' · '):'Choisis les thèmes que tu veux réunir.';
  const [id,sub]=(config.themes[0]||'animals').split('::'),c=CATEGORIES.find(c=>c.id===id);
  return sub?c.name:`${c.subs.join(' · ')} · tous les sous-thèmes`;
}
function sessionDescription(config){return `${scopeTitle(config)} · ${PLAY_STYLES.find(s=>s.id===styleOf(config))?.label||'Apprendre'}`;}
function skillMeter(p,label){return `<div class="mini-progress skill-meter" role="progressbar" aria-label="${esc(label)}, expérience vers le niveau ${p.level+1}" aria-valuenow="${Math.round(p.progress)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${p.progress}%"></span></div>`;}
function worldCard(c){
  const p=skillProgress(QUESTIONS,state,c.id);
  return `<article class="world-card theme-card" data-skill-theme="${c.id}"><button class="world-card-main" data-action="category" data-category="${c.id}" aria-label="Explorer ${c.name}, compétence niveau ${p.level}"><span class="world-art" style="background:${c.bg};color:${c.color}">${icon(c.icon)}</span>${icon('arrow','arrow')}<h3>${c.name}</h3><small>${p.total} questions</small><div class="skill-line"><strong>Compétence · Niv. ${p.level}</strong><span>${fmt(p.xp)} XP</span></div>${skillMeter(p,c.name)}</button><div class="subtheme-links" aria-label="Sous-thèmes de ${c.name}">${c.subs.map(sub=>{const key=c.id+'::'+sub,s=skillProgress(QUESTIONS,state,key);return `<button data-action="subtheme" data-theme-key="${esc(key)}"><span>${sub}</span><span class="subtheme-level">Niv. ${s.level} ${icon('arrow')}</span></button>`;}).join('')}</div></article>`;
}
function themeProgressCard(c){
  const p=skillProgress(QUESTIONS,state,c.id);
  return `<article class="progress-card" data-progress-theme="${c.id}"><header style="color:${c.color}">${icon(c.icon)}<div><h3>${c.name}</h3><small>${p.seen} notions découvertes · ${p.mastered} consolidées / ${p.total}</small></div><strong class="skill-level">Niv. ${p.level}</strong></header>${skillMeter(p,c.name)}<div class="progress-meta"><span>${fmt(p.xp)} / ${fmt(p.nextXp)} XP</span><span>${p.answered?p.accuracy+' % de précision':'À découvrir'}</span></div><div class="subtopic-progress-list">${c.subs.map(sub=>{const key=c.id+'::'+sub,s=skillProgress(QUESTIONS,state,key);return `<button class="subtopic-progress" data-action="subtheme" data-theme-key="${esc(key)}"><span class="subtopic-progress-top"><strong>${sub}</strong><span>Niv. ${s.level} ${icon('arrow')}</span></span>${skillMeter(s,sub)}<span class="progress-meta"><span>${fmt(s.xp)} / ${fmt(s.nextXp)} XP</span><span>${s.answered?s.accuracy+' % · '+s.answered+' réponses':'À découvrir'}</span></span><span class="subtopic-adaptive">Questions conseillées : ${DIFFICULTIES[s.adaptiveLevel]}</span></button>`;}).join('')}</div></article>`;
}
function activeSkill(q){const p=skillProgress(QUESTIONS,state,q.category+'::'+q.subtheme);return `<div class="active-skill"><span>${esc(q.subtheme)} · compétence <strong>Niv. ${p.level}</strong></span><small>${fmt(p.xp)} / ${fmt(p.nextXp)} XP</small></div>`;}
function homePlayModes(){return PLAY_STYLES.map(s=>`<button class="mode-card" data-action="setup" data-mode="${s.id}">${icon(s.icon)}<div><h3>${s.label}</h3><p>${s.description}</p></div></button>`).join('');}
function setupSkill(){
  if(setup.scope==='all')return `<p class="setup-skill-note">${icon('leaf')} Chaque univers et sous-thème possède sa propre compétence. Les questions s’adaptent séparément.</p>`;
  if(setup.scope==='custom')return setup.themes.length?`<div class="selected-skill-list">${setup.themes.map(key=>{const p=skillProgress(QUESTIONS,state,key);return `<span class="pill">${esc(themeName(key))} · Niv. ${p.level}</span>`;}).join('')}</div>`:'';
  const key=setup.themes[0],p=skillProgress(QUESTIONS,state,key);
  return `<div class="setup-skill" data-setup-skill="${esc(key)}"><div class="setup-skill-heading"><span>Ta compétence <strong>Niv. ${p.level}</strong></span><small>${fmt(p.xp)} / ${fmt(p.nextXp)} XP</small></div>${skillMeter(p,themeName(key))}<div class="progress-meta"><span>${p.seen} notions découvertes · ${p.mastered} consolidées</span><span>${p.answered?p.accuracy+' % de précision':'À découvrir'}</span></div></div>`;
}
function singleThemeChoices(){
  const [id,sub]=(setup.themes[0]||'animals').split('::'),c=CATEGORIES.find(c=>c.id===id);
  return `<div class="subtheme-tabs" role="group" aria-label="Sous-thème de ${c.name}">${['',...c.subs].map(s=>{const key=s?id+'::'+s:id,p=skillProgress(QUESTIONS,state,key);return `<button data-action="choose-subtheme" data-theme-key="${esc(key)}" aria-pressed="${s===(sub||'')}"><span>${s||'Tout l’univers'}</span><small>Niv. ${p.level}</small></button>`;}).join('')}</div>`;
}
function customThemePicker(openCategories){
  return `<fieldset class="custom-themes"><legend>Les thèmes de ton mélange</legend><div class="theme-choices">${CATEGORIES.map(c=>{const all=setup.themes.includes(c.id);return `<div><label class="theme-check"><input type="checkbox" data-theme="${c.id}" ${all?'checked':''}>${c.name}</label><details class="theme-detail" data-cat="${c.id}" ${openCategories.has(c.id)||setup.themes.some(t=>t.startsWith(c.id+'::'))?'open':''}><summary>Choisir les sous-thèmes</summary><div class="theme-sub">${c.subs.map(sub=>{const key=c.id+'::'+sub;return `<label class="theme-check"><input type="checkbox" data-theme="${esc(key)}" ${all||setup.themes.includes(key)?'checked':''} ${all?'disabled':''}>${sub}</label>`;}).join('')}</div></details></div>`;}).join('')}</div></fieldset>`;
}
function setupDialog(focusKey){
  const dlg=$('#setup-dialog'),scroll=dlg.querySelector('.setup-scroll')?.scrollTop||0,openCategories=new Set([...dlg.querySelectorAll('details[data-cat][open]')].map(d=>d.dataset.cat));
  const style=styleOf(setup),available=setupAvailability(),count=Math.min(setup.count,available),single=setup.scope==='single',c=single?CATEGORIES.find(c=>c.id===setup.themes[0]?.split('::')[0]):null;
  const advice=single&&setup.themes[0].includes('::')?skillProgress(QUESTIONS,state,setup.themes[0]).adaptiveLevel:null;
  dlg.innerHTML=`<div class="dialog-heading"><div><span class="eyebrow" style="color:var(--coral)">Ton exploration</span><h2 id="setup-title">${esc(scopeTitle(setup))}</h2><p>${esc(scopeDescription(setup))}</p></div><button class="close" data-action="close-setup" aria-label="Fermer les réglages">${icon('close')}</button></div><div class="setup-scroll"><div class="theme-summary"><span>${icon(c?.icon||'compass')} <strong>Thèmes choisis</strong></span><button class="text-button" data-action="edit-themes" aria-expanded="${!!setup.editThemes}">${setup.editThemes?'Terminer le choix':'Modifier'}</button></div>${setup.editThemes?`<div class="theme-picker"><div class="scope-options" role="group" aria-label="Choix des thèmes">${[{id:'all',label:'Tous les univers'},{id:'single',label:'Un univers'},{id:'custom',label:'Mon mélange'}].map(s=>`<button data-action="choose-scope" data-scope="${s.id}" aria-pressed="${setup.scope===s.id}">${s.label}</button>`).join('')}</div>${single?`<div class="form-field"><label for="category-select">Univers</label><select id="category-select">${CATEGORIES.map(cat=>`<option value="${cat.id}" ${cat.id===c.id?'selected':''}>${cat.name}</option>`).join('')}</select></div>`:setup.scope==='custom'?customThemePicker(openCategories):'<p class="form-hint">Les questions pourront venir des sept univers.</p>'}</div>`:''}${single?singleThemeChoices():''}${setupSkill()}<div class="field-label play-style-label">Façon de jouer</div><div class="play-styles" role="group" aria-label="Façon de jouer">${PLAY_STYLES.map(s=>`<button class="setup-mode ${style===s.id?'selected':''}" aria-pressed="${style===s.id}" data-action="switch-mode" data-mode="${s.id}">${icon(s.icon)}<span>${s.label}</span></button>`).join('')}</div><p class="play-description">${PLAY_STYLES.find(s=>s.id===style).description}</p><div class="form-row"><div class="form-field"><label for="difficulty">Difficulté des questions</label><select id="difficulty"><option value="adaptive" ${setup.difficulty==='adaptive'?'selected':''}>S’adapter à mon niveau</option>${DIFFICULTIES.slice(1).map((d,i)=>`<option value="${i+1}" ${setup.difficulty===i+1?'selected':''}>${d}</option>`).join('')}</select></div><div class="form-field"><label for="question-count">Nombre de questions</label><select id="question-count">${[8,12,20,50].map(n=>`<option value="${n}" ${setup.count===n?'selected':''}>${n} questions${n===8?' · courte balade':n===12?' · le juste milieu':n===50?' · grand voyage':''}</option>`).join('')}</select></div></div><p class="form-hint">${setup.mode==='review'?'Les rappels portent uniquement sur les thèmes choisis. Une erreur revient après 10 minutes ; une réussite après 1 à 30 jours.':setup.difficulty==='adaptive'?advice?`Conseil actuel : <strong>${DIFFICULTIES[advice]}</strong>. Chaque sous-thème évolue à son rythme.`:'La difficulté suit tes résultats dans chaque sous-thème.':'Tu joueras uniquement des questions du niveau choisi.'} ${setup.mode==='challenge'?`<strong>Objectif : ${count*100} points.</strong>`:''}</p></div><div class="setup-bottom"><small id="availability">${available?`<strong>${available} questions disponibles.</strong> ${count} dans cette partie, sans doublon.${count<setup.count?' La sélection contient '+count+' questions : la partie sera plus courte.':''}`:setup.mode==='review'?'<strong>Aucun rappel disponible pour cette sélection.</strong> Change la difficulté ou reviens après le délai de rappel.':'<strong>Choisis au moins un thème pour commencer.</strong>'}</small><button class="primary" data-action="start" ${available?'':'disabled'}>${style==='review'?'Réviser':style==='challenge'?'Lancer le défi':'Commencer'} ${icon('arrow')}</button></div>`;
  dlg.querySelector('.setup-scroll').scrollTop=scroll;
  if(focusKey){const el=[...dlg.querySelectorAll('button,input,select')].find(el=>el.id===focusKey||el.dataset.theme===focusKey||el.dataset.themeKey===focusKey||el.dataset.mode===focusKey||el.dataset.scope===focusKey||el.dataset.action===focusKey);el?.focus({preventScroll:true});}
}
function openSetup(mode='general',theme,previousConfig){
  if(previousConfig)setup={...normalizeConfig(previousConfig),editThemes:false};
  else if(theme)setup={...setup,mode,scope:'single',themes:[theme],editThemes:false};
  else if(mode==='general')setup={...setup,mode,scope:'all',themes:[],editThemes:false};
  else if(mode==='specific')setup={...setup,mode,scope:'single',themes:[setup.themes[0]||'animals'],editThemes:false};
  else if(mode==='custom')setup={...setup,mode,scope:'custom',themes:setup.scope==='all'?[]:[...setup.themes],editThemes:true};
  else setup={...setup,mode,editThemes:false};
  setup= {...normalizeConfig(setup),editThemes:setup.editThemes};setupDialog();$('#setup-dialog').showModal();$('#setup-dialog .setup-scroll').scrollTop=0;
}
function changeScope(scope){
  const oldStyle=styleOf(setup);setup.scope=scope;
  setup.themes=scope==='all'?[]:scope==='single'?[setup.themes[0]||'animals']:setup.themes;
  if(oldStyle==='learn')setup.mode=learningMode(scope);
  setupDialog(scope);
}
function chooseSubtheme(key){setup.scope='single';setup.themes=[key];if(styleOf(setup)==='learn')setup.mode='specific';setupDialog(key);}
