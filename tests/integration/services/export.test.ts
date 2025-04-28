import * as raumbuchAnalysis from '@/services/analysis/raumbuch-analysis';
import * as databaseQueries from '@/services/database/queries';
import * as excelExport from '@/services/export/excel-export';
import * as pdfExport from '@/services/export/pdf-export';

// Mocks für die Abhängigkeiten
jest.mock('@/services/database/queries', () => ({
  getRaumbuchData: jest.fn(),
  getStandortById: jest.fn(),
  getGebaeudeById: jest.fn(), // Neu: Gebaeude statt Objekt
}));

jest.mock('@/services/export/excel-export', () => ({
  generateExcel: jest.fn(),
}));

jest.mock('@/services/export/pdf-export', () => ({
  generatePdf: jest.fn(),
}));

jest.mock('@/services/analysis/raumbuch-analysis', () => ({
  calculateSummary: jest.fn(),
  prepareDataForVisualization: jest.fn(),
}));

// Mock-Implementierung für NextRequest
class MockNextRequest {
  nextUrl: URL;

  constructor(url: string) {
    this.nextUrl = new URL(url, 'http://localhost:3000');
  }
}

// Mock-Implementierung für NextResponse
class MockNextResponse {
  status: number;
  headers: Map<string, string>;
  private body: any;

  constructor(body: any, init?: { status?: number; headers?: Record<string, string> }) {
    this.body = body;
    this.status = init?.status || 200;
    this.headers = new Map(Object.entries(init?.headers || {}));
  }

  async json() {
    return this.body;
  }

  async arrayBuffer() {
    return this.body instanceof Buffer ? this.body.buffer : new ArrayBuffer(0);
  }

  static json(data: any, init?: { status?: number; headers?: Record<string, string> }) {
    return new MockNextResponse(data, init);
  }
}

// Mock für das Zod-Schema
const mockZod = {
  object: () => mockZod,
  string: () => mockZod,
  min: () => mockZod,
  refine: () => mockZod,
  safeParse: (data: any) => {
    // Validierung für 'id' Parameter
    if (data.id && isNaN(Number(data.id))) {
      return { success: false, error: { format: () => ({ message: 'Invalid ID' }) } };
    }
    // Validierung für andere Parameter
    return { success: true, data };
  },
  optional: () => mockZod,
};

// Mock für GET /api/export/excel/[id]
const mockGETExcel = async (req: MockNextRequest, { params }: { params: { id: string } }) => {
  try {
    // Validiere ID
    if (isNaN(Number(params.id))) {
      return MockNextResponse.json({ error: 'Invalid gebaeude ID' }, { status: 400 }); // Geändert von standort zu gebaeude
    }

    const gebaeudeId = Number(params.id); // Geändert von standortId zu gebaeudeId

    // Hole Gebaeude-Information
    const gebaeude = await databaseQueries.getGebaeudeById(gebaeudeId); // Geändert zu getGebaeudeById
    if (!gebaeude) {
      return MockNextResponse.json({ error: 'Gebaeude not found' }, { status: 404 }); // Geändert von Standort zu Gebaeude
    }

    // Hole Raumbuch-Daten
    let raumbuchData = await databaseQueries.getRaumbuchData(gebaeudeId);

    // Filter anwenden
    const bereich = req.nextUrl.searchParams.get('bereich');
    if (bereich) {
      raumbuchData = raumbuchData.filter(item => item.Bereich === bereich);
    }

    const gebaeudeteil = req.nextUrl.searchParams.get('gebaeudeteil');
    if (gebaeudeteil) {
      raumbuchData = raumbuchData.filter(item => item.Gebaeudeteil === gebaeudeteil);
    }

    const etage = req.nextUrl.searchParams.get('etage');
    if (etage) {
      raumbuchData = raumbuchData.filter(item => item.Etage === etage);
    }

    const reinigungsgruppe = req.nextUrl.searchParams.get('reinigungsgruppe'); // Geändert von rg zu reinigungsgruppe
    if (reinigungsgruppe) {
      raumbuchData = raumbuchData.filter(item => item.Reinigungsgruppe === reinigungsgruppe); // Geändert von RG zu Reinigungsgruppe
    }

    // Zusammenfassung berechnen
    const summary = raumbuchAnalysis.calculateSummary(raumbuchData);

    // Excel-Datei generieren
    const excelBuffer = await excelExport.generateExcel(
      raumbuchData,
      gebaeude.bezeichnung, // Gebaeude statt Standort
      summary
    );

    // Dateiname
    const date = new Date().toISOString().split('T')[0];
    const filename = `Raumbuch_Auswertung_${gebaeude.bezeichnung}_${date}.xlsx`; // Gebaeude statt Standort

    // Rückgabe
    const response = new MockNextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': excelBuffer.byteLength.toString(),
      },
    });

    return response;
  } catch (error) {
    return MockNextResponse.json({ error: 'Failed to generate Excel file' }, { status: 500 });
  }
};

// Mock für GET /api/export/pdf/[id]
const mockGETPDF = async (req: MockNextRequest, { params }: { params: { id: string } }) => {
  try {
    // Validiere ID
    if (isNaN(Number(params.id))) {
      return MockNextResponse.json({ error: 'Invalid gebaeude ID' }, { status: 400 }); // Geändert von standort zu gebaeude
    }

    const gebaeudeId = Number(params.id); // Geändert von standortId zu gebaeudeId

    // Hole Gebaeude-Information
    const gebaeude = await databaseQueries.getGebaeudeById(gebaeudeId); // Geändert zu getGebaeudeById
    if (!gebaeude) {
      return MockNextResponse.json({ error: 'Gebaeude not found' }, { status: 404 }); // Geändert von Standort zu Gebaeude
    }

    // Hole Raumbuch-Daten
    let raumbuchData = await databaseQueries.getRaumbuchData(gebaeudeId);

    // Filter anwenden
    const bereich = req.nextUrl.searchParams.get('bereich');
    if (bereich) {
      raumbuchData = raumbuchData.filter(item => item.Bereich === bereich);
    }

    const gebaeudeteil = req.nextUrl.searchParams.get('gebaeudeteil');
    if (gebaeudeteil) {
      raumbuchData = raumbuchData.filter(item => item.Gebaeudeteil === gebaeudeteil);
    }

    const etage = req.nextUrl.searchParams.get('etage');
    if (etage) {
      raumbuchData = raumbuchData.filter(item => item.Etage === etage);
    }

    const reinigungsgruppe = req.nextUrl.searchParams.get('reinigungsgruppe'); // Geändert von rg zu reinigungsgruppe
    if (reinigungsgruppe) {
      raumbuchData = raumbuchData.filter(item => item.Reinigungsgruppe === reinigungsgruppe); // Geändert von RG zu Reinigungsgruppe
    }

    // Zusammenfassung und Visualisierungsdaten berechnen
    const summary = raumbuchAnalysis.calculateSummary(raumbuchData);
    const visualizationData = raumbuchAnalysis.prepareDataForVisualization(raumbuchData);

    // PDF-Datei generieren
    const pdfBuffer = await pdfExport.generatePdf(raumbuchData, gebaeude.bezeichnung, {
      // Gebaeude statt Standort
      summary,
      visualizationData,
    });

    // Dateiname
    const date = new Date().toISOString().split('T')[0];
    const filename = `Raumbuch_Auswertung_${gebaeude.bezeichnung}_${date}.pdf`; // Gebaeude statt Standort

    // Rückgabe
    const response = new MockNextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    });

    return response;
  } catch (error) {
    return MockNextResponse.json({ error: 'Failed to generate PDF file' }, { status: 500 });
  }
};

describe('Export-Service Tests', () => {
  // Mock-Daten für die Tests
  const mockGebaeude = {
    id: 1,
    bezeichnung: 'Testgebaeude',
    preis: 25.5,
    preis7Tage: 30,
    preisSonntag: 35,
    firma_ID: 1,
    standort_ID: 1,
  }; // Gebaeude statt Standort

  const mockRaumbuchData = [
    {
      ID: 1,
      Raumnummer: '101',
      Bereich: 'Büro',
      Gebaeudeteil: 'Hauptgebäude',
      Etage: 'EG',
      Bezeichnung: 'Büro 1',
      Reinigungsgruppe: 'RG1', // Geändert von RG zu Reinigungsgruppe
      Menge: 25, // Geändert von qm zu Menge
      Anzahl: 5,
      Reinigungsintervall: 'Täglich', // Geändert von Intervall zu Reinigungsintervall
      ReinigungstageJahr: 250, // Geändert von RgJahr zu ReinigungstageJahr
      ReinigungstageMonat: 20.83, // Geändert von RgMonat zu ReinigungstageMonat
      MengeAktivMonat: 520.75, // Geändert von qmMonat zu MengeAktivMonat
      VkWertNettoMonat: 150, // Geändert von WertMonat zu VkWertNettoMonat
      StundeTag: 0.5, // Geändert von StundenTag zu StundeTag
      StundeMonat: 10.42, // Geändert von StundenMonat zu StundeMonat
      VkWertBruttoMonat: 178.5, // Neu: VkWertBruttoMonat
      RgWertNettoMonat: 135, // Neu: RgWertNettoMonat
      RgWertBruttoMonat: 160.65, // Neu: RgWertBruttoMonat
      LeistungStunde: 50, // Geändert von qmStunde zu LeistungStunde
      ReinigungsTage: '',
      Bemerkung: '',
      Reduzierung: '',
      Standort_ID: 1,
      Gebaeude_ID: 1, // Neu: Gebaeude statt Objekt
      Firma_ID: 1, // Neu
      Standort: 'Teststandort', // Neu
      Gebaeude: 'Testgebaeude', // Neu
      MengeAktiv: 25, // Neu
      MengeInAktiv: 0, // Neu
      Einheit: 'm²', // Neu
      LeistungStundeIst: 50, // Neu
      Aufschlag: 0, // Neu
      Bereich_ID: 1, // Neu
      Gebaeudeteil_ID: 1, // Neu
      Etage_ID: 1, // Neu
      Reinigungsgruppe_ID: 1, // Neu
      Einheit_ID: 1, // Neu
      Reinigungsintervall_ID: 1, // Neu
      ReinigungsTage_ID: null, // Neu
      LfdNr: 1, // Neu
      xStatus: 1, // Neu
      xDatum: new Date(), // Neu
      xBenutzer: 'Test', // Neu
      xVersion: 1, // Neu
    },
    {
      ID: 2,
      Raumnummer: '102',
      Bereich: 'Konferenz',
      Gebaeudeteil: 'Hauptgebäude',
      Etage: 'EG',
      Bezeichnung: 'Konferenzraum',
      Reinigungsgruppe: 'RG2', // Geändert
      Menge: 40, // Geändert
      Anzahl: 5,
      Reinigungsintervall: 'Täglich', // Geändert
      ReinigungstageJahr: 250, // Geändert
      ReinigungstageMonat: 20.83, // Geändert
      MengeAktivMonat: 833.2, // Geändert
      VkWertNettoMonat: 250, // Geändert
      StundeTag: 0.8, // Geändert
      StundeMonat: 16.67, // Geändert
      VkWertBruttoMonat: 297.5, // Neu
      RgWertNettoMonat: 225, // Neu
      RgWertBruttoMonat: 267.75, // Neu
      LeistungStunde: 50, // Geändert
      ReinigungsTage: '',
      Bemerkung: '',
      Reduzierung: '',
      Standort_ID: 1,
      Gebaeude_ID: 1, // Neu
      Firma_ID: 1, // Neu
      Standort: 'Teststandort', // Neu
      Gebaeude: 'Testgebaeude', // Neu
      MengeAktiv: 40, // Neu
      MengeInAktiv: 0, // Neu
      Einheit: 'm²', // Neu
      LeistungStundeIst: 50, // Neu
      Aufschlag: 0, // Neu
      Bereich_ID: 2, // Neu
      Gebaeudeteil_ID: 1, // Neu
      Etage_ID: 1, // Neu
      Reinigungsgruppe_ID: 2, // Neu
      Einheit_ID: 1, // Neu
      Reinigungsintervall_ID: 1, // Neu
      ReinigungsTage_ID: null, // Neu
      LfdNr: 2, // Neu
      xStatus: 1, // Neu
      xDatum: new Date(), // Neu
      xBenutzer: 'Test', // Neu
      xVersion: 1, // Neu
    },
  ];

  const mockSummary = {
    totalRooms: 2,
    totalMenge: 65, // Geändert von totalQm
    totalMengeAktivMonat: 1353.95, // Geändert von totalQmMonat
    totalVkWertNettoMonat: 400, // Geändert von totalWertMonat
    totalVkWertBruttoMonat: 476, // Neu
    totalRgWertNettoMonat: 360, // Neu
    totalRgWertBruttoMonat: 428.4, // Neu
    totalStundenMonat: 27.09, // Behalten
  };

  const mockVisualizationData = {
    bereichData: { Büro: 25, Konferenz: 40 },
    rgData: { RG1: 150, RG2: 250 }, // Diese Daten sind unverändert, da sie die Visualisierung repräsentieren
    etageData: { EG: 27.09 },
  };

  // Mock-Export-Daten
  const mockExcelBuffer = Buffer.from('mock-excel-data');
  const mockPdfBuffer = Buffer.from('mock-pdf-data');

  beforeEach(() => {
    // Zurücksetzen aller Mocks
    jest.clearAllMocks();

    // Standard-Implementierung der Mocks
    (databaseQueries.getGebaeudeById as jest.Mock).mockResolvedValue(mockGebaeude); // Geändert zu getGebaeudeById
    (databaseQueries.getRaumbuchData as jest.Mock).mockResolvedValue(mockRaumbuchData);
    (raumbuchAnalysis.calculateSummary as jest.Mock).mockReturnValue(mockSummary);
    (raumbuchAnalysis.prepareDataForVisualization as jest.Mock).mockReturnValue(
      mockVisualizationData
    );
    (excelExport.generateExcel as jest.Mock).mockResolvedValue(mockExcelBuffer);
    (pdfExport.generatePdf as jest.Mock).mockResolvedValue(mockPdfBuffer);
  });

  describe('Excel Export API', () => {
    test('Erstellt erfolgreich eine Excel-Datei', async () => {
      const req = new MockNextRequest('/api/export/excel/1');
      const params = { id: '1' };

      const res = await mockGETExcel(req, { params });

      // Überprüfe, ob die richtigen Dienste aufgerufen wurden
      expect(databaseQueries.getGebaeudeById).toHaveBeenCalledWith(1); // Geändert zu getGebaeudeById
      expect(databaseQueries.getRaumbuchData).toHaveBeenCalledWith(1);
      expect(raumbuchAnalysis.calculateSummary).toHaveBeenCalledWith(mockRaumbuchData);
      expect(excelExport.generateExcel).toHaveBeenCalledWith(
        mockRaumbuchData,
        mockGebaeude.bezeichnung, // Gebaeude statt Standort
        mockSummary
      );

      // Überprüfe die Antwort
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      expect(res.headers.get('Content-Disposition')).toContain(
        `attachment; filename="Raumbuch_Auswertung_${mockGebaeude.bezeichnung}` // Gebaeude statt Standort
      );

      // Überprüfe, ob der Buffer korrekt zurückgegeben wird
      const buffer = await res.arrayBuffer();
      expect(new Uint8Array(buffer)).toEqual(new Uint8Array(mockExcelBuffer.buffer));
    });

    test('Filtert Raumbuchdaten basierend auf Abfrageparametern', async () => {
      const req = new MockNextRequest('/api/export/excel/1?bereich=Büro');
      const params = { id: '1' };

      await mockGETExcel(req, { params });

      // Überprüfen, ob die gefilterten Daten an den Excel-Generator übergeben wurden
      const filteredData = mockRaumbuchData.filter(item => item.Bereich === 'Büro');
      expect(raumbuchAnalysis.calculateSummary).toHaveBeenCalledWith(
        expect.arrayContaining(filteredData)
      );
    });

    test('Gibt einen 404-Fehler zurück, wenn das Gebäude nicht gefunden wird', async () => {
      // Mock anpassen, um null zurückzugeben
      (databaseQueries.getGebaeudeById as jest.Mock).mockResolvedValue(null); // Geändert zu getGebaeudeById

      const req = new MockNextRequest('/api/export/excel/999');
      const params = { id: '999' };

      const res = await mockGETExcel(req, { params });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Gebaeude not found'); // Geändert von Standort zu Gebaeude
    });

    test('Validiert ungültige ID-Parameter', async () => {
      const req = new MockNextRequest('/api/export/excel/ungueltig');
      const params = { id: 'ungueltig' };

      const res = await mockGETExcel(req, { params });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Invalid gebaeude ID'); // Geändert von standort zu gebaeude
    });

    test('Behandelt Datenbankfehler', async () => {
      // Mock für einen Datenbankfehler
      (databaseQueries.getRaumbuchData as jest.Mock).mockRejectedValue(
        new Error('Datenbankfehler')
      );

      const req = new MockNextRequest('/api/export/excel/1');
      const params = { id: '1' };

      const res = await mockGETExcel(req, { params });

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Failed to generate Excel file');
    });
  });

  describe('PDF Export API', () => {
    test('Erstellt erfolgreich eine PDF-Datei', async () => {
      const req = new MockNextRequest('/api/export/pdf/1');
      const params = { id: '1' };

      const res = await mockGETPDF(req, { params });

      // Überprüfe, ob die richtigen Dienste aufgerufen wurden
      expect(databaseQueries.getGebaeudeById).toHaveBeenCalledWith(1); // Geändert zu getGebaeudeById
      expect(databaseQueries.getRaumbuchData).toHaveBeenCalledWith(1);
      expect(raumbuchAnalysis.calculateSummary).toHaveBeenCalledWith(mockRaumbuchData);
      expect(raumbuchAnalysis.prepareDataForVisualization).toHaveBeenCalledWith(mockRaumbuchData);
      expect(pdfExport.generatePdf).toHaveBeenCalledWith(
        mockRaumbuchData,
        mockGebaeude.bezeichnung, // Gebaeude statt Standort
        {
          summary: mockSummary,
          visualizationData: mockVisualizationData,
        }
      );

      // Überprüfe die Antwort
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('application/pdf');
      expect(res.headers.get('Content-Disposition')).toContain(
        `attachment; filename="Raumbuch_Auswertung_${mockGebaeude.bezeichnung}` // Gebaeude statt Standort
      );

      // Überprüfe, ob der Buffer korrekt zurückgegeben wird
      const buffer = await res.arrayBuffer();
      expect(new Uint8Array(buffer)).toEqual(new Uint8Array(mockPdfBuffer.buffer));
    });

    test('Gibt einen 404-Fehler zurück, wenn das Gebäude nicht gefunden wird', async () => {
      // Mock anpassen, um null zurückzugeben
      (databaseQueries.getGebaeudeById as jest.Mock).mockResolvedValue(null); // Geändert zu getGebaeudeById

      const req = new MockNextRequest('/api/export/pdf/999');
      const params = { id: '999' };

      const res = await mockGETPDF(req, { params });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Gebaeude not found'); // Geändert von Standort zu Gebaeude
    });
  });
});
