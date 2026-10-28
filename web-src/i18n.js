/* ============ Sprachen (Oberfläche) ============
   Schlüssel ohne Übersetzung fallen auf Englisch, dann Deutsch zurück.
   {name} = Platzhalter. Werte mit HTML werden über data-i18n-html gesetzt. */
const UI_LANGS=[['de','Deutsch'],['en','English'],['es','Español'],['fr','Français'],['pt','Português'],['it','Italiano']];
const SR_DEFAULT={de:'de-DE',en:'en-US',es:'es-ES',fr:'fr-FR',pt:'pt-BR',it:'it-IT'};
const I18N={
de:{
  homeHint:'Sprachgesteuerter Teleprompter · keine Zeichenbegrenzung · kein Konto · kein Wasserzeichen. Tippe ein Skript an, um zu starten.',
  newScript:'Neues Skript', loadScript:'Skript laden', settings:'Einstellungen',
  empty:'Noch keine Skripte.<br>Tippe auf „Neues Skript“, um loszulegen.', untitled:'Ohne Titel',
  meta:'{w} Wörter · ca. {m} Min.', imported:'Skript importiert',
  back:'Zurück', titlePh:'Titel des Skripts', del:'Löschen', confirmDelete:'Dieses Skript wirklich löschen?',
  textPh:'Schreib oder füge hier deinen Text ein …\n\nTipps:\n**fett** hebt Wörter hervor.\n<Text in spitzen Klammern> wird von der Spracherkennung übersprungen (z. B. Regieanweisungen).',
  speak:'Vorlesen', exportBtn:'Export', promptBtn:'Prompten',
  stats:'{c} Zeichen · {w} Wörter · ca. {t} Min. Sprechzeit',
  playPause:'Start/Pause', slower:'Langsamer', faster:'Schneller', mic:'Sprachsteuerung', rec:'Aufnahme',
  cam:'Kamera', flip:'Kamera wechseln', mirror:'Spiegeln', restart:'Zum Anfang',
  speedToast:'Tempo: {v}', endOfScript:'Ende des Skripts', backToStart:'Zurück zum Anfang',
  voiceFollowOn:'Der Text folgt jetzt deiner Stimme', voiceWaiting:'wartet', voicePaused:'angehalten', voiceJump:'Weiter ab diesem Wort', voiceCmdOn:'Sprachbefehle aktiv: {cmds}',
  srUnsupported:'Spracherkennung wird von diesem Browser nicht unterstützt. Bitte Chrome verwenden.',
  micDenied:'Mikrofon-Zugriff verweigert. Bitte in den Einstellungen erlauben.',
  camDenied:'Kamera-Zugriff verweigert. Bitte in den Einstellungen erlauben.',
  camBusy:'Kamera ist belegt – bitte andere Kamera-Apps schließen.', camNone:'Keine Kamera gefunden.',
  camFail:'Kamera konnte nicht gestartet werden.', camNoAudio:'Kamera läuft – Video ohne Ton (Mikrofon nicht verfügbar).',
  recUnsupported:'Videoaufnahme wird hier nicht unterstützt.', recFail:'Aufnahme konnte nicht gestartet werden.',
  recStarted:'Aufnahme läuft', videoSaving:'Video wird gespeichert …', videoSavedWeb:'Video gespeichert (Downloads)',
  saved_video:'Video gespeichert: Filme/PromptAir', saved_text:'Gespeichert: Downloads/PromptAir', save_failed:'Speichern fehlgeschlagen.',
  export_ok:'Skript gespeichert', export_failed:'Export fehlgeschlagen.',
  sr_offline:'Spracherkennung läuft offline auf dem Gerät.', sr_online:'Offline-Sprachpaket fehlt – Spracherkennung läuft über den Google-Dienst (online).',
  sr_missing:'Keine Spracherkennung auf diesem Gerät verfügbar.',
  uiLang:'Sprache der App', langAuto:'Automatisch (Gerät)',
  speed:'Geschwindigkeit', fontSize:'Schriftgröße', lineHeight:'Zeilenabstand', margin:'Seitenrand', guidePos:'Leselinie (Position)',
  textColor:'Textfarbe', bgColor:'Hintergrund', fontFamily:'Schriftart', fontStd:'Standard', fontSerif:'Serif', fontNarrow:'Schmal', fontMono:'Mono',
  align:'Ausrichtung', alignLeft:'Links', alignCenter:'Zentriert',
  mirrorH:'Horizontal spiegeln (Rig)', mirrorV:'Vertikal spiegeln', guideShow:'Leselinie anzeigen', focusDim:'Fokus-Abdunklung oben/unten',
  loop:'Am Ende von vorn beginnen', keepAwake:'Display wachhalten', countdown:'Countdown vor Start',
  srLang:'Sprache (Erkennung)', srAuto:'Wie App-Sprache', voiceMode:'Sprachmodus', vmFollow:'Text folgt der Stimme', vmCommands:'Sprachbefehle',
  voiceSub:'„Text folgt der Stimme“: PromptAir hört mit und scrollt automatisch dorthin, wo du gerade liest. Sprichst du frei (z. B. eine Anekdote), bleibt der Text stehen und läuft weiter, sobald du wieder im Text bist. Tippe auf ein Wort, um dort fortzufahren. „Sprachbefehle“: sag {cmds}.',
  camOpacity:'Text-Deckkraft im Kameramodus',
  helpTitle:'Bedienung',
  helpPad:'<b>Steuerkreuz:</b> Mitte = Start/Pause · oben (▲▲) = langsamer · unten (▼▼) = schneller · links = Mikrofon an/aus · rechts = Aufnahme (schaltet die Kamera bei Bedarf ein). Links daneben: Einstellungen und Zum Anfang · rechts daneben: Kamera, Kamera wechseln, Spiegeln.',
  helpBackApp:'<b>Zurück ins Menü:</b> Wischgeste vom Bildschirmrand (Android-Zurück).',
  helpBackWeb:'<b>Zurück ins Menü:</b> Zurück-Taste links oder <kbd>Esc</kbd>.',
  helpTouch:'<b>Tippen</b> auf den Text = Start/Pause · <b>Zwei Finger ziehen</b> = Schriftgröße · <b>Wischen</b> = manuell scrollen.',
  helpKeys:'<b>Fernbedienung/Tastatur:</b> <kbd>Leertaste</kbd> Start/Pause · <kbd>↑</kbd> langsamer · <kbd>↓</kbd> schneller · <kbd>←</kbd><kbd>→</kbd> springen · <kbd>Pos1</kbd> Anfang · <kbd>M</kbd> spiegeln. Bluetooth-Presenter (Bild↑/Bild↓) werden unterstützt.',
  helpScript:'<b>Im Skript:</b> **fett** für Betonung, &lt;spitze Klammern&gt; für Text, den die Spracherkennung ignoriert.',
  helpRec:'<b>Aufnahme:</b> rechts auf dem Steuerkreuz. Das Video wird ohne Prompter-Text aufgenommen und nach dem Stopp gespeichert (App: Filme/PromptAir).',
  legalTitle:'Rechtliches', imprint:'Impressum', privacy:'Datenschutz', licenses:'Lizenzen', version:'Version', close:'Schließen',
  permClose:'Schließen', permRetry:'Erneut versuchen',
  permInsecureT:'Mikrofon: sichere Verbindung nötig',
  permInsecureH:'<p>Diese Seite wurde nicht über https geöffnet. Browser geben das Mikrofon nur auf sicheren Seiten frei.</p><p>Öffne PromptAir über <b>https://silverapplications.com/apps/promptair/</b> – oder nutze die Android-App.</p>',
  permDeniedT:'Mikrofon ist blockiert',
  permDeniedH:'<p>Der Browser hat den Mikrofon-Zugriff für diese Seite blockiert.</p><ol><li>Tippe in der Adressleiste auf das Symbol links neben der Adresse.</li><li>Öffne <b>Berechtigungen</b> und stelle <b>Mikrofon</b> auf <b>Zulassen</b>.</li><li>Tippe hier auf <b>Erneut versuchen</b>.</li></ol>',
  permPromptT:'Mikrofon freigeben',
  permPromptH:'<p>Gleich fragt dein Browser, ob PromptAir das Mikrofon verwenden darf. Tippe auf <b>Zulassen</b> – die Frage kommt nur einmal.</p>',
  permErrorT:'Mikrofon nicht verfügbar',
  permErrorH:'<p>Das Mikrofon konnte nicht gestartet werden. Prüfe, ob eine andere App es gerade nutzt und ob der Browser das Mikrofon verwenden darf.</p>',
  demoTitle:'Willkommen bei PromptAir',
  demoText:`Hallo und willkommen bei **PromptAir** – deinem Teleprompter ohne Limits.

Dieses Skript ist ein Beispiel. Tippe auf den Bildschirm, um zu pausieren, und ziehe mit zwei Fingern, um die Schrift zu vergrößern.

Aktiviere das Mikrofon, dann folgt der Text automatisch deiner Stimme – lies einfach in deinem eigenen Tempo weiter.

<Diese Zeile in spitzen Klammern ignoriert die Spracherkennung – perfekt für Regieanweisungen.>

In den Einstellungen findest du Geschwindigkeit, Schriftgröße, Farben, Spiegelung für ein Prompter-Rig, Countdown und mehr.

Viel Erfolg bei deiner Aufnahme!`
},
en:{
  homeHint:'Voice-controlled teleprompter · no character limit · no account · no watermark. Tap a script to start.',
  newScript:'New script', loadScript:'Load script', settings:'Settings',
  empty:'No scripts yet.<br>Tap “New script” to get started.', untitled:'Untitled',
  meta:'{w} words · approx. {m} min', imported:'Script imported',
  back:'Back', titlePh:'Script title', del:'Delete', confirmDelete:'Really delete this script?',
  textPh:'Write or paste your text here …\n\nTips:\n**bold** highlights words.\n<Text in angle brackets> is skipped by speech recognition (e.g. stage directions).',
  speak:'Read aloud', exportBtn:'Export', promptBtn:'Prompt',
  stats:'{c} characters · {w} words · approx. {t} min speaking time',
  playPause:'Play/Pause', slower:'Slower', faster:'Faster', mic:'Voice control', rec:'Record',
  cam:'Camera', flip:'Switch camera', mirror:'Mirror', restart:'Back to start',
  speedToast:'Speed: {v}', endOfScript:'End of script', backToStart:'Back to the start',
  voiceFollowOn:'The text now follows your voice', voiceWaiting:'waiting', voicePaused:'paused', voiceJump:'Continuing from this word', voiceCmdOn:'Voice commands active: {cmds}',
  srUnsupported:'This browser does not support speech recognition. Please use Chrome.',
  micDenied:'Microphone access denied. Please allow it in the settings.',
  camDenied:'Camera access denied. Please allow it in the settings.',
  camBusy:'The camera is in use – please close other camera apps.', camNone:'No camera found.',
  camFail:'The camera could not be started.', camNoAudio:'Camera on – video without sound (microphone unavailable).',
  recUnsupported:'Video recording is not supported here.', recFail:'Recording could not be started.',
  recStarted:'Recording', videoSaving:'Saving video …', videoSavedWeb:'Video saved (Downloads)',
  saved_video:'Video saved: Movies/PromptAir', saved_text:'Saved: Downloads/PromptAir', save_failed:'Saving failed.',
  export_ok:'Script saved', export_failed:'Export failed.',
  sr_offline:'Speech recognition runs offline on this device.', sr_online:'Offline language pack missing – speech recognition uses the Google service (online).',
  sr_missing:'No speech recognition available on this device.',
  uiLang:'App language', langAuto:'Automatic (device)',
  speed:'Speed', fontSize:'Font size', lineHeight:'Line spacing', margin:'Side margin', guidePos:'Reading line (position)',
  textColor:'Text colour', bgColor:'Background', fontFamily:'Font', fontStd:'Default', fontSerif:'Serif', fontNarrow:'Narrow', fontMono:'Mono',
  align:'Alignment', alignLeft:'Left', alignCenter:'Centred',
  mirrorH:'Mirror horizontally (rig)', mirrorV:'Mirror vertically', guideShow:'Show reading line', focusDim:'Focus dimming top/bottom',
  loop:'Start over at the end', keepAwake:'Keep screen on', countdown:'Countdown before start',
  srLang:'Language (recognition)', srAuto:'Same as app language', voiceMode:'Voice mode', vmFollow:'Text follows voice', vmCommands:'Voice commands',
  voiceSub:'“Text follows voice”: PromptAir listens and scrolls to where you are reading. If you speak freely (an anecdote, say), the text stays put and moves on once you are back in the script. Tap a word to continue from there. “Voice commands”: say {cmds}.',
  camOpacity:'Text opacity in camera mode',
  helpTitle:'How to use',
  helpPad:'<b>Control pad:</b> centre = play/pause · up (▲▲) = slower · down (▼▼) = faster · left = microphone on/off · right = record (turns the camera on if needed). To the left: settings and back to start · to the right: camera, switch camera, mirror.',
  helpBackApp:'<b>Back to the menu:</b> swipe from the screen edge (Android back).',
  helpBackWeb:'<b>Back to the menu:</b> back button on the left or <kbd>Esc</kbd>.',
  helpTouch:'<b>Tap</b> the text = play/pause · <b>two-finger drag</b> = font size · <b>swipe</b> = scroll manually.',
  helpKeys:'<b>Remote/keyboard:</b> <kbd>Space</kbd> play/pause · <kbd>↑</kbd> slower · <kbd>↓</kbd> faster · <kbd>←</kbd><kbd>→</kbd> jump · <kbd>Home</kbd> start · <kbd>M</kbd> mirror. Bluetooth presenters (Page↑/Page↓) are supported.',
  helpScript:'<b>In the script:</b> **bold** for emphasis, &lt;angle brackets&gt; for text the speech recognition ignores.',
  helpRec:'<b>Recording:</b> right on the control pad. The video is recorded without the prompter text and saved when you stop (app: Movies/PromptAir).',
  legalTitle:'Legal', imprint:'Legal notice', privacy:'Privacy policy', licenses:'Licenses', version:'Version', close:'Close',
  permClose:'Close', permRetry:'Try again',
  permInsecureT:'Microphone: secure connection required',
  permInsecureH:'<p>This page was not opened via https. Browsers only allow the microphone on secure pages.</p><p>Open PromptAir at <b>https://silverapplications.com/apps/promptair/</b> – or use the Android app.</p>',
  permDeniedT:'Microphone is blocked',
  permDeniedH:'<p>Your browser has blocked microphone access for this page.</p><ol><li>Tap the icon to the left of the address in the address bar.</li><li>Open <b>Permissions</b> and set <b>Microphone</b> to <b>Allow</b>.</li><li>Tap <b>Try again</b> here.</li></ol>',
  permPromptT:'Allow microphone',
  permPromptH:'<p>Your browser will ask whether PromptAir may use the microphone. Tap <b>Allow</b> – you will only be asked once.</p>',
  permErrorT:'Microphone unavailable',
  permErrorH:'<p>The microphone could not be started. Check whether another app is using it and whether the browser is allowed to use the microphone.</p>',
  demoTitle:'Welcome to PromptAir',
  demoText:`Hello and welcome to **PromptAir** – your teleprompter without limits.

This script is an example. Tap the screen to pause, and drag with two fingers to make the text larger.

Turn on the microphone and the text will follow your voice automatically – just keep reading at your own pace.

<Speech recognition ignores this line in angle brackets – perfect for stage directions.>

In the settings you will find speed, font size, colours, mirroring for a prompter rig, a countdown and more.

Good luck with your recording!`
},
es:{
  homeHint:'Teleprompter controlado por voz · sin límite de caracteres · sin cuenta · sin marca de agua. Toca un guion para empezar.',
  newScript:'Nuevo guion', loadScript:'Cargar guion', settings:'Ajustes',
  empty:'Aún no hay guiones.<br>Toca «Nuevo guion» para empezar.', untitled:'Sin título',
  meta:'{w} palabras · aprox. {m} min', imported:'Guion importado',
  back:'Atrás', titlePh:'Título del guion', del:'Eliminar', confirmDelete:'¿Eliminar este guion?',
  textPh:'Escribe o pega tu texto aquí …\n\nConsejos:\n**negrita** resalta palabras.\n<El texto entre corchetes angulares> lo omite el reconocimiento de voz (p. ej. acotaciones).',
  speak:'Leer en voz alta', exportBtn:'Exportar', promptBtn:'Prompter',
  stats:'{c} caracteres · {w} palabras · aprox. {t} min de lectura',
  playPause:'Reproducir/Pausa', slower:'Más lento', faster:'Más rápido', mic:'Control por voz', rec:'Grabar',
  cam:'Cámara', flip:'Cambiar cámara', mirror:'Reflejar', restart:'Al principio',
  speedToast:'Velocidad: {v}', endOfScript:'Fin del guion', backToStart:'Vuelta al principio',
  voiceFollowOn:'Ahora el texto sigue tu voz', voiceWaiting:'esperando', voicePaused:'en pausa', voiceJump:'Seguimos desde esta palabra', voiceCmdOn:'Comandos de voz activos: {cmds}',
  srUnsupported:'Este navegador no admite el reconocimiento de voz. Usa Chrome.',
  micDenied:'Acceso al micrófono denegado. Permítelo en los ajustes.',
  camDenied:'Acceso a la cámara denegado. Permítelo en los ajustes.',
  camBusy:'La cámara está en uso: cierra otras apps de cámara.', camNone:'No se encontró ninguna cámara.',
  camFail:'No se pudo iniciar la cámara.', camNoAudio:'Cámara activa: vídeo sin sonido (micrófono no disponible).',
  recUnsupported:'La grabación de vídeo no es compatible aquí.', recFail:'No se pudo iniciar la grabación.',
  recStarted:'Grabando', videoSaving:'Guardando vídeo …', videoSavedWeb:'Vídeo guardado (Descargas)',
  saved_video:'Vídeo guardado: Movies/PromptAir', saved_text:'Guardado: Download/PromptAir', save_failed:'Error al guardar.',
  export_ok:'Guion guardado', export_failed:'Error al exportar.',
  sr_offline:'El reconocimiento de voz funciona sin conexión en el dispositivo.', sr_online:'Falta el paquete de idioma sin conexión: se usa el servicio de Google (en línea).',
  sr_missing:'No hay reconocimiento de voz disponible en este dispositivo.',
  uiLang:'Idioma de la app', langAuto:'Automático (dispositivo)',
  speed:'Velocidad', fontSize:'Tamaño de letra', lineHeight:'Interlineado', margin:'Margen lateral', guidePos:'Línea de lectura (posición)',
  textColor:'Color del texto', bgColor:'Fondo', fontFamily:'Fuente', fontStd:'Estándar', fontSerif:'Serif', fontNarrow:'Estrecha', fontMono:'Mono',
  align:'Alineación', alignLeft:'Izquierda', alignCenter:'Centrado',
  mirrorH:'Reflejar horizontalmente (rig)', mirrorV:'Reflejar verticalmente', guideShow:'Mostrar línea de lectura', focusDim:'Oscurecer arriba/abajo',
  loop:'Volver a empezar al final', keepAwake:'Mantener pantalla encendida', countdown:'Cuenta atrás',
  srLang:'Idioma (reconocimiento)', srAuto:'Igual que la app', voiceMode:'Modo de voz', vmFollow:'El texto sigue la voz', vmCommands:'Comandos de voz',
  voiceSub:'«El texto sigue la voz»: PromptAir escucha y se desplaza hasta donde estás leyendo. Si hablas libremente (por ejemplo, una anécdota), el texto se queda quieto y sigue cuando vuelves al guion. Toca una palabra para continuar desde ahí. «Comandos de voz»: di {cmds}.',
  camOpacity:'Opacidad del texto en modo cámara',
  helpTitle:'Uso',
  helpPad:'<b>Cruceta:</b> centro = reproducir/pausa · arriba (▲▲) = más lento · abajo (▼▼) = más rápido · izquierda = micrófono sí/no · derecha = grabar (enciende la cámara si hace falta). A la izquierda: ajustes y al principio · a la derecha: cámara, cambiar cámara, reflejar.',
  helpBackApp:'<b>Volver al menú:</b> desliza desde el borde de la pantalla (atrás de Android).',
  helpBackWeb:'<b>Volver al menú:</b> botón atrás a la izquierda o <kbd>Esc</kbd>.',
  helpTouch:'<b>Tocar</b> el texto = reproducir/pausa · <b>arrastrar con dos dedos</b> = tamaño de letra · <b>deslizar</b> = desplazar a mano.',
  helpKeys:'<b>Mando/teclado:</b> <kbd>Espacio</kbd> reproducir/pausa · <kbd>↑</kbd> más lento · <kbd>↓</kbd> más rápido · <kbd>←</kbd><kbd>→</kbd> saltar · <kbd>Inicio</kbd> principio · <kbd>M</kbd> reflejar. Compatible con presentadores Bluetooth (Re Pág/Av Pág).',
  helpScript:'<b>En el guion:</b> **negrita** para enfatizar, &lt;corchetes angulares&gt; para texto que el reconocimiento ignora.',
  helpRec:'<b>Grabación:</b> a la derecha de la cruceta. El vídeo se graba sin el texto del prompter y se guarda al detenerlo (app: Movies/PromptAir).',
  legalTitle:'Información legal', imprint:'Aviso legal', privacy:'Privacidad', licenses:'Licencias', version:'Versión', close:'Cerrar',
  permClose:'Cerrar', permRetry:'Reintentar',
  permInsecureT:'Micrófono: se necesita conexión segura',
  permInsecureH:'<p>Esta página no se abrió por https. Los navegadores solo permiten el micrófono en páginas seguras.</p><p>Abre PromptAir en <b>https://silverapplications.com/apps/promptair/</b> o usa la app de Android.</p>',
  permDeniedT:'El micrófono está bloqueado',
  permDeniedH:'<p>El navegador ha bloqueado el acceso al micrófono para esta página.</p><ol><li>Toca el icono a la izquierda de la dirección.</li><li>Abre <b>Permisos</b> y pon <b>Micrófono</b> en <b>Permitir</b>.</li><li>Toca aquí <b>Reintentar</b>.</li></ol>',
  permPromptT:'Permitir el micrófono',
  permPromptH:'<p>Tu navegador preguntará si PromptAir puede usar el micrófono. Toca <b>Permitir</b>: solo se pregunta una vez.</p>',
  permErrorT:'Micrófono no disponible',
  permErrorH:'<p>No se pudo iniciar el micrófono. Comprueba si otra app lo está usando y si el navegador tiene permiso.</p>',
  demoTitle:'Bienvenido a PromptAir',
  demoText:`Hola y bienvenido a **PromptAir**, tu teleprompter sin límites.

Este guion es un ejemplo. Toca la pantalla para pausar y arrastra con dos dedos para agrandar el texto.

Activa el micrófono y el texto seguirá tu voz automáticamente: sigue leyendo a tu propio ritmo.

<El reconocimiento de voz ignora esta línea entre corchetes angulares: perfecta para acotaciones.>

En los ajustes encontrarás velocidad, tamaño de letra, colores, reflejo para un rig de prompter, cuenta atrás y mucho más.

¡Mucha suerte con tu grabación!`
},
fr:{
  homeHint:'Téléprompteur à commande vocale · sans limite de caractères · sans compte · sans filigrane. Touche un script pour commencer.',
  newScript:'Nouveau script', loadScript:'Charger un script', settings:'Réglages',
  empty:'Aucun script pour l’instant.<br>Touche « Nouveau script » pour commencer.', untitled:'Sans titre',
  meta:'{w} mots · env. {m} min', imported:'Script importé',
  back:'Retour', titlePh:'Titre du script', del:'Supprimer', confirmDelete:'Supprimer vraiment ce script ?',
  textPh:'Écris ou colle ton texte ici …\n\nAstuces :\n**gras** met des mots en valeur.\n<Le texte entre chevrons> est ignoré par la reconnaissance vocale (p. ex. indications scéniques).',
  speak:'Lire', exportBtn:'Exporter', promptBtn:'Prompter',
  stats:'{c} caractères · {w} mots · env. {t} min de parole',
  playPause:'Lecture/Pause', slower:'Plus lent', faster:'Plus rapide', mic:'Commande vocale', rec:'Enregistrer',
  cam:'Caméra', flip:'Changer de caméra', mirror:'Miroir', restart:'Au début',
  speedToast:'Vitesse : {v}', endOfScript:'Fin du script', backToStart:'Retour au début',
  voiceFollowOn:'Le texte suit maintenant ta voix', voiceWaiting:'en attente', voicePaused:'en pause', voiceJump:'On reprend à ce mot', voiceCmdOn:'Commandes vocales actives : {cmds}',
  srUnsupported:'Ce navigateur ne prend pas en charge la reconnaissance vocale. Utilise Chrome.',
  micDenied:'Accès au micro refusé. Autorise-le dans les réglages.',
  camDenied:'Accès à la caméra refusé. Autorise-le dans les réglages.',
  camBusy:'La caméra est occupée – ferme les autres apps caméra.', camNone:'Aucune caméra trouvée.',
  camFail:'Impossible de démarrer la caméra.', camNoAudio:'Caméra active – vidéo sans son (micro indisponible).',
  recUnsupported:'L’enregistrement vidéo n’est pas pris en charge ici.', recFail:'Impossible de démarrer l’enregistrement.',
  recStarted:'Enregistrement', videoSaving:'Enregistrement de la vidéo …', videoSavedWeb:'Vidéo enregistrée (Téléchargements)',
  saved_video:'Vidéo enregistrée : Movies/PromptAir', saved_text:'Enregistré : Download/PromptAir', save_failed:'Échec de l’enregistrement.',
  export_ok:'Script enregistré', export_failed:'Échec de l’export.',
  sr_offline:'La reconnaissance vocale fonctionne hors ligne sur l’appareil.', sr_online:'Pack de langue hors ligne manquant – la reconnaissance utilise le service Google (en ligne).',
  sr_missing:'Aucune reconnaissance vocale disponible sur cet appareil.',
  uiLang:'Langue de l’app', langAuto:'Automatique (appareil)',
  speed:'Vitesse', fontSize:'Taille du texte', lineHeight:'Interligne', margin:'Marge latérale', guidePos:'Ligne de lecture (position)',
  textColor:'Couleur du texte', bgColor:'Arrière-plan', fontFamily:'Police', fontStd:'Standard', fontSerif:'Serif', fontNarrow:'Étroite', fontMono:'Mono',
  align:'Alignement', alignLeft:'Gauche', alignCenter:'Centré',
  mirrorH:'Miroir horizontal (rig)', mirrorV:'Miroir vertical', guideShow:'Afficher la ligne de lecture', focusDim:'Assombrir haut/bas',
  loop:'Recommencer à la fin', keepAwake:'Garder l’écran allumé', countdown:'Compte à rebours',
  srLang:'Langue (reconnaissance)', srAuto:'Comme la langue de l’app', voiceMode:'Mode vocal', vmFollow:'Le texte suit la voix', vmCommands:'Commandes vocales',
  voiceSub:'« Le texte suit la voix » : PromptAir écoute et défile jusqu’à l’endroit où tu lis. Si tu parles librement (une anecdote, par ex.), le texte reste en place et repart dès que tu reviens au script. Touche un mot pour reprendre à cet endroit. « Commandes vocales » : dis {cmds}.',
  camOpacity:'Opacité du texte en mode caméra',
  helpTitle:'Utilisation',
  helpPad:'<b>Croix directionnelle :</b> centre = lecture/pause · haut (▲▲) = plus lent · bas (▼▼) = plus rapide · gauche = micro on/off · droite = enregistrer (allume la caméra si besoin). À gauche : réglages et au début · à droite : caméra, changer de caméra, miroir.',
  helpBackApp:'<b>Retour au menu :</b> balaie depuis le bord de l’écran (retour Android).',
  helpBackWeb:'<b>Retour au menu :</b> bouton retour à gauche ou <kbd>Échap</kbd>.',
  helpTouch:'<b>Toucher</b> le texte = lecture/pause · <b>glisser à deux doigts</b> = taille du texte · <b>balayer</b> = défiler à la main.',
  helpKeys:'<b>Télécommande/clavier :</b> <kbd>Espace</kbd> lecture/pause · <kbd>↑</kbd> plus lent · <kbd>↓</kbd> plus rapide · <kbd>←</kbd><kbd>→</kbd> sauter · <kbd>Début</kbd> au début · <kbd>M</kbd> miroir. Les présentateurs Bluetooth (Page↑/Page↓) sont pris en charge.',
  helpScript:'<b>Dans le script :</b> **gras** pour insister, &lt;chevrons&gt; pour le texte ignoré par la reconnaissance.',
  helpRec:'<b>Enregistrement :</b> à droite de la croix. La vidéo est filmée sans le texte du prompteur et enregistrée à l’arrêt (app : Movies/PromptAir).',
  legalTitle:'Mentions légales', imprint:'Mentions légales', privacy:'Confidentialité', licenses:'Licences', version:'Version', close:'Fermer',
  permClose:'Fermer', permRetry:'Réessayer',
  permInsecureT:'Micro : connexion sécurisée requise',
  permInsecureH:'<p>Cette page n’a pas été ouverte en https. Les navigateurs n’autorisent le micro que sur des pages sécurisées.</p><p>Ouvre PromptAir sur <b>https://silverapplications.com/apps/promptair/</b> – ou utilise l’app Android.</p>',
  permDeniedT:'Le micro est bloqué',
  permDeniedH:'<p>Le navigateur a bloqué l’accès au micro pour cette page.</p><ol><li>Touche l’icône à gauche de l’adresse.</li><li>Ouvre <b>Autorisations</b> et règle <b>Micro</b> sur <b>Autoriser</b>.</li><li>Touche ici <b>Réessayer</b>.</li></ol>',
  permPromptT:'Autoriser le micro',
  permPromptH:'<p>Ton navigateur va demander si PromptAir peut utiliser le micro. Touche <b>Autoriser</b> – la question n’est posée qu’une fois.</p>',
  permErrorT:'Micro indisponible',
  permErrorH:'<p>Impossible de démarrer le micro. Vérifie qu’aucune autre app ne l’utilise et que le navigateur y est autorisé.</p>',
  demoTitle:'Bienvenue dans PromptAir',
  demoText:`Bonjour et bienvenue dans **PromptAir** – ton téléprompteur sans limites.

Ce script est un exemple. Touche l’écran pour mettre en pause et fais glisser deux doigts pour agrandir le texte.

Active le micro et le texte suivra automatiquement ta voix – continue simplement à lire à ton rythme.

<La reconnaissance vocale ignore cette ligne entre chevrons – parfait pour les indications scéniques.>

Dans les réglages, tu trouveras la vitesse, la taille du texte, les couleurs, le miroir pour un rig de prompteur, un compte à rebours et plus encore.

Bonne chance pour ton enregistrement !`
},
pt:{
  homeHint:'Teleprompter controlado por voz · sem limite de caracteres · sem conta · sem marca d’água. Toque em um roteiro para começar.',
  newScript:'Novo roteiro', loadScript:'Carregar roteiro', settings:'Configurações',
  empty:'Ainda não há roteiros.<br>Toque em “Novo roteiro” para começar.', untitled:'Sem título',
  meta:'{w} palavras · aprox. {m} min', imported:'Roteiro importado',
  back:'Voltar', titlePh:'Título do roteiro', del:'Excluir', confirmDelete:'Excluir este roteiro?',
  textPh:'Escreva ou cole seu texto aqui …\n\nDicas:\n**negrito** destaca palavras.\n<Texto entre colchetes angulares> é ignorado pelo reconhecimento de voz (ex.: rubricas).',
  speak:'Ler em voz alta', exportBtn:'Exportar', promptBtn:'Prompter',
  stats:'{c} caracteres · {w} palavras · aprox. {t} min de fala',
  playPause:'Reproduzir/Pausar', slower:'Mais devagar', faster:'Mais rápido', mic:'Controle por voz', rec:'Gravar',
  cam:'Câmera', flip:'Trocar câmera', mirror:'Espelhar', restart:'Ao início',
  speedToast:'Velocidade: {v}', endOfScript:'Fim do roteiro', backToStart:'De volta ao início',
  voiceFollowOn:'Agora o texto segue sua voz', voiceWaiting:'aguardando', voicePaused:'pausado', voiceJump:'Continuando desta palavra', voiceCmdOn:'Comandos de voz ativos: {cmds}',
  srUnsupported:'Este navegador não suporta reconhecimento de voz. Use o Chrome.',
  micDenied:'Acesso ao microfone negado. Permita nas configurações.',
  camDenied:'Acesso à câmera negado. Permita nas configurações.',
  camBusy:'A câmera está em uso – feche outros apps de câmera.', camNone:'Nenhuma câmera encontrada.',
  camFail:'Não foi possível iniciar a câmera.', camNoAudio:'Câmera ligada – vídeo sem som (microfone indisponível).',
  recUnsupported:'A gravação de vídeo não é suportada aqui.', recFail:'Não foi possível iniciar a gravação.',
  recStarted:'Gravando', videoSaving:'Salvando vídeo …', videoSavedWeb:'Vídeo salvo (Downloads)',
  saved_video:'Vídeo salvo: Movies/PromptAir', saved_text:'Salvo: Download/PromptAir', save_failed:'Falha ao salvar.',
  export_ok:'Roteiro salvo', export_failed:'Falha ao exportar.',
  sr_offline:'O reconhecimento de voz funciona offline no aparelho.', sr_online:'Pacote de idioma offline ausente – o reconhecimento usa o serviço do Google (online).',
  sr_missing:'Nenhum reconhecimento de voz disponível neste aparelho.',
  uiLang:'Idioma do app', langAuto:'Automático (aparelho)',
  speed:'Velocidade', fontSize:'Tamanho da fonte', lineHeight:'Espaçamento entre linhas', margin:'Margem lateral', guidePos:'Linha de leitura (posição)',
  textColor:'Cor do texto', bgColor:'Fundo', fontFamily:'Fonte', fontStd:'Padrão', fontSerif:'Serifa', fontNarrow:'Estreita', fontMono:'Mono',
  align:'Alinhamento', alignLeft:'Esquerda', alignCenter:'Centralizado',
  mirrorH:'Espelhar horizontalmente (rig)', mirrorV:'Espelhar verticalmente', guideShow:'Mostrar linha de leitura', focusDim:'Escurecer em cima/embaixo',
  loop:'Recomeçar no fim', keepAwake:'Manter tela ligada', countdown:'Contagem regressiva',
  srLang:'Idioma (reconhecimento)', srAuto:'Igual ao idioma do app', voiceMode:'Modo de voz', vmFollow:'Texto segue a voz', vmCommands:'Comandos de voz',
  voiceSub:'“Texto segue a voz”: o PromptAir escuta e rola até onde você está lendo. Se você falar livremente (uma anedota, por exemplo), o texto fica parado e continua quando você volta ao roteiro. Toque numa palavra para continuar dali. “Comandos de voz”: diga {cmds}.',
  camOpacity:'Opacidade do texto no modo câmera',
  helpTitle:'Como usar',
  helpPad:'<b>Direcional:</b> centro = reproduzir/pausar · cima (▲▲) = mais devagar · baixo (▼▼) = mais rápido · esquerda = microfone liga/desliga · direita = gravar (liga a câmera se necessário). À esquerda: configurações e ao início · à direita: câmera, trocar câmera, espelhar.',
  helpBackApp:'<b>Voltar ao menu:</b> deslize a partir da borda da tela (voltar do Android).',
  helpBackWeb:'<b>Voltar ao menu:</b> botão voltar à esquerda ou <kbd>Esc</kbd>.',
  helpTouch:'<b>Tocar</b> no texto = reproduzir/pausar · <b>arrastar com dois dedos</b> = tamanho da fonte · <b>deslizar</b> = rolar manualmente.',
  helpKeys:'<b>Controle/teclado:</b> <kbd>Espaço</kbd> reproduzir/pausar · <kbd>↑</kbd> mais devagar · <kbd>↓</kbd> mais rápido · <kbd>←</kbd><kbd>→</kbd> pular · <kbd>Home</kbd> início · <kbd>M</kbd> espelhar. Passadores Bluetooth (Page↑/Page↓) são suportados.',
  helpScript:'<b>No roteiro:</b> **negrito** para ênfase, &lt;colchetes angulares&gt; para texto que o reconhecimento ignora.',
  helpRec:'<b>Gravação:</b> à direita no direcional. O vídeo é gravado sem o texto do prompter e salvo ao parar (app: Movies/PromptAir).',
  legalTitle:'Informações legais', imprint:'Aviso legal', privacy:'Privacidade', licenses:'Licenças', version:'Versão', close:'Fechar',
  permClose:'Fechar', permRetry:'Tentar novamente',
  permInsecureT:'Microfone: conexão segura necessária',
  permInsecureH:'<p>Esta página não foi aberta via https. Os navegadores só liberam o microfone em páginas seguras.</p><p>Abra o PromptAir em <b>https://silverapplications.com/apps/promptair/</b> – ou use o app Android.</p>',
  permDeniedT:'O microfone está bloqueado',
  permDeniedH:'<p>O navegador bloqueou o acesso ao microfone para esta página.</p><ol><li>Toque no ícone à esquerda do endereço.</li><li>Abra <b>Permissões</b> e defina <b>Microfone</b> como <b>Permitir</b>.</li><li>Toque aqui em <b>Tentar novamente</b>.</li></ol>',
  permPromptT:'Permitir o microfone',
  permPromptH:'<p>Seu navegador vai perguntar se o PromptAir pode usar o microfone. Toque em <b>Permitir</b> – a pergunta aparece só uma vez.</p>',
  permErrorT:'Microfone indisponível',
  permErrorH:'<p>Não foi possível iniciar o microfone. Verifique se outro app o está usando e se o navegador tem permissão.</p>',
  demoTitle:'Bem-vindo ao PromptAir',
  demoText:`Olá e bem-vindo ao **PromptAir** – seu teleprompter sem limites.

Este roteiro é um exemplo. Toque na tela para pausar e arraste com dois dedos para aumentar o texto.

Ligue o microfone e o texto seguirá sua voz automaticamente – continue lendo no seu próprio ritmo.

<O reconhecimento de voz ignora esta linha entre colchetes angulares – perfeita para rubricas.>

Nas configurações você encontra velocidade, tamanho da fonte, cores, espelhamento para um rig de prompter, contagem regressiva e muito mais.

Boa sorte com a sua gravação!`
},
it:{
  homeHint:'Teleprompter a comando vocale · nessun limite di caratteri · nessun account · nessuna filigrana. Tocca un copione per iniziare.',
  newScript:'Nuovo copione', loadScript:'Carica copione', settings:'Impostazioni',
  empty:'Ancora nessun copione.<br>Tocca «Nuovo copione» per iniziare.', untitled:'Senza titolo',
  meta:'{w} parole · circa {m} min', imported:'Copione importato',
  back:'Indietro', titlePh:'Titolo del copione', del:'Elimina', confirmDelete:'Eliminare davvero questo copione?',
  textPh:'Scrivi o incolla qui il tuo testo …\n\nSuggerimenti:\n**grassetto** evidenzia le parole.\n<Il testo tra parentesi angolari> viene ignorato dal riconoscimento vocale (ad es. indicazioni di regia).',
  speak:'Leggi ad alta voce', exportBtn:'Esporta', promptBtn:'Prompter',
  stats:'{c} caratteri · {w} parole · circa {t} min di parlato',
  playPause:'Play/Pausa', slower:'Più lento', faster:'Più veloce', mic:'Comando vocale', rec:'Registra',
  cam:'Fotocamera', flip:'Cambia fotocamera', mirror:'Specchia', restart:'All’inizio',
  speedToast:'Velocità: {v}', endOfScript:'Fine del copione', backToStart:'Torna all’inizio',
  voiceFollowOn:'Ora il testo segue la tua voce', voiceWaiting:'in attesa', voicePaused:'in pausa', voiceJump:'Si riparte da questa parola', voiceCmdOn:'Comandi vocali attivi: {cmds}',
  srUnsupported:'Questo browser non supporta il riconoscimento vocale. Usa Chrome.',
  micDenied:'Accesso al microfono negato. Consentilo nelle impostazioni.',
  camDenied:'Accesso alla fotocamera negato. Consentilo nelle impostazioni.',
  camBusy:'La fotocamera è in uso – chiudi le altre app fotocamera.', camNone:'Nessuna fotocamera trovata.',
  camFail:'Impossibile avviare la fotocamera.', camNoAudio:'Fotocamera attiva – video senza audio (microfono non disponibile).',
  recUnsupported:'La registrazione video non è supportata qui.', recFail:'Impossibile avviare la registrazione.',
  recStarted:'Registrazione in corso', videoSaving:'Salvataggio del video …', videoSavedWeb:'Video salvato (Download)',
  saved_video:'Video salvato: Movies/PromptAir', saved_text:'Salvato: Download/PromptAir', save_failed:'Salvataggio non riuscito.',
  export_ok:'Copione salvato', export_failed:'Esportazione non riuscita.',
  sr_offline:'Il riconoscimento vocale funziona offline sul dispositivo.', sr_online:'Pacchetto lingua offline mancante – il riconoscimento usa il servizio Google (online).',
  sr_missing:'Nessun riconoscimento vocale disponibile su questo dispositivo.',
  uiLang:'Lingua dell’app', langAuto:'Automatica (dispositivo)',
  speed:'Velocità', fontSize:'Dimensione testo', lineHeight:'Interlinea', margin:'Margine laterale', guidePos:'Linea di lettura (posizione)',
  textColor:'Colore testo', bgColor:'Sfondo', fontFamily:'Carattere', fontStd:'Standard', fontSerif:'Serif', fontNarrow:'Stretto', fontMono:'Mono',
  align:'Allineamento', alignLeft:'Sinistra', alignCenter:'Centrato',
  mirrorH:'Specchia orizzontalmente (rig)', mirrorV:'Specchia verticalmente', guideShow:'Mostra linea di lettura', focusDim:'Oscura sopra/sotto',
  loop:'Ricomincia alla fine', keepAwake:'Schermo sempre acceso', countdown:'Conto alla rovescia',
  srLang:'Lingua (riconoscimento)', srAuto:'Come la lingua dell’app', voiceMode:'Modalità vocale', vmFollow:'Il testo segue la voce', vmCommands:'Comandi vocali',
  voiceSub:'«Il testo segue la voce»: PromptAir ascolta e scorre fino al punto in cui stai leggendo. Se parli liberamente (ad es. un aneddoto), il testo resta fermo e riparte quando torni al copione. Tocca una parola per continuare da lì. «Comandi vocali»: di’ {cmds}.',
  camOpacity:'Opacità del testo in modalità fotocamera',
  helpTitle:'Uso',
  helpPad:'<b>Croce direzionale:</b> centro = play/pausa · su (▲▲) = più lento · giù (▼▼) = più veloce · sinistra = microfono on/off · destra = registra (accende la fotocamera se serve). A sinistra: impostazioni e all’inizio · a destra: fotocamera, cambia fotocamera, specchia.',
  helpBackApp:'<b>Torna al menu:</b> scorri dal bordo dello schermo (indietro di Android).',
  helpBackWeb:'<b>Torna al menu:</b> pulsante indietro a sinistra o <kbd>Esc</kbd>.',
  helpTouch:'<b>Tocca</b> il testo = play/pausa · <b>trascina con due dita</b> = dimensione testo · <b>scorri</b> = scorrimento manuale.',
  helpKeys:'<b>Telecomando/tastiera:</b> <kbd>Spazio</kbd> play/pausa · <kbd>↑</kbd> più lento · <kbd>↓</kbd> più veloce · <kbd>←</kbd><kbd>→</kbd> salta · <kbd>Home</kbd> inizio · <kbd>M</kbd> specchia. Supporta i presenter Bluetooth (Pag↑/Pag↓).',
  helpScript:'<b>Nel copione:</b> **grassetto** per l’enfasi, &lt;parentesi angolari&gt; per il testo ignorato dal riconoscimento.',
  helpRec:'<b>Registrazione:</b> a destra sulla croce. Il video viene registrato senza il testo del prompter e salvato allo stop (app: Movies/PromptAir).',
  legalTitle:'Note legali', imprint:'Note legali', privacy:'Privacy', licenses:'Licenze', version:'Versione', close:'Chiudi',
  permClose:'Chiudi', permRetry:'Riprova',
  permInsecureT:'Microfono: serve una connessione sicura',
  permInsecureH:'<p>Questa pagina non è stata aperta tramite https. I browser consentono il microfono solo su pagine sicure.</p><p>Apri PromptAir su <b>https://silverapplications.com/apps/promptair/</b> – oppure usa l’app Android.</p>',
  permDeniedT:'Il microfono è bloccato',
  permDeniedH:'<p>Il browser ha bloccato l’accesso al microfono per questa pagina.</p><ol><li>Tocca l’icona a sinistra dell’indirizzo.</li><li>Apri <b>Autorizzazioni</b> e imposta <b>Microfono</b> su <b>Consenti</b>.</li><li>Tocca qui <b>Riprova</b>.</li></ol>',
  permPromptT:'Consenti il microfono',
  permPromptH:'<p>Il browser chiederà se PromptAir può usare il microfono. Tocca <b>Consenti</b> – la domanda compare una sola volta.</p>',
  permErrorT:'Microfono non disponibile',
  permErrorH:'<p>Impossibile avviare il microfono. Controlla se un’altra app lo sta usando e se il browser ha l’autorizzazione.</p>',
  demoTitle:'Benvenuto in PromptAir',
  demoText:`Ciao e benvenuto in **PromptAir** – il tuo teleprompter senza limiti.

Questo copione è un esempio. Tocca lo schermo per mettere in pausa e trascina con due dita per ingrandire il testo.

Attiva il microfono e il testo seguirà automaticamente la tua voce – continua semplicemente a leggere al tuo ritmo.

<Il riconoscimento vocale ignora questa riga tra parentesi angolari – perfetta per le indicazioni di regia.>

Nelle impostazioni trovi velocità, dimensione del testo, colori, specchiatura per un rig da prompter, conto alla rovescia e molto altro.

Buona fortuna con la tua registrazione!`
}};

/* Sprachbefehle je Erkennungssprache. Erste Form je Gruppe wird in der Hilfe angezeigt. */
const CMDS={
  de:{restart:['von vorn','von vorne','neustart','anfang'],faster:['schneller'],slower:['langsamer'],stop:['stopp','stop','pause','halt','anhalten'],start:['start','los','weiter','fortsetzen','abspielen']},
  en:{restart:['restart','start over','from the top','beginning'],faster:['faster'],slower:['slower'],stop:['stop','pause','halt','wait'],start:['start','go','play','continue','resume']},
  es:{restart:['desde el principio','reinicia','reiniciar','al principio'],faster:['más rápido','rápido'],slower:['más lento','despacio','lento'],stop:['para','parar','pausa','alto','detente'],start:['empieza','empezar','sigue','seguir','continúa','continuar','adelante']},
  fr:{restart:['recommence','recommencer','depuis le début','du début'],faster:['plus vite','accélère'],slower:['moins vite','plus lentement','ralentis','ralentir'],stop:['stop','arrête','arrêter','pause'],start:['démarre','démarrer','continue','continuer','vas-y','lecture']},
  pt:{restart:['do início','recomeça','recomeçar','reiniciar'],faster:['mais rápido'],slower:['mais devagar','devagar','mais lento'],stop:['para','parar','pare','pausa'],start:['começa','começar','continua','continuar','segue','iniciar']},
  it:{restart:['da capo','ricomincia','dall\'inizio'],faster:['più veloce','veloce'],slower:['più lento','piano','rallenta'],stop:['stop','ferma','fermati','pausa'],start:['via','inizia','continua','avanti','riprendi']}
};
