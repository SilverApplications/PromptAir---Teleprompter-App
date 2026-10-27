const { chromium } = require('playwright'); const fs=require('fs');
const D=require('./store.json'); const F='/home/claude/silverapplications/apps/promptair/assets/fonts/';
const f64=n=>fs.readFileSync(F+n).toString('base64');
const css=`@font-face{font-family:P;font-weight:300;src:url(data:font/woff2;base64,${f64('IBMPlexSans-Light-Latin1.woff2')})}
@font-face{font-family:P;font-weight:600;src:url(data:font/woff2;base64,${f64('IBMPlexSans-SemiBold-Latin1.woff2')})}
@font-face{font-family:M;font-weight:500;src:url(data:font/woff2;base64,${f64('IBMPlexMono-Medium-Latin1.woff2')})}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;background:#15181B;overflow:hidden}
body{background:radial-gradient(1100px 700px at 50% 0%,#1F2A2A 0%,#15181B 60%);font-family:P;color:#F4F5F6;position:relative}
.cap{position:absolute;top:118px;left:90px;right:90px}
.num{font:500 26px/1 M;letter-spacing:.2em;color:#3FA893;margin-bottom:26px;display:flex;align-items:center;gap:18px}
.num i{display:block;width:56px;height:4px;background:#3FA893}
h1{font-weight:300;font-size:86px;line-height:1.08;letter-spacing:-.02em;white-space:pre-line}
h1 b{font-weight:600}
.shot{position:absolute;left:50%;transform:translateX(-50%);bottom:0;width:792px;height:1505px;overflow:hidden;
 border:2px solid rgba(217,221,225,.18);border-bottom:none;box-shadow:0 -30px 80px rgba(0,0,0,.45)}
.shot img{width:100%;display:block}`;
const files={'1':'1-prompter','2':'2-home','3':'3-editor','4':'4-settings'};
(async()=>{ const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
 for (const loc of Object.keys(D.captions)) for (const [i,n] of Object.entries(files)) {
   const img=fs.readFileSync(`/home/claude/work/store/raw/${loc}-${n}.png`).toString('base64');
   const cap=D.captions[loc][i-1].split('\n'); const h=cap[0]+'\n<b>'+(cap[1]||'')+'</b>';
   await p.setContent(`<style>${css}</style><div class="cap"><div class="num"><i></i>0${i}</div><h1>${h}</h1></div><div class="shot"><img src="data:image/png;base64,${img}"></div>`);
   await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(50);
   await p.screenshot({path:`/home/claude/work/store/final/${loc}-${n}.png`});
 }
 await b.close(); })();
