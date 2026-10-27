# -*- coding: utf-8 -*-
"""Erzeugt die Landingpage in sechs Sprachen aus der deutschen Vorlage.
   /index.html = Deutsch, /en/ /es/ /fr/ /pt/ /it/ = Übersetzungen.
   Aufruf: python3 build_landing.py <site-ordner>"""
import sys, os, re
sys.path.insert(0, os.path.dirname(__file__))
from landing_i18n import T, LANGS, NAMES, OG_LOCALE

SITE = sys.argv[1]
BASE = 'https://telepromptair.netlify.app/'
SRC = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'index.de.src.html'), encoding='utf8').read()

# Original-Formulierungen der Vorlage, wo der deutsche Text für 1.1.0 aktualisiert wurde
ORIG = {
 'p_lead': 'Zwei Sprachmodi machen den Unterschied: <strong>„Text folgt der Stimme“</strong> scrollt\n    automatisch dorthin, wo du gerade liest – Wort für Wort markiert. <strong>„Sprachbefehle“</strong> versteht\n    Start, Stopp, schneller, langsamer und von vorn. Dazu alles, was sonst hinter Abo-Schranken steckt.',
 'c2_p': 'Geschwindigkeit, Schriftgröße per Zwei-Finger-Geste, Farben, Leselinie, Fokus-Abdunklung, Countdown, Loop – alles frei einstellbar.',
 's2_p': 'Alle deutschen Offline-Stimmen deines Geräts, Tempo von 0,5× bis 2×. Mit [pause] und [pause lang] setzt du Sprechpausen.',
}

def rep(s, a, b, n=1):
    c = s.count(a)
    assert c == n, (a[:80], c)
    return s.replace(a, b)

# ---------- Vorlage mit Platzhaltern ----------
tpl = SRC
ctx_pairs = [  # (exakter Kontext in der Vorlage, Schlüssel) – Kontext macht mehrdeutige Wörter eindeutig
 ('<title>{}</title>', 'meta_title'),
 ('<meta name="description" content="{}">', 'meta_desc'),
 ('<meta property="og:title" content="{}">', 'og_title'),
 ('<meta property="og:description" content="{}">', 'og_desc'),
 ('aria-label="{}"', 'brand_aria'),
 ('<a href="#prompter">{}</a>', 'nav_prompter'),
 ('<a href="#vorlesen">{}</a>', 'nav_read'),
 ('<a href="#privat">{}</a>', 'nav_privacy'),
 ('<a class="cta-mini" href="./promptair.html">{}</a>', 'nav_start'),
 ('<p class="tagline">{}</p>', 'tagline'),
 ('<a class="btn primary" href="./promptair.html">{}</a>', 'btn_browser'),
 ('<a class="btn ghost" href="#prompter">{}</a>', 'btn_features'),
 ('<div class="crawlwrap" aria-label="{}">', 'crawl_aria'),
 ('<p class="ep">{}</p>', 'crawl_ep'),
 ('<h2>{}</h2>', 'crawl_h2'),
 ('<p>{}</p>', 'crawl_p1'), ('<p>{}</p>', 'crawl_p2'), ('<p>{}</p>', 'crawl_p3'),
 ('<p>{}</p>', 'crawl_p4'), ('<p>{}</p>', 'crawl_p5'), ('<p>{}</p>', 'crawl_p6'),
 ('<p class="crawlnote">{}</p>', 'crawl_note'),
 ('<p class="eyebrow">{}</p>', 'p_eyebrow'), ('<h3 class="title">{}</h3>', 'p_title'), ('<p class="lead">{}</p>', 'p_lead'),
 ('<h4>{}</h4>', 'c1_h'), ('<p>{}</p>', 'c1_p'), ('<h4>{}</h4>', 'c2_h'), ('<p>{}</p>', 'c2_p'),
 ('<h4>{}</h4>', 'c3_h'), ('<p>{}</p>', 'c3_p'), ('<h4>{}</h4>', 'c4_h'), ('<p>{}</p>', 'c4_p'),
 ('<p class="eyebrow">{}</p>', 'r_eyebrow'), ('<h3 class="title">{}</h3>', 'r_title'), ('<p class="lead">{}</p>', 'r_lead'),
 ('<h4>{}</h4>', 's1_h'), ('<p>{}</p>', 's1_p'), ('<h4>{}</h4>', 's2_h'), ('<p>{}</p>', 's2_p'),
 ('<h4>{}</h4>', 's3_h'), ('<p>{}</p>', 's3_p'),
 ('<p class="eyebrow">{}</p>', 'v_eyebrow'), ('<h3 class="title">{}</h3>', 'v_title'), ('<p class="lead">{}</p>', 'v_lead'),
 ('<h4>{}</h4>', 'v1_h'), ('<p>{}</p>', 'v1_p'), ('<h4>{}</h4>', 'v2_h'), ('<p>{}</p>', 'v2_p'),
 ('<h4>{}</h4>', 'v3_h'), ('<p>{}</p>', 'v3_p'), ('<h4>{}</h4>', 'v4_h'), ('<p>{}</p>', 'v4_p'),
 ('<h3 class="title">{}</h3>', 'f_title'), ('<p class="lead" style="margin-inline:auto">{}</p>', 'f_lead'),
 ('<a class="btn primary" href="./promptair.html">{}</a>', 'f_btn'),
]
for ctx, key in ctx_pairs:
    de = ORIG.get(key, T[key]['de'])
    tpl = rep(tpl, ctx.format(de), ctx.format('{{' + key + '}}'))

# Fußzeile
tpl = rep(tpl, '<span>Teleprompter · Sprachfolge · Vorlesen — ein Projekt von <a', '<span>{{foot_tag}} <a')
tpl = rep(tpl, '<a href="./impressum.html" style="color:var(--dim);text-decoration:none">Impressum</a>',
          '<a href="{{P}}impressum.html" style="color:var(--dim);text-decoration:none">{{imprint}}</a>')
tpl = rep(tpl, '<a href="./datenschutz.html" style="color:var(--dim);text-decoration:none">Datenschutz</a>',
          '<a href="{{P}}datenschutz.html" style="color:var(--dim);text-decoration:none">{{privacy}}</a>\n  </nav>\n  <nav class="langs" aria-label="{{lang_label}}">{{LANGLINKS}}')
# Pfade
tpl = rep(tpl, '<html lang="de">', '<html lang="{{LANG}}">')
tpl = rep(tpl, 'href="favicon.svg"', 'href="{{P}}favicon.svg"')
tpl = rep(tpl, 'href="apple-touch-icon.png"', 'href="{{P}}apple-touch-icon.png"')
tpl = rep(tpl, 'url("fonts/', 'url("{{P}}fonts/', 6)
tpl = rep(tpl, 'href="./promptair.html"', 'href="{{P}}promptair.html?lang={{LANG}}"', 3)
tpl = rep(tpl, '<meta property="og:image" content="https://telepromptair.netlify.app/og-image.png">',
          '<meta property="og:image" content="{{OGIMG}}">\n{{SEO}}')
# Sprachmenü im Kopf
tpl = rep(tpl, '    <a class="cta-mini" href="{{P}}promptair.html?lang={{LANG}}">{{nav_start}}</a>',
          '    <details class="langmenu"><summary aria-label="{{lang_label}}">{{LANGCODE}}</summary><div class="langlist">{{LANGMENU}}</div></details>\n'
          '    <a class="cta-mini" href="{{P}}promptair.html?lang={{LANG}}">{{nav_start}}</a>')
# CSS: Sprachmenü + Navigation auf dem Handy
tpl = rep(tpl, 'header nav{margin-left:auto; display:flex; gap:22px; font-size:14.5px}',
          'header nav{margin-left:auto; display:flex; align-items:center; gap:22px; font-size:14.5px}')
tpl = rep(tpl, '@media(max-width:640px){ header nav a:not(.cta-mini){display:none} }',
          '@media(max-width:640px){ header nav > a:not(.cta-mini){display:none} header nav{gap:10px} }')
LANG_CSS = """
/* ---------- Sprachwahl ---------- */
.langmenu{position:relative}
.langmenu summary{list-style:none; cursor:pointer; font:500 12px/1 var(--mono); letter-spacing:.1em; color:var(--s100);
  border:1px solid var(--graphit); padding:9px 10px; user-select:none}
.langmenu summary::-webkit-details-marker{display:none}
.langmenu summary::after{content:" ▾"; color:var(--dim)}
.langmenu[open] summary{border-color:var(--dim)}
.langmenu .langlist{position:absolute; right:0; top:calc(100% + 6px); background:var(--bg2); border:1px solid var(--graphit);
  min-width:180px; padding:6px 0; z-index:30}
header nav .langlist a{display:flex; justify-content:space-between; gap:16px; padding:10px 14px; color:var(--dim); font-size:14.5px}
header nav .langlist a:hover{color:var(--txt); background:rgba(255,255,255,.03)}
header nav .langlist a[aria-current]{color:var(--txt)}
.langlist a span{font:500 11px/1.6 var(--mono); letter-spacing:.08em; color:var(--accent)}
footer .langs{display:flex; flex-wrap:wrap; gap:12px; font:500 12px/1 var(--mono); letter-spacing:.08em}
footer .langs a{color:var(--dim); text-decoration:none} footer .langs a[aria-current]{color:var(--txt)}
"""
tpl = rep(tpl, '</style>', LANG_CSS + '</style>')

# ---------- Seiten erzeugen ----------
def url_for(l): return BASE if l == 'de' else BASE + l + '/'
def path_for(cur, l):
    up = '' if cur == 'de' else '../'
    return (up or './') if l == 'de' else up + l + '/'
def remember(l): return f"try{{localStorage.setItem('pa_lang','{l}')}}catch(e){{}}"

for lang in LANGS:
    P = './' if lang == 'de' else '../'
    s = tpl
    menu = ''.join(f'<a href="{path_for(lang, l)}" hreflang="{l}" lang="{l}"{" aria-current=\"true\"" if l == lang else ""} onclick="{remember(l)}">{NAMES[l]}<span>{l.upper()}</span></a>' for l in LANGS)
    foot = ''.join(f'<a href="{path_for(lang, l)}" hreflang="{l}"{" aria-current=\"true\"" if l == lang else ""} onclick="{remember(l)}">{l.upper()}</a>' for l in LANGS)
    seo = (f'<link rel="canonical" href="{url_for(lang)}">\n'
           + ''.join(f'<link rel="alternate" hreflang="{l}" href="{url_for(l)}">\n' for l in LANGS)
           + f'<link rel="alternate" hreflang="x-default" href="{BASE}">\n'
           + f'<meta property="og:url" content="{url_for(lang)}">\n<meta property="og:locale" content="{OG_LOCALE[lang]}">\n'
           + ''.join(f'<meta property="og:locale:alternate" content="{OG_LOCALE[l]}">\n' for l in LANGS if l != lang))
    if lang == 'de':
        # Erstbesuch auf der Startseite: in die Browsersprache wechseln, solange niemand bewusst gewählt hat
        seo += ("<script>try{if(!localStorage.getItem('pa_lang')){var l=((navigator.languages&&navigator.languages[0])||navigator.language||'').slice(0,2).toLowerCase();"
                "if(['en','es','fr','pt','it'].indexOf(l)>=0)location.replace('./'+l+'/');}}catch(e){}</script>\n")
    vals = {'LANG': lang, 'LANGCODE': lang.upper(), 'P': P, 'LANGMENU': menu, 'LANGLINKS': foot, 'SEO': seo.rstrip('\n'),
            'OGIMG': BASE + ('og-image.png' if lang == 'de' else f'og-image-{lang}.png')}
    for k, v in T.items(): vals[k] = v[lang]
    out = re.sub(r'\{\{(\w+)\}\}', lambda m: vals[m.group(1)], s)
    assert '{{' not in out
    dest = os.path.join(SITE, 'index.html') if lang == 'de' else os.path.join(SITE, lang, 'index.html')
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, 'w', encoding='utf8').write(out)
    print(lang, len(out))
