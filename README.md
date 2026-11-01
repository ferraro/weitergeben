# Weitergeben ↘

**Oben eine Entscheidung. Unten ein ganz normaler Montag.**

Eine kleine interaktive 2D-Bürosatire über **autoritären Managementstil**.
27 Cartoon-Affen, ein Kunde und ein Banker, vier Hierarchieebenen und ein sehr zuverlässiger Dienstweg
für Druck. Der Dienstweg für Beschwerden endet dagegen in **Ablage P**.

Die Figuren und die Firma sind frei erfunden. Die Satire kritisiert einen
Führungsstil und bezieht sich auf keine reale Person oder Organisation.

## Spielen

- Auf eine Figur klicken: Führungskräfte reichen Druck weiter; beim operativen Team endet die Kaskade.
- Die Kaskade läuft nach unten: Ein Impuls an der Spitze bewirkt 2, 4 und 20 Treffer. Jeder der vier Teamleads führt fünf Teammitglieder.
- Der Kunde steht außerhalb der Hierarchie. Beim Anklicken trifft er einen zufälligen Ansprechpartner, auch den Chef. Führungskräfte geben diesen Druck weiter.
- Der Banker mit Zylinder, Monokel und Gehrock trifft ausschließlich den Chef. Von dort läuft der Druck durch die gesamte Hierarchie.
- Auch in der Automatik kommen gelegentlich Kunden- und Bankerdruck hinzu.
- Zufällige Impulse starten automatisch; die Automatik lässt sich pausieren.
  Bereits gestartete Kaskaden laufen dabei noch zu Ende.
- Drei Drucklevel regeln die Häufigkeit: Montag, Quartalsende, Restrukturierung.
- „Druck nach oben melden“ schickt Feedback auf seinen tragikomischen Dienstweg.
- „Ton an“ aktiviert drei eigens mit ElevenLabs erzeugte Cartoon-Effekte.
- ↺ setzt Treffer, laufende Kaskaden und Beschwerden zurück. Einstellungen bleiben.

## Lokal starten

Node.js 22 oder neuer, keine Installation und keine API-Schlüssel erforderlich:

```sh
git clone https://github.com/ferraro/weitergeben.git
cd weitergeben
npm start
```

Öffne http://127.0.0.1:4173 . Optional einen anderen Port mit `PORT=8080 npm start`
verwenden. Der Entwicklungsserver bindet ausschließlich an localhost.

## Technik und Tests

HTML, CSS, JavaScript-Module und selbst gezeichnete, animierbare SVG-Figuren.
Kein Framework, kein Build, keine Laufzeitabhängigkeiten, keine externen Fonts,
kein Tracking, keine Anmeldung. Sound startet aus; Browser-Tabs im Hintergrund
pausieren die Simulation. Die Darstellung berücksichtigt reduzierte Bewegung.

```sh
npm test
npm run check
```

Die Tests prüfen die Verteilung einer vollständigen Kaskade, isolierte Teilbäume
und das Ende der Weitergabe auf der untersten Ebene. Zusätzlich wurden die
Klickkaskade, Beschwerden, Reset, MP3-Wiedergabe und ein mobiler Viewport im
Browser geprüft.

Für statisches Hosting genügen `index.html`, `style.css`, `app.js`, `engine.js`,
`favicon.svg` und `assets/audio/*.mp3`. Es ist kein Backend nötig.

## Mitmachen

Issues und Pull Requests sind willkommen. Bitte die Figuren fiktiv halten und
keine realen Personen, Firmenlogos oder konkrete Arbeitgeber nachbilden.

## Lizenz und Medien

Quellcode, SVG-Grafiken und Dokumentation: [MIT](LICENSE).
Die mit ElevenLabs erzeugten Sounds sind gesondert dokumentiert:
[Herkunft und Prompts](assets/audio/README.md).

## Textvorschlag für X

> Ich habe einen kleinen Browser-Simulator über autoritären Managementstil gebaut:
> Oben ein Impuls, unten acht Bonks. Beschwerden nach oben? Landen in Ablage P. 🐒
> Fiktive Firma, Open Source: https://github.com/ferraro/weitergeben
