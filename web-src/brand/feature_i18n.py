import asyncio, sys, base64
sys.path.insert(0, '/home/claude/work/brand'); sys.path.insert(0, '/home/claude/work/src')
from logo import *
from landing_i18n import T
from playwright.async_api import async_playwright
def _f(n): return 'data:font/woff2;base64,'+base64.b64encode(open('/home/claude/silverapplications/assets/fonts/'+n,'rb').read()).decode()
FONTS = f'''@font-face{{font-family:P;font-weight:300;src:url({_f('IBMPlexSans-Light-Latin1.woff2')})}}
@font-face{{font-family:P;font-weight:400;src:url({_f('IBMPlexSans-Regular-Latin1.woff2')})}}
@font-face{{font-family:P;font-weight:600;src:url({_f('IBMPlexSans-SemiBold-Latin1.woff2')})}}
@font-face{{font-family:M;font-weight:500;src:url({_f('IBMPlexMono-Medium-Latin1.woff2')})}}
@font-face{{font-family:'IBM Plex Sans';font-weight:300;src:url({_f('IBMPlexSans-Light-Latin1.woff2')})}}
@font-face{{font-family:'IBM Plex Sans';font-weight:600;src:url({_f('IBMPlexSans-SemiBold-Latin1.woff2')})}}
*{{box-sizing:border-box;margin:0}} body{{background:transparent}}'''

def promo(w, h, s, lines, eb, claim):
    """Feature-Grafik / OG-Bild im SA-Stil. s = Skalierung."""
    rows = ''.join(f'<div class="l{" now" if a==1 else ""}" style="opacity:{a}">{t}</div>' for t, a in lines)
    return f'''<html><head><style>{FONTS}
body{{width:{w}px;height:{h}px;overflow:hidden;background:linear-gradient(#1E2328,#15181B);color:{WHITE};font-family:P;position:relative}}
.frame{{position:absolute;inset:{22*s}px;border:1px solid {GRAPHIT}}}
.tick{{position:absolute;width:{14*s}px;height:{14*s}px;border-color:{S300};border-style:solid}}
.left{{position:absolute;left:{70*s}px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;width:{470*s}px}}
.wm{{display:flex;align-items:center;gap:{18*s}px}} .wm svg{{width:{92*s}px;height:{87*s}px}}
.wm span{{font-size:{70*s}px;font-weight:300;letter-spacing:-.025em;line-height:1}} .wm b{{font-weight:600}}
.eb{{font:500 {13*s}px/1 M;letter-spacing:.18em;text-transform:uppercase;color:{P300};margin:{30*s}px 0 {14*s}px}}
.claim{{font-size:{30*s}px;font-weight:300;line-height:1.2;color:{S100}}} .claim b{{font-weight:600;color:{WHITE}}}
.right{{position:absolute;right:{60*s}px;top:{60*s}px;bottom:{60*s}px;width:{410*s}px;border:1px solid {GRAPHIT};
  background:#0E1012;display:flex;flex-direction:column;justify-content:center;padding:0 {26*s}px 0 {40*s}px}}
.l{{font-size:{19*s}px;font-weight:600;line-height:1.75;white-space:nowrap;position:relative;color:{WHITE}}}
.l b{{font-weight:600;background:rgba(63,168,147,.28);box-shadow:0 0 0 {3*s}px rgba(63,168,147,.28)}}
.now::before{{content:"";position:absolute;left:{-28*s}px;top:50%;margin-top:{-7*s}px;border:{7*s}px solid transparent;border-left:{11*s}px solid {P300}}}
.cap{{position:absolute;left:{40*s}px;top:{18*s}px;font:500 {10.5*s}px/1 M;letter-spacing:.16em;color:{S300};text-transform:uppercase}}
.bar{{position:absolute;left:0;top:0;height:{3*s}px;width:46%;background:{P300}}}
</style></head><body>
<div class="frame"></div>
<div class="left">
  <div class="wm">{mark_svg()}<span>Prompt<b>Air</b></span></div>
  <div class="eb">{eb}</div>
  <div class="claim">{claim}</div>
</div>
<div class="right"><div class="bar"></div><div class="cap">Prompter · 02:14</div>{rows}</div>
</body></html>'''


LINES = {
 'de-DE': ["Guten Morgen und willkommen.", "Heute zeige ich euch,", "wie <b>PromptAir</b> eurer Stimme folgt –", "Wort für Wort, ganz ohne Cloud.", "Kein Konto. Kein Wasserzeichen."],
 'en-US': ["Good morning and welcome.", "Today I will show you", "how <b>PromptAir</b> follows your voice –", "word by word, no cloud at all.", "No account. No watermark."],
 'es-ES': ["Buenos días y bienvenidos.", "Hoy os enseño", "cómo <b>PromptAir</b> sigue vuestra voz,", "palabra a palabra, sin nube.", "Sin cuenta. Sin marca de agua."],
 'fr-FR': ["Bonjour et bienvenue.", "Aujourd’hui, je vous montre", "comment <b>PromptAir</b> suit votre voix –", "mot à mot, sans aucun cloud.", "Sans compte. Sans filigrane."],
 'pt-BR': ["Bom dia e sejam bem-vindos.", "Hoje vou mostrar a vocês", "como o <b>PromptAir</b> segue sua voz –", "palavra por palavra, sem nuvem.", "Sem conta. Sem marca d’água."],
 'it-IT': ["Buongiorno e benvenuti.", "Oggi vi mostro", "come <b>PromptAir</b> segue la vostra voce –", "parola per parola, senza cloud.", "Nessun account. Nessuna filigrana."],
}
A = [.30, .45, 1, .45, .25]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1024, 'height': 500})
        for loc, ls in LINES.items():
            l = loc[:2]
            html = promo(1024, 500, 1.0, list(zip(ls, A)), T['og_eyebrow'][l], T['og_claim'][l])
            await pg.set_content(html); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(200)
            ov = await pg.evaluate("[...document.querySelectorAll('.l')].some(e=>e.getBoundingClientRect().right>document.querySelector('.right').getBoundingClientRect().right-8)")
            await pg.screenshot(path=f'/home/claude/work/store/final/{loc}-feature-graphic.png'); print(loc, 'overflow' if ov else 'ok')
        await b.close()
asyncio.run(main())
