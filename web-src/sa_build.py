# -*- coding: utf-8 -*-
"""Überträgt PromptAir 1.1.0 nach silverapplications.com/apps/promptair/.
   Anpassungen an die CSP der Website (script-src 'self', font-src 'self'):
   - keine Inline-Skripte und keine onclick-Attribute -> eigene .js-Dateien
   - Schriften als Dateien statt data:-URIs
   - feste Pfade unter /apps/promptair/
   Aufruf: python3 sa_build.py <repo>"""
import os, re, sys, shutil
REPO = sys.argv[1]
W = '/home/claude/work/'
PA = os.path.join(REPO, 'apps/promptair')
A = '/apps/promptair/'
V = 'v=2'
SITE = 'https://silverapplications.com/apps/promptair/'

def wr(rel, s):
    p = os.path.join(PA, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf8').write(s)

def no_inline(s, name):
    bad = re.findall(r'<script>(?![^<]*</script>\s*$)', s)
    assert '<script>' not in s, f'{name}: Inline-Skript übrig'
    assert not re.search(r'\son[a-z]+="', s), f'{name}: Inline-Eventhandler übrig'
    assert 'data:font' not in s, f'{name}: eingebettete Schrift übrig'

# ================= Landingpages (6 Sprachen) =================
LANGS = ['de', 'en', 'es', 'fr', 'pt', 'it']
landing_js = None
for l in LANGS:
    src = os.path.join(W, 'out/promptair-site', 'index.html' if l == 'de' else f'{l}/index.html')
    s = open(src, encoding='utf8').read()
    # Inline-Hauptskript -> landing.js (einmal übernehmen)
    m = re.search(r"<script>\n'use strict';(.*?)</script>", s, re.S)
    if landing_js is None: landing_js = "'use strict';" + m.group(1)
    s = s.replace(m.group(0), f'<script src="{A}assets/landing.js?{V}"></script>')
    # Spracherkennung beim Erstbesuch (nur DE) -> lang-redirect.js
    s = re.sub(r"<script>try\{if\(!localStorage.getItem\('pa_lang'\)\).*?</script>",
               f'<script src="{A}assets/lang-redirect.js?{V}"></script>', s, flags=re.S)
    # Sprachwahl merken: onclick -> data-lang (landing.js)
    s = re.sub(r''' onclick="try\{localStorage.setItem\('pa_lang','(\w\w)'\)\}catch\(e\)\{\}"''', r' data-lang="\1"', s)
    # Pfade
    s = re.sub(r'(?:\./|\.\./)favicon\.svg', A + 'assets/favicon.svg', s)
    s = re.sub(r'(?:\./|\.\./)apple-touch-icon\.png', A + 'assets/apple-touch-icon.png', s)
    s = re.sub(r'url\("(?:\./|\.\./)fonts/', f'url("{A}assets/fonts/', s)
    s = re.sub(r'(?:\./|\.\./)promptair\.html\?lang=', A + 'app/?lang=', s)
    s = re.sub(r'(?:\./|\.\./)impressum\.html', A + 'impressum/', s)
    s = re.sub(r'(?:\./|\.\./)datenschutz\.html', A + ('datenschutz/' if l == 'de' else 'en/privacy/'), s)
    s = re.sub(r'href="(?:\./|\.\./)?(en|es|fr|pt|it)/"', lambda m: f'href="{A}{m.group(1)}/"', s)
    s = re.sub(r'href="(?:\./|\.\./)"', f'href="{A}"', s)
    s = s.replace('https://telepromptair.netlify.app/og-image', SITE + 'assets/og-image')
    s = s.replace('https://telepromptair.netlify.app/', SITE)
    assert 'telepromptair' not in s and './' not in re.sub(r'https?://\S+', '', s.split('<style>')[0]), l
    no_inline(s, l)
    wr('index.html' if l == 'de' else f'{l}/index.html', s)

landing_js += r"""
/* ---------- Sprachwahl merken (ersetzt Inline-Handler wegen CSP) ---------- */
document.querySelectorAll('a[data-lang]').forEach(a=>a.addEventListener('click',()=>{
  try{ localStorage.setItem('pa_lang',a.dataset.lang); }catch(e){}
}));
"""
wr('assets/landing.js', landing_js)
wr('assets/lang-redirect.js', """/* PromptAir: Erstbesuch der deutschen Startseite -> Browsersprache, solange niemand bewusst gewählt hat */
try{ if(!localStorage.getItem('pa_lang')){
  var l=((navigator.languages&&navigator.languages[0])||navigator.language||'').slice(0,2).toLowerCase();
  if(['en','es','fr','pt','it'].indexOf(l)>=0) location.replace('/apps/promptair/'+l+'/');
} }catch(e){}
""")

# ================= Web-App =================
s = open(W + 'out11/promptair.html', encoding='utf8').read()
FONTMAP = [  # (Familie, Gewicht) -> Datei
 (r'"IBM Plex Sans";font-style:normal;font-weight:300;', 'IBMPlexSans-Light-Latin1.woff2'),
 (r'"IBM Plex Sans";font-style:normal;font-weight:400;', 'IBMPlexSans-Regular-Latin1.woff2'),
 (r'"IBM Plex Sans";font-style:normal;font-weight:600;', 'IBMPlexSans-SemiBold-Latin1.woff2'),
 (r'"IBM Plex Sans";font-style:normal;font-weight:700 900;', 'IBMPlexSans-Bold-Latin1.woff2'),
 (r'"IBM Plex Mono";font-style:normal;font-weight:400;', 'IBMPlexMono-Regular-Latin1.woff2'),
]
for key, f in FONTMAP:
    pat = re.escape('@font-face{font-family:' + key) + r'font-display:swap;src:url\(data:font/woff2;base64,[A-Za-z0-9+/=]+\)'
    s, n = re.subn(pat, lambda m: '@font-face{font-family:' + key + f'font-display:swap;src:url("{A}assets/fonts/{f}")', s)
    assert n == 1, (key, n)
s, n = re.subn(r'<link rel="icon" type="image/svg\+xml" href="data:[^"]+">', f'<link rel="icon" type="image/svg+xml" href="{A}assets/favicon.svg">', s); assert n == 1
s, n = re.subn(r'<link rel="apple-touch-icon" href="data:[^"]+">', f'<link rel="apple-touch-icon" href="{A}assets/apple-touch-icon.png">', s); assert n == 1
# Kopf-Skript (App-/Intro-Klassen) -> boot.js, synchron im <head>
m = re.search(r"<script>(\(function\(d\)\{if\(window\.AndroidApp\).*?)</script>", s, re.S)
wr('app/boot.js', '/* PromptAir: Klassen setzen, bevor gezeichnet wird */\n' + m.group(1) + '\n')
s = s.replace(m.group(0), f'<script src="{A}app/boot.js?{V}"></script>')
# Hauptskript -> assets/app.js
m = re.search(r"<script>\n'use strict';\n(.*?)</script>\n</body>", s, re.S)
wr('assets/app.js', "'use strict';\n" + m.group(1))
s = s.replace(m.group(0), f'<script src="{A}assets/app.js?{V}"></script>\n</body>')
no_inline(s, 'app')
assert 'telepromptair' not in s
wr('app/index.html', s)

# ================= Bilder =================
for l in ['en', 'es', 'fr', 'pt', 'it']:
    shutil.copy(W + f'out/promptair-site/og-image-{l}.png', os.path.join(PA, f'assets/og-image-{l}.png'))

# ================= Datenschutz: Stand 1.1.0 =================
p = os.path.join(PA, 'datenschutz/index.html'); d = open(p, encoding='utf8').read()
d2 = re.sub(r'exportierte Skripte\s+im Ordner „Downloads/PromptAir“ deines Geräts',
            'exportierte Skripte an dem Ort, den du beim Speichern selbst auswählst', d)
d2 = d2.replace('<p class="stand">Stand: Oktober 2026 ·', '<p class="stand">Stand: Oktober 2026 (App-Version 1.1.0) ·', 1)
open(p, 'w', encoding='utf8').write(d2)
print('Datenschutz aktualisiert:', d != d2)

# ================= EN-Startseite von silverapplications.com: Karte auf englische PromptAir-Seite =================
p = os.path.join(REPO, 'en/index.html'); e = open(p, encoding='utf8').read()
e2 = e.replace('<a class="appcard" href="/apps/promptair/" hreflang="de">', '<a class="appcard" href="/apps/promptair/en/" hreflang="en">')
e2 = e2.replace('No account, no limits. (German)</span>', 'No account, no limits. Six languages.</span>')
open(p, 'w', encoding='utf8').write(e2)
print('EN-Karte aktualisiert:', e != e2)
print('ok')

# ================= Englische Datenschutzerklärung (Quelle: src/privacy.en.html) =================
wr('en/privacy/index.html', open(W + 'src/privacy.en.html', encoding='utf8').read())
# DE-Fassung: Offline-Sprachpaket gilt seit 1.1.0 für die gewählte Sprache, nicht nur Deutsch
p = os.path.join(PA, 'datenschutz/index.html'); d = open(p, encoding='utf8').read()
d = d.replace('kein deutsches\n  Offline-Sprachpaket verfügbar', 'kein Offline-Sprachpaket\n  für die gewählte Sprache verfügbar')
d = d.replace('<p>Wir passen diese Datenschutzerklärung an', '<p>Eine englische Fassung findest du unter <a href="/apps/promptair/en/privacy/" hreflang="en">Privacy Policy (English)</a>.</p>\n  <p>Wir passen diese Datenschutzerklärung an') if 'en/privacy/' not in d else d
open(p, 'w', encoding='utf8').write(d)
print('EN-Datenschutz geschrieben')
