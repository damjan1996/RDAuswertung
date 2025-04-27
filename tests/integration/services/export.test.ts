import * as raumbuchAnalysis from '@/services/analysis/raumbuch-analysis';
import * as databaseQueries from '@/services/database/queries';
import * as excelExport from '@/services/export/excel-export';
import * as pdfExport from '@/services/export/pdf-export';

// Mocks für die Abhängigkeiten
jest.mock('@/services/database/queries', () => ({
  getRaumbuchData: jest.fn(),
  getStandortById: jest.fn(),
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
      return MockNextResponse.json({ error: 'Invalid standort ID' }, { status: 400 });
    }

    const standortId = Number(params.id);

    // Hole Standort-Information
    const standort = await databaseQueries.getStandortById(standortId);
    if (!standort) {
      return MockNextResponse.json({ error: 'Standort not found' }, { status: 404 });
    }

    // Hole Raumbuch-Daten
    let raumbuchData = await databaseQueries.getRaumbuchData(standortId);

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

    const rg = req.nextUrl.searchParams.get('rg');
    if (rg) {
      raumbuchData = raumbuchData.filter(item => item.RG === rg);
    }

    // Zusammenfassung berechnen
    const summary = raumbuchAnalysis.calculateSummary(raumbuchData);

    // Excel-Datei generieren
    const excelBuffer = await excelExport.generateExcel(
      raumbuchData,
      standort.bezeichnung,
      summary
    );

    // Dateiname
    const date = new Date().toISOString().split('T')[0];
    const filename = `Raumbuch_Auswertung_${standort.bezeichnung}_${date}.xlsx`;

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
      return MockNextResponse.json({ error: 'Invalid standort ID' }, { status: 400 });
    }

    const standortId = Number(params.id);

    // Hole Standort-Information
    const standort = await databaseQueries.getStandortById(standortId);
    if (!standort) {
      return MockNextResponse.json({ error: 'Standort not found' }, { status: 404 });
    }

    // Hole Raumbuch-Daten
    let raumbuchData = await databaseQueries.getRaumbuchData(standortId);

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

    const rg = req.nextUrl.searchParams.get('rg');
    if (rg) {
      raumbuchData = raumbuchData.filter(item => item.RG === rg);
    }

    // Zusammenfassung und Visualisierungsdaten berechnen
    const summary = raumbuchAnalysis.calculateSummary(raumbuchData);
    const visualizationData = raumbuchAnalysis.prepareDataForVisualization(raumbuchData);

    // PDF-Datei generieren
    const pdfBuffer = await pdfExport.generatePdf(raumbuchData, standort.bezeichnung, {
      summary,
      visualizationData,
    });

    // Dateiname
    const date = new Date().toISOString().split('T')[0];
    const filename = `Raumbuch_Auswertung_${standort.bezeichnung}_${date}.pdf`;

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
  const mockStandort = { id: 1, bezeichnung: 'Teststandort', preis: 25.5, preis7Tage: 30 };

  const mockRaumbuchData = [
    {
      ID: 1,
      Raumnummer: '101',
      Bereich: 'Büro',
      Gebaeudeteil: 'Hauptgebäude',
      Etage: 'EG',
      Bezeichnung: 'Büro 1',
      RG: 'RG1',
      qm: 25,
      Anzahl: 5,
      Intervall: 'Täglich',
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
      Gebaeudeteil: 'Hauptgebäude',
      Etage: 'EG',
      Bezeichnung: 'Konferenzraum',
      RG: 'RG2',
      qm: 40,
      Anzahl: 5,
      Intervall: 'Täglich',
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
  ];

  const mockSummary = {
    totalRooms: 2,
    totalQm: 65,
    totalQmMonat: 1353.95,
    totalWertMonat: 400,
    totalWertJahr: 4800,
    totalStundenMonat: 27.09,
  };

  const mockVisualizationData = {
    bereichData: { Büro: 25, Konferenz: 40 },
    rgData: { RG1: 150, RG2: 250 },
    etageData: { EG: 27.09 },
  };

  // Mock-Export-Daten
  const mockExcelBuffer = Buffer.from('mock-excel-data');
  const mockPdfBuffer = Buffer.from('mock-pdf-data');

  beforeEach(() => {
    // Zurücksetzen aller Mocks
    jest.clearAllMocks();

    // Standard-Implementierung der Mocks
    (databaseQueries.getStandortById as jest.Mock).mockResolvedValue(mockStandort);
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
      expect(databaseQueries.getStandortById).toHaveBeenCalledWith(1);
      expect(databaseQueries.getRaumbuchData).toHaveBeenCalledWith(1);
      expect(raumbuchAnalysis.calculateSummary).toHaveBeenCalledWith(mockRaumbuchData);
      expect(excelExport.generateExcel).toHaveBeenCalledWith(
        mockRaumbuchData,
        mockStandort.bezeichnung,
        mockSummary
      );

      // Überprüfe die Antwort
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      expect(res.headers.get('Content-Disposition')).toContain(
        `attachment; filename="Raumbuch_Auswertung_${mockStandort.bezeichnung}`
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

    test('Gibt einen 404-Fehler zurück, wenn der Standort nicht gefunden wird', async () => {
      // Mock anpassen, um null zurückzugeben
      (databaseQueries.getStandortById as jest.Mock).mockResolvedValue(null);

      const req = new MockNextRequest('/api/export/excel/999');
      const params = { id: '999' };

      const res = await mockGETExcel(req, { params });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Standort not found');
    });

    test('Validiert ungültige ID-Parameter', async () => {
      const req = new MockNextRequest('/api/export/excel/ungueltig');
      const params = { id: 'ungueltig' };

      const res = await mockGETExcel(req, { params });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Invalid standort ID');
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
      expect(databaseQueries.getStandortById).toHaveBeenCalledWith(1);
      expect(databaseQueries.getRaumbuchData).toHaveBeenCalledWith(1);
      expect(raumbuchAnalysis.calculateSummary).toHaveBeenCalledWith(mockRaumbuchData);
      expect(raumbuchAnalysis.prepareDataForVisualization).toHaveBeenCalledWith(mockRaumbuchData);
      expect(pdfExport.generatePdf).toHaveBeenCalledWith(
        mockRaumbuchData,
        mockStandort.bezeichnung,
        {
          summary: mockSummary,
          visualizationData: mockVisualizationData,
        }
      );

      // Überprüfe die Antwort
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('application/pdf');
      expect(res.headers.get('Content-Disposition')).toContain(
        `attachment; filename="Raumbuch_Auswertung_${mockStandort.bezeichnung}`
      );

      // Überprüfe, ob der Buffer korrekt zurückgegeben wird
      const buffer = await res.arrayBuffer();
      expect(new Uint8Array(buffer)).toEqual(new Uint8Array(mockPdfBuffer.buffer));
    });

    test('Gibt einen 404-Fehler zurück, wenn der Standort nicht gefunden wird', async () => {
      // Mock anpassen, um null zurückzugeben
      (databaseQueries.getStandortById as jest.Mock).mockResolvedValue(null);

      const req = new MockNextRequest('/api/export/pdf/999');
      const params = { id: '999' };

      const res = await mockGETPDF(req, { params });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Standort not found');
    });
  });
});
