const { chromium } = require('playwright');
const D = require('./store.json');
const OUT = '/home/claude/work/store/raw/';
(async()=>{
 const b = await chromium.launch();
 for (const loc of Object.keys(D.samples)) {
  const L = loc.slice(0,2);
  const c = await b.newContext({locale:loc, viewport:{width:400,height:760}, deviceScaleFactor:2.7});
  await c.addInitScript(([L,samples])=>{
    if (sessionStorage.getItem('init')) return; sessionStorage.setItem('init','1');
    localStorage.setItem('promtair:seen','1');
    localStorage.setItem('promtair:settings', JSON.stringify({uiLang:L, countdown:0, fontSize:34, speed:60, lang:'auto'}));
  }, [L, D.samples[loc]]);
  const p = await c.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://127.0.0.1:8765/apps/promptair/app/?lang='+L); await p.waitForTimeout(600); await p.evaluate(()=>document.documentElement.classList.add('in-app'));
  // Beispielskripte + Demo einspielen (Demo-Text aus der App-Übersetzung)
  await p.evaluate(async (samples)=>{
    const now=Date.now();
    scripts=[{id:'demo',title:t('demoTitle'),text:t('demoText'),updated:now}].concat(
      samples.map((s,i)=>({id:'s'+i,title:s[0],text:(s[1]+' ').repeat(40+i*25),updated:now-(i+1)*86400000*(i+1)})));
    await saveScripts(); renderHome();
  }, D.samples[loc]);
  await p.waitForTimeout(300);
  await p.screenshot({path:OUT+loc+'-2-home.png'});
  // Editor
  await p.locator('#homeList > *').first().click(); await p.waitForTimeout(400);
  await p.evaluate(()=>{ const ta=document.getElementById('edText'); ta.blur(); ta.scrollTop=0; });
  await p.screenshot({path:OUT+loc+'-3-editor.png'});
  // Prompter mit Sprachfolge-Markierung
  await p.click('#btnPrompt'); await p.waitForTimeout(900);
  await p.evaluate(()=>{
    try{ if(typeof stopPlay==='function') stopPlay(); }catch(e){}
    const ws=[...document.querySelectorAll('#content .w')].filter(w=>!w.classList.contains('nv'));
    const paras=[...document.querySelectorAll('#content p')].filter(p=>p.querySelector('.w'));
    const k=ws.indexOf(paras[2].querySelectorAll('.w')[7]);
    ws.forEach((w,i)=>{ w.classList.toggle('read',i<k); w.classList.toggle('now',i===k); });
    document.getElementById('micDot').classList.add('live'); document.getElementById('btnMic').classList.add('on');
    const el=ws[k]; setPos(el.offsetTop-guidePx()+el.offsetHeight/2 - 0);
    document.getElementById('timeLeft').textContent='2:14';
  });
  await p.waitForTimeout(400);
  await p.screenshot({path:OUT+loc+'-1-prompter.png'});
  // Einstellungen über dem Prompter
  await p.click('#btnGear'); await p.waitForTimeout(600);
  await p.screenshot({path:OUT+loc+'-4-settings.png'});
  console.log(loc, errs);
  await c.close();
 }
 await b.close();
})();
