/* account.js: accesso, preferiti, commenti, richieste, area clienti, proposte (Firebase, piano gratuito) */
(function(){
'use strict';
const CF=(()=>{try{return JSON.parse(document.getElementById('fbcfg').textContent)}catch(e){return null}})()||{};
window.FBC=CF;
let m=null,user=null,adm=false;
const ERR={'auth/invalid-credential':'Mail o password sbagliate.','auth/user-not-found':'Non esiste un account con questa mail.','auth/wrong-password':'Password sbagliata.','auth/email-already-in-use':'Questa mail ha già un account: accedi.','auth/weak-password':'La password è troppo corta (almeno 6 caratteri).','auth/invalid-email':'La mail non è valida.','auth/popup-closed-by-user':'Accesso annullato.','auth/too-many-requests':"Troppi tentativi: riprova tra un po'.",'permission-denied':'Non hai il permesso (controlla di aver confermato la mail).'};
const er=e=>ERR[e&&e.code]||('Errore: '+((e&&e.message)||e));
const lc=s=>String(s||'').toLowerCase();
const T=ts=>{try{return (ts&&ts.toDate?ts.toDate():new Date(ts)).toLocaleString('it-IT',{dateStyle:'medium',timeStyle:'short'})}catch(e){return ''}};
const curCard=()=>document.body.classList.contains('pj')?$$('.card').find(x=>x.dataset.id===pp()&&x.dataset.cat===cc()):null;
const go=p=>p.catch(e=>toast(er(e),6000));

async function fb(){
  if(m)return m;
  if(!CF.cfg)throw new Error('Firebase non è ancora collegato (menu ⋯, Collega Firebase e servizi).');
  if(window.__fbm)m=window.__fbm;
  else{
    const B='https://www.gstatic.com/firebasejs/10.14.1/',[a,au,fs]=await Promise.all([import(B+'firebase-app.js'),import(B+'firebase-auth.js'),import(B+'firebase-firestore.js')]);
    const app=a.initializeApp(CF.cfg);
    m=Object.assign({},au,fs,{auth:au.getAuth(app),db:fs.getFirestore(app)});
  }
  await new Promise(r=>{let first=true;m.onAuthStateChanged(m.auth,u=>{user=u;adm=!!(u&&u.emailVerified&&CF.admin&&lc(u.email)===lc(CF.admin));refresh();if(first){first=false;r()}else if(window.accHook)accHook(curCard())})});
  return m;
}
function refresh(){
  const b=$('.acc');if(b)b.textContent=user?((user.displayName||user.email||'Account').split(/[ @]/)[0]):'Accedi';
  try{localStorage.setItem('fb-li',user?'1':'')}catch(e){}
}
const need=async()=>{await fb();if(!user){openAuth();throw new Error('Accedi per continuare.')}};
const needV=async()=>{await need();if(!user.emailVerified){toast('Conferma prima la tua mail: ti ho mandato un link (controlla anche la posta indesiderata).',6000);throw new Error('Mail non confermata.')}};
const needA=async()=>{if(!CF.cfg){panCfg();throw new Error('Collega prima Firebase.')}await fb();if(!adm){openAuth();throw new Error("Accedi con la mail dell'amministratore (e conferma la mail).")}};

/* ---------- accesso ---------- */
function openAuth(reg){
  ov(reg?'Crea un account':'Accedi',`<div class="afm"><input id="ae" type="email" placeholder="La tua mail" autocomplete="email">${reg?'<input id="an" type="text" placeholder="Il tuo nome" autocomplete="name">':''}<input id="apw" type="password" placeholder="Password" autocomplete="${reg?'new-password':'current-password'}"><button class="pillb" data-act="${reg?'au_reg':'au_in'}">${reg?'Crea account':'Accedi'}</button><button class="pillb alt" data-act="au_g">Continua con Google</button><button class="pillb alt" data-act="au_ml">Ricevi un link via mail (senza password)</button><p class="mut">${reg?'Hai già un account? <button class="lnk" data-act="au_sw">Accedi</button>':'Non hai un account? <button class="lnk" data-act="au_sw">Creane uno</button> · <button class="lnk" data-act="au_fp">Password dimenticata</button>'}</p><p class="mut" id="am"></p></div>`);
}
const say=t=>{const e=$('#am');if(e)e.textContent=t};
async function afterIn(){ovc();toast('Benvenuto'+(user&&user.displayName?', '+user.displayName.split(' ')[0]:'')+'!',2500);if(window.accHook)accHook(curCard())}
async function emailLinkDone(){
  const M=await fb();
  if(!M.isSignInWithEmailLink(M.auth,location.href))return;
  let em='';try{em=localStorage.getItem('fb-ml')||''}catch(e){}
  if(!em)em=await ask('Scrivi la mail a cui hai ricevuto il link')||'';
  if(!em)return;
  try{await M.signInWithEmailLink(M.auth,em,location.href);try{localStorage.removeItem('fb-ml')}catch(e){}history.replaceState(null,'',location.origin+location.pathname+location.hash);toast('Accesso completato.',3000)}catch(e){toast(er(e),6000)}
}
async function acc(){
  if(!CF.cfg){if(gh()){panCfg()}return}
  const M=await fb();
  if(!user)return openAuth();
  ov('Il tuo account',`<p><b>${esc(user.displayName||'')}</b><br><span class="mut">${esc(user.email||'')}${user.emailVerified?'':' · mail non confermata'}</span></p><div class="afm"><button class="pillb alt" data-act="fvs">I miei preferiti</button><button class="pillb alt" data-act="jobs">Area clienti</button><button class="pillb alt" data-act="myreq">Le mie richieste</button>${user.emailVerified?'':'<button class="pillb alt" data-act="au_vf">Rimanda la mail di conferma</button>'}${adm?'<button class="pillb" data-act="hub">Pannello amministratore</button>':''}<button class="pillb alt" data-act="au_out">Esci</button></div>`);
}

/* ---------- mi piace, preferiti, commenti ---------- */
window.accHook=function(card){
  const s=$('#soc');if(!s)return;
  if(!card||!CF.cfg){s.innerHTML='';return}
  s.innerHTML='<p class="soc-t">Cosa ne pensi?</p><span class="srow"><button class="lkb" data-act="lk2">♥ <b id="lkn">·</b></button><button class="lkb" data-act="fav">☆ Preferiti</button></span><ul id="cml"></ul><span id="cmf"></span>';
  go(loadSoc(card));
};
async function loadSoc(card){
  const id=card.dataset.id,M=await fb();
  if(pp()!==id||!$('#lkn'))return;
  try{const n=await M.getCountFromServer(M.query(M.collection(M.db,'pf_likes'),M.where('pid','==',id)));$('#lkn').textContent=n.data().count}catch(e){$('#lkn').textContent='0'}
  let coll=false;
  if(user){
    try{const d=await M.getDoc(M.doc(M.db,'pf_likes',id+'__'+user.uid));$('.lkb[data-act=lk2]').classList.toggle('on',d.exists())}catch(e){}
    try{const f=await M.getDoc(M.doc(M.db,'pf_favs',user.uid)),on=f.exists()&&(f.data().ids||[]).includes(id),b=$('.lkb[data-act=fav]');b.classList.toggle('on',on);b.textContent=(on?'★':'☆')+' Preferiti'}catch(e){}
    try{const c=await M.getDoc(M.doc(M.db,'pf_config','collab'));coll=c.exists()&&(c.data().emails||[]).map(lc).includes(lc(user.email))}catch(e){}
  }
  try{const q=await M.getDocs(M.query(M.collection(M.db,'pf_comments'),M.where('pid','==',id),M.where('ok','==',true)));
    $('#cml').innerHTML=q.docs.map(d=>d.data()).sort((a,b)=>((a.ts&&a.ts.seconds)||0)-((b.ts&&b.ts.seconds)||0)).map(c=>`<li><b>${esc(c.name||'Utente')}</b><p>${esc(c.text)}</p></li>`).join('')}catch(e){}
  if($('#cmf'))$('#cmf').innerHTML=user?'<textarea id="cmt" rows="3" maxlength="800" placeholder="Scrivi un commento (compare dopo la mia approvazione)"></textarea><button class="pillb" data-act="cmts">Invia</button>'+(coll?'<button class="pillb alt" data-act="prop">Proponi una foto</button>':''):'<button class="pillb" data-act="acc">Accedi per commentare o salvare</button>';
}
async function like(){
  await needV();const M=m,id=pp(),ref=M.doc(M.db,'pf_likes',id+'__'+user.uid),b=$('.lkb[data-act=lk2]'),on=b.classList.contains('on');
  if(on)await M.deleteDoc(ref);else await M.setDoc(ref,{pid:id,uid:user.uid});
  b.classList.toggle('on',!on);$('#lkn').textContent=Math.max(0,(+$('#lkn').textContent||0)+(on?-1:1));
}
async function fav(){
  await needV();const M=m,id=pp(),b=$('.lkb[data-act=fav]'),on=b.classList.contains('on');
  await M.setDoc(M.doc(M.db,'pf_favs',user.uid),{ids:on?M.arrayRemove(id):M.arrayUnion(id),name:user.displayName||''},{merge:true});
  b.classList.toggle('on',!on);b.textContent=(on?'☆':'★')+' Preferiti';
}
async function comment(){
  await needV();const M=m,t=($('#cmt').value||'').trim();if(!t)return;
  await M.addDoc(M.collection(M.db,'pf_comments'),{pid:pp(),uid:user.uid,name:user.displayName||(user.email||'').split('@')[0],text:t.slice(0,800),ts:M.serverTimestamp(),ok:false});
  $('#cmt').value='';toast('Grazie! Il commento comparirà dopo la mia approvazione.',4500);
}
async function favs(){
  await needV();const M=m,f=await M.getDoc(M.doc(M.db,'pf_favs',user.uid)),d=f.exists()?f.data():{ids:[]},ids=d.ids||[];
  const rows=ids.map(id=>$$('.card').find(x=>x.dataset.id===id)).filter(Boolean).map(x=>`<div class="ovr"><span>${esc($('h3',x).textContent)}</span><a class="pillb" href="#/${encodeURIComponent(x.dataset.cat)}/${x.dataset.id}" data-act="ovc">Apri</a></div>`).join('')||'<p class="mut">Non hai ancora salvato nessun progetto.</p>';
  ov('I miei preferiti',rows+`<label class="ck"><input type="checkbox" id="fsh" ${d.shared?'checked':''}> Rendi la mia selezione visibile a chi ha il link</label><p class="mut" id="flk">${d.shared?esc(location.origin+location.pathname+'#/sel/'+user.uid):''}</p>`);
}
async function favShare(a){
  await needV();const M=m,on=$('#fsh').checked;
  await M.setDoc(M.doc(M.db,'pf_favs',user.uid),{shared:on,name:user.displayName||(user.email||'').split('@')[0]},{merge:true});
  $('#flk').textContent=on?location.origin+location.pathname+'#/sel/'+user.uid:'';toast(on?'Selezione condivisa: copia il link qui sotto.':'Selezione di nuovo privata.',3500);
}
window.accSel=async function(uid){
  $('#cst h2').textContent='Selezione';$('#cg').textContent='Carico…';$('#cw').innerHTML='';
  try{const M=await fb(),f=await M.getDoc(M.doc(M.db,'pf_favs',uid));
    if(!f.exists()||!f.data().shared){$('#cg').textContent='Questa selezione non è condivisa.';return}
    const d=f.data();$('#cst h2').textContent=d.name?'Selezione di '+d.name:'Selezione';$('#cg').textContent='I progetti che ha scelto.';
    $('#cw').innerHTML=(d.ids||[]).map(id=>$$('.card').find(x=>x.dataset.id===id)).filter(x=>x&&!x.hasAttribute('data-draft')).map(x=>{const im=$('.media img',x),sr=im&&im.getAttribute('src');return `<a class="fi" href="#/${encodeURIComponent(x.dataset.cat)}/${x.dataset.id}"><span class="fm">${sr?`<img src="${sr}" alt="${escA(im.alt||'')}" loading="lazy">`:''}</span><b>${esc($('h3',x).textContent)}</b><small>${esc(x.dataset.cat)}</small></a>`}).join('');
  }catch(e){$('#cg').textContent=er(e)}
};

/* ---------- preventivi ---------- */
async function reqForm(){
  await needV();
  ov('Richiedi un preventivo',`<textarea id="rqm" rows="5" maxlength="2000" placeholder="Di cosa hai bisogno? Scadenze, budget, riferimenti..."></textarea><button class="pillb" data-act="reqs">Invia la richiesta</button><p class="mut">Potrai seguire lo stato in "Le mie richieste".</p>`);
}
async function reqSend(){
  await needV();const M=m,t=($('#rqm').value||'').trim();if(!t)return toast('Scrivi qualcosa nella richiesta.',3000);
  await M.addDoc(M.collection(M.db,'pf_requests'),{uid:user.uid,name:user.displayName||'',email:user.email,msg:t,status:'ricevuta',reply:'',ts:M.serverTimestamp()});
  ovc();toast('Richiesta inviata! Ti risponderò presto.',4500);
}
async function myReq(){
  await needV();const M=m,q=await M.getDocs(M.query(M.collection(M.db,'pf_requests'),M.where('uid','==',user.uid)));
  const L=q.docs.map(d=>d.data()).sort((a,b)=>((b.ts&&b.ts.seconds)||0)-((a.ts&&a.ts.seconds)||0));
  ov('Le mie richieste',L.map(r=>`<div class="ovr col2"><span><b>${esc(r.status)}</b> · ${T(r.ts)}<br>${esc(r.msg)}${r.reply?`<br><i>Risposta: ${esc(r.reply)}</i>`:''}</span></div>`).join('')||'<p class="mut">Nessuna richiesta.</p>');
}

/* ---------- area clienti ---------- */
async function jobs(){
  await needV();const M=m,q=await M.getDocs(M.query(M.collection(M.db,'pf_jobs'),M.where('emails','array-contains',lc(user.email))));
  ov('Area clienti',q.docs.map(d=>({id:d.id,...d.data()})).map(j=>`<div class="ovr"><span><b>${esc(j.title)}</b><br><span class="mut">${esc(j.type==='riservato'?'Progetto riservato':'Bozza da approvare')} · ${esc(j.status||'')}</span></span><button data-act="job" data-id="${escA(j.id)}">Apri</button></div>`).join('')||'<p class="mut">Non ci sono lavori per te al momento.</p>');
}
async function job(id){
  await needV();const M=m,j=(await M.getDoc(M.doc(M.db,'pf_jobs',id))).data(),fs=await M.getDocs(M.collection(M.db,'pf_jobs',id,'files')),ns=await M.getDocs(M.collection(M.db,'pf_jobs',id,'notes'));
  const N=ns.docs.map(d=>({id:d.id,...d.data()})),bozza=j.type!=='riservato';
  const body=fs.docs.map(d=>({id:d.id,...d.data()})).map(f=>`<span class="jf" data-act="${bozza?'jfc':''}" data-j="${escA(id)}" data-f="${escA(f.id)}"><img src="${f.data}" alt="${escA(f.name||'')}">${N.filter(n=>n.fileId===f.id).map((n,i)=>`<i class="pin${n.resolved?' ok':''}" style="left:${+n.x}%;top:${+n.y}%" title="${escA(n.name+': '+n.text)}">${i+1}</i>`).join('')}</span>`).join('');
  const notes=N.map(n=>`<li><b>${esc(n.name||'')}</b> ${esc(n.text)}${n.resolved?' <span class="mut">(risolto)</span>':''}</li>`).join('');
  ov(j.title,`<p class="mut">Stato: <b>${esc(j.status||'')}</b></p>${bozza?'<p class="mut">Clicca su un punto dell\'immagine per lasciare un commento.</p>':''}${body}<ul class="notes">${notes}</ul>${bozza?`<div class="ovr"><button data-act="jst" data-id="${escA(id)}" data-s="approvato">Approva</button><button data-act="jst" data-id="${escA(id)}" data-s="modifiche richieste">Richiedi modifiche</button></div>`:''}`);
  $('#ovp').classList.add('wide');
}
async function pin(a,e){
  await needV();const M=m,r=a.getBoundingClientRect(),x=Math.round((e.clientX-r.left)/r.width*100),y=Math.round((e.clientY-r.top)/r.height*100);
  const t=await ask('Scrivi il commento per questo punto');if(!t||!t.trim())return;
  await M.addDoc(M.collection(M.db,'pf_jobs',a.dataset.j,'notes'),{fileId:a.dataset.f,x,y,text:t.trim().slice(0,500),uid:user.uid,name:user.displayName||(user.email||'').split('@')[0],resolved:false,ts:M.serverTimestamp()});
  toast('Commento salvato.',2500);job(a.dataset.j);
}
async function jobStatus(a){
  await needV();const M=m;await M.updateDoc(M.doc(M.db,'pf_jobs',a.dataset.id),{status:a.dataset.s,statusAt:M.serverTimestamp()});
  toast(a.dataset.s==='approvato'?'Grazie, bozza approvata!':'Richiesta di modifiche inviata.',3500);job(a.dataset.id);
}

/* ---------- proposte dei collaboratori ---------- */
async function propose(){
  await needV();const M=m,card=curCard();if(!card)return;
  pick(async s=>{
    if(s.length>900000)return toast('Foto troppo pesante, prova con una più piccola.',4000);
    const t=await ask('Una riga per spiegare la proposta (facoltativa)')||'';
    await go(M.addDoc(M.collection(M.db,'pf_proposals'),{pid:card.dataset.id,uid:user.uid,name:user.displayName||user.email,text:t.slice(0,300),img:s,status:'nuova',ts:M.serverTimestamp()}));
    toast('Proposta inviata: la valuterò.',3500);
  });
}

/* ---------- pannello amministratore ---------- */
function hub(){
  ov('Pannello amministratore',`<div class="afm"><button class="pillb alt" data-act="pcm">Commenti da approvare</button><button class="pillb alt" data-act="prq">Richieste di preventivo</button><button class="pillb alt" data-act="pjb">Lavori dei clienti</button><button class="pillb alt" data-act="ppr">Proposte dei collaboratori</button><button class="pillb alt" data-act="pcl">Collaboratori</button><button class="pillb alt" data-act="pnw">Invia una novità agli iscritti</button><button class="pillb alt" data-act="cfg">Collega Firebase e servizi</button></div>`);
}
async function panCm(){
  await needA();const M=m,q=await M.getDocs(M.query(M.collection(M.db,'pf_comments'),M.where('ok','==',false)));
  ov('Commenti da approvare',q.docs.map(d=>({id:d.id,...d.data()})).map(c=>`<div class="ovr col2"><span><b>${esc(c.name)}</b> su «${esc(c.pid)}»<br>${esc(c.text)}</span><button data-act="cok" data-id="${escA(c.id)}">Approva</button><button data-act="cdel" data-id="${escA(c.id)}">Elimina</button></div>`).join('')||'<p class="mut">Nessun commento in attesa.</p>');
}
async function panReq(){
  await needA();const M=m,q=await M.getDocs(M.collection(M.db,'pf_requests'));
  const L=q.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>((b.ts&&b.ts.seconds)||0)-((a.ts&&a.ts.seconds)||0)).slice(0,40);
  ov('Richieste di preventivo',L.map(r=>`<div class="ovr col2" data-rid="${escA(r.id)}"><span><b>${esc(r.name||r.email)}</b> · ${T(r.ts)}<br>${esc(r.msg)}<br><select class="rst">${['ricevuta','in lavorazione','consegnata','chiusa'].map(s=>`<option${s===r.status?' selected':''}>${s}</option>`).join('')}</select><input class="rrp" placeholder="Risposta per il cliente" value="${escA(r.reply||'')}"></span><button data-act="rsv" data-id="${escA(r.id)}">Salva</button></div>`).join('')||'<p class="mut">Nessuna richiesta.</p>');
}
async function panJobs(){
  await needA();const M=m,q=await M.getDocs(M.collection(M.db,'pf_jobs'));
  ov('Lavori dei clienti',q.docs.map(d=>({id:d.id,...d.data()})).map(j=>`<div class="ovr col2"><span><b>${esc(j.title)}</b> · ${esc(j.type)} · ${esc(j.status||'')}<br><span class="mut">${esc((j.emails||[]).join(', '))}</span></span><button data-act="jimg" data-id="${escA(j.id)}">Aggiungi immagini</button><button data-act="jnt" data-id="${escA(j.id)}">Commenti</button><button data-act="jdl" data-id="${escA(j.id)}">Elimina</button></div>`).join('')+`<h4>Nuovo lavoro</h4><input id="jt" placeholder="Titolo (es. Logo Bar Aurora)"><input id="je" placeholder="Mail del cliente (più mail separate da virgola)"><select id="jy"><option value="bozza">Bozza da approvare</option><option value="riservato">Progetto riservato</option></select><button class="pillb" data-act="jmk">Crea</button>`);
}
async function jobNew(){
  await needA();const M=m,t=($('#jt').value||'').trim(),em=($('#je').value||'').split(',').map(x=>lc(x.trim())).filter(Boolean);
  if(!t||!em.length)return toast('Scrivi il titolo e almeno una mail.',3500);
  await M.addDoc(M.collection(M.db,'pf_jobs'),{title:t,emails:em,type:$('#jy').value,status:$('#jy').value==='bozza'?'in revisione':'disponibile',ts:M.serverTimestamp()});
  toast('Lavoro creato: ora aggiungi le immagini.',3500);panJobs();
}
async function jobImgs(id){
  await needA();const M=m;
  pick(async s=>{if(s.length>900000)return toast('Un\'immagine è troppo pesante, ridimensionala.',4000);await M.addDoc(M.collection(M.db,'pf_jobs',id,'files'),{name:'img',data:s,ts:M.serverTimestamp()});toast('Immagine aggiunta.',2000)},1);
}
async function jobNotes(id){
  await needA();const M=m,ns=await M.getDocs(M.collection(M.db,'pf_jobs',id,'notes'));
  ov('Commenti del cliente',ns.docs.map(d=>({id:d.id,...d.data()})).map(n=>`<div class="ovr"><span><b>${esc(n.name)}</b>: ${esc(n.text)}${n.resolved?' <span class="mut">(risolto)</span>':''}</span>${n.resolved?'':`<button data-act="nres" data-j="${escA(id)}" data-id="${escA(n.id)}">Fatto</button>`}</div>`).join('')||'<p class="mut">Nessun commento.</p>');
}
async function panProps(){
  await needA();const M=m,q=await M.getDocs(M.query(M.collection(M.db,'pf_proposals'),M.where('status','==','nuova')));
  ov('Proposte dei collaboratori',q.docs.map(d=>({id:d.id,...d.data()})).map(p=>`<div class="ovr col2"><span><b>${esc(p.name)}</b> su «${esc(p.pid)}»<br>${esc(p.text||'')}<br><img src="${p.img}" style="max-width:100%;border-radius:10px;margin-top:6px" alt=""></span><button data-act="pac" data-id="${escA(p.id)}" data-pid="${escA(p.pid)}">Accetta</button><button data-act="prj" data-id="${escA(p.id)}">Rifiuta</button></div>`).join('')||'<p class="mut">Nessuna proposta.</p>');
}
async function panCollab(){
  await needA();const M=m,d=await M.getDoc(M.doc(M.db,'pf_config','collab')),cur=d.exists()?(d.data().emails||[]).join(', '):'';
  const v=await ask('Mail dei collaboratori, separate da virgola',cur);if(v===null)return;
  await M.setDoc(M.doc(M.db,'pf_config','collab'),{emails:v.split(',').map(x=>lc(x.trim())).filter(Boolean)});toast('Collaboratori aggiornati.',3000);
}
async function panNews(){
  ov('Invia una novità agli iscritti',`<input id="ns" placeholder="Oggetto (es. Nuovo lavoro: Brand Nova)"><textarea id="nm" rows="4" placeholder="Due righe di presentazione"></textarea><input id="nl" placeholder="Link del progetto (https://...)" value="${escA(location.origin+'/')}"><input id="np" type="password" placeholder="Password dell'area riservata"><button class="pillb" data-act="nsend">Invia a tutti gli iscritti</button><p class="mut">Usa Brevo (gratuito fino a 300 mail al giorno).</p>`);
}
async function newsSend(){
  const b={password:$('#np').value,subject:$('#ns').value,message:$('#nm').value,link:$('#nl').value};
  if(!b.subject||!b.password)return toast('Servono almeno oggetto e password.',3000);
  toast('Invio…',20000);
  const r=await fetch('/api/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}),j=await r.json().catch(()=>({}));
  if(r.ok){ovc();toast('Novità inviata agli iscritti!',5000)}else toast(j.error||'Errore nell\'invio.',7000);
}
function panCfg(){
  const cur=CF.cfg?JSON.stringify(CF.cfg,null,1):'';
  ov('Collega Firebase e servizi',`<p class="mut">Incolla qui la configurazione di Firebase (l'oggetto <b>firebaseConfig</b> che trovi nella console).</p><textarea id="cft" rows="7" placeholder="const firebaseConfig = { apiKey: &quot;...&quot;, authDomain: &quot;...&quot;, projectId: &quot;...&quot;, ... };">${esc(cur)}</textarea><input id="cfa" placeholder="La tua mail da amministratore" value="${escA(CF.admin||'')}"><label class="ck"><input type="checkbox" id="cfn" ${CF.news?'checked':''}> Mostra il modulo per iscriversi alla newsletter</label><input id="cfc" placeholder="Link per prenotare una chiamata (facoltativo)" value="${escA(($('#contatti')||{dataset:{}}).dataset.cal||'')}"><button class="pillb" data-act="cfgs">Salva</button><p class="mut">Dopo il salvataggio premi Pubblica.</p>`);
}
function cfgSave(){
  const t=$('#cft').value||'',o={};
  t.replace(/([A-Za-z]+)\s*:\s*["']([^"']+)["']/g,(x,k,v)=>{o[k]=v;return x});
  const cfg=o.apiKey&&o.projectId?o:null;
  const conf={cfg,admin:($('#cfa').value||'').trim(),news:$('#cfn').checked};
  let s=document.head.querySelector('#fbcfg');if(!s){s=document.createElement('script');s.type='application/json';s.id='fbcfg';document.head.appendChild(s)}
  s.textContent=JSON.stringify(conf);
  const cal=($('#cfc').value||'').trim(),ct=$('#contatti');if(ct){if(cal)ct.dataset.cal=/^https?:\/\//.test(cal)?cal:'https://'+cal;else ct.removeAttribute('data-cal')}
  dirty=true;updDirty();ovc();toast(cfg?'Salvato! Premi Pubblica e poi ricarica il sito.':'Salvato (senza Firebase: manca apiKey o projectId).',5000);
}

/* ---------- azioni ---------- */
window.accAct=function(k,a,c,e){
  const R=p=>{go(p);return true};
  switch(k){
    case 'acc':return R(acc());
    case 'au_sw':openAuth(!$('#an'));return true;
    case 'au_in':return R((async()=>{const M=await fb();say('Un attimo…');try{await M.signInWithEmailAndPassword(M.auth,$('#ae').value.trim(),$('#apw').value);await afterIn()}catch(x){say(er(x))}})());
    case 'au_reg':return R((async()=>{const M=await fb();say('Un attimo…');try{const r=await M.createUserWithEmailAndPassword(M.auth,$('#ae').value.trim(),$('#apw').value);const n=($('#an').value||'').trim();if(n)await M.updateProfile(r.user,{displayName:n});await M.sendEmailVerification(r.user);ovc();toast('Account creato! Ti ho mandato una mail: conferma l\'indirizzo per commentare e salvare.',7000)}catch(x){say(er(x))}})());
    case 'au_g':return R((async()=>{const M=await fb();try{await M.signInWithPopup(M.auth,new M.GoogleAuthProvider());await afterIn()}catch(x){say(er(x))}})());
    case 'au_ml':return R((async()=>{const M=await fb(),em=($('#ae').value||'').trim();if(!em)return say('Scrivi prima la tua mail.');try{await M.sendSignInLinkToEmail(M.auth,em,{url:location.origin+location.pathname+'?ml=1',handleCodeInApp:true});try{localStorage.setItem('fb-ml',em)}catch(x){}say('Ti ho mandato un link: aprilo da questo dispositivo.')}catch(x){say(er(x))}})());
    case 'au_fp':return R((async()=>{const M=await fb(),em=($('#ae').value||'').trim();if(!em)return say('Scrivi prima la tua mail.');try{await M.sendPasswordResetEmail(M.auth,em);say('Ti ho mandato la mail per reimpostare la password.')}catch(x){say(er(x))}})());
    case 'au_vf':return R((async()=>{await need();await m.sendEmailVerification(user);toast('Mail di conferma inviata.',3500)})());
    case 'au_out':return R((async()=>{const M=await fb();await M.signOut(M.auth);ovc();toast('Hai effettuato l\'uscita.',2500);if(window.accHook)accHook(curCard())})());
    case 'lk2':return R(like());
    case 'fav':return R(fav());
    case 'cmts':return R(comment());
    case 'fvs':return R(favs());
    case 'fsh':return true;
    case 'req':return R(reqForm());
    case 'reqs':return R(reqSend());
    case 'myreq':return R(myReq());
    case 'jobs':return R(jobs());
    case 'job':return R(job(a.dataset.id));
    case 'jfc':return R(pin(a,e));
    case 'jst':return R(jobStatus(a));
    case 'prop':return R(propose());
    case 'hub':hub();return true;
    case 'pcm':return R(panCm());
    case 'prq':return R(panReq());
    case 'pjb':return R(panJobs());
    case 'ppr':return R(panProps());
    case 'pcl':return R(panCollab());
    case 'pnw':panNews();return true;
    case 'nsend':return R(newsSend());
    case 'cfg':panCfg();return true;
    case 'cfgs':cfgSave();return true;
    case 'jmk':return R(jobNew());
    case 'jimg':return R(jobImgs(a.dataset.id));
    case 'jnt':return R(jobNotes(a.dataset.id));
    case 'jdl':if(confirm('Eliminare questo lavoro? Le immagini restano nel database finché non le cancelli dalla console.'))return R((async()=>{await m.deleteDoc(m.doc(m.db,'pf_jobs',a.dataset.id));panJobs()})());return true;
    case 'nres':return R((async()=>{await m.updateDoc(m.doc(m.db,'pf_jobs',a.dataset.j,'notes',a.dataset.id),{resolved:true});jobNotes(a.dataset.j)})());
    case 'cok':return R((async()=>{await m.updateDoc(m.doc(m.db,'pf_comments',a.dataset.id),{ok:true});panCm()})());
    case 'cdel':return R((async()=>{await m.deleteDoc(m.doc(m.db,'pf_comments',a.dataset.id));panCm()})());
    case 'rsv':return R((async()=>{const r=a.closest('.ovr');await m.updateDoc(m.doc(m.db,'pf_requests',a.dataset.id),{status:$('.rst',r).value,reply:$('.rrp',r).value.slice(0,500)});toast('Salvato.',2000)})());
    case 'pac':return R((async()=>{const p=await m.getDoc(m.doc(m.db,'pf_proposals',a.dataset.id)),cd=$$('.card').find(x=>x.dataset.id===a.dataset.pid);if(cd&&p.exists()){snap();$('.gal',cd).insertAdjacentHTML('beforeend',`<img src="${p.data().img}" alt="" loading="lazy">`);save()}await m.updateDoc(m.doc(m.db,'pf_proposals',a.dataset.id),{status:'accettata'});toast('Foto aggiunta alla galleria: premi Pubblica.',4500);panProps()})());
    case 'prj':return R((async()=>{await m.updateDoc(m.doc(m.db,'pf_proposals',a.dataset.id),{status:'rifiutata'});panProps()})());
  }
  return false;
};
window.accFavShare=favShare;

/* secondo controllo per l'accesso dell'amministratore */
window.accIdToken=async function(){if(!CF.cfg)return '';try{await fb();return user?await user.getIdToken(true):''}catch(e){return ''}};
window.accSecond=async function(email){
  try{const M=await fb();await M.sendSignInLinkToEmail(M.auth,email,{url:location.origin+location.pathname+'?ml=1',handleCodeInApp:true});try{localStorage.setItem('fb-ml',email)}catch(x){}toast('Link inviato a '+email+'.',6000)}
  catch(e){toast(er(e),7000)}
};

/* ---------- avvio ---------- */
function init(){
  if(CF.cfg&&!$('.acc')&&$('.nav nav'))$('.nav nav').insertAdjacentHTML('afterbegin','<button class="acc" data-act="acc">Accedi</button>');
  if(!$('#soc')&&$('#pn'))$('#pn').insertAdjacentHTML('afterend','<div id="soc"></div>');
  if(CF.cfg&&!$('.reqb')&&$('#ct'))$('#ct').insertAdjacentHTML('afterend','<button class="pres reqb" data-act="req">Richiedi un preventivo</button>');
  if(!$('.nlf')&&$('#ct'))$('#ct').insertAdjacentHTML('afterend','<form class="nlf"><p>Ricevi una mail quando pubblico un nuovo lavoro</p><input type="email" required placeholder="La tua mail" aria-label="La tua mail"><label><input type="checkbox" required> Accetto di ricevere queste mail (puoi annullare quando vuoi)</label><button type="submit">Iscriviti</button><span class="mut"></span></form>');
  document.documentElement.classList.toggle('nl',!!CF.news);
  const ct=$('#contatti');if(ct&&ct.dataset.cal){let b=$('#calb');if(!b){const mm=$('.mail');if(mm)mm.insertAdjacentHTML('afterend','<a class="pres" id="calb" target="_blank" rel="noopener">Prenota una chiamata</a>');b=$('#calb')}if(b)b.href=ct.dataset.cal}
  if(CF.cfg&&(/oobCode|[?&]ml=1/.test(location.search)))go(emailLinkDone());
  let li='';try{li=localStorage.getItem('fb-li')}catch(e){}
  if(CF.cfg&&(li||document.body.classList.contains('pj')))go(fb().then(()=>{if(window.accHook)accHook(curCard())}));
}
document.addEventListener('submit',e=>{
  const f=e.target.closest&&e.target.closest('.nlf');if(!f)return;
  e.preventDefault();const em=$('input[type=email]',f).value,out=$('.mut',f);out.textContent='Invio…';
  fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:em})}).then(r=>r.json().then(j=>({r,j}))).then(({r,j})=>{out.textContent=r.ok?(j.doi?"Controlla la mail per confermare l'iscrizione.":'Iscrizione completata, grazie!'):(j.error||'Errore, riprova.')}).catch(()=>{out.textContent='Non riesco a collegarmi, riprova.'});
});
document.addEventListener('change',e=>{if(e.target.id==='fsh')go(favShare())});
init();
window.accReady=true;
})();
