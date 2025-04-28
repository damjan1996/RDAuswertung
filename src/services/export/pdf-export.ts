/**
 * Service zum Exportieren von Raumbuch-Daten nach PDF
 */

import handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';

import { formatCurrency, formatHours, formatNumber, formatSquareMeters } from '@/lib/formatters';

import type { RaumbuchRow, RaumbuchSummary, VisualizationData } from '@/types/raumbuch.types';

// Use RaumbuchRow as RaumbuchEntry for consistency with the rest of the code
type RaumbuchEntry = RaumbuchRow;

// Maximale Anzahl von Einträgen pro Seite für Tabellen
const MAX_ITEMS_PER_PAGE = 30;

// Interface für die Chart-Daten-Parameter
interface ChartParam {
  summary: RaumbuchSummary;
  visualizationData?: VisualizationData;
}

/**
 * Erzeugt eine PDF-Datei mit Raumbuch-Daten und Visualisierungen
 *
 * @param data - Raumbuch-Einträge
 * @param standortName - Name des Standorts
 * @param chartParams - Optionale Parameter für Charts und Zusammenfassung
 * @returns Buffer mit der PDF-Datei
 */
export async function generatePdf(
  data: RaumbuchEntry[],
  standortName: string,
  chartParams?: ChartParam
): Promise<Uint8Array> {
  try {
    // Formatierte Daten für die Tabelle vorbereiten
    const formattedData = data.map(item => ({
      ...item,
      Menge: formatSquareMeters(item.Menge),
      ReinigungstageJahr: formatNumber(item.ReinigungstageJahr),
      ReinigungstageMonat: formatNumber(item.ReinigungstageMonat),
      MengeAktivMonat: formatSquareMeters(item.MengeAktivMonat),
      VkWertNettoMonat: formatCurrency(item.VkWertNettoMonat),
      StundeTag: formatHours(item.StundeTag, 3),
      StundeMonat: formatHours(item.StundeMonat),
      VkWertNettoJahr: formatCurrency(item.VkWertNettoMonat ? item.VkWertNettoMonat * 12 : 0),
      LeistungStunde: formatNumber(item.LeistungStunde),
    }));

    // Formatierte Zusammenfassungsdaten
    const formattedSummary = chartParams?.summary
      ? {
          totalRooms: chartParams.summary.totalRooms,
          totalMenge: formatSquareMeters(chartParams.summary.totalMenge),
          totalMengeAktivMonat: formatSquareMeters(chartParams.summary.totalMengeAktivMonat),
          totalVkWertNettoMonat: formatCurrency(chartParams.summary.totalVkWertNettoMonat),
          totalVkWertNettoJahr: formatCurrency(chartParams.summary.totalVkWertNettoMonat * 12),
          totalStundenMonat: formatHours(chartParams.summary.totalStundenMonat),
        }
      : null;

    // Generieren des HTML-Templates
    const htmlContent = await generateHtmlTemplate(
      formattedData,
      standortName,
      formattedSummary,
      chartParams?.visualizationData
    );

    // PDF mit Puppeteer erzeugen
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Erzeugen von Chart-Bildern, falls Visualisierungsdaten vorhanden sind
    if (chartParams?.visualizationData) {
      await generateCharts(page, chartParams.visualizationData);
    }

    // PDF erzeugen
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm',
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="width: 100%; font-size: 10px; padding: 0 15mm; display: flex; justify-content: space-between; margin-top: 10px;">
          <div>Ritter Digital Raumbuch Auswertung</div>
          <div>${standortName}</div>
          <div>Datum: ${new Date().toLocaleDateString('de-DE')}</div>
        </div>
      `,
      footerTemplate: `
        <div style="width: 100%; font-size: 10px; padding: 0 15mm; display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div>© Ritter Digital</div>
          <div>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></div>
        </div>
      `,
    });

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    console.error('Fehler beim PDF-Export:', error);
    throw error;
  }
}

/**
 * Erzeugt das HTML-Template für das PDF-Dokument
 *
 * @param data - Formatierte Raumbuch-Einträge
 * @param standortName - Name des Standorts
 * @param summary - Formatierte Zusammenfassung
 * @param visualizationData - Daten für Visualisierungen
 * @returns HTML-String für das PDF
 */
async function generateHtmlTemplate(
  data: Record<string, unknown>[],
  standortName: string,
  summary: Record<string, unknown> | null,
  visualizationData?: VisualizationData
): Promise<string> {
  // Handlebars-Template definieren
  const templateString = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Raumbuch Auswertung - {{standortName}}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        h1, h2, h3 {
          color: #003366;
          margin-top: 20px;
        }
        .container {
          max-width: 100%;
          margin: 0 auto;
          padding: 10px;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }
        .summary-box {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 15px;
          text-align: center;
        }
        .summary-box h3 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .summary-box .value {
          font-size: 18px;
          font-weight: bold;
          color: #003366;
        }
        .charts-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 20px;
        }
        .chart-box {
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 10px;
          height: 300px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 10px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #003366;
          color: white;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        .text-right {
          text-align: right;
        }
        .page-break {
          page-break-after: always;
        }
        .chart-placeholder {
          background-color: #f8f8f8;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed #ccc;
        }
      </style>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
      <div class="container">
        <h1>Raumbuch Auswertung - {{standortName}}</h1>
        
        {{#if summary}}
        <h2>Zusammenfassung</h2>
        <div class="summary-grid">
          <div class="summary-box">
            <h3>Anzahl Räume</h3>
            <div class="value">{{summary.totalRooms}}</div>
          </div>
          <div class="summary-box">
            <h3>Gesamtfläche</h3>
            <div class="value">{{summary.totalMenge}}</div>
          </div>
          <div class="summary-box">
            <h3>Monatlicher Wert</h3>
            <div class="value">{{summary.totalVkWertNettoMonat}}</div>
          </div>
          <div class="summary-box">
            <h3>Jährlicher Wert</h3>
            <div class="value">{{summary.totalVkWertNettoJahr}}</div>
          </div>
          <div class="summary-box">
            <h3>Arbeitsstunden/Monat</h3>
            <div class="value">{{summary.totalStundenMonat}}</div>
          </div>
        </div>
        {{/if}}
        
        {{#if hasVisualizationData}}
        <h2>Visualisierungen</h2>
        <div class="charts-container">
          <div class="chart-box">
            <h3>Quadratmeter nach Bereich</h3>
            <div>
              <canvas id="bereichChart"></canvas>
            </div>
          </div>
          <div class="chart-box">
            <h3>Wert pro Monat nach Reinigungsgruppe</h3>
            <div>
              <canvas id="rgChart"></canvas>
            </div>
          </div>
        </div>
        {{/if}}
        
        <h2>Raumbuch-Daten</h2>
        {{#each dataPages}}
          <table>
            <thead>
              <tr>
                <th>Raumnr.</th>
                <th>Bereich</th>
                <th>Gebäudeteil</th>
                <th>Etage</th>
                <th>Bezeichnung</th>
                <th>RG</th>
                <th>m²</th>
                <th>€/Monat</th>
                <th>h/Monat</th>
                <th>€/Jahr</th>
              </tr>
            </thead>
            <tbody>
              {{#each this}}
              <tr>
                <td>{{this.Raumnummer}}</td>
                <td>{{this.Bereich}}</td>
                <td>{{this.Gebaeudeteil}}</td>
                <td>{{this.Etage}}</td>
                <td>{{this.Bezeichnung}}</td>
                <td>{{this.Reinigungsgruppe}}</td>
                <td class="text-right">{{this.Menge}}</td>
                <td class="text-right">{{this.VkWertNettoMonat}}</td>
                <td class="text-right">{{this.StundeMonat}}</td>
                <td class="text-right">{{this.VkWertNettoJahr}}</td>
              </tr>
              {{/each}}
            </tbody>
          </table>
          {{#unless @last}}
          <div class="page-break"></div>
          {{/unless}}
        {{/each}}
      </div>
      
      {{#if hasVisualizationData}}
      <script>
        // Chart-Daten werden später vom Puppeteer-Script ausgefüllt
        window.chartData = {
          bereich: [],
          rg: []
        };
        
        // Funktion zum Zeichnen der Charts wird später vom Puppeteer-Script aufgerufen
        function drawCharts() {
          // Implementierung erfolgt durch Puppeteer
        }
      </script>
      {{/if}}
    </body>
    </html>
  `;

  // Handlebars-Template kompilieren
  const template = handlebars.compile(templateString);

  // Daten in Seiten aufteilen
  const dataPages = [];
  for (let i = 0; i < data.length; i += MAX_ITEMS_PER_PAGE) {
    dataPages.push(data.slice(i, i + MAX_ITEMS_PER_PAGE));
  }

  // Template-Kontext erzeugen
  const context = {
    standortName,
    summary,
    dataPages,
    hasVisualizationData:
      visualizationData &&
      (Object.keys(visualizationData.bereichData || {}).length > 0 ||
        Object.keys(visualizationData.rgData || {}).length > 0),
  };

  // HTML-Template rendern
  return template(context);
}

/**
 * Erzeugt Chart-Bilder in der PDF-Seite
 *
 * @param page - Puppeteer-Seite
 * @param visualizationData - Daten für Visualisierungen
 */
async function generateCharts(
  page: puppeteer.Page,
  visualizationData: VisualizationData
): Promise<void> {
  // Chart.js-Skript für die Browser-Umgebung
  await page.evaluate((data: VisualizationData) => {
    // Bereich-Chart (Tortendiagramm)
    if (data.bereichData && Object.keys(data.bereichData).length > 0) {
      const bereichCtx = document.getElementById('bereichChart') as HTMLCanvasElement;
      if (bereichCtx) {
        const labels = Object.keys(data.bereichData);
        const values = Object.values(data.bereichData);

        // Zufällige Farben für die Chart-Segmente generieren
        const getRandomColor = () => {
          const letters = '0123456789ABCDEF';
          let color = '#';
          for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        };

        const backgroundColors = labels.map(() => getRandomColor());

        // @ts-expect-error Chart.js wird zur Laufzeit geladen und ist in der TypeScript-Umgebung nicht bekannt
        new window.Chart(bereichCtx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [
              {
                data: values,
                backgroundColor: backgroundColors,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  boxWidth: 12,
                  padding: 10,
                  font: {
                    size: 10,
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context: { parsed: number; label: string }) {
                    const value = context.parsed;
                    const label = context.label || '';
                    return `${label}: ${value.toFixed(2)} m²`;
                  },
                },
              },
            },
          },
        });
      }
    }

    // RG-Chart (Balkendiagramm)
    if (data.rgData && Object.keys(data.rgData).length > 0) {
      const rgCtx = document.getElementById('rgChart');
      if (rgCtx) {
        const labels = Object.keys(data.rgData);
        const values = Object.values(data.rgData);

        // @ts-expect-error Chart.js wird zur Laufzeit geladen und ist in der TypeScript-Umgebung nicht bekannt
        new window.Chart(rgCtx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Wert pro Monat',
                data: values,
                backgroundColor: 'rgba(240, 140, 0, 0.7)',
                borderColor: 'rgba(217, 126, 0, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  font: {
                    size: 10,
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context: { parsed: { y: number } }) {
                    const value = context.parsed.y;
                    return `${value.toFixed(2)} €`;
                  },
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  font: {
                    size: 10,
                  },
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  font: {
                    size: 10,
                  },
                  callback: function (value: number) {
                    return value + ' €';
                  },
                },
              },
            },
          },
        });
      }
    }
  }, visualizationData);

  // Use evaluate with setTimeout instead of waitForTimeout
  await page.evaluate(() => {
    return new Promise(resolve => setTimeout(resolve, 1000));
  });
}
