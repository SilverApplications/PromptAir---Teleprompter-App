import asyncio, sys
sys.path.insert(0, '.')
from logo import *
from playwright.async_api import async_playwright
O = '/home/claude/work/brandout/'
import base64
def _f(n): return 'data:font/woff2;base64,'+base64.b64encode(open('/home/claude/silverapplications/assets/fonts/'+n,'rb').read()).decode()
F = None

# ---------- SVG-Dateien ----------
open(O+'logo/promptair-icon.svg', 'w').write(icon_svg(512))
open(O+'logo/promptair-mark.svg', 'w').write(mark_svg())
open(O+'logo/promptair-mark-white.svg', 'w').write(mark_svg(mono=WHITE))
open(O+'logo/promptair-mark-anthrazit.svg', 'w').write(mark_svg(mono=A900))
open(O+'web/favicon.svg', 'w').write(icon_svg(64))
wordmark = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 76" width="400" height="76">'
            f'<g transform="translate(0 2) scale(1) translate(-5 -14)">{mark()}</g>'
            f'<text x="92" y="53" font-family="IBM Plex Sans, sans-serif" font-size="46" fill="{WHITE}" letter-spacing="-0.9">'
            f'<tspan font-weight="300">Prompt</tspan><tspan font-weight="600">Air</tspan></text></svg>')
open(O+'logo/promptair-wordmark.svg', 'w').write(wordmark)

FONTS = f'''@font-face{{font-family:P;font-weight:300;src:url({_f('IBMPlexSans-Light-Latin1.woff2')})}}
@font-face{{font-family:P;font-weight:400;src:url({_f('IBMPlexSans-Regular-Latin1.woff2')})}}
@font-face{{font-family:P;font-weight:600;src:url({_f('IBMPlexSans-SemiBold-Latin1.woff2')})}}
@font-face{{font-family:M;font-weight:500;src:url({_f('IBMPlexMono-Medium-Latin1.woff2')})}}
@font-face{{font-family:'IBM Plex Sans';font-weight:300;src:url({_f('IBMPlexSans-Light-Latin1.woff2')})}}
@font-face{{font-family:'IBM Plex Sans';font-weight:600;src:url({_f('IBMPlexSans-SemiBold-Latin1.woff2')})}}
*{{box-sizing:border-box;margin:0}} body{{background:transparent}}'''

def promo(w, h, s):
    """Feature-Grafik / OG-Bild im SA-Stil. s = Skalierung."""
    lines = [("Guten Morgen und willkommen.", .30), ("Heute zeige ich euch,", .45),
             ("wie <b>PromptAir</b> eurer Stimme folgt –", 1), ("Wort für Wort, ganz ohne Cloud.", .45),
             ("Kein Konto. Kein Wasserzeichen.", .25)]
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
  <div class="eb">Teleprompter · Sprachfolge · Offline</div>
  <div class="claim">Der Text folgt<br><b>deiner Stimme.</b></div>
</div>
<div class="right"><div class="bar"></div><div class="cap">Prompter · 02:14</div>{rows}</div>
</body></html>'''

def page(svg, w, h, bg='transparent'):
    return f'<html><head><style>{FONTS} body{{width:{w}px;height:{h}px;background:{bg};overflow:hidden}} svg{{display:block;width:{w}px;height:{h}px}}</style></head><body>{svg}</body></html>'

JOBS = [
    (page(icon_svg(1024), 1024, 1024), 'logo/promptair-icon-1024.png', 1024, 1024, False),
    (page(icon_svg(512), 512, 512), 'play-store/app-icon-512.png', 512, 512, False),
    (page(icon_svg(192), 192, 192), 'web/icon-192.png', 192, 192, False),
    (page(icon_svg(180), 180, 180), 'web/apple-touch-icon.png', 180, 180, False),
    (page(mark_svg(), 760, 720), 'logo/promptair-mark-760.png', 760, 720, True),
    (f'<html><head><style>{FONTS} body{{width:1200px;height:260px;background:{A900};display:flex;align-items:center;justify-content:center}}</style></head><body>{wordmark.replace("width=\"400\" height=\"76\"","width=\"1000\" height=\"190\"")}</body></html>',
     'logo/promptair-wordmark-dunkel.png', 1200, 260, False),
    (promo(1024, 500, 1.0), 'play-store/feature-graphic-1024x500.png', 1024, 500, False),
    (promo(1200, 630, 1.17), 'web/og-image.png', 1200, 630, False),
]

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for html, out, w, h, transp in JOBS:
            pg = await b.new_page(viewport={'width': w, 'height': h})
            await pg.set_content(html); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(300)
            await pg.screenshot(path=O+out, omit_background=transp)
            await pg.close()
        await b.close()
asyncio.run(main())
print('ok')
