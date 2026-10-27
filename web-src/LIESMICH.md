# PromptAir – Quellen der Web-Version (Stand 1.1.0, 27.10.2026)

Aus diesen Dateien entstehen die Web-App (`promptair.html`, auch App-Asset), die Landingpages in sechs Sprachen und die Store-Grafiken.

| Datei | Zweck |
|---|---|
| `head.html`, `extra.css`, `body.html`, `i18n.js`, `app.js` | Teile der Web-App |
| `assemble.py` | baut daraus `promptair.html` |
| `index.de.src.html`, `landing_i18n.py`, `build_landing.py` | Landingpage in sechs Sprachen |
| `sa_build.py` | überträgt alles CSP-konform ins Repo von silverapplications.com (`apps/promptair/`) |
| `privacy.en.html` | englische Datenschutzerklärung |
| `store_texts.py` | Play-Store-Texte in sechs Sprachen |
| `brand/` | Logo, Feature-Grafiken, Screenshot-Skripte |

Die Skripte enthalten noch die Pfade der Claude-Arbeitsumgebung (`/home/claude/work/...`). Für das nächste Update gibt Claude sie einfach wieder dorthin zurück.
