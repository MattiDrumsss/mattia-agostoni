const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=$('#root'),K='portfolio-v3',H=document.documentElement;
let edit=false,t,n=0,LB=[],se=null;

const PAL='<div class="pal"><div class="cols"></div><p class="fnt" data-e></p><button class="ad" data-act="addcol">Aggiungi un colore</button></div>';
const ADDB='<div class="addb"><span>Aggiungi un blocco:</span><button data-act="ab" data-v="t">Testo</button><button data-act="ab" data-v="i">Foto</button><button data-act="ab" data-v="i2">Due foto</button><button data-act="ab" data-v="v">Video</button><button data-act="ab" data-v="q">Citazione</button></div>';
const TL=`<span class="dg" draggable="true" title="Trascina per cambiare l'ordine">Sposta</span><button data-act="cover">Copertina</button><button data-act="img">Galleria</button><details class="mn"><summary>Video</summary><div><button data-act="vfile">Carica un file</button><button data-act="vid">Incolla un link</button></div></details><details class="mn"><summary>Formato</summary><div><button data-act="ar">Automatico (standard)</button><button data-act="ar" data-v="1/1">Quadrato 1:1</button><button data-act="ar" data-v="4/5">Verticale 4:5 (Instagram)</button><button data-act="ar" data-v="3/4">Verticale 3:4</button><button data-act="ar" data-v="2/3">Verticale 2:3 (poster, foto)</button><button data-act="ar" data-v="9/16">Verticale 9:16 (Reel, Stories)</button><button data-act="ar" data-v="210/297">Foglio A4 verticale</button><button data-act="ar" data-v="4/3">Orizzontale 4:3</button><button data-act="ar" data-v="3/2">Orizzontale 3:2 (foto)</button><button data-act="ar" data-v="16/9">Orizzontale 16:9 (video)</button><button data-act="ar" data-v="21/9">Cinema 21:9</button></div></details><details class="mn"><summary>Altro</summary><div><button data-act="cat">Cambia categoria</button><button data-act="prv">Anteprima al passaggio</button><button data-act="ba">Prima e dopo</button><button data-act="ft">Metti o togli da In evidenza</button><button data-act="dr">Nascondi o mostra (bozza)</button><button data-act="dup">Duplica progetto</button><button data-act="del">Elimina progetto</button></div></details>`;
const card=(c='')=>`<article class="card" data-cat="${c}"><div class="media" data-img><img alt=""></div><div class="gal"></div><div class="meta"><h3 data-e>Titolo progetto</h3><p data-e>Descrizione breve, anno</p>${PAL}</div><div class="det"><div class="emb"></div><div class="dsc" data-e></div><div class="bks"></div>${ADDB}</div><div class="tl">${TL}</div></article>`;
const li=(a,b)=>`<li><span data-e>${a}</span>${b?`<a data-e data-l href="#">${b}</a>`:''}<b class="x" data-act="rm">Togli</b></li>`;
const PV=/[?&]pv=1/.test(location.search);
const mqx={pos:0,v:0,drag:false,hover:false,pause:0,W:1,last:0,moved:0,s:1};
const gh=()=>{try{return JSON.parse(localStorage.getItem('portfolio-gh'))}catch(e){return null}},up={},hd={};
const sk=(a,p)=>`<li><span data-e>${a}</span><span class="bar"><i style="--p:${p/100}"></i></span><b class="pc">${p}%</b><input class="rg" type="range" min="0" max="100" value="${p}" aria-label="Percentuale della competenza"><b class="x" data-act="rm">Togli</b></li>`;
const catLi=c=>`<li><a href="#/${encodeURIComponent(c)}" data-c="${c}">${c}</a><span class="n"></span><b class="x" data-act="rncat">Rinomina</b><b class="x" data-act="rmcat">Togli</b></li>`;
const toast=(m,d=4000)=>{const e=$('#ts');e.textContent=m;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),d)};

/* carica contenuto salvato nel browser, oppure quello di partenza */
let saved=false;
try{const s=localStorage.getItem(K);if(s){root.innerHTML=s;saved=true}}catch(e){}
if(!saved&&!root.dataset.init&&!$('#cats').children.length&&!$('#grid').children.length){
  $('#grid').innerHTML=card('Grafica')+card('Video')+card('Fotografia');
  $('#cats').innerHTML=['Grafica','Video','Fotografia'].map(catLi).join('');
  $('#sk').innerHTML=[['Identità visiva',90],['Editoria e impaginazione',85],['Video editing',80],['Motion graphics',70]].map(x=>sk(...x)).join('');
  $('#ct').innerHTML=li('Instagram','@tuonome')+li('Behance','behance.net/tuonome');
  root.dataset.init=1;
}
$$('#sk li').forEach(l=>{if(!$('.bar',l))l.outerHTML=sk($('span',l).textContent,80)});
$$('.card .tl').forEach(t=>t.innerHTML=TL);
$('#lb').innerHTML=`<button class="lbx" data-act="close" aria-label="Chiudi"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div id="lbc"></div><div id="lbn"><button class="lbp" data-act="prev" aria-label="Foto precedente"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button><span id="lbs"></span><button class="lbq" data-act="next" aria-label="Foto successiva"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button></div>`;
$$('#cats li').forEach(l=>{const d=$('[data-act=rmcat]',l);if(d&&!$('[data-act=rncat]',l))d.insertAdjacentHTML('beforebegin','<b class="x" data-act="rncat">Rinomina</b>')});
if(!root.dataset.m1){renCat('Motion','Fotografia');root.dataset.m1=1}
/* nuove sezioni (anche sui contenuti già pubblicati) */
const CVH=`<section id="cv"><div class="sh"><h2>CV</h2></div><ul id="tl"></ul><button class="ad" data-act="addtl">Aggiungi un'esperienza o un titolo di studio</button><a class="dlcv" id="cvl" href="#" download="CV-Mattia-Agostoni.pdf">Scarica il CV</a><button class="ad" data-act="cv">Carica o cambia il CV (PDF)</button></section>`;
const tli=(y,t,d)=>`<li><span class="yr" data-e>${y}</span><div><b data-e>${t}</b><p data-e>${d}</p></div><b class="x" data-act="rm">Togli</b></li>`;
fixIds();
$$('.card').forEach(c=>{
  if(!$('.det',c))$('.meta',c).insertAdjacentHTML('afterend','<div class="det"><div class="emb"></div><div class="dsc" data-e></div></div>');
  if(!$('.pal',c))$('.meta',c).insertAdjacentHTML('beforeend',PAL);
  if(!$('.bks',c))$('.det',c).insertAdjacentHTML('beforeend','<div class="bks"></div>'+ADDB);
});
if(!$('#cv'))$('#chi').insertAdjacentHTML('afterend',CVH);
if(!$('#pn'))$('#grid').insertAdjacentHTML('afterend','<div id="pn"></div>');
if(!$('.th'))$('.nav nav').insertAdjacentHTML('beforeend','<button class="th" data-act="th" aria-label="Cambia tema chiaro o scuro"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 000-18z" fill="currentColor"/></svg></button>');
if(!$('.wr')){const a0=$('.hero .row a');if(a0){const d=document.createElement('div');d.className='acts';a0.replaceWith(d);d.appendChild(a0);d.insertAdjacentHTML('beforeend','<a class="wr" href="#contatti">Scrivimi</a>')}}
if(!$('#feat'))$('#ix').insertAdjacentHTML('beforebegin','<section id="feat"><div class="sh"><h2>In evidenza</h2></div><div id="fw"></div></section>');
if(!$('.avail'))$('.hero h1').insertAdjacentHTML('beforebegin','<div class="avail"><i></i><span data-e>Disponibile per nuovi lavori</span><b class="x" data-act="avail">Mostra o nascondi</b></div>');
const COL=v=>`<span class="col"><i style="background:${v}"></i><b>${v.toUpperCase()}</b><input class="cin" type="color" value="${v}" aria-label="Colore"><b class="x" data-act="rmcol">Togli</b></span>`;
if(!$('#st'))$('#feat').insertAdjacentHTML('afterend','<section id="st" class="stats"><div class="stat" data-k="p"><b>0</b><span>progetti</span></div><div class="stat" data-k="c"><b>0</b><span>categorie</span></div><div class="stat" data-k="v"><b>0</b><span>video</span></div></section>');
if(!$('.rot'))$('.hero h1').insertAdjacentHTML('afterend','<p class="rot" data-w="grafico,video maker,fotografo"><span data-e>Sono</span> <span class="rw"></span><i class="cr"></i><b class="x" data-act="words">Cambia parole</b></p>');
if(!$('.cpl'))$('[data-act=film]').insertAdjacentHTML('afterend','<button class="f cpl" data-act="cpl">Copia link</button>');
if(!$('.upd'))$('footer span').insertAdjacentHTML('afterend','<span class="upd"></span>');
if(!$('#mq'))$('#grid').insertAdjacentHTML('afterend','<div id="mq"><div class="mt"></div></div>');
const BAR=`<div id="bar"><button class="bt" data-act="bar" aria-label="Apri o chiudi l'editor"><svg class="i1" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg><svg class="i2" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="bi">
  <button id="tg" class="sw" data-act="tg"><i></i><span>Modifica</span></button>
  <details class="mn"><summary>+ Aggiungi</summary><div>
    <button data-act="nfoto">Foto</button>
    <button data-act="nvideo">Video</button>
    <button data-act="addcat">Categoria</button>
  </div></details>
  <button data-act="imp" title="Sistema i progetti della pagina senza buchi">Impagina</button>
  <span class="tz"><button data-act="tm" title="Riduci il testo selezionato">A−</button><button data-act="tp" title="Ingrandisci il testo selezionato">A+</button></span>
  <span class="tz"><button data-act="fb" title="Grassetto"><b>B</b></button><button data-act="fi" title="Corsivo"><i>I</i></button><button data-act="fu" title="Sottolineato"><u>U</u></button></span>
  <details class="mn"><summary>Link</summary><div>
    <button data-act="lk">Aggiungi o cambia link</button>
    <button data-act="ulk">Togli link (solo testo)</button>
  </div></details>
  <button class="pb" data-act="pub">Pubblica</button>
  <details class="mn"><summary>⋯</summary><div>
    <button data-act="og">Anteprima del link (WhatsApp, LinkedIn…)</button>
    <button data-act="pvw">Anteprima da telefono</button>
    <button data-act="undo">Annulla ultima pubblicazione</button>
    <button data-act="ico">Logo nella scheda del browser</button>
    <button data-act="rs">Annulla modifiche</button>
    <button data-act="out">Esci</button>
  </div></details>
</div></div>`;
{const b=$('#bar');if(b)b.outerHTML=BAR;else document.body.insertAdjacentHTML('beforeend',BAR);if(!$('#md'))document.body.insertAdjacentHTML('beforeend',`<div id="md"><form id="mf"><h3 id="mt"></h3><input id="mi" autocomplete="off"><div><button type="button" id="mx">Annulla</button><button type="submit">OK</button></div></form></div>`)}
root.dataset.init=1;

const save=()=>{try{localStorage.setItem(K,root.innerHTML.replace(/ contenteditable="true"/g,'').replace(/<video class="pv"[^>]*><\/video>/g,'').replace(/ class="sel"/g,'').replace(/ sel"/g,'"').replace(/<i class="ch"[^>]*>([^<]*)<\/i>/g,'$1').replace(/(<div class="(?:emb|vb)">)[\s\S]*?(<\/div>)/g,'$1$2').replace(/(<div id="pn">)[\s\S]*?(<\/div>)/,'$1$2').replace(/(<div id="fw">)[\s\S]*?(<\/div>)/,'$1$2').replace(/(<div class="mt">)[\s\S]*?(<\/div>)/,'$1$2').replace(/(<span class="rw">)[\s\S]*?(<\/span>)/,'$1$2'))}catch(e){toast('Memoria del browser piena: premi "Scarica index.html" per non perdere le modifiche.')}};
function setEdit(on){
  edit=on;document.body.classList.toggle('edit',on);
  if(on)unsplit();
  $$('[data-e]').forEach(e=>on?e.setAttribute('contenteditable','true'):e.removeAttribute('contenteditable'));
  $('#tg').classList.toggle('on',on);
  if(!on){$$('.sel').forEach(x=>x.classList.remove('sel'));se=null;save();split()}
  buildMq();
}
if(gh()&&!PV){H.classList.add('admin');setEdit(true)}else split();

/* scelta immagine, ridimensionata per non appesantire il sito */
function pick(cb,multi){
  const i=document.createElement('input');i.type='file';i.accept='image/*';i.multiple=!!multi;
  i.onchange=()=>[...i.files].forEach(f=>{const r=new FileReader();
    r.onload=()=>{const im=new Image();im.onload=()=>{
      const k=Math.min(1,1200/Math.max(im.width,im.height)),c=document.createElement('canvas');
      c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
      c.getContext('2d').drawImage(im,0,0,c.width,c.height);
      {const w=c.toDataURL('image/webp',.78);cb(w.startsWith('data:image/webp')?w:c.toDataURL(f.type==='image/png'?'image/png':'image/jpeg',.8))}};im.src=r.result};
    r.readAsDataURL(f)});
  i.click();
}
function emb(u,ap=1){
  let m;
  if(m=u.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/))return`<iframe src="https://www.youtube.com/embed/${m[1]}?autoplay=${ap}" allow="autoplay;fullscreen" allowfullscreen></iframe>`;
  if(m=u.match(/vimeo\.com\/(\d+)/))return`<iframe src="https://player.vimeo.com/video/${m[1]}?autoplay=${ap}" allow="autoplay;fullscreen" allowfullscreen></iframe>`;
  return`<video src="${u}" preload="metadata" controls ${ap?'autoplay ':''}playsinline></video>`;
}
function dl(){
  const w=edit,ad=H.classList.contains('admin');
  setEdit(false);$('#fs').textContent='';H.classList.remove('admin');
  const h='<!DOCTYPE html>\n'+H.outerHTML;
  if(ad)H.classList.add('admin');if(w)setEdit(true);
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([h],{type:'text/html'}));a.download='index.html';a.click();
}

document.addEventListener('click',e=>{
  const T=e.target,l=T.closest('a');
  $$('details.mn[open]').forEach(d=>{if(!d.contains(T))d.removeAttribute('open')});
  if(edit&&l&&l.closest('[data-e]'))e.preventDefault();
  const fb=T.closest('[data-f]');
  if(fb){$$('[data-f]').forEach(b=>b.classList.toggle('on',b===fb));$('#fs').textContent=fb.dataset.f==='Tutti'?'':`.card:not([data-cat=${JSON.stringify(fb.dataset.f)}]){display:none!important}`;return}
  const a=T.closest('[data-act]');
  if(a){
    const c=a.closest('.card'),k=a.dataset.act;
    if(a.closest('details'))a.closest('details').removeAttribute('open');
    if(k==='tg')setEdit(!edit);
    else if(k==='dl')dl();
    else if(k==='rs'){if(confirm('Tornare alla versione del file? Le modifiche non scaricate andranno perse.')){try{localStorage.removeItem(K)}catch(x){}location.reload()}}
    else if(k==='add'){$('#grid').insertAdjacentHTML('beforeend',card(cc()));fl();setEdit(edit);save()}
    else if(k==='del'){if(confirm('Eliminare questo progetto?')){c.remove();fl();save()}}
    else if(k==='vid'){ask('Link YouTube o Vimeo del video (lascia vuoto per togliere il video)',c.dataset.video||'').then(u=>{if(u!==null){u.trim()?c.dataset.video=u.trim():c.removeAttribute('data-video');save()}})}
    else if(k==='ico'){
      const go=s=>{const im=new Image();im.onload=()=>{
        const c2=document.createElement('canvas');c2.width=c2.height=256;
        const z=Math.min(256/im.width,256/im.height),w=im.width*z,h=im.height*z;
        c2.getContext('2d').drawImage(im,(256-w)/2,(256-h)/2,w,h);
        const u=c2.toDataURL('image/png');
        $$('link[rel~=icon],link[rel=apple-touch-icon]').forEach(x=>x.remove());
        document.head.insertAdjacentHTML('beforeend',`<link rel="icon" type="image/png" href="${u}"><link rel="apple-touch-icon" href="${u}">`);
        toast('Logo impostato: guarda la scheda del browser. Poi premi Pubblica.',7000)};im.src=s};
      const L=$('.logo img');
      if(L&&L.getAttribute('src')&&confirm('Vuoi usare il logo che hai già messo in alto a sinistra?\nOK = sì, Annulla = scegli un altro file'))go(L.src);else pick(go);
    }
    else if(k==='imp'){const c0=cc();if(!c0){toast('Apri prima una categoria: l\'impaginazione si imposta pagina per pagina.',5000);return}const A=$$('#cats a').find(x=>x.dataset.c===c0);if(!A)return;A.toggleAttribute('data-lay');applyLay();save();toast(A.hasAttribute('data-lay')?'Impaginazione compatta attivata: niente buchi tra i progetti. Premi Pubblica per metterla online.':'Impaginazione compatta disattivata.',6000)}
    else if(k==='rncat'){const old=$('a',a.closest('li')).dataset.c;ask('Nuovo nome della categoria',old).then(v=>{const u=(v||'').replace(/[<>&"\/]/g,'').trim();if(u&&u!==old&&renCat(old,u)){fl();save();toast('Categoria rinominata in '+u+'. Premi Pubblica per metterla online.',5000)}})}
    else if(k==='ar'){const m=$('.media',c);if(a.dataset.v)m.style.aspectRatio=a.dataset.v;else m.style.removeProperty('aspect-ratio');save();toast('Formato cambiato. Premi Pubblica per metterlo online.',4000)}
    else if(k==='fb'||k==='fi'||k==='fu'){fmt({fb:'bold',fi:'italic',fu:'underline'}[k])}
    else if(k==='lk')setLink();
    else if(k==='ulk')unLink();
    else if(k==='cover'){pick(s=>{$('.media img',c).src=s;save();toast('Copertina aggiornata. Premi Pubblica per metterla online.',5000)})}
    else if(k==='vfile'){vpick(f=>{const p='/video/'+f.name.toLowerCase().replace(/[^a-z0-9.]+/g,'-'),bu=URL.createObjectURL(f);up[bu]={p,f};c.dataset.video=bu;if(!$('.media img',c).getAttribute('src'))frame(f,s=>{$('.media img',c).src=s;save()});save();toast('Video aggiunto al progetto. Ricorda di premere Pubblica.',6000)})}
    else if(k==='addsk'){$('#sk').insertAdjacentHTML('beforeend',sk('Nuova competenza',70));setEdit(edit);save()}
    else if(k==='addct'){$('#ct').insertAdjacentHTML('beforeend',li('Etichetta','link'));setEdit(edit);save()}
    else if(k==='rm'){a.parentNode.remove();save()}
    else if(k==='inv'){$('.logo img').classList.toggle('iv');save()}
    else if(k==='img'){const g=$('.gal',c),n=$$('img',g).length;if(n&&!confirm(`Questo progetto ha già ${n} immagini nella galleria. OK = aggiungine altre, Annulla = svuota la galleria.`)){g.innerHTML='';save();return}pick(s=>{g.insertAdjacentHTML('beforeend',`<img src="${s}" alt="">`);save()},1)}
    else if(k==='cat'){ask('In quale categoria va questo progetto?',c.dataset.cat||'').then(u=>{if(u!==null){c.dataset.cat=u.trim();route();save()}})}
    else if(k==='prv'){vpick(f=>{const p='/anteprime/'+f.name.toLowerCase().replace(/[^a-z0-9.]+/g,'-'),bu=URL.createObjectURL(f);up[bu]={p,f};c.dataset.pv=bu;save();toast('Anteprima aggiunta: passa il mouse sul progetto per vederla.',6000)})}
    else if(k==='ba'){c.toggleAttribute('data-ba');toast(c.hasAttribute('data-ba')?'Prima e dopo attivo: la copertina è il "prima", la prima immagine della galleria è il "dopo".':'Prima e dopo disattivato.');save()}
    else if(k==='reel'){const v=$('.reel');if(confirm('Showreel: vuoi caricare un video dal computer?\nOK = scegli il file, Annulla = scrivi un link o un percorso')){vpick(f=>{const p='/showreel.'+(f.name.split('.').pop()||'mp4').toLowerCase(),bu=URL.createObjectURL(f);up[bu]={p,f};v.src=bu;v.play().catch(()=>{});save()});return}const u=prompt('Percorso del file video (mp4 o webm), es. /showreel.mp4. Vuoto per toglierlo.',v.getAttribute('src')||'');if(u!==null){if(u.trim()){v.src=u.trim();v.play().catch(()=>{})}else v.removeAttribute('src');save()}}
    else if(k==='addcat'){ask('Nome della nuova categoria').then(v=>{const u=(v||'').replace(/[<>&"\/]/g,'').trim();if(u&&!$$('#cats a').some(x=>x.dataset.c===u)){$('#cats').insertAdjacentHTML('beforeend',catLi(u));fl();save();toast('Categoria creata: '+u)}})}
    else if(k==='rmcat'){const l=a.closest('li'),nm=$('a',l).dataset.c;if(confirm(`Eliminare la categoria "${nm}" e tutti i suoi progetti?`)){$$('.card').filter(x=>x.dataset.cat===nm).forEach(x=>x.remove());l.remove();save()}}
    else if(k==='tm'||k==='tp'){if(!se||!se.isConnected)return toast('Clicca prima sul testo che vuoi ingrandire o ridurre.');const z=Math.min(3,Math.max(.4,Math.round(((parseFloat(se.style.zoom)||1)+(k==='tp'?.1:-.1))*100)/100));se.style.zoom=z;toast('Dimensione del testo: '+Math.round(z*100)+'%');save()}
    else if(k==='top')scrollTo({top:0,behavior:'smooth'});
    else if(k==='cpl'){const u=location.href;(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>toast('Link copiato.',2500)).catch(()=>toast(u,6000))}
    else if(k==='words'){const p=a.closest('.rot');ask('Parole che si alternano, separate da virgole',p.dataset.w||'').then(v=>{if(v!==null){p.dataset.w=v.trim();save();toast('Parole aggiornate. Premi Pubblica per metterle online.',4000)}})}
    else if(k==='avail'){const b=a.closest('.avail');b.toggleAttribute('data-off');save();toast(b.hasAttribute('data-off')?'Scritta nascosta ai visitatori.':'Scritta visibile.',3000)}
    else if(k==='ft'){c.toggleAttribute('data-feat');renderFeat();save();toast(c.hasAttribute('data-feat')?'Aggiunto a "In evidenza" nella home.':'Tolto da "In evidenza".',4000)}
    else if(k==='addcol'){$('.cols',c).insertAdjacentHTML('beforeend',COL('#cccccc'));save()}
    else if(k==='rmcol'){a.closest('.col').remove();save()}
    else if(k==='bup'){const b=a.closest('.blk'),p=b.previousElementSibling;if(p){p.before(b);save()}}
    else if(k==='bdn'){const b=a.closest('.blk'),n2=b.nextElementSibling;if(n2){n2.after(b);save()}}
    else if(k==='bdel'){if(confirm('Togliere questo blocco?')){a.closest('.blk').remove();save()}}
    else if(k==='bvl'){const b=a.closest('.blk');ask('Link YouTube o Vimeo del video',b.dataset.v||'').then(u=>{if(u&&u.trim()){b.dataset.v=u.trim();$('.vb',b).innerHTML=emb(u.trim(),0);save()}})}
    else if(k==='ab'){
      const v=a.dataset.v,bks=$('.bks',c),CT=x=>`<div class="bct"><button data-act="bup">Su</button><button data-act="bdn">Giù</button>${x?'<button data-act="bvl">Link</button>':''}<button data-act="bdel">Togli</button></div>`;
      const ph='<div class="bp" data-img><img alt="" loading="lazy"></div>';
      const HB={t:`<div class="blk" data-t="t"><div class="bc b-t" data-e>Scrivi qui il testo…</div>${CT()}</div>`,
        i:`<div class="blk" data-t="i"><div class="bc">${ph}</div>${CT()}</div>`,
        i2:`<div class="blk" data-t="i2"><div class="bc">${ph}${ph}</div>${CT()}</div>`,
        q:`<div class="blk" data-t="q"><div class="bc"><blockquote data-e>“Scrivi qui la frase”</blockquote><p class="qn" data-e>Nome, ruolo</p></div>${CT()}</div>`};
      if(v==='v')ask('Link YouTube o Vimeo del video').then(u=>{if(u&&u.trim()){bks.insertAdjacentHTML('beforeend',`<div class="blk" data-t="v" data-v="${u.trim().replace(/"/g,'')}"><div class="bc"><div class="vb"></div></div>${CT(1)}</div>`);$('.vb',bks.lastElementChild).innerHTML=emb(u.trim(),0);save()}});
      else{bks.insertAdjacentHTML('beforeend',HB[v]);setEdit(true);save()}
    }
    else if(k==='th'){theme(e.clientX,e.clientY)}
    else if(k==='dr'){c.toggleAttribute('data-draft');fl();save();toast(c.hasAttribute('data-draft')?'Progetto nascosto ai visitatori (bozza).':'Progetto di nuovo visibile.',4000)}
    else if(k==='dup'){const n2=c.cloneNode(true);n2.removeAttribute('data-id');n2.removeAttribute('data-draft');$('h3',n2).textContent=$('h3',n2).textContent+' (copia)';c.after(n2);n2.dataset.id=uid(n2,$('h3',n2).textContent);fl();setEdit(true);save();toast('Progetto duplicato.',3000)}
    else if(k==='addtl'){$('#tl').insertAdjacentHTML('beforeend',tli('2026','Titolo o ruolo','Dove e cosa hai fatto'));setEdit(true);save()}
    else if(k==='cv'){const i=document.createElement('input');i.type='file';i.accept='application/pdf';i.onchange=()=>{const f=i.files[0];if(!f)return;if(f.size>10e6)return toast('Il PDF è troppo pesante (massimo 10 MB).');const bu=URL.createObjectURL(f),l=$('#cvl');up[bu]={p:'/cv-mattia-agostoni.pdf',f};l.href=bu;l.setAttribute('data-f','1');save();toast('CV caricato. Premi Pubblica per metterlo online.',5000)};i.click()}
    else if(k==='og')ogSet();
    else if(k==='undo')undoPub();
    else if(k==='pvw')openPv();
    else if(k==='pvc')closePv();
    else if(k==='bar'){const b=$('#bar'),bi=$('.bi',b);if(b.classList.contains('open')){b.classList.remove('full','open');bi.style.maxWidth='0px';$$('#bar details[open]').forEach(d=>d.removeAttribute('open'))}else{b.classList.add('open');bi.style.maxWidth=Math.min(bi.scrollWidth+10,innerWidth*.96-70)+'px';setTimeout(()=>{if(b.classList.contains('open'))b.classList.add('full')},720)}}
    else if(k==='login'){ask('Area riservata: inserisci la password','','password').then(async pw=>{if(!pw)return;try{await doLogin(pw)}catch(err){toast(err.message,7000)}})}
    else if(k==='out'){if(confirm("Uscire dall'editor? Per modificare dovrai reinserire il token.")){localStorage.removeItem('portfolio-gh');location.reload()}}
    else if(k==='pub')pub();
    else if(k==='nfoto'){const ct=tcat();if(!ct)return;let cd=null;pick(s=>{if(!cd){$('#grid').insertAdjacentHTML('beforeend',card(ct));cd=$('#grid').lastElementChild;$('.media img',cd).src=s;toast(`Progetto aggiunto in "${ct}"`)}else $('.gal',cd).insertAdjacentHTML('beforeend',`<img src="${s}" alt="">`);fl();setEdit(true);save()},1)}
    else if(k==='nvideo'){const ct=tcat();if(!ct)return;vpick(f=>{const p='/video/'+f.name.toLowerCase().replace(/[^a-z0-9.]+/g,'-'),bu=URL.createObjectURL(f);up[bu]={p,f};$('#grid').insertAdjacentHTML('beforeend',card(ct));const cd=$('#grid').lastElementChild;cd.dataset.video=bu;$('h3',cd).textContent=f.name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ');frame(f,s=>{$('.media img',cd).src=s;save()});fl();setEdit(true);save();toast(`Video aggiunto in "${ct}"`)})}
    else if(k==='film'){document.body.classList.toggle('film');if(edit)toast('Il rullino si vede quando Modifica è spento.',4000);buildMq()}
    else if(k==='prev')show(n-1);
    else if(k==='next')show(n+1);
    else if(k==='close'){$('#lb').classList.remove('on');$('#lbc').innerHTML=''}
    return;
  }
  const wr=T.closest('.wr');
  if(wr&&!edit){const mm=$('.mail'),hr=mm&&mm.getAttribute('href');if(hr&&/^mailto:/.test(hr)){e.preventDefault();location.href=hr.split('?')[0]+'?subject='+encodeURIComponent('Contatto dal portfolio')+'&body='+encodeURIComponent('Ciao Mattia,\n\n')}return}
  if(!edit&&T.closest('.logo')){if(cc())location.hash='#/';else scrollTo({top:0,behavior:'smooth'});return}
  const im=T.closest('[data-img]');
  if(edit&&im){pick(s=>{$('img',im).src=s;save()});return}
  const co=T.closest('.col');
  if(co&&!edit&&!T.closest('.x')){const hx=$('b',co).textContent;(navigator.clipboard?navigator.clipboard.writeText(hx):Promise.reject()).then(()=>toast('Copiato '+hx,2200)).catch(()=>toast(hx,2200));return}
  const bi=T.closest('.bks img');
  if(!edit&&bi&&bi.getAttribute('src')){LB=[`<img src="${bi.src}" alt="">`];show(0);return}
  const gi=T.closest('.gal img');
  if(!edit&&gi){openC(gi.closest('.card'),[...gi.parentNode.children].indexOf(gi)+1);return}
  const m=T.closest('.media');
  if(!edit&&m){
    {const cd=m.closest('.card');if(document.body.classList.contains('pj'))openC(cd);else location.hash='#/'+encodeURIComponent(cd.dataset.cat)+'/'+cd.dataset.id}
  }
});
document.addEventListener('dblclick',e=>{
  const l=e.target.closest('a[data-l]');
  if(edit&&l){const u=prompt('Indirizzo del link (https://… oppure mailto:…)',l.getAttribute('href'));if(u!==null){l.href=u;save()}}
});
document.addEventListener('keydown',e=>{
  if(!$('#lb').classList.contains('on'))return;
  if(e.key==='Escape'){$('#lb').classList.remove('on');$('#lbc').innerHTML=''}
  if(e.key==='ArrowRight')show(n+1);
  if(e.key==='ArrowLeft')show(n-1);
});
document.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(save,500)});
document.addEventListener('paste',e=>{
  if(e.target.closest('[data-e]')){e.preventDefault();document.execCommand('insertText',false,e.clipboardData.getData('text/plain'))}
});

/* filtri, galleria, prima/dopo, anteprima */
function show(i){
  n=(i+LB.length)%LB.length;
  $('#lbc').innerHTML=LB[n];
  $('#lbs').textContent=LB.length>1?`${n+1} / ${LB.length}`:'';
  $$('#lbn button').forEach(b=>b.style.display=LB.length>1?'':'none');
  $('#lb').classList.add('on');
}
function openC(c,s0=0){
  const im=[$('.media img',c),...$$('.gal img',c)].filter(x=>x.getAttribute('src')).map(x=>x.src);
  if(c.hasAttribute('data-ba')&&im.length>1)LB=[`<div class="ba"><img src="${im[1]}" alt=""><img class="bf" src="${im[0]}" alt="" style="clip-path:inset(0 50% 0 0)"><i style="left:50%"></i><span style="left:12px">Prima</span><span style="right:12px">Dopo</span><input type="range" min="0" max="100" value="50" aria-label="Confronta prima e dopo"></div>`];
  else{LB=im.map(s=>`<img src="${s}" alt="">`);if(c.dataset.video)LB.unshift(emb(c.dataset.video))}
  if(LB.length)show(Math.min(s0+(c.dataset.video&&!c.hasAttribute('data-ba')?1:0),LB.length-1));
}
document.addEventListener('input',e=>{
  if(e.target.matches('.ba input')){const b=e.target.parentNode,v=e.target.value;$('.bf',b).style.clipPath=`inset(0 ${100-v}% 0 0)`;$('i',b).style.left=v+'%'}
});
document.addEventListener('mouseover',e=>{
  const m=e.target.closest('.media');if(!m||edit)return;
  const c=m.closest('.card');
  if(c.dataset.pv&&!$('.pv',m))m.insertAdjacentHTML('beforeend',`<video class="pv" src="${c.dataset.pv}" muted loop autoplay playsinline></video>`);
});
document.addEventListener('mouseout',e=>{
  const m=e.target.closest('.media');
  if(m&&!m.contains(e.relatedTarget))$$('.pv',m).forEach(v=>v.remove());
});
addEventListener('scroll',()=>{$('#pg').style.width=scrollY/Math.max(1,document.body.scrollHeight-innerHeight)*100+'%'});

/* impaginazione compatta e rinomina categorie */
function renCat(old,u){
  const A=$$('#cats a').find(x=>x.dataset.c===old);
  if(!A||$$('#cats a').some(x=>x.dataset.c===u))return false;
  A.dataset.c=u;A.textContent=u;A.href='#/'+encodeURIComponent(u);
  $$('.card').filter(x=>x.dataset.cat===old).forEach(x=>x.dataset.cat=u);
  return true;
}
let lt,tt;
const ro=new ResizeObserver(()=>{cancelAnimationFrame(lt);lt=requestAnimationFrame(lay)});
function lay(){
  const g=$('#grid'),on=g.classList.contains('dense');
  $$('.card',g).forEach(c=>{
    ro.observe(c);
    if(on&&c.offsetHeight)c.style.gridRowEnd='span '+Math.ceil((c.offsetHeight+44)/8);
    else c.style.removeProperty('grid-row-end');
  });
  ro.observe(g);
}
function applyLay(){
  const c=cc(),A=$$('#cats a').find(x=>x.dataset.c===c);
  $('#grid').classList.toggle('dense',!!(A&&A.hasAttribute('data-lay')));
  requestAnimationFrame(lay);
}
new MutationObserver(()=>{cancelAnimationFrame(lt);lt=requestAnimationFrame(lay)}).observe($('#grid'),{childList:true});

/* rullino automatico, parole, numeri, scorciatoie */
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function hc(){try{const h=decodeURIComponent(location.hash.slice(1));return h[0]==='/'?h.slice(1).split('/')[0]:''}catch(e){return ''}}
function buildMq(){
  const t=$('#mq .mt');if(!t)return;
  const c=hc();
  if(!c||!document.body.classList.contains('film')||edit){t.innerHTML='';return}
  const L=$$('.card').filter(x=>x.dataset.cat===c&&!x.hasAttribute('data-draft'));
  const item=x=>{const im=$('.media img',x),sr=im&&im.getAttribute('src'),ar=$('.media',x).style.aspectRatio||'4 / 5',ds=$('p',$('.meta',x));
    return `<a class="mi" href="#/${encodeURIComponent(c)}/${x.dataset.id}" draggable="false"><span class="mm" style="aspect-ratio:${ar}">${sr?`<img src="${sr}" alt="" draggable="false">`:''}</span><b>${esc($('h3',x).textContent)}</b><small>${esc(ds?ds.textContent:'')}</small></a>`};
  const set=L.map(item).join('');
  t.innerHTML=set;
  mqx.W=t.scrollWidth+24;
  t.innerHTML=set.repeat(Math.max(2,Math.ceil(innerWidth*2/Math.max(1,mqx.W))));
  mqx.pos=0;
}
function mqTick(now){
  const el=$('#mq .mt'),dt=Math.min(50,now-(mqx.last||now));mqx.last=now;
  if(el&&el.children.length&&document.body.classList.contains('film')&&!edit){
    if(!mqx.drag){
      if(Math.abs(mqx.v)>.02){mqx.pos-=mqx.v*dt;mqx.v*=Math.pow(.93,dt/16)}
      else if(!reduce){const tg=(mqx.hover||now<mqx.pause)?0:1;mqx.s+=(tg-mqx.s)*Math.min(1,dt*.006);mqx.pos+=.06*dt*mqx.s}
    }
    mqx.pos=((mqx.pos%mqx.W)+mqx.W)%mqx.W;
    el.style.transform=`translate3d(${-mqx.pos}px,0,0)`;
  }
  requestAnimationFrame(mqTick);
}
requestAnimationFrame(mqTick);
document.addEventListener('pointerdown',e=>{
  const m=e.target.closest&&e.target.closest('#mq');if(!m)return;
  mqx.drag=true;mqx.sx=e.clientX;mqx.sp=mqx.pos;mqx.lx=e.clientX;mqx.lt=performance.now();mqx.v=0;mqx.moved=0;
});
document.addEventListener('pointermove',e=>{
  if(!mqx.drag)return;
  const dx=e.clientX-mqx.sx;if(Math.abs(dx)>5)mqx.moved=1;
  mqx.pos=mqx.sp-dx;
  const n=performance.now(),dt=Math.max(1,n-mqx.lt);mqx.v=.8*mqx.v+.2*((e.clientX-mqx.lx)/dt);mqx.lx=e.clientX;mqx.lt=n;
});
document.addEventListener('pointerup',()=>{if(mqx.drag){mqx.drag=false;mqx.pause=performance.now()+2000}});
document.addEventListener('click',e=>{if(mqx.moved&&e.target.closest&&e.target.closest('#mq')){e.preventDefault();e.stopPropagation()}mqx.moved=0},true);
document.addEventListener('mouseover',e=>{mqx.hover=!!(e.target.closest&&e.target.closest('#mq'))});
document.addEventListener('mouseleave',()=>{mqx.hover=false});
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(buildMq,250)});

function rotInit(){
  const p=$('.rot');if(!p)return;
  const w=$('.rw',p);let i=0,j=0,del=false;
  (function step(){
    const words=(p.dataset.w||'').split(',').map(x=>x.trim()).filter(Boolean);
    if(!words.length){w.textContent='';return setTimeout(step,500)}
    if(edit||reduce){w.textContent=words[0];return setTimeout(step,500)}
    const cur=words[i%words.length];
    if(!del){j++;w.textContent=cur.slice(0,j);if(j>=cur.length){del=true;return setTimeout(step,1700)}return setTimeout(step,90)}
    j--;w.textContent=cur.slice(0,j);
    if(j<=0){del=false;i++;return setTimeout(step,350)}
    setTimeout(step,45);
  })();
}
const io2=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){countUp(x.target);io2.unobserve(x.target)}}),{threshold:.4});
function countUp(el){
  $$('.stat',el).forEach(s=>{
    const n=+s.dataset.n||0,b=$('b',s);
    if(reduce){b.textContent=n;return}
    const t0=performance.now();
    (function f(t){const k=Math.min(1,(t-t0)/1400),e=1-Math.pow(1-k,4);b.textContent=Math.round(n*e);if(k<1)requestAnimationFrame(f)})(t0);
  });
}
function stats(){
  const st=$('#st');if(!st)return;
  const P=$$('.card').filter(x=>!x.hasAttribute('data-draft')),d={p:P.length,c:$$('#cats a').length,v:P.filter(x=>x.dataset.video||$('.blk[data-t=v]',x)).length};
  $$('.stat',st).forEach(s=>{const v=d[s.dataset.k];s.dataset.n=v;s.hidden=!v;$('b',s).textContent=0});
  io2.unobserve(st);io2.observe(st);
}
function renderUpd(){
  const u=$('.upd');if(!u)return;
  u.textContent=u.dataset.d?'Aggiornato il '+new Date(u.dataset.d+'T12:00:00').toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'}):'';
}
let baseT=document.title;
document.addEventListener('visibilitychange',()=>{if(document.hidden){baseT=document.title;document.title='Torna a guardare i lavori di Mattia'}else document.title=baseT});
document.addEventListener('keydown',e=>{
  if($('#lb').classList.contains('on')||!document.body.classList.contains('pj'))return;
  const t=e.target;if(t.closest&&t.closest('[contenteditable],input,textarea,select'))return;
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const a=$(`#pn a[data-d="${e.key==='ArrowRight'?'next':'prev'}"]`);if(a)location.hash=a.getAttribute('href')}
});
if(!$('#up'))document.body.insertAdjacentHTML('beforeend','<div id="up" role="button" tabindex="0" aria-label="Torna su" data-act="top"><svg viewBox="0 0 44 44" width="44" height="44" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="22" cy="22" r="20" class="r0"/><circle cx="22" cy="22" r="20" class="r1" stroke-dasharray="125.66" stroke-dashoffset="125.66"/><path d="M15 26l7-7 7 7"/></svg></div>');
addEventListener('scroll',()=>{const u=$('#up'),m=document.documentElement.scrollHeight-innerHeight,p=m>0?scrollY/m:0;u.classList.toggle('on',scrollY>500);$('.r1',u).setAttribute('stroke-dashoffset',125.66*(1-p))},{passive:true});
renderUpd();rotInit();

/* in evidenza, immagini, colori */
function lz(){$$('#root img').forEach(i=>{if(!i.closest('.logo')&&!i.hasAttribute('loading')){i.setAttribute('loading','lazy');i.setAttribute('decoding','async')}})}
function renderFeat(){
  const w=$('#fw');if(!w)return;
  const L=$$('.card').filter(x=>x.hasAttribute('data-feat')&&(edit||!x.hasAttribute('data-draft'))).slice(0,6);
  w.innerHTML=L.map(x=>{const im=$('.media img',x),sr=im&&im.getAttribute('src');return `<a class="fi" href="#/${encodeURIComponent(x.dataset.cat)}/${x.dataset.id}"><span class="fm">${sr?`<img src="${sr}" alt="" loading="lazy">`:''}</span><b>${esc($('h3',x).textContent)}</b><small>${esc(x.dataset.cat)}</small></a>`}).join('');
}
document.addEventListener('input',e=>{
  if(!e.target.matches('.cin'))return;
  const co=e.target.closest('.col'),v=e.target.value;
  $('i',co).style.background=v;$('b',co).textContent=v.toUpperCase();e.target.setAttribute('value',v);
});

/* novità: tema, pagine progetto, anteprime, trascinamento, annulla */
function slug(t){return (t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'progetto'}
function uid(c,t){const b=slug(t);let x=b,n=2;while($$('.card').some(y=>y!==c&&y.dataset.id===x))x=b+'-'+n++;return x}
function fixIds(){$$('.card').forEach(c=>{if(!c.dataset.id)c.dataset.id=uid(c,($('h3',c)||{}).textContent)})}
document.addEventListener('input',e=>{
  const h=e.target.closest&&e.target.closest('.card h3');if(!h)return;
  const c=h.closest('.card'),old=c.dataset.id,nid=uid(c,h.textContent);if(nid===old)return;
  c.dataset.id=nid;
  if(pp()===old){history.replaceState(null,'','#/'+encodeURIComponent(c.dataset.cat)+'/'+nid);cur=cc()+'/'+nid;fsx()}
});
function esc(c){return c.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}
function split(){$$('.hero h1 span[data-e]').forEach(el=>{if(!el.querySelector('i'))el.innerHTML=[...el.textContent].map(c=>`<i class="ch">${esc(c)}</i>`).join('')})}
function unsplit(){$$('.hero h1 span[data-e]').forEach(el=>{if(el.querySelector('i'))el.textContent=el.textContent})}
function theme(x,y){
  const go=()=>{H.classList.toggle('lt');try{localStorage.setItem('portfolio-th',H.classList.contains('lt')?'lt':'dk')}catch(e){}};
  if(!document.startViewTransition||matchMedia('(prefers-reduced-motion:reduce)').matches){go();return}
  H.style.setProperty('--tx',x+'px');H.style.setProperty('--ty',y+'px');
  document.startViewTransition(go);
}
try{if(localStorage.getItem('portfolio-th')==='lt'&&!PV)H.classList.add('lt')}catch(e){}
const mv=(k,n='property')=>{const m=document.head.querySelector(`meta[${n}="${k}"]`);return m?m.content:''};
function ms(k,v,n='property'){let m=document.head.querySelector(`meta[${n}="${k}"]`);if(!m){m=document.createElement('meta');m.setAttribute(n,k);document.head.appendChild(m)}m.content=v}
function ogimg(src,cb){const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=1200;c.height=630;const z=Math.max(1200/im.width,630/im.height),w=im.width*z,h=im.height*z;c.getContext('2d').drawImage(im,(1200-w)/2,(630-h)/2,w,h);cb(c.toDataURL('image/jpeg',.85))};im.src=src}
async function ogSet(){
  const t=await ask("Titolo dell'anteprima (es. Mattia Agostoni, grafico e video maker)",mv('og:title')||document.title);if(t===null)return;
  const d=await ask('Descrizione breve (una frase)',mv('og:description'));if(d===null)return;
  ms('og:title',t);ms('og:description',d);ms('description',d,'name');ms('twitter:card','summary_large_image','name');ms('og:type','website');
  if(t)document.title=t;
  const ok=()=>toast('Anteprima impostata. Premi Pubblica per metterla online.',6000);
  if(confirm("Vuoi scegliere l'immagine dell'anteprima?\nOK = scegli un file, Annulla = lascia quella attuale"))pick(s=>ogimg(s,u=>{ms('og:image',u);ok()}));else ok();
}
async function undoPub(){
  if(!gh()||!confirm("Annullare l'ultima pubblicazione? Il sito tornerà com'era prima."))return;
  try{
    toast('Annullo la pubblicazione...',20000);
    const b=(await api('')).default_branch,ref=(await api('/git/ref/heads/'+b)).object.sha,cm=await api('/git/commits/'+ref);
    if(!/^Aggiornamento portfolio/.test(cm.message)||!cm.parents.length)throw new Error("l'ultimo salvataggio non è una pubblicazione fatta da qui.");
    const pc=await api('/git/commits/'+cm.parents[0].sha);
    const nc=await api('/git/commits',{method:'POST',body:JSON.stringify({message:'Annullata ultima pubblicazione',tree:pc.tree.sha,parents:[ref]})});
    await api('/git/refs/heads/'+b,{method:'PATCH',body:JSON.stringify({sha:nc.sha})});
    try{localStorage.removeItem(K)}catch(e){}
    toast('Fatto! Il sito torna alla versione precedente tra circa un minuto. Ricarico la pagina...',6000);
    setTimeout(()=>location.reload(),2500);
  }catch(err){toast('Non annullata: '+err.message,12000)}
}
if(!$('#pvw'))document.body.insertAdjacentHTML('beforeend','<div id="pvw"><button class="lbx" data-act="pvc" aria-label="Chiudi anteprima"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div id="pvf"></div></div>');
function openPv(){save();$('#pvf').innerHTML=`<iframe src="${location.pathname}?pv=1${location.hash}" title="Anteprima da telefono"></iframe>`;$('#pvw').classList.add('on')}
function closePv(){const w=$('#pvw');if(w){w.classList.remove('on');$('#pvf').innerHTML=''}}
let dr=null;
document.addEventListener('dragstart',e=>{const g=e.target.closest&&e.target.closest('.dg');if(!g)return;dr=g.closest('.card');e.dataTransfer.setData('text/plain','card');e.dataTransfer.setDragImage(dr,30,30);setTimeout(()=>dr&&dr.classList.add('dragging'),0)});
document.addEventListener('dragover',e=>{if(!dr)return;const c=e.target.closest&&e.target.closest('.card');if(!c||c===dr)return;e.preventDefault();const r=c.getBoundingClientRect();c.parentNode.insertBefore(dr,(e.clientX-r.left)<r.width/2?c:c.nextSibling)});
document.addEventListener('dragend',()=>{if(!dr)return;dr.classList.remove('dragging');dr=null;fl();save()});
if(!gh()&&!PV&&!/^(localhost|127\.)/.test(location.hostname)){window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};const sc=document.createElement('script');sc.defer=true;sc.src='/_vercel/insights/script.js';document.head.appendChild(sc)}
function intro(){
  if(gh()||PV||cc()||sessionStorage.getItem('intro'))return;
  try{sessionStorage.setItem('intro','1')}catch(e){}
  const w=$('#wp'),b=$('b',w),W='Mattia Agostoni';
  b.innerHTML='';b.style.fontSize=Math.min(19,170/W.length)+'vw';
  [...W].forEach((ch,i)=>{const sp=document.createElement('span'),it=document.createElement('i');it.textContent=ch===' '?'\u00a0':ch;it.style.setProperty('--i',i);sp.appendChild(it);b.appendChild(sp)});
  w.classList.add('go');document.body.classList.add('tr');
  setTimeout(()=>document.body.classList.remove('tr'),650);
  setTimeout(()=>w.classList.remove('go'),1600);
}

/* formattazione del testo e link */
document.addEventListener('mousedown',e=>{if(e.target.closest('#bar'))e.preventDefault()});
function tsel(){
  if(!edit||!se||!se.isConnected){toast('Attiva Modifica e clicca sul testo da cambiare.');return null}
  const s=getSelection();
  if(!s.rangeCount||s.isCollapsed||!se.contains(s.anchorNode)){const r=document.createRange();r.selectNodeContents(se);s.removeAllRanges();s.addRange(r)}
  return s;
}
function fmt(c){if(!tsel())return;document.execCommand(c);save()}
function swap(el,tag,mod){
  const n=document.createElement(tag);
  [...el.attributes].forEach(a=>{if(!['href','data-l','data-lk','target','rel'].includes(a.name))n.setAttribute(a.name,a.value)});
  mod(n);n.innerHTML=el.innerHTML;el.replaceWith(n);return n;
}
function unLink(){
  if(!edit||!se||!se.isConnected){toast('Attiva Modifica e clicca sul link da togliere.');return}
  if(se.tagName==='A')se=swap(se,se.classList.contains('mail')?'div':'span',n=>n.setAttribute('data-lk','1'));
  else{tsel();document.execCommand('unlink')}
  save();toast('Link tolto: ora è solo testo.');
}
async function setLink(){
  if(!edit||!se||!se.isConnected){toast('Attiva Modifica e clicca sul testo da trasformare in link.');return}
  const s=getSelection(),rg=s.rangeCount?s.getRangeAt(0).cloneRange():null;
  let u=await ask('Indirizzo del link (https://… oppure una mail)',se.tagName==='A'?se.getAttribute('href'):'');
  if(!u||!u.trim())return;
  u=u.trim();
  if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u))u='mailto:'+u;else if(!/^(https?:|mailto:|tel:|\/|#)/.test(u))u='https://'+u;
  if(se.tagName==='A')se.href=u;
  else if(se.hasAttribute('data-lk'))se=swap(se,'a',n=>{n.setAttribute('data-l','');n.href=u});
  else{if(rg){s.removeAllRanges();s.addRange(rg)}tsel();document.execCommand('createLink',false,u)}
  save();toast('Link impostato.');
}

/* finestra di dialogo e accesso con password */
function ask(t,v='',type='text'){
  return new Promise(ok=>{
    const m=$('#md'),i=$('#mi'),f=$('#mf');
    $('#mt').textContent=t;i.type=type;i.value=v;m.classList.add('on');i.focus();
    const end=x=>{m.classList.remove('on');f.onsubmit=null;$('#mx').onclick=null;ok(x)};
    f.onsubmit=e=>{e.preventDefault();end(i.value)};
    $('#mx').onclick=()=>end(null);
  });
}
async function doLogin(pw){
  if(/^(github_pat_|ghp_)/.test(pw)){
    const r=await ask('Nome del repository (utente/repository)',(gh()||{}).repo||'');
    if(!r)return;
    localStorage.setItem('portfolio-gh',JSON.stringify({repo:r.trim(),token:pw.trim()}));location.reload();return;
  }
  const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})});
  if(r.status===401)throw new Error('Password sbagliata');
  if(!r.ok)throw new Error('Accesso non disponibile (errore '+r.status+'). Controlla le impostazioni su Vercel.');
  localStorage.setItem('portfolio-gh',JSON.stringify(await r.json()));location.reload();
}

/* aggiunta contenuti e pubblicazione su GitHub */
function vpick(cb){
  const i=document.createElement('input');i.type='file';i.accept='video/*';
  i.onchange=()=>{const f=i.files[0];if(!f)return;if(f.size>50e6)return toast('Video troppo pesante (massimo 50 MB): comprimilo prima di caricarlo.');cb(f)};
  i.click();
}
function frame(f,cb){
  const v=document.createElement('video');v.muted=true;v.preload='auto';v.src=URL.createObjectURL(f);
  v.onloadeddata=()=>{v.currentTime=Math.min(1,(v.duration||2)/2)};
  v.onseeked=()=>{const c=document.createElement('canvas');c.width=640;c.height=Math.round(640*v.videoHeight/v.videoWidth);c.getContext('2d').drawImage(v,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.8))};
}
function tcat(){
  const c=cc();if(c)return c;
  const l=$$('#cats a').map(x=>x.dataset.c);
  const u=(prompt('In quale categoria? Scrivi il nome ('+l.join(', ')+') oppure uno nuovo.',l[0]||'')||'').replace(/[<>&"\/]/g,'').trim();
  if(!u)return null;
  if(!l.includes(u))$('#cats').insertAdjacentHTML('beforeend',catLi(u));
  return u;
}
async function api(p,o={}){
  const g=gh(),r=await fetch('https://api.github.com/repos/'+g.repo+p,{...o,cache:'no-store',headers:{Authorization:'Bearer '+g.token,Accept:'application/vnd.github+json','Content-Type':'application/json'}});
  if(!r.ok)throw new Error(r.status+' '+(await r.text()).slice(0,140));
  return r.json();
}
const b64=f=>new Promise(ok=>{const r=new FileReader();r.onload=()=>ok(r.result.split(',')[1]);r.readAsDataURL(f)});
const blob=c=>api('/git/blobs',{method:'POST',body:JSON.stringify(c)}).then(x=>x.sha);
async function pub(){
  if(!gh())return;
  if(!confirm('Pubblicare le modifiche sul sito? Saranno online tra circa un minuto.'))return;
  const w=edit,ad=H.classList.contains('admin'),fm=document.body.classList.contains('film');
  setEdit(false);closePv();toast('Pubblico... non chiudere la pagina');
  {const u=$('.upd');if(u){u.dataset.d=new Date().toISOString().slice(0,10);renderUpd()}}
  try{
    $('#fs').textContent='';H.classList.remove('admin');document.body.classList.remove('film');
    let html='<!DOCTYPE html>\n'+H.outerHTML;
    H.classList.add('admin');if(fm)document.body.classList.add('film');
    html=html.replace(/(<div id="(?:wp|fp|lb|ts|md|pvw|up)") class="(?:go|on)"/g,'$1').replace(/ class="sel"/g,'').replace(/ sel"/g,'"').replace(/^(<!DOCTYPE html>\n<html[^>]*?) style="[^"]*"/,'$1').replace(/^(<!DOCTYPE html>\n<html[^>]*?) class="[^"]*"/,'$1').replace(/<i class="ch"[^>]*>([^<]*)<\/i>/g,'$1').replace(/(<div class="(?:emb|vb)">)[\s\S]*?(<\/div>)/g,'$1$2').replace(/(<div id="pn">)[\s\S]*?(<\/div>)/,'$1$2').replace(/(<div id="fw">)[\s\S]*?(<\/div>)/,'$1$2').replace(/(<div class="mt">)[\s\S]*?(<\/div>)/,'$1$2').replace(/(<span class="rw">)[\s\S]*?(<\/span>)/,'$1$2');
    const files=[],mk=[];let i=0;
    for(const u of new Set(html.match(/data:image\/[a-z+]+;base64,[A-Za-z0-9+\/=]+/g)||[])){
      const p=hd[u]||('immagini/'+Date.now()+'-'+(i++)+(u.startsWith('data:image/png')?'.png':u.startsWith('data:image/webp')?'.webp':'.jpg'));
      if(!hd[u]){files.push([p,u.split(',')[1]]);mk.push(()=>hd[u]=p)}
      html=html.split(u).join('/'+p);
    }
    for(const [bu,o] of Object.entries(up)){
      if(!html.includes(bu))continue;
      html=html.split(bu).join(o.p);
      if(!o.d){files.push([o.p.slice(1),await b64(o.f)]);mk.push(()=>o.d=1)}
    }
    html=html.replace(/(<meta property="og:image" content=")\//,'$1'+location.origin+'/');
    const b=(await api('')).default_branch;
    const tree=[];
    for(const [p,c] of files)tree.push({path:p,mode:'100644',type:'blob',sha:await blob({content:c,encoding:'base64'})});
    tree.push({path:'index.html',mode:'100644',type:'blob',sha:await blob({content:html,encoding:'utf-8'})});
    for(let t=0;;t++){
      try{
        const ref=(await api('/git/ref/heads/'+b)).object.sha,cm=await api('/git/commits/'+ref);
        const nt=await api('/git/trees',{method:'POST',body:JSON.stringify({base_tree:cm.tree.sha,tree})});
        const nc=await api('/git/commits',{method:'POST',body:JSON.stringify({message:'Aggiornamento portfolio',tree:nt.sha,parents:[ref]})});
        await api('/git/refs/heads/'+b,{method:'PATCH',body:JSON.stringify({sha:nc.sha})});
        break;
      }catch(e){if(t>=3||!/ 422 |^422/.test(e.message))throw e;await new Promise(x=>setTimeout(x,1500))}
    }
    mk.forEach(f=>f());
    toast('Pubblicato su GitHub! Il sito online si aggiorna tra circa un minuto.',10000);
  }catch(err){H.classList.add('admin');toast('ERRORE, non pubblicato: '+err.message,20000)}
  if(w)setEdit(true);
}
addEventListener('beforeunload',e=>{if(Object.values(up).some(o=>!o.d))e.preventDefault()});

document.addEventListener('focusin',e=>{
  const x=e.target.closest&&e.target.closest('[data-e]');
  if(x&&edit){$$('.sel').forEach(y=>y.classList.remove('sel'));x.classList.add('sel');se=x}
});
document.addEventListener('input',e=>{
  if(!e.target.matches('.rg'))return;
  const l=e.target.closest('li'),v=e.target.value;
  $('.bar i',l).style.setProperty('--p',v/100);$('.pc',l).textContent=v+'%';e.target.setAttribute('value',v);
});

/* pagine per categoria, con transizione */
const seg=()=>{try{const h=decodeURIComponent(location.hash.slice(1));return h[0]==='/'?h.slice(1).split('/'):[]}catch(e){return[]}};
const cc=()=>seg()[0]||'',pp=()=>seg()[1]||'';
let cur=cc()+'/'+pp();
const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&x.target.classList.add('vw')),{threshold:.15});
function fl(){
  fixIds();lz();renderFeat();
  $$('#cats li').forEach(l=>{const c=$('a',l).dataset.c,k=$$('.card').filter(x=>x.dataset.cat===c&&!x.hasAttribute('data-draft')).length;$('.n',l).textContent=k+(k===1?' progetto':' progetti')});
}
function fsx(){
  const c=cc(),p=pp(),card=p&&$$('.card').find(x=>x.dataset.id===p&&x.dataset.cat===c);
  $('#fs').textContent=card?`.card:not([data-id=${JSON.stringify(p)}]){display:none!important}`:c?`.card:not([data-cat=${JSON.stringify(c)}]){display:none!important}`:'';
  return card||null;
}
function pnav(card,c){
  const el=$('#pn');if(!el)return;
  if(!card){el.innerHTML='';return}
  const L=$$('.card').filter(x=>x.dataset.cat===c&&(edit||!x.hasAttribute('data-draft'))),i=L.indexOf(card);
  const lk=(x,t)=>x?`<a href="#/${encodeURIComponent(c)}/${x.dataset.id}" data-d="${t==='Precedente'?'prev':'next'}">${t}</a>`:'<span></span>';
  el.innerHTML=lk(L[i-1],'Precedente')+lk(L[i+1],'Successivo');
}
function route(){
  const c=cc(),h=location.hash.slice(1),B=document.body,card=fsx();
  B.classList.toggle('pg',!!c);B.classList.toggle('pj',!!card);
  applyLay();
  if(c)$('#lavori h2').textContent=c;
  $('.bk').setAttribute('href',card?'#/'+encodeURIComponent(c):'#/');
  $$('.emb,.vb').forEach(e=>e.innerHTML='');
  if(card&&card.dataset.video)$('.emb',card).innerHTML=emb(card.dataset.video,0);
  if(card)$$('.blk[data-t=v]',card).forEach(b=>{$('.vb',b).innerHTML=emb(b.dataset.v||'',0)});
  pnav(card,c);
  fl();
  buildMq();stats();
  $$('.sh,#ix,.ab').forEach(e=>{e.classList.remove('vw');io.unobserve(e);io.observe(e)});
  const t2=c?null:$({lavori:'#ix',chi:'#chi',cv:'#cv',contatti:'#contatti'}[h]||'#none');
  t2?t2.scrollIntoView({behavior:'instant'}):scrollTo({top:0,behavior:'instant'});
}
addEventListener('hashchange',()=>{
  const c=cc(),k=c+'/'+pp();if(k===cur)return;cur=k;
  const cw=pp()&&$$('.card').find(x=>x.dataset.id===pp()&&x.dataset.cat===c),W=((cw&&$('h3',cw).textContent.trim())||c||'Home').slice(0,22);
  const w=$('#wp'),b=$('b',w);
  b.innerHTML='';b.style.fontSize=Math.min(19,170/W.length)+'vw';
  [...W].forEach((ch,i)=>{const sp=document.createElement('span'),it=document.createElement('i');it.textContent=ch===' '?'\u00a0':ch;it.style.setProperty('--i',i);sp.appendChild(it);b.appendChild(sp)});
  w.classList.remove('go');void w.offsetWidth;w.classList.add('go');
  document.body.classList.add('tr');
  clearTimeout(tt);
  tt=setTimeout(()=>{route();setTimeout(()=>document.body.classList.remove('tr'),70)},420);
  setTimeout(()=>w.classList.remove('go'),1300);
});
document.addEventListener('mouseover',e=>{
  const a=e.target.closest('#cats a');
  const k=a&&$$('.card').find(x=>x.dataset.cat===a.dataset.c&&$('.media img',x).getAttribute('src'));
  if(k)$('img',fp).src=$('.media img',k).src;
  fp.classList.toggle('on',!!k);
});
route();
intro();

/* cursore: piccolo punto, cerchio che inverte i colori sul nome */
const cu=$('#cu'),fp=$('#fp');
let mx=-99,my=-99,cx=-99,cy=-99;
(function tick(){cx+=(mx-cx)*.22;cy+=(my-cy)*.22;cu.style.left=cx+'px';cu.style.top=cy+'px';requestAnimationFrame(tick)})();
document.addEventListener('mousemove',e=>{
  const m=e.target.closest&&e.target.closest('.row a,.f');if(!m)return;
  const r=m.getBoundingClientRect();
  H.style.setProperty('--mx',(e.clientX-r.left-r.width/2)*.22+'px');
  H.style.setProperty('--my',(e.clientY-r.top-r.height/2)*.3+'px');
});
addEventListener('scroll',()=>{if(scrollY<innerHeight*1.2)H.style.setProperty('--sy',scrollY*.18+'px')},{passive:true});
addEventListener('mousemove',e=>{
  const x=e.target,B=document.body;if(!x.closest)return;
  let t='';
  if(!edit){
    if(x.closest('.gal img'))t='Zoom';
    else if(x.closest('.media')){const c=x.closest('.card');t=B.classList.contains('pj')?'Zoom':c.hasAttribute('data-video')?'Play':'Apri'}
    else if(x.closest('#cats a,#fw a'))t='Vai';
    else if(x.closest('#mq'))t=mqx.drag?'Trascina':x.closest('.mi')?'Apri':'';
  }
  cu.dataset.t=t;cu.classList.toggle('l',!!t);
  const md=x.closest('.media');
  if(md&&!edit&&!B.classList.contains('pj')){const r=md.getBoundingClientRect();H.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*12+'deg');H.style.setProperty('--rx',-((e.clientY-r.top)/r.height-.5)*12+'deg')}
  if(!edit&&!B.classList.contains('pg')&&matchMedia('(hover:hover)').matches)$$('.hero h1 .ch').forEach(i=>{const r=i.getBoundingClientRect(),k=Math.max(0,1-Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2))/260);i.style.transform=k?`translateY(${-k*36}px) skewX(${-k*12}deg) scale(${1+k*.1})`:''});
});
addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;fp.style.transform=`translate(${e.clientX+36}px,${e.clientY-150}px) rotate(-4deg)`;
  const x=e.target;
  cu.classList.toggle('s',!!x.closest('h1'));
  cu.classList.toggle('h',!x.closest('h1')&&!!x.closest('a,button,.media,[data-img]'));
});
