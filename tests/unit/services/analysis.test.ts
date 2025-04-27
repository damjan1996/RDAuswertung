// Importiere zusätzlich die fehlenden Funktionen direkt aus den Quelldateien
import { getTopStats } from '@/services/analysis/calculate-summary';
import { prepareGebaeudeTeilData } from '@/services/analysis/prepare-visualization';
import {
  analyzeRaumbuchData,
  calculateSummary,
  createFilterOptions,
  prepareDataForVisualization,
  preprocessData,
  safeNumber,
} from '@/services/analysis/raumbuch-analysis';
import { RaumbuchRow } from '@/types/raumbuch.types';

describe('Raumbuch Analysis Service', (): void => {
  // Mock-Daten für die Tests
  const mockData: RaumbuchRow[] = [
    {
      ID: 1,
      Raumnummer: '101',
      Bereich: 'Buero',
      Gebaeudeteil: 'Hauptgebaeude',
      Etage: 'EG',
      Bezeichnung: 'Buero 1',
      RG: 'RG1',
      qm: 25,
      Anzahl: 5,
      Intervall: 'Taeglich',
      RgJahr: 250,
      RgMonat: 20.83,
      qmMonat: 520.75,
      WertMonat: 150,
      StundenTag: 0.5,
      StundenMonat: 10.42,
      WertJahr: 1800,
      qmStunde: 50,
      Reinigungstage: '',
      Bemerkung: '',
      Reduzierung: '',
      Standort_ID: 1,
    },
    {
      ID: 2,
      Raumnummer: '102',
      Bereich: 'Konferenz',
      Gebaeudeteil: 'Hauptgebaeude',
      Etage: 'EG',
      Bezeichnung: 'Konferenzraum',
      RG: 'RG2',
      qm: 40,
      Anzahl: 5,
      Intervall: 'Taeglich',
      RgJahr: 250,
      RgMonat: 20.83,
      qmMonat: 833.2,
      WertMonat: 250,
      StundenTag: 0.8,
      StundenMonat: 16.67,
      WertJahr: 3000,
      qmStunde: 50,
      Reinigungstage: '',
      Bemerkung: '',
      Reduzierung: '',
      Standort_ID: 1,
    },
    {
      ID: 3,
      Raumnummer: '201',
      Bereich: 'Buero',
      Gebaeudeteil: 'Nebengebaeude',
      Etage: '1.OG',
      Bezeichnung: 'Buero 2',
      RG: 'RG1',
      qm: 20,
      Anzahl: 5,
      Intervall: 'Taeglich',
      RgJahr: 250,
      RgMonat: 20.83,
      qmMonat: 416.6,
      WertMonat: 120,
      StundenTag: 0.4,
      StundenMonat: 8.33,
      WertJahr: 1440,
      qmStunde: 50,
      Reinigungstage: '',
      Bemerkung: '',
      Reduzierung: '',
      Standort_ID: 1,
    },
  ];

  const mockDataWithNulls: RaumbuchRow[] = [
    {
      ID: 4,
      Raumnummer: '301',
      Bereich: null,
      Gebaeudeteil: 'Hauptgebaeude',
      Etage: '2.OG',
      Bezeichnung: 'Lager',
      RG: 'RG3',
      qm: null,
      Anzahl: null,
      Intervall: 'Woechentlich',
      RgJahr: null,
      RgMonat: null,
      qmMonat: null,
      WertMonat: null,
      StundenTag: null,
      StundenMonat: null,
      WertJahr: null,
      qmStunde: null,
      Reinigungstage: '',
      Bemerkung: '',
      Reduzierung: '',
      Standort_ID: 1,
    },
  ];

  describe('safeNumber Utility Function', () => {
    test('Konvertiert numerische Werte korrekt', () => {
      expect(safeNumber(10)).toBe(10);
      expect(safeNumber('20')).toBe(20);
      expect(safeNumber('3.14')).toBe(3.14);
    });

    test('Behandelt NULL-Werte und verwendet Standardwert', () => {
      expect(safeNumber(null)).toBe(0);
      expect(safeNumber(undefined)).toBe(0);
      expect(safeNumber(null, 5)).toBe(5);
    });

    test('Behandelt ungültige Zahlen und verwendet Standardwert', () => {
      expect(safeNumber('abc')).toBe(0);
      expect(safeNumber(NaN)).toBe(0);
      expect(safeNumber('abc', 10)).toBe(10);
    });
  });

  describe('calculateSummary Function', () => {
    test('Berechnet die Zusammenfassung korrekt', () => {
      const summary = calculateSummary(mockData);

      expect(summary).toHaveProperty('totalRooms');
      expect(summary).toHaveProperty('totalQm');
      expect(summary).toHaveProperty('totalQmMonat');
      expect(summary).toHaveProperty('totalWertMonat');
      expect(summary).toHaveProperty('totalWertJahr');
      expect(summary).toHaveProperty('totalStundenMonat');

      expect(summary.totalRooms).toBe(3);
      expect(summary.totalQm).toBe(85);
      expect(summary.totalWertMonat).toBe(520);
      expect(summary.totalWertJahr).toBe(6240);
      expect(summary.totalStundenMonat).toBe(35.42);
    });

    test('Erstellt statistische Aufschlüsselungen nach Bereich und RG', () => {
      const summary = calculateSummary(mockData);

      expect(summary).toHaveProperty('bereichStats');
      expect(summary.bereichStats!).toHaveLength(2);

      expect(summary).toHaveProperty('rgStats');
      expect(summary.rgStats!).toHaveLength(2);

      const bueroStat = summary.bereichStats!.find(stat => stat.bereich === 'Buero');
      expect(bueroStat?.qm).toBe(45);
      expect(bueroStat?.wertMonat).toBe(270);

      const rg1Stat = summary.rgStats!.find(stat => stat.rg === 'RG1');
      expect(rg1Stat?.qm).toBe(45);
      expect(rg1Stat?.wertMonat).toBe(270);
    });

    test('Gibt leere Zusammenfassung zurück, wenn keine Daten vorhanden sind', () => {
      const summary = calculateSummary([]);

      expect(summary.totalRooms).toBe(0);
      expect(summary.totalQm).toBe(0);
      expect(summary.totalQmMonat).toBe(0);
      expect(summary.totalWertMonat).toBe(0);
      expect(summary.totalWertJahr).toBe(0);
      expect(summary.totalStundenMonat).toBe(0);
    });

    test('Behandelt NULL-Werte in den Daten korrekt', () => {
      const summary = calculateSummary(mockDataWithNulls);

      expect(summary.totalRooms).toBe(1);
      expect(summary.totalQm).toBe(0);
      expect(summary.totalWertMonat).toBe(0);
    });
  });

  describe('getTopStats Function', (): void => {
    test('Gibt die Top-N-Elemente nach einem bestimmten Feld zurück', (): void => {
      const summary = calculateSummary(mockData);
      const topRGByWertMonat = getTopStats(
        (summary.rgStats ?? []) as unknown as Record<string, unknown>[],
        'wertMonat',
        1
      );

      expect(topRGByWertMonat).toHaveLength(1);
      expect(topRGByWertMonat[0].rg).toBe('RG1');
      expect(topRGByWertMonat[0].wertMonat).toBe(270);
    });

    test('Sortiert aufsteigend, wenn aufsteigend=true', (): void => {
      const summary = calculateSummary(mockData);
      const bottomRGByWertMonat = getTopStats(
        (summary.rgStats ?? []) as unknown as Record<string, unknown>[],
        'wertMonat',
        1,
        true
      );

      expect(bottomRGByWertMonat).toHaveLength(1);
      expect(bottomRGByWertMonat[0].rg).toBe('RG2');
      expect(bottomRGByWertMonat[0].wertMonat).toBe(250);
    });

    test('Gibt ein leeres Array zurück, wenn keine Statistiken vorhanden sind', (): void => {
      const topStats = getTopStats([], 'wertMonat');
      expect(topStats).toEqual([]);
    });
  });

  describe('prepareDataForVisualization Function', () => {
    test('Bereitet Visualisierungsdaten korrekt auf', () => {
      const visualizationData = prepareDataForVisualization(mockData);

      expect(visualizationData).toHaveProperty('bereichData');
      expect(visualizationData).toHaveProperty('rgData');
      expect(visualizationData).toHaveProperty('etageData');

      expect(visualizationData.bereichData!['Buero']).toBe(45);
      expect(visualizationData.bereichData!['Konferenz']).toBe(40);

      expect(visualizationData.rgData!['RG1']).toBe(270);
      expect(visualizationData.rgData!['RG2']).toBe(250);

      const egValue = visualizationData.etageData!['EG'] || 0;
      expect(egValue).toBeCloseTo(27.09, 1);
      expect(visualizationData.etageData!['1.OG']).toBe(8.33);
    });

    test('Gibt leere Strukturen zurück, wenn keine Daten vorhanden sind', () => {
      const visualizationData = prepareDataForVisualization([]);

      expect(visualizationData.bereichData ?? {}).toEqual({});
      expect(visualizationData.rgData ?? {}).toEqual({});
      expect(visualizationData.etageData ?? {}).toEqual({});
    });

    test('Behandelt NULL-Werte in den Daten korrekt', () => {
      const visualizationData = prepareDataForVisualization(mockDataWithNulls);

      expect(visualizationData.bereichData!['undefined']).toBeUndefined();
      expect(visualizationData.etageData!['2.OG']).toBe(0);
    });
  });

  describe('prepareGebaeudeTeilData Function', () => {
    test('Bereitet Gebäudeteil-Daten korrekt auf', () => {
      const gebaeudeTeilData = prepareGebaeudeTeilData(mockData);

      expect(gebaeudeTeilData['Hauptgebaeude']).toBe(65);
      expect(gebaeudeTeilData['Nebengebaeude']).toBe(20);
    });

    test('Ignoriert undefined oder null Gebäudeteile', () => {
      const customData = [...mockData, { ...mockData[0], ID: 5, Gebaeudeteil: null, qm: 15 }];
      const gebaeudeTeilData = prepareGebaeudeTeilData(customData);

      expect(gebaeudeTeilData['null']).toBeUndefined();
      expect(gebaeudeTeilData['undefined']).toBeUndefined();
    });
  });

  describe('preprocessData Function', () => {
    test('Konvertiert numerische Felder zu Zahlen', () => {
      const processed = preprocessData([
        { ...mockData[0], qm: '25' as any, WertMonat: '150' as any },
      ]);

      expect(typeof processed[0].qm).toBe('number');
      expect(processed[0].qm).toBe(25);
      expect(typeof processed[0].WertMonat).toBe('number');
      expect(processed[0].WertMonat).toBe(150);
    });

    test('Behandelt NULL-Werte korrekt', () => {
      const processed = preprocessData(mockDataWithNulls);

      expect(processed[0].qm).toBe(0);
      expect(processed[0].WertMonat).toBe(0);
      expect(processed[0].StundenMonat).toBe(0);
    });

    test('Gibt ein leeres Array zurück, wenn keine Daten vorhanden sind', () => {
      expect(preprocessData([])).toEqual([]);
    });
  });

  describe('createFilterOptions Function', () => {
    test('Erstellt korrekte Filteroptionen aus den Daten', () => {
      const filterOptions = createFilterOptions(mockData);

      expect(filterOptions.bereiche).toContain('Buero');
      expect(filterOptions.bereiche).toContain('Konferenz');
      expect(filterOptions.bereiche).toHaveLength(2);

      expect(filterOptions.gebaeudeteil).toContain('Hauptgebaeude');
      expect(filterOptions.gebaeudeteil).toContain('Nebengebaeude');
      expect(filterOptions.gebaeudeteil).toHaveLength(2);

      expect(filterOptions.etage).toContain('EG');
      expect(filterOptions.etage).toContain('1.OG');
      expect(filterOptions.etage).toHaveLength(2);

      expect(filterOptions.rg).toContain('RG1');
      expect(filterOptions.rg).toContain('RG2');
      expect(filterOptions.rg).toHaveLength(2);
    });

    test('Gibt leere Filter zurück, wenn keine Daten vorhanden sind', () => {
      const filterOptions = createFilterOptions([]);

      expect(filterOptions.bereiche).toEqual([]);
      expect(filterOptions.gebaeudeteil).toEqual([]);
      expect(filterOptions.etage).toEqual([]);
      expect(filterOptions.rg).toEqual([]);
    });

    test('Ignoriert NULL-Werte in den Daten', () => {
      const filterOptions = createFilterOptions(mockDataWithNulls);

      expect(filterOptions.bereiche).not.toContain(null);
      expect(filterOptions.gebaeudeteil).toContain('Hauptgebaeude');
      expect(filterOptions.etage).toContain('2.OG');
      expect(filterOptions.rg).toContain('RG3');
    });
  });

  describe('analyzeRaumbuchData Function', () => {
    test('Kombiniert alle Analysefunktionen und gibt ein vollständiges Ergebnis zurück', () => {
      const result = analyzeRaumbuchData(mockData);

      expect(result).toHaveProperty('processedData');
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('visualizationData');
      expect(result).toHaveProperty('filterOptions');

      expect(result.processedData).toHaveLength(3);
      expect(result.summary.totalRooms).toBe(3);
      expect(result.summary.totalQm).toBe(85);

      expect(result.visualizationData.bereichData!['Buero']).toBe(45);
      expect(result.visualizationData.rgData!['RG2']).toBe(250);

      expect(result.filterOptions.bereiche).toContain('Buero');
      expect(result.filterOptions.etage).toContain('EG');
    });

    test('Verarbeitet Daten mit NULL-Werten korrekt', () => {
      const result = analyzeRaumbuchData(mockDataWithNulls);

      expect(result.processedData[0].qm).toBe(0);
      expect(result.summary.totalQm).toBe(0);
      expect(result.filterOptions.rg).toContain('RG3');
    });
  });
});
