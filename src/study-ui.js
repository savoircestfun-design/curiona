let studyConfig={kind:'errors',theme:'all',difficulty:'all',batchSize:20,part:1};
let studyBusy=false;

function currentStudySelection(){return studySelection(QUESTIONS,state,studyConfig);}
function openStudy(config={}){studyConfig={kind:'errors',theme:'all',difficulty:'all',batchSize:20,part:1,...config};navigate('study');}
function renderStudy(){
  const selected=currentStudySelection(),preview=selected.items.slice(0,4),plural=n=>n>1?'s':'';
  const empty=selected.kind==='learn'?'Aucune notion pour cette sélection. Choisis un autre thème ou un autre niveau.':selected.kind==='errors'?'Aucune question manquée dans cette sélection. Tu peux aussi créer une fiche pour apprendre de nouvelles notions.':'Tu n’as pas encore rencontré de question dans cette sélection. Une fiche pour apprendre peut t’aider à commencer.';
  return `<div class="view study-view"><div class="view-header"><div class="eyebrow" style="color:var(--coral)">Le savoir à emporter</div><h1>Mes fiches PDF</h1><p>Retrouve tes erreurs, révise les notions déjà vues ou découvre un thème. Chaque fiche contient les bonnes réponses et leurs explications.</p></div><div class="study-layout"><section class="study-builder" aria-label="Préparer une fiche PDF"><div class="form-field"><label for="study-kind">Le contenu de ma fiche</label><select id="study-kind"><option value="errors" ${selected.kind==='errors'?'selected':''}>Mes questions déjà manquées</option><option value="review" ${selected.kind==='review'?'selected':''}>Réviser les notions déjà vues</option><option value="learn" ${selected.kind==='learn'?'selected':''}>Apprendre de nouvelles notions</option></select><p class="form-hint">${esc(selected.description)}</p></div><div class="form-field"><label for="study-theme">Le thème</label><select id="study-theme"><option value="all" ${selected.theme==='all'?'selected':''}>Tous les univers</option>${CATEGORIES.map(c=>`<optgroup label="${esc(c.name)}"><option value="${c.id}" ${selected.theme===c.id?'selected':''}>${esc(c.name)} - tout l’univers</option>${c.subs.map(sub=>{const key=c.id+'::'+sub;return `<option value="${esc(key)}" ${selected.theme===key?'selected':''}>${esc(sub)}</option>`;}).join('')}</optgroup>`).join('')}</select></div><div class="study-two-fields"><div class="form-field"><label for="study-difficulty">Niveau des questions</label><select id="study-difficulty"><option value="all" ${selected.difficulty==='all'?'selected':''}>Tous les niveaux</option>${DIFFICULTIES.slice(1).map((label,i)=>`<option value="${i+1}" ${selected.difficulty===i+1?'selected':''}>${label}</option>`).join('')}</select></div><div class="form-field"><label for="study-size">Taille de la fiche</label><select id="study-size"><option value="20" ${selected.batchSize===20?'selected':''}>20 notions maximum</option><option value="50" ${selected.batchSize===50?'selected':''}>50 notions maximum</option><option value="all" ${selected.batchSize==='all'?'selected':''}>Toutes les notions de la sélection</option></select></div></div>${selected.questionIds?`<div class="study-session-note">Cette fiche porte sur les questions de la partie choisie.<button class="text-button" data-action="study-all">Voir toutes mes questions</button></div>`:''}<div class="study-part-row"><div class="form-field"><label for="study-part">Partie du thème à télécharger</label><select id="study-part" ${selected.total?'':'disabled'}>${Array.from({length:selected.parts},(_,i)=>`<option value="${i+1}" ${selected.part===i+1?'selected':''}>${i+1} / ${selected.parts}</option>`).join('')}</select></div><p class="save-note">${selected.batchSize==='all'?'Toutes les notions seront réunies dans ce PDF. Un grand thème peut produire un document volumineux.':'Une fiche à la fois, pour avancer à ton rythme. Les autres parties restent disponibles ici.'}</p></div><div class="study-download"><p id="study-count" role="status">${selected.total?`<strong>${selected.items.length} notion${plural(selected.items.length)} dans ce PDF</strong><span>Notions ${selected.start} à ${selected.end} sur ${selected.total} · partie ${selected.part}/${selected.parts}</span>`:'Aucune notion disponible pour le moment.'}</p><button class="primary" data-action="study-pdf" ${selected.total&&!studyBusy?'':'disabled'}>${icon('download')} ${studyBusy?'Préparation…':'Télécharger le PDF'}</button></div><p class="save-note study-privacy">La fiche est créée dans ton navigateur. Le téléchargement ne modifie ni tes points ni ta progression.</p></section><aside class="study-preview" aria-label="Aperçu du contenu"><div class="eyebrow">Dans cette fiche</div><h2>${esc(selected.title)}</h2><p class="muted">${esc(selected.themeLabel)}${selected.difficulty==='all'?'':' · '+esc(DIFFICULTIES[selected.difficulty])}</p>${selected.total?`<ol start="${selected.start}" class="study-preview-list">${preview.map(item=>`<li><span>${esc(item.question.subtheme)} · ${esc(item.difficulty)}</span><p>${esc(item.question.question)}</p></li>`).join('')}</ol>${selected.items.length>preview.length?`<p class="save-note">Et ${selected.items.length-preview.length} autres notions dans ce PDF.</p>`:''}<p class="study-preview-help">Dans le PDF : la question, la bonne réponse et l’explication.${selected.kind==='errors'?' La dernière réponse incorrecte enregistrée est aussi indiquée.':''}</p>`:`<div class="empty study-empty"><p>${empty}</p>${selected.kind==='learn'?'':'<button class="secondary" data-action="study-learn">Préparer une fiche pour apprendre</button>'}</div>`}</aside></div></div>`;
}
function studyRefresh(focusId){
  render();
  if(focusId)document.getElementById(focusId)?.focus({preventScroll:true});
}
function studyChange(el){
  const properties={'study-kind':'kind','study-theme':'theme','study-difficulty':'difficulty','study-size':'batchSize','study-part':'part'};
  const property=properties[el.id];if(!property)return false;
  studyConfig[property]=property==='part'||(property==='batchSize'&&el.value!=='all')?Number(el.value):el.value;
  if(property!=='part')studyConfig.part=1;
  if(property==='kind')delete studyConfig.questionIds;
  studyRefresh(el.id);return true;
}
function studyAction(el){
  switch(el.dataset.action){
    case 'study':openStudy();return true;
    case 'study-learn':studyConfig={...studyConfig,kind:'learn',part:1};delete studyConfig.questionIds;studyRefresh('study-kind');return true;
    case 'study-all':delete studyConfig.questionIds;studyConfig.part=1;studyRefresh('study-kind');return true;
    case 'study-pdf':
      if(studyBusy)return true;
      studyBusy=true;el.disabled=true;el.setAttribute('aria-busy','true');
      downloadStudyPdf().then(()=>notify('Ta fiche PDF a été téléchargée.')).catch(error=>{console.error(error);notify('Le PDF n’a pas pu être créé. Réessaie dans un instant.');}).finally(()=>{studyBusy=false;if(view==='study')studyRefresh('study-pdf');});
      return true;
    default:return false;
  }
}

function studyPdfText(text){return String(text??'').replace(/[\u2010-\u2015\u2212]/g,'-').replace(/\u00a0/g,' ');}
function studyPdfFilename(selection){
  const slug=selection.themeLabel.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  return `curiona-${selection.kind==='errors'?'erreurs':selection.kind==='review'?'revision':'apprendre'}-${slug}-partie-${selection.part}.pdf`;
}
// jsPDF et les fontes sont des ressources locales : aucune requête vers un CDN.
async function downloadStudyPdf(selection=currentStudySelection(),{download=true}={}){
  if(!selection.items?.length)throw Error('Aucune notion à exporter.');
  if(!window.jspdf?.jsPDF||!window.CurionaPdfFonts)throw Error('Les ressources PDF ne sont pas chargées.');
  // Laisser au navigateur le temps d'afficher l'état de préparation.
  await new Promise(resolve=>setTimeout(resolve,0));
  const doc=new window.jspdf.jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true,putOnlyUsedFonts:true});
  doc.addFileToVFS('CurionaSans.ttf',window.CurionaPdfFonts.regular);doc.addFont('CurionaSans.ttf','CurionaSans','normal');
  doc.addFileToVFS('CurionaSans-Bold.ttf',window.CurionaPdfFonts.bold);doc.addFont('CurionaSans-Bold.ttf','CurionaSans','bold');
  doc.setFont('CurionaSans','normal');
  doc.setProperties({title:`Curiona - ${selection.title} - ${selection.themeLabel}`,subject:'Questions et explications pour apprendre et réviser',author:'Curiona',keywords:'quiz,apprentissage,révision'});
  const margin=18,width=174,bottom=276,green=[40,78,62],ink=[35,49,43],muted=[93,104,96],coral=[160,73,51];let y=18;
  const lines=(text,size=9.5,bold=false)=>{doc.setFont('CurionaSans',bold?'bold':'normal');doc.setFontSize(size);return doc.splitTextToSize(studyPdfText(text),width);};
  function continuation(){
    doc.addPage();doc.setFont('CurionaSans','bold');doc.setFontSize(8);doc.setTextColor(...green);doc.text('CURIONA',margin,17);
    doc.setFont('CurionaSans','normal');doc.setTextColor(...muted);doc.setFontSize(7.5);doc.text(studyPdfText(selection.themeLabel),margin+27,17,{maxWidth:147});doc.setDrawColor(215,222,210);doc.line(margin,22,192,22);y=31;
  }
  function block(text,{size=9.5,bold=false,color=ink,leading=4.8,after=3,url}={}){
    const wrapped=lines(text,size,bold);
    for(const line of wrapped){
      if(y+leading>bottom)continuation();
      doc.setFont('CurionaSans',bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(...color);doc.text(line,margin,y);
      if(url)doc.link(margin,y-leading+1,Math.min(width,doc.getTextWidth(line)),leading,{url});
      y+=leading;
    }
    y+=after;
  }
  doc.setFont('CurionaSans','bold');doc.setFontSize(20);doc.setTextColor(...green);doc.text('curiona.',margin,y+5);y+=17;
  block(selection.title,{size:16,bold:true,color:green,leading:7,after:3});
  block(selection.themeLabel,{size:10,color:muted,leading:5,after:2});
  block(`Notions ${selection.start} à ${selection.end} sur ${selection.total} - Partie ${selection.part}/${selection.parts}${selection.difficulty==='all'?'':' - '+DIFFICULTIES[selection.difficulty]}`,{size:8,color:muted,leading:4.2,after:2});
  block(`Créée le ${new Date().toLocaleDateString('fr-FR')}`,{size:8,color:muted,leading:4.2,after:5});
  const intro=selection.kind==='errors'?'Ces questions ont été manquées au moins une fois. Compare la réponse choisie à la correction, puis reformule l’explication avec tes propres mots.':selection.kind==='review'?'Commence par retrouver la réponse de mémoire. Lis ensuite l’explication pour vérifier ton raisonnement et consolider la notion.':'Lis chaque question et essaie d’y répondre. Découvre ensuite la réponse et son explication pour construire tes repères.';
  block(intro,{size:9,color:muted,leading:4.5,after:8});
  for(const [index,item] of selection.items.entries()){
    const q=item.question,question=`${selection.start+index}. ${q.question}`;
    const pieces=[
      {text:`${item.category} / ${q.subtheme} / ${item.difficulty}`,options:{size:8,color:muted,leading:4,after:3}},
      {text:question,options:{size:11,bold:true,color:ink,leading:5.4,after:4}},
      ...(selection.kind==='errors'?[{text:`Ta dernière réponse incorrecte : ${item.wrong?.text||'Réponse non enregistrée.'}`,options:{size:9.5,color:coral,leading:4.8,after:3}}]:[]),
      {text:`La bonne réponse : ${item.answer}`,options:{size:9.5,bold:true,color:green,leading:4.8,after:3}},
      {text:q.explanation,options:{size:9.5,color:ink,leading:4.8,after:4}},
      ...(q.tip?[{text:`Pour retenir : ${q.tip}`,options:{size:9,color:muted,leading:4.5,after:3}}]:[]),
      ...(q.source?.startsWith('https://')?[{text:`Source : ${q.source}`,options:{size:7.2,color:muted,leading:3.8,after:4,url:q.source}}]:[])
    ];
    const height=pieces.reduce((sum,p)=>sum+lines(p.text,p.options.size,p.options.bold).length*p.options.leading+p.options.after,0)+8;
    if(y+Math.min(height,bottom-31)>bottom)continuation();
    doc.setDrawColor(218,224,214);doc.line(margin,y-3,192,y-3);
    for(const piece of pieces)block(piece.text,piece.options);
    y+=8;
  }
  const pages=doc.getNumberOfPages();
  for(let page=1;page<=pages;page++){
    doc.setPage(page);doc.setDrawColor(215,222,210);doc.line(margin,282,192,282);doc.setTextColor(...muted);doc.setFont('CurionaSans','normal');doc.setFontSize(7.5);doc.text('Curiona - Apprendre à son rythme',margin,288);doc.text(`${page} / ${pages}`,192,288,{align:'right'});
  }
  if(download)doc.save(studyPdfFilename(selection));
  return doc;
}
