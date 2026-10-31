// Une invitation simple, calculée sur le carnet sans modifier la progression.
function nextRecallText(){const now=Date.now(),next=Math.min(...Object.values(state.questions).map(q=>q.nextDue).filter(t=>t>now));return Number.isFinite(next)?`Prochain rappel ${formatRecallDelay(next-now)}.`:'Tes découvertes prennent racine.';}
function formatRecallDelay(ms) {
  if (ms <= 0) return 'maintenant';
  const minutes = Math.max(1, Math.ceil(ms / 60000));
  if (minutes < 60) return `dans ${minutes} minute${minutes > 1 ? 's' : ''}`;
  const hours = Math.ceil(ms / 3600000);
  if (hours < 24) return `dans ${hours} heure${hours > 1 ? 's' : ''}`;
  const days = Math.ceil(ms / 86400000);
  return `dans ${days} jour${days > 1 ? 's' : ''}`;
}
function discoveryCard() {
  const now = Date.now();
  const seen = QUESTIONS.filter(q => state.questions[q.id]?.seen > 0);
  const due = seen.filter(q => state.questions[q.id].nextDue <= now);
  if (due.length) {
    return `<section class="discovery-card" aria-label="Suggestion de découverte"><span class="discovery-icon">${icon('repeat')}</span><div class="discovery-copy"><h3>Un petit rappel ?</h3><p>${due.length} notion${due.length > 1 ? 's sont prêtes' : ' est prête'} à être retrouvée${due.length > 1 ? 's' : ''}. Quelques minutes pour leur donner de belles racines.</p></div><button class="secondary discovery-action" data-action="setup" data-mode="review" data-scope="all">Retrouver mes notions ${icon('arrow')}</button></section>`;
  }
  const themes = CATEGORIES.flatMap(c => c.subs.map(sub => ({ key: `${c.id}::${sub}`, name: sub, category: c.name })));
  let selected;
  let title;
  let description;
  if (!seen.length) {
    const date = new Date();
    const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
    selected = themes[((day % themes.length) + themes.length) % themes.length];
    title = 'La découverte du jour';
    description = `${selected.name}, dans ${selected.category} : une petite porte ouverte sur quelque chose de nouveau.`;
  } else {
    selected = themes.map(theme => ({ ...theme, seen: skillProgress(QUESTIONS, state, theme.key).seen })).sort((a, b) => a.seen - b.seen)[0];
    const next = Math.min(...seen.map(q => state.questions[q.id].nextDue).filter(t => t > now));
    title = 'Et si tu changeais d’horizon ?';
    description = `${selected.name} t’attend. ${Number.isFinite(next) ? `Ton prochain rappel revient ${formatRecallDelay(next - now)}.` : 'Tes rappels reviendront au fil de tes découvertes.'}`;
  }
  return `<section class="discovery-card" aria-label="Suggestion de découverte"><span class="discovery-icon">${icon('compass')}</span><div class="discovery-copy"><h3>${title}</h3><p>${esc(description)}</p></div><button class="secondary discovery-action" data-action="subtheme" data-theme-key="${esc(selected.key)}">Explorer ${esc(selected.name)} ${icon('arrow')}</button></section>`;
}
