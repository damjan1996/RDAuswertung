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
    { header: 'RG', key: 'Reinigungsgruppe', width: 8 }, // Changed from RG to Reinigungsgruppe to match the database field
    { header: 'qm', key: 'Menge', width: 10 }, // Changed from qm to Menge to match the database field
    { header: 'Anzahl', key: 'Anzahl', width: 8 },
    { header: 'Intervall', key: 'Reinigungsintervall', width: 12 }, // Changed from Intervall to Reinigungsintervall
    { header: 'Rg/Jahr', key: 'ReinigungstageJahr', width: 10 }, // Changed from RgJahr to ReinigungstageJahr
    { header: 'Rg/Monat', key: 'ReinigungstageMonat', width: 10 }, // Changed from RgMonat to ReinigungstageMonat
    { header: 'qm/Monat', key: 'MengeAktivMonat', width: 10 }, // Changed from qmMonat to MengeAktivMonat
    { header: '€/Monat', key: 'VkWertNettoMonat', width: 12 }, // Changed from WertMonat to VkWertNettoMonat
    { header: 'h/Tag', key: 'StundeTag', width: 10 }, // Changed from StundenTag to StundeTag
    { header: 'h/Monat', key: 'StundeMonat', width: 10 }, // Changed from StundenMonat to StundeMonat
    { header: '€/Jahr', key: 'VkWertNettoMonat', width: 12 }, // Calculate this as VkWertNettoMonat*12
    { header: 'qm/h', key: 'LeistungStunde', width: 10 }, // Changed from qmStunde to LeistungStunde
    { header: 'Reinigungstage', key: 'ReinigungsTage', width: 15 },
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
      Reinigungsgruppe: item.Reinigungsgruppe,
      Menge: safeNumber(item.Menge),
      Anzahl: safeNumber(item.Anzahl),
      Reinigungsintervall: item.Reinigungsintervall,
      ReinigungstageJahr: safeNumber(item.ReinigungstageJahr),
      ReinigungstageMonat: safeNumber(item.ReinigungstageMonat),
      MengeAktivMonat: safeNumber(item.MengeAktivMonat),
      VkWertNettoMonat: safeNumber(item.VkWertNettoMonat),
      StundeTag: safeNumber(item.StundeTag),
      StundeMonat: safeNumber(item.StundeMonat),
      'VkWertNettoMonat*12': safeNumber(item.VkWertNettoMonat) * 12, // Calculate yearly value
      LeistungStunde: safeNumber(item.LeistungStunde),
      ReinigungsTage: item.ReinigungsTage,
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
      Reinigungsgruppe: '',
      Menge: summary
        ? summary.totalMenge
        : data.reduce((sum, item) => sum + safeNumber(item.Menge), 0),
      Anzahl: '',
      Reinigungsintervall: '',
      ReinigungstageJahr: '',
      ReinigungstageMonat: '',
      MengeAktivMonat: summary
        ? summary.totalMengeAktivMonat
        : data.reduce((sum, item) => sum + safeNumber(item.MengeAktivMonat), 0),
      VkWertNettoMonat: summary
        ? summary.totalVkWertNettoMonat
        : data.reduce((sum, item) => sum + safeNumber(item.VkWertNettoMonat), 0),
      StundeTag: '',
      StundeMonat: summary
        ? summary.totalStundenMonat
        : data.reduce((sum, item) => sum + safeNumber(item.StundeMonat), 0),
      'VkWertNettoMonat*12':
        (summary
          ? summary.totalVkWertNettoMonat
          : data.reduce((sum, item) => sum + safeNumber(item.VkWertNettoMonat), 0)) * 12,
      LeistungStunde: '',
      ReinigungsTage: '',
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
      { metric: 'Gesamtfläche', value: summary.totalMenge, unit: 'm²' },
      { metric: 'Monatlicher Wert', value: summary.totalVkWertNettoMonat, unit: '€' },
      { metric: 'Jährlicher Wert', value: summary.totalVkWertNettoMonat * 12, unit: '€' },
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
        { header: 'Fläche (qm)', key: 'menge', width: 15 }, // Changed from qm to menge
        { header: 'Wert/Monat (€)', key: 'vkWertNettoMonat', width: 15 }, // Changed from wertMonat to vkWertNettoMonat
        { header: 'Wert/Jahr (€)', key: 'vkWertNettoMonat*12', width: 15 }, // Changed calculation
        { header: 'Stunden/Monat', key: 'stundenMonat', width: 15 },
      ];

      // Header formatieren
      const bereichHeader = bereichSheet.getRow(1);
      bereichHeader.eachCell(cell => {
        Object.assign(cell, headerStyle);
      });

      // Daten hinzufügen und Jahreswert berechnen
      const bereichData = summary.bereichStats.map(item => ({
        ...item,
        'vkWertNettoMonat*12': item.vkWertNettoMonat * 12,
      }));

      bereichData.forEach(item => {
        bereichSheet.addRow(item);
      });

      // Formatierung für numerische Zellen
      bereichSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // Format je nach Spaltentyp
          row.getCell(2).numFmt = numberFormat; // menge
          row.getCell(3).numFmt = currencyFormat; // vkWertNettoMonat
          row.getCell(4).numFmt = currencyFormat; // vkWertNettoMonat*12
          row.getCell(5).numFmt = numberFormat; // stundenMonat
        }
      });
    }

    // Reinigungsgruppen-Statistiken, falls vorhanden
    if (summary.rgStats && summary.rgStats.length > 0) {
      const rgSheet = workbook.addWorksheet('Nach Reinigungsgruppe');

      rgSheet.columns = [
        { header: 'Reinigungsgruppe', key: 'reinigungsgruppe', width: 20 }, // Changed from rg to reinigungsgruppe
        { header: 'Fläche (qm)', key: 'menge', width: 15 }, // Changed from qm to menge
        { header: 'Wert/Monat (€)', key: 'vkWertNettoMonat', width: 15 }, // Changed from wertMonat to vkWertNettoMonat
        { header: 'Wert/Jahr (€)', key: 'vkWertNettoMonat*12', width: 15 }, // Changed calculation
        { header: 'Stunden/Monat', key: 'stundenMonat', width: 15 },
      ];

      // Header formatieren
      const rgHeader = rgSheet.getRow(1);
      rgHeader.eachCell(cell => {
        Object.assign(cell, headerStyle);
      });

      // Daten hinzufügen und Jahreswert berechnen
      const rgData = summary.rgStats.map(item => ({
        ...item,
        'vkWertNettoMonat*12': item.vkWertNettoMonat * 12,
      }));

      rgData.forEach(item => {
        rgSheet.addRow(item);
      });

      // Formatierung für numerische Zellen
      rgSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // Format je nach Spaltentyp
          row.getCell(2).numFmt = numberFormat; // menge
          row.getCell(3).numFmt = currencyFormat; // vkWertNettoMonat
          row.getCell(4).numFmt = currencyFormat; // vkWertNettoMonat*12
          row.getCell(5).numFmt = numberFormat; // stundenMonat
        }
      });
    }
  }

  // Erzeuge Excel-Buffer
  return (await workbook.xlsx.writeBuffer()) as ExcelJS.Buffer;
}
