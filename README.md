# Ritter Digital Raumbuch Auswertung

Eine moderne Web-Anwendung zur Analyse und Visualisierung von Raumbuch-Daten aus dem RdRaumbuch-System, entwickelt mit Next.js, React, TypeScript und Tailwind CSS.

## Übersicht

Diese Anwendung ermöglicht:

- Anzeigen der Raumbuch-Daten für einen ausgewählten Standort
- Filtern und Sortieren der Daten nach verschiedenen Kriterien
- Berechnung von Statistiken und Zusammenfassungen
- Visualisierung der Daten mit interaktiven Diagrammen
- Export der Daten als Excel oder PDF

## Technologie-Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Datenbank**: SQL Server mit Prisma ORM
- **Diagramme**: Chart.js mit React-Chartjs-2
- **Export**: ExcelJS für Excel, jsPDF für PDF
- **Validierung**: Zod
- **Formulare**: React Hook Form
- **Tests**: Jest, React Testing Library

## Installation

### Voraussetzungen

- Node.js 18.0.0 oder höher
- SQL Server ODBC-Treiber oder Zugriff auf eine bestehende SQL Server-Datenbank
- Git

### Schritte

1. Repository klonen:
   ```bash
   git clone https://github.com/damjan1996/RitterAuswertung.git
   cd RDAuswertung
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

3. Umgebungsvariablen konfigurieren:
    - Kopiere `.env.example` zu `.env`
    - Passe die Datenbankverbindungsparameter und andere Einstellungen an

4. Prisma ORM initialisieren:
   ```bash
   npm run db:generate
   ```

5. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

Die Anwendung ist dann unter http://localhost:3000 erreichbar.

## Projekt-Struktur

```
RDAuswertung/
├── .github/            # GitHub Actions Konfigurationen
├── .husky/             # Git Hooks für Qualitätssicherung
├── .vscode/            # VSCode Konfigurationen
├── prisma/             # Prisma Schema und Migrations
├── public/             # Statische Dateien
├── src/                # Quellcode
│   ├── app/            # Next.js App Router
│   │   ├── api/        # API Routes
│   │   ├── (dashboard) # Dashboard Layout
│   │   ├── standorte/  # Standorte Seiten
│   │   ├── report/     # Report Seiten
│   │   └── export/     # Export Seiten
│   ├── components/     # React Komponenten
│   │   ├── ui/         # UI Komponenten
│   │   ├── charts/     # Diagramm-Komponenten
│   │   ├── forms/      # Formular-Komponenten
│   │   ├── layout/     # Layout-Komponenten
│   │   └── raumbuch/   # Raumbuch-spezifische Komponenten
│   ├── config/         # Konfigurationsdateien
│   ├── hooks/          # React Hooks
│   ├── lib/            # Hilfsfunktionen
│   ├── models/         # Datenmodelle
│   ├── schemas/        # Validierungsschemas
│   ├── services/       # Services für API-Zugriff und Datenverarbeitung
│   │   ├── analysis/   # Datenanalyse
│   │   ├── database/   # Datenbankzugriff
│   │   └── export/     # Export-Funktionalität
│   ├── styles/         # CSS-Styles
│   └── types/          # TypeScript-Typdefinitionen
└── tests/              # Tests
    ├── unit/           # Unit-Tests
    ├── integration/    # Integrationstests
    └── e2e/            # End-to-End Tests
```

## Verwendung

### Standort auswählen

Auf der Startseite können Sie einen Standort aus der Dropdown-Liste auswählen, um die entsprechenden Raumbuch-Daten anzuzeigen.

### Daten filtern

Verwenden Sie die Filter über der Tabelle, um die Daten nach verschiedenen Kriterien zu filtern:
- Bereich
- Gebäudeteil
- Etage
- Reinigungsgruppe

### Daten visualisieren

Die Anwendung zeigt automatisch Diagramme basierend auf den gefilterten Daten:
- Verteilung nach Bereichen (Tortendiagramm)
- Kosten nach Reinigungsgruppe (Balkendiagramm)
- Arbeitsstunden nach Etage (Balkendiagramm)

### Daten exportieren

Nutzen Sie die Export-Buttons, um die Daten als Excel- oder PDF-Datei zu exportieren.

## Entwicklung

### Verfügbare Scripts

- `npm run dev`: Startet den Entwicklungsserver
- `npm run build`: Erstellt eine produktionsreife Version
- `npm run start`: Startet die produktionsreife Version
- `npm run lint`: Führt ESLint aus
- `npm run format`: Formatiert den Code mit Prettier
- `npm run test`: Führt Tests aus
- `npm run type-check`: Überprüft TypeScript-Typen
- `npm run db:generate`: Generiert Prisma Client
- `npm run db:migrate`: Führt Datenbankmigrationen aus

### Codequalität

Das Projekt verwendet:
- ESLint für Codelinting
- Prettier für Codeformatierung
- TypeScript für Typsicherheit
- Husky und lint-staged für Pre-Commit-Hooks
- Jest und React Testing Library für Tests

## Fehlerbehebung

### Datenbankverbindungsprobleme

- Stellen Sie sicher, dass die Datenbankverbindungsparameter in `.env` korrekt sind
- Überprüfen Sie, ob der SQL Server erreichbar ist und ODBC-Verbindungen akzeptiert
- Prüfen Sie, ob die Firewall den Zugriff erlaubt

### Bekannte Probleme

- Windows-Dateinamen: Dynamische Routen in Next.js verwenden eckige Klammern wie `[id]`, die in Windows-Dateisystemen Probleme verursachen können. Das Projekt verwendet vorübergehend `_id_` in Dateinamen, die in Import-Statements durch `[id]` ersetzt werden müssen.

## Lizenz

Dieses Projekt ist proprietär und nur für die interne Verwendung bei Ritter Digital bestimmt.

## Kontakt

Bei Fragen oder Problemen wenden Sie sich an:
- Damjan Petrovic - [petrovic@ritter-digital.de](mailto:petrovic@ritter-digital.de)