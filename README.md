<p align="center">
  <img src="brand/logo/promptair-wordmark-dunkel.png" alt="PromptAir" width="480">
</p>

<p align="center">
  <b>Teleprompter that follows your voice.</b><br>
  No account · no character limit · no watermark · no internet permission
</p>

<p align="center">
  <a href="https://silverapplications.com/apps/promptair/en/">Website</a> ·
  <a href="https://silverapplications.com/apps/promptair/app/">Web app</a> ·
  <a href="https://silverapplications.com/apps/promptair/en/privacy/">Privacy</a> ·
  <a href="#deutsch">Deutsch</a>
</p>

---

## English

PromptAir is a voice-controlled teleprompter for Android and the browser. While you speak, the reading line follows your words, waits when you pause and keeps up when you speed up.

### Features

- **Text follows voice** and **voice commands** (start, stop, faster, slower, restart), with on-device speech recognition from Android 12
- **Remote-style control pad** in presentation mode, Bluetooth presenter and keyboard support
- **Camera and recording** behind semi-transparent text, video saved without the overlay and without a watermark
- **Fully adjustable**: speed, font, size, line spacing, margins, colours, reading line, focus dimming, mirroring for prompter rigs, countdown, loop
- **Read aloud** with the device's offline text-to-speech, export as WAV
- **Six languages**: English, German, Spanish, French, Portuguese, Italian
- **Private by design**: the Android app has no internet permission; scripts, settings and videos stay on the device

### Repository layout

| Path | Contents |
|---|---|
| `app/` | Android app (Kotlin). A WebView hosts the prompter; native bridges handle speech recognition, saving files, text-to-speech and locale. |
| `app/src/main/assets/promptair.html` | The prompter itself, built from `web-src/` |
| `web-src/` | Sources of the web app, the six-language landing page and the store texts, plus the build scripts |
| `brand/` | Logo, icons, Play Store graphics and listing in six languages |
| `docs/ANDROID.de.md` | Build notes, project structure and device test plan (German) |

### Build

1. Open the repository root in Android Studio. Keep the Android Gradle Plugin at 8.13 and Gradle at 8.14.3 (decline upgrade prompts).
2. Run on a device with USB debugging, or build a bundle via *Build → Generate Signed App Bundle*.
3. Requirements: JDK 17 or later, compileSdk/targetSdk 36, minSdk 29 (Android 10).

The web app is a single HTML file. `web-src/assemble.py` builds it, `web-src/build_landing.py` builds the landing page. The scripts still contain the paths of the environment they were written in; adjust them before running.

### License

PromptAir is free software: you can redistribute it and/or modify it under the terms of the **GNU General Public License, version 3 or later**. See [`LICENSE`](LICENSE).
Third-party components (AndroidX, Material Components, IBM Plex fonts) keep their own licenses; the app lists them under *Settings → Licenses*.

© 2026 Hendrik van Triest, [Silver Applications](https://silverapplications.com) · Contact: info@silverapplications.com

---

## Deutsch

PromptAir ist ein sprachgesteuerter Teleprompter für Android und den Browser. Während du sprichst, folgt die Leselinie deinen Worten. Stockst du, wartet sie, beschleunigst du, zieht sie mit.

- **Funktionen:** Sprachfolge und Sprachbefehle, Steuerkreuz wie eine Fernbedienung, Kamera und Aufnahme ohne Wasserzeichen, alle gängigen Einstellungen, Vorlesen mit der Offline-Sprachausgabe, sechs Sprachen.
- **Privat by Design:** Die Android-App hat keine Internet-Berechtigung. Skripte, Einstellungen und Videos bleiben auf dem Gerät.
- **Bauen:** Repository-Stamm in Android Studio öffnen, Upgrade-Angebote für AGP und Gradle ablehnen, auf dem Gerät starten. Details in [`docs/ANDROID.de.md`](docs/ANDROID.de.md).
- **Lizenz:** GPL-3.0-or-later, siehe [`LICENSE`](LICENSE).
- **Links:** [Website](https://silverapplications.com/apps/promptair/) · [Web-App](https://silverapplications.com/apps/promptair/app/) · [Datenschutz](https://silverapplications.com/apps/promptair/datenschutz/) · [Impressum](https://silverapplications.com/apps/promptair/impressum/)

---

<sub>🤖 Developed with AI assistance: PromptAir was designed and built by Hendrik van Triest together with [Claude](https://claude.com) (Anthropic). Code, texts and graphics were reviewed and released by the author. · Entwickelt mit KI-Unterstützung durch Claude (Anthropic).</sub>
