// Les fiches sont des repères personnels : leur lecture n'ajoute ni points ni XP.
let notebookSearch='';
let notebookTheme='all';
function notebookNormalize(text){return String(text).toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function bookmarkedQuestions(){const bank=new Map(QUESTIONS.map(q=>[q.id,q]));return (state.bookmarks||[]).map(id=>bank.get(id)).filter(Boolean);}
function notebookMatches(q){
  if(notebookTheme!=='all'&&q.category!==notebookTheme)return false;
  const c=CATEGORIES.find(c=>c.id===q.category);
  const text=notebookNormalize([q.question,q.subtheme,c?.name,q.options[q.correct],q.explanation,q.tip||''].join(' '));
  return notebookNormalize(notebookSearch.trim()).split(/\s+/).filter(Boolean).every(word=>text.includes(word));
}
function bookmarkButton(q){
  const kept=(state.bookmarks||[]).includes(q.id);
  const label=kept?(view==='notebook'?'Retirer cette fiche':'Fiche gardée'):'Garder cette fiche';
  return `<button class="secondary bookmark-button ${kept?'saved':''}" data-action="bookmark" data-question="${esc(q.id)}" aria-pressed="${kept}">${icon('book')}<span>${label}</span></button>`;
}
function notebookView(){
  const questions=bookmarkedQuestions(),visible=questions.filter(notebookMatches).length;
  return `<div class="view notebook-view"><div class="view-header"><div class="eyebrow" style="color:var(--coral)">Les découvertes à garder près de soi</div><h1>Mes fiches</h1><p>${fmt(questions.length)} fiche${questions.length>1?'s gardées':' gardée'}. Relis les notions utiles à ton rythme, sans chronomètre et sans modifier tes scores.</p></div><div class="notebook-toolbar"><div class="theme-search" role="search"><label for="notebook-search">${icon('compass')}<span class="sr-only">Rechercher dans mes fiches</span><input id="notebook-search" type="search" placeholder="Retrouver une notion, une explication…" value="${esc(notebookSearch)}" autocomplete="off"></label></div><div class="form-field"><label class="sr-only" for="notebook-theme">Filtrer les fiches par univers</label><select id="notebook-theme"><option value="all" ${notebookTheme==='all'?'selected':''}>Tous les univers</option>${CATEGORIES.map(c=>`<option value="${c.id}" ${notebookTheme===c.id?'selected':''}>${c.name}</option>`).join('')}</select></div></div><p id="notebook-results" class="save-note" role="status">${visible} fiche${visible>1?'s':''} affichée${visible>1?'s':''}</p><div class="notebook-list">${questions.map(q=>{
    const c=CATEGORIES.find(c=>c.id===q.category);
    return `<details class="notebook-card" data-notebook-id="${esc(q.id)}" ${notebookMatches(q)?'':'hidden'}><summary><span class="notebook-question">${esc(q.question)}</span><span class="notebook-card-meta"><span class="pill" style="background:${c.bg};color:${c.color}">${esc(c.name)} · ${esc(q.subtheme)}</span><span class="tag muted">${esc(DIFFICULTIES[q.difficulty])}</span></span></summary><div class="notebook-card-body"><p class="notebook-answer"><strong>La bonne réponse : ${esc(q.options[q.correct])}.</strong></p><p>${esc(q.explanation)}</p>${q.tip?`<p class="tip"><strong>Pour retenir.</strong> ${esc(q.tip)}</p>`:''}<div class="notebook-card-actions">${bookmarkButton(q)}${q.source&&q.source.startsWith('https://')?`<a class="source" href="${esc(q.source)}" target="_blank" rel="noopener noreferrer">Consulter la source ↗</a>`:''}</div></div></details>`;
  }).join('')}</div><div id="notebook-empty" class="empty" ${visible?'hidden':''}><h2>${questions.length?'Aucune fiche pour cette recherche':'Ton carnet de fiches commence ici'}</h2><p>${questions.length?'Essaie un autre mot ou choisis tous les univers.':'Après une réponse, utilise « Garder cette fiche » dans la correction pour retrouver ici son explication.'}</p>${questions.length?'':'<button class="primary" data-action="home">Explorer les univers</button>'}</div><p class="save-note">Tes fiches sont sauvegardées sur cet appareil et incluses dans l’export du carnet. Tu peux les retirer à tout moment.</p></div>`;
}
function refreshNotebookFilters(){
  const questions=new Map(bookmarkedQuestions().map(q=>[q.id,q]));let visible=0;
  document.querySelectorAll('[data-notebook-id]').forEach(card=>{const q=questions.get(card.dataset.notebookId),matches=!!q&&notebookMatches(q);card.hidden=!matches;if(matches)visible++;});
  const empty=$('#notebook-empty');if(empty)empty.hidden=visible>0;
  const results=$('#notebook-results');if(results)results.textContent=`${visible} fiche${visible>1?'s':''} affichée${visible>1?'s':''}`;
}
function updateNotebookSearch(el){
  if(el.id==='notebook-search')notebookSearch=el.value;
  if(el.id==='notebook-theme')notebookTheme=el.value==='all'||CATEGORIES.some(c=>c.id===el.value)?el.value:'all';
  refreshNotebookFilters();
}
function toggleBookmark(id){
  const q=QUESTIONS.find(q=>q.id===id);if(!q)return false;
  state.bookmarks ||= [];
  const index=state.bookmarks.indexOf(id),adding=index<0;
  if(adding){if(state.bookmarks.length>=2000){notify('Ton carnet contient déjà 2 000 fiches. Retire une fiche avant d’en ajouter une autre.');return false;}state.bookmarks.unshift(id);}
  else state.bookmarks.splice(index,1);
  save();
  if(view==='notebook'){
    const focusedId=document.activeElement?.dataset?.question;
    render();
    if(focusedId===id)$('#notebook-search')?.focus({preventScroll:true});
  }else{
    document.querySelectorAll('[data-action="bookmark"]').forEach(button=>{if(button.dataset.question!==id)return;button.setAttribute('aria-pressed',String(adding));button.classList.toggle('saved',adding);button.innerHTML=`${icon('book')}<span>${adding?'Fiche gardée':'Garder cette fiche'}</span>`;});
  }
  notify(adding?'Fiche gardée dans Mes fiches.':'Fiche retirée de Mes fiches.');
  return adding;
}
