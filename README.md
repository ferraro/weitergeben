# Weitergeben ↘

**Oben eine Entscheidung. Unten kommt sie an.**

Eine kleine interaktive 2D-Bürosatire über **autoritären Managementstil**.
27 Cartoon-Affen, ein Kunde und ein Banker, vier Hierarchieebenen und ein sehr zuverlässiger Dienstweg
für Druck. Der Dienstweg für Beschwerden endet dagegen in **Ablage P**.

Die Figuren und die Firma sind frei erfunden. Die Satire kritisiert einen
Führungsstil und bezieht sich auf keine reale Person oder Organisation.

## Spielen

- Auf eine Führungskraft klicken: Eine volle Kaskade trifft alle im darunterliegenden Teilbaum; beim operativen Team endet die Weitergabe.
- Automatische Weitergabe hängt von der Betriebssituation ab: im Alltag überwiegend einzeln, im Quartalsendspurt häufig ganze Teams, in der Krise breite Wellen.
- Ein manueller Klick an der Spitze bewirkt dagegen 2, 4 und 20 Treffer. Jeder der vier Teamleads führt fünf Teammitglieder.
- Der Kunde steht außerhalb der Hierarchie. Beim Anklicken trifft er einen zufälligen Ansprechpartner, auch den Chef. Führungskräfte geben diesen Druck weiter.
- Der Banker mit Zylinder, Monokel und Gehrock trifft ausschließlich den Chef. Von dort wird der Druck zufällig nach unten weitergereicht.
- Auch in der Automatik kommen gelegentlich Kunden- und Bankerdruck hinzu.
- Zufällige Impulse starten automatisch; die Automatik lässt sich pausieren.
  Bereits gestartete Kaskaden laufen dabei noch zu Ende.
- Drei Betriebssituationen verändern Tempo, Auslöser und Zielverteilung: Normaler Arbeitstag, Quartalsendspurt, Krisenmodus. Beim Umschalten stoppt die alte Kaskade; die Treffer bleiben erhalten. Bei laufender Automatik zeigt ein sofortiger Beispielimpuls die neue Situation, im pausierten Zustand bleibt sie pausiert.
- „Druck nach oben melden“ schickt Feedback auf seinen tragikomischen Dienstweg.
- „Ton an“ aktiviert drei eigens mit ElevenLabs erzeugte Cartoon-Effekte.
- ↺ setzt Treffer, laufende Kaskaden und Beschwerden zurück. Einstellungen bleiben.

Die Statistik vergleicht Ø Bonks pro Person je Job-Kategorie (Treffersumme geteilt durch 1, 2, 4 bzw. 20 Personen). Die Balken verwenden diese Durchschnitte; der Gesamtzähler zählt weiterhin alle Treffer.

## Forschung und Modellannahmen

Die zweite Seite [Forschung & Quellen](forschung.html) erläutert die wissenschaftlichen Bezüge, verlinkt die Studien und dokumentiert sämtliche Ereigniswahrscheinlichkeiten als Spielannahmen. Die Demo liefert keine empirisch gemessenen Belastungswerte.

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

Die Tests prüfen manuelle Vollkaskaden, automatische Einzelwege, eindeutige Mehrfachtreffer, isolierte Teilbäume
und das Ende der Weitergabe auf der untersten Ebene. Zusätzlich wurden die
Klickkaskade, Beschwerden, Reset, MP3-Wiedergabe und ein mobiler Viewport im
Browser geprüft.

Für statisches Hosting genügen `index.html`, `style.css`, `app.js`, `engine.js`,
`forschung.html`, `favicon.svg` und `assets/audio/*.mp3`. Es ist kein Backend nötig.

## Mitmachen

Issues und Pull Requests sind willkommen. Bitte die Figuren fiktiv halten und
keine realen Personen, Firmenlogos oder konkrete Arbeitgeber nachbilden.

## Lizenz und Medien

Quellcode, SVG-Grafiken und Dokumentation: [MIT](LICENSE).
Die mit ElevenLabs erzeugten Sounds sind gesondert dokumentiert:
[Herkunft und Prompts](assets/audio/README.md).

## Textvorschlag für X

> Ich habe einen kleinen Browser-Simulator über autoritären Managementstil gebaut:
> Oben ein Klick, unten eine ganze Bonk-Kaskade. Beschwerden nach oben? Landen in Ablage P. 🐒
> Fiktive Firma, Open Source: https://github.com/ferraro/weitergeben
