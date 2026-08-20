# Wer ruft an?

Kostenloses Training für deutsche Kaltakquise-Gespräche. Die statische Web-App führt durch drei verzweigte Rollenspiele, liest Prospekt-Antworten vor und wertet Gesprächsführung regelbasiert aus.

## Starten

`index.html` direkt im Browser öffnen oder lokal ausliefern:

```sh
python3 -m http.server 8000
```

Danach `http://localhost:8000` öffnen. Keine Installation, kein Build und kein Konto nötig.

## Sprache und Datenschutz

- Texteingabe ist immer verfügbar.
- Spracherkennung nutzt `SpeechRecognition` beziehungsweise `webkitSpeechRecognition`, sofern der Browser die API anbietet und den Mikrofonzugriff erlaubt. Je nach Browser kann Audio dabei über dessen Spracherkennungsdienst verarbeitet werden.
- Prospekt-Dialoge nutzen die lokale `speechSynthesis`-Stimme des Browsers. Ohne Stimme bleibt alles lesbar.
- Antworten und Verlauf bleiben im Browser (`localStorage`). Die App selbst hat keinen Server und bindet keine bezahlte API ein.

## Minimaler Selbsttest

In der Browser-Konsole ausführen:

```js
WhosCalling.runSelfCheck()
// { passed: true, ... }
```

Der Check vergleicht starke und schwache Antworten und prüft einen Verzweigungstreffer. Syntaxcheck: `node --check app.js`.
