# PromptAir
Teleprompter mit Sprachsteuerung und Kamera. Keine Zeichenbegrenzung, kein Konto, kein Wasserzeichen. Ankerprogramm für deine synthetische Stimme (SynthAir). Web-App oder native Android-App mit vollständiger Offline-Unterstützung.


# SynthAir – Konzeptdokument

**Modul für PromptAir · Stand: 9. Juli 2026 · Status: Entscheidungsvorlage**

---

## 1. Ziel und Idee

SynthAir erweitert PromptAir um eine synthetische Wiedergabe der Anwenderstimme. Nach einem einmaligen, geführten Ankerprogramm von maximal fünf Minuten kann die App beliebige Texte – und langfristig ganze PowerPoint-Präsentationen – in der Stimme des Nutzers vortragen. Der Vortrag soll in zwei Stilen möglich sein: als sauber vorgetragener Text und als „freie Rede" mit natürlichen Pausen, Füllwörtern und kleinen Selbstkorrekturen. Zusätzlich liefert die App zwei vorinstallierte Stimmen (eine männliche, eine weibliche) mit, die ohne Ankerprogramm sofort nutzbar sind. Das Stimmprofil des Nutzers verbleibt auf dem Gerät und steht nach jedem Neustart der App wieder zur Verfügung.

## 2. Nutzererlebnis

Der Nutzer öffnet SynthAir zum ersten Mal und wird durch das Ankerprogramm geführt. Die App prüft zunächst die Aufnahmebedingungen (Umgebungslautstärke, Mikrofonpegel, Übersteuerung) und gibt Rückmeldung, bevor die eigentliche Aufnahme beginnt. Danach liest der Nutzer nacheinander etwa fünfzehn kurze, phonetisch ausgewogene Sätze vor, die zusammen alle deutschen Laute, typische Satzmelodien (Aussage, Frage, Ausruf) und Zahlen abdecken. Es folgen ein bis zwei Minuten freies Sprechen zu einer einfachen Frage („Erzähl von deinem letzten Urlaub"), damit das System den natürlichen Sprechrhythmus, das Tempo und die typischen Pausen des Nutzers einfängt. Den Abschluss bildet ein gesprochener Einverständnissatz: „Ich, [Name], erstelle hiermit ein synthetisches Abbild meiner eigenen Stimme und stimme dessen Nutzung in dieser App zu." Dieser Satz ist nicht nur rechtliche Absicherung, sondern zugleich technische Hürde gegen das Klonen fremder Stimmen, denn er muss live und passend zur restlichen Aufnahme gesprochen werden.

Nach dem Ankerprogramm wählt der Nutzer bei jeder Wiedergabe die Stimme (eigene, Mann, Frau), den Stil (Vortrag oder freie Rede) und das Tempo. Der erzeugte Vortrag lässt sich direkt abspielen, mit dem Prompter synchronisieren oder als Audiodatei exportieren.

## 3. Architektur

SynthAir gliedert sich in sechs Module, die bewusst über eine gemeinsame Schnittstelle entkoppelt sind, damit die Sprachsynthese-Engine später austauschbar bleibt.

Das **Aufnahmemodul** führt das Ankerprogramm durch, misst die Aufnahmequalität (Signal-Rausch-Abstand, Clipping, Mindestlänge pro Satz) und fordert bei schlechter Qualität gezielt Wiederholungen an. Das Rohmaterial wird als unkomprimiertes WAV mit 24 kHz oder höher gespeichert – das ist der wertvollste Datenbestand des ganzen Systems und sollte auch dann aufbewahrt werden, wenn die erste Klon-Generation nur einen Teil davon nutzt, denn jedes zukünftige, bessere Modell kann daraus ein besseres Profil errechnen.

Der **Profilspeicher** verwaltet die Stimmprofile. Ein Profil besteht aus den Rohaufnahmen, dem daraus errechneten Stimm-Embedding beziehungsweise den Modellgewichten sowie Metadaten (Erstellungsdatum, verwendete Engine, Einverständnisnachweis). Gespeichert wird ausschließlich lokal im privaten App-Verzeichnis, verschlüsselt mit einem Schlüssel aus dem Android Keystore, sodass selbst ein Auslesen des Dateisystems das Profil nicht preisgibt.

Die **Synthese-Engine** ist als austauschbare Schicht angelegt. Sie erhält vorbereiteten Text mit Steuerzeichen und liefert Audio. Dahinter können, je nach Ausbaustufe, unterschiedliche Backends stehen (siehe Abschnitt 4).

Der **Textprozessor** bereitet Eingaben für die Engine auf: Er löst Zahlen, Abkürzungen und Datumsangaben in Sprechform auf, setzt Pausen an Satz- und Absatzgrenzen und wendet im Stil „freie Rede" die Disfluenz-Stufe an (Abschnitt 6).

Der **PPT-Parser** extrahiert aus .pptx-Dateien die Notizen (bevorzugt) oder die Folientexte, ordnet sie den Folien zu und erzeugt daraus ein Vortragsskript mit Folienwechsel-Markern. Technisch ist das Routine; .pptx ist ein offenes ZIP/XML-Format.

Der **Player** spielt die Synthese ab, zeigt den mitgesprochenen Text im Prompter an und kann pro Folie pausieren.

## 4. Engine-Optionen im Vergleich

Hier liegt die zentrale Konzeptentscheidung, und hier liegen auch die harten Grenzen. Der Markt kennt drei Wege:

| Weg | Beispiele | Qualität Klon | Läuft offline auf dem Handy | Profil bleibt lokal | Kosten | Haken |
|---|---|---|---|---|---|---|
| A. On-Device, kleine Modelle | Piper / sherpa-onnx (VITS) | Kein echtes Cloning, aber sehr gute Fertigstimmen | Ja, flüssig | Ja | Einmalig, keine laufenden | Eigene Stimme nur per aufwendigem Training am PC |
| B. On-Device, große Klonmodelle | XTTS-v2, F5-TTS, OpenVoice, StyleTTS 2 | Gut bis sehr gut | Grenzwertig: 1–3 GB Modell, langsam ohne GPU/NPU, auf Oberklasse-Geräten teils nutzbar | Ja | Keine laufenden | Latenz, Akkuverbrauch, Lizenz teils nicht kommerziell (XTTS: CPML) |
| C. Cloud-API | ElevenLabs, Azure Personal/Custom Neural Voice, Play.ht | Referenzklasse, inkl. natürlicher Betonung | Nein, Internet nötig | Nein – Profil liegt beim Anbieter | Laufend (Abo/Nutzung) | Widerspricht der Anforderung „verbleibt beim User"; Anbieter verlangen ohnehin Einverständnisnachweise |

Die ehrliche Konsequenz: „High-End-Klon" und „vollständig lokal auf einem heutigen Android-Gerät" schließen sich noch weitgehend aus. Apple löst das bei „Personal Voice" nur durch nächtelanges Training auf eigenen Neural-Chips; ein Android-Gegenstück existiert nicht. Realistisch für SynthAir ist ein **Hybrid mit lokalem Schwerpunkt**: Die beiden vorinstallierten Stimmen laufen vollständig offline über Weg A (Piper-Stimmen in Deutsch, je eine männliche und weibliche, zusammen unter 200 MB). Für die eigene Stimme wird das Ankerprogramm sofort umgesetzt und lokal gespeichert; die Synthese der eigenen Stimme startet zunächst mit Weg B auf leistungsfähigen Geräten (mit klarer Kennzeichnung „experimentell, Erzeugung dauert einige Sekunden pro Satz") und optional – nur nach ausdrücklicher Zustimmung – mit Weg C für maximale Qualität. Da die Rohaufnahmen lokal vorliegen, kann der Nutzer jederzeit zwischen den Wegen wechseln oder von zukünftigen, besseren On-Device-Modellen profitieren, ohne das Ankerprogramm zu wiederholen.

## 5. Das Ankerprogramm im Detail

Fünf Minuten sind ein guter Kompromiss – üblich sind in der Branche zwischen dreißig Sekunden (Zero-Shot, hörbar generisch) und dreißig Minuten (Fine-Tuning, sehr authentisch). Der Ablauf: dreißig Sekunden Umgebungs- und Pegelprüfung, etwa drei Minuten vorgelesene Sätze (phonetisch ausgewogen, mit Frage-, Ausrufe- und Zahlensätzen), neunzig Sekunden freie Rede, fünfzehn Sekunden Einverständnissatz. Die App bewertet jede Aufnahme sofort und markiert Sätze zur Wiederholung, statt am Ende alles zu verwerfen. Wichtig für die spätere Qualität: ruhiger Raum, konstanter Abstand zum Mikrofon, keine Bluetooth-Headsets (deren Kompression verdirbt das Material), Aufnahme über das eingebaute Mikrofon oder ein kabelgebundenes Headset.

## 6. Freie Rede: Pausen, Füllwörter, Fehler

Kein verbreitetes Sprachsynthese-System erzeugt von sich aus glaubwürdige Versprecher oder Füllwörter – das ist eine echte Grenze des Stands der Technik. Üblich und wirkungsvoll ist stattdessen eine vorgelagerte **Disfluenz-Stufe im Textprozessor**: Sie streut nach konfigurierbaren Regeln „ähm", „also", kurze Wiederholungen („das ist, das ist wichtig") und Denkpausen an linguistisch plausiblen Stellen ein (vor komplexen Nebensätzen, nach Absatzbeginn) und variiert Pausenlängen zufällig leicht. Die Häufigkeit lernt die Stufe idealerweise aus der freien Rede des Ankerprogramms: Wer selten „ähm" sagt, dessen Synthese sagt es auch selten. Das Ergebnis klingt in Tests solcher Verfahren überraschend natürlich, bleibt aber ein bewusst gesetzter Effekt, kein emergentes Verhalten. Vom Nutzer eingegebene Texte lassen sich zusätzlich mit einfachen Markern steuern, etwa `[pause]`, `[pause lang]` und `[ähm]`.

## 7. Datenschutz, Recht und Missbrauchsschutz

Ein Stimmprofil ist nach DSGVO ein **biometrisches Datum** (Art. 9), also besonders schutzbedürftig – die Entscheidung, es ausschließlich lokal und verschlüsselt zu speichern, ist deshalb nicht nur Komfort, sondern die datenschutzrechtlich sauberste Lösung, weil die App-Betreiberseite nie in Kontakt mit den Daten kommt. Das eigene Stimmenklonen mit eigener Einwilligung ist unproblematisch; das Klonen fremder Stimmen verletzt dagegen das allgemeine Persönlichkeitsrecht und kann strafbar sein. Der Live-Einverständnissatz im Ankerprogramm ist daher Pflichtbestandteil, nicht Option. Branchenüblich und empfehlenswert sind darüber hinaus: ein unhörbares Audio-Wasserzeichen in allen erzeugten Dateien, damit synthetisches Audio als solches nachweisbar bleibt; eine Löschfunktion, die Profil und Rohaufnahmen rückstandsfrei entfernt; und ein Hinweistext beim Export, dass die Weitergabe synthetischer Aufnahmen als angeblich echte Aufnahmen unzulässig ist. Wird optional die Cloud-Stufe genutzt, verlangen seriöse Anbieter ohnehin eigene Verifikationen (bei ElevenLabs etwa eine Live-Sprechprobe) – die App muss dann transparent machen, dass das Profil in diesem Modus den Anbieter erreicht.

## 8. Phasenplan

**Phase 1 – Fundament (native Kotlin-App):** Prompter-Funktionen aus der Web-Version portieren, saubere System-Berechtigungsdialoge, die zwei Offline-Stimmen (Piper über sherpa-onnx) mit Wiedergabe beliebiger Texte, vollständiges Ankerprogramm mit Qualitätsprüfung und verschlüsselter lokaler Ablage. Ergebnis: sofort nutzbare Sprachwiedergabe mit zwei Stimmen, Stimmdaten des Nutzers liegen bereit.

**Phase 2 – Eigene Stimme:** Anbindung eines Klonmodells (Weg B on-device für starke Geräte, Weg C optional per Schalter). Stilwahl Vortrag/freie Rede mit erster Disfluenz-Stufe.

**Phase 3 – Präsentationen:** PPT-Parser, folienweiser Vortrag mit Prompter-Anzeige, Export als Audiodatei je Folie oder Gesamtspur, Feinschliff der Disfluenz-Stufe anhand des Ankermaterials.

Jede Phase liefert ein für sich nutzbares Produkt; kein Schritt verbaut den nächsten, weil Engine und Profilspeicher entkoppelt sind.

## 9. Offene Entscheidungen

Vor Phase 2 sind drei Fragen zu klären. Erstens die Engine-Strategie für die eigene Stimme: streng lokal (Qualität heute mittelgut, dafür kompromisslos privat), hybrid mit optionaler Cloud (beste Qualität auf Knopfdruck, Profil verlässt dann das Gerät) oder abwarten, bis On-Device-Modelle nachziehen. Zweitens die Lizenzfrage, falls die App je veröffentlicht werden soll: XTTS-v2 etwa ist nur nicht-kommerziell frei, F5-TTS und Piper sind liberaler lizenziert. Drittens der Geräteanspruch: Soll Phase 2 auch Mittelklasse-Geräte bedienen (dann eher Cloud oder kleines Modell) oder dürfen wir Oberklasse voraussetzen?

## 10. Empfehlung

Mit Phase 1 als nativer Kotlin-App beginnen. Sie löst nebenbei das Berechtigungsproblem der Web-Version endgültig, liefert die beiden Wunschstimmen sofort und offline, und das Ankerprogramm sichert das wertvolle Rohmaterial, während die Klonmodell-Landschaft, die sich derzeit schnell entwickelt, noch etwas reift. Die Engine-Entscheidung für die eigene Stimme fällt dann in Phase 2 auf Basis eines Hörvergleichs statt auf dem Papier.

