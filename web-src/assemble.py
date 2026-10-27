"""Baut promptair.html 1.1.0 aus dem bisherigen Kopf (Schriften, CSS) + neuen Teilen."""
import re, sys
sys.path.insert(0, '/home/claude/work/brand')
from logo import mark_svg, BARS, GHOST, CX, CY

SRC = '/home/claude/work/src/'
OLD = '/home/claude/work/promptair.v2.bak.html'           # Stand vor der SA-Umgestaltung (nur Referenz)
CUR = '/home/claude/work/out11/promptair.html'  # nur für das Icon-Sprite
OUT = sys.argv[1]

cur = open(CUR, encoding='utf8').read()
head = open(SRC + 'head.html', encoding='utf8').read()   # Kopf (Schriften, Grund-CSS) – feste Quelle

def rep(s, a, b):
    assert s.count(a) == 1, (a[:70], s.count(a)); return s.replace(a, b)

# alte Play-Taste aus der Leiste entfernen (jetzt Mitte des Steuerkreuzes)
head += open(SRC + 'extra.css', encoding='utf8').read() + '</style>\n'
# App/Intro-Klassen setzen, bevor irgendetwas gezeichnet wird
head += ("<script>(function(d){if(window.AndroidApp)d.classList.add('in-app');"
         "if(window.AndroidApp||/[?&]intro=1/.test(location.search))d.classList.add('intro');})(document.documentElement);</script>\n"
         "</head>\n")

# ---------- Icons ----------
old_sprite = re.search(r'<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>.*?</defs></svg>', cur, re.S).group(0)
old_sprite = re.sub(r'<symbol id="i-dbl(up|down)".*?</symbol>', '', old_sprite)
extra = {
    'dblup':   '<path d="M12 3l7 7H5zM12 12l7 7H5z" fill="currentColor" stroke="none"/>',
    'dbldown': '<path d="M12 21l-7-7h14zM12 12L5 5h14z" fill="currentColor" stroke="none"/>',
}
sym = ''.join(f'<symbol id="i-{k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter">{v}</symbol>' for k, v in extra.items())
sprite = old_sprite.replace('</defs></svg>', sym + '</defs></svg>')

logo = mark_svg().replace('<svg ', '<svg class="logo" role="img" aria-label="PromptAir Logo" ')

# ---------- Intro-Grafik: metallische Bildmarke mit Glanz und Funkeln ----------
bars, maskr = [], []
for i, (x, y, w) in enumerate(BARS):
    fill = 'url(#mPetrol)' if i == 3 else 'url(#mSilver)'
    bars.append(f'<rect x="{x}" y="{y}" width="{w}" height="7" fill="{fill}"/>')
    maskr.append(f'<rect x="{x}" y="{y}" width="{w}" height="7" fill="#fff"/>')
for (x, y, w) in GHOST:
    bars.append(f'<rect x="{x}" y="{y}" width="{w}" height="3" fill="url(#mSilver)" fill-opacity=".5"/>')
star = 'M0 -5L1.1 -1.1L5 0L1.1 1.1L0 5L-1.1 1.1L-5 0L-1.1 -1.1Z'
sparks = ''.join(f'<g transform="translate({px} {py}) scale({sc})"><path class="spark {c}" d="{star}" fill="#fff"/></g>'
                 for c, px, py, sc in [('s1', 78, 50, 1.1), ('s2', 42, 17, .8), ('s3', 66, 60.5, .7), ('s4', 8, 50, .6)])
intro_svg = (
 '<svg viewBox="0 0 100 100" aria-hidden="true"><defs>'
 '<linearGradient id="mSilver" gradientUnits="userSpaceOnUse" x1="7" y1="16" x2="78" y2="84">'
 '<stop offset="0" stop-color="#FFFFFF"/><stop offset=".22" stop-color="#D9DDE1"/><stop offset=".45" stop-color="#8E969E"/>'
 '<stop offset=".62" stop-color="#EEF0F2"/><stop offset=".82" stop-color="#A9B0B7"/><stop offset="1" stop-color="#DDE1E5"/></linearGradient>'
 '<linearGradient id="mPetrol" gradientUnits="userSpaceOnUse" x1="30" y1="44" x2="78" y2="56">'
 '<stop offset="0" stop-color="#8BE0CC"/><stop offset=".4" stop-color="#3FA893"/><stop offset=".68" stop-color="#1D7A6E"/><stop offset="1" stop-color="#5BC3AE"/></linearGradient>'
 '<linearGradient id="sheenGrad" x1="0" y1="0" x2="1" y2="0">'
 '<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
 f'<mask id="iMask" maskUnits="userSpaceOnUse" x="-20" y="0" width="140" height="100">{"".join(maskr)}</mask></defs>'
 f'<g transform="translate(50 50) scale(.86) translate({-CX} {-CY})">{"".join(bars)}'
 '<g mask="url(#iMask)"><g class="sheen"><rect x="-26" y="0" width="26" height="100" fill="url(#sheenGrad)" transform="skewX(-18)"/></g></g>'
 f'{sparks}</g></svg>')

# ---------- Silver-Applications-Signet (aus silverapplications.com/favicon.svg) ----------
fav = open('/home/claude/silverapplications/favicon.svg', encoding='utf8').read()
p_petrol = re.search(r'<path d="([^"]+)" class="cls-6"/>', fav).group(1)
p_silver = re.search(r'<path d="([^"]+)" class="cls-7"/>', fav).group(1)
sa_icon = f'<svg viewBox="356 32 1448 1448" aria-hidden="true"><path d="{p_petrol}" fill="#3FA893"/><path d="{p_silver}" fill="#9BA3AB"/></svg>'

body = open(SRC + 'body.html', encoding='utf8').read()
for k, v in {'%%SPRITE%%': sprite, '%%LOGO%%': logo, '%%INTRO_SVG%%': intro_svg, '%%SA_ICON%%': sa_icon,
             '%%I18N%%': open(SRC + 'i18n.js', encoding='utf8').read(),
             '%%APP%%': open(SRC + 'app.js', encoding='utf8').read()}.items():
    body = rep(body, k, v)

html = head + body
html = html.replace('<html lang="de">', '<html lang="de">', 1)
open(OUT, 'w', encoding='utf8').write(html)
print('ok', len(html))
