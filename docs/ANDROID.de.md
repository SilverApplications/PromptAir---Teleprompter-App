# PromptAir – Android-App

Sprachgesteuerter Teleprompter. Läuft komplett lokal, ohne Konto, ohne Internet-Berechtigung.
Version **1.1.0** · Lizenz: **GPL-3.0-or-later** (siehe `LICENSE`) – seit dem Wegfall von espeak-ng nicht mehr zwingend, sondern freiwillig · © 2026 Hendrik van Triest, Silver Applications

---

## 1. Bauen und aufs Handy bringen

1. **Android Studio** installieren (aktuelle Version).
2. **Open** → den Stammordner dieses Repositorys wählen.
3. Beim ersten Öffnen lädt Studio Gradle und alle Abhängigkeiten (Internet nötig, ein paar Minuten).
   - Bietet Studio ein Update von „Android Gradle Plugin“ oder Gradle an: **ablehnen**. Das Projekt ist auf AGP 8.13 und Gradle 8.14.3 abgestimmt.
4. Handy per USB anschließen, dort **Entwickleroptionen → USB-Debugging** einschalten.
5. Oben das Gerät wählen → grüner **Run**-Pfeil.

> Die alte App (Paket `de.promptair.app`) und die neue (`com.silverapplications.promptair`)
> sind für Android zwei verschiedene Apps. Die alte am besten vorher deinstallieren.

---

## 2a. Neu in 1.1.0 (versionCode 3 – Code 2 war in der Play Console bereits vergeben)

| Bereich | Änderung |
|---|---|
| **Kamera-Fix** | `MODIFY_AUDIO_SETTINGS` wieder im Manifest (fehlte in 1.0.0 → *NotReadableError*). Bild und Ton werden getrennt behandelt: fehlt der Ton, läuft die Kamera mit Hinweis „Video ohne Ton“. Spracherkennung startet nach einer Kamera-Freigabe nicht mehr unsichtbar mit. Verständliche Fehlermeldungen. |
| **Startsequenz** | Logo wächst von Kachelgröße auf 60 % der Bildschirmbreite, metallischer Glanz + Funkeln, unten der Silver-Applications-Banner. Antippen überspringt. Der Android-12-Systemsplash ist dafür nur noch eine leere Anthrazit-Fläche. |
| **Präsentationsmodus** | Steuerkreuz wie eine DVD-Fernbedienung: Mitte Start/Pause, oben langsamer (▲▲), unten schneller (▼▼), links Mikrofon, rechts Aufnahme (schaltet Kamera bei Bedarf ein). Links daneben Einstellungen + Zum Anfang, rechts Kamera, Kamera wechseln, Spiegeln. Kein Zurück-Button in der App – Android-Wischgeste. Tastatur-Pfeile entsprechend: ↑ langsamer, ↓ schneller. |
| **Export** | Öffnet den Android-Dialog „Speichern unter“ – beliebiger Ort, beliebiger Name. Meldungen sind jetzt auf allen Bildschirmen sichtbar (vorher nur im Prompter). |
| **Startseite** | Einstellungen links unten, „Skript laden“ und „Neues Skript“ rechts unten. Impressum, Datenschutz, Lizenzen und Versionsnummer in den Einstellungen. |
| **Sprachen** | Deutsch, Englisch, Spanisch, Französisch, Portugiesisch, Italienisch – automatisch nach Gerät oder in den Einstellungen wählbar. Sprachbefehle, Beispielskript, Hilfe, native Bildschirme, Lizenzseite und Vorlese-Stimmen folgen der Sprache. Spracherkennung zusätzlich für AT/CH, MX/US, CA, PT, NL, PL, TR, RU. |

## 2. Was sich gegenüber der Vorversion geändert hat

| Bereich | Neu |
|---|---|
| Play-Store-Pflicht | `targetSdk 36` (Android 16), `compileSdk 36` |
| Mindestversion | Android 10 (`minSdk 29`) – Speichern ohne Speicher-Berechtigung |
| SynthAir | Klon-Engine, Ankerprogramm, Stimmprofil **entfernt** |
| Vorlesen | Nur noch über die Sprachausgabe des Geräts – Piper/sherpa-onnx entfernt (Lizenzfrage der Thorsten-Stimme). Kein nativer Code mehr → 16-KB-Pflicht entfällt |
| Spracherkennung | Ab Android 12 **on-device** (Audio bleibt auf dem Gerät); fehlt das deutsche Offline-Paket → Hinweis + Google-Erkenner |
| Design | Komplett im Silver-Applications-Stil: neues Logo, adaptives App-Icon (inkl. einfarbiger Android-13-Variante), Startbildschirm, scharfe Ecken, Linien-Symbole statt Emoji, IBM Plex. Kein Amber mehr. Store-Grafiken in `brand/` |
| Berechtigungen | `INTERNET` entfernt; Paket-Sichtbarkeit für Spracherkennung/-ausgabe ergänzt (ohne die ging die Erkennung ab Android 11 nicht zuverlässig) |

### Behobene WebView-Lücken
Diese Funktionen liefen im Browser, in der alten App aber **still ins Leere**:

- **Video speichern** – landet jetzt in *Filme/PromptAir*, wird schon während der Aufnahme stückweise geschrieben (kein Speicherüberlauf bei langen Takes)
- **Skript exportieren** – landet in *Downloads/PromptAir*
- **Skript importieren** – öffnet die Dateiauswahl
- **Bildschirm wachhalten** und **Vollbild** – jetzt nativ
- **Zurück-Taste** – schließt Einstellungen / verlässt den Prompter, statt die App zu beenden
- **Impressum/Datenschutz** – öffnen im Browser statt ins Leere

Neu in der App (im Web ausgeblendet): **Vorlesen** im Editor und **Lizenzen** auf der Startseite.

---

## 3. Projektstruktur

```
app/src/main/assets/
  promptair.html                         Prompter (identisch mit der Web-Version)
  licenses.html                          Lizenzen & Quellcode-Hinweis (GPL-Pflicht)
app/src/main/java/de/promptair/app/
  MainActivity.kt                        WebView-Host, Berechtigungen, Zurück-Taste, Datei-Import
  SpeechBridge.kt                        Spracherkennung (on-device → Fallback)
  AppBridge.kt                           Speichern, Wachhalten, Vollbild, Unterseiten
  SpeakActivity.kt                       Vorlesen + WAV-Export
  LicensesActivity.kt                    Lizenzseite
  tts/TtsEngine.kt                       Engine-Schnittstelle + System-Sprachausgabe
```

Weitere Sprach-Engine (z. B. eine kommerziell lizenzierte Stimme): neue Klasse, die `TtsEngine`
implementiert, und in `SpeakActivity` zur Stimmenliste hinzufügen.

---

## 4. Vor dem ersten Upload in den Play Store – Checkliste

- [ ] **applicationId festlegen** (`app/build.gradle.kts`): aktuell `com.silverapplications.promptair`.
      Nach dem ersten Upload **nie wieder änderbar**.
- [ ] **Quellcode veröffentlichen** (GPL-Pflicht) und den Link in
      `assets/licenses.html` (Abschnitt „Quellcode“) prüfen. Voreingestellt:
      `github.com/SilverApplications/promptair`.
- [ ] **Datenschutzerklärung** aktualisieren (Spracherkennung on-device/Google, keine Internet-Berechtigung).
- [ ] **Signierschlüssel** anlegen: *Build → Generate Signed App Bundle* → neuen Keystore erstellen.
      Keystore-Datei + Passwörter **sicher aufbewahren** (nicht ins Git-Repo!). Play App Signing aktivieren.
- [ ] **AAB bauen** (nicht APK): *Build → Generate Signed App Bundle → release*.
- [ ] Play Console: Datensicherheit-Formular, Inhaltseinstufung, Store-Eintrag – Icon und Feature-Grafik liegen fertig in `brand/play-store/`, Screenshots (mind. 2) vom Gerät machen.
- [ ] **Geschlossener Test**: 12 Tester, 14 Tage am Stück.

---

## 5. Testplan auf dem Gerät (kurz)

1. **App starten** → Startsequenz: Logo wächst, Glanz, Funkeln, Banner unten; Antippen überspringt.
2. Neues Skript → Prompten → **links** Mikrofon: Meldung „offline“ oder „online“, Text folgt der Stimme.
3. **Rechts** Aufnahme (Kamera aus): Kamera geht an, Aufnahme läuft **mit Ton**; erneut tippen → Video in der Galerie unter *PromptAir*, mit Ton abspielen.
4. Mikrofon **an** lassen und Kamera starten: Kamera muss laufen (ggf. Hinweis „Video ohne Ton“).
5. **Oben/unten** auf dem Steuerkreuz: langsamer/schneller, Tempo-Meldung erscheint.
6. Android-**Wischgeste zurück** im Prompter → Editor; nochmal → Startseite.
7. Editor → **Export** → „Speichern unter“-Dialog → Ordner wählen → Meldung „Skript gespeichert“ → Datei vorhanden?
8. Startseite → **Skript laden** → .txt wählen → Skript erscheint?
9. Einstellungen → **Sprache** auf Englisch/Spanisch → Oberfläche, Hilfe und Sprachbefehle wechseln; Vorlesen zeigt Stimmen der Erkennungssprache; Lizenzen in derselben Sprache.
10. Einstellungen → ganz unten: Impressum/Datenschutz öffnen im Browser, Lizenzen in der App, Version 1.1.0.
11. Handy drehen während des Promptens → Steuerkreuz passt ins Querformat, Position bleibt.
