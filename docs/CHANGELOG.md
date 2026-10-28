# Änderungen

## 1.2.0 (versionCode 4) – in Arbeit

**Sprachfolge 2.0**
- Jedes erkannte Wort wird nur noch einmal ausgewertet. Bisher wurden die Zwischenergebnisse der Spracherkennung wiederholt verarbeitet, dadurch sprang der Text weit nach vorn.
- Gesucht wird nur noch in einem kleinen Fenster hinter der aktuellen Stelle (10 Wörter). Kurze Wörter wie „und“ oder „the“ zählen nur an der direkt erwarteten Stelle, und für weitere Sprünge braucht es zwei Wörter in Folge.
- Freie Rede und Anekdoten: Der Text bleibt stehen. Nach 6 unpassenden Wörtern zeigt das Display „wartet“ (Mikrofonpunkt gelb). Sobald der Redner in den Text zurückkehrt, läuft er weiter.
- Der Text bewegt sich nur vorwärts und mit begrenzter Geschwindigkeit.
- **Wort antippen**: ab diesem Wort weiterlesen. Wischen und Pfeiltasten setzen die Stelle an der Leselinie neu.
- **Start/Pause** hält das Mitlesen an bzw. setzt es an der Leselinie fort.
- Funktioniert in allen Sprachen: Akzente und Apostrophe werden beim Vergleich ignoriert.
- Sprachbefehle werden nicht mehr mehrfach ausgelöst.

**Außerdem**
- Startleiste: Lange Beschriftungen (FR/IT/PT) brechen auf schmalen Handys um.
- Editor: Die Statuszeile hat einen festen Hintergrund.
- Datenschutz-Link: In nicht-deutschen Sprachen führt er auf die englische Fassung.

## 1.1.0 (versionCode 3) – 27.10.2026
Steuerkreuz, Startsequenz, Kamera-Fix, Export mit „Speichern unter“, neue Startseite, sechs Sprachen.

## 1.0.0 (versionCode 2) – 25.10.2026
Erste Version im geschlossenen Test.
