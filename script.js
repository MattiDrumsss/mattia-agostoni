const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=$('#root'),K='portfolio-v3',H=document.documentElement;
let edit=false,t,n=0,LB=[],se=null;

const FM=[['Automatico',''],['Quadrato 1:1','1/1'],['Verticale 4:5','4/5'],['Verticale 3:4','3/4'],['Verticale 2:3','2/3'],['Verticale 9:16','9/16'],['Orizzontale 4:3','4/3'],['Orizzontale 3:2','3/2'],['Orizzontale 16:9','16/9'],['Cinema 21:9','21/9']];
const BFM='<details class="mn"><summary>Formato</summary><div>'+FM.map(([t,v])=>`<button data-act="bfm"${v?` data-v="${v}"`:''}>${t}</button>`).join('')+'</div></details>';
const PAL='<div class="pal"><div class="cols"></div><p class="fnt" data-e></p><button class="ad" data-act="addcol">Aggiungi un colore</button></div>';
const ADDB='<div class="addb"><span>Aggiungi un blocco:</span><button data-act="ab" data-v="t">Testo</button><button data-act="ab" data-v="i">Foto</button><button data-act="ab" data-v="i2">Due foto</button><button data-act="ab" data-v="v">Video</button><button data-act="ab" data-v="q">Citazione</button></div>';
const TL=`<span class="dg" draggable="true" title="Trascina per cambiare l'ordine">Sposta</span><button data-act="cover">Copertina</button><button data-act="img">Galleria</button><details class="mn"><summary>Video</summary><div><button data-act="vfile">Carica un file</button><button data-act="vid">Incolla un link</button></div></details><details class="mn"><summary>Formato</summary><div><button data-act="ar">Automatico (standard)</button><button data-act="ar" data-v="1/1">Quadrato 1:1</button><button data-act="ar" data-v="4/5">Verticale 4:5 (Instagram)</button><button data-act="ar" data-v="3/4">Verticale 3:4</button><button data-act="ar" data-v="2/3">Verticale 2:3 (poster, foto)</button><button data-act="ar" data-v="9/16">Verticale 9:16 (Reel, Stories)</button><button data-act="ar" data-v="210/297">Foglio A4 verticale</button><button data-act="ar" data-v="4/3">Orizzontale 4:3</button><button data-act="ar" data-v="3/2">Orizzontale 3:2 (foto)</button><button data-act="ar" data-v="16/9">Orizzontale 16:9 (video)</button><button data-act="ar" data-v="21/9">Cinema 21:9</button></div></details><details class="mn"><summary>Altro</summary><div><button data-act="fp">Punto focale della copertina</button><button data-act="alt">Descrizione della copertina</button><button data-act="url">Link esterno (sito o gioco)</button><button data-act="cat">Cambia categoria</button><button data-act="prv">Anteprima al passaggio</button><button data-act="ba">Prima e dopo</button><button data-act="ft">Metti o togli da In evidenza</button><button data-act="dr">Nascondi o mostra (bozza)</button><button data-act="dup">Duplica progetto</button><button data-act="del">Elimina progetto</button></div></details>`;
const card=(c='')=>`<article class="card" data-cat="${c}"><div class="media" data-img><img alt=""></div><div class="gal"></div><div class="meta"><h3 data-e>Titolo progetto</h3><p data-e>Descrizione breve, anno</p>${PAL}</div><div class="det"><div class="emb"></div><div class="dsc" data-e></div><div class="bks"></div>${ADDB}</div><div class="tl">${TL}</div></article>`;
const li=(a,b)=>`<li><span data-e>${a}</span>${b?`<a data-e data-l href="#">${b}</a>`:''}<b class="x" data-act="rm">Togli</b></li>`;
const PV=/[?&]pv=1/.test(location.search);
const mqx={pos:0,v:0,drag:false,hover:false,pause:0,W:1,last:0,moved:0,s:1};
let dirty=false,quiet=false,undoS=[],redoS=[],pres=null,fpC=null,snd=false;
const DH='<b class="dh" draggable="true" title="Trascina per spostare">⠿</b>';
document.body.classList.add('film');
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
{const o=$('section#st');if(o)o.remove();
if(!$('div#st'))$('.ab .big').insertAdjacentHTML('afterend','<div id="st" class="stats"><div class="stat" data-k="p"><b>0</b><span>progetti</span></div><div class="stat" data-k="c"><b>0</b><span>categorie</span></div><div class="stat" data-k="v"><b>0</b><span>video</span></div></div>')}
if(!$('.rot'))$('.hero h1').insertAdjacentHTML('afterend','<p class="rot" data-w="grafico,video maker,fotografo"><span data-e>Sono</span> <span class="rw"></span><i class="cr"></i><b class="x" data-act="words">Cambia parole</b></p>');
if(!$('.cpl'))$('[data-act=film]').insertAdjacentHTML('afterend','<button class="f cpl" data-act="cpl">Copia link</button>');
if(!$('.upd'))$('footer span').insertAdjacentHTML('afterend','<span class="upd"></span>');
if(!$('#mq'))$('#grid').insertAdjacentHTML('afterend','<div id="mq"><div class="mt"></div></div>');
$$('.blk[data-t=i] .bct,.blk[data-t=i2] .bct').forEach(b=>{if(!$('[data-act=bfm]',b))b.insertAdjacentHTML('afterbegin',BFM)});
v6migrate();
const BAR=`<div id="bar"><button class="bt" data-act="bar" aria-label="Apri o chiudi l'editor"><svg class="i1" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg><svg class="i2" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="bi">
  <button id="tg" class="sw" data-act="tg"><i></i><span>Modifica</span></button>
  <details class="mn"><summary>+ Aggiungi</summary><div>
    <button data-act="np">Progetto vuoto</button>
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
    <button data-act="ap">Aspetto del sito</button>
    <button data-act="tai">Pagine su misura per un'azienda</button>
    <button data-act="hist">Cronologia delle pubblicazioni</button>
    <button data-act="uz">Annulla ultima azione</button>
    <button data-act="rz">Ripeti azione</button>
    <button data-act="qr">Codice QR del sito</button>
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

const save=()=>{if(!quiet){dirty=true;updDirty()}try{localStorage.setItem(K,cleanRoot())}catch(e){toast('Memoria del browser piena: premi "Scarica index.html" per non perdere le modifiche.')}};
function setEdit(on){
  edit=on;document.body.classList.toggle('edit',on);
  if(on)unsplit();
  $$('[data-e]').forEach(e=>on?e.setAttribute('contenteditable','true'):e.removeAttribute('contenteditable'));
  $('#tg').classList.toggle('on',on);
  if(!on){$$('.sel').forEach(x=>x.classList.remove('sel'));se=null;quiet=true;save();quiet=false;split()}
  buildMq();ensureHandles();
}
if(gh()&&!PV){H.classList.add('admin');setEdit(true)}else split();

/* scelta immagine, ridimensionata per non appesantire il sito */
function procImg(f,cb){
  const r=new FileReader();
  r.onload=()=>{const im=new Image();im.onload=()=>{
    const k=Math.min(1,1200/Math.max(im.width,im.height)),c=document.createElement('canvas');
    c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
    c.getContext('2d').drawImage(im,0,0,c.width,c.height);
    const w=c.toDataURL('image/webp',.78);cb(w.startsWith('data:image/webp')?w:c.toDataURL(f.type==='image/png'?'image/png':'image/jpeg',.8))};im.src=r.result};
  r.readAsDataURL(f);
}
function pick(cb,multi){
  const i=document.createElement('input');i.type='file';i.accept='image/*';i.multiple=!!multi;
  i.onchange=()=>[...i.files].forEach(f=>procImg(f,cb));
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
    if(['del','bdel','rm','rmcat','rmcol','dup','dr','ft','ab','bup','bdn','addcat','addtl','addcol','addtool','addstep','addaw','addrv','adddy'].includes(k))snap();
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
    else if(k==='ar'){const m=$('.media',c);setAr(m,a.dataset.v||'');save();toast('Formato cambiato. Premi Pubblica per metterlo online.',4000)}
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
    else if(v6act(k,a,c,e)){}
    else if(k==='top')scrollTo({top:0,behavior:'smooth'});
    else if(k==='cpl'){const u=location.href;(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>toast('Link copiato.',2500)).catch(()=>toast(u,6000))}
    else if(k==='words'){const p=a.closest('.rot');ask('Parole che si alternano, separate da virgole',p.dataset.w||'').then(v=>{if(v!==null){p.dataset.w=v.trim();save();toast('Parole aggiornate. Premi Pubblica per metterle online.',4000)}})}
    else if(k==='avail'){const b=a.closest('.avail');b.toggleAttribute('data-off');save();toast(b.hasAttribute('data-off')?'Scritta nascosta ai visitatori.':'Scritta visibile.',3000)}
    else if(k==='ft'){c.toggleAttribute('data-feat');renderFeat();save();toast(c.hasAttribute('data-feat')?'Aggiunto a "In evidenza" nella home.':'Tolto da "In evidenza".',4000)}
    else if(k==='addcol'){$('.cols',c).insertAdjacentHTML('beforeend',COL('#cccccc'));save()}
    else if(k==='rmcol'){a.closest('.col').remove();save()}
    else if(k==='bfm'){const b=a.closest('.blk');$$('.bp',b).forEach(x=>setAr(x,a.dataset.v||''));save();toast('Formato cambiato. Premi Pubblica per metterlo online.',4000)}
    else if(k==='bup'){const b=a.closest('.blk'),p=b.previousElementSibling;if(p){p.before(b);save()}}
    else if(k==='bdn'){const b=a.closest('.blk'),n2=b.nextElementSibling;if(n2){n2.after(b);save()}}
    else if(k==='bdel'){if(confirm('Togliere questo blocco?')){a.closest('.blk').remove();save()}}
    else if(k==='bvl'){const b=a.closest('.blk');ask('Link YouTube o Vimeo del video',b.dataset.v||'').then(u=>{if(u&&u.trim()){b.dataset.v=u.trim();$('.vb',b).innerHTML=emb(u.trim(),0);save()}})}
    else if(k==='ab'){
      const v=a.dataset.v,bks=$('.bks',c),CT=(x,f)=>`<div class="bct"><button data-act="bup">Su</button><button data-act="bdn">Giù</button>${f?BFM:''}${x?'<button data-act="bvl">Link</button>':''}<button data-act="bdel">Togli</button></div>`;
      const ph='<div class="bp" data-img><img alt="" loading="lazy"></div>';
      const HB={t:`<div class="blk" data-t="t"><div class="bc b-t" data-e>Scrivi qui il testo…</div>${CT()}</div>`,
        i:`<div class="blk" data-t="i"><div class="bc">${ph}</div>${CT(0,1)}</div>`,
        i2:`<div class="blk" data-t="i2"><div class="bc">${ph}${ph}</div>${CT(0,1)}</div>`,
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
    else if(k==='bar'){const b=$('#bar'),bi=$('.bi',b);if(b.classList.contains('closing'))return;if(b.classList.contains('open')){$$('#bar details[open]').forEach(d=>d.removeAttribute('open'));b.classList.remove('full');b.classList.add('closing');setTimeout(()=>{b.classList.remove('open','closing');bi.style.maxWidth='0px'},380)}else{b.classList.add('open');bi.style.maxWidth=Math.min(bi.scrollWidth+10,innerWidth*.96-70)+'px';setTimeout(()=>{if(b.classList.contains('open')&&!b.classList.contains('closing'))b.classList.add('full')},900)}}
    else if(k==='login'){ask('Area riservata: inserisci la password','','password').then(async pw=>{if(!pw)return;try{await doLogin(pw)}catch(err){toast(err.message,7000)}})}
    else if(k==='out'){if(confirm("Uscire dall'editor? Per modificare dovrai reinserire il token.")){localStorage.removeItem('portfolio-gh');location.reload()}}
    else if(k==='pub')pub();
    else if(k==='nfoto'){const ct=tcat();if(!ct)return;let cd=null;pick(s=>{if(!cd){$('#grid').insertAdjacentHTML('beforeend',card(ct));cd=$('#grid').lastElementChild;$('.media img',cd).src=s;toast(`Progetto aggiunto in "${ct}"`)}else $('.gal',cd).insertAdjacentHTML('beforeend',`<img src="${s}" alt="">`);fl();setEdit(true);save()},1)}
    else if(k==='nvideo'){const ct=tcat();if(!ct)return;vpick(f=>{const p='/video/'+f.name.toLowerCase().replace(/[^a-z0-9.]+/g,'-'),bu=URL.createObjectURL(f);up[bu]={p,f};$('#grid').insertAdjacentHTML('beforeend',card(ct));const cd=$('#grid').lastElementChild;cd.dataset.video=bu;$('h3',cd).textContent=f.name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ');frame(f,s=>{$('.media img',cd).src=s;save()});fl();setEdit(true);save();toast(`Video aggiunto in "${ct}"`)})}
    else if(k==='film'){
      const B=document.body;
      if(edit){B.classList.toggle('film');toast('Con Modifica attivo vedi sempre la griglia: spegni Modifica per vedere il rullino.',5000);buildMq();return}
      const from=B.classList.contains('film')?$('#mq'):$('#grid');
      if(from.classList.contains('out'))return;
      from.classList.add('out');
      setTimeout(()=>{from.classList.remove('out');B.classList.toggle('film');buildMq()},420);
    }
    else if(k==='prev')show(n-1);
    else if(k==='next')show(n+1);
    else if(k==='close'){$('#lb').classList.remove('on');$('#lbc').innerHTML=''}
    return;
  }
  const wr=T.closest('.wr');
  if(wr&&!edit){const mm=$('.mail'),hr=mm&&mm.getAttribute('href');if(hr&&/^mailto:/.test(hr)){e.preventDefault();location.href=hr.split('?')[0]+'?subject='+encodeURIComponent('Contatto dal portfolio')+'&body='+encodeURIComponent('Ciao Mattia,\n\n')}return}
  if(!edit&&T.closest('.logo')){if(cc())location.hash='#/';else scrollTo({top:0,behavior:'smooth'});return}
  if(fpC&&edit){const mm=T.closest('.media');if(mm&&mm.closest('.card')===fpC){const rc=mm.getBoundingClientRect();$('img',mm).style.objectPosition=Math.round((e.clientX-rc.left)/rc.width*100)+'% '+Math.round((e.clientY-rc.top)/rc.height*100)+'%';fpC=null;save();toast('Punto focale impostato.',2500);return}fpC=null}
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
let reduce=matchMedia('(prefers-reduced-motion:reduce)').matches||localStorage.getItem('portfolio-rm')==='1';
function hc(){try{const h=decodeURIComponent(location.hash.slice(1));return h[0]==='/'?h.slice(1).split('/')[0]:''}catch(e){return ''}}
function filmLabel(){const f=$('[data-act=film]');if(f)f.textContent=document.body.classList.contains('film')&&!edit?'Vista a griglia':'Vista a rullino'}
function buildMq(){
  filmLabel();
  const t=$('#mq .mt');if(!t)return;
  const c=hc();
  if(!c||!document.body.classList.contains('film')||edit){t.innerHTML='';return}
  const L=$$('.card').filter(x=>x.dataset.cat===c&&!x.hasAttribute('data-draft'));
  const item=(x,n)=>{const im=$('.media img',x),sr=im&&im.getAttribute('src'),ar=$('.media',x).style.aspectRatio||'4 / 5',ds=$('p',$('.meta',x));
    return `<a class="mi" style="--i:${n}" href="#/${encodeURIComponent(c)}/${x.dataset.id}" draggable="false"><span class="mm" style="aspect-ratio:${ar}">${sr?`<img src="${sr}" alt="${esc(im.alt||'')}" draggable="false" style="object-position:${im.style.objectPosition||'50% 50%'}">`:''}</span><b>${esc($('h3',x).textContent)}</b><small>${esc(ds?ds.textContent:'')}</small></a>`};
  const set=L.map((x,n)=>item(x,n)).join('');
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
  let i=0,j=0,del=false;
  (function step(){
    const p=$('.rot'),w=p&&$('.rw',p);if(!p||!w)return setTimeout(step,800);
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
const io3=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){countSk(x.target);io3.unobserve(x.target)}}),{threshold:.3});
function countSk(ul){
  $$('li',ul).forEach((l,i)=>{
    const b=$('.pc',l),n=+b.dataset.n||0;
    if(reduce){b.textContent=n+'%';return}
    const t0=performance.now()+i*110+250;
    (function f(t){const k=Math.max(0,Math.min(1,(t-t0)/1500)),e=1-Math.pow(1-k,4);b.textContent=Math.round(n*e)+'%';if(k<1)requestAnimationFrame(f)})(performance.now());
  });
}
function skills(){
  const ul=$('#sk');if(!ul)return;
  $$('li',ul).forEach(l=>{const i=$('.bar i',l),b=$('.pc',l);if(!i||!b)return;b.dataset.n=Math.round(parseFloat(i.style.getPropertyValue('--p')||0)*100);b.textContent='0%'});
  io3.unobserve(ul);io3.observe(ul);
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
  if($('#lb').classList.contains('on')||pres||!document.body.classList.contains('pj'))return;
  const t=e.target;if(t.closest&&t.closest('[contenteditable],input,textarea,select'))return;
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const a=$(`#pn a[data-d="${e.key==='ArrowRight'?'next':'prev'}"]`);if(a)location.hash=a.getAttribute('href')}
});
if(!$('#up'))document.body.insertAdjacentHTML('beforeend','<div id="up" role="button" tabindex="0" aria-label="Torna su" data-act="top"><svg viewBox="0 0 44 44" width="44" height="44" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="22" cy="22" r="20" class="r0"/><circle cx="22" cy="22" r="20" class="r1" stroke-dasharray="125.66" stroke-dashoffset="125.66"/><path d="M15 26l7-7 7 7"/></svg></div>');
addEventListener('scroll',()=>{const u=$('#up'),m=document.documentElement.scrollHeight-innerHeight,p=m>0?scrollY/m:0;u.classList.toggle('on',scrollY>500);$('.r1',u).setAttribute('stroke-dashoffset',125.66*(1-p))},{passive:true});
renderUpd();rotInit();

/* in evidenza, immagini, colori */
function setAr(m,v){
  if(v){m.style.aspectRatio=v;const p=v.split('/').map(parseFloat);m.style.setProperty('--arn',p[0]/p[1])}
  else{m.style.removeProperty('aspect-ratio');m.style.removeProperty('--arn')}
}
function lz(){$$('#root img').forEach(i=>{if(!i.closest('.logo')&&!i.hasAttribute('loading')){i.setAttribute('loading','lazy');i.setAttribute('decoding','async')}})}
function renderFeat(){
  const w=$('#fw');if(!w)return;
  const L=$$('.card').filter(x=>x.hasAttribute('data-feat')&&(edit||!x.hasAttribute('data-draft'))).slice(0,6);
  w.innerHTML=L.map(x=>{const im=$('.media img',x),sr=im&&im.getAttribute('src');return `<a class="fi" href="#/${encodeURIComponent(x.dataset.cat)}/${x.dataset.id}"><span class="fm">${sr?`<img src="${sr}" alt="${esc(im.alt||'')}" loading="lazy" style="object-position:${im.style.objectPosition||'50% 50%'}">`:''}</span><b>${esc($('h3',x).textContent)}</b><small>${esc(x.dataset.cat)}</small></a>`}).join('');
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
try{const th0=localStorage.getItem('portfolio-th');if(!PV&&(th0==='lt'||(!th0&&matchMedia('(prefers-color-scheme:light)').matches)))H.classList.add('lt')}catch(e){}
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
document.addEventListener('mousedown',e=>{if(e.target.closest('#bar,#ft'))e.preventDefault()});
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
  const w0=checks();
  const go=w0.length?await note('Prima di pubblicare ho trovato questo',w0.slice(0,8).concat(w0.length>8?['…e altri '+(w0.length-8)+' avvisi']:[]),'Pubblica comunque'):confirm('Pubblicare le modifiche sul sito? Saranno online tra circa un minuto.');
  if(!go)return;
  const w=edit,ad=H.classList.contains('admin'),fm=document.body.classList.contains('film');
  setEdit(false);closePv();toast('Pubblico... non chiudere la pagina');
  {const u=$('.upd');if(u){u.dataset.d=new Date().toISOString().slice(0,10);renderUpd()}}
  {const t=$('#pp');if(t)t.remove()}
  setLd();
  try{
    $('#fs').textContent='';H.classList.remove('admin');document.body.classList.remove('film');
    let html='<!DOCTYPE html>\n'+H.outerHTML;
    H.classList.add('admin');if(fm)document.body.classList.add('film');
    html=html.replace(/(<div id="(?:wp|fp|lb|ts|md|pvw|up|ov|pr|sm|ft)") class="(?:go|on)"/g,'$1').replace(/ class="sel"/g,'').replace(/ sel"/g,'"').replace(/^(<!DOCTYPE html>\n<html[^>]*?) style="[^"]*"/,'$1').replace(/^(<!DOCTYPE html>\n<html[^>]*?) class="[^"]*"/,'$1').replace(/<i class="ch"[^>]*>([^<]*)<\/i>/g,'$1').replace(/(<div class="(?:emb|vb)">)[\s\S]*?(<\/div>)/g,'$1$2').replace(/(<div id="pn">)[\s\S]*?(<\/div>)/,'$1$2').replace(/(<div id="fw">)[\s\S]*?(<\/div>)/,'$1$2').replace(/(<div id="cw">)[\s\S]*?(<\/div>)/,'$1$2').replace(/(<div class="mt">)[\s\S]*?(<\/div>)/,'$1$2').replace(/(<span class="rw">)[\s\S]*?(<\/span>)/,'$1$2');
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
    const texts=genPages(html);
    const b=(await api('')).default_branch;
    const tree=[];
    for(const [p,c] of files)tree.push({path:p,mode:'100644',type:'blob',sha:await blob({content:c,encoding:'base64'})});
    for(const [p,c] of texts)tree.push({path:p,mode:'100644',type:'blob',sha:await blob({content:c,encoding:'utf-8'})});
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
    mk.forEach(f=>f());dirty=false;updDirty();
    toast('Pubblicato su GitHub! Il sito online si aggiorna tra circa un minuto.',10000);
  }catch(err){H.classList.add('admin');toast('ERRORE, non pubblicato: '+err.message,20000)}
  if(w)setEdit(true);
}
addEventListener('beforeunload',e=>{if(Object.values(up).some(o=>!o.d)||(dirty&&gh()&&!PV))e.preventDefault()});

document.addEventListener('focusin',e=>{
  const x=e.target.closest&&e.target.closest('[data-e]');
  if(x&&edit){$$('.sel').forEach(y=>y.classList.remove('sel'));x.classList.add('sel');se=x}
});
document.addEventListener('input',e=>{
  if(!e.target.matches('.rg'))return;
  const l=e.target.closest('li'),v=e.target.value;
  $('.bar i',l).style.setProperty('--p',v/100);{const pb=$('.pc',l);pb.textContent=v+'%';pb.dataset.n=v}e.target.setAttribute('value',v);
});

/* ===== v6: modifica avanzata e novità ===== */
function cleanRoot(){return root.innerHTML.replace(/ contenteditable="true"/g,'').replace(/<video class="pv"[^>]*><\/video>/g,'').replace(/ class="sel"/g,'').replace(/ sel"/g,'"').replace(/<i class="ch"[^>]*>([^<]*)<\/i>/g,'$1').replace(/(<div class="(?:emb|vb)">)[\s\S]*?(<\/div>)/g,'$1$2').replace(/(<div id="pn">)[\s\S]*?(<\/div>)/,'$1$2').replace(/(<div id="fw">)[\s\S]*?(<\/div>)/,'$1$2').replace(/(<div class="mt">)[\s\S]*?(<\/div>)/,'$1$2').replace(/(<span class="rw">)[\s\S]*?(<\/span>)/,'$1$2').replace(/(<div id="cw">)[\s\S]*?(<\/div>)/,'$1$2')}
const escA=x=>esc(String(x)).replace(/"/g,'&quot;');
function updDirty(){const b=$('#bar');if(b)b.classList.toggle('dirty',dirty);const p=$('#bar .pb');if(p)p.classList.toggle('dirty',dirty)}
function snap(){undoS.push(cleanRoot());if(undoS.length>25)undoS.shift();redoS=[]}
function restore(h){root.innerHTML=h;fixIds();ensureHandles();setEdit(edit);if(!edit)split();route();renderUpd();rvInit();dirty=true;updDirty();save()}
function undo(){if(!undoS.length)return toast("Non c'è niente da annullare.",2500);redoS.push(cleanRoot());restore(undoS.pop());toast('Annullato.',1800)}
function redo(){if(!redoS.length)return toast("Non c'è niente da ripetere.",2500);undoS.push(cleanRoot());restore(redoS.pop());toast('Ripetuto.',1800)}

/* finestra con elenco di avvisi */
function note(t,lines,ok='Continua'){
  return new Promise(res=>{
    const m=$('#md'),f=$('#mf'),i=$('#mi');
    $('#mt').textContent=t;i.style.display='none';
    let ul=$('#ml');if(!ul){ul=document.createElement('ul');ul.id='ml';$('#mt').after(ul)}
    ul.innerHTML=lines.map(x=>`<li>${esc(x)}</li>`).join('');ul.style.display='';
    const sb=f.querySelector('button[type=submit]');sb.textContent=ok;
    m.classList.add('on');
    const end=v=>{m.classList.remove('on');i.style.display='';ul.style.display='none';sb.textContent='OK';f.onsubmit=null;$('#mx').onclick=null;res(v)};
    f.onsubmit=e=>{e.preventDefault();end(true)};$('#mx').onclick=()=>end(false);
  });
}
function checks(){
  const L=[],P=$$('.card').filter(x=>!x.hasAttribute('data-draft'));
  P.forEach(c=>{
    const t=($('h3',c).textContent||'').trim(),n=t||'(senza titolo)';
    if(!$('.media img',c).getAttribute('src'))L.push('«'+n+'» non ha la copertina.');
    if(/^titolo progetto/i.test(t))L.push('Un progetto ha ancora il titolo di esempio "Titolo progetto".');
  });
  const noAlt=P.filter(x=>$('.media img',x).getAttribute('src')&&!$('.media img',x).alt).length;
  if(noAlt)L.push(noAlt+(noAlt>1?' copertine senza descrizione':' copertina senza descrizione')+' (Altro, Descrizione della copertina).');
  const mm=$('.mail');if(mm&&/tuamail@email\.com/.test((mm.getAttribute('href')||'')+mm.textContent))L.push('La mail di contatto è ancora quella di esempio.');
  $$('#ct li').forEach(l=>{const a=$('a',l);if(a&&(/tuonome/.test(a.textContent)||a.getAttribute('href')==='#'))L.push('Il contatto "'+($('span',l)?$('span',l).textContent:a.textContent)+'" non ha un link vero (doppio clic sul link per cambiarlo).')});
  if(!mv('og:title'))L.push("L'anteprima del link non è impostata (⋯, Anteprima del link).");
  const big=$$('#root img').filter(i=>(i.getAttribute('src')||'').length>1200000).length;
  if(big)L.push(big+(big>1?' foto molto pesanti':' foto molto pesante')+': il sito potrebbe caricarsi lento.');
  return [...new Set(L)];
}

/* scorciatoie */
function newProject(){const c=cc();if(!c||c==='per')return toast('Apri prima una categoria.',2500);snap();$('#grid').insertAdjacentHTML('beforeend',card(c));fl();setEdit(true);save();toast('Nuovo progetto aggiunto.',2500)}
document.addEventListener('keydown',e=>{
  if(!gh()||PV||pres)return;
  const t=e.target,typing=t.closest&&t.closest('[contenteditable],input,textarea,select'),mod=e.ctrlKey||e.metaKey,k=e.key.toLowerCase();
  if(mod&&k==='s'){e.preventDefault();pub();return}
  if(typing)return;
  if(mod&&k==='z'){e.preventDefault();e.shiftKey?redo():undo();return}
  if(mod&&k==='y'){e.preventDefault();redo();return}
  if(mod||e.altKey)return;
  if(k==='e'){setEdit(!edit);toast(edit?'Modifica attiva.':'Modifica spenta.',1500)}
  else if(k==='n'&&edit)newProject();
});
document.addEventListener('keydown',e=>{
  if(pres){
    if(e.key==='Escape')closePres();
    else if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();showPres(1)}
    else if(e.key==='ArrowLeft')showPres(-1);
    return;
  }
  if(e.key==='Escape'){const o=$('#ov');if(o&&o.classList.contains('on'))ovc();closeSlash()}
});

/* barra sopra il testo selezionato */
function ftInit(){
  if($('#ft'))return;
  document.body.insertAdjacentHTML('beforeend','<div id="ft"><button data-act="fb"><b>B</b></button><button data-act="fi"><i>I</i></button><button data-act="fu"><u>U</u></button><button data-act="lk">Link</button><button data-act="ulk">Togli link</button></div>');
  document.addEventListener('selectionchange',()=>{
    const f=$('#ft'),s=getSelection();
    if(!edit||!s.rangeCount||s.isCollapsed||!(s.anchorNode&&s.anchorNode.parentElement&&s.anchorNode.parentElement.closest('[data-e]'))){f.classList.remove('on');return}
    const r=s.getRangeAt(0).getBoundingClientRect();if(!r.width){f.classList.remove('on');return}
    f.classList.add('on');
    f.style.left=Math.max(8,Math.min(innerWidth-f.offsetWidth-8,r.left+r.width/2-f.offsetWidth/2))+'px';
    f.style.top=Math.max(8,r.top-f.offsetHeight-10)+'px';
  });
}

/* foto trascinate o incollate */
function newCardFrom(cat,src,name){
  $('#grid').insertAdjacentHTML('beforeend',card(cat));const cd=$('#grid').lastElementChild;
  $('.media img',cd).src=src;$('h3',cd).textContent=(name||'Nuovo progetto').replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ');
  return cd;
}
function addBlock(c,v,src){
  const bks=$('.bks',c),ph=s=>`<div class="bp" data-img><img alt="" loading="lazy"${s?` src="${s}"`:''}></div>`;
  const CT=(x,f)=>`<div class="bct"><button data-act="bup">Su</button><button data-act="bdn">Giù</button>${f?BFM:''}${x?'<button data-act="bvl">Link</button>':''}<button data-act="bdel">Togli</button></div>`;
  const HB={
    t:`<div class="blk" data-t="t"><div class="bc b-t" data-e>Scrivi qui il testo…</div>${CT()}</div>`,
    i:`<div class="blk" data-t="i"><div class="bc">${ph(src)}</div>${CT(0,1)}</div>`,
    i2:`<div class="blk" data-t="i2"><div class="bc">${ph()}${ph()}</div>${CT(0,1)}</div>`,
    q:`<div class="blk" data-t="q"><div class="bc"><blockquote data-e>“Scrivi qui la frase”</blockquote><p class="qn" data-e>Nome, ruolo</p></div>${CT()}</div>`,
    v:`<div class="blk" data-t="v" data-v="${escA(src||'')}"><div class="bc"><div class="vb"></div></div>${CT(1)}</div>`};
  bks.insertAdjacentHTML('beforeend',HB[v]);
  const nb=bks.lastElementChild;if(v==='v')$('.vb',nb).innerHTML=emb(src||'',0);
  ensureHandles();setEdit(true);save();return nb;
}
function fileDrop(files,target){
  const imgs=[...files].filter(f=>/^image\//.test(f.type));if(!imgs.length)return false;
  const cd=target&&target.closest&&target.closest('.card'),cat=cc(),pj=document.body.classList.contains('pj');
  const cur=pj?$$('.card').find(x=>x.dataset.id===pp()&&x.dataset.cat===cat):null,card0=cd||cur;
  if(!card0&&(!cat||cat==='per')){toast('Apri una categoria per creare progetti dalle foto.',3500);return true}
  snap();
  imgs.forEach(f=>procImg(f,s=>{
    if(pj&&card0)addBlock(card0,'i',s);
    else if(card0){const cv=$('.media img',card0);if(!cv.getAttribute('src'))cv.src=s;else $('.gal',card0).insertAdjacentHTML('beforeend',`<img src="${s}" alt="" loading="lazy">`)}
    else newCardFrom(cat,s,f.name);
    fl();setEdit(true);save();
  }));
  toast(card0?(pj?'Foto aggiunta come blocco.':'Foto aggiunta al progetto.'):'Progetti creati dalle foto.',3500);return true;
}
document.addEventListener('dragover',e=>{
  if(edit&&e.dataTransfer&&[...e.dataTransfer.types].includes('Files')){
    e.preventDefault();$$('.dz').forEach(x=>x.classList.remove('dz'));
    const c=e.target.closest&&e.target.closest('.card');(c||$('#lavori')).classList.add('dz');
  }
});
document.addEventListener('dragleave',e=>{if(!e.relatedTarget)$$('.dz').forEach(x=>x.classList.remove('dz'))});
document.addEventListener('drop',e=>{
  $$('.dz').forEach(x=>x.classList.remove('dz'));
  if(!edit||!e.dataTransfer||!e.dataTransfer.files.length)return;
  e.preventDefault();
  const im=e.target.closest&&e.target.closest('[data-img]'),f0=e.dataTransfer.files[0];
  if(im&&/^image\//.test(f0.type)){snap();procImg(f0,s=>{$('img',im).src=s;save()});return}
  fileDrop(e.dataTransfer.files,e.target);
});
document.addEventListener('paste',e=>{
  if(!edit||!e.clipboardData)return;
  const fs=[...e.clipboardData.files].filter(f=>/^image\//.test(f.type));if(!fs.length)return;
  e.preventDefault();e.stopImmediatePropagation();
  fileDrop(fs,null);
},true);

/* menu "/" nei testi */
let slashEl=null;
function closeSlash(){const m=$('#sm');if(m)m.remove();slashEl=null}
document.addEventListener('input',e=>{
  if(!edit||e.data!=='/')return;
  const el=e.target.closest&&e.target.closest('.b-t,.dsc');if(!el||!el.closest('.card'))return;
  if(!/(^|\s)\/$/.test(el.textContent))return;
  closeSlash();slashEl=el;
  const rg=getSelection().rangeCount?getSelection().getRangeAt(0).getBoundingClientRect():el.getBoundingClientRect();
  document.body.insertAdjacentHTML('beforeend',`<div id="sm" style="left:${Math.max(8,rg.left)}px;top:${rg.bottom+8}px">${[['t','Testo'],['i','Foto'],['i2','Due foto'],['v','Video'],['q','Citazione']].map(x=>`<button data-sm="${x[0]}">${x[1]}</button>`).join('')}</div>`);
});
document.addEventListener('mousedown',e=>{if(e.target.closest('#sm'))e.preventDefault()});
document.addEventListener('click',e=>{
  const b=e.target.closest&&e.target.closest('#sm button');
  if(!b){if(!(e.target.closest&&e.target.closest('#sm')))closeSlash();return}
  const el=slashEl,c=el&&el.closest('.card'),v=b.dataset.sm;
  closeSlash();if(!c)return;
  try{el.focus();document.execCommand('delete')}catch(x){}
  snap();
  if(v==='v')ask('Link YouTube o Vimeo del video').then(u=>{if(u&&u.trim())addBlock(c,'v',u.trim())});
  else addBlock(c,v);
},true);

/* trascinare liste e blocchi */
let dr2=null;
function ensureHandles(){
  $$('#cats li,#sk li,#tl li,#aws li,#tw li,#hw li,#rw li,#dyl li').forEach(l=>{if(!l.querySelector(':scope>.dh'))l.insertAdjacentHTML('afterbegin',DH)});
  $$('.bct').forEach(b=>{if(!b.querySelector('.dh'))b.insertAdjacentHTML('afterbegin',DH)});
  $$('.blk[data-t=i] .bct,.blk[data-t=i2] .bct').forEach(b=>{if(!$('[data-act=balt]',b))b.insertAdjacentHTML('beforeend','<button data-act="balt">Descrizione</button>')});
}
document.addEventListener('dragstart',e=>{
  const h=e.target.closest&&e.target.closest('.dh');if(!h)return;
  dr2=h.closest('li,.blk');if(!dr2)return;
  e.dataTransfer.setData('text/plain','x');dr2.classList.add('dragging2');
});
document.addEventListener('dragover',e=>{
  if(!dr2)return;
  const t=e.target.closest&&e.target.closest('li,.blk');if(!t||t===dr2||t.parentNode!==dr2.parentNode)return;
  e.preventDefault();const r=t.getBoundingClientRect();
  t.parentNode.insertBefore(dr2,(e.clientY-r.top)<r.height/2?t:t.nextSibling);
});
document.addEventListener('dragend',()=>{if(!dr2)return;dr2.classList.remove('dragging2');dr2=null;fl();save()});

/* modelli delle sezioni */
function tool(){return '<li><span data-e>Strumento</span><b class="x" data-act="rm">Togli</b></li>'}
function step(t,d){return `<li><b data-e>${t||'Titolo del passo'}</b><p data-e>${d||'Descrizione breve'}</p><b class="x" data-act="rm">Togli</b></li>`}
function rev(){return '<li class="q"><blockquote data-e>“Scrivi qui la recensione”</blockquote><p data-e>Nome, ruolo</p><b class="x" data-act="rm">Togli</b></li>'}
function dia(){return '<li class="po"><span class="yr" data-e>Data</span><h3 data-e>Titolo della nota</h3><p data-e>Racconta cosa hai fatto.</p><div class="bp" data-img><img alt="" loading="lazy"></div><b class="x" data-act="rm">Togli</b></li>'}
function rvInit(){const q=$$('#rw .q');if(q.length&&!q.some(x=>x.classList.contains('on')))q[0].classList.add('on')}
function v6migrate(){
  const mk=(id,title,inner,after,attrs='')=>{if(!$('#'+id)&&$(after))$(after).insertAdjacentHTML('afterend',`<section id="${id}"${attrs}><div class="sh"><h2>${title}</h2></div>${inner}</section>`)};
  mk('tools','Strumenti','<ul id="tw"></ul><button class="ad" data-act="addtool">Aggiungi uno strumento</button>','#chi');
  mk('how','Come lavoro','<ol id="hw">'+[['Ascolto','Capisco cosa serve, per chi e con quali limiti.'],['Idea','Cerco la direzione giusta e la mostro con bozze veloci.'],['Realizzazione','Costruisco il progetto curando ogni dettaglio.'],['Consegna',"Preparo i file pronti all'uso e resto disponibile per le modifiche."]].map(x=>step(x[0],x[1])).join('')+'</ol><button class="ad" data-act="addstep">Aggiungi un passo</button><button class="ad" data-act="sec">Mostra o nascondi questa sezione</button>','#tools',' data-off');
  mk('aw','Riconoscimenti e collaborazioni','<ul id="aws"></ul><button class="ad" data-act="addaw">Aggiungi un riconoscimento</button>','#cv');
  mk('rv','Dicono di me','<ul id="rw"></ul><button class="ad" data-act="addrv">Aggiungi una recensione</button>','#aw');
  mk('dy','Diario di lavoro','<ul id="dyl"></ul><button class="ad" data-act="adddy">Aggiungi una nota</button>','#rv');
  if(!$('#cst')&&$('#contatti'))$('#contatti').insertAdjacentHTML('beforebegin','<section id="cst"><div class="sh"><a class="bk" href="#/">Indietro</a><h2></h2></div><p class="big" id="cg"></p><div id="cw"></div></section>');
  if(!$('#tai')&&$('footer'))$('footer').insertAdjacentHTML('beforebegin','<ul id="tai" hidden></ul>');
  if(!$('[data-act=snd]')&&$('footer .lk'))$('footer .lk').insertAdjacentHTML('beforebegin','<button class="lk" data-act="snd">Suoni: no</button><button class="lk" data-act="rdm">Animazioni: sì</button><button class="lk" data-act="pdf">Portfolio PDF</button>');
  const ph=$('.ab .ph');if(ph&&!$('.alt',ph))ph.insertAdjacentHTML('beforeend','<img class="alt" alt=""><b class="x" data-act="ph2">Seconda foto (al passaggio del mouse)</b>');
  const ac=$('.acts');if(ac&&!$('.pres',ac))ac.insertAdjacentHTML('beforeend','<button class="pres" data-act="pres">Presenta</button>');
  try{if(gh()&&!PV&&!localStorage.getItem('portfolio-m2')){localStorage.setItem('portfolio-m2','1');if(!$$('#cats a').some(a=>a.dataset.c==='Siti e giochi'))$('#cats').insertAdjacentHTML('beforeend',catLi('Siti e giochi'))}}catch(e){}
  ensureHandles();rvInit();
}
function v6init(){
  dirty=saved;updDirty();
  ftInit();
  snd=localStorage.getItem('portfolio-sn')==='1';
  if(reduce)H.classList.add('rm');
  upLabels();
  try{const ap=JSON.parse(localStorage.getItem('portfolio-ap')||'null');if(ap&&gh()&&!PV)applyAp(ap)}catch(e){}
  setInterval(()=>{const q=$$('#rw .q');if(edit||q.length<2)return;const i=q.findIndex(x=>x.classList.contains('on'));q.forEach(x=>x.classList.remove('on'));q[(i+1)%q.length].classList.add('on')},5500);
}
function upLabels(){const a=$('[data-act=snd]'),b=$('[data-act=rdm]');if(a)a.textContent='Suoni: '+(snd?'sì':'no');if(b)b.textContent='Animazioni: '+(reduce?'no':'sì')}

/* suoni leggeri */
let AC=null;
function blip(f=520,d=.06){
  if(!snd)return;
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.06,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(t+d+.02)}catch(e){}
}
document.addEventListener('click',e=>{if(snd&&e.target.closest&&e.target.closest('a,button,.media,.mi,[data-act]'))blip(560,.05)},true);

/* finestre grandi */
function ov(title,html){
  let o=$('#ov');
  if(!o){document.body.insertAdjacentHTML('beforeend','<div id="ov"><div id="ovp"><button class="ovx" data-act="ovc" aria-label="Chiudi">✕</button><h3 id="ovt"></h3><div id="ovb"></div></div></div>');o=$('#ov')}
  $('#ovt').textContent=title;$('#ovb').innerHTML=html;o.classList.add('on');return $('#ovb');
}
function ovc(){const o=$('#ov');if(o)o.classList.remove('on')}

/* pagine su misura per un'azienda */
function openTai(){
  const rows=$$('#tai li').map(l=>`<div class="ovr"><span>${esc(l.dataset.n)}</span><button data-act="tcp" data-s="${escA(l.dataset.s)}">Copia link</button><button data-act="tdel" data-s="${escA(l.dataset.s)}">Elimina</button></div>`).join('')||'<p class="mut">Non hai ancora creato nessuna pagina.</p>';
  const projs=$$('.card').map(x=>`<label class="ck"><input type="checkbox" value="${escA(x.dataset.id)}"> ${esc($('h3',x).textContent)} <small>${esc(x.dataset.cat)}</small></label>`).join('');
  ov("Pagine su misura per un'azienda",`${rows}<h4>Nuova pagina</h4><input id="tn" placeholder="Nome dell'azienda o dello studio"><textarea id="tgr" rows="3">Ciao team {nome}, ecco i lavori che credo vi servano.</textarea><div class="cks">${projs}</div><button class="pillb" data-act="tnew">Crea pagina</button>`);
}
function fillCst(li){
  $('#cst h2').textContent=li.dataset.n;$('#cg').textContent=li.dataset.g;
  const ids=(li.dataset.i||'').split(',').filter(Boolean);
  $('#cw').innerHTML=ids.map(id=>$$('.card').find(x=>x.dataset.id===id)).filter(x=>x&&(edit||!x.hasAttribute('data-draft'))).map(x=>{const im=$('.media img',x),sr=im&&im.getAttribute('src');return `<a class="fi" href="#/${encodeURIComponent(x.dataset.cat)}/${x.dataset.id}"><span class="fm">${sr?`<img src="${sr}" alt="${escA(im.alt||'')}" loading="lazy" style="object-position:${im.style.objectPosition||'50% 50%'}">`:''}</span><b>${esc($('h3',x).textContent)}</b><small>${esc(x.dataset.cat)}</small></a>`}).join('');
}

/* cronologia, ripristino, QR, aspetto */
async function restoreTo(sha){
  const b=(await api('')).default_branch,ref=(await api('/git/ref/heads/'+b)).object.sha,tc=await api('/git/commits/'+sha);
  const nc=await api('/git/commits',{method:'POST',body:JSON.stringify({message:'Ripristinata versione del '+new Date(tc.author.date).toLocaleString('it-IT'),tree:tc.tree.sha,parents:[ref]})});
  await api('/git/refs/heads/'+b,{method:'PATCH',body:JSON.stringify({sha:nc.sha})});
}
async function openHist(){
  if(!gh())return;
  ov('Cronologia delle pubblicazioni','<p class="mut">Carico…</p>');
  try{
    const L=await api('/commits?per_page=40'),it=L.filter(c=>/^(Aggiornamento portfolio|Annullata|Ripristinata)/.test(c.commit.message)).slice(0,15);
    $('#ovb').innerHTML=it.length?it.map((c,i)=>`<div class="ovr"><span>${new Date(c.commit.author.date).toLocaleString('it-IT',{dateStyle:'medium',timeStyle:'short'})}${i===0?' (attuale)':''}</span>${i?`<button data-act="rvt" data-sha="${c.sha}">Ripristina questa versione</button>`:''}</div>`).join(''):'<p class="mut">Nessuna pubblicazione trovata.</p>';
  }catch(err){$('#ovb').innerHTML='<p class="mut">Non riesco a leggere la cronologia: '+esc(err.message)+'</p>'}
}
function openQr(){
  const o=/^https?:/.test(location.origin)?location.origin+'/':'https://iltuosito.vercel.app/',u='https://api.qrserver.com/v1/create-qr-code/?size=700x700&margin=14&data='+encodeURIComponent(o);
  ov('Codice QR del sito',`<img class="qr" src="${u}" alt="Codice QR del sito"><p class="mut">Indirizzo: ${esc(o)}</p><a class="pillb" href="${u}" target="_blank" rel="noopener">Apri e salva l'immagine</a>`);
}
const FONTS=['Big Shoulders Display','Anton','Bebas Neue','Oswald','Archivo Black','Space Grotesk'];
function applyAp(a){
  let st=document.head.querySelector('#apx');if(!st){st=document.createElement('style');st.id='apx';document.head.appendChild(st)}
  const cf=a.fd&&a.fd!=='Big Shoulders Display';
  st.textContent=':root{'+(a.ac?`--ac:${a.ac};`:'')+(cf?`--d:'${a.fd}',Impact,sans-serif;`:'')+'}';
  let l=document.head.querySelector('#apl');
  if(cf){if(!l){l=document.createElement('link');l.id='apl';l.rel='stylesheet';document.head.appendChild(l)}l.href='https://fonts.googleapis.com/css2?family='+encodeURIComponent(a.fd).replace(/%20/g,'+')+'&display=swap'}
  else if(l)l.remove();
}
function openAp(){
  const st=document.head.querySelector('#apx'),cur=(st&&st.textContent)||'',ac=(cur.match(/--ac:(#[0-9a-f]{3,8})/i)||[])[1]||'#ffffff',fd=(cur.match(/--d:'([^']+)'/)||[])[1]||'Big Shoulders Display';
  ov('Aspetto del sito',`<label class="fl">Colore d'accento<input type="color" id="apc" value="${ac}"></label><label class="fl">Carattere dei titoli<select id="apf">${FONTS.map(f=>`<option${f===fd?' selected':''}>${f}</option>`).join('')}</select></label><p class="mut">Le modifiche si vedono subito. Premi Pubblica per tenerle.</p><button class="pillb" data-act="aprst">Ripristina</button>`);
}
document.addEventListener('input',e=>{
  if(e.target.id!=='apc'&&e.target.id!=='apf')return;
  const a={ac:$('#apc').value,fd:$('#apf').value};applyAp(a);
  try{localStorage.setItem('portfolio-ap',JSON.stringify(a))}catch(x){}
  dirty=true;updDirty();
});

/* presentazione e PDF */
function openPres(){
  const c=cc(),L=$$('.card').filter(x=>!x.hasAttribute('data-draft')&&(!c||c==='per'||x.dataset.cat===c));
  if(!L.length)return toast('Non ci sono ancora progetti da presentare.',3000);
  let o=$('#pr');
  if(!o){const ic=p=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${p}"/></svg>`;
    document.body.insertAdjacentHTML('beforeend',`<div id="pr"><div id="prs" data-act="prx"></div><button class="lbx" data-act="prc" aria-label="Chiudi">${ic('M6 6l12 12M18 6L6 18')}</button><div id="prn"><button class="lbp" data-act="prp" aria-label="Precedente">${ic('M15 5l-7 7 7 7')}</button><span id="prk"></span><button class="lbq" data-act="prx" aria-label="Successivo">${ic('M9 5l7 7-7 7')}</button></div></div>`);o=$('#pr')}
  pres={L,i:Math.max(0,L.findIndex(x=>x.dataset.id===pp()))};
  showPres(0);o.classList.add('on');
  try{if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{})}catch(e){}
}
function showPres(d){
  const p=pres;if(!p)return;
  p.i=(p.i+d+p.L.length)%p.L.length;
  const x=p.L[p.i],im=$('.media img',x),sr=im&&im.getAttribute('src'),ds=($('.dsc',x).textContent||$('.meta p',x).textContent||'').trim().slice(0,240);
  $('#prs').innerHTML=`<div class="ps">${sr?`<img src="${sr}" alt="${escA(im.alt||'')}" style="object-position:${im.style.objectPosition||'50% 50%'}">`:''}<div class="pt"><small>${esc(x.dataset.cat)}</small><h2>${esc($('h3',x).textContent)}</h2><p>${esc(ds)}</p></div></div>`;
  $('#prk').textContent=(p.i+1)+' / '+p.L.length;
}
function closePres(){const o=$('#pr');if(o)o.classList.remove('on');pres=null;try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}}
function printPortfolio(){
  let o=$('#pp');if(!o){document.body.insertAdjacentHTML('beforeend','<div id="pp"></div>');o=$('#pp')}
  const name=$$('.hero h1 span').map(x=>x.textContent).join(' ').trim(),role=(($('.rot')||{dataset:{}}).dataset.w||'').split(',').join(' · '),P=$$('.card').filter(x=>!x.hasAttribute('data-draft'));
  o.innerHTML=`<section class="pps pc0"><h1>${esc(name)}</h1><p>${esc(role)}</p><small>${esc(/^https?:/.test(location.origin)?location.origin:'')}</small></section>`+P.map(x=>{const im=$('.media img',x),sr=im&&im.getAttribute('src'),ds=($('.dsc',x).textContent||$('.meta p',x).textContent||'').trim().slice(0,420);return `<section class="pps"><div class="ppi">${sr?`<img src="${sr}" alt="">`:''}</div><div class="ppt"><small>${esc(x.dataset.cat)}</small><h2>${esc($('h3',x).textContent)}</h2><p>${esc(ds)}</p></div></section>`}).join('');
  toast('Nella finestra di stampa scegli "Salva come PDF".',7000);
  setTimeout(()=>window.print(),500);
}
addEventListener('afterprint',()=>{const o=$('#pp');if(o)o.remove()});

/* ricerca (SEO), pagine per ogni progetto, mappa del sito */
function setLd(){
  let sc=document.head.querySelector('#ld');if(!sc){sc=document.createElement('script');sc.type='application/ld+json';sc.id='ld';document.head.appendChild(sc)}
  const name=$$('.hero h1 span').map(x=>x.textContent).join(' ').trim(),role=(($('.rot')||{dataset:{}}).dataset.w||'').split(',').map(x=>x.trim()).filter(Boolean).join(', ');
  sc.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Person',name,jobTitle:role,url:location.origin+'/',sameAs:$$('#ct a[href^=http]').map(a=>a.href)});
}
function genPages(html){
  if(!/^https?:/.test(location.origin))return [];
  const O=location.origin,d=new DOMParser().parseFromString(html,'text/html'),out=[],urls=[O+'/'];
  const E=x=>String(x).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  d.querySelectorAll('.card').forEach(c=>{
    if(c.hasAttribute('data-draft')||!c.dataset.id)return;
    const id=c.dataset.id,cat=c.dataset.cat||'',t=((c.querySelector('h3')||{}).textContent||'Progetto').trim(),
      dsc=(((c.querySelector('.dsc')||{}).textContent||'').trim()||((c.querySelector('.meta p')||{}).textContent||'').trim()).slice(0,200),
      im=c.querySelector('.media img'),sr=im&&im.getAttribute('src'),abs=sr&&(/^https?:/.test(sr)?sr:O+(sr[0]==='/'?'':'/')+sr),
      url=O+'/p/'+id+'.html',dest='/#/'+encodeURIComponent(cat)+'/'+id;
    urls.push(url);
    out.push(['p/'+id+'.html',`<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${E(t)} | Mattia Agostoni</title><meta name="description" content="${E(dsc)}"><link rel="canonical" href="${E(url)}"><meta property="og:type" content="article"><meta property="og:title" content="${E(t)}"><meta property="og:description" content="${E(dsc)}"><meta property="og:url" content="${E(url)}">${abs?`<meta property="og:image" content="${E(abs)}"><meta name="twitter:card" content="summary_large_image">`:''}<link rel="stylesheet" href="/style.css"><script>location.replace(${JSON.stringify(dest)})</script></head><body><main class="nf"><h1>${E(t)}</h1><p>${E(dsc)}</p>${abs?`<img src="${E(abs)}" alt="${E((im&&im.getAttribute('alt'))||t)}" style="max-width:min(100%,900px)">`:''}<a class="nfb" href="${E(dest)}">Apri il progetto</a></main></body></html>`]);
  });
  out.push(['sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>'<url><loc>'+E(u)+'</loc></url>').join('\n')+'\n</urlset>\n']);
  out.push(['robots.txt','User-agent: *\nAllow: /\nSitemap: '+O+'/sitemap.xml\n']);
  return out;
}

/* azioni dei pulsanti nuovi */
function v6act(k,a,c,e){
  switch(k){
    case 'np':newProject();return true;
    case 'uz':undo();return true;
    case 'rz':redo();return true;
    case 'fp':fpC=c;toast('Clicca sul punto importante della foto (ad esempio il volto).',5000);return true;
    case 'alt':ask('Descrizione della copertina (per chi non la vede e per Google)',$('.media img',c).alt||'').then(v=>{if(v!==null){$('.media img',c).alt=v.trim();save()}});return true;
    case 'balt':{const b=a.closest('.blk');ask('Descrizione della foto',($('.bp img',b)||{}).alt||'').then(v=>{if(v!==null){$$('.bp img',b).forEach(i=>i.alt=v.trim());save()}});return true}
    case 'url':ask('Link del sito o gioco (https://…). Lascia vuoto per toglierlo.',c.dataset.url||'').then(v=>{if(v===null)return;v=v.trim();if(!v)c.removeAttribute('data-url');else c.dataset.url=/^https?:\/\//.test(v)?v:'https://'+v;save()});return true;
    case 'ph2':pick(s=>{$('.ab .ph .alt').src=s;save()});return true;
    case 'sec':{const sc=a.closest('section');sc.toggleAttribute('data-off');save();toast(sc.hasAttribute('data-off')?'Sezione nascosta ai visitatori.':'Sezione visibile.',3000);return true}
    case 'addtool':$('#tw').insertAdjacentHTML('beforeend',tool());ensureHandles();setEdit(true);save();return true;
    case 'addstep':$('#hw').insertAdjacentHTML('beforeend',step());ensureHandles();setEdit(true);save();return true;
    case 'addaw':$('#aws').insertAdjacentHTML('beforeend',tli('2026','Premio o collaborazione','Dove e con chi'));ensureHandles();setEdit(true);save();return true;
    case 'addrv':$('#rw').insertAdjacentHTML('beforeend',rev());ensureHandles();rvInit();setEdit(true);save();return true;
    case 'adddy':$('#dyl').insertAdjacentHTML('beforeend',dia());ensureHandles();setEdit(true);save();return true;
    case 'ap':openAp();return true;
    case 'aprst':{const x=document.head.querySelector('#apx'),y=document.head.querySelector('#apl');if(x)x.remove();if(y)y.remove();try{localStorage.removeItem('portfolio-ap')}catch(err){}openAp();return true}
    case 'tai':openTai();return true;
    case 'tnew':{
      const n=($('#tn').value||'').replace(/[<>"&]/g,'').trim(),ids=$$('.cks input:checked').map(x=>x.value);
      if(!n||!ids.length){toast("Scrivi il nome e scegli almeno un progetto.",3500);return true}
      let sl=slug(n),b=sl,i=2;while($$('#tai li').some(l=>l.dataset.s===sl))sl=b+'-'+i++;
      $('#tai').insertAdjacentHTML('beforeend',`<li data-s="${sl}" data-n="${escA(n)}" data-g="${escA(($('#tgr').value||'').replace(/\{nome\}/g,n))}" data-i="${escA(ids.join(','))}"></li>`);
      save();openTai();toast('Pagina creata. Premi Pubblica per metterla online.',4500);return true}
    case 'tcp':{const u=location.origin+location.pathname+'#/per/'+a.dataset.s;(navigator.clipboard?navigator.clipboard.writeText(u):Promise.reject()).then(()=>toast('Link copiato.',2500)).catch(()=>toast(u,8000));return true}
    case 'tdel':{const l=$$('#tai li').find(x=>x.dataset.s===a.dataset.s);if(l&&confirm('Eliminare questa pagina?')){snap();l.remove();save();openTai()}return true}
    case 'hist':openHist();return true;
    case 'rvt':if(confirm("Ripristinare questa versione? Il sito tornerà com'era in quella data.")){toast('Ripristino...',20000);restoreTo(a.dataset.sha).then(()=>{try{localStorage.removeItem(K)}catch(x){}toast('Fatto! Il sito torna a quella versione tra circa un minuto. Ricarico...',6000);setTimeout(()=>location.reload(),2500)}).catch(err=>toast('Non ripristinato: '+err.message,12000))}return true;
    case 'qr':openQr();return true;
    case 'pres':openPres();return true;
    case 'prc':closePres();return true;
    case 'prp':showPres(-1);return true;
    case 'prx':showPres(1);return true;
    case 'pdf':printPortfolio();return true;
    case 'snd':snd=!snd;try{localStorage.setItem('portfolio-sn',snd?'1':'0')}catch(x){}upLabels();blip(660,.08);return true;
    case 'rdm':reduce=!reduce;try{localStorage.setItem('portfolio-rm',reduce?'1':'0')}catch(x){}H.classList.toggle('rm',reduce);upLabels();return true;
    case 'ovc':ovc();return true;
  }
  return false;
}

/* pagine per categoria, con transizione */
const seg=()=>{try{const h=decodeURIComponent(location.hash.slice(1));return h[0]==='/'?h.slice(1).split('/'):[]}catch(e){return[]}};
const cc=()=>seg()[0]||'',pp=()=>seg()[1]||'';
let cur=cc()+'/'+pp();
const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&x.target.classList.add('vw')),{threshold:.15});
function fl(){
  fixIds();lz();renderFeat();
  $$('#cats li').forEach(l=>{const c=$('a',l).dataset.c,k=$$('.card').filter(x=>x.dataset.cat===c&&!x.hasAttribute('data-draft')).length;$('.n',l).textContent=k+(k===1?' progetto':' progetti');l.classList.toggle('emp',!k)});
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
  $('#lavori .bk').setAttribute('href',card?'#/'+encodeURIComponent(c):'#/');
  $$('.emb,.vb').forEach(e=>e.innerHTML='');
  if(card)$('.emb',card).innerHTML=(card.dataset.url?`<a class="ext" href="${card.dataset.url.replace(/"/g,'%22')}" target="_blank" rel="noopener">Apri il sito</a>`:'')+(card.dataset.video?emb(card.dataset.video,0):'');
  {const tai=c==='per'?$$('#tai li').find(l=>l.dataset.s===pp()):null;B.classList.toggle('cs',!!tai);if(tai)fillCst(tai)}
  if(card)$$('.blk[data-t=v]',card).forEach(b=>{$('.vb',b).innerHTML=emb(b.dataset.v||'',0)});
  if(card){const m=$('.media',card),ar=(m.style.aspectRatio||'').split('/').map(parseFloat);if(ar.length===2&&ar[0]&&ar[1])m.style.setProperty('--arn',ar[0]/ar[1])}
  pnav(card,c);
  fl();
  buildMq();stats();skills();
  $$('.sh,#ix,.ab,#contatti,#feat,#cv,#tools,#how,#aw,#rv,#dy,#cst').forEach(e=>{e.classList.remove('vw');io.unobserve(e);io.observe(e)});
  const t2=c?null:$({lavori:'#ix',chi:'#chi',cv:'#cv',contatti:'#contatti'}[h]||'#none');
  t2?t2.scrollIntoView({behavior:'instant'}):scrollTo({top:0,behavior:'instant'});
}
addEventListener('hashchange',()=>{
  const c=cc(),k=c+'/'+pp();if(k===cur)return;cur=k;
  let cw=pp()&&$$('.card').find(x=>x.dataset.id===pp()&&x.dataset.cat===c),W=((cw&&$('h3',cw).textContent.trim())||c||'Home').slice(0,22);
  {const tn=c==='per'&&$$('#tai li').find(l=>l.dataset.s===pp());if(tn)W=tn.dataset.n.slice(0,22)}
  blip(200,.2);
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
v6init();

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
