/**
 * Service zum Exportieren von Raumbuch-Daten nach Excel
 */

import ExcelJS from 'exceljs';

import type { RaumbuchRow, RaumbuchSummary } from '@/types/raumbuch.types';

// Use RaumbuchRow as RaumbuchEntry for consistency with the rest of the code
type RaumbuchEntry = RaumbuchRow;

/**
 * Schützt die Berechnung gegen NULL-Werte und ungültige Zahlen
 *
 * @param value - Der zu verarbeitende Wert
 * @param defaultValue - Standardwert, wenn der Wert ungültig ist
 * @returns Eine gültige Zahl oder den Standardwert
 */
function safeNumber(value: unknown, defaultValue: number = 0): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  const parsed = typeof value === 'number' ? value : parseFloat(String(value));
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Erzeugt eine Excel-Datei mit Raumbuch-Daten
 *
 * @param data - Raumbuch-Einträge
 * @param standortName - Name des Standorts
 * @param summary - Optional: Zusammenfassung der Daten
 * @returns Buffer mit der Excel-Datei
 */
export async function generateExcel(
  data: RaumbuchEntry[],
  standortName: string,
  summary?: RaumbuchSummary
): Promise<ExcelJS.Buffer> {
  // Erstelle neue Arbeitsmappe
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Ritter Digital';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Formatierungen
  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
    alignment: { horizontal: 'center', vertical: 'middle' },
  };

  const currencyFormat = '#,##0.00 €';
  const numberFormat = '#,##0.00';

  // Hauptdaten-Tabelle
  const mainSheet = workbook.addWorksheet('Raumbuchdaten');

  // Spalten definieren
  mainSheet.columns = [
    { header: 'ID', key: 'ID', width: 6 },
    { header: 'Raumnummer', key: 'Raumnummer', width: 12 },
    { header: 'Bereich', key: 'Bereich', width: 15 },
    { header: 'Gebäudeteil', key: 'Gebaeudeteil', width: 15 },
    { header: 'Etage', key: 'Etage', width: 10 },
    { header: 'Bezeichnung', key: 'Bezeichnung', width: 20 },
    { header: 'RG', key: 'RG', width: 8 },
    { header: 'qm', key: 'qm', width: 10 },
    { header: 'Anzahl', key: 'Anzahl', width: 8 },
    { header: 'Intervall', key: 'Intervall', width: 12 },
    { header: 'Rg/Jahr', key: 'RgJahr', width: 10 },
    { header: 'Rg/Monat', key: 'RgMonat', width: 10 },
    { header: 'qm/Monat', key: 'qmMonat', width: 10 },
    { header: '€/Monat', key: 'WertMonat', width: 12 },
    { header: 'h/Tag', key: 'StundenTag', width: 10 },
    { header: 'h/Monat', key: 'StundenMonat', width: 10 },
    { header: '€/Jahr', key: 'WertJahr', width: 12 },
    { header: 'qm/h', key: 'qmStunde', width: 10 },
    { header: 'Reinigungstage', key: 'Reinigungstage', width: 15 },
    { header: 'Bemerkung', key: 'Bemerkung', width: 25 },
    { header: 'Reduzierung', key: 'Reduzierung', width: 15 },
  ];

  // Header-Zeile formatieren
  const headerRow = mainSheet.getRow(1);
  headerRow.eachCell(cell => {
    Object.assign(cell, headerStyle);
  });

  // Daten hinzufügen
  data.forEach(item => {
    mainSheet.addRow({
      ID: item.ID,
      Raumnummer: item.Raumnummer,
      Bereich: item.Bereich,
      Gebaeudeteil: item.Gebaeudeteil,
      Etage: item.Etage,
      Bezeichnung: item.Bezeichnung,
      RG: item.RG,
      qm: safeNumber(item.qm),
      Anzahl: safeNumber(item.Anzahl),
      Intervall: item.Intervall,
      RgJahr: safeNumber(item.RgJahr),
      RgMonat: safeNumber(item.RgMonat),
      qmMonat: safeNumber(item.qmMonat),
      WertMonat: safeNumber(item.WertMonat),
      StundenTag: safeNumber(item.StundenTag),
      StundenMonat: safeNumber(item.StundenMonat),
      WertJahr: safeNumber(item.WertJahr),
      qmStunde: safeNumber(item.qmStunde),
      Reinigungstage: item.Reinigungstage,
      Bemerkung: item.Bemerkung,
      Reduzierung: item.Reduzierung,
    });
  });

  // Zellenformatierung für numerische Spalten
  mainSheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      // Überspringe Header
      const numericCells = [8, 9, 11, 12, 13, 14, 15, 16, 17, 18]; // Indizes der numerischen Spalten
      numericCells.forEach(colIndex => {
        const cell = row.getCell(colIndex);

        // Format je nach Spaltentyp
        if ([14, 17].includes(colIndex)) {
          // € Spalten
          cell.numFmt = currencyFormat;
        } else {
          cell.numFmt = numberFormat;
        }

        cell.alignment = { horizontal: 'right' };
      });
    }
  });

  // Summen-Zeile hinzufügen
  if (data.length > 0) {
    const sumRow = mainSheet.addRow({
      ID: '',
      Raumnummer: '',
      Bereich: '',
      Gebaeudeteil: '',
      Etage: '',
      Bezeichnung: 'Summe:',
      RG: '',
      qm: summary ? summary.totalQm : data.reduce((sum, item) => sum + safeNumber(item.qm), 0),
      Anzahl: '',
      Intervall: '',
      RgJahr: '',
      RgMonat: '',
      qmMonat: summary
        ? summary.totalQmMonat
        : data.reduce((sum, item) => sum + safeNumber(item.qmMonat), 0),
      WertMonat: summary
        ? summary.totalWertMonat
        : data.reduce((sum, item) => sum + safeNumber(item.WertMonat), 0),
      StundenTag: '',
      StundenMonat: summary
        ? summary.totalStundenMonat
        : data.reduce((sum, item) => sum + safeNumber(item.StundenMonat), 0),
      WertJahr: summary
        ? summary.totalWertJahr
        : data.reduce((sum, item) => sum + safeNumber(item.WertJahr), 0),
      qmStunde: '',
      Reinigungstage: '',
      Bemerkung: '',
      Reduzierung: '',
    });

    sumRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      if ([8, 13, 14, 16, 17].includes(colNumber)) {
        cell.border = {
          top: { style: 'double' },
          bottom: { style: 'double' },
        };

        if ([14, 17].includes(colNumber)) {
          // € Spalten
          cell.numFmt = currencyFormat;
        } else {
          cell.numFmt = numberFormat;
        }
      }
    });
  }

  // Zusammenfassungs-Tabelle
  if (summary) {
    const summarySheet = workbook.addWorksheet('Zusammenfassung');

    // Titel
    summarySheet.mergeCells('A1:C1');
    const titleCell = summarySheet.getCell('A1');
    titleCell.value = `Zusammenfassung für ${standortName}`;
    titleCell.font = { size: 14, bold: true };
    titleCell.alignment = { horizontal: 'center' };

    // Überschriften
    summarySheet.getCell('A3').value = 'Metrik';
    summarySheet.getCell('B3').value = 'Wert';
    summarySheet.getCell('C3').value = 'Einheit';

    [3].forEach(row => {
      ['A', 'B', 'C'].forEach(col => {
        const cell = summarySheet.getCell(`${col}${row}`);
        Object.assign(cell, headerStyle);
      });
    });

    // Daten
    const summaryData = [
      { metric: 'Anzahl Räume', value: summary.totalRooms, unit: '' },
      { metric: 'Gesamtfläche', value: summary.totalQm, unit: 'm²' },
      { metric: 'Monatlicher Wert', value: summary.totalWertMonat, unit: '€' },
      { metric: 'Jährlicher Wert', value: summary.totalWertJahr, unit: '€' },
      { metric: 'Monatliche Arbeitsstunden', value: summary.totalStundenMonat, unit: 'h' },
    ];

    summaryData.forEach((item, index) => {
      const rowIndex = index + 4;
      summarySheet.getCell(`A${rowIndex}`).value = item.metric;
      summarySheet.getCell(`B${rowIndex}`).value = item.value;
      summarySheet.getCell(`C${rowIndex}`).value = item.unit;

      // Formatierung für Werte
      const valueCell = summarySheet.getCell(`B${rowIndex}`);
      if (['€'].includes(item.unit)) {
        valueCell.numFmt = currencyFormat;
      } else if (['m²', 'h'].includes(item.unit)) {
        valueCell.numFmt = numberFormat;
      }
    });

    // Spaltenbreiten anpassen
    summarySheet.getColumn('A').width = 30;
    summarySheet.getColumn('B').width = 15;
    summarySheet.getColumn('C').width = 10;

    // Bereichsstatistiken, falls vorhanden
    if (summary.bereichStats && summary.bereichStats.length > 0) {
      const bereichSheet = workbook.addWorksheet('Nach Bereich');

      bereichSheet.columns = [
        { header: 'Bereich', key: 'bereich', width: 20 },
        { header: 'Fläche (qm)', key: 'qm', width: 15 },
        { header: 'Wert/Monat (€)', key: 'wertMonat', width: 15 },
        { header: 'Wert/Jahr (€)', key: 'wertJahr', width: 15 },
        { header: 'Stunden/Monat', key: 'stundenMonat', width: 15 },
      ];

      // Header formatieren
      const bereichHeader = bereichSheet.getRow(1);
      bereichHeader.eachCell(cell => {
        Object.assign(cell, headerStyle);
      });

      // Daten hinzufügen
      summary.bereichStats.forEach(item => {
        bereichSheet.addRow(item);
      });

      // Formatierung für numerische Zellen
      bereichSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // Format je nach Spaltentyp
          row.getCell(2).numFmt = numberFormat; // qm
          row.getCell(3).numFmt = currencyFormat; // WertMonat
          row.getCell(4).numFmt = currencyFormat; // WertJahr
          row.getCell(5).numFmt = numberFormat; // StundenMonat
        }
      });
    }

    // Reinigungsgruppen-Statistiken, falls vorhanden
    if (summary.rgStats && summary.rgStats.length > 0) {
      const rgSheet = workbook.addWorksheet('Nach Reinigungsgruppe');

      rgSheet.columns = [
        { header: 'Reinigungsgruppe', key: 'rg', width: 20 },
        { header: 'Fläche (qm)', key: 'qm', width: 15 },
        { header: 'Wert/Monat (€)', key: 'wertMonat', width: 15 },
        { header: 'Wert/Jahr (€)', key: 'wertJahr', width: 15 },
        { header: 'Stunden/Monat', key: 'stundenMonat', width: 15 },
      ];

      // Header formatieren
      const rgHeader = rgSheet.getRow(1);
      rgHeader.eachCell(cell => {
        Object.assign(cell, headerStyle);
      });

      // Daten hinzufügen
      summary.rgStats.forEach(item => {
        rgSheet.addRow(item);
      });

      // Formatierung für numerische Zellen
      rgSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // Format je nach Spaltentyp
          row.getCell(2).numFmt = numberFormat; // qm
          row.getCell(3).numFmt = currencyFormat; // WertMonat
          row.getCell(4).numFmt = currencyFormat; // WertJahr
          row.getCell(5).numFmt = numberFormat; // StundenMonat
        }
      });
    }
  }

  // Erzeuge Excel-Buffer
  return (await workbook.xlsx.writeBuffer()) as ExcelJS.Buffer;
}
