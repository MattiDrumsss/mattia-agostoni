const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=$('#root'),K='portfolio-v3',H=document.documentElement;
let edit=false,t,n=0,LB=[];

const card=(c='')=>`<article class="card" data-cat="${c}"><div class="media" data-img><img alt=""></div><div class="gal"></div><div class="meta"><h3 data-e>Titolo progetto</h3><p data-e>Descrizione breve, anno</p></div><div class="tl"><button data-act="img">Immagini</button><button data-act="cat">Categoria</button><button data-act="vid">Video</button><button data-act="prv">Anteprima</button><button data-act="ba">Prima e dopo</button><button data-act="del">Elimina</button></div></article>`;
const li=(a,b)=>`<li><span data-e>${a}</span>${b?`<a data-e data-l href="#">${b}</a>`:''}<b class="x" data-act="rm">Togli</b></li>`;
const gh=()=>{try{return JSON.parse(localStorage.getItem('portfolio-gh'))}catch(e){return null}},up={},hd={};
const catLi=c=>`<li><a href="#/${encodeURIComponent(c)}" data-c="${c}">${c}</a><span class="n"></span><b class="x" data-act="rmcat">Togli</b></li>`;
const toast=m=>{const e=$('#ts');e.textContent=m;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),4000)};

/* carica contenuto salvato nel browser, oppure quello di partenza */
let saved=false;
try{const s=localStorage.getItem(K);if(s){root.innerHTML=s;saved=true}}catch(e){}
if(!saved&&!root.dataset.init){
  $('#grid').innerHTML=card('Grafica')+card('Video')+card('Motion');
  $('#cats').innerHTML=['Grafica','Video','Motion'].map(catLi).join('');
  $('#sk').innerHTML=['Identità visiva','Editoria e impaginazione','Video editing','Motion graphics'].map(x=>li(x)).join('');
  $('#ct').innerHTML=li('Instagram','@tuonome')+li('Behance','behance.net/tuonome');
  root.dataset.init=1;
}

const save=()=>{try{localStorage.setItem(K,root.innerHTML.replace(/ contenteditable="true"/g,'').replace(/<video class="pv"[^>]*><\/video>/g,''))}catch(e){toast('Memoria del browser piena: premi "Scarica index.html" per non perdere le modifiche.')}};
function setEdit(on){
  edit=on;document.body.classList.toggle('edit',on);
  $$('[data-e]').forEach(e=>on?e.setAttribute('contenteditable','true'):e.removeAttribute('contenteditable'));
  $('#tg').textContent=on?'Fine modifiche':'Modifica';
  if(!on)save();
}
if(gh()){H.classList.add('admin');setEdit(true)}

/* scelta immagine, ridimensionata per non appesantire il sito */
function pick(cb,multi){
  const i=document.createElement('input');i.type='file';i.accept='image/*';i.multiple=!!multi;
  i.onchange=()=>[...i.files].forEach(f=>{const r=new FileReader();
    r.onload=()=>{const im=new Image();im.onload=()=>{
      const k=Math.min(1,1200/Math.max(im.width,im.height)),c=document.createElement('canvas');
      c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
      c.getContext('2d').drawImage(im,0,0,c.width,c.height);
      cb(c.toDataURL(f.type==='image/png'?'image/png':'image/jpeg',.82))};im.src=r.result};
    r.readAsDataURL(f)});
  i.click();
}
function emb(u){
  let m;
  if(m=u.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/))return`<iframe src="https://www.youtube.com/embed/${m[1]}?autoplay=1" allow="autoplay;fullscreen" allowfullscreen></iframe>`;
  if(m=u.match(/vimeo\.com\/(\d+)/))return`<iframe src="https://player.vimeo.com/video/${m[1]}?autoplay=1" allow="autoplay;fullscreen" allowfullscreen></iframe>`;
  return`<video src="${u}" controls autoplay playsinline></video>`;
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
  if(edit&&l&&l.hasAttribute('data-e'))e.preventDefault();
  const fb=T.closest('[data-f]');
  if(fb){$$('[data-f]').forEach(b=>b.classList.toggle('on',b===fb));$('#fs').textContent=fb.dataset.f==='Tutti'?'':`.card:not([data-cat=${JSON.stringify(fb.dataset.f)}]){display:none}`;return}
  const a=T.closest('[data-act]');
  if(a){
    const c=a.closest('.card'),k=a.dataset.act;
    if(k==='tg')setEdit(!edit);
    else if(k==='dl')dl();
    else if(k==='rs'){if(confirm('Tornare alla versione del file? Le modifiche non scaricate andranno perse.')){try{localStorage.removeItem(K)}catch(x){}location.reload()}}
    else if(k==='add'){$('#grid').insertAdjacentHTML('beforeend',card(cc()));fl();setEdit(edit);save()}
    else if(k==='del'){if(confirm('Eliminare questo progetto?')){c.remove();fl();save()}}
    else if(k==='vid'){const u=prompt('Link YouTube o Vimeo, oppure percorso di un file video (es. /video/reel.mp4). Lascia vuoto per togliere il video.',c.dataset.video||'');if(u!==null){u.trim()?c.dataset.video=u.trim():c.removeAttribute('data-video');save()}}
    else if(k==='addsk'){$('#sk').insertAdjacentHTML('beforeend',li('Nuova competenza'));setEdit(edit);save()}
    else if(k==='addct'){$('#ct').insertAdjacentHTML('beforeend',li('Etichetta','link'));setEdit(edit);save()}
    else if(k==='rm'){a.parentNode.remove();save()}
    else if(k==='inv'){$('.logo img').classList.toggle('iv');save()}
    else if(k==='img'){const g=$('.gal',c),n=$$('img',g).length;if(n&&!confirm(`Questo progetto ha già ${n} immagini nella galleria. OK = aggiungine altre, Annulla = svuota la galleria.`)){g.innerHTML='';save();return}pick(s=>{g.insertAdjacentHTML('beforeend',`<img src="${s}" alt="">`);save()},1)}
    else if(k==='cat'){const u=prompt('Categoria del progetto (es. Grafica, Video, Motion)',c.dataset.cat||'');if(u!==null){c.dataset.cat=u.trim();route();save()}}
    else if(k==='prv'){const u=prompt('Percorso di una clip breve (mp4) che parte al passaggio del mouse, es. /anteprime/logo.mp4. Vuoto per toglierla.',c.dataset.pv||'');if(u!==null){u.trim()?c.dataset.pv=u.trim():c.removeAttribute('data-pv');save()}}
    else if(k==='ba'){c.toggleAttribute('data-ba');toast(c.hasAttribute('data-ba')?'Prima e dopo attivo: la copertina è il "prima", la prima immagine della galleria è il "dopo".':'Prima e dopo disattivato.');save()}
    else if(k==='reel'){const v=$('.reel');if(confirm('Showreel: vuoi caricare un video dal computer?\nOK = scegli il file, Annulla = scrivi un link o un percorso')){vpick(f=>{const p='/showreel.'+(f.name.split('.').pop()||'mp4').toLowerCase(),bu=URL.createObjectURL(f);up[bu]={p,f};v.src=bu;v.play().catch(()=>{});save()});return}const u=prompt('Percorso del file video (mp4 o webm), es. /showreel.mp4. Vuoto per toglierlo.',v.getAttribute('src')||'');if(u!==null){if(u.trim()){v.src=u.trim();v.play().catch(()=>{})}else v.removeAttribute('src');save()}}
    else if(k==='addcat'){const u=(prompt('Nome della nuova categoria (es. Fotografia)')||'').replace(/[<>&"\/]/g,'').trim();if(u&&!$$('#cats a').some(x=>x.dataset.c===u)){$('#cats').insertAdjacentHTML('beforeend',catLi(u));fl();save()}}
    else if(k==='rmcat'){const l=a.closest('li'),nm=$('a',l).dataset.c;if(confirm(`Eliminare la categoria "${nm}" e tutti i suoi progetti?`)){$$('.card').filter(x=>x.dataset.cat===nm).forEach(x=>x.remove());l.remove();save()}}
    else if(k==='login'){const r=prompt('Nome del repository GitHub, nel formato utente/repository (es. mattiaagostoni/portfolio)',(gh()||{}).repo||'');if(!r)return;const t=prompt('Incolla qui il token di GitHub (resta solo in questo browser)');if(!t)return;localStorage.setItem('portfolio-gh',JSON.stringify({repo:r.trim(),token:t.trim()}));location.reload()}
    else if(k==='out'){if(confirm("Uscire dall'editor? Per modificare dovrai reinserire il token.")){localStorage.removeItem('portfolio-gh');location.reload()}}
    else if(k==='pub')pub();
    else if(k==='nfoto'){const ct=tcat();if(!ct)return;let cd=null;pick(s=>{if(!cd){$('#grid').insertAdjacentHTML('beforeend',card(ct));cd=$('#grid').lastElementChild;$('.media img',cd).src=s;toast(`Progetto aggiunto in "${ct}"`)}else $('.gal',cd).insertAdjacentHTML('beforeend',`<img src="${s}" alt="">`);fl();setEdit(true);save()},1)}
    else if(k==='nvideo'){const ct=tcat();if(!ct)return;vpick(f=>{const p='/video/'+f.name.toLowerCase().replace(/[^a-z0-9.]+/g,'-'),bu=URL.createObjectURL(f);up[bu]={p,f};$('#grid').insertAdjacentHTML('beforeend',card(ct));const cd=$('#grid').lastElementChild;cd.dataset.video=bu;$('h3',cd).textContent=f.name.replace(/\.[^.]+$/,'').replace(/[-_]+/g,' ');frame(f,s=>{$('.media img',cd).src=s;save()});fl();setEdit(true);save();toast(`Video aggiunto in "${ct}"`)})}
    else if(k==='film')document.body.classList.toggle('film');
    else if(k==='prev')show(n-1);
    else if(k==='next')show(n+1);
    else if(k==='close'){$('#lb').classList.remove('on');$('#lbc').innerHTML=''}
    return;
  }
  const im=T.closest('[data-img]');
  if(edit&&im){pick(s=>{$('img',im).src=s;save()});return}
  const m=T.closest('.media');
  if(!edit&&m){
    openC(m.closest('.card'));
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
function openC(c){
  const im=[$('.media img',c),...$$('.gal img',c)].filter(x=>x.getAttribute('src')).map(x=>x.src);
  if(c.hasAttribute('data-ba')&&im.length>1)LB=[`<div class="ba"><img src="${im[1]}" alt=""><img class="bf" src="${im[0]}" alt="" style="clip-path:inset(0 50% 0 0)"><i style="left:50%"></i><span style="left:12px">Prima</span><span style="right:12px">Dopo</span><input type="range" min="0" max="100" value="50" aria-label="Confronta prima e dopo"></div>`];
  else{LB=im.map(s=>`<img src="${s}" alt="">`);if(c.dataset.video)LB.unshift(emb(c.dataset.video))}
  if(LB.length)show(0);
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
  const g=gh(),r=await fetch('https://api.github.com/repos/'+g.repo+p,{...o,headers:{Authorization:'Bearer '+g.token,Accept:'application/vnd.github+json','Content-Type':'application/json'}});
  if(!r.ok)throw new Error(r.status+' '+(await r.text()).slice(0,140));
  return r.json();
}
const b64=f=>new Promise(ok=>{const r=new FileReader();r.onload=()=>ok(r.result.split(',')[1]);r.readAsDataURL(f)});
const blob=c=>api('/git/blobs',{method:'POST',body:JSON.stringify(c)}).then(x=>x.sha);
async function pub(){
  if(!gh())return;
  if(!confirm('Pubblicare le modifiche sul sito? Saranno online tra circa un minuto.'))return;
  const w=edit,ad=H.classList.contains('admin'),fm=document.body.classList.contains('film');
  setEdit(false);toast('Pubblico... non chiudere la pagina');
  try{
    $('#fs').textContent='';H.classList.remove('admin');document.body.classList.remove('film');
    let html='<!DOCTYPE html>\n'+H.outerHTML;
    H.classList.add('admin');if(fm)document.body.classList.add('film');
    html=html.replace(/(<div id="(?:wp|fp|lb|ts)") class="(?:go|on)"/g,'$1');
    const files=[],mk=[];let i=0;
    for(const u of new Set(html.match(/data:image\/[a-z+]+;base64,[A-Za-z0-9+\/=]+/g)||[])){
      const p=hd[u]||('immagini/'+Date.now()+'-'+(i++)+(u.startsWith('data:image/png')?'.png':'.jpg'));
      if(!hd[u]){files.push([p,u.split(',')[1]]);mk.push(()=>hd[u]=p)}
      html=html.split(u).join('/'+p);
    }
    for(const [bu,o] of Object.entries(up)){
      if(!html.includes(bu))continue;
      html=html.split(bu).join(o.p);
      if(!o.d){files.push([o.p.slice(1),await b64(o.f)]);mk.push(()=>o.d=1)}
    }
    const b=(await api('')).default_branch,ref=(await api('/git/ref/heads/'+b)).object.sha,cm=await api('/git/commits/'+ref);
    const tree=[];
    for(const [p,c] of files)tree.push({path:p,mode:'100644',type:'blob',sha:await blob({content:c,encoding:'base64'})});
    tree.push({path:'index.html',mode:'100644',type:'blob',sha:await blob({content:html,encoding:'utf-8'})});
    const nt=await api('/git/trees',{method:'POST',body:JSON.stringify({base_tree:cm.tree.sha,tree})});
    const nc=await api('/git/commits',{method:'POST',body:JSON.stringify({message:'Aggiornamento portfolio',tree:nt.sha,parents:[ref]})});
    await api('/git/refs/heads/'+b,{method:'PATCH',body:JSON.stringify({sha:nc.sha})});
    mk.forEach(f=>f());try{localStorage.removeItem(K)}catch(e){}
    toast('Pubblicato! Il sito online si aggiorna tra circa un minuto.');
  }catch(err){H.classList.add('admin');toast('Errore nella pubblicazione: '+err.message)}
  if(w)setEdit(true);
}
addEventListener('beforeunload',e=>{if(Object.values(up).some(o=>!o.d))e.preventDefault()});

/* pagine per categoria, con transizione */
const cc=()=>{try{const h=decodeURIComponent(location.hash.slice(1));return h[0]==='/'?h.slice(1):''}catch(e){return ''}};
let cur=cc();
const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&x.target.classList.add('vw')),{threshold:.15});
function fl(){
  $$('#cats li').forEach(l=>{const c=$('a',l).dataset.c,k=$$('.card').filter(x=>x.dataset.cat===c).length;$('.n',l).textContent=k+(k===1?' progetto':' progetti')});
}
function route(){
  const c=cc(),h=location.hash.slice(1);
  document.body.classList.toggle('pg',!!c);
  $('#fs').textContent=c?`.card:not([data-cat=${JSON.stringify(c)}]){display:none}`:'';
  if(c)$('#lavori h2').textContent=c;
  fl();
  $$('.sh,#ix,.ab').forEach(e=>{e.classList.remove('vw');io.unobserve(e);io.observe(e)});
  const t2=c?null:$({lavori:'#ix',chi:'#chi',contatti:'#contatti'}[h]||'#none');
  t2?t2.scrollIntoView({behavior:'instant'}):scrollTo({top:0,behavior:'instant'});
}
addEventListener('hashchange',()=>{
  const c=cc();if(c===cur)return;cur=c;
  const w=$('#wp');$('b',w).textContent=c||'Home';
  w.classList.remove('go');void w.offsetWidth;w.classList.add('go');
  setTimeout(route,480);
});
document.addEventListener('mouseover',e=>{
  const a=e.target.closest('#cats a');
  const k=a&&$$('.card').find(x=>x.dataset.cat===a.dataset.c&&$('.media img',x).getAttribute('src'));
  if(k)$('img',fp).src=$('.media img',k).src;
  fp.classList.toggle('on',!!k);
});
route();

/* cursore: piccolo punto, cerchio che inverte i colori sul nome */
const cu=$('#cu'),fp=$('#fp');
addEventListener('mousemove',e=>{
  cu.style.left=e.clientX+'px';cu.style.top=e.clientY+'px';fp.style.transform=`translate(${e.clientX+36}px,${e.clientY-150}px) rotate(-4deg)`;
  const x=e.target;
  cu.classList.toggle('s',!!x.closest('h1'));
  cu.classList.toggle('h',!x.closest('h1')&&!!x.closest('a,button,.media,[data-img]'));
});
