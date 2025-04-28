import { renderHook, waitFor } from '@testing-library/react';

import { useRaumbuchData } from '@/hooks/use-raumbuch-data';
import { RaumbuchRow, RaumbuchSummary, VisualizationData } from '@/types/raumbuch.types';

// Setup fetch mock
const originalFetch = global.fetch;
global.fetch = jest.fn();

describe('useRaumbuchData Hook', () => {
  // Mock-Daten für die Tests
  const mockRaumbuchData: RaumbuchRow[] = [
    {
      ID: 1,
      Firma_ID: 1,
      Standort_ID: 1,
      Gebaeude_ID: 1,
      Standort: 'Standort 1',
      Gebaeude: 'Gebäude 1',
      Raumnummer: '101',
      Bereich: 'Buero', // Changed from 'Büro' to avoid non-ASCII warning
      Gebaeudeteil: 'Hauptgebäude',
      Etage: 'EG',
      Bezeichnung: 'Buero 1', // Changed from 'Büro 1'
      Reinigungsgruppe: 'RG1',
      Menge: 25,
      MengeAktiv: 25,
      MengeInAktiv: 0,
      Einheit: 'm²',
      Anzahl: 5,
      Reinigungsintervall: 'Täglich',
      ReinigungstageJahr: 250,
      ReinigungstageMonat: 20.83,
      LeistungStunde: 50,
      LeistungStundeIst: 50,
      Aufschlag: 0,
      StundeTag: 0.5,
      StundeMonat: 10.42,
      MengeAktivMonat: 520.75,
      VkWertNettoMonat: 150,
      VkWertBruttoMonat: 178.5,
      RgWertNettoMonat: 135,
      RgWertBruttoMonat: 160.65,
      ReinigungsTage: '',
      Reduzierung: '',
      Bemerkung: '',
      Bereich_ID: 1,
      Gebaeudeteil_ID: 1,
      Etage_ID: 1,
      Reinigungsgruppe_ID: 1,
      Einheit_ID: 1,
      Reinigungsintervall_ID: 1,
      ReinigungsTage_ID: null,
      LfdNr: null,
      xStatus: null,
      xDatum: null,
      xBenutzer: null,
      xVersion: null,
    },
    {
      ID: 2,
      Firma_ID: 1,
      Standort_ID: 1,
      Gebaeude_ID: 1,
      Standort: 'Standort 1',
      Gebaeude: 'Gebäude 1',
      Raumnummer: '102',
      Bereich: 'Konferenz',
      Gebaeudeteil: 'Hauptgebäude',
      Etage: 'EG',
      Bezeichnung: 'Konferenzraum',
      Reinigungsgruppe: 'RG2',
      Menge: 40,
      MengeAktiv: 40,
      MengeInAktiv: 0,
      Einheit: 'm²',
      Anzahl: 5,
      Reinigungsintervall: 'Täglich',
      ReinigungstageJahr: 250,
      ReinigungstageMonat: 20.83,
      LeistungStunde: 50,
      LeistungStundeIst: 50,
      Aufschlag: 0,
      StundeTag: 0.8,
      StundeMonat: 16.67,
      MengeAktivMonat: 833.2,
      VkWertNettoMonat: 250,
      VkWertBruttoMonat: 297.5,
      RgWertNettoMonat: 225,
      RgWertBruttoMonat: 267.75,
      ReinigungsTage: '',
      Reduzierung: '',
      Bemerkung: '',
      Bereich_ID: 2,
      Gebaeudeteil_ID: 1,
      Etage_ID: 1,
      Reinigungsgruppe_ID: 2,
      Einheit_ID: 1,
      Reinigungsintervall_ID: 1,
      ReinigungsTage_ID: null,
      LfdNr: null,
      xStatus: null,
      xDatum: null,
      xBenutzer: null,
      xVersion: null,
    },
  ];

  const mockSummary: RaumbuchSummary = {
    totalRooms: 2,
    totalMenge: 65,
    totalMengeAktivMonat: 1353.95,
    totalVkWertNettoMonat: 400,
    totalVkWertBruttoMonat: 476,
    totalRgWertNettoMonat: 360,
    totalRgWertBruttoMonat: 428.4,
    totalStundenMonat: 27.09,
  };

  const mockVisualizationData: VisualizationData = {
    bereichData: {
      Buero: 25, // Changed from 'Büro'
      Konferenz: 40,
    },
    rgData: {
      RG1: 150,
      RG2: 250,
    },
    etageData: {
      EG: 27.09,
    },
  };

  const mockFilterOptions = {
    bereiche: ['Buero', 'Konferenz'], // Changed from 'Büro'
    gebaeudeteil: ['Hauptgebäude'],
    etage: ['EG'],
    reinigungsgruppe: ['RG1', 'RG2'], // Changed from 'rg'
  };

  const mockAPIResponse = {
    data: mockRaumbuchData,
    summary: mockSummary,
    visualizationData: mockVisualizationData,
    filterOptions: mockFilterOptions,
  };

  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Clean up after all tests
  afterAll(() => {
    global.fetch = originalFetch;
  });

  test('Lädt Raumbuch-Daten erfolgreich', async () => {
    // Setup mock
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAPIResponse),
      })
    );

    // Hook rendern mit einer gültigen Standort-ID
    const { result } = renderHook(() => useRaumbuchData(1));

    // Anfangs sollte isLoading true sein und keine Daten vorhanden sein
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();

    // Warten, bis der Hook die Daten geladen hat
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Überprüfen, ob die Daten korrekt geladen wurden
    expect(result.current.data).toEqual(mockRaumbuchData);
    expect(result.current.summary).toEqual(mockSummary);
    expect(result.current.visualizationData).toEqual(mockVisualizationData);
    expect(result.current.filterOptions).toEqual(mockFilterOptions);
    expect(result.current.error).toBeNull();

    // Überprüfen, ob die API mit den richtigen Parametern aufgerufen wurde
    expect(global.fetch).toHaveBeenCalledWith(`/api/raumbuch/1`);
  });

  test('Behandelt Filteroption korrekt', async () => {
    // Setup mock
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAPIResponse),
      })
    );

    // Hook rendern mit einer Standort-ID und Filterabfrage
    const { result } = renderHook(() => useRaumbuchData(1, 'bereich=Buero&etage=EG'));

    // Warten, bis der Hook die Daten geladen hat
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Überprüfen, ob die API mit den richtigen Parametern aufgerufen wurde
    expect(global.fetch).toHaveBeenCalledWith(`/api/raumbuch/1?bereich=Buero&etage=EG`);
    expect(result.current.data).toEqual(mockRaumbuchData);
  });

  test('Behandelt API-Fehler korrekt', async () => {
    // Setup mock with error status
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })
    );

    // Hook rendern mit einer gültigen Standort-ID
    const { result } = renderHook(() => useRaumbuchData(1));

    // Warten, bis der Hook den Fehler festgestellt hat
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Überprüfen, ob der Fehler korrekt gesetzt wurde
    expect(result.current.error).toBe('Fehler beim Abrufen der Daten: 500 Internal Server Error');
    expect(result.current.data).toEqual([]);
    expect(result.current.summary).toBeNull();
    expect(result.current.visualizationData).toBeNull();
  });

  test('Behandelt Netzwerkfehler korrekt', async () => {
    // Setup mock
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error('Network Error'))
    );

    // Hook rendern mit einer gültigen Standort-ID
    const { result } = renderHook(() => useRaumbuchData(1));

    // Warten, bis der Hook den Fehler festgestellt hat
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Überprüfen, ob der Fehler korrekt gesetzt wurde
    expect(result.current.error).toBe('Network Error');
    expect(result.current.data).toEqual([]);
  });

  test('Behandelt JSON-Parsing-Fehler korrekt', async () => {
    // Setup mock with JSON parse error
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })
    );

    // Hook rendern mit einer gültigen Standort-ID
    const { result } = renderHook(() => useRaumbuchData(1));

    // Warten, bis der Hook den Fehler festgestellt hat
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Überprüfen, ob der Fehler korrekt gesetzt wurde
    expect(result.current.error).toBe('Invalid JSON');
    expect(result.current.data).toEqual([]);
  });

  test('Macht keine Anfrage, wenn keine Standort-ID bereitgestellt wird', async () => {
    // Hook rendern ohne Standort-ID
    const { result } = renderHook(() => useRaumbuchData(0));

    // Warten, bis der Hook den Ladevorgang abgeschlossen hat
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Überprüfen, ob keine API-Anfrage gemacht wurde
    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.data).toEqual([]);
  });

  // Korrigierter Test mit korrekter Typdefinition
  test('Aktualisiert Daten bei Änderung der Standort-ID', async () => {
    // Setup mocks with different results for sequential calls
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              ...mockAPIResponse,
              data: [mockRaumbuchData[0]],
            }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              ...mockAPIResponse,
              data: [mockRaumbuchData[1]],
            }),
        })
      );

    // Korrekte Typdefinition für die Props
    type HookProps = {
      standortId: number;
      filterQuery?: string;
    };

    // Hook mit anfänglichem Prop rendern
    const { result, rerender } = renderHook(
      (props: HookProps) => useRaumbuchData(props.standortId, props.filterQuery),
      { initialProps: { standortId: 1 } as HookProps }
    );

    // Warten, bis der Hook die Daten für die erste ID geladen hat
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Überprüfen, ob die ersten Daten korrekt geladen wurden
    expect(result.current.data).toEqual([mockRaumbuchData[0]]);
    expect(global.fetch).toHaveBeenCalledWith(`/api/raumbuch/1`);

    // Hook mit neuer ID neu rendern (mit expliziter Typdefinition)
    rerender({ standortId: 2 } as HookProps);

    // Überprüfen, ob isLoading wieder auf true gesetzt wurde
    expect(result.current.isLoading).toBe(true);

    // Warten, bis der Hook die Daten für die zweite ID geladen hat
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Überprüfen, ob die neuen Daten geladen wurden
    expect(result.current.data).toEqual([mockRaumbuchData[1]]);
    expect(global.fetch).toHaveBeenCalledWith(`/api/raumbuch/2`);
  });

  // Korrigierter Test mit korrekter Typdefinition
  test('Aktualisiert Daten bei Änderung der Filterabfrage', async () => {
    // Setup mocks with different results for sequential calls
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAPIResponse),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              ...mockAPIResponse,
              data: [mockRaumbuchData[0]],
            }),
        })
      );

    // Korrekte Typdefinition für die Props
    type HookProps = {
      standortId: number;
      filterQuery?: string;
    };

    // Hook mit anfänglichem Prop rendern
    const { result, rerender } = renderHook(
      (props: HookProps) => useRaumbuchData(props.standortId, props.filterQuery),
      { initialProps: { standortId: 1 } as HookProps }
    );

    // Warten, bis der Hook die Daten ohne Filter geladen hat
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Überprüfen, ob die ungefilteren Daten korrekt geladen wurden
    expect(result.current.data).toEqual(mockRaumbuchData);
    expect(global.fetch).toHaveBeenCalledWith(`/api/raumbuch/1`);

    // Hook mit Filter neu rendern (mit expliziter Typdefinition)
    rerender({ standortId: 1, filterQuery: 'bereich=Buero' } as HookProps);

    // Überprüfen, ob isLoading wieder auf true gesetzt wurde
    expect(result.current.isLoading).toBe(true);

    // Warten, bis der Hook die gefilterten Daten geladen hat
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Überprüfen, ob die gefilterten Daten geladen wurden
    expect(result.current.data).toEqual([mockRaumbuchData[0]]);
    expect(global.fetch).toHaveBeenCalledWith(`/api/raumbuch/1?bereich=Buero`);
  });
});
