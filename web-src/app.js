/* ============ Android-Bridge: native Spracherkennung im WebView ============ */
if(!window.SpeechRecognition && !window.webkitSpeechRecognition && window.AndroidSpeech){
  window.__speechCb=null;
  window.__onSpeech=function(text,isFinal){ if(window.__speechCb) window.__speechCb(text,isFinal); };
  window.SpeechRecognition=function(){
    const self=this;
    this.lang='de-DE'; this.continuous=true; this.interimResults=true;
    this.onresult=null; this.onend=null; this.onerror=null;
    this.start=function(){
      window.__speechCb=function(text,isFinal){
        if(self.onresult) self.onresult({resultIndex:0,results:[[{transcript:text}]]});
      };
      AndroidSpeech.start(self.lang);
    };
    this.stop=function(){ window.__speechCb=null; AndroidSpeech.stop(); if(self.onend) self.onend(); };
  };
}
/* ============ Android-App-Bridge (nur in der App vorhanden) ============ */
const App=window.AndroidApp||null;
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
if(App) document.documentElement.classList.add('in-app');

/* ============ Sprache ============ */
let L='de';
function resolveLang(pref){
  if(pref&&pref!=='auto'&&I18N[pref]) return pref;
  for(const l of (navigator.languages||[navigator.language||'en'])){ const k=String(l).slice(0,2).toLowerCase(); if(I18N[k]) return k; }
  return 'en';
}
function t(k,vars){
  let s=(I18N[L]&&I18N[L][k]!=null)?I18N[L][k]:(I18N.en[k]!=null?I18N.en[k]:(I18N.de[k]!=null?I18N.de[k]:k));
  if(vars) for(const v in vars) s=s.split('{'+v+'}').join(vars[v]);
  return s;
}
function srLang(){ return (!S.lang||S.lang==='auto')?SR_DEFAULT[L]:S.lang; }
function cmdSet(){ return CMDS[srLang().slice(0,2)]||CMDS.en; }
function cmdHelp(){ const c=cmdSet();
  const pick=[c.start[0],c.stop[0],c.faster[0],c.slower[0],c.restart[0]].map(w=>'<b>'+w+'</b>');
  return pick.join(', '); }
function applyI18n(){
  document.documentElement.lang=L;
  $$('[data-i18n]').forEach(el=>{ el.textContent=t(el.dataset.i18n); });
  $$('[data-i18n-html]').forEach(el=>{ el.innerHTML=t(el.dataset.i18nHtml); });
  $$('[data-i18n-ph]').forEach(el=>{ el.placeholder=t(el.dataset.i18nPh); });
  $$('[data-i18n-label]').forEach(el=>{ const s=t(el.dataset.i18nLabel); el.title=s; el.setAttribute('aria-label',s); });
  $('#voiceSub').innerHTML=t('voiceSub',{cmds:cmdHelp()});
  $('#helpBack').innerHTML=t(App?'helpBackApp':'helpBackWeb');
  $('#lnkPrivacy').href='https://silverapplications.com/apps/promptair/'+(L==='de'?'datenschutz/':'en/privacy/');
  $('#appVersion').textContent=t('version')+' '+(App&&App.appVersion?App.appVersion():'Web');
  if(App&&App.setLanguage) App.setLanguage(L);
  renderHome(); if(cur) updStats();
}
function setUiLang(pref){ L=resolveLang(pref); applyI18n(); }

/* ============ Meldungen ============ */
function toast(msg,ms=2200){ const el=$('#toast'); el.textContent=msg; el.style.display='block';
  clearTimeout(el._h); el._h=setTimeout(()=>el.style.display='none',ms); }
window.__promptairToast=function(msg){ try{ toast(msg,3200); }catch(e){} };
/* Statusmeldungen der App kommen als Kennung und werden hier übersetzt */
window.__promptairEvent=function(code){ if(code==='export_cancel') return; toast(t(code),3200); };

/* Blob -> Base64 (ohne data:-Praefix) */
function blobB64(b){ return new Promise((res,rej)=>{ const r=new FileReader();
  r.onload=()=>res(String(r.result).split(',')[1]||''); r.onerror=()=>rej(r.error); r.readAsDataURL(b); }); }
/* Stückweises Schreiben auf das Gerät (Video während der Aufnahme) */
function appSink(name,mime,kind){
  const id=App.beginSave(name,mime,kind); if(!id) return null;
  let q=Promise.resolve(), failed=false;
  return {
    push(blob){ q=q.then(async()=>{ if(failed) return;
      for(let o=0;o<blob.size;o+=768*1024){ if(!App.saveChunk(id,await blobB64(blob.slice(o,o+768*1024)))){ failed=true; return; } } }); },
    async close(){ await q; if(failed){ App.abortSave(id); return 'save_failed'; } return App.endSave(id); }
  };
}
/* Android-Zurück (Wischgeste): true = von der Seite behandelt */
window.__promptairBack=function(){
  if($('#permDlg').style.display&&$('#permDlg').style.display!=='none'){ $('#permDlg').style.display='none'; return true; }
  if($('#drawer').classList.contains('on')){ closeDrawer(); return true; }
  if(views.prompt.classList.contains('on')){ exitPrompt(); return true; }
  if(views.edit.classList.contains('on')){ $('#btnBackHome').onclick(); return true; }
  return false;
};

/* ============ Speicher ============ */
const mem={};
const store={
  async get(k){ try{ if(window.storage){ const r=await window.storage.get(k); if(r) return r.value; } }catch(e){}
    try{ const v=localStorage.getItem(k); if(v!=null) return v; }catch(e){}
    return (k in mem)?mem[k]:null; },
  async set(k,v){ mem[k]=v;
    try{ if(window.storage){ await window.storage.set(k,v); return; } }catch(e){}
    try{ localStorage.setItem(k,v); }catch(e){} }
};

/* ============ Zustand ============ */
const DEF={speed:90,fontSize:46,lineHeight:1.5,marginPct:6,guidePos:25,textColor:'#f5f7fa',
  bgColor:'#000000',fontFamily:'system-ui,sans-serif',align:'left',mirrorH:false,mirrorV:false,
  guideShow:true,focusDim:true,loop:false,keepAwake:true,countdown:3,lang:'auto',uiLang:'auto',
  voiceMode:'follow',camOpacity:35};
let S={...DEF};
let scripts=[], cur=null;

const views={home:$('#viewHome'),edit:$('#viewEdit'),prompt:$('#viewPrompt')};
function show(name){ for(const k in views) views[k].classList.toggle('on',k===name); }
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ============ Skripte ============ */
async function loadAll(){
  try{ const raw=await store.get('promtair:scripts'); if(raw) scripts=JSON.parse(raw)||[]; }catch(e){ scripts=[]; }
  try{ const raw=await store.get('promtair:settings'); if(raw) S={...DEF,...JSON.parse(raw)}; }catch(e){}
  // Aufruf von der Landingpage mit ?lang=xx: Sprache übernehmen (Browser-Version)
  const q=/[?&]lang=([a-z]{2})\b/.exec(location.search);
  if(q&&I18N[q[1]]&&!App){ S.uiLang=q[1]; await saveSettings(); }
  L=resolveLang(S.uiLang);
  const seen=await store.get('promtair:seen');
  if(!seen && !scripts.length){ scripts=[{id:'demo',title:t('demoTitle'),text:t('demoText'),updated:Date.now()}]; await saveScripts(); }
  await store.set('promtair:seen','1');
}
async function saveScripts(){ await store.set('promtair:scripts',JSON.stringify(scripts)); }
async function saveSettings(){ await store.set('promtair:settings',JSON.stringify(S)); }

function renderHome(){
  const list=$('#homeList'); list.innerHTML='';
  if(!scripts.length){ list.innerHTML='<div class="empty">'+t('empty')+'</div>'; return; }
  scripts.slice().sort((a,b)=>b.updated-a.updated).forEach(sc=>{
    const words=(sc.text.trim().match(/\S+/g)||[]).length;
    const min=Math.max(1,Math.round(words/150));
    const b=document.createElement('button'); b.className='card';
    b.innerHTML=`<h3>${esc(sc.title||t('untitled'))}</h3><p>${esc(sc.text.slice(0,120))||'&nbsp;'}</p>
      <div class="meta">${t('meta',{w:words,m:min})} · ${new Date(sc.updated).toLocaleDateString(L)}</div>`;
    b.onclick=()=>openEditor(sc.id);
    list.appendChild(b);
  });
}

function openEditor(id){
  cur=scripts.find(s=>s.id===id);
  if(!cur){ cur={id:'s'+Date.now(),title:'',text:'',updated:Date.now()}; scripts.push(cur); }
  $('#edTitle').value=cur.title; $('#edText').value=cur.text;
  updStats(); show('edit');
}
function updStats(){
  const tx=$('#edText').value, words=(tx.trim().match(/\S+/g)||[]).length;
  const sec=Math.round(words/150*60);
  $('#edStats').textContent=t('stats',{c:tx.length,w:words,t:Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')});
}
let saveT;
function editorChanged(){
  if(!cur) return;
  cur.title=$('#edTitle').value; cur.text=$('#edText').value; cur.updated=Date.now();
  updStats(); clearTimeout(saveT); saveT=setTimeout(saveScripts,400);
}
$('#edTitle').addEventListener('input',editorChanged);
$('#edText').addEventListener('input',editorChanged);
$('#btnBackHome').onclick=async()=>{ await saveScripts(); renderHome(); show('home'); };
$('#btnNew').onclick=()=>openEditor(null);
$('#btnDelete').onclick=async()=>{
  if(!cur) return;
  if(confirm(t('confirmDelete'))){
    scripts=scripts.filter(s=>s.id!==cur.id); cur=null;
    await saveScripts(); renderHome(); show('home');
  }
};
/* Export: App -> Android-Dialog „Speichern unter“ (beliebiger Ort), Browser -> Download */
$('#btnExport').onclick=()=>{
  const name=($('#edTitle').value.trim()||'PromptAir')+'.txt', text=$('#edText').value;
  if(App&&App.exportText){ App.exportText(name,text); return; }
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
  a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),5000);
};
$('#btnImportHome').onclick=()=>$('#fileImport').click();
$('#fileImport').onchange=async e=>{
  const f=e.target.files[0]; if(!f) return;
  const text=await f.text();
  const sc={id:'s'+Date.now(),title:f.name.replace(/\.[^.]+$/,''),text,updated:Date.now()};
  scripts.push(sc); await saveScripts(); renderHome(); e.target.value='';
  toast(t('imported'));
};
$('#btnSettingsHome').onclick=()=>openDrawer();

/* ============ Einstellungen ============ */
const fmt={speed:v=>v+' px/s',fontSize:v=>v+' px',lineHeight:v=>'×'+(+v).toFixed(2),
  marginPct:v=>v+' %',guidePos:v=>v+' %',countdown:v=>v+' s',camOpacity:v=>v+' %'};
function openDrawer(){ $('#drawer').classList.add('on'); syncDrawer(); }
function closeDrawer(){ $('#drawer').classList.remove('on'); saveSettings(); }
$('#drawerBg').onclick=closeDrawer; $('#btnCloseDrawer').onclick=closeDrawer;
function syncDrawer(){
  $$('[data-set]').forEach(el=>{
    const k=el.dataset.set;
    if(el.type==='checkbox') el.checked=!!S[k]; else el.value=S[k];
    const o=$('#o'+k.charAt(0).toUpperCase()+k.slice(1));
    if(o&&fmt[k]) o.value=fmt[k](S[k]);
  });
}
$$('[data-set]').forEach(el=>{
  el.addEventListener('input',()=>{
    const k=el.dataset.set;
    S[k]=el.type==='checkbox'?el.checked:(el.type==='range'?+el.value:el.value);
    const o=$('#o'+k.charAt(0).toUpperCase()+k.slice(1));
    if(o&&fmt[k]) o.value=fmt[k](S[k]);
    if(k==='uiLang') setUiLang(S.uiLang);
    if(k==='lang'||k==='uiLang') $('#voiceSub').innerHTML=t('voiceSub',{cmds:cmdHelp()});
    applyStyle(); saveSettings();
  });
});
if(App){
  $('#lnkLicenses').onclick=e=>{ e.preventDefault(); App.openLicenses(); };
  $('#btnSpeak').onclick=()=>App.openSpeak($('#edTitle').value||'',$('#edText').value||'',srLang());
}

/* ============ Prompter ============ */
const stage=$('#stage'), scroller=$('#scroller'), content=$('#content');
let tokens=[], pos=0, playing=false, lastT=0, rafId=0, maxPos=0;
let voiceOn=false, voiceTarget=null, matchedIdx=-1;
let wakeLock=null;

function applyStyle(){
  const vp=$('#viewPrompt');
  const camOn=$('#camVideo').style.display==='block';
  const bgVal=camOn?hexA(S.bgColor,S.camOpacity/100):S.bgColor;
  vp.style.setProperty('--pbg',bgVal);
  content.style.fontSize=S.fontSize+'px';
  content.style.lineHeight=S.lineHeight;
  content.style.color=S.textColor;
  content.style.fontFamily=S.fontFamily;
  content.style.textAlign=S.align;
  content.style.paddingLeft=content.style.paddingRight=S.marginPct+'vw';
  vp.style.background=bgVal;
  stage.style.transform=(S.mirrorH?'scaleX(-1) ':'')+(S.mirrorV?'scaleY(-1)':'');
  $('#guide').style.display=S.guideShow?'flex':'none';
  $('#guide').style.top=`calc(${S.guidePos}% - 10px)`;
  vp.classList.toggle('dim-on',S.focusDim);
  const g=guidePx();
  content.style.paddingTop=g+'px';
  content.style.paddingBottom=stage.clientHeight+'px';
  $('#dimTop').style.height=Math.max(0,g-S.fontSize*S.lineHeight)+'px';
  $('#dimBot').style.height=(stage.clientHeight*.30)+'px';
  measure();
}
function hexA(hex,a){ const n=parseInt(hex.slice(1),16);
  return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`; }
function guidePx(){ return stage.clientHeight*S.guidePos/100; }
function measure(){ maxPos=Math.max(0,content.scrollHeight-stage.clientHeight); }

const norm=s=>s.toLowerCase().replace(/[^\p{L}\p{N}']/gu,'');
function buildContent(text){
  content.innerHTML=''; tokens=[];
  let bold=false, skip=false;
  for(const para of text.replace(/\r/g,'').split('\n')){
    const p=document.createElement('p');
    if(!para.trim()){ p.innerHTML='&nbsp;'; content.appendChild(p); continue; }
    for(const raw of para.split(/\s+/)){
      if(!raw) continue;
      if(raw.includes('<')) skip=true;
      const wasSkip=skip;
      const tog=(raw.match(/\*\*/g)||[]).length;
      const isBold=bold||tog>0;
      if(tog%2===1) bold=!bold;
      if(raw.includes('>')) skip=false;
      const w=raw.replace(/\*\*/g,'').replace(/[<>]/g,'');
      if(!w) continue;
      const span=document.createElement('span');
      span.textContent=w;
      span.className='w'+(wasSkip?' nv':'')+(isBold?' b':'');
      p.appendChild(span); p.appendChild(document.createTextNode(' '));
      tokens.push({el:span,norm:norm(w),voice:!wasSkip});
    }
    content.appendChild(p);
  }
}

function setPos(v){ pos=Math.min(maxPos,Math.max(0,v));
  scroller.style.transform=`translate3d(0,${-pos}px,0)`;
  $('#progress').style.width=maxPos? (pos/maxPos*100)+'%':'0%';
  const rest=Math.max(0,(maxPos-pos)/S.speed);
  if(voiceOn&&S.voiceMode==='follow') $('#timeLeft').innerHTML='<svg aria-hidden="true"><use href="#i-mic"/></svg>';
  else $('#timeLeft').textContent=Math.floor(rest/60)+':'+String(Math.round(rest%60)).padStart(2,'0');
}
function tick(ts){
  rafId=requestAnimationFrame(tick);
  const dt=Math.min(.05,(ts-lastT)/1000||0); lastT=ts;
  if(voiceOn&&S.voiceMode==='follow'&&voiceTarget!=null){
    setPos(pos+(voiceTarget-pos)*Math.min(1,dt*5));
  } else if(playing){
    setPos(pos+S.speed*dt);
    if(pos>=maxPos){ if(S.loop){ setPos(0);} else { pause(); toast(t('endOfScript')); showCtl(); } }
  }
}

function play(){
  if(pos<2 && S.countdown>0 && !(voiceOn&&S.voiceMode==='follow')){ runCountdown(()=>{ playing=true; setPlayBtn(); hideCtlSoon(); }); }
  else { playing=true; setPlayBtn(); hideCtlSoon(); }
}
function pause(){ playing=false; setPlayBtn(); showCtl(); }
function setPlayBtn(){ $('#btnPlay').innerHTML='<svg aria-hidden="true"><use href="#i-'+(playing?'pause':'play')+'"/></svg>'; }
function runCountdown(done){
  const c=$('#countdown'), sp=c.querySelector('span'); let n=S.countdown;
  c.style.display='grid'; sp.textContent=n;
  const iv=setInterval(()=>{ n--; if(n<=0){ clearInterval(iv); c.style.display='none'; done(); } else sp.textContent=n; },1000);
}
function changeSpeed(d){
  S.speed=Math.min(400,Math.max(10,S.speed+d)); syncDrawer(); saveSettings();
  toast(t('speedToast',{v:S.speed+' px/s'}),700);
}

/* Steuerleiste ein-/ausblenden */
let ctlT;
function showCtl(){ $('#ctlbar').classList.remove('hidden'); clearTimeout(ctlT); if(playing) hideCtlSoon(); }
function hideCtlSoon(){ clearTimeout(ctlT); ctlT=setTimeout(()=>$('#ctlbar').classList.add('hidden'),3500); }

/* Gesten: Tippen=Pause, Wischen=Scrollen, Pinch=Schriftgröße */
let tState=null;
stage.addEventListener('touchstart',e=>{
  if(e.touches.length===2){
    tState={pinch:Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY),fs:S.fontSize};
  } else { tState={y:e.touches[0].clientY,p:pos,moved:false,t:Date.now()}; }
},{passive:true});
stage.addEventListener('touchmove',e=>{
  if(!tState) return;
  if(tState.pinch&&e.touches.length===2){
    const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
    S.fontSize=Math.round(Math.min(140,Math.max(18,tState.fs*d/tState.pinch)));
    applyStyle(); syncDrawer();
  } else if(tState.y!=null){
    const dy=tState.y-e.touches[0].clientY;
    if(Math.abs(dy)>8) tState.moved=true;
    const dir=S.mirrorV?-1:1;
    setPos(tState.p+dy*dir); voiceTarget=null;
  }
},{passive:true});
stage.addEventListener('touchend',()=>{
  if(tState&&!tState.pinch&&!tState.moved&&Date.now()-tState.t<400){
    playing?pause():play(); showCtl();
  }
  if(tState&&tState.pinch) saveSettings();
  tState=null;
},{passive:true});
stage.addEventListener('click',e=>{ if(!('ontouchstart'in window)){ playing?pause():play(); showCtl(); }});

/* Tastatur / Bluetooth-Fernbedienung – Pfeile wie das Steuerkreuz: hoch = langsamer, runter = schneller */
document.addEventListener('keydown',e=>{
  if(!views.prompt.classList.contains('on')) return;
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT') return;
  const k=e.code;
  if(k==='Space'||k==='Enter'||k==='PageDown'){ e.preventDefault(); playing?pause():play(); }
  else if(k==='ArrowUp'){ e.preventDefault(); changeSpeed(-10); }
  else if(k==='ArrowDown'){ e.preventDefault(); changeSpeed(10); }
  else if(k==='ArrowLeft'||k==='PageUp'){ setPos(pos-stage.clientHeight*.4); voiceTarget=null; }
  else if(k==='ArrowRight'){ setPos(pos+stage.clientHeight*.4); voiceTarget=null; }
  else if(k==='Home'){ restart(); }
  else if(k==='KeyM'){ S.mirrorH=!S.mirrorH; applyStyle(); syncDrawer(); }
  else if(k==='KeyF'){ toggleFS(); }
  else if(k==='Escape'){ exitPrompt(); }
  showCtl();
});

function restart(){ pause(); setPos(0); matchedIdx=-1; voiceTarget=null;
  tokens.forEach(x=>x.el.classList.remove('read','now')); }

/* ============ Spracherkennung ============ */
let rec=null, recActive=false;
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;

function showPermDlg(kind,retry){
  const d=$('#permDlg'); d._retry=retry||null;
  const K=kind.charAt(0).toUpperCase()+kind.slice(1);
  $('#permTitle').textContent=t('perm'+K+'T');
  $('#permBody').innerHTML=t('perm'+K+'H');
  $('#permRetry').style.display=(kind==='insecure')?'none':'block';
  d.style.display='grid';
}
async function ensureMic(){
  if(!window.isSecureContext){ showPermDlg('insecure'); return false; }
  let state='prompt';
  if(navigator.permissions&&navigator.permissions.query){
    try{ state=(await navigator.permissions.query({name:'microphone'})).state; }catch(e){}
  }
  if(state==='denied'){ showPermDlg('denied',()=>micToggle()); return false; }
  if(state==='granted') return true;
  showPermDlg('prompt');
  try{
    const s=await navigator.mediaDevices.getUserMedia({audio:true});
    s.getTracks().forEach(x=>x.stop());
    $('#permDlg').style.display='none';
    return true;
  }catch(e){
    showPermDlg(e&&e.name==='NotAllowedError'?'denied':'error',()=>micToggle());
    return false;
  }
}
async function micToggle(){
  if(recActive){ stopRec(); return; }
  if(!SR){ toast(t('srUnsupported')); return; }
  if(!window.AndroidSpeech && !(await ensureMic())) return;
  startRec();
}
function startRec(){
  rec=new SR(); rec.lang=srLang(); rec.continuous=true; rec.interimResults=true;
  rec.onresult=onSpeech;
  rec.onerror=e=>{ if(e.error==='not-allowed'){ toast(t('micDenied')); stopRec(); } };
  rec.onend=()=>{ if(recActive){ try{rec.start();}catch(e){} } };
  try{ rec.start(); }catch(e){}
  recActive=true; voiceOn=true;
  $('#micDot').classList.add('live'); $('#btnMic').classList.add('on');
  toast(S.voiceMode==='follow'?t('voiceFollowOn'):t('voiceCmdOn',{cmds:cmdHelp().replace(/<\/?b>/g,'')}),2600);
  if(S.voiceMode==='follow'){ playing=false; setPlayBtn(); }
}
function stopRec(){
  recActive=false; voiceOn=false; voiceTarget=null;
  try{ rec&&rec.stop(); }catch(e){}
  $('#micDot').classList.remove('live'); $('#btnMic').classList.remove('on');
}
function onSpeech(ev){
  let latest='';
  for(let i=ev.resultIndex;i<ev.results.length;i++) latest+=ev.results[i][0].transcript+' ';
  const words=latest.trim().split(/\s+/).map(norm).filter(Boolean);
  if(!words.length) return;
  if(S.voiceMode==='commands'){ handleCommands(words); return; }
  followVoice(words.slice(-8));
}
function matchWord(a,b){
  if(!a||!b) return false;
  if(a===b) return true;
  if(a.length>=4&&b.length>=4&&(a.startsWith(b)||b.startsWith(a))) return true;
  return false;
}
function followVoice(spoken){
  for(const w of spoken){
    const start=matchedIdx+1, end=Math.min(tokens.length,start+40);
    for(let j=start;j<end;j++){
      if(!tokens[j].voice) continue;
      if(matchWord(tokens[j].norm,w)){ matchedIdx=j; break; }
    }
  }
  if(matchedIdx>=0){
    for(let i=0;i<tokens.length;i++){
      tokens[i].el.classList.toggle('read',i<matchedIdx);
      tokens[i].el.classList.toggle('now',i===matchedIdx);
    }
    const el=tokens[matchedIdx].el;
    voiceTarget=Math.min(maxPos,Math.max(0,el.offsetTop-guidePx()+el.offsetHeight/2));
  }
}
/* Sprachbefehle in der Erkennungssprache; Wortgrenzen auch bei Akzenten (á, è, ü …) */
function handleCommands(words){
  const line=' '+words.join(' ')+' ', c=cmdSet();
  const has=list=>list.some(p=>line.includes(' '+p.split(/\s+/).map(norm).join(' ')+' '));
  if(has(c.restart)){ restart(); toast(t('backToStart'),800); }
  else if(has(c.faster)){ S.speed=Math.min(400,Math.round(S.speed*1.25)); syncDrawer(); toast(t('speedToast',{v:S.speed+' px/s'}),800); }
  else if(has(c.slower)){ S.speed=Math.max(10,Math.round(S.speed/1.25)); syncDrawer(); toast(t('speedToast',{v:S.speed+' px/s'}),800); }
  else if(has(c.stop)){ pause(); }
  else if(has(c.start)){ if(!playing) play(); }
}

/* ============ Kamera & Aufnahme ============ */
let camStream=null, facing='user', recorder=null, chunks=[], recT0=0, recIv=null;
function camError(e){
  const n=e&&e.name;
  if(n==='NotAllowedError'||n==='SecurityError') return t('camDenied');
  if(n==='NotReadableError'||n==='AbortError') return t('camBusy');
  if(n==='NotFoundError'||n==='OverconstrainedError') return t('camNone');
  return t('camFail');
}
/* Fix 1.1.0: Bild und Ton getrennt behandeln. Schlägt der Ton fehl,
   läuft die Kamera trotzdem (Video ohne Ton) statt komplett abzubrechen. */
async function startCam(){
  if(camStream) return true;
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){ toast(t('camFail')); return false; }
  const video={facingMode:facing};
  let s=null, noAudio=false;
  try{ s=await navigator.mediaDevices.getUserMedia({video,audio:true}); }
  catch(e){
    try{ s=await navigator.mediaDevices.getUserMedia({video}); noAudio=true; }
    catch(e2){ toast(camError(e2),3500); return false; }
  }
  if(!s.getAudioTracks().length) noAudio=true;
  camStream=s;
  const v=$('#camVideo'); v.srcObject=camStream; v.style.display='block';
  v.classList.toggle('mirror',facing==='user');
  $('#btnCam').classList.add('on'); $('#btnFlip').style.display='grid';
  applyStyle();
  if(noAudio) toast(t('camNoAudio'),3500);
  return true;
}
function stopCam(){
  if(recorder&&recorder.state!=='inactive') stopRecVideo();
  camStream&&camStream.getTracks().forEach(x=>x.stop()); camStream=null;
  const v=$('#camVideo'); v.srcObject=null; v.style.display='none';
  $('#btnCam').classList.remove('on'); $('#btnFlip').style.display='none';
  applyStyle();
}
async function camToggle(){ if(camStream) stopCam(); else await startCam(); }
async function flipCam(){
  if(!camStream) return;
  if(recorder&&recorder.state!=='inactive') stopRecVideo();
  facing=facing==='user'?'environment':'user';
  camStream.getTracks().forEach(x=>x.stop()); camStream=null;
  await startCam();
}
/* Rechts auf dem Steuerkreuz: Aufnahme an/aus – schaltet die Kamera bei Bedarf ein */
async function recPress(){
  if(recorder&&recorder.state==='recording'){ stopRecVideo(); return; }
  if(!camStream){ if(!(await startCam())) return; await new Promise(r=>setTimeout(r,500)); }
  startRecVideo();
}
function startRecVideo(){
  if(!camStream) return;
  chunks=[];
  if(!window.MediaRecorder){ toast(t('recUnsupported')); return; }
  const hasAudio=camStream.getAudioTracks().length>0;
  let opts={mimeType:hasAudio?'video/webm;codecs=vp8,opus':'video/webm;codecs=vp8'};
  if(!MediaRecorder.isTypeSupported(opts.mimeType)) opts={};
  try{ recorder=new MediaRecorder(camStream,opts); }catch(e){ toast(t('recFail')); return; }
  const vName='PromptAir_'+new Date().toISOString().replace(/[:.]/g,'-').slice(0,19)+'.webm';
  const sink=App?appSink(vName,'video/webm','video'):null;
  if(App&&!sink){ toast(t('save_failed')); return; }
  recorder.ondataavailable=e=>{ if(!e.data.size) return; if(sink) sink.push(e.data); else chunks.push(e.data); };
  recorder.onstop=async()=>{
    if(sink){ toast(t('videoSaving'),4000); toast(t(await sink.close()),3000); return; }
    const blob=new Blob(chunks,{type:recorder.mimeType||'video/webm'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
    a.download=vName; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),10000);
    toast(t('videoSavedWeb'));
  };
  try{ recorder.start(250); }catch(e){ toast(t('recFail')); return; }
  recT0=Date.now();
  $('#recBadge').classList.add('on'); $('#btnRec').classList.add('on');
  toast(t('recStarted'),1200);
  recIv=setInterval(()=>{ const s=Math.floor((Date.now()-recT0)/1000);
    $('#recTime').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); },500);
}
function stopRecVideo(){
  try{ recorder.stop(); }catch(e){}
  clearInterval(recIv);
  $('#recBadge').classList.remove('on'); $('#btnRec').classList.remove('on');
}

/* ============ Prompter öffnen/schließen ============ */
async function openPrompt(){
  if(!cur) return;
  buildContent(cur.text||'');
  show('prompt'); applyStyle(); restart(); setPos(0); setPlayBtn(); showCtl();
  lastT=0; cancelAnimationFrame(rafId); rafId=requestAnimationFrame(tick);
  if(App){ App.keepAwake(!!S.keepAwake); App.setFullscreen(true); return; }
  if(S.keepAwake&&navigator.wakeLock){ try{ wakeLock=await navigator.wakeLock.request('screen'); }catch(e){} }
  try{ if(document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen(); }catch(e){}
}
function exitPrompt(){
  pause(); stopRec(); stopCam();
  cancelAnimationFrame(rafId);
  wakeLock&&wakeLock.release&&wakeLock.release(); wakeLock=null;
  if(App){ App.keepAwake(false); App.setFullscreen(false); }
  try{ document.fullscreenElement&&document.exitFullscreen(); }catch(e){}
  show('edit');
}
let appFS=false;
function toggleFS(){ if(App){ appFS=!appFS; App.setFullscreen(appFS); return; } try{ document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen(); }catch(e){} }
document.addEventListener('visibilitychange',async()=>{
  if(document.visibilityState==='visible'&&views.prompt.classList.contains('on')&&S.keepAwake&&navigator.wakeLock&&!App){
    try{ wakeLock=await navigator.wakeLock.request('screen'); }catch(e){}
  }
});
window.addEventListener('resize',()=>{ if(views.prompt.classList.contains('on')) applyStyle(); });

$('#btnPrompt').onclick=openPrompt;
$('#btnExit').onclick=exitPrompt;
$('#btnPlay').onclick=()=>{ playing?pause():play(); };
$('#btnRestart').onclick=restart;
$('#btnSlower').onclick=()=>{ changeSpeed(-10); showCtl(); };
$('#btnFaster').onclick=()=>{ changeSpeed(10); showCtl(); };
$('#btnMic').onclick=()=>{ micToggle(); showCtl(); };
$('#btnRec').onclick=()=>{ recPress(); showCtl(); };
$('#btnCam').onclick=camToggle;
$('#btnFlip').onclick=flipCam;
$('#btnMirror').onclick=()=>{ S.mirrorH=!S.mirrorH; applyStyle(); syncDrawer(); saveSettings(); };
$('#btnGear').onclick=openDrawer;
$('#permClose').onclick=()=>$('#permDlg').style.display='none';
$('#permRetry').onclick=()=>{ const r=$('#permDlg')._retry; $('#permDlg').style.display='none'; r&&r(); };

/* ============ Startsequenz (App) ============ */
(function intro(){
  const el=$('#intro');
  if(!el) return;
  if(!document.documentElement.classList.contains('intro')){ el.remove(); return; }
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tile=el.querySelector('.intro-tile');
  // Start in Kachelgröße (wie das App-Symbol auf dem Startbildschirm, ~64 px)
  tile.style.setProperty('--s0',Math.min(1,64/Math.max(1,tile.offsetWidth)).toFixed(3));
  requestAnimationFrame(()=>el.classList.add('run'));
  let done=false;
  const end=()=>{ if(done) return; done=true; el.classList.add('out');
    setTimeout(()=>{ el.remove(); document.documentElement.classList.remove('intro'); },480); };
  setTimeout(end,reduce?700:3100);
  el.addEventListener('click',end);
})();

/* ============ Start ============ */
loadAll().then(()=>{ setUiLang(S.uiLang); syncDrawer(); });
