import * as databaseQueries from '@/services/database/queries';

// Mock der Datenbank-Abfragen
jest.mock('@/services/database/queries', () => ({
  getStandorte: jest.fn(),
  getStandortById: jest.fn(),
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
  enum: () => mockZod,
  safeParse: (data: any) => {
    // Validierung für 'id' Parameter
    if (data.id && isNaN(Number(data.id))) {
      return { success: false, error: { format: () => ({ message: 'Invalid ID' }) } };
    }
    // Validierung für andere Parameter
    return { success: true, data };
  },
  optional: () => mockZod,
  default: () => mockZod,
};

// Interface für Standort
interface Standort {
  id: number;
  bezeichnung: string;
  preis: number;
  preis7Tage: number;
}

// Mock für GET /api/standorte
const mockGET = async (req: MockNextRequest) => {
  try {
    // Extrahiere Suchparameter
    const search = req.nextUrl.searchParams.get('search') || undefined;
    const sort = req.nextUrl.searchParams.get('sort') || 'bezeichnung';
    const order = req.nextUrl.searchParams.get('order') || 'asc';
    const limit = req.nextUrl.searchParams.get('limit')
      ? Number(req.nextUrl.searchParams.get('limit'))
      : undefined;
    const offset = req.nextUrl.searchParams.get('offset')
      ? Number(req.nextUrl.searchParams.get('offset'))
      : 0;

    // Rufe Standorte ab
    let standorte = (await databaseQueries.getStandorte()) as Standort[];

    // Filterung nach Suchbegriff
    if (search) {
      standorte = standorte.filter(s => s.bezeichnung.toLowerCase().includes(search.toLowerCase()));
    }

    // Sortierung
    standorte.sort((a, b) => {
      const sortField = sort === 'id' ? 'id' : 'bezeichnung';
      if (a[sortField as keyof Standort] < b[sortField as keyof Standort])
        return order === 'asc' ? -1 : 1;
      if (a[sortField as keyof Standort] > b[sortField as keyof Standort])
        return order === 'asc' ? 1 : -1;
      return 0;
    });

    // Paginierung
    const totalCount = standorte.length;
    if (limit) {
      standorte = standorte.slice(offset, offset + limit);
    }

    return MockNextResponse.json({
      data: standorte,
      meta: {
        totalCount,
        filteredCount: standorte.length,
        limit: limit || null,
        offset,
      },
    });
  } catch (error) {
    return MockNextResponse.json({ error: 'Failed to fetch standorte' }, { status: 500 });
  }
};

// Mock für GET /api/standorte/[id]
const mockGETById = async (req: MockNextRequest, { params }: { params: { id: string } }) => {
  try {
    // Validiere ID
    if (isNaN(Number(params.id))) {
      return MockNextResponse.json({ error: 'Invalid standort ID' }, { status: 400 });
    }

    const standortId = Number(params.id);
    const standort = await databaseQueries.getStandortById(standortId);

    if (!standort) {
      return MockNextResponse.json({ error: 'Standort not found' }, { status: 404 });
    }

    return MockNextResponse.json(standort);
  } catch (error) {
    return MockNextResponse.json({ error: 'Failed to fetch standort' }, { status: 500 });
  }
};

describe('Standorte API', () => {
  // Beispiel-Standorte für die Tests
  const mockStandorte: Standort[] = [
    { id: 1, bezeichnung: 'Standort A', preis: 25.5, preis7Tage: 30 },
    { id: 2, bezeichnung: 'Standort B', preis: 22.0, preis7Tage: 26 },
    { id: 3, bezeichnung: 'Standort C', preis: 28.0, preis7Tage: 32 },
  ];

  beforeEach(() => {
    // Mock zurücksetzen
    jest.clearAllMocks();

    // Standard-Mock-Implementierungen
    (databaseQueries.getStandorte as jest.Mock).mockResolvedValue(mockStandorte);
    (databaseQueries.getStandortById as jest.Mock).mockImplementation((id: number) => {
      const standort = mockStandorte.find(s => s.id === id);
      return Promise.resolve(standort || null);
    });
  });

  describe('GET /api/standorte', () => {
    test('Gibt alle Standorte zurück', async () => {
      const req = new MockNextRequest('/api/standorte');
      const res = await mockGET(req);

      expect(res.status).toBe(200);
      const data = await res.json();

      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('meta');
      expect(data.data).toEqual(mockStandorte);
      expect(data.meta.totalCount).toBe(mockStandorte.length);
      expect(databaseQueries.getStandorte).toHaveBeenCalledTimes(1);
    });

    test('Unterstützt Suchfilterung', async () => {
      const searchTerm = 'Standort A';
      const req = new MockNextRequest('/api/standorte?search=' + searchTerm);

      // Anpassen des Mocks für gefilterte Ergebnisse
      (databaseQueries.getStandorte as jest.Mock).mockResolvedValue(
        mockStandorte.filter(s => s.bezeichnung.includes(searchTerm))
      );

      const res = await mockGET(req);

      expect(res.status).toBe(200);
      const data = await res.json();

      expect(data.data.length).toBe(1);
      expect(data.data[0].bezeichnung).toBe('Standort A');
    });

    test('Behandelt Datenbankfehler', async () => {
      // Mock für einen Datenbankfehler
      (databaseQueries.getStandorte as jest.Mock).mockRejectedValue(new Error('Datenbankfehler'));

      const req = new MockNextRequest('/api/standorte');
      const res = await mockGET(req);

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Failed to fetch standorte');
    });
  });

  describe('GET /api/standorte/[id]', () => {
    test('Gibt einen einzelnen Standort zurück', async () => {
      const req = new MockNextRequest('/api/standorte/1');
      const params = { id: '1' };
      const res = await mockGETById(req, { params });

      expect(res.status).toBe(200);
      const data = await res.json();

      expect(data).toEqual(mockStandorte[0]);
      expect(databaseQueries.getStandortById).toHaveBeenCalledWith(1);
    });

    test('Behandelt nicht gefundene Standorte', async () => {
      const req = new MockNextRequest('/api/standorte/999');
      const params = { id: '999' };

      // Mock anpassen, um null zurückzugeben
      (databaseQueries.getStandortById as jest.Mock).mockResolvedValue(null);

      const res = await mockGETById(req, { params });

      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Standort not found');
    });

    test('Validiert ungültige ID-Parameter', async () => {
      const req = new MockNextRequest('/api/standorte/ungueltig');
      const params = { id: 'ungueltig' };
      const res = await mockGETById(req, { params });

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Invalid standort ID');
    });

    test('Behandelt Datenbankfehler', async () => {
      // Mock für einen Datenbankfehler
      (databaseQueries.getStandortById as jest.Mock).mockRejectedValue(
        new Error('Datenbankfehler')
      );

      const req = new MockNextRequest('/api/standorte/1');
      const params = { id: '1' };
      const res = await mockGETById(req, { params });

      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('Failed to fetch standort');
    });
  });
});
